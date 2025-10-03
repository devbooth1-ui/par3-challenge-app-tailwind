// src/utils/notificationService.js

/**
 * Simple notification service for tournament registration.
 * Expand with email, SMS, or push notifications as needed.
 */
export async function notifyTournamentRegistration(tournamentData) {
  // For now, just log the registration and return a resolved promise
  console.log("Notification: Tournament registration submitted:", tournamentData);
  return Promise.resolve({ success: true });
}
