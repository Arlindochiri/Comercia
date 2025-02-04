const db = require("../db/connection");
const bcrypt = require("bcrypt");

// Criar um novo admin
const createAdmin = (username, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return callback(err);
        db.query(
            "INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hash],
            callback
        );
    });
};

// Buscar admin pelo username
const getAdminByUsername = (username, callback) => {
    db.query("SELECT * FROM admin_users WHERE username = ?", [username], callback);
};

// Atualizar senha do admin
const updateAdminPassword = (username, newPassword, callback) => {
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) return callback(err);
        db.query(
            "UPDATE admin_users SET password = ? WHERE username = ?",
            [hash, username],
            callback
        );
    });
};

// Armazenar token de redefinição de senha
const storeResetToken = (username, token, expires_at, callback) => {
    db.query(
        "INSERT INTO password_reset_tokens (username, token, expires_at) VALUES (?, ?, ?)",
        [username, token, expires_at],
        callback
    );
};

// Buscar token de redefinição de senha
const getResetToken = (token, callback) => {
    db.query(
        "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()",
        [token],
        callback
    );
};

// Remover token de redefinição de senha após uso
const deleteResetToken = (username, callback) => {
    db.query("DELETE FROM password_reset_tokens WHERE username = ?", [username], callback);
};

module.exports = {
    createAdmin,
    getAdminByUsername,
    updateAdminPassword,
    storeResetToken,
    getResetToken,
    deleteResetToken
};