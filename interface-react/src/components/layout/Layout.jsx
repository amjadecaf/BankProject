import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { FaHome, FaUserPlus, FaPiggyBank, FaChartLine, FaExchangeAlt, FaKey, FaSignOutAlt } from 'react-icons/fa';
import './Layout.css';

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const isAgent = authService.hasRole('ROLE_AGENT_GUICHET');
    const isClient = authService.hasRole('ROLE_CLIENT');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container-fluid">
                    <span className="navbar-brand">
                        <FaHome className="me-2" />
                        CAF Amjade & BATTAL Mohammed Othmane Bank
                    </span>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {isAgent && (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname === '/agent/add-client' ? 'active' : ''}`}
                                            to="/agent/add-client"
                                        >
                                            <FaUserPlus className="me-1" /> Ajouter Client
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname === '/agent/add-account' ? 'active' : ''}`}
                                            to="/agent/add-account"
                                        >
                                            <FaPiggyBank className="me-1" /> Nouveau Compte
                                        </Link>
                                    </li>
                                </>
                            )}

                            {isClient && (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname === '/client/dashboard' ? 'active' : ''}`}
                                            to="/client/dashboard"
                                        >
                                            <FaChartLine className="me-1" /> Tableau de Bord
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname === '/client/transfer' ? 'active' : ''}`}
                                            to="/client/transfer"
                                        >
                                            <FaExchangeAlt className="me-1" /> Nouveau Virement
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === '/change-password' ? 'active' : ''}`}
                                    to="/change-password"
                                >
                                    <FaKey className="me-1" /> Changer Mot de Passe
                                </Link>
                            </li>

                            <li className="nav-item">
                                <span className="nav-link user-info">
                                    {user?.username}
                                </span>
                            </li>

                            <li className="nav-item">
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-1" /> Déconnexion
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="container text-center">
                    <p>&copy; 2025 CAF Amjade & BATTAL Mohammed Othmane Bank. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
