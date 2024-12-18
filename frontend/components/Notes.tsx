// components/Notes.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface NotesProps {
  consultationId: number;
}

interface Note {
  id: number;
  content: string;
  consultationId: number;
  created_at: string;
  updated_at: string;
}

const Notes: React.FC<NotesProps> = ({ consultationId }) => {
  const [note, setNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(5); // Countdown timer in seconds
  const [showSavedMessage, setShowSavedMessage] = useState<boolean>(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch the existing note on component mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/notes/${consultationId}`);
        setNote(response.data.note);
      } catch (err: any) {
        console.error('Error fetching note:', err);
        setError('Failed to load notes.');
      }
    };

    fetchNote();
  }, [consultationId]);

  // Function to save the note to the backend
  const saveNote = useCallback(async () => {
    if (!note) return;
    setIsSaving(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/notes/${consultationId}`, { content: note.content });
      setNote(response.data.note);
      setShowSavedMessage(true);

      // Hide the saved message after 2 seconds
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 2000);
    } catch (err: any) {
      console.error('Error saving note:', err);
      setError('Failed to save notes.');
    } finally {
      setIsSaving(false);
    }
  }, [consultationId, note]);

  // Function to handle textarea changes
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setNote(prev => (prev ? { ...prev, content } : prev));

    // Reset the countdown timer
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setTimeLeft(5);

    // Start the countdown
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current as NodeJS.Timeout);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set a timeout to save the note after 5 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveNote();
      setTimeLeft(5); // Reset timer after saving
    }, 5000);
  };

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!note) {
    return <p>Loading notes...</p>;
  }

  return (
    <div className="mb-4 p-4 border rounded-md">
      <h4 className="text-lg font-medium mb-2">Notes</h4>
      
      <textarea
        value={note.content}
        onChange={handleTextareaChange}
        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Write your notes in markdown..."
      ></textarea>
      
      <div className="mt-2 flex items-center">
        {isSaving && <span className="text-sm text-blue-500">Saving...</span>}
        {!isSaving && timeLeft > 0 && (
          <span className="text-sm text-gray-500">Saving in {timeLeft} second{timeLeft !== 1 ? 's' : ''}...</span>
        )}
        {!isSaving && timeLeft === 0 && showSavedMessage && (
          <span className="text-sm text-green-500">All changes saved.</span>
        )}
      </div>
    </div>
  );
};

export default Notes;
