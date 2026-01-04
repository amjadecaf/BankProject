import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import apiService from '../../services/apiService';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Transfer.css';

function Transfer() {
    const [formData, setFormData] = useState({
        sourceRib: '',
        destinationRib: '',
        amount: '',
        motif: ''
    });
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        loadUserAccounts();
    }, []);

    const loadUserAccounts = async () => {
        try {
            const response = await apiService.getDashboard();
            if (response.data.accounts && response.data.accounts.length > 0) {
                setAccounts(response.data.accounts);
                // Set first account as default
                setFormData(prev => ({
                    ...prev,
                    sourceRib: response.data.accounts[0].rib
                }));
            }
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

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
            const transferData = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            const response = await apiService.executeTransfer(transferData);
            setMessage({ type: 'success', text: response.data.message });

            // Reset form after 2 seconds and redirect to dashboard
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Erreur lors du virement'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="transfer-card">
                    <h2>Nouveau Virement</h2>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Compte Source (RIB) *</label>
                            {accounts.length > 1 ? (
                                <select
                                    name="sourceRib"
                                    className="form-control"
                                    value={formData.sourceRib}
                                    onChange={handleChange}
                                    required
                                >
                                    {accounts.map((account) => (
                                        <option key={account.rib} value={account.rib}>
                                            {account.rib} - Solde: {account.balance.toFixed(2)} MAD
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="sourceRib"
                                    className="form-control"
                                    value={formData.sourceRib}
                                    disabled
                                    required
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label>RIB Destinataire *</label>
                            <input
                                type="text"
                                name="destinationRib"
                                className="form-control"
                                placeholder="Ex: MA005555555555555555555555"
                                value={formData.destinationRib}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Montant (MAD) *</label>
                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Motif *</label>
                            <textarea
                                name="motif"
                                className="form-control"
                                rows="3"
                                placeholder="Ex: Paiement facture, transfert personnel, etc."
                                value={formData.motif}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Traitement...' : 'Effectuer le Virement'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/client/dashboard')}
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

export default Transfer;
