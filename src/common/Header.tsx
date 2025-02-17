import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const Header: React.FC = () => (
  <header className={styles.header}>
    <nav>
      <ul>
        <li>
          <Link to="/">Сотрудники</Link>
        </li>
        <li>
          <Link to="/add">Добавить</Link>
        </li>
      </ul>
    </nav>
  </header>
);
export default Header;
