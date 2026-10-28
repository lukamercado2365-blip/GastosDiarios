import { NavLink, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          backgroundColor: '#2b8a3e',
          color: '#ffffff',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Gastos Diarios</h1>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem',
          boxSizing: 'border-box',
          paddingBottom: '5rem',
        }}
      >
        <Outlet />
      </main>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0.75rem 0',
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <NavLink
          to="/"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2b8a3e' : '#6c757d',
            fontWeight: isActive ? '700' : '400',
            fontSize: '0.9rem',
          })}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/expenses"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2b8a3e' : '#6c757d',
            fontWeight: isActive ? '700' : '400',
            fontSize: '0.9rem',
          })}
        >
          Gastos
        </NavLink>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2b8a3e' : '#6c757d',
            fontWeight: isActive ? '700' : '400',
            fontSize: '0.9rem',
          })}
        >
          Ajustes
        </NavLink>
      </nav>
    </div>
  );
}
