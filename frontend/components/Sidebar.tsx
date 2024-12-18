// components/Sidebar.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface SidebarProps {
  consultations: Consultation[];
  selectedConsultationId: number | null;
  onSelect: (id: number) => void;
  onOpenModal: () => void;
}

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

const Sidebar: React.FC<SidebarProps> = ({ consultations, selectedConsultationId, onSelect, onOpenModal }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Consultations</h2>
        <button
          onClick={onOpenModal}
          className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition"
        >
          + New
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {consultations.map((consultation) => (
          <li
            key={consultation.id}
            onClick={() => onSelect(consultation.id)}
            className={`cursor-pointer p-2 rounded ${
              selectedConsultationId === consultation.id
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            {consultation.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
