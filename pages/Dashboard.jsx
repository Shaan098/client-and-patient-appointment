import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaUsers, FaCalendarCheck, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, you might have a dedicated stats endpoint
                // For now, we'll fetch lists and count them
                const [patientsRes, appointmentsRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/appointments')
                ]);
                setStats({
                    patients: patientsRes.data.length,
                    appointments: appointmentsRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <Link to="/patients/new" className="btn btn-primary">
                    <FaUserPlus style={{ marginRight: '0.5rem' }} /> Add Patient
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#eef2ff', borderRadius: '50%', color: 'var(--primary-color)' }}>
                            <FaUsers size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Patients</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.patients}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '50%', color: 'var(--success-color)' }}>
                            <FaCalendarCheck size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Appointments</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.appointments}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
