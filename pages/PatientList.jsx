import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.delete(`/patients/${id}`);
                setPatients(patients.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Patients</h1>
                <Link to="/patients/new" className="btn btn-primary">
                    <FaUserPlus style={{ marginRight: '0.5rem' }} /> Add Patient
                </Link>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Age</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Gender</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Contact</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{patient.name}</td>
                                <td style={{ padding: '1rem' }}>{patient.age}</td>
                                <td style={{ padding: '1rem' }}>{patient.gender}</td>
                                <td style={{ padding: '1rem' }}>{patient.contact}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/patients/edit/${patient._id}`} className="btn" style={{ color: 'var(--primary-color)', padding: '0.25rem' }}>
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(patient._id)} className="btn" style={{ color: 'var(--danger-color)', padding: '0.25rem' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {patients.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No patients found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList;
