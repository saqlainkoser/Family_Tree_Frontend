import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Chip,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  Psychology as PsychologyIcon,
  Computer as ComputerIcon,
  EmojiObjects as EmojiObjectsIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  location: string;
  occupation: string;
  salary: string;
  maritalStatus: string;
  biography: string;
  behaviour: string[];
  personality: string[];
  basicNeeds: string[];
  technologies: string[];
  wishes: string[];
  disappointment: string[];
}

const sampleUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Veronika Kovalenko',
    age: 32,
    photo: '/path/to/photo1.jpg',
    location: 'Kyiv, Ukraine',
    occupation: 'Art Director',
    salary: '45000-55000 UAH',
    maritalStatus: 'Married, has two children',
    biography: 'Veronika was born and raised in Kyiv. She obtained a higher education in graphic design and has worked in the art field for over 10 years. Her passion for preserving family history through art has led her to explore new ways of documenting memories.',
    behaviour: [
      'Open to new experiences',
      'Interested in the history of the family',
      'Values art highly',
      'Actively seeks opportunities to create expressions from ideas'
    ],
    personality: [
      'Creative',
      'Intuitive',
      'Empathetic',
      'Detail-oriented personality'
    ],
    basicNeeds: [
      'Work-life balance',
      'Creative freedom and emotional expression',
      'Aesthetic visual design',
      'Family time together',
      'Access to art materials and tools'
    ],
    technologies: [
      'Social networks',
      'Design tools',
      'Family tree apps'
    ],
    wishes: [
      'Enhanced interface and organization',
      'Integration of family tree and photo albums',
      'Better collaboration tools'
    ],
    disappointment: [
      'Lack of creative tools',
      'Limited customization options',
      'No space for artistic expression'
    ]
  },
  {
    id: '2',
    name: 'Olena Matviienko',
    age: 35,
    photo: '/path/to/photo2.jpg',
    location: 'Lviv, Ukraine',
    occupation: 'Photographer',
    salary: '35000-45000 UAH',
    maritalStatus: 'Married, has two children',
    biography: 'Professional photographer with 12 years of experience specializing in family portraits. Passionate about capturing moments that tell stories across generations.',
    behaviour: [
      'Values family time',
      'Detail-oriented',
      'Enjoys storytelling'
    ],
    personality: [
      'Patient',
      'Creative',
      'Observant'
    ],
    basicNeeds: [
      'Quality time with family',
      'Professional development',
      'Work-life balance'
    ],
    technologies: [
      'Photo editing software',
      'Cloud storage',
      'Social media platforms'
    ],
    wishes: [
      'Better photo organization',
      'Family history integration',
      'Collaborative albums'
    ],
    disappointment: [
      'Limited storage options',
      'Complex user interface',
      'Lack of sharing features'
    ]
  },
  {
    id: '3',
    name: 'Ivan Ohiienko',
    age: 45,
    photo: '/path/to/photo3.jpg',
    location: 'Cherkasy, Ukraine',
    occupation: 'Professor of Historical Sciences',
    salary: '20000-30000 UAH',
    maritalStatus: 'Married',
    biography: 'Dedicated his life to studying and preserving Ukrainian history. Has published several books on genealogy and family heritage.',
    behaviour: [
      'Research-oriented',
      'Methodical approach',
      'Values historical accuracy'
    ],
    personality: [
      'Analytical',
      'Patient',
      'Detail-oriented'
    ],
    basicNeeds: [
      'Access to historical records',
      'Organized documentation',
      'Research tools'
    ],
    technologies: [
      'Research databases',
      'Document scanning',
      'Archive software'
    ],
    wishes: [
      'Advanced search capabilities',
      'Better data organization',
      'Integration with archives'
    ],
    disappointment: [
      'Limited access to records',
      'Poor search functionality',
      'Lack of data verification'
    ]
  }
  // ... Add 9 more users with similar detailed profiles
];

