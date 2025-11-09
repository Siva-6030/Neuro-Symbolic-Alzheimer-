import React, { useState } from "react";

const PatientDetailsForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    relativeName: "",
    relativeNumber: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [generatedPatientId, setGeneratedPatientId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.gender ||
      !formData.phone ||
      !formData.address ||
      !formData.relativeName ||
      !formData.relativeNumber
    ) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    // Phone validation
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setMessage("Phone number must be exactly 10 digits");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (formData.relativeNumber.length !== 10 || !/^\d+$/.test(formData.relativeNumber)) {
      setMessage("Relative's phone number must be exactly 10 digits");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
        setGeneratedPatientId(data.patientId);

        // Reset form
        setFormData({
          fullName: "",
          age: "",
          gender: "",
          phone: "",
          address: "",
          relativeName: "",
          relativeNumber: "",
          medicalHistory: "",
        });

        // Auto-hide message after 8 seconds
        setTimeout(() => {
          setMessage("");
          setGeneratedPatientId("");
        }, 8000);
      } else {
        setMessage(data.message || "Error adding patient");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      relativeName: "",
      relativeNumber: "",
      medicalHistory: "",
    });
    setMessage("");
    setGeneratedPatientId("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🏥 Add Patient Details
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            messageType === "success"
              ? "bg-green-100 border border-green-300 text-green-800"
              : "bg-red-100 border border-red-300 text-red-800"
          }`}
        >
          <p className="font-semibold">{message}</p>
          {generatedPatientId && (
            <p className="mt-2 font-bold text-lg">
              Patient ID: <span className="text-green-700">{generatedPatientId}</span>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter patient's full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
            min="1"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Format: 10 digits only</p>
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter patient's address"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        {/* Relative Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Relative Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="relativeName"
            value={formData.relativeName}
            onChange={handleChange}
            placeholder="Enter relative's name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        {/* Relative Number */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Relative's Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="relativeNumber"
            value={formData.relativeNumber}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Format: 10 digits only</p>
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Medical History (Optional)
          </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Enter any relevant medical history, medications, or conditions"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding Patient...
              </span>
            ) : (
              "Add Patient Details"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition transform hover:scale-105"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Note:</strong> Patient ID will be automatically generated in the format <code className="bg-blue-100 px-2 py-1 rounded">PID###-firstname</code>
        </p>
      </div>
    </div>
  );
};

export default PatientDetailsForm;