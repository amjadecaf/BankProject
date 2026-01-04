import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import ChangePassword from './components/auth/ChangePassword';
import ProtectedRoute from './components/common/ProtectedRoute';
import AddClient from './components/agent/AddClient';
import AddBankAccount from './components/agent/AddBankAccount';
import Dashboard from './components/client/Dashboard';
import Transfer from './components/client/Transfer';
import authService from './services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes - Agent */}
                <Route
                    path="/agent/add-client"
                    element={
                        <ProtectedRoute requiredRole="ROLE_AGENT_GUICHET">
                            <AddClient />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/add-account"
                    element={
                        <ProtectedRoute requiredRole="ROLE_AGENT_GUICHET">
                            <AddBankAccount />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Client */}
                <Route
                    path="/client/dashboard"
                    element={
                        <ProtectedRoute requiredRole="ROLE_CLIENT">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/client/transfer"
                    element={
                        <ProtectedRoute requiredRole="ROLE_CLIENT">
                            <Transfer />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Both Roles */}
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        authService.isAuthenticated() ? (
                            authService.hasRole('ROLE_AGENT_GUICHET') ? (
                                <Navigate to="/agent/add-client" replace />
                            ) : (
                                <Navigate to="/client/dashboard" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;