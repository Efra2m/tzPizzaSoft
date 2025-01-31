import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  addEmployee,
  updateEmployee,
  Employee,
} from "../../redux/slices/employeeSlice";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AddForm.module.scss";
import Modal from "../Modal/Modal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const AddForm: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
  const headerText = useMemo(() => {
    return isEditing ? "Редактировать сотрудника" : "Добавить сотрудника";
  }, [isEditing]);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const existingEmployee = useSelector((state: RootState) =>
    state.employees.list.find((emp) => emp.id.toString() === id)
  );

  const [formData, setFormData] = useState<Employee>(
    existingEmployee || {
      id: 0,
      name: "",
      phone: "",
      birthday: "",
      role: "Официант",
      isArchive: false,
    }
  );

  useEffect(() => {
    if (id && existingEmployee) {
      setFormData(existingEmployee);
    }
  }, [id, existingEmployee]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      setFormData((prev: Employee) => {
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
          const { checked } = e.target;
          return {
            ...prev,
            [name]: checked,
          };
        } else {
          return {
            ...prev,
            [name]: value,
          };
        }
      });
    },
    []
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const cleaned = value.replace(/\D/g, "");
      let formatted = "+7";
      if (cleaned.length > 1) formatted += ` (${cleaned.slice(1, 4)})`;
      if (cleaned.length > 4) formatted += ` ${cleaned.slice(4, 7)}`;
      if (cleaned.length > 7) formatted += `-${cleaned.slice(7, 9)}`;
      if (cleaned.length > 9) formatted += `-${cleaned.slice(9, 11)}`;
      setFormData((prev) => ({ ...prev, phone: formatted }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim()) {
        alert("Имя не может быть пустым.");
        return;
      }
      if (id) {
        dispatch(updateEmployee(formData));
        setModalMessage("Данные сотрудника успешно обновлены.");
      } else {
        dispatch(addEmployee({ ...formData, id: Date.now() }));
        setModalMessage("Новый сотрудник успешно добавлен.");
      }
      setShowModal(true);
    },
    [formData, id, dispatch]
  );

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
    console.log("Новый сотрудник добавлен");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={styles.AddForm}>
      <h1 className={styles.title}>{headerText}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">
              Имя:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Введите имя сотрудника"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phone">
              Телефон:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              placeholder="+7 (___) ___--"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="birthday">
              Дата рождения:
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="role">
              Должность:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Выберите должность</option>
              <option>Повар</option>
              <option>Официант</option>
              <option>Водитель</option>
            </select>
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancel}`}
              onClick={handleCancel}
            >
              Отмена
            </button>
            <button type="submit" className={`${styles.button} ${styles.save}`}>
              Сохранить
            </button>
          </div>
        </div>
      </form>
      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
};

export default AddForm;
