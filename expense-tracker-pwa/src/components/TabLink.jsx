import { NavLink } from 'react-router-dom';

export default function TabLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `tab-link tap-feedback${isActive ? ' tab-link--active' : ''}`
      }
    >
      {label}
    </NavLink>
  );
}
