import React, { useEffect, useState } from 'react';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/cart', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load cart');
        setLoading(false);
      });
  }, []);

  // Helper to build order payload
 const buildOrderPayload = () => {
  const items = cart.map(item => item.product.id); // just product IDs
  const total_price = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { items, total_price };
};

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

  return (
    <div className="bg-white min-h-[400px]">
      <div className="max-w-7xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
          Shopping Cart
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Your cart is empty</div>
          </div>
        ) : (
          <div className="row g-4">
            {cart.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.product.image_url || 'https://via.placeholder.com/300'}
                    alt={item.product.name}
                    style={{ objectFit: 'contain', height: 180, background: '#f8f9fa' }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.product.name}</h3>
                      {/* <p className="text-gray-600 mb-2">${item.product.price} x {item.quantity}</p> */}
                      <p className="text-gray-900 font-bold mb-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.product.id}`} className="mr-2 text-gray-500">
                          Qty
                        </label>
                        <select
                          id={`quantity-${item.product.id}`}
                          value={item.quantity}
                          onChange={async (e) => {
                            const newQuantity = Number(e.target.value);
                            try {
                              const res = await fetch(`http://localhost:8000/cart/${item.id}`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                },
                                body: JSON.stringify({
                                  product_id: item.product.id,
                                  quantity: newQuantity
                                })
                              });
                              if (!res.ok) throw new Error('Failed to update quantity');
                              const updatedItem = await res.json();
                              setCart((prev) =>
                                prev.map((ci) =>
                                  ci.id === item.id ? { ...ci, quantity: updatedItem.quantity } : ci
                                )
                              );
                            } catch {
                              setError('Failed to update quantity');
                            }
                          }}
                          className="input max-w-[80px] border rounded px-2 py-1"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          try {
                            const res = await fetch(`http://localhost:8000/cart/${item.id}`, {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                              }
                            });
                            if (!res.ok) throw new Error('Failed to remove item');
                            setCart((prev) => prev.filter((ci) => ci.id !== item.id));
                          } catch {
                            setError('Failed to remove item');
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={async () => {
              try {
                const payload = buildOrderPayload();
                const res = await fetch('http://localhost:8000/orders/place', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Failed to place order');
                setCart([]);
                alert('Order placed successfully!');
              } catch {
                setError('Failed to place order');
              }
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
