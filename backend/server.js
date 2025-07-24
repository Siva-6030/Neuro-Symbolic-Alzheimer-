import React, { useState } from 'react';

const NewPatientForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    medicalConditions: '',
    symptoms: '',
  });
  const [error, setError] = useState('');
  const [patientId, setPatientId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setPatientId(''); // Clear patient ID on form change
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPatientId('');

    // Client-side validation for all fields
    const allFields = ['fullName', 'dob', 'gender', 'email', 'phone', 'address', 'guardianName', 'medicalConditions', 'symptoms'];
    const emptyFields = allFields.filter(field => !formData[field] || formData[field].trim() === '');
    if (emptyFields.length > 0) {
      setError(`Please fill in the following fields: ${emptyFields.join(', ')}`);
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    // Validate phone format
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setPatientId(result.patientId);
        alert(`Patient registered successfully!\nPatient ID: ${result.patientId}`);
        setFormData({
          fullName: '',
          dob: '',
          gender: 'Male',
          email: '',
          phone: '',
          address: '',
          guardianName: '',
          medicalConditions: '',
          symptoms: '',
        });
        setError('');
      } else {
        setError(result.message || 'Error registering patient');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error registering patient. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Register New Patient</h2>
        <div style={styles.infoBox}>
          Patient ID and Registration Date will be auto-generated.
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {patientId && (
          <div style={styles.success}>
            Patient registered successfully! Patient ID: <strong>{patientId}</strong>
          </div>
        )}
        <div style={styles.grid}>
          <div style={styles.field}>
            <label htmlFor="fullName" style={styles.label}>Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="dob" style={styles.label}>Date of Birth *</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="gender" style={styles.label}>Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="phone" style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="guardianName" style={styles.label}>Guardian Name *</label>
            <input
              type="text"
              id="guardianName"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <label htmlFor="address" style={styles.label}>Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.textarea}
              required
            ></textarea>
          </div>
          <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <label htmlFor="medicalConditions" style={styles.label}>Known Medical Conditions *</label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              style={styles.textarea}
              required
            ></textarea>
          </div>
          <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <label htmlFor="symptoms" style={styles.label}>Symptoms *</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              style={styles.textarea}
              required
            ></textarea>
          </div>
        </div>
        <button type="submit" style={styles.button}>Register Patient</button>
      </form>
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
  form: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '900px',
  },
  title: {
    textAlign: 'center',
    color: '#5a189a',
    marginBottom: '24px',
    fontSize: '2rem',
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
  error: {
    background: '#ffe6e6',
    color: '#cc0000',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  success: {
    background: '#e6ffe6',
    color: '#006600',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
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
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
  },
  button: {
    background: 'linear-gradient(90deg, #5a189a 0%, #9d4edd 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    width: '100%',
    marginTop: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'background 0.3s',
  },
};

export default NewPatientForm;
