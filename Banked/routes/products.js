const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const verifyToken = require("../middleware/authMiddleware");

// Listar todos os produtos
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Adicionar um novo produto
router.post("/", verifyToken, (req, res) => {
  const { title, price, category, description, image } = req.body;
  db.query(
    "INSERT INTO products (title, price, category, description, image) VALUES (?, ?, ?, ?, ?)",
    [title, price, category, description, image],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar um produto existente
router.put("/:id", verifyToken, (req, res) => {
  const { title, price, category, description, image } = req.body;
  db.query(
    "UPDATE products SET title = ?, price = ?, category = ?, description = ?, image = ? WHERE id = ?",
    [title, price, category, description, image, req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Excluir um produto
router.delete("/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Produto excluído" });
  });
});

module.exports = router;