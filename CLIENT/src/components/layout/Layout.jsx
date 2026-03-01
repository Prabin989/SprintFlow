import { NavLink, Outlet } from 'react-router-dom';
import { FiHome, FiList, FiFolder } from 'react-icons/fi';

function Layout() {
    return (
        <div className="app-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                    <h1>SprintFlow</h1>
                </div>

                <ul className="nav-links">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <FiHome /> <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <FiList /> <span>Tasks</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <FiFolder /> <span>Categories</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
