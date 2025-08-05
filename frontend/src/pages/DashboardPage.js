import React from 'react';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import SuperAdminDashboard from '../components/SuperAdminDashboard';
import AdminDashboard from '../components/AdminDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import AssistantDashboard from '../components/AssistantDashboard';
import UserDashboard from '../components/UserDashboard';
import UserList from '../components/UserList';
import CustomerList from '../components/CustomerList';
import TeamList from '../components/TeamList';
import TaskMasterList from '../components/TaskMasterList';
import ImportExportDashboard from '../components/ImportExportDashboard';
import CategoryList from '../components/CategoryList';
import TaskAssignment from '../components/TaskAssignment';

export default function DashboardPage() {
  const user = getUser();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  let dashboardContent = null;
  if (user.role === 'SuperAdmin') dashboardContent = <SuperAdminDashboard />;
  else if (user.role === 'Admin') dashboardContent = <AdminDashboard />;
  else if (user.role === 'Manager') dashboardContent = <ManagerDashboard />;
  else if (user.role === 'Asst-Manager') dashboardContent = <AssistantDashboard />;
  else dashboardContent = <UserDashboard />;

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="" element={dashboardContent} />
        <Route path="users" element={<UserList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="teams" element={<TeamList />} />
        <Route path="tasks" element={<TaskMasterList />} />
        <Route path="import-export" element={<ImportExportDashboard />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="assignments" element={<TaskAssignment user={user} />} />
      </Routes>
    </DashboardLayout>
  );
}
