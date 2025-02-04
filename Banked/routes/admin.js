const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Login do admin
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM admin_users WHERE username = ?", [username], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(401).json({ message: "Usuário não encontrado" });

    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) return res.status(401).json({ message: "Senha incorreta" });

      const token = jwt.sign({ id: result[0].id }, "secreto", { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

// Solicitar redefinição de senha
router.post("/forgot-password", (req, res) => {
  const { username } = req.body;
  const token = crypto.randomBytes(20).toString("hex");
  const expires_at = new Date(Date.now() + 3600000); // Expira em 1 hora

  db.query("SELECT * FROM admin_users WHERE username = ?", [username], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });

    db.query("INSERT INTO password_reset_tokens (username, token, expires_at) VALUES (?, ?, ?)",
      [username, token, expires_at],
      () => res.json({ message: "Código enviado", token })
    );
  });
});

// Redefinir senha
router.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  db.query("SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()", [token], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(400).json({ message: "Token inválido ou expirado" });

    const username = result[0].username;
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) throw err;
      db.query("UPDATE admin_users SET password = ? WHERE username = ?", [hash, username], (err) => {
        if (err) throw err;
        db.query("DELETE FROM password_reset_tokens WHERE username = ?", [username]);
        res.json({ message: "Senha alterada com sucesso" });
      });
    });
  });
});

module.exports = router;