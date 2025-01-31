import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Employee {
  id: number;
  name: string;
  phone: string;
  birthday: string;
  role: "Повар" | "Официант" | "Водитель";
  isArchive: boolean;
}

interface EmployeeState {
  list: Employee[];
  loading: boolean;
  error: string | null;
  birthday: string;
  filters: {
    role: string;
    isArchive: boolean;
    birthdayMonth?: number;
  };
  sortCriteria: string;
  sortDirection: "asc" | "desc";
}

const initialState: EmployeeState = {
  list: [],
  loading: false,
  error: null,
  birthday: "",
  filters: {
    role: "",
    isArchive: false,
    birthdayMonth: undefined,
  },
  sortCriteria: "",
  sortDirection: "asc",
};

const loadEmployeesFromLocalStorage = (): Employee[] => {
  const data = localStorage.getItem("employees");
  return data ? JSON.parse(data) : [];
};

const saveEmployeesToLocalStorage = (employees: Employee[]) => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await axios.get<Employee[]>("/assets/employees.json");
    return response.data;
  }
);
const parseBirthday = (birthday: string): Date | null => {
  const [day, month, year] = birthday.split(".");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return isNaN(date.getTime()) ? null : date;
};

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    ...initialState,
    list: loadEmployeesFromLocalStorage(),
  },
  reducers: {
    addEmployee(state, action: PayloadAction<Employee>) {
      state.list.push(action.payload);
      saveEmployeesToLocalStorage(state.list);
    },
    updateEmployee(state, action: PayloadAction<Employee>) {
      const index = state.list.findIndex((emp) => emp.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        saveEmployeesToLocalStorage(state.list);
      }
    },
    sortEmployees: (state, action: PayloadAction<string>) => {
      const criteria = action.payload;
      if (state.sortCriteria === criteria) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortCriteria = criteria;
        state.sortDirection = "asc";
      }

      state.list.sort((a, b) => {
        let comparison = 0;
        if (criteria === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (criteria === "birthday") {
          const dateA = parseBirthday(a.birthday);
          const dateB = parseBirthday(b.birthday);

          if (!dateA && !dateB) {
            comparison = 0;
          } else if (!dateA) {
            comparison = -1;
          } else if (!dateB) {
            comparison = 1;
          } else {
            comparison = dateA.getTime() - dateB.getTime();
          }
        }

        return state.sortDirection === "asc" ? comparison : -comparison;
      });
    },
    filterEmployees(
      state,
      action: PayloadAction<{
        role: string;
        isArchive: boolean;
      }>
    ) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.loading = false;
          const existingIds = state.list.map((emp) => emp.id);
          const newEmployees = action.payload.filter(
            (emp) => existingIds.indexOf(emp.id) === -1
          );
          state.list.push(...newEmployees);
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      });
  },
});

export const { addEmployee, updateEmployee, sortEmployees, filterEmployees } =
  employeeSlice.actions;
export default employeeSlice.reducer;
