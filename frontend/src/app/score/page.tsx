"use client"
import React from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { useSearchParams } from 'next/navigation';


export default function page() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const fillerCount = searchParams.get('filler_count');
  const fillerMessage = searchParams.get('filler_message');
  const fillerStatus = searchParams.get('filler_status');
  const speedMessage = searchParams.get('speed_message');
  const speedStatus = searchParams.get('speed_status');
  const wpm = searchParams.get('wpm');
  const toneMessage = searchParams.get('tone_message');
  const toneStatus = searchParams.get('tone_status');
  const volumeMessage = searchParams.get('volume_message');
  const volumeStatus = searchParams.get('volume_status');

  return (
    <div className="h-screen bg-gray-100">
      <div>
        <p className="text-3xl p-2">AI Public Speaking Coach</p>
      </div>
      <div className="flex justify-center place-content-center">
        <div className="bg-white p-10 rounded-lg shadow-lg flex gap-10 place-items-center">
          {/* Score Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Your score is: </h2>
            <div className="w-32 h-32 flex items-center justify-center text-4xl font-bold bg-gray-200 rounded-full">
            {score}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3">
                  <FiCheck />
                </span>
                You got {fillerCount} filler words
              </li>
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3">
                  <FiX />
                </span>
                {toneMessage}
              </li>
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3">
                  <FiX />
                </span>
                {speedMessage}
              </li>
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3">
                  <FiCheck />
                </span>
                {volumeMessage}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
