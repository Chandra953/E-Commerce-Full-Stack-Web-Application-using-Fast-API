import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:8000/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const user = await response.json();
            setIsAdmin(user.role === 'admin');
          }
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      // Optionally show a toast or update cart state
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-50">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Products</h1>
        <div className="d-flex gap-2 align-items-center">
          <div className="input-group" style={{ width: '100%' }}>
            <input 
              type="search" 
              placeholder="Search products..." 
              className="form-control"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="form-select">
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="card-img-top"
                  style={{ objectFit: 'contain', height: 180, background: '#f8f9fa' }}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{product.name}</h5>
                <p className="card-text text-muted small mb-2" style={{ minHeight: 40 }}>
                  {product.description}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                  <span className="fw-bold text-primary">${product.price}</span>
                  <span className="fw-bold text-primary">Units: {product.stock}</span>
                </div>
                <button
                  className="btn btn-outline-success mt-3 d-flex align-items-center gap-2"
                  style={{ minHeight: 38 }}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart[product.id]}
                >
                  <ShoppingCartIcon style={{ width: 18, height: 18 }} />
                  {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
