import React, { useState } from 'react';

const ExistingPatientForm = () => {
  const navigate = (path) => {
    console.log(`Navigation to: ${path}`);
    // In actual implementation, use your router's navigate function
  };
  const [searchForm, setSearchForm] = useState({
    patientId: '',
    fullName: '',
    phone: ''
  });
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const searchPatient = async () => {
    setLoading(true);
    setError('');
    setPatientData(null);

    try {
      const response = await fetch('http://localhost:5000/api/patients/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchForm),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.patient) {
          setPatientData(data.patient);
        } else {
          setError('No patient found matching the provided criteria.');
        }
      } else {
        setError(data.message || 'Error searching for patient');
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getAlzheimerStatus = (patient) => {
    if (!patient.mriData && !patient.mmseData) {
      return { status: 'No Assessment', color: '#666', message: 'No MRI or MMSE data available' };
    }

    let riskFactors = 0;
    let details = [];

    // MRI Analysis
    if (patient.mriData) {
      const cdr = parseFloat(patient.mriData.cdrValue);
      if (cdr >= 1) {
        riskFactors += 2;
        details.push(`CDR: ${cdr} (High risk)`);
      } else if (cdr >= 0.5) {
        riskFactors += 1;
        details.push(`CDR: ${cdr} (Moderate risk)`);
      } else {
        details.push(`CDR: ${cdr} (Low risk)`);
      }

      if (patient.mriData.dementiaClass === 'Demented') {
        riskFactors += 2;
        details.push('MRI Classification: Demented');
      } else if (patient.mriData.dementiaClass === 'Mild') {
        riskFactors += 1;
        details.push('MRI Classification: Mild dementia');
      }
    }

    // MMSE Analysis
    if (patient.mmseData) {
      const mmse = parseInt(patient.mmseData.mmseScore);
      if (mmse <= 17) {
        riskFactors += 2;
        details.push(`MMSE Score: ${mmse} (Severe cognitive impairment)`);
      } else if (mmse <= 23) {
        riskFactors += 1;
        details.push(`MMSE Score: ${mmse} (Mild cognitive impairment)`);
      } else {
        details.push(`MMSE Score: ${mmse} (Normal cognition)`);
      }

      // Check symptoms
      const symptoms = [
        'confusion', 'disorientation', 'forgetfulness', 'difficultyTasks', 
        'memoryComplaints', 'behavioralProblems'
      ];
      const positiveSymptoms = symptoms.filter(s => patient.mmseData[s] === 'Yes');
      if (positiveSymptoms.length >= 4) {
        riskFactors += 1;
        details.push(`${positiveSymptoms.length} cognitive symptoms present`);
      }
    }

    if (riskFactors >= 3) {
      return { 
        status: 'High Risk - Alzheimer\'s Likely', 
        color: '#dc3545', 
        message: 'Multiple indicators suggest high probability of Alzheimer\'s disease',
        details 
      };
    } else if (riskFactors >= 1) {
      return { 
        status: 'Moderate Risk - Further Assessment Needed', 
        color: '#ffc107', 
        message: 'Some indicators present, recommend continued monitoring',
        details 
      };
    } else {
      return { 
        status: 'Low Risk - Normal Cognitive Function', 
        color: '#28a745', 
        message: 'Assessment results within normal ranges',
        details 
      };
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Search Existing Patient</h2>
        
        <div style={styles.searchForm}>
          <div style={styles.searchGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={searchForm.patientId}
                onChange={handleSearchChange}
                style={styles.input}
                placeholder="Enter Patient ID"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={searchForm.fullName}
                onChange={handleSearchChange}
                style={styles.input}
                placeholder="Enter Full Name"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={searchForm.phone}
                onChange={handleSearchChange}
                style={styles.input}
                placeholder="Enter Phone Number"
              />
            </div>
          </div>
          
          <div style={styles.buttonRow}>
            <button onClick={searchPatient} style={styles.buttonSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search Patient'}
            </button>
            <button onClick={handleCancel} style={styles.buttonCancel}>
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {patientData && (
          <div style={styles.resultContainer}>
            <h3 style={styles.resultTitle}>Patient Information</h3>
            
            {/* Basic Info */}
            <div style={styles.infoSection}>
              <h4 style={styles.sectionTitle}>Basic Information</h4>
              <div style={styles.infoGrid}>
                <div><strong>Patient ID:</strong> {patientData.patientId}</div>
                <div><strong>Name:</strong> {patientData.fullName}</div>
                <div><strong>DOB:</strong> {formatDate(patientData.dob)}</div>
                <div><strong>Gender:</strong> {patientData.gender}</div>
                <div><strong>Phone:</strong> {patientData.phone || 'N/A'}</div>
                <div><strong>Email:</strong> {patientData.email || 'N/A'}</div>
              </div>
              {patientData.address && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Address:</strong> {patientData.address}
                </div>
              )}
            </div>

            {/* Alzheimer's Assessment */}
            <div style={styles.assessmentSection}>
              <h4 style={styles.sectionTitle}>Alzheimer's Disease Assessment</h4>
              {(() => {
                const assessment = getAlzheimerStatus(patientData);
                return (
                  <div>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: assessment.color,
                    }}>
                      {assessment.status}
                    </div>
                    <p style={styles.assessmentMessage}>{assessment.message}</p>
                    {assessment.details && (
                      <div style={styles.detailsList}>
                        <strong>Assessment Details:</strong>
                        <ul>
                          {assessment.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* MRI Data */}
            {patientData.mriData && (
              <div style={styles.infoSection}>
                <h4 style={styles.sectionTitle}>MRI Scan Results</h4>
                <div style={styles.infoGrid}>
                  <div><strong>Scan Date:</strong> {formatDate(patientData.mriData.scanDate)}</div>
                  <div><strong>CDR Value:</strong> {patientData.mriData.cdrValue}</div>
                  <div><strong>Dementia Class:</strong> {patientData.mriData.dementiaClass}</div>
                  <div><strong>Scan File:</strong> {patientData.mriData.scanFile || 'N/A'}</div>
                </div>
                {patientData.mriData.comments && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Comments:</strong> {patientData.mriData.comments}
                  </div>
                )}
              </div>
            )}

            {/* MMSE Data */}
            {patientData.mmseData && (
              <div style={styles.infoSection}>
                <h4 style={styles.sectionTitle}>MMSE Assessment Results</h4>
                <div style={styles.infoGrid}>
                  <div><strong>MMSE Score:</strong> {patientData.mmseData.mmseScore}/30</div>
                  <div><strong>Functional Assessment:</strong> {patientData.mmseData.functionalAssessment}/10</div>
                  <div><strong>ADL Score:</strong> {patientData.mmseData.adl}/10</div>
                </div>
                
                <div style={styles.symptomsGrid}>
                  <h5>Symptoms Assessment:</h5>
                  <div style={styles.symptomsList}>
                    {[
                      { key: 'depression', label: 'Depression' },
                      { key: 'confusion', label: 'Confusion' },
                      { key: 'disorientation', label: 'Disorientation' },
                      { key: 'personalityChanges', label: 'Personality Changes' },
                      { key: 'forgetfulness', label: 'Forgetfulness' },
                      { key: 'difficultyTasks', label: 'Difficulty with Tasks' },
                      { key: 'memoryComplaints', label: 'Memory Complaints' },
                      { key: 'behavioralProblems', label: 'Behavioral Problems' },
                    ].map(symptom => (
                      <div key={symptom.key} style={{
                        ...styles.symptomItem,
                        backgroundColor: patientData.mmseData[symptom.key] === 'Yes' ? '#ffebee' : '#e8f5e8'
                      }}>
                        <strong>{symptom.label}:</strong> {patientData.mmseData[symptom.key]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '60px 24px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  formContainer: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '1000px',
  },
  title: {
    textAlign: 'center',
    color: '#5a189a',
    marginBottom: '24px',
    fontSize: '2rem',
  },
  searchForm: {
    marginBottom: '32px',
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
  },
  buttonSearch: {
    background: 'linear-gradient(90deg, #5a189a 0%, #9d4edd 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 38px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'background 0.3s',
  },
  buttonCancel: {
    background: '#fff',
    color: '#5a189a',
    border: '1.5px solid #9d4edd',
    borderRadius: '8px',
    padding: '14px 38px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    transition: 'background 0.3s',
  },
  errorMessage: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
    border: '1px solid #ef5350',
  },
  resultContainer: {
    border: '2px solid #5a189a',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: '#fafafa',
  },
  resultTitle: {
    color: '#5a189a',
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: '24px',
    padding: '16px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  assessmentSection: {
    marginBottom: '24px',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '2px solid #e0e0e0',
  },
  sectionTitle: {
    color: '#5a189a',
    fontSize: '1.2rem',
    marginBottom: '12px',
    borderBottom: '2px solid #e0c3fc',
    paddingBottom: '8px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    fontSize: '0.95rem',
  },
  statusBadge: {
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '25px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    textAlign: 'center',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  assessmentMessage: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '16px',
    fontStyle: 'italic',
  },
  detailsList: {
    background: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  symptomsGrid: {
    marginTop: '16px',
  },
  symptomsList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '12px',
  },
  symptomItem: {
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '1px solid #ddd',
  },
};

export default ExistingPatientForm;