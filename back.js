const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eswasthya', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
});

// Models
const User = require('./models/User');
const FamilyMember = require('./models/FamilyMember');
const Hospital = require('./models/Hospital');
const MedicalRecord = require('./models/MedicalRecord');

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

// Routes

// User Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Family Member Routes
app.post('/api/family', auth, async (req, res) => {
    try {
        const { name, age, bloodGroup, relation } = req.body;
        const familyMember = new FamilyMember({
            userId: req.user._id,
            name,
            age,
            bloodGroup,
            relation
        });
        await familyMember.save();
        res.status(201).json(familyMember);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/family', auth, async (req, res) => {
    try {
        const familyMembers = await FamilyMember.find({ userId: req.user._id });
        res.json(familyMembers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Hospital Routes
app.get('/api/hospitals', auth, async (req, res) => {
    try {
        const { location } = req.query;
        // In a real application, you would use geolocation to find nearby hospitals
        const hospitals = await Hospital.find({});
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Medical Records Routes
app.post('/api/records', auth, async (req, res) => {
    try {
        const { memberId, recordType, date, description, fileUrl } = req.body;
        const record = new MedicalRecord({
            userId: req.user._id,
            memberId,
            recordType,
            date,
            description,
            fileUrl
        });
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/records/:memberId', auth, async (req, res) => {
    try {
        const records = await MedicalRecord.find({
            userId: req.user._id,
            memberId: req.params.memberId
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Health Plan Routes
app.get('/api/health-plan/:type', auth, async (req, res) => {
    try {
        // In a real application, you would fetch personalized health plans
        const plans = {
            medicines: [
                { name: 'Medicine A', dosage: '1 tablet daily', timing: 'Morning' },
                { name: 'Medicine B', dosage: '2 tablets', timing: 'Night' }
            ],
            yoga: [
                { name: 'Surya Namaskar', duration: '15 mins', benefits: 'Overall fitness' },
                { name: 'Pranayama', duration: '10 mins', benefits: 'Breathing improvement' }
            ],
            diet: [
                { meal: 'Breakfast', items: ['Oats', 'Fruits', 'Milk'], time: '8:00 AM' },
                { meal: 'Lunch', items: ['Rice', 'Dal', 'Vegetables'], time: '1:00 PM' }
            ],
            meditation: [
                { type: 'Mindfulness', duration: '10 mins', time: 'Morning' },
                { type: 'Deep Breathing', duration: '5 mins', time: 'Evening' }
            ]
        };
        res.json(plans[req.params.type] || []);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Emergency Routes
app.post('/api/emergency', auth, async (req, res) => {
    try {
        const { location, type } = req.body;
        // In a real application, you would:
        // 1. Contact emergency services
        // 2. Notify emergency contacts
        // 3. Find nearest hospitals
        res.json({ message: 'Emergency services notified', status: 'processing' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// AI Analysis Routes
app.post('/api/analyze-report', auth, async (req, res) => {
    try {
        // In a real application, you would:
        // 1. Process the uploaded file
        // 2. Use AI/ML models to analyze the report
        // 3. Generate insights
        setTimeout(() => {
            res.json({
                summary: 'Report analysis complete',
                findings: [
                    { parameter: 'Blood Pressure', value: '120/80', status: 'normal' },
                    { parameter: 'Blood Sugar', value: '100 mg/dL', status: 'normal' },
                    { parameter: 'Vitamin D', value: '25 ng/mL', status: 'low' }
                ],
                recommendations: [
                    'Maintain a healthy diet',
                    'Consider Vitamin D supplements',
                    'Follow-up in 3 months'
                ]
            });
        }, 2000);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'addition2.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
