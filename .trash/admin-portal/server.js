const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'par3-admin-secret-key-2024';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev
    'https://par3-challenge-app-tailwind.vercel.app', // Vercel prod
    'https://par3-admin1.vercel.app' // Admin portal prod
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let users = [
    {
        id: 1,
        email: 'admin@par3challenge.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin'
    }
];

let claims = [];
let courses = [
    { id: 'wentworth-gc', name: 'Wentworth Golf Club', location: 'Surrey, UK' }
];

let players = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Nodemailer setup (replace with your real credentials)
const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'devbooth1@yahoo.com',
        pass: 'Reagan0622!'
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// Webhook endpoint for receiving claims from main app
app.post('/api/claims/webhook', (req, res) => {
    const claimData = req.body;

    const claim = {
        id: Date.now().toString(),
        ...claimData,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        wallet_address: null
    };

    claims.push(claim);
    console.log('New claim received:', claim);

    // Send email notification
    const mailOptions = {
        from: 'devbooth1@yahoo.com',
        to: 'admin@par3challenge.com',
        subject: 'New Award Claim Submitted',
        text: `A new claim has been submitted:\n${JSON.stringify(claim, null, 2)}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.json({
        success: true,
        claim_id: claim.id,
        message: 'Claim submitted successfully'
    });
});

// Get all claims
app.get('/api/claims', authenticateToken, (req, res) => {
    res.json(claims);
});

// Get all claims for a specific player (by email)
app.get('/api/players/:email/claims', authenticateToken, (req, res) => {
    const { email } = req.params;
    const playerClaims = claims.filter(c => c.email === email || c.playerEmail === email);
    res.json(playerClaims);
});

// Update claim status
app.patch('/api/claims/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const claim = claims.find(c => c.id === id);
    if (!claim) {
        return res.status(404).json({ error: 'Claim not found' });
    }

    claim.status = status;
    claim.notes = notes || claim.notes;
    claim.updated_at = new Date().toISOString();

    // Generate wallet address for approved claims
    if (status === 'approved' && !claim.wallet_address) {
        claim.wallet_address = `0x${Math.random().toString(16).substr(2, 40)}`;

        // Generate QR code for wallet
        try {
            claim.wallet_qr = await QRCode.toDataURL(claim.wallet_address);
        } catch (error) {
            console.error('QR code generation failed:', error);
        }
    }

    res.json(claim);
});

// Get courses
app.get('/api/courses', authenticateToken, (req, res) => {
    res.json(courses);
});

// Get all players
app.get('/api/players', authenticateToken, (req, res) => {
    res.json(players);
});

// Add a new player
app.post('/api/players', authenticateToken, (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email required' });
    }
    const newPlayer = {
        id: Date.now(),
        name,
        email
    };
    players.push(newPlayer);
    res.json(newPlayer);
});

// Serve admin dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Admin Portal running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/admin.html`);
    console.log(`🔐 Login: admin@par3challenge.com / admin123`);
});
