import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  const [quantity, setQuantity] = useState(1);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="rounded-md bg-red-50 p-4 my-4">
      <div className="flex">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900">Product not found</h2>
      <p className="mt-2 text-gray-500">The product you're looking for doesn't exist.</p>
    </div>
  );

  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:8000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      // TODO: Show success message
      // TODO: Update cart count in navbar
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={product.image_url || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-center object-cover sm:rounded-lg"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">{product.description}</div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <div className="text-sm text-gray-700">
                  Status: {' '}
                  {product.stock > 0 ? (
                    <span className="text-green-600">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            <form className="mt-6">
              <div className="mt-10 flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="input max-w-[100px]"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full btn-primary ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
