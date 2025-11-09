import React, { useState } from "react";
import PatientDetailsForm from "./PatientDetailsForm";
import MMSEForm from "./MMSEForm";
import MRIForm from "./MRIForm";
import Reports from "./Reports";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");

  const dashboardSections = [
    {
      id: "patient-details",
      title: "Add Patient Details",
      icon: "🏥",
      description: "Register a new patient with their basic information",
      color: "gradient-blue",
    },
    {
      id: "mmse",
      title: "MMSE Assessment",
      icon: "🧩",
      description: "Mini-Mental State Examination Test",
      color: "gradient-purple",
    },
    {
      id: "mri",
      title: "MRI Scans",
      icon: "🧠",
      description: "Upload and analyze MRI scans with AI model",
      color: "gradient-cyan",
    },
    {
      id: "reports",
      title: "Reports",
      icon: "📄",
      description: "View comprehensive patient reports",
      color: "gradient-green",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Navigation Section */}
        {activeSection === "home" && (
          <div className="dashboard-home">
            {/* Header Section */}
            <div className="dashboard-header">
              <div>
                <h1 className="dashboard-title">🏥 Alzheimer's Detection System</h1>
                <p className="dashboard-subtitle">
                  Comprehensive Patient Management and AI-Powered Diagnosis
                </p>
              </div>
            </div>

            {/* Dashboard Sections Grid */}
            <div className="sections-grid">
              {dashboardSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`section-card ${section.color}`}
                >
                  <div className="section-icon">{section.icon}</div>
                  <h3 className="section-title">{section.title}</h3>
                  <p className="section-description">{section.description}</p>
                  <div className="section-arrow">→</div>
                </button>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div className="stats-section">
              <h2 className="stats-title">📊 Quick Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card stat-blue">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Patients</p>
                    <p className="stat-value">-</p>
                    <p className="stat-description">Registered in system</p>
                  </div>
                </div>

                <div className="stat-card stat-purple">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <p className="stat-label">MMSE Tests</p>
                    <p className="stat-value">-</p>
                    <p className="stat-description">Assessments completed</p>
                  </div>
                </div>

                <div className="stat-card stat-cyan">
                  <div className="stat-icon">🧠</div>
                  <div className="stat-content">
                    <p className="stat-label">MRI Scans</p>
                    <p className="stat-value">-</p>
                    <p className="stat-description">AI analyses performed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="info-section">
              <h2 className="info-title">ℹ️ System Information</h2>
              <div className="info-grid">
                <div className="info-card">
                  <h3>Patient ID Format</h3>
                  <p>
                    <code>PID###-firstname</code>
                  </p>
                </div>
                <div className="info-card">
                  <h3>MMSE Risk Levels</h3>
                  <ul>
                    <li>🟢 Low: Score ≥ 24</li>
                    <li>🟡 Medium: Score 18-23</li>
                    <li>🔴 High: Score &lt; 18</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>MRI Classifications</h3>
                  <ul>
                    <li>✓ Non Demented</li>
                    <li>⚠️ Very Mild Dementia</li>
                    <li>⚠️ Mild Dementia</li>
                    <li>⚠️ Moderate Dementia</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="dashboard-content">
          {activeSection === "patient-details" && (
            <div className="content-wrapper">
              <div className="content-header">
                <button
                  onClick={() => setActiveSection("home")}
                  className="back-button"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <PatientDetailsForm />
            </div>
          )}

          {activeSection === "mmse" && (
            <div className="content-wrapper">
              <div className="content-header">
                <button
                  onClick={() => setActiveSection("home")}
                  className="back-button"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <MMSEForm />
            </div>
          )}

          {activeSection === "mri" && (
            <div className="content-wrapper">
              <div className="content-header">
                <button
                  onClick={() => setActiveSection("home")}
                  className="back-button"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <MRIForm />
            </div>
          )}

          {activeSection === "reports" && (
            <div className="content-wrapper">
              <div className="content-header">
                <button
                  onClick={() => setActiveSection("home")}
                  className="back-button"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <Reports />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;