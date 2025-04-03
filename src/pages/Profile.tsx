import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Email,
  Lock,
  Notifications,
  PhotoCamera,
  History,
} from '@mui/icons-material';
import Layout from '../components/Layout';

const MotionCard = motion(Card);

interface UserProfile {
  name: string;
  email: string;
  photo?: string;
  subscription: 'free' | 'premium' | 'researcher';
  notifications: {
    email: boolean;
    push: boolean;
    research: boolean;
  };
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    subscription: 'free',
    notifications: {
      email: true,
      push: true,
      research: false,
    },
  });

  const handleNotificationToggle = (type: keyof UserProfile['notifications']) => {
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage your account settings and preferences.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Profile Information */}
            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                  border: '1px solid rgba(108, 99, 255, 0.1)',
                  boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                    <Avatar
                      src={profile.photo}
                      sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto',
                        border: `3px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <Button
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        minWidth: 'auto',
                        p: 1,
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <PhotoCamera sx={{ color: 'white' }} />
                      <input hidden accept="image/*" type="file" />
                    </Button>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {profile.email}
                  </Typography>
                  <Chip
                    label={profile.subscription.charAt(0).toUpperCase() + profile.subscription.slice(1)}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </MotionCard>
            </Box>

            {/* Settings */}
            <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                  border: '1px solid rgba(108, 99, 255, 0.1)',
                  boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                    <Box>
                      <TextField
                        fullWidth
                        label="Name"
                        value={profile.name}
                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </Box>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Lock />}
                        fullWidth
                      >
                        Change Password
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Notifications"
                        secondary="Receive updates about your family tree"
                      />
                      <Switch
                        checked={profile.notifications.email}
                        onChange={() => handleNotificationToggle('email')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Notifications />
                      </ListItemIcon>
                      <ListItemText
                        primary="Push Notifications"
                        secondary="Get instant updates on your device"
                      />
                      <Switch
                        checked={profile.notifications.push}
                        onChange={() => handleNotificationToggle('push')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <History />
                      </ListItemIcon>
                      <ListItemText
                        primary="Research Updates"
                        secondary="Receive updates about research progress"
                      />
                      <Switch
                        checked={profile.notifications.research}
                        onChange={() => handleNotificationToggle('research')}
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Subscription
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                      <Card
                        sx={{
                          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                          border: '1px solid rgba(108, 99, 255, 0.1)',
                          boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Premium
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Access advanced features and research tools
                          </Typography>
                          <Button variant="contained" fullWidth>
                            Upgrade
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                      <Card
                        sx={{
                          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                          border: '1px solid rgba(108, 99, 255, 0.1)',
                          boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Researcher
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Professional research tools and access
                          </Typography>
                          <Button variant="contained" fullWidth>
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Profile; 