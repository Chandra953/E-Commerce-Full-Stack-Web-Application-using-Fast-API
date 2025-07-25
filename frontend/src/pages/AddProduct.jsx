import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Add New Product</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image_url" className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="image_url"
                    name="image_url"
                    value={product.image_url}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/products')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
