import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AccountTree,
  Search,
  PhotoCamera,
  VerifiedUser,
} from '@mui/icons-material';
import Layout from '../components/Layout';

const MotionCard = motion(Card);

const features = [
  {
    icon: <AccountTree sx={{ fontSize: 40 }} />,
    title: 'Create Your Family Tree',
    description: 'Build and visualize your family connections with our intuitive tree builder.',
  },
  {
    icon: <Search sx={{ fontSize: 40 }} />,
    title: 'Search & Discover',
    description: 'Find relatives and explore your family history through our extensive database.',
  },
  {
    icon: <PhotoCamera sx={{ fontSize: 40 }} />,
    title: 'Photo Processing',
    description: 'Enhance and preserve your family photos with our advanced processing tools.',
  },
  {
    icon: <VerifiedUser sx={{ fontSize: 40 }} />,
    title: 'Verified Information',
    description: 'Ensure accuracy with our verification system and expert research services.',
  },
];

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Layout>
      <Box
        sx={{
          position : 'absolute',
          left  : 0,
          top : 30,
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          py: 7,
          '@media (min-width: 1024px)': {
            pl: 30,
          },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              align="center"
              gutterBottom
              sx={{
                mb: 4,
                background: 'linear-gradient(45deg, #6C63FF 30%, #FF6B6B 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Discover Your Family History
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Build your family tree, search for relatives, and preserve your family's legacy
              for generations to come.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/tree')}
                sx={{ px: 4, py: 1.5 }}
              >
                Start Building
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/search')}
                sx={{ px: 4, py: 1.5 }}
              >
                Search Family
              </Button>
            </Box>
          </motion.div>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 16px)',
                    md: 'calc(25% - 16px)',
                  }
                }}
              >
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    border: '1px solid rgba(108, 99, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 0 30px rgba(108, 99, 255, 0.2)',
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home; 