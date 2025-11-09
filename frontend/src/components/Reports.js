import React, { useState } from "react";

const Reports = () => {
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateAndFetchReport = async (id) => {
    if (!id) {
      setPatientData(null);
      return;
    }

    setIsValidating(true);
    setMessage("");
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/patient-report/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setPatientData(data);
        setMessage("");
        setMessageType("");
      } else {
        setPatientData(null);
        setMessage("Patient not found or no data available");
        setMessageType("error");
      }
    } catch (error) {
      setPatientData(null);
      setMessage("Error fetching patient report: " + error.message);
      setMessageType("error");
    } finally {
      setIsValidating(false);
    }
  };

  const handlePatientIdChange = (e) => {
    const id = e.target.value;
    setPatientId(id);
    
    // Debounce search
    if (id.length >= 3) {
      setTimeout(() => {
        validateAndFetchReport(id);
      }, 500);
    } else {
      setPatientData(null);
      setMessage("");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!patientData) return;

    const reportContent = `
PATIENT REPORT - ALZHEIMER'S DETECTION SYSTEM
===============================================

PATIENT INFORMATION
-------------------
Patient ID: ${patientData.patient.patientId}
Full Name: ${patientData.patient.fullName}
Age: ${patientData.patient.age}
Gender: ${patientData.patient.gender}
Phone: ${patientData.patient.phone}
Address: ${patientData.patient.address}
Relative Name: ${patientData.patient.relativeName}
Relative Phone: ${patientData.patient.relativeNumber}
Medical History: ${patientData.patient.medicalHistory || "N/A"}
Registration Date: ${new Date(patientData.patient.registrationDate).toLocaleDateString()}

MMSE ASSESSMENTS
----------------
${
  patientData.mmseAssessments.length > 0
    ? patientData.mmseAssessments
        .map(
          (assessment, idx) => `
Assessment ${idx + 1}:
  Date: ${new Date(assessment.assessmentDate).toLocaleDateString()}
  Total Score: ${assessment.totalScore}/30
  Risk Level: ${assessment.riskLevel}
  Details:
    - Orientation: ${assessment.mmseScores.orientation}/10
    - Memory: ${assessment.mmseScores.memory}/3
    - Attention: ${assessment.mmseScores.attention}/5
    - Recall: ${assessment.mmseScores.recall}/3
    - Language: ${assessment.mmseScores.language}/8
    - Visual-Spatial: ${assessment.mmseScores.visual}/1
`
        )
        .join("\n")
    : "No MMSE assessments available"
}

MRI SCANS
---------
${
  patientData.mriScans.length > 0
    ? patientData.mriScans
        .map(
          (scan, idx) => `
Scan ${idx + 1}:
  Upload Date: ${new Date(scan.uploadDate).toLocaleDateString()}
  Predicted Class: ${scan.predictedClass}
  Confidence: ${scan.confidence.toFixed(2)}%
  Model Version: ${scan.modelVersion}
`
        )
        .join("\n")
    : "No MRI scans available"
}

SUMMARY
-------
Total MMSE Assessments: ${patientData.mmseAssessments.length}
Total MRI Scans: ${patientData.mriScans.length}
${patientData.mmseAssessments.length > 0 ? `Latest Risk Level: ${patientData.mmseAssessments[0].riskLevel}` : ''}
${patientData.mriScans.length > 0 ? `Latest MRI Prediction: ${patientData.mriScans[0].predictedClass}` : ''}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(reportContent)
    );
    element.setAttribute(
      "download",
      `Report_${patientData.patient.patientId}_${new Date().toISOString().split("T")[0]}.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📄 Patient Reports
      </h2>

      {/* Search Section */}
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-2">
          Search Patient <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={patientId}
            onChange={handlePatientIdChange}
            placeholder="Enter Patient ID (e.g., PID101-johnsmith)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          {isValidating && (
            <div className="flex items-center gap-2 text-indigo-600">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Fetching...</span>
            </div>
          )}
        </div>
        {message && (
          <div
            className={`mt-3 p-3 rounded-lg ${
              messageType === "error"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Report Display */}
      {patientData && (
        <div className="print:p-8">
          {/* Action Buttons - Hide on print */}
          <div className="flex gap-4 mb-6 print:hidden">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>🖨️</span> Print Report
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <span>⬇️</span> Download Report
            </button>
          </div>

          {/* Patient Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg mb-6 border border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>👤</span> Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Patient ID:</p>
                <p className="font-semibold text-gray-800 text-lg">
                  {patientData.patient.patientId}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Full Name:</p>
                <p className="font-semibold text-gray-800 text-lg">
                  {patientData.patient.fullName}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Age:</p>
                <p className="font-semibold text-gray-800">
                  {patientData.patient.age} years
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Gender:</p>
                <p className="font-semibold text-gray-800">
                  {patientData.patient.gender}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Phone:</p>
                <p className="font-semibold text-gray-800">
                  {patientData.patient.phone}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Registration Date:</p>
                <p className="font-semibold text-gray-800">
                  {new Date(patientData.patient.registrationDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-white p-3 rounded md:col-span-2">
                <p className="text-gray-600 text-sm">Address:</p>
                <p className="font-semibold text-gray-800">
                  {patientData.patient.address}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Relative Name:</p>
                <p className="font-semibold text-gray-800">
                  {patientData.patient.relativeName}
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-sm">Relative Phone:</p>
                <p className="font-semibold text-gray-800">
                  {patientData.patient.relativeNumber}
                </p>
              </div>
              {patientData.patient.medicalHistory && (
                <div className="bg-white p-3 rounded md:col-span-2">
                  <p className="text-gray-600 text-sm">Medical History:</p>
                  <p className="font-semibold text-gray-800">
                    {patientData.patient.medicalHistory}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* MMSE Assessments Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🧩</span> MMSE Assessment History
            </h3>
            {patientData.mmseAssessments.length > 0 ? (
              <div className="space-y-4">
                {patientData.mmseAssessments.map((assessment, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">
                          Assessment #{idx + 1}
                        </p>
                        <p className="font-semibold text-gray-800 text-lg">
                          {new Date(
                            assessment.assessmentDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          assessment.riskLevel === "Low"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : assessment.riskLevel === "Medium"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {assessment.riskLevel} Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                        <p className="text-gray-600 font-semibold">Total Score</p>
                        <p className="font-bold text-2xl text-indigo-600">
                          {assessment.totalScore}/30
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Orientation</p>
                        <p className="font-bold text-xl">
                          {assessment.mmseScores.orientation}/10
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Memory</p>
                        <p className="font-bold text-xl">
                          {assessment.mmseScores.memory}/3
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Attention</p>
                        <p className="font-bold text-xl">
                          {assessment.mmseScores.attention}/5
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Recall</p>
                        <p className="font-bold text-xl">
                          {assessment.mmseScores.recall}/3
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Language</p>
                        <p className="font-bold text-xl">
                          {assessment.mmseScores.language}/8
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Visual-Spatial</p>
                        <p className="font-bold text-xl">
                          {assessment.mmseScores.visual}/1
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-center">
                  No MMSE assessments available for this patient
                </p>
              </div>
            )}
          </div>

          {/* MRI Scans Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🧠</span> MRI Scan History
            </h3>
            {patientData.mriScans.length > 0 ? (
              <div className="space-y-4">
                {patientData.mriScans.map((scan, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">
                          Scan #{idx + 1}
                        </p>
                        <p className="font-semibold text-gray-800 text-lg">
                          {new Date(scan.uploadDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-semibold">Confidence</p>
                        <p className="font-bold text-2xl text-indigo-600">
                          {scan.confidence.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                        <p className="text-gray-600 text-sm font-semibold mb-1">
                          Predicted Class
                        </p>
                        <p className="font-bold text-xl text-indigo-700">
                          {scan.predictedClass}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-gray-600 text-sm font-semibold mb-1">
                          Model Version
                        </p>
                        <p className="font-semibold text-sm text-gray-700">
                          {scan.modelVersion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-center">
                  No MRI scans available for this patient
                </p>
              </div>
            )}
          </div>

          {/* Report Summary */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📋 Report Summary
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className="text-gray-700">
                  <strong>Total MMSE Assessments:</strong>{" "}
                  <span className="text-indigo-600 font-bold">
                    {patientData.mmseAssessments.length}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Total MRI Scans:</strong>{" "}
                  <span className="text-indigo-600 font-bold">
                    {patientData.mriScans.length}
                  </span>
                </p>
                {patientData.mmseAssessments.length > 0 && (
                  <p className="text-gray-700">
                    <strong>Latest Risk Level:</strong>{" "}
                    <span
                      className={`font-bold ${
                        patientData.mmseAssessments[0].riskLevel === "Low"
                          ? "text-green-600"
                          : patientData.mmseAssessments[0].riskLevel === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {patientData.mmseAssessments[0].riskLevel}
                    </span>
                  </p>
                )}
                {patientData.mriScans.length > 0 && (
                  <p className="text-gray-700">
                    <strong>Latest MRI Prediction:</strong>{" "}
                    <span className="font-bold text-indigo-600">
                      {patientData.mriScans[0].predictedClass}
                    </span>
                  </p>
                )}
              </div>
              <p className="mt-4 text-xs text-gray-600 border-t border-blue-200 pt-3">
                <strong>Report Generated:</strong> {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {!patientData && !message && !isValidating && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">
            Enter a Patient ID to view the comprehensive report
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Format: PID###-firstname (e.g., PID101-johnsmith)
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;