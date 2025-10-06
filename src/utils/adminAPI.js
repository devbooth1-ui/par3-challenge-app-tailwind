// API Configuration for connecting to admin services
const ADMIN_API_BASE = 'https://par3-admin1.vercel.app';

// API functions for admin communication
export const adminAPI = {
    // Submit birdie claim to admin portal
    submitBirdieClaim: async (playerData, outfitDescription = '', teeTime = '') => {
        try {
            const response = await fetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    claimType: 'birdie',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription: outfitDescription,
                    teeTime: teeTime,
                    courseId: 'wentworth-gc',
                    hole: '1',
                    paymentMethod: 'card'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to submit claim: ${response.status}`);
            }

            const result = await response.json();
            console.log('🚨 BIRDIE CLAIM SUBMITTED:', result);

            // Also send immediate email notification
            await fetch(`${ADMIN_API_BASE}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claimType: 'birdie',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription: outfitDescription,
                    teeDate: teeTime ? teeTime.split(' ')[0] : '',
                    teeTime: teeTime ? teeTime.split(' ')[1] : '',
                    courseName: 'Wentworth GC'
                })
            });

            return result;
        } catch (error) {
            console.error('Failed to submit birdie claim:', error);
            // Don't break the app if admin portal is down
            return { error: error.message, offline: true };
        }
    },

    // Submit hole-in-one claim to admin portal
    submitHoleInOneClaim: async (playerData, paymentMethod, outfitDescription = '', teeTime = '') => {
        try {
            const response = await fetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    claimType: 'hole_in_one',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription: outfitDescription,
                    teeTime: teeTime,
                    courseId: 'wentworth-gc',
                    hole: '1',
                    paymentMethod: paymentMethod || 'card'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to submit hole-in-one claim: ${response.status}`);
            }

            const result = await response.json();
            console.log('🚨 HOLE-IN-ONE CLAIM SUBMITTED:', result);

            // Also send immediate email notification
            await fetch(`${ADMIN_API_BASE}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claimType: 'hole-in-one',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription: outfitDescription,
                    teeDate: teeTime ? teeTime.split(' ')[0] : '',
                    teeTime: teeTime ? teeTime.split(' ')[1] : '',
                    courseName: 'Wentworth GC'
                })
            });

            return result;
        } catch (error) {
            console.error('Failed to submit hole-in-one claim:', error);
            // Don't break the app if admin portal is down
            return { error: error.message, offline: true };
        }
    }
};

export default adminAPI;
