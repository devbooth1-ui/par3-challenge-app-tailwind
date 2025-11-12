import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PlayGame() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Go to Order / Payment flow
    navigate('/order');
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Play Game</h1>

      <p className="text-gray-600">
        Get ready to enter the Par3 Challenge on today&apos;s featured hole.
      </p>

      <div className="border rounded px-3 py-2 bg-gray-50">
        <p className="text-sm">
          Entry Fee: <span className="font-semibold">$8</span>
        </p>
        <p className="text-xs text-gray-500">
          You&apos;ll confirm your details and pay on the next screen.
        </p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <Link
          to="/"
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Tee Off
        </Link>

        <button
          type="button"
          onClick={handleContinue}
          className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
