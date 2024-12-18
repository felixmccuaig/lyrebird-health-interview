// components/CreateConsultation.tsx

'use client';

import { useState } from 'react';
import axios from 'axios';

interface CreateConsultationProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CreateConsultation: React.FC<CreateConsultationProps> = ({ onSuccess, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/consultations`, { title, description });

      alert('Consultation created successfully!');
      console.log('Create Consultation Response:', response.data);

      // Reset form
      setTitle('');
      setDescription('');

      // Execute success callback
      onSuccess();

      // Close the modal
      onClose();
    } catch (error: any) {
      console.error('Error creating consultation:', error);
      alert('Failed to create consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title:
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter consultation title"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter consultation description"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Consultation'}
      </button>
    </form>
  );
};

export default CreateConsultation;
