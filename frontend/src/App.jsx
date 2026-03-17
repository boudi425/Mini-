import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

const App = () => (
  <Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route
      path="/users"
      element={
        <ProtectedRoute>
          <UsersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/chat/:userId"
      element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
