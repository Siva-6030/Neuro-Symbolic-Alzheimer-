import React, { useState, useEffect } from "react";
import Header from "./Header";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    medicalConditions: "",
    symptoms: "",
  });
  const [error, setError] = useState("");
  const [showSection, setShowSection] = useState(null); // null, "patients", or "reports"
  const [selectedReportPatientId, setSelectedReportPatientId] = useState(null); // Track selected patient for reports

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        headers: { Authorization: "Admin" },
      });
      const data = await response.json();
      setPatients(data);

      const assessmentsData = {};
      for (const patient of data) {
        const assessmentResponse = await fetch(`http://localhost:5000/api/mmse-assessments/${patient.patientId}`);
        const assessments = await assessmentResponse.json();
        assessmentsData[patient.patientId] = assessments;
      }
      setAssessments(assessmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStatsByDate = () => {
    const stats = {};
    patients.forEach((patient) => {
      const date = patient.registrationDate;
      stats[date] = (stats[date] || 0) + 1;
    });
    return stats;
  };

  const getStatsByWeek = () => {
    const stats = {};
    patients.forEach((patient) => {
      const date = new Date(patient.registrationDate);
      const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + (date.getDay() || 7) - 1) / 7)}`;
      stats[week] = (stats[week] || 0) + 1;
    });
    return stats;
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient.patientId);
    setFormData(patient);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${selectedPatient}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Admin" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setError("");
        fetchPatients();
        setSelectedPatient(null);
      } else {
        setError(result.message || "Error updating patient");
      }
    } catch (error) {
      setError("Error updating patient");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
          method: "DELETE",
          headers: { Authorization: "Admin" },
        });
        if (response.ok) {
          setError("");
          fetchPatients(); // Refresh patient list
        } else {
          const result = await response.json();
          setError(result.message || "Error deleting patient");
        }
      } catch (error) {
        setError("Error deleting patient");
      }
    }
  };

  return (
    <>
      <Header />
      <div style={{ height: 56 }} />
      <div style={{ padding: "24px", fontFamily: "Segoe UI, Arial, sans-serif" }}>
        <h2 style={{ color: "#5a189a" }}>Admin Dashboard</h2>

        {/* Statistics */}
        <div style={{ marginBottom: "24px" }}>
          <h3>Registration Statistics</h3>
          <h4>By Date</h4>
          <ul>
            {Object.entries(getStatsByDate()).map(([date, count]) => (
              <li key={date}>{date}: {count} patient(s)</li>
            ))}
          </ul>
          <h4>By Week</h4>
          <ul>
            {Object.entries(getStatsByWeek()).map(([week, count]) => (
              <li key={week}>{week}: {count} patient(s)</li>
            ))}
          </ul>
        </div>

        {/* Section Toggle Buttons */}
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => setShowSection("patients")}
            style={{
              padding: "12px 24px",
              background: showSection === "patients" ? "#5a189a" : "#ddd",
              color: showSection === "patients" ? "#fff" : "#444",
              border: "none",
              borderRadius: "8px",
              marginRight: "12px",
              cursor: "pointer",
            }}
          >
            Patient Details
          </button>
          <button
            onClick={() => { setShowSection("reports"); setSelectedReportPatientId(null); }}
            style={{
              padding: "12px 24px",
              background: showSection === "reports" ? "#5a189a" : "#ddd",
              color: showSection === "reports" ? "#fff" : "#444",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Patient Reports
          </button>
        </div>

        {/* Patient Details Section */}
        {showSection === "patients" && (
          <>
            <h3>Patient Details</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
              <thead>
                <tr style={{ background: "#f3e9ff" }}>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>Patient ID</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>Full Name</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.patientId} style={{ border: "1px solid #ddd" }}>
                    <td style={{ padding: "12px" }}>{patient.patientId}</td>
                    <td style={{ padding: "12px" }}>{patient.fullName}</td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleEdit(patient)} style={{ padding: "6px 12px", background: "#5a189a", color: "#fff", border: "none", borderRadius: "4px", marginRight: "8px" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(patient.patientId)} style={{ padding: "6px 12px", background: "#cc0000", color: "#fff", border: "none", borderRadius: "4px" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Update Form */}
            {selectedPatient && (
              <div style={{ marginTop: "24px", padding: "24px", background: "#f9f9f9", borderRadius: "8px" }}>
                <h3>Update Patient Details</h3>
                <form onSubmit={handleUpdate}>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Guardian Name" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <input type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="Medical Conditions" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <input type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="Symptoms" style={{ padding: "12px", marginBottom: "12px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }} />
                  <button type="submit" style={{ padding: "12px 24px", background: "#5a189a", color: "#fff", border: "none", borderRadius: "8px" }}>Update Patient</button>
                  <button type="button" onClick={() => setSelectedPatient(null)} style={{ padding: "12px 24px", background: "#ddd", color: "#444", border: "none", borderRadius: "8px", marginLeft: "12px" }}>Cancel</button>
                </form>
                {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
              </div>
            )}
          </>
        )}

        {/* Patient Reports Section */}
        {showSection === "reports" && (
          <div>
            <h3>Patient Reports</h3>
            {selectedReportPatientId === null ? (
              <div>
                <h4>Select a Patient</h4>
                <ul>
                  {patients.map((patient) => (
                    <li key={patient.patientId} style={{ cursor: "pointer", padding: "8px", borderBottom: "1px solid #ddd" }} onClick={() => setSelectedReportPatientId(patient.patientId)}>
                      {patient.fullName}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h4>Report for {patients.find((p) => p.patientId === selectedReportPatientId)?.fullName || selectedReportPatientId}</h4>
                <button onClick={() => setSelectedReportPatientId(null)} style={{ padding: "8px 16px", background: "#ddd", color: "#444", border: "none", borderRadius: "4px", marginBottom: "12px" }}>Back to Patient List</button>
                {/* Patient Details */}
                <div style={{ marginBottom: "24px", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                  <h5>Patient Details</h5>
                  <p><strong>Full Name:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.fullName || "N/A"}</p>
                  <p><strong>Date of Birth:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.dob || "N/A"}</p>
                  <p><strong>Gender:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.gender || "N/A"}</p>
                  <p><strong>Email:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.email || "N/A"}</p>
                  <p><strong>Phone:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.phone || "N/A"}</p>
                  <p><strong>Address:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.address || "N/A"}</p>
                  <p><strong>Guardian Name:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.guardianName || "N/A"}</p>
                  <p><strong>Medical Conditions:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.medicalConditions || "N/A"}</p>
                  <p><strong>Symptoms:</strong> {patients.find((p) => p.patientId === selectedReportPatientId)?.symptoms || "N/A"}</p>
                </div>
                {/* MMSE Assessments */}
                <div style={{ marginBottom: "24px", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                  <h5>MMSE Assessments</h5>
                  {assessments[selectedReportPatientId] && assessments[selectedReportPatientId].length > 0 ? (
                    <ul>
                      {assessments[selectedReportPatientId].map((assessment, index) => (
                        <li key={index}>
                          Date: {new Date(assessment.assessmentDate).toLocaleDateString()}, MMSE: {assessment.mmse}, Risk Score: {assessment.riskScore}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No MMSE assessments available</p>
                  )}
                </div>
                {/* MRI Report (Simulated) */}
                <div style={{ padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                  <h5>MRI Report</h5>
                  <p>This is a simulated MRI report for {patients.find((p) => p.patientId === selectedReportPatientId)?.fullName || selectedReportPatientId}. MRI results indicate: <em>Hippocampal atrophy observed, suggesting possible early Alzheimer's changes. Further evaluation recommended.</em></p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;