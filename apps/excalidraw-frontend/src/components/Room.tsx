'use client';

import React, { useState } from 'react';
import CreateRoomForm from './CreateRoom';
import JoinRoomForm from './JoinRoom';

const RoomNavigation = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-foreground p-6 rounded-lg shadow-lg">
        {/* Navigation Tabs */}
        <div className="flex justify-around  mb-4">
          <button
            onClick={() => setActiveTab('create')}
            className={`w-1/2 py-2 text-center font-medium ${
              activeTab === 'create'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`w-1/2 py-2 text-center font-medium ${
              activeTab === 'join'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500'
            }`}
          >
            Join Room
          </button>
        </div>

        {activeTab === 'create' ? <CreateRoomForm /> : <JoinRoomForm />}
      </div>
    </div>
  );
};

export default RoomNavigation;
