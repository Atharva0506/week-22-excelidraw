"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { getCookie } from "@/utils/cookie";

const JoinRoomForm = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const handleJoinRoom = async (identifier: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/room/get-slug/${identifier}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data.roomId) {
        router.push(`/canvas/${response.data.roomId}`);
      }
    } catch (err) {
        setError(err.response?.data?.error)
      console.error(
        "Error joining room:",
        err.response?.data?.error || "Unknown error"
      );
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleJoinRoom(identifier);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-foreground p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-center mb-4 text-primary">
        Join a Room
      </h2>
      <div className="mb-4">
        <label htmlFor="roomId" className="block text-primary">
          Room Name
        </label>
        <input
          type="text"
          id="roomId"
          name="roomId"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          required
          />
      </div>
      {error && <div className="text-red-500 text-base mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-foreground rounded-md font-medium hover:bg-opacity-90"
        >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomForm;
