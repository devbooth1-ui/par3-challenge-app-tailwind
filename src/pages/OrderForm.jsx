import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // After order details are confirmed, go to the Payment screen
    navigate('/payment');
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Par3 Challenge Order</h1>

      <p className="text-gray-600">
        Confirm your Par3 Challenge entry details below. You&apos;ll complete payment on the next screen.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Player Name
          </label>
          <input
            type="text"
            name="playerName"
            className="w-full border rounded px-3 py-2"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Course / Event
          </label>
          <input
            type="text"
            name="course"
            className="w-full border rounded px-3 py-2"
            placeholder="Wentworth GC – Par3 Challenge"
          />
        </div>

        <div className="border rounded px-3 py-2 bg-gray-50">
          <p className="text-sm">
            Entry Fee: <span className="font-semibold">$8</span>
          </p>
          <p className="text-xs text-gray-500">
            You&apos;ll see the secure payment form on the next screen.
          </p>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Link
            to="/play"
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Play
          </Link>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
