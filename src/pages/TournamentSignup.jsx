import React, { useEffect, useState } from "react";
import ConfettiEffect from "../components/ConfettiEffect";
import { useNavigate } from "react-router-dom";
import { notifyTournamentRegistration } from "../utils/notificationService";

export default function TournamentSignup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const playerName = localStorage.getItem("playerName") || "";
        const playerEmail = localStorage.getItem("playerEmail") || "";
        const playerPhone = localStorage.getItem("playerPhone") || "";
        
        setForm({
            name: playerName,
            email: playerEmail,
            phone: playerPhone
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setShowConfetti(true);
        
        // Store tournament registration data locally
        const tournamentData = {
            playerName: form.name,
            playerEmail: form.email,
            playerPhone: form.phone,
            registrationDate: new Date().toISOString(),
            tournamentId: "million-dollar-tournament",
            status: "registered"
        };
        
        localStorage.setItem("tournamentRegistered", "true");
        localStorage.setItem("tournamentData", JSON.stringify(tournamentData));
        
        const playerStats = JSON.parse(localStorage.getItem("playerStats") || "{}");
        playerStats.tournamentRegistered = true;
        localStorage.setItem("playerStats", JSON.stringify(playerStats));
        
        // Also update the main player data if it was modified
        if (form.name) localStorage.setItem("playerName", form.name);
        if (form.email) localStorage.setItem("playerEmail", form.email);
        if (form.phone) localStorage.setItem("playerPhone", form.phone);

        // Send registration notification using the notification service
        try {
            const result = await notifyTournamentRegistration(tournamentData);
            console.log("Tournament registration notification result:", result);
        } catch (error) {
            console.error("Failed to send tournament registration notification:", error);
        }

        // Send registration info to backend (NEW CODE)
        try {
            await fetch('https://par3-admin1.vercel.app/api/tournaments/million-dollar-tournament/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName: form.name,
                    playerEmail: form.email,
                    playerPhone: form.phone,
                    registrationDate: tournamentData.registrationDate,
                    tournamentId: "million-dollar-tournament"
                })
            });
            console.log("Tournament registration sent to backend.");
        } catch (error) {
            console.error("Failed to sync tournament registration to backend:", error);
        }
        
        // Optionally send confirmation emails (existing code)
        sendPlayerConfirmationEmail(tournamentData);
        sendCompanyNotificationEmail(tournamentData);

        setTimeout(() => navigate("/play"), 3000);
    };

    const sendPlayerConfirmationEmail = async (tournamentData) => {
        const playerConfirmation = {
            to: tournamentData.playerEmail,
            subject: "🏆 Tournament Registration Confirmed - Par3 Challenge $1 Million Shootout!",
            body: `Congratulations ${tournamentData.playerName}!

🏆 YOUR TOURNAMENT REGISTRATION IS CONFIRMED! 🏆

You are now officially registered for the Par3 Challenge Million Dollar Shootout!

Registration Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player Name: ${tournamentData.playerName}
Email: ${tournamentData.playerEmail}
Phone: ${tournamentData.playerPhone || "Not provided"}
Registration Date: ${new Date(tournamentData.registrationDate).toLocaleString()}
Tournament ID: ${tournamentData.tournamentId}

💰 PRIZE POOL: $1,000,000 SHOOTOUT! 💰

What happens next:
✅ You're qualified and registered
✅ Play your tournament round immediately
✅ Best score wins the grand prize
✅ Results verified within 24 hours

Tournament Rules:
• Prize subject to tournament completion and verification
• Winner must complete verification process
• Tournament subject to official rules and regulations
• Final prize amount determined by total participants

🏌️‍♂️ Ready to compete for $1 Million? Let's play!

Good luck!
The Par3 Challenge Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated confirmation. Please keep this email for your records.`,
            timestamp: new Date().toISOString(),
            type: "tournament_registration"
        };

        // Store for demonstration (in production, this would send actual email)
        localStorage.setItem("lastPlayerTournamentConfirmation", JSON.stringify(playerConfirmation));
        console.log("Tournament registration confirmation sent to player:", playerConfirmation);
    };

    const sendCompanyNotificationEmail = async (tournamentData) => {
        const companyNotification = {
            to: "devbooth1@yahoo.com, registration@par3challenge.com",
            subject: "🏆 New Tournament Registration - Par3 Challenge",
            body: `New tournament registration received:

Player Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${tournamentData.playerName}
Email: ${tournamentData.playerEmail}
Phone: ${tournamentData.playerPhone || "Not provided"}
Registration Date: ${new Date(tournamentData.registrationDate).toLocaleString()}
Tournament ID: ${tournamentData.tournamentId}
Status: ${tournamentData.status}

Tournament: Million Dollar Shootout
Prize Pool: $1,000,000 SHOOTOUT

Player is now registered and will proceed to play their tournament round.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action Required: Monitor player's tournament performance and verify results.`,
            timestamp: new Date().toISOString(),
            type: "company_tournament_notification"
        };

        // Store for demonstration (in production, this would send actual email)
        localStorage.setItem("lastCompanyTournamentNotification", JSON.stringify(companyNotification));
        console.log("Company tournament notification sent:", companyNotification);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-red-100 p-4">
            {showConfetti && <ConfettiEffect duration={3000} />}
            <div className="max-w-md w-full bg-white/95 rounded-2xl shadow-2xl p-6 border border-yellow-200 mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">🏆 Tournament Registration</h2>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Player Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border rounded-lg px-4 py-3"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="border rounded-lg px-4 py-3"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="border rounded-lg px-4 py-3"
                    />
                    <button
                        type="submit"
                        disabled={submitted}
                        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
                    >
                        {submitted ? "Registered!" : "Register for $1M Tournament"}
                    </button>
                </form>
            </div>
        </div>
    );
}