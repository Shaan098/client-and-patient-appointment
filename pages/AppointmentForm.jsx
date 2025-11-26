import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const AppointmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patient: '',
        date: '',
        time: '',
        reason: '',
        status: 'Pending'
    });
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
        if (id) {
            fetchAppointment();
        }
    }, [id]);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchAppointment = async () => {
        try {
            const response = await api.get(`/appointments/${id}`);
            // Format date for input field (YYYY-MM-DD)
            const formattedDate = new Date(response.data.date).toISOString().split('T')[0];
            setFormData({
                ...response.data,
                date: formattedDate,
                patient: response.data.patient?._id || response.data.patient // Handle populated or unpopulated
            });
        } catch (error) {
            setError('Error fetching appointment details');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await api.put(`/appointments/${id}`, formData);
            } else {
                await api.post('/appointments', formData);
            }
            navigate('/appointments');
        } catch (error) {
            setError(error.response?.data?.message || 'Error saving appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="page-header">
                <h1 className="page-title">{id ? 'Edit Appointment' : 'Schedule Appointment'}</h1>
            </div>

            <div className="card">
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Patient</label>
                        <select
                            name="patient"
                            className="form-input"
                            value={formData.patient}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-input"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time</label>
                            <input
                                type="time"
                                name="time"
                                className="form-input"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <textarea
                            name="reason"
                            className="form-input"
                            rows="3"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-input"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Appointment'}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/appointments')} style={{ border: '1px solid var(--border-color)' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;
