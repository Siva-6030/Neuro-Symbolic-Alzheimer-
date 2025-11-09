import React, { useState, useEffect } from "react";

const MMSEForm = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const [formData, setFormData] = useState({
    orientation: "",
    memory: "",
    attention: "",
    recall: "",
    language: "",
    visual: "",
  });

  const [pastAssessments, setPastAssessments] = useState([]);

  const validatePatientId = async (id) => {
    if (!id) {
      setPatientName("");
      setPastAssessments([]);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/validate-patient/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setPatientName(data.fullName);
        setMessage("");
        fetchPastAssessments(id);
      } else {
        setPatientName("");
        setMessage("Invalid Patient ID");
        setMessageType("error");
        setPastAssessments([]);
      }
    } catch (error) {
      setPatientName("");
      setMessage("Error validating Patient ID");
      setMessageType("error");
      setPastAssessments([]);
    } finally {
      setIsValidating(false);
    }
  };

  const fetchPastAssessments = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/mmse-assessments/${id}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setPastAssessments(data);
      } else {
        setPastAssessments([]);
      }
    } catch (error) {
      setPastAssessments([]);
    }
  };

  const handlePatientIdChange = (e) => {
    const id = e.target.value;
    setPatientId(id);
    
    if (id.length >= 3) {
      setTimeout(() => {
        validatePatientId(id);
      }, 500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateRiskLevel = (total) => {
    if (total >= 24) return "Low";
    if (total >= 18) return "Medium";
    return "High";
  };

  const getTotalScore = () => {
    return Object.values(formData).reduce(
      (sum, val) => sum + (val ? parseInt(val) : 0),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate all fields are filled
    if (Object.values(formData).some((val) => val === "")) {
      setMessage("Please fill in all MMSE scores");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!patientName) {
      setMessage("Please enter a valid Patient ID first");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const totalScore = getTotalScore();
    const riskLevel = calculateRiskLevel(totalScore);

    const assessmentData = {
      patientId,
      mmseScores: {
        orientation: parseInt(formData.orientation),
        memory: parseInt(formData.memory),
        attention: parseInt(formData.attention),
        recall: parseInt(formData.recall),
        language: parseInt(formData.language),
        visual: parseInt(formData.visual),
      },
      totalScore,
      riskLevel,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/mmse-assessments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assessmentData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");

        fetchPastAssessments(patientId);

        setFormData({
          orientation: "",
          memory: "",
          attention: "",
          recall: "",
          language: "",
          visual: "",
        });

        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else {
        setMessage(data.message || "Error saving MMSE assessment");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const scoreFields = [
    { label: "Orientation", name: "orientation", max: 10, description: "Time and place awareness" },
    { label: "Memory", name: "memory", max: 3, description: "Registration of words" },
    { label: "Attention", name: "attention", max: 5, description: "Calculation and focus" },
    { label: "Recall", name: "recall", max: 3, description: "Short-term memory" },
    { label: "Language", name: "language", max: 8, description: "Naming and repetition" },
    { label: "Visual-Spatial", name: "visual", max: 1, description: "Drawing ability" },
  ];

  const totalScore = getTotalScore();
  const currentRisk = calculateRiskLevel(totalScore);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>🧩</span> MMSE (Mini-Mental State Examination)
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          <p className="font-semibold">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient ID Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Patient ID <span className="text-red-500">*</span>
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
                Validating...
              </div>
            )}
          </div>
          {patientName && (
            <p className="mt-2 text-green-600 font-semibold flex items-center gap-2">
              <span>✓</span> Patient: {patientName}
            </p>
          )}
        </div>

        {/* MMSE Score Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scoreFields.map((field) => (
            <div key={field.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label} (0-{field.max})
                <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">{field.description}</p>
              <input
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                min="0"
                max={field.max}
                placeholder={`0 to ${field.max}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
          ))}
        </div>

        {/* Display Total Score Preview */}
        {Object.values(formData).some((val) => val !== "") && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-1">Total Score</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {totalScore}/30
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-1">Risk Level</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${
                    currentRisk === "Low"
                      ? "bg-green-100 text-green-800"
                      : currentRisk === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentRisk}
                </span>
              </div>
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-1">Percentage</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {((totalScore / 30) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Risk Interpretation:</strong>
                {currentRisk === "Low" && " Normal cognitive function (Score ≥ 24)"}
                {currentRisk === "Medium" && " Mild cognitive impairment (Score 18-23)"}
                {currentRisk === "High" && " Significant cognitive decline (Score < 18)"}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || !patientName}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving Assessment...
              </span>
            ) : (
              "Save MMSE Assessment"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                orientation: "",
                memory: "",
                attention: "",
                recall: "",
                language: "",
                visual: "",
              });
              setMessage("");
            }}
            className="flex-1 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition transform hover:scale-105"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Past Assessments */}
      {pastAssessments.length > 0 && (
        <div className="mt-10 pt-8 border-t-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span> Past Assessments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-blue-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-indigo-300">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-indigo-300">Total Score</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-indigo-300">Risk Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-indigo-300">Details</th>
                </tr>
              </thead>
              <tbody>
                {pastAssessments.map((assessment, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-indigo-600">
                      {assessment.totalScore}/30
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          assessment.riskLevel === "Low"
                            ? "bg-green-100 text-green-800"
                            : assessment.riskLevel === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assessment.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      O:{assessment.mmseScores.orientation} | 
                      M:{assessment.mmseScores.memory} | 
                      A:{assessment.mmseScores.attention} | 
                      R:{assessment.mmseScores.recall} | 
                      L:{assessment.mmseScores.language} | 
                      V:{assessment.mmseScores.visual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MMSEForm;