import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:8000/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || ''
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const response = await fetch(`http://localhost:8000/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price),
          stock: parseInt(editForm.stock)
        })
      });
      if (!response.ok) throw new Error('Failed to update product');
      await fetchProducts();
      closeEditModal();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Manage Products</h1>
        <Link 
          to="/admin/products/add" 
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <PlusIcon style={{ width: '20px', height: '20px' }} />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={product.image_url || 'https://via.placeholder.com/40'}
                        alt=""
                        className="rounded me-3"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold">{product.name}</div>
                        <div className="small text-muted">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      product.stock > 0 ? 'text-bg-success' : 'text-bg-danger'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                        onClick={() => openEditModal(product)}
                      >
                        <PencilIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <TrashIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows={2}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editForm.price}
                onChange={handleEditChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editForm.stock}
                onChange={handleEditChange}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image_url"
                value={editForm.image_url}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
