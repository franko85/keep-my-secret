import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { GroupProvider } from './contexts/GroupContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupList from './pages/GroupList';
import GroupDetail from './pages/GroupDetail';
import ThreadDetail from './pages/ThreadDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <GroupProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/groups" element={<GroupList />} />
                <Route path="/groups/:groupId" element={<GroupDetail />} />
                <Route path="/groups/:groupId/threads/:threadId" element={<ThreadDetail />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="/" element={<Navigate to="/groups" replace />} />
              <Route path="*" element={<Navigate to="/groups" replace />} />
            </Routes>
          </BrowserRouter>
        </GroupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

