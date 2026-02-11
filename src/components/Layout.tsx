import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const getBottomNavValue = () => {
    if (location.pathname.startsWith('/groups')) return 0;
    if (location.pathname === '/profile') return 1;
    return 0;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="sticky" sx={{ width: '100vw', left: 0, right: 0 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Keep My Secret
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer per mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/groups')}>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="I Miei Gruppi" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/profile')}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profilo" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: isMobile ? 8 : 3,
          pt: 3,
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      {/* Bottom Navigation per mobile */}
      {isMobile && (
        <BottomNavigation
          value={getBottomNavValue()}
          onChange={(_, newValue) => {
            if (newValue === 0) navigate('/groups');
            if (newValue === 1) navigate('/profile');
          }}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <BottomNavigationAction label="Gruppi" icon={<GroupIcon />} />
          <BottomNavigationAction label="Profilo" icon={<PersonIcon />} />
        </BottomNavigation>
      )}
    </Box>
  );
};

export default Layout;
