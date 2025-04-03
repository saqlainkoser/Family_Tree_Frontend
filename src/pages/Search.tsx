import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Search as SearchIcon,
  FilterList,
  VerifiedUser,
  History,
  Person,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';
import Layout from '../components/Layout';

interface SearchResult {
  id: string;
  name: string;
  birthDate: string;
  location: string;
  photo?: string;
  matchConfidence: number;
  source: 'database' | 'archive' | 'research';
}

const MotionCard = motion(Card);

const Search: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([
    {
      id: '1',
      name: 'John Doe',
      birthDate: '1980-01-01',
      location: 'New York, USA',
      matchConfidence: 95,
      source: 'database',
    },
    // Add more sample results
  ]);

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Search Family Records
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Search through our extensive database of family records, archives, and research materials.
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.66% - 8px)' } }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter name, location, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.33% - 8px)' } }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.75,
                    background: 'linear-gradient(45deg, #6C63FF 30%, #FF6B6B 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5952FF 30%, #FF5252 90%)',
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Database Search" />
            <Tab label="Archive Search" />
            <Tab label="Research Services" />
          </Tabs>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {results.map((result) => (
              <Box
                key={result.id}
                sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}
              >
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    height: '100%',
                    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    border: '1px solid rgba(108, 99, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {result.name}
                      </Typography>
                      <Chip
                        icon={<VerifiedUser />}
                        label={`${result.matchConfidence}% Match`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">
                          {new Date(result.birthDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{result.location}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        icon={<History />}
                        label={result.source.charAt(0).toUpperCase() + result.source.slice(1)}
                        size="small"
                        variant="outlined"
                      />
                      <Button
                        size="small"
                        startIcon={<Person />}
                        variant="outlined"
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Box>
            ))}
          </Box>

          {activeTab === 2 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Research Services
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <Card
                    sx={{
                      background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                      border: '1px solid rgba(108, 99, 255, 0.1)',
                      boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Professional Research
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Get expert help from our professional researchers to uncover your family history.
                      </Typography>
                      <Button variant="contained" fullWidth>
                        Request Research
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <Card
                    sx={{
                      background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                      border: '1px solid rgba(108, 99, 255, 0.1)',
                      boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        DNA Analysis
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Connect with genetic experts to analyze your DNA and discover your ancestry.
                      </Typography>
                      <Button variant="contained" fullWidth>
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Search; 