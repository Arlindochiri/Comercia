const db = require("../db/connection");
const db = require("../db/connection");

// Obter todos os produtos
const getAllProducts = (callback) => {
    db.query("SELECT * FROM products", callback);
};

// Obter um produto pelo ID
const getProductById = (id, callback) => {
    db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};

// Adicionar um novo produto
const addProduct = (title, price, category, description, image, callback) => {
    db.query(
        "INSERT INTO products (title, price, category, description, image) VALUES (?, ?, ?, ?, ?)",
        [title, price, category, description, image],
        callback
    );
};

// Atualizar um produto existente
const updateProduct = (id, title, price, category, description, image, callback) => {
    db.query(
        "UPDATE products SET title = ?, price = ?, category = ?, description = ?, image = ? WHERE id = ?",
        [title, price, category, description, image, id],
        callback
    );
};

// Excluir um produto pelo ID
const deleteProduct = (id, callback) => {
    db.query("DELETE FROM products WHERE id = ?", [id], callback);
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};