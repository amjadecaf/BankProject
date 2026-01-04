import React, { useState } from 'react';
import Layout from '../layout/Layout';
import apiService from '../../services/apiService';
import './AddClient.css';

function AddClient() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        identityNumber: '',
        birthDate: '',
        email: '',
        postalAddress: ''
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
            // Convert birthDate string to Date object
            const dataToSend = {
                ...formData,
                birthDate: new Date(formData.birthDate)
            };

            const response = await apiService.createCustomer(dataToSend);
            setMessage({ type: 'success', text: response.data.message });

            // Reset form
            setFormData({
                firstname: '',
                lastname: '',
                identityNumber: '',
                birthDate: '',
                email: '',
                postalAddress: ''
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Erreur lors de la création du client'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="add-client-card">
                    <h2>Ajouter un Nouveau Client</h2>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Prénom *</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        className="form-control"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nom *</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className="form-control"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Numéro d'Identité *</label>
                                    <input
                                        type="text"
                                        name="identityNumber"
                                        className="form-control"
                                        value={formData.identityNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Date de Naissance *</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        className="form-control"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                        required
                                    />
                                    <small className="form-text text-muted">
                                        Le client doit avoir au moins 18 ans
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <small className="form-text text-muted">
                                Les identifiants de connexion seront envoyés à cette adresse
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Adresse Postale *</label>
                            <textarea
                                name="postalAddress"
                                className="form-control"
                                rows="3"
                                value={formData.postalAddress}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Création en cours...' : 'Créer le Client'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddClient;
