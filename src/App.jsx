import React from 'react'
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom'

import TeeOff from './pages/TeeOff.jsx'
import PlayGame from './pages/PlayGame.jsx'
import HowdWeDo from './pages/HowdWeDo.jsx'
import Payment from './pages/Payment.jsx'
import Awards from './pages/Awards.jsx'
import MyScorecard from './pages/MyScorecard.jsx'
import OrderForm from './pages/OrderForm.jsx'
import ReturningPlayer from './pages/ReturningPlayer.jsx'
import TapIn from './pages/TapIn.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import ThanksForPlaying from './pages/ThanksForPlaying.jsx'
import Tournament from './pages/Tournament.jsx'
import TournamentSignup from './pages/TournamentSignup.jsx'

/* Only include Leaderboard if the file exists; you created it earlier. */
import Leaderboard from './pages/Leaderboard.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b flex items-center gap-4">
        <Link to="/" className="font-semibold">Par3 Challenge</Link>
        <nav className="flex gap-3 text-sm">
          <Link to="/play">Play Game</Link>
          <Link to="/howd-we-do">How’d We Do</Link>
          <Link to="/payment">Payment</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<TeeOff />} />
          <Route path="/play" element={<PlayGame />} />
          <Route path="/howd-we-do" element={<HowdWeDo />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/scorecard" element={<MyScorecard />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/returning" element={<ReturningPlayer />} />
          <Route path="/tap-in" element={<TapIn />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/thanks" element={<ThanksForPlaying />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/tournament-signup" element={<TournamentSignup />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}