const UserProfiles: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenProfile = (user: UserProfile) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseProfile = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ 
          color: theme.palette.primary.main,
          mb: 4,
          fontWeight: 900,
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          User Profiles
        </Typography>

        <Box sx={{ mb: 4, position: 'relative' }}>
          <TextField
            fullWidth
            placeholder="Search by name, location, or occupation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
              sx: { 
                fontWeight: 700,
                letterSpacing: '0.02em'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  '& > fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredUsers.map((user) => (
            <Box 
              key={user.id}
              sx={{ 
                width: { 
                  xs: '100%', 
                  sm: 'calc(50% - 24px)', 
                  md: 'calc(33.33% - 24px)' 
                } 
              }}
            >
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => handleOpenProfile(user)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={user.photo}
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 2,
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        letterSpacing: '0.02em'
                      }}>
                        {user.age} • {user.location}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        letterSpacing: '0.02em'
                      }}>
                        {user.occupation}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    mb: 2, 
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    letterSpacing: '0.02em'
                  }}>
                    {user.biography.slice(0, 120)}...
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Dialog
          open={openDialog}
          onClose={handleCloseProfile}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              backgroundImage: 'none',
            },
          }}
        >
          {selectedUser && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}>
                    {selectedUser.name}
                  </Typography>
                  <IconButton onClick={handleCloseProfile}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Avatar
                        src={selectedUser.photo}
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 2,
                          border: `2px solid ${theme.palette.primary.main}`,
                        }}
                      >
                        {selectedUser.name.charAt(0)}
                      </Avatar>
                      <Typography variant="h6" sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        {selectedUser.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        letterSpacing: '0.02em'
                      }}>
                        {selectedUser.age} • {selectedUser.location}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        letterSpacing: '0.02em'
                      }}>
                        {selectedUser.occupation}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        letterSpacing: '0.02em'
                      }}>
                        {selectedUser.salary}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        letterSpacing: '0.02em'
                      }}>
                        {selectedUser.maritalStatus}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      color: theme.palette.primary.main,
                      fontWeight: 800,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase'
                    }}>
                      Biography
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mb: 3, 
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      letterSpacing: '0.02em'
                    }}>
                      {selectedUser.biography}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ 
                        mb: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        <PsychologyIcon sx={{ mr: 1 }} /> Behaviour
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedUser.behaviour.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            sx={{
                              bgcolor: theme.palette.primary.main + '20',
                              color: theme.palette.primary.main,
                              fontWeight: 700,
                              letterSpacing: '0.02em'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ 
                        mb: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        <EmojiObjectsIcon sx={{ mr: 1 }} /> Personality
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedUser.personality.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            sx={{
                              bgcolor: theme.palette.secondary.main + '20',
                              color: theme.palette.secondary.main,
                              fontWeight: 700,
                              letterSpacing: '0.02em'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ 
                        mb: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        <FavoriteIcon sx={{ mr: 1 }} /> Basic Needs
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedUser.basicNeeds.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            sx={{
                              bgcolor: theme.palette.error.main + '20',
                              color: theme.palette.error.main,
                              fontWeight: 700,
                              letterSpacing: '0.02em'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ 
                        mb: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        <ComputerIcon sx={{ mr: 1 }} /> Technologies
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedUser.technologies.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            sx={{
                              bgcolor: theme.palette.info.main + '20',
                              color: theme.palette.info.main,
                              fontWeight: 700,
                              letterSpacing: '0.02em'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ 
                        mb: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}>
                        <LanguageIcon sx={{ mr: 1 }} /> Wishes
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedUser.wishes.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            sx={{
                              bgcolor: theme.palette.success.main + '20',
                              color: theme.palette.success.main,
                              fontWeight: 700,
                              letterSpacing: '0.02em'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProfile} sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 700,
                  letterSpacing: '0.02em'
                }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserProfiles; 