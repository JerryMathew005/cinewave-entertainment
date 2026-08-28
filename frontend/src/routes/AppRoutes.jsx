import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public & Customer Pages
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import MovieDetails from '../pages/MovieDetails';
import Theatres from '../pages/Theatres';
import Shows from '../pages/Shows';
import SeatSelection from '../pages/SeatSelection';
import BookingConfirmation from '../pages/BookingConfirmation';
import MyBookings from '../pages/MyBookings';
import BookingDetails from '../pages/BookingDetails';
import Notifications from '../pages/Notifications';
import Wishlist from '../pages/Wishlist';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Contact from '../pages/Contact';
import Profile from '../pages/Profile';

// Admin & Staff Pages
import AdminDashboard from '../admin/AdminDashboard';
import ManageBookings from '../admin/ManageBookings';
import ManageMovies from '../admin/ManageMovies';
import ManageTheatres from '../admin/ManageTheatres';
import ManageShows from '../admin/ManageShows';
import ManageCoupons from '../admin/ManageCoupons';
import ManageSLA from '../admin/ManageSLA';
import ManageRouting from '../admin/ManageRouting';
import Analytics from '../admin/Analytics';
import ManageUsers from '../admin/ManageUsers';
import ManageMessages from '../admin/ManageMessages';

// Route Guards
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Discovery Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/theatres" element={<Theatres />} />
      <Route path="/shows" element={<Shows />} />
      <Route path="/seat-selection/:showId" element={<SeatSelection />} />
      <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />

      {/* Authentication & Account Recovery */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/contact" element={<Contact />} />

      {/* Customer Protected Routes */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-details/:id"
        element={
          <ProtectedRoute>
            <BookingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Staff & Operations Protected Routes */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute roles={['STAFF', 'ADMIN']}>
            <ManageBookings />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute roles={['STAFF', 'ADMIN']}>
            <ManageBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/movies"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageMovies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/theatres"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageTheatres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shows"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageShows />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageCoupons />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sla"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageSLA />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/routing"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageRouting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <ManageMessages />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
