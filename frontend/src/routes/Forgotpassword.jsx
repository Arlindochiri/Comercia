import React, { useState } from "react";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const requestReset = () => {
    fetch("http://localhost:5000/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).then(() => setStep(2));
  };

  const resetPassword = () => {
    fetch("http://localhost:5000/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    }).then(() => alert("Senha alterada!"));
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <input onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" />
          <button onClick={requestReset}>Enviar Código</button>
        </>
      ) : (
        <>
          <input onChange={(e) => setToken(e.target.value)} placeholder="Código" />
          <input onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova Senha" type="password" />
          <button onClick={resetPassword}>Redefinir Senha</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;