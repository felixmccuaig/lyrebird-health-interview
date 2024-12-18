// pages/index.tsx

'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import CreateConsultationModal from '../components/CreateConsultationModal';

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

const Home: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/consultations`);

      setConsultations(response.data.consultations);

      // If no consultation is selected, select the first one by default
      if (selectedConsultationId === null && response.data.consultations.length > 0) {
        setSelectedConsultationId(response.data.consultations[0].id);
      }
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

  const handleSelectConsultation = (id: number) => {
    setSelectedConsultationId(id);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConsultationCreated = () => {
    fetchConsultations();
  };

  const selectedConsultation = consultations.find((c) => c.id === selectedConsultationId) || null;

  return (
    <div>
      <Head>
        <title>Consultation Manager</title>
        <meta name="description" content="Manage your consultations with audio recordings and transcriptions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          consultations={consultations}
          selectedConsultationId={selectedConsultationId}
          onSelect={handleSelectConsultation}
          onOpenModal={handleOpenModal}
        />

        {/* Main Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p>Loading consultations...</p>
          </div>
        ) : (
          <MainContent consultation={selectedConsultation} />
        )}
      </div>

      {/* Create Consultation Modal */}
      <CreateConsultationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleConsultationCreated}
      />
    </div>
  );
};

export default Home;
