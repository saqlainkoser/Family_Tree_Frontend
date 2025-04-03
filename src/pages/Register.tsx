import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Person,
  Email,
  Lock,
  LockOutlined,
  PhotoCamera,
} from '@mui/icons-material';

const Register: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement registration logic here
    console.log('Registration attempt:', formData);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 600,
              background: 'linear-gradient(45deg, #6C63FF 30%, #FF6B6B 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Your Account
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <LockOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Profile Photo
              <input hidden accept="image/*" type="file" />
            </Button>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #6C63FF 30%, #FF6B6B 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5952FF 30%, #FF5252 90%)',
                },
              }}
            >
              Create Account
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register; 