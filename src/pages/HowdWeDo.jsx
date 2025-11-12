import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function HowdWeDo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const result = searchParams.get('result') || '';
  const score = searchParams.get('score') || '';

  const handleGoToAwards = () => {
    navigate('/awards');
  };

  const handleBackToPlay = () => {
    navigate('/play');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">How’d We Do?</h1>

      {result || score ? (
        <div className="space-y-1">
          {result && (
            <p className="text-lg">
              Result: <span className="font-semibold">{result}</span>
            </p>
          )}
          {score && (
            <p className="text-lg">
              Score: <span className="font-semibold">{score}</span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-600">
          We’ll show your result here once your round is complete.
        </p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={handleBackToPlay}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Back to Play
        </button>

        <button
          type="button"
          onClick={handleGoToAwards}
          className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Go to Awards
        </button>
      </div>
    </div>
  );
}
