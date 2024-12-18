// components/ConsultationList.tsx

'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import AudioRecorder from './AudioRecorder'; // Reuse your existing AudioRecorder component

interface Consultation {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  recordings: Recording[];
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

const ConsultationList: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Assuming you have a GET /consultations endpoint to fetch all consultations
      const response = await axios.get(`${apiUrl}/consultations`);

      setConsultations(response.data.consultations);
    } catch (error: any) {
      console.error('Error fetching consultations:', error);
      alert('Failed to fetch consultations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Consultations</h2>
      {isLoading ? (
        <p>Loading consultations...</p>
      ) : (
        <div>
          {consultations.length === 0 ? (
            <p>No consultations found.</p>
          ) : (
            consultations.map((consultation) => (
              <div key={consultation.id} className="mb-6 p-4 border rounded-md">
                <h3 className="text-xl font-medium mb-2">{consultation.title}</h3>
                <p className="text-gray-700 mb-4">{consultation.description}</p>
                <p className="text-sm text-gray-500 mb-2">Created At: {new Date(consultation.created_at).toLocaleString()}</p>

                {/* Upload Recording */}
                <AudioRecorder consultationId={consultation.id} />

                {/* List Recordings */}
                {consultation.recordings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Recordings:</h4>
                    <ul className="list-disc list-inside">
                      {consultation.recordings.map((recording) => (
                        <li key={recording.id} className="mb-2">
                          <p><strong>Filename:</strong> {recording.filename}</p>
                          <audio src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${recording.filepath}`} controls className="w-full mb-2" />
                          <p><strong>Transcription:</strong> {recording.transcription.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationList;
