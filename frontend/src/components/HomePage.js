import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Import the Header component

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <Header /> {/* Include the Header */}
      <div style={{ height: 96 }} /> {/* Spacer for fixed top bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '25px',
          boxShadow: '0 6px 30px rgba(0,0,0,0.08)',
          padding: '80px 100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          alignItems: 'center',
        }}>
          <button onClick={() => navigate('/mri')} style={buttonStyle}>{icons.mri}MRI</button>
          <button onClick={() => navigate('/mmse')} style={buttonStyle}>{icons.mmse}MMSE</button>
          <button onClick={() => navigate('/existing-patient')} style={buttonStyle}>{icons.existing}Existing Patient</button>
          <button onClick={() => navigate('/new-patient')} style={buttonStyle}>{icons.new}New Patient</button>
        </div>
      </div>
    </div>
  );
};

const icons = {
  mri: <span style={{ marginRight: 12, fontSize: '1.3em' }}>🧲</span>,
  mmse: <span style={{ marginRight: 12, fontSize: '1.3em' }}>📝</span>,
  existing: <span style={{ marginRight: 12, fontSize: '1.3em' }}>👤</span>,
  new: <span style={{ marginRight: 12, fontSize: '1.3em' }}>➕</span>,
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)',
  color: '#222',
  border: 'none',
  borderRadius: '8px',
  padding: '14px 38px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  margin: '0 0 0 0',
  transition: 'background 0.2s, transform 0.1s',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default HomePage;