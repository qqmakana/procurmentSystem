import React from 'react';

const App: React.FC = () => {
  console.log('App component is rendering!');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white', 
      minHeight: '100vh',
      textAlign: 'center',
      fontSize: '30px'
    }}>
      <h1>🚨 EMERGENCY TEST - CAN YOU SEE THIS? 🚨</h1>
      <p>If you can see this red page, the app is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default App;