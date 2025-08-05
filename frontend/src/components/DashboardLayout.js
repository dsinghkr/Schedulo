import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import GroupIcon from '@mui/icons-material/Group';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 220;

// Define menu items with role-based visibility
const getMenuItems = (role) => {
  if (role === 'SuperAdmin') {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '' },
      { text: 'Users', icon: <PeopleIcon />, path: 'users' },
      { text: 'Teams', icon: <GroupIcon />, path: 'teams' },
      { text: 'Tasks', icon: <AssignmentIcon />, path: 'tasks' },
      { text: 'Task Assignments', icon: <TaskIcon />, path: 'assignments' },
      { text: 'Customers', icon: <PeopleIcon />, path: 'customers' },
      { text: 'Categories', icon: <CategoryIcon />, path: 'categories' },
      { text: 'Import/Export', icon: <ImportExportIcon />, path: 'import-export' },
    ];
  } else if (role === 'Admin') {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '' },
      { text: 'Teams', icon: <GroupIcon />, path: 'teams' },
      { text: 'Tasks', icon: <AssignmentIcon />, path: 'tasks' },
      { text: 'Task Assignments', icon: <TaskIcon />, path: 'assignments' },
      { text: 'Customers', icon: <PeopleIcon />, path: 'customers' },
      { text: 'Categories', icon: <CategoryIcon />, path: 'categories' },
      { text: 'Import/Export', icon: <ImportExportIcon />, path: 'import-export' },
    ];
  } else {
    // For User, Manager, Asst-Manager: show only Dashboard, Task Assignment, Customers, Tasks (readonly)
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '' },
      { text: 'Task Assignments', icon: <TaskIcon />, path: 'assignments' },
      { text: 'Customers', icon: <PeopleIcon />, path: 'customers' },
      { text: 'Tasks', icon: <AssignmentIcon />, path: 'tasks' },
    ];
  }
};

export default function DashboardLayout({ user, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = getMenuItems(user.role);

  const drawer = (
    <div style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)', borderTopRightRadius: 24, borderBottomRightRadius: 24, borderRight: '2px solid #e3e6ee' }}>
      <Divider />
      <List sx={{ mt: 0.5 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton selected={location.pathname.endsWith(item.path)} onClick={() => navigate(`/dashboard/${item.path}`)} sx={{
              borderRadius: 3,
              boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)',
              background: 'linear-gradient(90deg, #4f8cff 0%, #2355a0 100%)',
              color: '#fff',
              fontWeight: 600,
              height: 54,
              mb: 0.5,
              mt: 0,
              '&:hover': { background: 'linear-gradient(90deg, #2355a0 0%, #4f8cff 100%)', color: '#fff' },
              transition: 'background 0.3s, color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <ListItemIcon sx={{ minWidth: 40, color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ mt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout} sx={{
            borderRadius: 3,
            boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)',
            background: 'linear-gradient(90deg, #d32f2f 0%, #ff6b6b 100%)',
            color: '#fff',
            fontWeight: 600,
            height: 54,
            mb: 0.5,
            mt: 0,
            '&:hover': { background: 'linear-gradient(90deg, #ff6b6b 0%, #d32f2f 100%)', color: '#fff' },
            transition: 'background 0.3s, color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <ListItemIcon sx={{ minWidth: 40, color: '#fff' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: 140, background: 'linear-gradient(90deg, #2355a0 0%, #4f8cff 100%)', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', borderRadius: 0 }}>
        <Toolbar sx={{ minHeight: 140, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <Box sx={{ position: 'absolute', left: 24, top: 10, display: 'flex', alignItems: 'center', height: 120, width: 148, boxShadow: '0 4px 16px 0 rgba(31,38,135,0.18)', background: '#fff', borderRadius: '32px', p: 1 }}>
            <img src="/logo.png" alt="Schedulo Logo" style={{ height: '100%', width: '100%', background: 'transparent', borderRadius: '32px', objectFit: 'cover', margin: 'auto 0' }} />
          </Box>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" noWrap component="div" sx={{ color: '#fff', fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>
              Schedulo
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'bottom' }}>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', fontWeight: 600, fontSize: 22, mr: 2 }}>
              Welcome, {user.name} ({user.role})
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
          minHeight: '100vh',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          borderRight: '2px solid #e3e6ee',
          mt: '240px', // push nav below header
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          paddingTop: 15,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
