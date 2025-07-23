import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MRIForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: '',
    scanDate: new Date().toISOString().split('T')[0],
    cdrValue: '',
    dementiaClass: '',
    comments: '',
  });
  const [scanFile, setScanFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setScanFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demonstration, just log the data
    const data = {
      ...form,
      scanFile: scanFile ? scanFile.name : null,
    };
    console.log('MRI Form Data:', data);
    alert('MRI form submitted!');
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>MRI Scan Submission</h2>
        <div style={styles.grid}>
          <div style={styles.fieldFull}>
            <label style={styles.label}>Patient ID</label>
            <input
              type="text"
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter or select Patient ID"
              required
            />
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>MRI Scan (JPG, NII, NII.GZ)</label>
            <input
              type="file"
              accept=".jpg,.nii,.nii.gz"
              onChange={handleFileChange}
              style={styles.input}
              required
            />
            {scanFile && <span style={{ fontSize: '0.95em', color: '#5a189a', marginTop: 6 }}>{scanFile.name}</span>}
          </div>
          <div style={styles.fieldHalf}>
            <label style={styles.label}>Date of Scan</label>
            <input
              type="date"
              name="scanDate"
              value={form.scanDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.fieldHalf}>
            <label style={styles.label}>CDR Value</label>
            <select
              name="cdrValue"
              value={form.cdrValue}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select</option>
              <option value="0">0</option>
              <option value="0.5">0.5</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div style={styles.fieldHalf}>
            <label style={styles.label}>Dementia Class</label>
            <select
              name="dementiaClass"
              value={form.dementiaClass}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select</option>
              <option value="Non-Demented">Non-Demented</option>
              <option value="Very Mild">Very Mild</option>
              <option value="Mild">Mild</option>
              <option value="Demented">Demented</option>
            </select>
          </div>
          <div style={{ ...styles.fieldFull, marginTop: 8 }}>
            <label style={styles.label}>Comments (Optional)</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Add any notes from the radiologist/doctor"
            />
          </div>
        </div>
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.buttonSubmit}>Submit</button>
          <button type="button" style={styles.buttonCancel} onClick={handleCancel}>Cancel</button>
        </div>
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
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '700px',
  },
  title: {
    textAlign: 'center',
    color: '#5a189a',
    marginBottom: '24px',
    fontSize: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
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
    minHeight: '80px',
    resize: 'vertical',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginTop: '24px',
  },
  buttonSubmit: {
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
};

export default MRIForm; 