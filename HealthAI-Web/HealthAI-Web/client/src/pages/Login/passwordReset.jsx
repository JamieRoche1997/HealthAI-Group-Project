import React, { useState } from "react";

const PasswordReset = ({ isOpen, onClose, onResetPassword }) => {
  const [resetEmail, setResetEmail] = useState('');

  const handlePasswordReset = () => {
    onResetPassword(resetEmail);
  };

  return (
    isOpen && (
      <div className="password-reset-modal">
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
        <button onClick={handlePasswordReset}>Reset Password</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    )
  );
};

export default PasswordReset;
