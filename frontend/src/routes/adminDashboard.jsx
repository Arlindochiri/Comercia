import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetch("http://localhost:5000/products", {
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingProduct
      ? `http://localhost:5000/products/${editingProduct.id}`
      : "http://localhost:5000/products";

    const method = editingProduct ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("adminToken") },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingProduct) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? data : p)));
        } else {
          setProducts([...products, data]);
        }
        setEditingProduct(null);
        setNewProduct({ title: "", price: "", category: "", description: "", image: "" });
      });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
  };

  return (
    <div>
      <h2>Painel de Administração</h2>
      <button onClick={() => { localStorage.removeItem("adminToken"); navigate("/admin/login"); }}>Sair</button>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Nome do Produto" value={newProduct.title} onChange={handleChange} />
        <input name="price" type="number" placeholder="Preço" value={newProduct.price} onChange={handleChange} />
        <input name="category" placeholder="Categoria" value={newProduct.category} onChange={handleChange} />
        <input name="image" placeholder="URL da Imagem" value={newProduct.image} onChange={handleChange} />
        <textarea name="description" placeholder="Descrição" value={newProduct.description} onChange={handleChange}></textarea>
        <button type="submit">{editingProduct ? "Atualizar Produto" : "Adicionar Produto"}</button>
      </form>

      <h3>Produtos</h3>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button onClick={() => fetch(`http://localhost:5000/products/${product.id}`, { method: "DELETE", headers: { Authorization: localStorage.getItem("adminToken") } }).then(() => setProducts(products.filter((p) => p.id !== product.id)))}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;