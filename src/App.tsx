import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';

// Import pages (we'll create these next)
import Home from './pages/Home';
import Tree from './pages/Tree';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfiles from './pages/UserProfiles';
import Shijra from './pages/Shijra';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<UserProfiles />} />
            <Route path="/shijra" element={<Shijra />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
