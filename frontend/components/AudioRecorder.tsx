// components/AudioRecorder.tsx

'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface AudioRecorderProps {
  consultationId: number;
}

interface UploadResponse {
  message: string;
  recording: {
    id: number;
    filename: string;
    filepath: string;
    mimetype: string;
    size: number;
    created_at: string;
    updated_at: string;
  };
  transcription: {
    id: number;
    text: string;
    created_at: string;
    updated_at: string;
  };
}

interface MediaDeviceInfoExtended extends MediaDeviceInfo {
  label: string; // Ensures labels are available
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ consultationId }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfoExtended[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchAudioDevices = async () => {
      try {
        // Requesting microphone access to ensure device labels are available
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = allDevices.filter(
          (device) => device.kind === 'audioinput'
        ) as MediaDeviceInfoExtended[];

        setDevices(audioInputDevices);

        // Set default device if not already selected
        if (audioInputDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(audioInputDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error fetching audio devices:', err);
        alert('Could not access audio devices. Please check permissions.');
      }
    };

    fetchAudioDevices();
  }, [selectedDeviceId]);

  const handleDeviceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  const startRecording = async () => {
    // Check if the browser supports MediaRecorder
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }

    try {
      // Request access to the selected microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
        },
      });

      // Initialize MediaRecorder with the audio stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Event handler for when data is available
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Event handler for when recording stops
      mediaRecorder.onstop = () => {
        // Create a blob from the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Generate a URL for the audio blob
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access your microphone. Please check permissions and device selection.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!audioURL) {
      alert('No audio recorded to upload.');
      return;
    }

    setIsUploading(true);

    try {
      // Fetch the blob from the audioURL
      const response = await fetch(audioURL);
      const blob = await response.blob();

      // Create a FormData object
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      // Send the POST request to the backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const uploadResponse = await axios.post<UploadResponse>(
        `${apiUrl}/consultations/${consultationId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle successful upload and transcription
      if (uploadResponse.data.transcription) {
        setTranscription(uploadResponse.data.transcription.text);
        alert('Audio uploaded and transcribed successfully!');
        console.log('Upload Response:', uploadResponse.data);
      } else {
        alert('Audio uploaded successfully, but transcription failed.');
      }
    } catch (error: any) {
      if (error.response) {
        alert(`Upload failed: ${error.response.data.error}`);
      } else {
        alert('Failed to upload audio.');
      }
      console.error('Error uploading audio:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded-md">
      <h4 className="text-lg font-medium mb-2">Record & Upload Audio</h4>

      {/* Audio Input Device Selection */}
      <div className="mb-4">
        <label htmlFor="audioDevice" className="block text-sm font-medium text-gray-700 mb-2">
          Select Audio Device:
        </label>
        <select
          id="audioDevice"
          value={selectedDeviceId}
          onChange={handleDeviceChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {devices.length === 0 ? (
            <option value="">No audio devices found</option>
          ) : (
            devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Start/Stop Recording */}
      <div className="mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Stop Recording
          </button>
        )}
      </div>

      {/* Recorded Audio Playback */}
      {audioURL && (
        <div className="mt-4">
          <audio src={audioURL} controls className="w-full mb-2" />
          <div className="flex justify-between items-center">
            <a
              href={audioURL}
              download="recording.wav"
              className="text-blue-500 hover:underline"
            >
              Download Recording
            </a>
            <button
              onClick={uploadAudio}
              className={`px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload to Server'}
            </button>
          </div>
        </div>
      )}

      {/* Display Transcription */}
      {transcription && (
        <div className="mt-4">
          <h5 className="text-md font-medium mb-2">Transcription:</h5>
          <p className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
