const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/patientDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Counter Schema for patient ID generation
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequence: { type: Number, required: true },
});

const Counter = mongoose.model("Counter", counterSchema);

// Patient Schema
const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  phone: {
    type: String,
    required: true,
    match: [/^[1-9]\d{9}$/, "Please enter a valid phone number (10 digits)"],
  },
  address: { type: String, required: true },
  relativeName: { type: String, required: true },
  relativeNumber: {
    type: String,
    required: true,
    match: [/^[1-9]\d{9}$/, "Please enter a valid phone number (10 digits)"],
  },
  medicalHistory: { type: String, default: "" },
  registrationDate: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", patientSchema);

// MMSE Assessment Schema
const mmseAssessmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  mmseScores: {
    orientation: { type: Number, required: true },
    memory: { type: Number, required: true },
    attention: { type: Number, required: true },
    recall: { type: Number, required: true },
    language: { type: Number, required: true },
    visual: { type: Number, required: true },
  },
  totalScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ["Low", "Medium", "High"], required: true },
  assessmentDate: { type: Date, default: Date.now },
});

const MMSEAssessment = mongoose.model("MMSEAssessment", mmseAssessmentSchema);

// MRI Scan Schema
const mriScanSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  mriImage: { type: String, required: true }, // Base64 encoded image
  uploadDate: { type: Date, default: Date.now },
  predictedClass: {
    type: String,
    enum: [
      "Non Demented",
      "Very Mild Dementia",
      "Mild Dementia",
      "Moderate Dementia",
    ],
    required: true,
  },
  confidence: { type: Number, required: true },
  modelVersion: { type: String, default: "ResNet18+ViT+Neuro-Symbolic" },
});

const MRIScan = mongoose.model("MRIScan", mriScanSchema);

// Generate patient ID
const generatePatientId = async (fullName) => {
  const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "patientId" },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: { sequence: 100 } }
    );

    return `PID${counter.sequence}-${sanitizedName}`;
  } catch (error) {
    console.error("Error generating patient ID:", error);
    throw new Error("Failed to generate patient ID");
  }
};

// ============ PATIENT ENDPOINTS ============

// Add new patient
app.post("/api/patients", async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phone,
      address,
      relativeName,
      relativeNumber,
      medicalHistory,
    } = req.body;

    // Validation
    if (!fullName || !age || !gender || !phone || !address || !relativeName || !relativeNumber) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Generate unique patient ID
    const patientId = await generatePatientId(fullName);

    // Create new patient
    const newPatient = new Patient({
      patientId,
      fullName,
      age,
      gender,
      phone,
      address,
      relativeName,
      relativeNumber,
      medicalHistory: medicalHistory || "",
    });

    await newPatient.save();

    res.status(201).json({
      message: `Patient details added successfully. Generated Patient ID: ${patientId}`,
      patient: newPatient,
      patientId,
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ message: "Error adding patient", error: error.message });
  }
});

// Get all patients
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ registrationDate: -1 });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
});

// Get patient by ID
app.get("/api/patients/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
});

// Update patient
app.put("/api/patients/:patientId", async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient details updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Error updating patient", error: error.message });
  }
});

// Delete patient
app.delete("/api/patients/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      patientId: req.params.patientId,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Delete associated MMSE assessments and MRI scans
    await MMSEAssessment.deleteMany({ patientId: req.params.patientId });
    await MRIScan.deleteMany({ patientId: req.params.patientId });

    res.status(200).json({
      message: "Patient and associated records deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Error deleting patient", error: error.message });
  }
});

// Validate patient ID and get patient name
app.get("/api/validate-patient/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: "Invalid Patient ID" });
    }

    res.status(200).json({ patientId: patient.patientId, fullName: patient.fullName });
  } catch (error) {
    console.error("Error validating patient ID:", error);
    res.status(500).json({ message: "Error validating patient ID", error: error.message });
  }
});

// ============ MMSE ENDPOINTS ============

// Save MMSE assessment
app.post("/api/mmse-assessments", async (req, res) => {
  try {
    const { patientId, mmseScores, totalScore, riskLevel } = req.body;

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Invalid Patient ID" });
    }

    const newAssessment = new MMSEAssessment({
      patientId,
      mmseScores,
      totalScore,
      riskLevel,
    });

    await newAssessment.save();

    res.status(201).json({
      message: `MMSE test result saved successfully for Patient ID: ${patientId}`,
      assessment: newAssessment,
    });
  } catch (error) {
    console.error("Error saving MMSE assessment:", error);
    res.status(500).json({ message: "Error saving MMSE assessment", error: error.message });
  }
});

// Get all MMSE assessments for a patient
app.get("/api/mmse-assessments/:patientId", async (req, res) => {
  try {
    const assessments = await MMSEAssessment.find({
      patientId: req.params.patientId,
    }).sort({ assessmentDate: -1 });

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching MMSE assessments:", error);
    res.status(500).json({ message: "Error fetching MMSE assessments", error: error.message });
  }
});

// ============ MRI ENDPOINTS ============

// Upload MRI scan
app.post("/api/mri-scans", async (req, res) => {
  try {
    const { patientId, mriImage, predictedClass, confidence } = req.body;

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Invalid Patient ID" });
    }

    const newMRIScan = new MRIScan({
      patientId,
      mriImage,
      predictedClass,
      confidence,
    });

    await newMRIScan.save();

    res.status(201).json({
      message: `MRI Scan uploaded successfully. Detected class: ${predictedClass}.`,
      mriScan: newMRIScan,
    });
  } catch (error) {
    console.error("Error uploading MRI scan:", error);
    res.status(500).json({ message: "Error uploading MRI scan", error: error.message });
  }
});

// Get all MRI scans for a patient
app.get("/api/mri-scans/:patientId", async (req, res) => {
  try {
    const scans = await MRIScan.find({
      patientId: req.params.patientId,
    }).sort({ uploadDate: -1 });

    res.status(200).json(scans);
  } catch (error) {
    console.error("Error fetching MRI scans:", error);
    res.status(500).json({ message: "Error fetching MRI scans", error: error.message });
  }
});

// ============ REPORT ENDPOINTS ============

// Get complete patient report
app.get("/api/patient-report/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const mmseAssessments = await MMSEAssessment.find({
      patientId: req.params.patientId,
    }).sort({ assessmentDate: -1 });

    const mriScans = await MRIScan.find({
      patientId: req.params.patientId,
    }).sort({ uploadDate: -1 });

    res.status(200).json({
      patient,
      mmseAssessments,
      mriScans,
    });
  } catch (error) {
    console.error("Error fetching patient report:", error);
    res.status(500).json({ message: "Error fetching patient report", error: error.message });
  }
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});