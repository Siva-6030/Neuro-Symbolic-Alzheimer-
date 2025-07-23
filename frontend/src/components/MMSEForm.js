import React, { useState, useEffect } from 'react';

const MMSEForm = () => {
  const [form, setForm] = useState({
    patientId: '',
    gender: '',
    ethnicity: '',
    educationLevel: '',
    familyHistoryAlzheimers: '',
    cardiovascularDisease: '',
    diabetes: '',
    depression: '',
    headInjury: '',
    hypertension: '',
    mmseScore: '',
    functionalAssessment: '',
    adl: '',
    memoryComplaints: '',
    behavioralProblems: '',
    confusion: '',
    disorientation: '',
    personalityChanges: '',
    difficultyCompletingTasks: '',
    forgetfulness: ''
  });

  const [patientName, setPatientName] = useState('');
  const [patientIdError, setPatientIdError] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [riskFactors, setRiskFactors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [assessments, setAssessments] = useState([]);

  const requiredFields = [
    'patientId', 'gender', 'ethnicity', 'educationLevel', 'mmseScore',
    'functionalAssessment', 'adl', 'familyHistoryAlzheimers', 'cardiovascularDisease',
    'diabetes', 'depression', 'headInjury', 'hypertension', 'memoryComplaints',
    'behavioralProblems', 'confusion', 'disorientation', 'personalityChanges',
    'difficultyCompletingTasks', 'forgetfulness'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    if (name === 'patientId') {
      setPatientIdError('');
      validatePatientId(value);
    }
  };

  const handleRadio = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePatientId = async (patientId) => {
    if (!patientId) {
      setPatientIdError('Patient ID is required');
      setPatientName('');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/validate-patient/${patientId}`);
      const data = await response.json();
      if (response.ok) {
        setPatientName(data.fullName);
        setPatientIdError('');
        // Fetch past assessments for this patient
        fetchAssessments(patientId);
      } else {
        setPatientIdError(data.message || 'Invalid Patient ID');
        setPatientName('');
        setAssessments([]);
      }
    } catch (error) {
      setPatientIdError('Error validating Patient ID');
      setPatientName('');
      setAssessments([]);
    }
  };

  const fetchAssessments = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mmse-assessments/${patientId}`);
      const data = await response.json();
      if (response.ok) {
        setAssessments(data);
      } else {
        setAssessments([]);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setAssessments([]);
    }
  };

  const calculateDiagnosis = (formData) => {
    let riskScore = 0;
    const factors = [];

    if (parseInt(formData.mmseScore) < 24) {
      riskScore += 3;
      factors.push('Low MMSE Score (< 24)');
    }
    if (parseInt(formData.functionalAssessment) < 6) {
      riskScore += 2;
      factors.push('Poor Functional Assessment');
    }
    if (parseInt(formData.adl) < 6) {
      riskScore += 2;
      factors.push('Impaired Activities of Daily Living');
    }

    if (formData.memoryComplaints === '1') {
      riskScore += 1;
      factors.push('Memory Complaints');
    }
    if (formData.confusion === '1') {
      riskScore += 1;
      factors.push('Confusion');
    }
    if (formData.disorientation === '1') {
      riskScore += 1;
      factors.push('Disorientation');
    }
    if (formData.forgetfulness === '1') {
      riskScore += 1;
      factors.push('Forgetfulness');
    }
    if (formData.difficultyCompletingTasks === '1') {
      riskScore += 1;
      factors.push('Difficulty Completing Tasks');
    }
    if (formData.personalityChanges === '1') {
      riskScore += 1;
      factors.push('Personality Changes');
    }
    if (formData.behavioralProblems === '1') {
      riskScore += 1;
      factors.push('Behavioral Problems');
    }

    if (formData.familyHistoryAlzheimers === '1') {
      riskScore += 2;
      factors.push('Family History of Alzheimer\'s');
    }
    if (formData.cardiovascularDisease === '1') {
      riskScore += 1;
      factors.push('Cardiovascular Disease');
    }
    if (formData.diabetes === '1') {
      riskScore += 1;
      factors.push('Diabetes');
    }
    if (formData.depression === '1') {
      riskScore += 1;
      factors.push('Depression');
    }
    if (formData.headInjury === '1') {
      riskScore += 1;
      factors.push('History of Head Injury');
    }

    return {
      diagnosis: riskScore >= 6 ? 1 : 0,
      riskScore,
      factors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = requiredFields.filter(field => !form[field] || form[field] === '');
    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate patient ID
    if (!patientName) {
      setPatientIdError('Please enter a valid Patient ID');
      return;
    }

    const result = calculateDiagnosis(form);
    setDiagnosis(result.diagnosis);
    setRiskFactors(result.factors);

    const mongoData = {
      patientId: form.patientId,
      gender: parseInt(form.gender),
      ethnicity: parseInt(form.ethnicity),
      educationLevel: parseInt(form.educationLevel),
      familyHistoryAlzheimers: parseInt(form.familyHistoryAlzheimers),
      cardiovascularDisease: parseInt(form.cardiovascularDisease),
      diabetes: parseInt(form.diabetes),
      depression: parseInt(form.depression),
      headInjury: parseInt(form.headInjury),
      hypertension: parseInt(form.hypertension),
      mmse: parseInt(form.mmseScore),
      functionalAssessment: parseInt(form.functionalAssessment),
      adl: parseInt(form.adl),
      memoryComplaints: parseInt(form.memoryComplaints),
      behavioralProblems: parseInt(form.behavioralProblems),
      confusion: parseInt(form.confusion),
      disorientation: parseInt(form.disorientation),
      personalityChanges: parseInt(form.personalityChanges),
      difficultyCompletingTasks: parseInt(form.difficultyCompletingTasks),
      forgetfulness: parseInt(form.forgetfulness),
      diagnosis: result.diagnosis,
      assessmentDate: new Date(),
      riskScore: result.riskScore
    };

    try {
      const response = await fetch('http://localhost:5000/api/mmse-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mongoData),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        // Refresh assessments
        fetchAssessments(form.patientId);
      } else {
        setError(data.message || 'Error saving assessment');
      }
    } catch (error) {
      setError('Error saving assessment');
    }
  };

  const handleCancel = () => {
    setForm({
      patientId: '', gender: '', ethnicity: '', educationLevel: '',
      familyHistoryAlzheimers: '', cardiovascularDisease: '',
      diabetes: '', depression: '', headInjury: '', hypertension: '',
      mmseScore: '', functionalAssessment: '', adl: '',
      memoryComplaints: '', behavioralProblems: '', confusion: '',
      disorientation: '', personalityChanges: '', difficultyCompletingTasks: '',
      forgetfulness: ''
    });
    setPatientName('');
    setPatientIdError('');
    setIsSubmitted(false);
    setDiagnosis(null);
    setRiskFactors([]);
    setError('');
    setAssessments([]);
  };

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <h2 style={styles.resultTitle}>Assessment Results for {patientName}</h2>
          <div style={styles.diagnosisSection}>
            <div style={{
              ...styles.diagnosisBox,
              backgroundColor: diagnosis === 1 ? '#ffe6e6' : '#e6f7e6',
              borderColor: diagnosis === 1 ? '#ff4444' : '#44aa44'
            }}>
              <h3 style={{
                color: diagnosis === 1 ? '#cc0000' : '#006600',
                marginBottom: '8px'
              }}>
                {diagnosis === 1 ? '⚠️ High Risk for Alzheimer\'s Disease' : '✅ Low Risk for Alzheimer\'s Disease'}
              </h3>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>
                {diagnosis === 1 
                  ? 'Based on the assessment, the patient shows indicators suggesting higher risk for Alzheimer\'s disease. Further medical evaluation is recommended.'
                  : 'Based on the assessment, the patient shows lower risk indicators for Alzheimer\'s disease. Continue regular health monitoring.'
                }
              </p>
            </div>
          </div>
          
          {riskFactors.length > 0 && (
            <div style={styles.riskFactorsSection}>
              <h4 style={styles.sectionTitle}>Identified Risk Factors:</h4>
              <div style={styles.riskFactorsList}>
                {riskFactors.map((factor, index) => (
                  <span key={index} style={styles.riskFactorTag}>
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {assessments.length > 0 && (
            <div style={styles.assessmentsSection}>
              <h4 style={styles.sectionTitle}>Previous Assessments:</h4>
              <div style={styles.assessmentsList}>
                {assessments.map((assessment, index) => (
                  <div key={index} style={styles.assessmentItem}>
                    <p><strong>Date:</strong> {new Date(assessment.assessmentDate).toLocaleDateString()}</p>
                    <p><strong>Risk Score:</strong> {assessment.riskScore}</p>
                    <p><strong>Diagnosis:</strong> {assessment.diagnosis === 1 ? 'High Risk' : 'Low Risk'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={styles.buttonRow}>
            <button style={styles.buttonSubmit} onClick={handleCancel}>
              New Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>Comprehensive MMSE & Alzheimer's Risk Assessment</h2>
        {error && <div style={styles.error}>{error}</div>}
        {patientIdError && <div style={styles.error}>{patientIdError}</div>}
        {patientName && (
          <div style={styles.infoBox}>
            Patient: {patientName}
          </div>
        )}
        
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Patient Information</h3>
          <div style={styles.grid}>
            <div style={styles.fieldFull}>
              <label style={styles.label}>Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter Patient ID"
                required
              />
            </div>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={styles.select} required>
                <option value="">Select Gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Ethnicity</label>
              <select name="ethnicity" value={form.ethnicity} onChange={handleChange} style={styles.select} required>
                <option value="">Select Ethnicity</option>
                <option value="0">Caucasian</option>
                <option value="1">African American</option>
                <option value="2">Asian</option>
                <option value="3">Other</option>
              </select>
            </div>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Education Level</label>
              <select name="educationLevel" value={form.educationLevel} onChange={handleChange} style={styles.select} required>
                <option value="">Select Education</option>
                <option value="0">None</option>
                <option value="1">High School</option>
                <option value="2">Bachelor's</option>
                <option value="3">Higher</option>
              </select>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Medical History</h3>
          <div style={styles.symptomGrid}>
            {[
              { name: 'familyHistoryAlzheimers', label: 'Family History of Alzheimer\'s' },
              { name: 'cardiovascularDisease', label: 'Cardiovascular Disease' },
              { name: 'diabetes', label: 'Diabetes' },
              { name: 'depression', label: 'Depression' },
              { name: 'headInjury', label: 'History of Head Injury' },
              { name: 'hypertension', label: 'Hypertension' }
            ].map((item) => (
              <div key={item.name} style={styles.radioField}>
                <label style={styles.label}>{item.label}</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={item.name}
                      value="0"
                      checked={form[item.name] === '0'}
                      onChange={() => handleRadio(item.name, '0')}
                      required
                    /> No
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={item.name}
                      value="1"
                      checked={form[item.name] === '1'}
                      onChange={() => handleRadio(item.name, '1')}
                    /> Yes
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Cognitive Assessment Scores</h3>
          <div style={styles.grid}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>MMSE Score (0-30)</label>
              <input
                type="number"
                name="mmseScore"
                min="0"
                max="30"
                value={form.mmseScore}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Functional Assessment (0-10)</label>
              <input
                type="number"
                name="functionalAssessment"
                min="0"
                max="10"
                value={form.functionalAssessment}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>ADL Score (0-10)</label>
              <input
                type="number"
                name="adl"
                min="0"
                max="10"
                value={form.adl}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Cognitive & Behavioral Symptoms</h3>
          <div style={styles.symptomGrid}>
            {[
              { name: 'memoryComplaints', label: 'Memory Complaints' },
              { name: 'behavioralProblems', label: 'Behavioral Problems' },
              { name: 'confusion', label: 'Confusion' },
              { name: 'disorientation', label: 'Disorientation' },
              { name: 'personalityChanges', label: 'Personality Changes' },
              { name: 'difficultyCompletingTasks', label: 'Difficulty Completing Tasks' },
              { name: 'forgetfulness', label: 'Forgetfulness' }
            ].map((item) => (
              <div key={item.name} style={styles.radioField}>
                <label style={styles.label}>{item.label}</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={item.name}
                      value="0"
                      checked={form[item.name] === '0'}
                      onChange={() => handleRadio(item.name, '0')}
                      required
                    /> No
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={item.name}
                      value="1"
                      checked={form[item.name] === '1'}
                      onChange={() => handleRadio(item.name, '1')}
                    /> Yes
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {assessments.length > 0 && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Previous Assessments for {patientName}</h3>
            <div style={styles.assessmentsList}>
              {assessments.map((assessment, index) => (
                <div key={index} style={styles.assessmentItem}>
                  <p><strong>Date:</strong> {new Date(assessment.assessmentDate).toLocaleDateString()}</p>
                  <p><strong>Risk Score:</strong> {assessment.riskScore}</p>
                  <p><strong>Diagnosis:</strong> {assessment.diagnosis === 1 ? 'High Risk' : 'Low Risk'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={styles.buttonRow}>
          <button onClick={handleSubmit} style={styles.buttonSubmit}>
            Complete Assessment
          </button>
          <button onClick={handleCancel} style={styles.buttonCancel}>
            Clear Form
          </button>
        </div>
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
    padding: '40px 24px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  form: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '900px',
  },
  title: {
    textAlign: 'center',
    color: '#5a189a',
    marginBottom: '32px',
    fontSize: '2.2rem',
    fontWeight: 'bold',
  },
  infoBox: {
    background: '#f3e9ff',
    color: '#5a189a',
    border: '1px solid #dcdcdc',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    marginBottom: '24px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '32px',
    padding: '24px',
    background: 'rgba(240,235,255,0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(157,78,221,0.2)',
  },
  sectionTitle: {
    color: '#5a189a',
    fontSize: '1.4rem',
    marginBottom: '20px',
    fontWeight: 'bold',
    borderBottom: '2px solid #9d4edd',
    paddingBottom: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  fieldFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
  },
  fieldHalf: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.95rem',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    background: 'white',
    cursor: 'pointer',
  },
  symptomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  radioField: {
    display: 'flex',
    flexDirection: 'column',
    background: '#f8f4ff',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e8d8ff',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '8px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '2px solid #e8d8ff',
  },
  buttonSubmit: {
    background: 'linear-gradient(90deg, #5a189a 0%, #9d4edd 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '16px 40px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(157,78,221,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonCancel: {
    background: '#fff',
    color: '#5a189a',
    border: '2px solid #9d4edd',
    borderRadius: '10px',
    padding: '16px 40px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  resultCard: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '700px',
    textAlign: 'center',
  },
  resultTitle: {
    color: '#5a189a',
    fontSize: '2.2rem',
    marginBottom: '32px',
    fontWeight: 'bold',
  },
  diagnosisSection: {
    marginBottom: '32px',
  },
  diagnosisBox: {
    padding: '24px',
    borderRadius: '12px',
    border: '2px solid',
    marginBottom: '20px',
  },
  riskFactorsSection: {
    marginBottom: '32px',
    textAlign: 'left',
  },
  riskFactorsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
  riskFactorTag: {
    background: '#ffe6e6',
    color: '#cc0000',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    border: '1px solid #ffcccc',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#cc0000',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  assessmentsSection: {
    marginBottom: '32px',
    textAlign: 'left',
  },
  assessmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  assessmentItem: {
    background: '#f8f4ff',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e8d8ff',
  },
};

export default MMSEForm;