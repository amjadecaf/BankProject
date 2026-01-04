import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import apiService from '../../services/apiService';
import { FaWallet, FaCreditCard, FaHistory } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedRib, setSelectedRib] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
    }, [selectedRib, currentPage]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const response = await apiService.getDashboard(selectedRib, currentPage, 10);
            setDashboardData(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement du tableau de bord');
        } finally {
            setLoading(false);
        }
    };

    const handleAccountChange = (e) => {
        setSelectedRib(e.target.value);
        setCurrentPage(0);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('fr-FR');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    if (loading && !dashboardData) {
        return (
            <Layout>
                <div className="container text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mt-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container dashboard-container">
                <h2 className="dashboard-title">Tableau de Bord</h2>

                {dashboardData && (
                    <>
                        {/* Account Selector */}
                        {dashboardData.accounts.length > 1 && (
                            <div className="account-selector">
                                <label>Sélectionner un compte:</label>
                                <select
                                    className="form-select"
                                    value={selectedRib}
                                    onChange={handleAccountChange}
                                >
                                    {dashboardData.accounts.map((account) => (
                                        <option key={account.rib} value={account.rib}>
                                            {account.rib} - {formatCurrency(account.balance)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Account Summary */}
                        <div className="account-summary">
                            <div className="summary-card">
                                <div className="summary-icon">
                                    <FaCreditCard />
                                </div>
                                <div className="summary-content">
                                    <h5>RIB</h5>
                                    <p>{dashboardData.selectedRib}</p>
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-icon balance">
                                    <FaWallet />
                                </div>
                                <div className="summary-content">
                                    <h5>Solde</h5>
                                    <p className="balance-amount">
                                        {formatCurrency(dashboardData.selectedAccountBalance)}
                                    </p>
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-icon">
                                    <FaHistory />
                                </div>
                                <div className="summary-content">
                                    <h5>Total Transactions</h5>
                                    <p>{dashboardData.totalTransactions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="transactions-section">
                            <h3>Dernières Opérations</h3>

                            {dashboardData.recentTransactions.length === 0 ? (
                                <p className="text-center text-muted">Aucune transaction trouvée</p>
                            ) : (
                                <>
                                    <div className="transactions-list">
                                        {dashboardData.recentTransactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className={`transaction-item ${transaction.transactionType.toLowerCase()}`}
                                            >
                                                <div className="transaction-type">
                                                    <span className={`badge ${transaction.transactionType === 'CREDIT' ? 'bg-success' : 'bg-danger'}`}>
                                                        {transaction.transactionType}
                                                    </span>
                                                </div>
                                                <div className="transaction-details">
                                                    <p className="transaction-description">
                                                        {transaction.transactionType === 'CREDIT'
                                                            ? 'Virement en votre faveur'
                                                            : 'Virement émis'}
                                                    </p>
                                                    <p className="transaction-date">
                                                        {formatDate(transaction.createdAt || transaction.date)}
                                                    </p>
                                                </div>
                                                <div className="transaction-amount">
                                                    <span className={transaction.transactionType === 'CREDIT' ? 'text-success' : 'text-danger'}>
                                                        {transaction.transactionType === 'CREDIT' ? '+' : '-'}
                                                        {formatCurrency(transaction.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {dashboardData.totalPages > 1 && (
                                        <div className="pagination-controls">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                                disabled={currentPage === 0}
                                            >
                                                Précédent
                                            </button>
                                            <span>Page {currentPage + 1} sur {dashboardData.totalPages}</span>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setCurrentPage(prev => Math.min(dashboardData.totalPages - 1, prev + 1))}
                                                disabled={currentPage >= dashboardData.totalPages - 1}
                                            >
                                                Suivant
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}

export default Dashboard;
