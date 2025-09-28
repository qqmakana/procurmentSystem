import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white', 
      minHeight: '100vh',
      textAlign: 'center',
      fontSize: '30px'
    }}>
      <h1>🚨 TEST APP - CAN YOU SEE THIS? 🚨</h1>
      <p>This is a test app to verify the build process!</p>
    </div>
  );
};

export default TestApp;
