import TabLink from './TabLink';

const tabs = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/expenses', label: 'Gastos', end: false },
  { to: '/settings', label: 'Ajustes', end: false },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <TabLink key={tab.to} to={tab.to} label={tab.label} end={tab.end} />
      ))}
    </nav>
  );
}
