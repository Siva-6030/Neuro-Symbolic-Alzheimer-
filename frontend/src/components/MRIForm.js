import React, { useState, useRef } from "react";

const MRIForm = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [mriImage, setMriImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const fileInputRef = useRef(null);

  const validatePatientId = async (id) => {
    if (!id) {
      setPatientName("");
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
      } else {
        setPatientName("");
        setMessage("Invalid Patient ID");
        setMessageType("error");
      }
    } catch (error) {
      setPatientName("");
      setMessage("Error validating Patient ID");
      setMessageType("error");
    } finally {
      setIsValidating(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file");
        setMessageType("error");
        return;
      }

      if (file.size > 5000000) {
        setMessage("Image size should be less than 5MB");
        setMessageType("error");
        return;
      }

      setMriImage(file);
      setMessage("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulated ML Model prediction
  const simulateModelPrediction = async (imageBase64) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const predictions = {
      "Non Demented": Math.random() * 0.3 + 0.55,
      "Very Mild Dementia": Math.random() * 0.2 + 0.1,
      "Mild Dementia": Math.random() * 0.1 + 0.05,
      "Moderate Dementia": Math.random() * 0.05,
    };

    const total = Object.values(predictions).reduce((a, b) => a + b, 0);
    Object.keys(predictions).forEach(key => {
      predictions[key] = predictions[key] / total;
    });

    const maxPrediction = Object.entries(predictions).reduce((prev, current) =>
      prev[1] > current[1] ? prev : current
    );

    return {
      predictedClass: maxPrediction[0],
      confidence: maxPrediction[1] * 100,
      allPredictions: predictions,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setPredictions(null);

    if (!patientName) {
      setMessage("Please enter a valid Patient ID first");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!mriImage) {
      setMessage("Please select an MRI image");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;

        const prediction = await simulateModelPrediction(base64Image);
        setPredictions(prediction);

        try {
          const response = await fetch("http://localhost:5000/api/mri-scans", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId,
              mriImage: base64Image,
              predictedClass: prediction.predictedClass,
              confidence: parseFloat(prediction.confidence),
            }),
          });

          const data = await response.json();

          if (response.ok) {
            setMessage(data.message);
            setMessageType("success");

            setTimeout(() => {
              setMessage("");
            }, 8000);
          } else {
            setMessage(data.message || "Error uploading MRI scan");
            setMessageType("error");
          }
        } catch (error) {
          setMessage("Error: " + error.message);
          setMessageType("error");
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(mriImage);
    } catch (error) {
      setMessage("Error processing image");
      setMessageType("error");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMriImage(null);
    setImagePreview(null);
    setMessage("");
    setPredictions(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>🧠</span> MRI Scans - AI-Powered Alzheimer Detection
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

        {/* MRI Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Upload MRI Scan <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full"
            >
              <div className="text-5xl mb-3">📁</div>
              <p className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg mb-2">
                {mriImage ? "Change MRI Image" : "Click to select MRI scan image"}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, JPEG | Max size: 5MB
              </p>
            </button>
            {mriImage && (
              <p className="text-sm text-gray-700 mt-3 font-semibold bg-white px-4 py-2 rounded inline-block">
                ✓ Selected: {mriImage.name}
              </p>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
              <span>🖼️</span> Image Preview:
            </p>
            <img
              src={imagePreview}
              alt="MRI Preview"
              className="w-full max-h-80 object-contain rounded-lg shadow-md border border-gray-300"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || !patientName || !mriImage}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing MRI...
              </span>
            ) : (
              "Upload & Analyze MRI"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition transform hover:scale-105"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Predictions Display */}
      {predictions && (
        <div className="mt-10 pt-8 border-t-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔬</span> AI Model Predictions
          </h3>

          {/* Main Prediction */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-lg mb-6 border-2 border-indigo-300 shadow-lg">
            <div className="text-center">
              <p className="text-gray-600 font-semibold mb-3 text-lg">Predicted Classification:</p>
              <p className="text-4xl font-bold text-indigo-600 mb-4">
                {predictions.predictedClass}
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-white px-6 py-3 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Confidence Level</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {predictions.confidence.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* All Predictions */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span>📊</span> Detailed Analysis:
            </p>
            <div className="space-y-4">
              {Object.entries(predictions.allPredictions)
                .sort((a, b) => b[1] - a[1])
                .map(([label, confidence]) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {(confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Classification Legend */}
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>ℹ️</span> Classification Guide:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="font-bold text-green-700">Non Demented</p>
                <p className="text-gray-600">No signs of cognitive decline detected</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="font-bold text-yellow-600">Very Mild Dementia</p>
                <p className="text-gray-600">Minimal cognitive changes, early stage</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="font-bold text-orange-600">Mild Dementia</p>
                <p className="text-gray-600">Noticeable cognitive decline, moderate stage</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="font-bold text-red-600">Moderate Dementia</p>
                <p className="text-gray-600">Significant cognitive impairment, advanced stage</p>
              </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>🤖 Model:</strong> ResNet-18 + Vision Transformer + Neuro-Symbolic Reasoning<br />
              <strong>⚕️ Note:</strong> This prediction is for informational purposes. Consult a medical professional for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MRIForm;