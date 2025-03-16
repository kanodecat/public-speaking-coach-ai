import React from "react";
import { FiX, FiCheck } from "react-icons/fi";

export default function page() {
  return (
    <div className="h-screen bg-gray-100">
      <div>
        <p className="text-3xl p-2">AI Public Speaking Coach</p>
      </div>
      <div className="flex justify-center place-content-center">
        <div className="bg-white p-10 rounded-lg shadow-lg flex gap-10 place-items-center">
          {/* Score Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Your Score</h2>
            <div className="w-32 h-32 flex items-center justify-center text-4xl font-bold bg-gray-200 rounded-full">
              86
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3">
                  <FiCheck />
                </span>
                You got less than 3 filler words
              </li>
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3">
                  <FiX />
                </span>
                Your tone was too monotone
              </li>
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3">
                  <FiX />
                </span>
                You talked too fast
              </li>
              <li className="flex items-center bg-white rounded-lg shadow p-3">
                <span className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3">
                  <FiCheck />
                </span>
                You talked loud enough
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
