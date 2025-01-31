import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeList from "../components/EmployeeList/EmployeeList";
import Header from "../common/Header";
import AddForm from "../components/AddForm/AddForm";

const AppRouter: React.FC = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<EmployeeList />} />
      <Route path="/add" element={<AddForm isEditing={false} />} />
      <Route path="/employees/:id" element={<AddForm isEditing={true} />} />
      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  </Router>
);

export default AppRouter;
