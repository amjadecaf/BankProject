import React, { useState } from 'react';
import Layout from '../layout/Layout';
import apiService from '../../services/apiService';
import '../agent/AddClient.css';

function AddBankAccount() {
    const [formData, setFormData] = useState({
        rib: '',
        identityNumber: '',
        amount: 0
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await apiService.createBankAccount(formData);
            setMessage({ type: 'success', text: response.data.message });

            // Reset form
            setFormData({
                rib: '',
                identityNumber: '',
                amount: 0
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Erreur lors de la création du compte bancaire'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="add-client-card">
                    <h2>Nouveau Compte Bancaire</h2>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>RIB *</label>
                            <input
                                type="text"
                                name="rib"
                                className="form-control"
                                placeholder="Ex: MA001234567890123456789012"
                                value={formData.rib}
                                onChange={handleChange}
                                required
                            />
                            <small className="form-text text-muted">
                                Le RIB doit être unique et valide
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Numéro d'Identité du Client *</label>
                            <input
                                type="text"
                                name="identityNumber"
                                className="form-control"
                                value={formData.identityNumber}
                                onChange={handleChange}
                                required
                            />
                            <small className="form-text text-muted">
                                Le client doit exister dans la base de données
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Montant Initial (optionnel)</label>
                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Création en cours...' : 'Créer le Compte'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddBankAccount;
