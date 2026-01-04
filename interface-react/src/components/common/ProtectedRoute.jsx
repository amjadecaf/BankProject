import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

function ProtectedRoute({ children, requiredRole }) {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !authService.hasRole(requiredRole)) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <h4>Accès refusé</h4>
                    <p>Vous n'avez pas le droit d'accéder à cette fonctionnalité. Veuillez contacter votre administrateur.</p>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
