import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Redirect if already authenticated
        if (authService.isAuthenticated()) {
            if (authService.hasRole('ROLE_AGENT_GUICHET')) {
                navigate('/agent/add-client', { replace: true });
            } else if (authService.hasRole('ROLE_CLIENT')) {
                navigate('/client/dashboard', { replace: true });
            }
        }

        if (searchParams.get('expired') === 'true') {
            setError('Session invalide, veuillez vous authentifier');
        }
    }, [navigate, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(username, password);

            // Redirect based on role
            if (response.roles.includes('ROLE_AGENT_GUICHET')) {
                navigate('/agent/add-client');
            } else if (response.roles.includes('ROLE_CLIENT')) {
                navigate('/client/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Login ou mot de passe erronés');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>CAF Amjade & BATTAL Mohammed Othmane Bank</h1>
                    <p>Bienvenue sur votre espace bancaire</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Serveur sécurisé SSL</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
