import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminAPI } from "../utils/adminAPI";

export default function HowdWeDo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showVideoOrder, setShowVideoOrder] = useState(false);
  const [videoOrderData, setVideoOrderData] = useState(null);

  // Check for video order query param and data
  useEffect(() => {
    const videoOrderParam = searchParams.get('videoOrder');
    if (videoOrderParam === 'true') {
      const orderData = localStorage.getItem('videoOrder');
      if (orderData) {
        setVideoOrderData(JSON.parse(orderData));
        setShowVideoOrder(true);
      }
    }
  }, [searchParams]);

  // Developer toggle for new player flow
  const clearPlayerData = () => {
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerEmail");
    localStorage.removeItem("playerStats");
    localStorage.removeItem("tournamentRegistration");
    localStorage.removeItem("videoOrder");
    window.location.reload();
  };

  // Defensive: fallback for missing/corrupt localStorage
  let playerName = "Player";
  let currentStats = {};
  try {
    playerName = localStorage.getItem("playerName") || "Player";
    currentStats = JSON.parse(localStorage.getItem("playerStats") || "{}") || {};
  } catch (e) {
    console.error("Error reading player data from localStorage", e);
    playerName = "Player";
    currentStats = {};
  }

  const recordScore = async (scoreType, reward, points) => {
    // Defensive: ensure currentStats is an object
    const safeStats = typeof currentStats === 'object' && currentStats !== null ? currentStats : {};
    // Update player stats
    const updatedStats = {
      ...safeStats,
      lastRound: scoreType,
      totalRounds: (safeStats.totalRounds || 0) + 1,
      totalPoints: (safeStats.totalPoints || 0) + points,
      bestScore: Math.min(safeStats.bestScore || 99, getScoreValue(scoreType)),
      lastReward: reward,
      lastDate: new Date().toLocaleDateString()
    };
    localStorage.setItem("playerStats", JSON.stringify(updatedStats));

    // If it's a birdie or hole-in-one, submit to admin portal for verification
    if (scoreType === "Birdie" || scoreType === "Hole-in-One") {
      const playerEmail = localStorage.getItem("playerEmail") || "";
      const paymentMethod = localStorage.getItem("lastPaymentMethod") || "card"; // Get original payment method
      const nameparts = playerName.split(" ");
      const firstName = nameparts[0] || "Player";
      const lastName = nameparts.slice(1).join(" ") || "";

      const playerData = {
        firstName,
        lastName,
        email: playerEmail,
        phone: "", // You can add phone collection in your app later
      };

      let claimResult;
      if (scoreType === "Hole-in-One") {
        claimResult = await adminAPI.submitHoleInOneClaim(playerData, paymentMethod);
      } else {
        claimResult = await adminAPI.submitBirdieClaim(playerData);
      }

      console.log("Admin portal response:", claimResult);
    }

    // Navigate to appropriate page
    if (scoreType === "Hole-in-One") {
      navigate("/verify", { state: { prize: "hio", reward, points, playerName } });
    } else if (scoreType === "Birdie") {
      navigate("/verify", { state: { prize: "birdie", reward, points, playerName } });
    } else {
      navigate("/myscorecard", { state: { prize: null, scoreType, points } });
    }
  };

  const getScoreValue = (scoreType) => {
    switch (scoreType) {
      case "Hole-in-One": return 1;
      case "Birdie": return 2;
      case "Par": return 3;
      default: return 4;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden"
      style={{
        minHeight: '100dvh',
        backgroundImage: "url('/ballroll.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white drop-shadow mb-2">How'd Ya Do?</h2>
      <p className="text-center text-white/90 mb-6 text-base sm:text-lg drop-shadow">
        <span className="font-bold text-white">Click On It...</span>
      </p>

      {/* Video Order Confirmation */}
      {showVideoOrder && videoOrderData && (
        <div className="w-full max-w-md mb-6 bg-purple-600/90 border-2 border-purple-400 rounded-xl p-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">🎥 Video Order Confirmation</h3>
            <div className="bg-white/20 rounded-lg p-3 mb-3">
              <p className="text-white font-semibold">{videoOrderData.playerName}</p>
              <p className="text-white text-sm">{videoOrderData.email}</p>
              <p className="text-white text-sm">Order Total: $25.00</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Confirm order
                  localStorage.setItem('videoOrder', JSON.stringify({
                    ...videoOrderData,
                    status: 'confirmed',
                    confirmedAt: new Date().toISOString()
                  }));
                  alert('Video order confirmed! You will receive your footage within 24 hours via email.');
                  setShowVideoOrder(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                ✅ Confirm Order
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('videoOrder');
                  setShowVideoOrder(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 w-full max-w-md">
        <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow text-base flex flex-col items-center" onClick={() => recordScore("Hole-in-One", "$1,000 CASH* + Instant Qualification for the $1 Million Tournament", 1000)}>
          🏆 HOLE-IN-WON!
          <div className="text-xs">$1,000 CASH*<br />Instant Qualification for the $1 Million Tournament</div>
        </button>
        <button
          onClick={() => recordScore("Birdie", "$65 Club Card + 200 Points + Towards $1Million Dollar Tournament", 200)}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow text-base flex flex-col items-center"
        >
          🎯 BIRDIE (2 strokes)
          <div className="text-xs">$65 Club Card<br />200 Points<br />Towards $1Million Dollar Tournament</div>
        </button>
        <button
          onClick={() => recordScore("Par", "50 Points + Towards $1Million Dollar Tournament", 50)}
          className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow text-base flex flex-col items-center"
        >
          ⛳ PAR (3 strokes)
          <div className="text-xs">50 Points<br />Towards $1Million Dollar Tournament</div>
        </button>
        <button
          onClick={() => recordScore("Bogey", "50 Points + Towards $1Million Dollar Tournament", 50)}
          className="w-full py-2 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold rounded-lg hover:from-gray-600 hover:to-slate-700 transition-all shadow text-base flex flex-col items-center"
        >
          🥲 SHANK'D IT!
          <div className="text-xs">50 Points<br />Towards $1Million Dollar Tournament</div>
        </button>
      </div>
      <div className="mt-20 text-center">
        <p className="text-lg sm:text-xl font-extrabold drop-shadow-lg tracking-wide text-red-600">
          ⛳ Building toward the $1M Tournament
        </p>
      </div>
    </div>
  );
}