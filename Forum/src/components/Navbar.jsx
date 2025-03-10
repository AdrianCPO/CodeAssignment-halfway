import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <section className="navbar-links">
        <ul className="navbar-list">
          <li className="navbar-item">
            <NavLink to="/threads">Trådar</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/new-thread">Skapa Tråd</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/edit-thread">Redigera Tråd</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/delete-thread">Ta bort Tråd</NavLink>
          </li>
        </ul>
      </section>
    </nav>
  );
};
