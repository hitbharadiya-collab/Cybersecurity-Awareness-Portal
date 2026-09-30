const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Cloud Connection (Atlas)
const MONGO_URI = 'mongodb+srv://hitbharadiya_db_user:Kwwsxnha7FLEeDrv@cluster0.l0guvsc.mongodb.net/cybershield_soc?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🛡️ [BLUE TEAM SOC] Connected to MongoDB Database Successfully!'))
  .catch((err) => console.log('⚠️ MongoDB connection error:', err.message));

// 1. Incident Ticket Schema
const IncidentSchema = new mongoose.Schema({
  ticketId: String,
  incidentType: String,
  severity: String,
  description: String,
  timestamp: { type: Date, default: Date.now }
});
const Incident = mongoose.model('Incident', IncidentSchema); 

// 2. Quiz Score Schema
const QuizScoreSchema = new mongoose.Schema({
  traineeName: { type: String, default: 'Blue Team Analyst' },
  score: Number,
  totalQuestions: { type: Number, default: 5 },
  date: { type: Date, default: Date.now }
});
const QuizScore = mongoose.model('QuizScore', QuizScoreSchema);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ACTIVE', system: 'CyberShield SOC Defense API' });
});

// API: Save Incident Ticket
app.post('/api/incidents', async (req, res) => {
  try {
    const { ticketId, incidentType, severity, description } = req.body;
    const incident = new Incident({ ticketId, incidentType, severity, description });
    await incident.save();
    res.status(201).json({ success: true, message: 'Ticket Logged to SOC Ledger', data: incident });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Save Quiz Score
app.post('/api/quiz-score', async (req, res) => {
  try {
    const { traineeName, score } = req.body;
    const record = new QuizScore({ traineeName, score });
    await record.save();
    res.status(201).json({ success: true, message: 'Score saved to DB', data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Blue Team SOC Server running at http://localhost:${PORT}`);
}); 