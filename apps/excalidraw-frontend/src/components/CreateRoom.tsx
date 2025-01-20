"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRoomScheam } from '@repo/common/types';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { getCookie } from '@/utils/cookie';
const CreateRoomForm = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  
    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const parsed = CreateRoomScheam.safeParse({ name });
        
        if (!parsed.success) {
          setError('Invalid room name');
          return;
        }
    
        
        const token = getCookie('token')
        console.log(token)
        if (!token) {
          setError('Unauthorized: No token found');
          return;
        }
    
        setIsLoading(true);
        try {
          const response = await axios.post(
            `${BACKEND_URL}/room/create`, 
            { name },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (response.status === 201) {
            console.log(response.data.roomId)
            router.push(`/canvas/${response.data.roomId}`);
          }
        } catch (err) {
          setError('Error creating room');
        } finally {
          setIsLoading(false);
        }
      };
  
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <form
          onSubmit={handleCreateRoom}
          className='w-full max-w-sm bg-foreground p-6 rounded-lg shadow-lg '
        >
          <h2 className='text-xl font-semibold text-center mb-4 text-primary'>Create a Room</h2>
          {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
          
          <div className='mb-4'>
            <label htmlFor='name' className='block text-primary'>Room Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded mt-2'
              required
            />
          </div>
          
          <button
            type='submit'
            className={`w-full py-2 px-4 bg-primary text-foreground rounded-md font-medium hover:bg-opacity-90 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </div>
    );
  };
  
export default CreateRoomForm