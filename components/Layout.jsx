import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaUserMd, FaCalendarAlt, FaUsers, FaSignOutAlt, FaHome } from 'react-icons/fa';
import '../styles/Layout.css';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>MediCare</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${isActive('/')}`}>
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/patients" className={`nav-item ${isActive('/patients')}`}>
                        <FaUsers /> Patients
                    </Link>
                    <Link to="/appointments" className={`nav-item ${isActive('/appointments')}`}>
                        <FaCalendarAlt /> Appointments
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <FaUserMd />
                        <span>{user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
