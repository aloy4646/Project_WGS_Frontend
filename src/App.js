import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  // Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  // ListItemIcon,
  // Divider,
  Box,
} from '@mui/material';
import Home from './pages/Home';
import ListKaryawan from './pages/ListKaryawan';
import ListUpdateRequest from './pages/ListUpdateRequest';
import AddCertificate from './pages/AddCertificate';
import DetailKaryawan from './pages/DetailKaryawan';
import Login from './pages/Login';
import DetailUpdateRequest from './pages/DetailUpdateRequest';
import FormUserData from './pages/FormUserData';
import FormUserDokumen from './pages/FormUserDokumen';

const theme = createTheme();

const drawerWidth = 240;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                <ListItem button component={Link} to="/">
                  <ListItemText primary="Home Page" />
                </ListItem>
                <ListItem button component={Link} to="/karyawan/list">
                  <ListItemText primary="List Karyawan" />
                </ListItem>
                <ListItem button component={Link} to="/karyawan/update-request">
                  <ListItemText primary="List Update Request" />
                </ListItem>
                <ListItem button component={Link} to="/sertifikat/form">
                  <ListItemText primary="Add a Certificate" />
                </ListItem>
                <ListItem button component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          >
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                  Company Name
                </Typography>
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/karyawan/list" element={<ListKaryawan />} />
              <Route path="/karyawan/update-request" element={<ListUpdateRequest />} />
              <Route path="/karyawan/update-request/:update_requestId" element={<DetailUpdateRequest />} />
              <Route path="/karyawan/update/form/data/:id" element={<FormUserData />} />
              <Route path="/karyawan/update/form/dokumen/:id" element={<FormUserDokumen />} />
              <Route path="/sertifikat/form" element={<AddCertificate />} />
              <Route path="/karyawan/:id" element={<DetailKaryawan />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
