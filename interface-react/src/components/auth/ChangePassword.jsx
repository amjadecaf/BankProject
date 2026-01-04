import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import apiService from '../../services/apiService';
import './ChangePassword.css';

function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
            return;
        }

        // Validate password length
        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
            return;
        }

        setLoading(true);

        try {
            const response = await apiService.changePassword(
                formData.currentPassword,
                formData.newPassword
            );

            setMessage({ type: 'success', text: response.data.message || 'Mot de passe changé avec succès' });

            // Reset form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate(-1); // Go back to previous page
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="change-password-card">
                    <h2>Changer le Mot de Passe</h2>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Mot de Passe Actuel *</label>
                            <input
                                type="password"
                                name="currentPassword"
                                className="form-control"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nouveau Mot de Passe *</label>
                            <input
                                type="password"
                                name="newPassword"
                                className="form-control"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                            <small className="form-text text-muted">
                                Au moins 6 caractères
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Confirmer le Nouveau Mot de Passe *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Changement en cours...' : 'Changer le Mot de Passe'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default ChangePassword;
