// components/ConsultationNotes.tsx

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ConsultationNotesProps {
  notes: ConsultationNote[];
}

interface ConsultationNote {
  id: number;
  generatedContent: string;
  consultationId: number;
  created_at: string;
  updated_at: string;
}

const ConsultationSummary: React.FC<ConsultationNotesProps> = ({ notes }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Consultation Notes:</h3>
      <ul className="space-y-4">
        {notes.map((note) => (
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
            <div className="prose max-w-none">{note.generatedContent}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConsultationSummary;
