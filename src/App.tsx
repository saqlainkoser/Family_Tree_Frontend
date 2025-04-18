import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';


// Import pages (we'll create these next)
import Home from './pages/Home';
import Tree from './pages/Tree.jsx';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfiles from './pages/UserProfiles';
import Shijra from './pages/Shijra';
import VerticalTree from './pages/Vetical_view';

import TreeContextProvider from './Context/TreeContext';
import FamilyMemberForm from './components/Form';
const queryClient = new QueryClient();

const App: React.FC = () => {
  // const navigate = useNavigate();/
  return (
    <QueryClientProvider client={queryClient}>
      <TreeContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Tree />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<UserProfiles />} />
            <Route path="/add-members" element={<FamilyMemberForm onClose={() => window.history.back()} />} />
            <Route path="/shijra" element={<Shijra />} />
            <Route path="/vertical" element={<VerticalTree />} />
          </Routes>
        </Router>
      </ThemeProvider>
      </TreeContextProvider>
    </QueryClientProvider>
  );
};

export default App;
