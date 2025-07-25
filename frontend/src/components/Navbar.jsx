import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  UserIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import CartIcon from './CartIcon';
import { Tooltip } from 'bootstrap';

export default function Navbar() {
  const isAdmin = localStorage.getItem('token') !== null; // Replace with actual admin check

  // Initialize Bootstrap tooltips on mount
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new Tooltip(el));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <ShoppingBagIcon className="me-2" style={{ width: '30px', height: '30px' }} />
          <span>E-COMM</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link
                to="/cart"
                className="nav-link"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Cart"
              >
                <CartIcon />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/orders"
                className="nav-link"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Orders"
              >
                <ClipboardDocumentListIcon style={{ width: '24px', height: '24px' }} />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-link"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Profile"
              >
                <UserIcon style={{ width: '24px', height: '24px' }} />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-link"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Login"
              >
                <ArrowRightOnRectangleIcon style={{ width: '24px', height: '24px' }} />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/register"
                className="nav-link"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Register"
              >
                <PencilSquareIcon style={{ width: '24px', height: '24px' }} />
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link
                  to="/admin/products"
                  className="nav-link"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Admin Products"
                >
                  <ShieldCheckIcon style={{ width: '24px', height: '24px' }} />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
