const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/patientDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Counter Schema for patient ID generation
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequence: { type: Number, required: true }
});

const Counter = mongoose.model('Counter', counterSchema);

// Patient Schema with enhanced validation
const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  email: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address (e.g., user@example.com)']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$|^[1-9]\d{9}$/, 'Please enter a valid phone number (e.g., +1-123-456-7890 or 1234567890)']
  },
  address: { type: String, required: true },
  guardianName: { type: String, required: true },
  medicalConditions: { type: String, required: true },
  symptoms: { type: String, required: true },
  registrationDate: { type: String, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);

// MMSE Assessment Schema
const mmseAssessmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  gender: { type: Number, required: true },
  ethnicity: { type: Number, required: true },
  educationLevel: { type: Number, required: true },
  familyHistoryAlzheimers: { type: Number, required: true },
  cardiovascularDisease: { type: Number, required: true },
  diabetes: { type: Number, required: true },
  depression: { type: Number, required: true },
  headInjury: { type: Number, required: true },
  hypertension: { type: Number, required: true },
  mmse: { type: Number, required: true },
  functionalAssessment: { type: Number, required: true },
  adl: { type: Number, required: true },
  memoryComplaints: { type: Number, required: true },
  behavioralProblems: { type: Number, required: true },
  confusion: { type: Number, required: true },
  disorientation: { type: Number, required: true },
  personalityChanges: { type: Number, required: true },
  difficultyCompletingTasks: { type: Number, required: true },
  forgetfulness: { type: Number, required: true },
  diagnosis: { type: Number, required: true },
  riskScore: { type: Number, required: true },
  assessmentDate: { type: Date, required: true },
});

const MMSEAssessment = mongoose.model('MMSEAssessment', mmseAssessmentSchema);

// Generate patient ID in format PID{number}-{name}
const generatePatientId = async (fullName) => {
  const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'patientId' },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: { sequence: 100 } }
    );
    return `PID${counter.sequence}-${sanitizedName}`;
  } catch (error) {
    console.error('Error generating patient ID:', error);
    throw new Error('Failed to generate patient ID');
  }
};

// Input validation middleware for patient registration
const validatePatientData = (req, res, next) => {
  const { fullName, dob, gender, email, phone, address, guardianName, medicalConditions, symptoms } = req.body;
  
  // Check required fields
  if (!fullName || !dob || !gender) {
    return res.status(400).json({ message: 'Full Name, Date of Birth, and Gender are required' });
  }
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    return res.status(400).json({ message: 'Invalid gender value' });
  }

  // Check all required fields
  const requiredFields = { email, phone, address, guardianName, medicalConditions, symptoms };
  const emptyFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || value.trim() === '')
    .map(([key]) => key);
  if (emptyFields.length > 0) {
    return res.status(400).json({ message: `Please fill in the following fields: ${emptyFields.join(', ')}` });
  }

  next();
};

// Register a new patient
app.post('/api/patients', validatePatientData, async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      email,
      phone,
      address,
      guardianName,
      medicalConditions,
      symptoms,
    } = req.body;

    // Check for existing patient with same phone and DOB
    if (phone && dob) {
      const existingPatient = await Patient.findOne({ phone, dob });
      if (existingPatient) {
        return res.status(400).json({ message: 'Patient with this Phone Number and Date of Birth is already registered' });
      }
    }

    const patientId = await generatePatientId(fullName);
    const registrationDate = new Date().toISOString().split('T')[0];

    const newPatient = new Patient({
      patientId,
      fullName,
      dob,
      gender,
      email,
      phone,
      address,
      guardianName,
      medicalConditions,
      symptoms,
      registrationDate,
    });

    await newPatient.save();
    res.status(201).json({
      message: 'Patient registered successfully',
      patientId,
      patient: newPatient,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Patient ID already exists' });
    }
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Error registering patient', error: error.message });
  }
});

// Get all patients
app.get('/api/patients', async (req, res) => {
  console.log('GET /api/patients endpoint hit');
  try {
    const patients = await Patient.find().sort({ registrationDate: -1 });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Get a single patient by patientId
app.get('/api/patients/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

// Update patient details
app.put('/api/patients/:patientId', validatePatientData, async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      email,
      phone,
      address,
      guardianName,
      medicalConditions,
      symptoms,
    } = req.body;

    // Check for existing patient with same phone and DOB (excluding current patient)
    if (phone && dob) {
      const existingPatient = await Patient.findOne({ phone, dob, patientId: { $ne: req.params.patientId } });
      if (existingPatient) {
        return res.status(400).json({ message: 'Another patient with this Phone Number and Date of Birth is already registered' });
      }
    }

    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      {
        fullName,
        dob,
        gender,
        email,
        phone,
        address,
        guardianName,
        medicalConditions,
        symptoms,
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete a patient
app.delete('/api/patients/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    await MMSEAssessment.deleteMany({ patientId: req.params.patientId });
    res.status(200).json({ message: 'Patient and associated assessments deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

// Validate patient ID and get patient name
app.get('/api/validate-patient/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Invalid Patient ID' });
    }
    res.status(200).json({ patientId: patient.patientId, fullName: patient.fullName });
  } catch (error) {
    console.error('Error validating patient ID:', error);
    res.status(500).json({ message: 'Error validating patient ID', error: error.message });
  }
});

// Store MMSE assessment
app.post('/api/mmse-assessments', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.body.patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Invalid Patient ID' });
    }

    const newAssessment = new MMSEAssessment(req.body);
    await newAssessment.save();
    res.status(201).json({
      message: 'MMSE assessment saved successfully',
      assessment: newAssessment,
    });
  } catch (error) {
    console.error('Error saving MMSE assessment:', error);
    res.status(500).json({ message: 'Error saving MMSE assessment', error: error.message });
  }
});

// Get all MMSE assessments for a patient
app.get('/api/mmse-assessments/:patientId', async (req, res) => {
  try {
    const assessments = await MMSEAssessment.find({ patientId: req.params.patientId }).sort({ assessmentDate: -1 });
    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: 'No assessments found for this patient' });
    }
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching MMSE assessments:', error);
    res.status(500).json({ message: 'Error fetching MMSE assessments', error: error.message });
  }
});

// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});