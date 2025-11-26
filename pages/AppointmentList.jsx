import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FaEdit, FaTrash, FaCalendarPlus } from 'react-icons/fa';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.delete(`/appointments/${id}`);
                setAppointments(appointments.filter(a => a._id !== id));
            } catch (error) {
                console.error('Error deleting appointment:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'var(--success-color)';
            case 'Pending': return '#f59e0b'; // Amber
            case 'Cancelled': return 'var(--danger-color)';
            default: return 'var(--text-secondary)';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Appointments</h1>
                <Link to="/appointments/new" className="btn btn-primary">
                    <FaCalendarPlus style={{ marginRight: '0.5rem' }} /> Schedule Appointment
                </Link>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Patient</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Time</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Reason</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appointment => (
                            <tr key={appointment._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{appointment.patient?.name || 'Unknown'}</td>
                                <td style={{ padding: '1rem' }}>{formatDate(appointment.date)}</td>
                                <td style={{ padding: '1rem' }}>{appointment.time}</td>
                                <td style={{ padding: '1rem' }}>{appointment.reason}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: getStatusColor(appointment.status),
                                        fontWeight: '600',
                                        fontSize: '0.875rem'
                                    }}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/appointments/edit/${appointment._id}`} className="btn" style={{ color: 'var(--primary-color)', padding: '0.25rem' }}>
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(appointment._id)} className="btn" style={{ color: 'var(--danger-color)', padding: '0.25rem' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No appointments found. Schedule one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
