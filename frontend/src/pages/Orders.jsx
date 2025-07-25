import React, { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/orders', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Your Orders
          </h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-bordered table-hover w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Placed On</th>
                <th className="px-4 py-2">Products</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-4 py-2 font-semibold">{order.id}</td>
                  <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <ul className="space-y-2" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      {order.items && order.items.map(item => (
                        <li key={item.id} className="flex items-center gap-2" style={{textDecorationStyle: 'none'}}>
                          <img
                            src={item.image_url || 'https://via.placeholder.com/40'}
                            alt={item.name}
                            className="rounded me-3"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <span className="font-medium">{item.name}</span>
                          {/* <span className="text-gray-500">${item.price}</span> */}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 font-bold">${order.total_price}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
