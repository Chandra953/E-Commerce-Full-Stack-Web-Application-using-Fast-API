import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

   useEffect(() => {
      fetch('http://localhost:8000/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setItemCount(data.length);
        })

    }, []);

  return (
    <span className="position-relative d-inline-flex align-items-center justify-content-center text-white">
      <ShoppingCartIcon style={{ width: '24px', height: '24px' }} />
      {itemCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {itemCount}
        </span>
      )}
    </span>
  );
}
