import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchEmployees,
  sortEmployees,
} from "../../redux/slices/employeeSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import styles from "./EmployeeList.module.scss";
import FilterForm from "../FilterForm/FilterForm";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ru";

dayjs.extend(customParseFormat);
dayjs.locale("ru");

const parseBirthday = (birthday: string): Date | null => {
  if (!birthday) {
    return null;
  }
  let date = dayjs(birthday, "YYYY-MM-DD");
  if (date.isValid()) {
    return date.toDate();
  }
  date = dayjs(birthday, "DD.MM.YYYY");
  if (date.isValid()) {
    return date.toDate();
  }
  return null;
};

const formatDate = (birthday: string): string => {
  const date = parseBirthday(birthday);
  if (!date) {
    return "Н/Д";
  }
  return dayjs(date).locale("ru").format("DD.MM.YYYY");
};

const EmployeeList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, filters, sortCriteria, sortDirection } =
    useAppSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleSort = useCallback(
    (criteria: string) => {
      dispatch(sortEmployees(criteria));
    },
    [dispatch]
  );

  const calculateAge = (birthday: string): number => {
    const birthDate = parseBirthday(birthday);
    if (!birthDate) {
      return 0;
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredList = list.filter((emp) => {
    const roleMatch = filters.role ? emp.role === filters.role : true;
    const statusMatch =
      filters.isArchive !== undefined
        ? emp.isArchive === filters.isArchive
        : true;
    let birthdayMatch = true;

    if (filters.birthdayMonth !== undefined) {
      const birthDate = parseBirthday(emp.birthday);
      if (birthDate) {
        birthdayMatch = birthDate.getMonth() + 1 === filters.birthdayMonth;
      } else {
        birthdayMatch = false;
      }
    }

    return roleMatch && statusMatch && birthdayMatch;
  });

  return (
    <div className={styles.employeeList}>
      <div className={styles.header}>
        <h1>Список сотрудников</h1>
        <Link to="/add" className={styles.addButton}>
          <img src="plus.png" alt="плюс" />
          Добавить сотрудника
        </Link>
      </div>
      <div className={styles.actions}>
        <button onClick={() => handleSort("name")}>
          по имени{" "}
          {sortCriteria === "name" && (sortDirection === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("birthday")}>
          по дате рождения{" "}
          {sortCriteria === "birthday" && (sortDirection === "asc" ? "↑" : "↓")}
        </button>
      </div>
      <FilterForm />
      {loading && <p>Загрузка...</p>}
      {error && <p className={styles.error}>Ошибка: {error}</p>}
      <table className={styles.names}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Должность</th>
            <th>Телефон</th>
            <th>День рождения</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody className={styles.text}>
          {filteredList.length > 0 ? (
            filteredList.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <Link to={`/employees/${emp.id}`}>{emp.name}</Link>
                </td>
                <td>
                  <Link to={`/employees/${emp.id}`}>{emp.role}</Link>
                </td>
                <td>
                  <Link to={`/employees/${emp.id}`}>{emp.phone}</Link>
                </td>
                <td>
                  <Link to={`/employees/${emp.id}`}>
                    {formatDate(emp.birthday)} ({calculateAge(emp.birthday)}{" "}
                    лет)
                  </Link>
                </td>
                <Link to={`/employees/${emp.id}`}>
                  <td>
                    <img
                      className={styles.img}
                      src="redact.png"
                      alt="Редактировать"
                    />
                  </td>
                </Link>
              </tr>
            ))
          ) : (
            <tr>
              <td>Нет сотрудников</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
