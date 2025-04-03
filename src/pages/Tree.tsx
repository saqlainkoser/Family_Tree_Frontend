import React, { useState, useRef, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Avatar,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Share as ShareIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Message as MessageIcon,
  PhotoCamera as PhotoIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FamilyMember {
  id: string;
  name: string;
  photo?: string;
  birthDate: string;
  birthPlace?: string;
  children?: string[];
  parents?: string[];
  spouse?: string;
  x?: number;
  y?: number;
}

interface Position {
  x: number;
  y: number;
}

const getEmoji = (member: FamilyMember): string => {
  // First generation (grandparents)
  if (!member.parents || member.parents.length === 0) {
    if (member.spouse) {
      return member.id < member.spouse ? '👨' : '👱‍♀️'; // Male is 👨, female is 👱‍♀️
    }
    return '👨'; // Default to male emoji for single grandparents
  }

  // Second generation (parents)
  if (member.children && member.children.length > 0) {
    if (member.spouse) {
      return member.id < member.spouse ? '👨' : '👱‍♀️'; // Male is 👨, female is 👱‍♀️
    }
    return '👨'; // Default to male emoji for single parents
  }

  // Third generation (children)
  if (member.parents && member.parents.length > 0) {
    return '🧑'; // Son
  }

  return '👩'; // Default to daughter emoji
};

const Tree: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [members] = useState<FamilyMember[]>([
    // First Generation (Grandparents)
    {
      id: '1',
      name: 'John Smith',
      birthDate: '1950-01-01',
      birthPlace: 'New York',
      spouse: '2',
      children: ['3', '4', '5'],
      x: 400,
      y: 0,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      birthDate: '1952-03-15',
      birthPlace: 'Boston',
      spouse: '1',
      children: ['3', '4', '5'],
      x: 600,
      y: 0,
    },
    // Second Generation (Parents)
    {
      id: '3',
      name: 'James Smith',
      birthDate: '1975-05-15',
      birthPlace: 'Boston',
      parents: ['1', '2'],
      spouse: '6',
      children: ['9', '10'],
      x: 0,
      y: 200,
    },
    {
      id: '6',
      name: 'Emily Smith',
      birthDate: '1976-08-22',
      birthPlace: 'Chicago',
      spouse: '3',
      children: ['9', '10'],
      x: 200,
      y: 200,
    },
    {
      id: '4',
      name: 'Mary Johnson',
      birthDate: '1978-03-22',
      birthPlace: 'Chicago',
      parents: ['1', '2'],
      spouse: '7',
      children: ['11', '12'],
      x: 400,
      y: 200,
    },
    {
      id: '7',
      name: 'Robert Johnson',
      birthDate: '1977-11-30',
      birthPlace: 'Los Angeles',
      spouse: '4',
      children: ['11', '12'],
      x: 600,
      y: 200,
    },
    {
      id: '5',
      name: 'Michael Smith',
      birthDate: '1980-07-12',
      birthPlace: 'Boston',
      parents: ['1', '2'],
      spouse: '8',
      children: ['13', '14'],
      x: 800,
      y: 200,
    },
    {
      id: '8',
      name: 'Lisa Smith',
      birthDate: '1981-04-25',
      birthPlace: 'Boston',
      spouse: '5',
      children: ['13', '14'],
      x: 1000,
      y: 200,
    },
    // Third Generation (Children)
    {
      id: '9',
      name: 'David Smith',
      birthDate: '2000-09-18',
      birthPlace: 'Chicago',
      parents: ['3', '6'],
      x: 0,
      y: 400,
    },
    {
      id: '10',
      name: 'Emma Smith',
      birthDate: '2003-12-03',
      birthPlace: 'Chicago',
      parents: ['3', '6'],
      x: 200,
      y: 400,
    },
    {
      id: '11',
      name: 'William Johnson',
      birthDate: '2001-06-15',
      birthPlace: 'Los Angeles',
      parents: ['4', '7'],
      x: 400,
      y: 400,
    },
    {
      id: '12',
      name: 'Sophia Johnson',
      birthDate: '2004-08-20',
      birthPlace: 'Los Angeles',
      parents: ['4', '7'],
      x: 600,
      y: 400,
    },
    {
      id: '13',
      name: 'Oliver Smith',
      birthDate: '2002-03-10',
      birthPlace: 'Boston',
      parents: ['5', '8'],
      x: 800,
      y: 400,
    },
    {
      id: '14',
      name: 'Ava Smith',
      birthDate: '2005-05-28',
      birthPlace: 'Boston',
      parents: ['5', '8'],
      x: 1000,
      y: 400,
    },
  ]);

  const getMemberEmoji = (member: FamilyMember) => {
    return getEmoji(member);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPosition({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - startPosition.x,
        y: touch.clientY - startPosition.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setScale(Math.min(Math.max(0.5, scale + delta), 2));
  };

  const drawConnections = () => {
    const connections: ReactElement[] = [];

    // Add shared SVG definitions for enhanced glow effect
    connections.push(
      <svg key="defs" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feFlood flood-color="#ff6b00" result="glowColor"/>
            <feComposite in="glowColor" in2="coloredBlur" operator="in" result="glowComposite"/>
            <feMerge>
              <feMergeNode in="glowComposite"/>
              <feMergeNode in="glowComposite"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    );

    // Draw parent-child connections
    members.forEach(member => {
      if (member.children) {
        if (member.x !== undefined && member.y !== undefined) {
          const startX = member.x + 30;
          const startY = member.y + 80;
          const endY = member.y + 200;

          // Parent vertical line with enhanced glow
          connections.push(
            <svg
              key={`vertical-${member.id}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
                zIndex: 0,
              }}
            >
              {/* Glow effect base */}
              <path
                d={`M ${startX} ${startY} L ${startX} ${endY}`}
                stroke="#ff6b00"
                strokeWidth="10"
                strokeOpacity="0.7"
                fill="none"
                filter="url(#glow)"
              />
              {/* Main line */}
              <path
                d={`M ${startX} ${startY} L ${startX} ${endY}`}
                stroke="#ff6b00"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
              />
              {/* Enhanced connection point */}
              <circle
                cx={startX}
                cy={startY}
                r="6"
                fill="#ff6b00"
                filter="url(#glow)"
              />
            </svg>
          );

          // Draw horizontal lines to each child
          member.children.forEach(childId => {
            const child = members.find(m => m.id === childId);
            if (child?.x !== undefined && child?.y !== undefined) {
              const childX = child.x + 30;
              const childY = child.y;

              connections.push(
                <svg
                  key={`horizontal-${member.id}-${childId}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'visible',
                    zIndex: 0,
                  }}
                >
                  {/* Horizontal glow base */}
                  <path
                    d={`M ${startX} ${endY} H ${childX}`}
                    stroke="#ff6b00"
                    strokeWidth="10"
                    strokeOpacity="0.7"
                    fill="none"
                    filter="url(#glow)"
                  />
                  {/* Vertical glow base */}
                  <path
                    d={`M ${childX} ${endY} L ${childX} ${childY}`}
                    stroke="#ff6b00"
                    strokeWidth="10"
                    strokeOpacity="0.7"
                    fill="none"
                    filter="url(#glow)"
                  />
                  {/* Main horizontal line */}
                  <path
                    d={`M ${startX} ${endY} H ${childX}`}
                    stroke="#ff6b00"
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                  />
                  {/* Main vertical line */}
                  <path
                    d={`M ${childX} ${endY} L ${childX} ${childY}`}
                    stroke="#ff6b00"
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                  />
                  {/* Enhanced connection point */}
                  <circle
                    cx={childX}
                    cy={childY}
                    r="6"
                    fill="#ff6b00"
                    filter="url(#glow)"
                  />
                </svg>
              );
            }
          });
        }
      }

      // Draw spouse connections with enhanced glow
      if (member.spouse) {
        const spouse = members.find(m => m.id === member.spouse);
        if (spouse && member.x !== undefined && member.y !== undefined && spouse.x !== undefined && spouse.y !== undefined) {
          const startX = member.x + 30;
          const startY = member.y;
          const spouseX = spouse.x + 30;
          const spouseY = spouse.y;

          connections.push(
            <svg
              key={`spouse-${member.id}-${member.spouse}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
                zIndex: 0,
              }}
            >
              {/* Horizontal glow base */}
              <path
                d={`M ${startX} ${startY} H ${spouseX}`}
                stroke="#ff6b00"
                strokeWidth="10"
                strokeOpacity="0.7"
                fill="none"
                filter="url(#glow)"
              />
              {/* Main horizontal line */}
              <path
                d={`M ${startX} ${startY} H ${spouseX}`}
                stroke="#ff6b00"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
              />
              {/* Enhanced connection points */}
              <circle
                cx={startX}
                cy={startY}
                r="6"
                fill="#ff6b00"
                filter="url(#glow)"
              />
              <circle
                cx={spouseX}
                cy={spouseY}
                r="6"
                fill="#ff6b00"
                filter="url(#glow)"
              />
            </svg>
          );
        }
      }
    });

    return connections;
  };

  const handleOpenDialog = (member?: FamilyMember) => {
    setSelectedMember(member || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflow: 'hidden',
        position: 'relative',
        pb: 7,
      }}
    >
      {/* Top Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton sx={{ color: theme.palette.primary.main }}>
            <PersonIcon />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.main }}>
            <PhotoIcon />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.main }}>
            <SettingsIcon />
          </IconButton>
        </Box>
        <Box>
          <IconButton sx={{ color: theme.palette.primary.main }}>
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Tree View */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          height: 'calc(100vh - 128px)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Zoom Controls */}
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <IconButton
            onClick={() => handleZoom(0.1)}
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.background.paper },
            }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={() => handleZoom(-0.1)}
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.background.paper },
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Box>

        {/* Tree Content */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {drawConnections()}
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                left: member.x,
                top: member.y,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 0 30px ${theme.palette.primary.main}60`,
                  },
                }}
                onClick={() => handleOpenDialog(member)}
              >
                <Avatar
                  src={member.photo}
                  sx={{
                    width: 60,
                    height: 60,
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
                    fontSize: '2rem',
                  }}
                >
                  {getMemberEmoji(member)}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {member.name}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Add Member Button */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 80,
            right: 16,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            width: 56,
            height: 56,
            zIndex: 2,
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Footer Navigation */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 1,
          px: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          zIndex: 1000,
        }}
      >
        <IconButton onClick={() => navigate('/')} sx={{ color: theme.palette.text.secondary }}>
          <HomeIcon />
        </IconButton>
        <IconButton onClick={() => navigate('/search')} sx={{ color: theme.palette.text.secondary }}>
          <ShareIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => navigate('/messages')} sx={{ color: theme.palette.text.secondary }}>
          <MessageIcon />
        </IconButton>
        <IconButton onClick={() => navigate('/profile')} sx={{ color: theme.palette.text.secondary }}>
          <PersonIcon />
        </IconButton>
      </Box>

      {/* Add/Edit Member Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.primary.main }}>
          {selectedMember ? 'Edit Family Member' : 'Add Family Member'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.text.secondary,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                width: '100%',
                height: 120,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: theme.palette.background.default,
                borderRadius: 1,
                mb: 2,
              }}
            >
              {selectedMember ? (
                <Avatar
                  src={selectedMember.photo}
                  sx={{
                    width: 100,
                    height: 100,
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
                    fontSize: '3rem', // Make emoji even larger in dialog
                  }}
                >
                  {getMemberEmoji(selectedMember)}
                </Avatar>
              ) : (
                <IconButton>
                  <PhotoIcon sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
                </IconButton>
              )}
            </Box>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              size="small"
              defaultValue={selectedMember?.name}
            />
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              defaultValue={selectedMember?.birthDate}
            />
            <TextField
              fullWidth
              label="Birth Place"
              variant="outlined"
              size="small"
              defaultValue={selectedMember?.birthPlace}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tree; 