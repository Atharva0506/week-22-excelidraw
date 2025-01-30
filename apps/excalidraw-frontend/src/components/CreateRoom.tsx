'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRoomScheam } from '@repo/common/types';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { getCookie } from '@/lib/cookie';

const CreateRoomForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = CreateRoomScheam.safeParse({ name });

    if (!parsed.success) {
      setError('Invalid room name');
      return;
    }

    const token = getCookie('token');
    if (!token) {
      setError('Unauthorized: No token found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/room/create`,
        { name, isPrivate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        router.push(`/canvas/${response.data.roomId}`);
      }
    } catch (err) {
      setError('Error creating room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateRoom}
      className="w-full max-w-sm bg-foreground p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-center bg-foreground mb-4 text-primary">Create a Room</h2>
      {error && <div className="text-red-500 text-sm mb-2 bg-foreground">{error}</div>}
      <div className="mb-4 bg-foreground">
        <label htmlFor="name" className="block bg-foreground text-primary">Room Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border bg-foreground text-primary  border-gray-300 rounded mt-2"
          required
        />
      </div>
      <div className="mb-4 bg-foreground">
        <label className="text-primary inline-flex items-center bg-foreground">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mr-2 bg-foreground text-primary "
          />
          Private Room
        </label>
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 bg-primary text-foreground rounded-md font-medium hover:bg-opacity-90 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Room'}
      </button>
    </form>
  );
};

export default CreateRoomForm;
