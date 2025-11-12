import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TeeOff() {
  const navigate = useNavigate();

  const handleStart = () => {
    // Go to Play Game or Payment depending on your flow
    navigate('/play');
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">
        Let&apos;s Play Today
      </h1>
      <p className="text-gray-600 text-center max-w-md">
        Tap below to tee off and start your Par3 Challenge round.
      </p>

      <button
        type="button"
        onClick={handleStart}
        className="px-6 py-3 rounded-full bg-emerald-600 text-white text-lg font-medium hover:bg-emerald-700"
      >
        Tee It Up
      </button>

      <div className="mt-4">
        <Link to="/terms" className="text-xs text-gray-500 hover:underline">
          Terms &amp; Conditions
        </Link>
      </div>
    </div>
  );
}
