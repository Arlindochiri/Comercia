const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "chave_secreta"; // Trocar por algo mais seguro

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sua_senha",
  database: "ecommerce",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("Banco de Dados Conectado!");
});

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Acesso negado" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.admin = decoded;
    next();
  });
};

// Rota de login do admin
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM admin_users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
      } else {
        res.status(401).json({ message: "Credenciais inválidas" });
      }
    }
  );
});

// Protegendo as rotas de produtos
app.get("/products", verifyToken, (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/products", verifyToken, (req, res) => {
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

app.delete("/products/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) throw err;
    res.send("Produto deletado");
  });
});

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
// Atualizar produto
app.put("/products/:id", verifyToken, (req, res) => {
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
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");

app.use("/products", productRoutes);
app.use("/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});