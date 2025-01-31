import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { filterEmployees } from "../../redux/slices/employeeSlice";
import styles from "./FilterForm.module.scss";

const FilterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { role, isArchive } = useAppSelector(
    (state) => state.employees.filters
  );

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(filterEmployees({ role: e.target.value, isArchive }));
  };

  const handleArchivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(filterEmployees({ role, isArchive: e.target.checked }));
  };

  return (
    <div className={styles.filterForm}>
      <label className={styles.labelrole}>
        Должность:
        <select value={role} onChange={handlePositionChange}>
          <option value="">Все должности</option>
          <option value="Повар">Повар</option>
          <option value="Официант">Официант</option>
          <option value="Водитель">Водитель</option>
        </select>
      </label>
      <label className={styles.labelisarchive}>
        <input
          type="checkbox"
          checked={isArchive}
          onChange={handleArchivedChange}
        />
        В архиве
      </label>
    </div>
  );
};

export default FilterForm;
