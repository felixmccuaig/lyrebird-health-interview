// components/MainContent.tsx

'use client';

import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import Notes from './Notes';
import axios from 'axios';

interface MainContentProps {
  consultation: Consultation | null;
}

interface Consultation {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  recordings: Recording[];
  consultationNotes?: ConsultationNote[];
}

interface Recording {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  created_at: string;
  updated_at: string;
  transcription: Transcription;
}

interface Transcription {
  id: number;
  text: string;
  created_at: string;
  updated_at: string;
}

interface ConsultationNote {
  id: number;
  generatedContent: string;
  consultationId: number;
  created_at: string;
  updated_at: string;
}

const MainContent: React.FC<MainContentProps> = ({ consultation }) => {
  const [consultationNotes, setConsultationNotes] = useState<ConsultationNote[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateConsultationNotes = async () => {
    if (!consultation) return;

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/consultations/${consultation.id}/generate-notes`);

      if (response.data.consultationNote) {
        setConsultationNotes((prev) => [...(prev || []), response.data.consultationNote]);
        alert('Consultation notes generated successfully!');
      }
    } catch (err: any) {
      console.error('Error generating consultation notes:', err);
      setError('Failed to generate consultation notes.');
      alert('Failed to generate consultation notes.');
    } finally {
      setLoading(false);
    }
  };

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a consultation from the sidebar to view details.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-2">{consultation.title}</h2>
      <p className="text-gray-700 mb-4">{consultation.description}</p>
      <p className="text-sm text-gray-500 mb-6">Created At: {new Date(consultation.created_at).toLocaleString()}</p>

      {/* Notes Component */}
      <Notes consultationId={consultation.id} />

      {/* Audio Recorder */}
      <AudioRecorder consultationId={consultation.id} />

      {/* Generate Consultation Notes Button */}
      <div className="mt-6">
        <button
          onClick={generateConsultationNotes}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Consultation Notes'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Consultation Notes Section */}
      {consultationNotes && consultationNotes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Consultation Notes:</h3>
          <ul className="space-y-4">
            {consultationNotes.map((note) => (
              <li key={note.id} className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Note #{note.id}</span>
                  <a
                    href="#"
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      // Implement download or view functionality
                      // For example, open in a new tab or download as PDF
                      const blob = new Blob([note.generatedContent], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `ConsultationNote_${note.id}.md`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recordings List */}
      {consultation.recordings.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Recordings:</h3>
          <ul className="space-y-4">
            {consultation.recordings.map((recording) => (
              <li key={recording.id} className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{recording.filename}</span>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${recording.filepath}`}
                    download={recording.filename}
                    className="text-blue-500 hover:underline"
                  >
                    Download
                  </a>
                </div>
                <audio src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${recording.filepath}`} controls className="w-full mb-2" />
                <div>
                  <h4 className="font-medium">Transcription:</h4>
                  <p className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md">{recording.transcription.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainContent;
