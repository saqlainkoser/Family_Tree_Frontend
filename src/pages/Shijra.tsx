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
  ArrowBack as ArrowBackIcon,
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

const Shijra: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<FamilyMember[]>([
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
    if (!isDraggingNode) {
      setIsDragging(true);
      setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isDraggingNode) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingNode) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDraggingNode) {
      const touch = e.touches[0];
      setIsDragging(true);
      setStartPosition({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && !isDraggingNode) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - startPosition.x,
        y: touch.clientY - startPosition.y,
      });
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingNode) {
      setIsDragging(false);
    }
  };

  const handleZoom = (delta: number) => {
    setScale(Math.min(Math.max(0.5, scale + delta), 2));
  };

  const drawConnections = () => {
    const connections: ReactElement[] = [];

    // Add shared SVG definitions for glow effect
    connections.push(
      <svg key="defs" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    );

    // Draw vertical connections
    members.forEach(member => {
      if (member.children) {
        member.children.forEach(childId => {
          const child = members.find(m => m.id === childId);
          if (child?.x !== undefined && child?.y !== undefined && member.x !== undefined && member.y !== undefined) {
            const startX = member.x + 30;
            const startY = member.y + 60;
            const endX = child.x + 30;
            const endY = child.y;

            connections.push(
              <svg
                key={`connection-${member.id}-${childId}`}
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
                  d={`M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`}
                  stroke="#ff8f00"
                  strokeWidth="4"
                  strokeOpacity="0.3"
                  fill="none"
                  filter="url(#glow)"
                />
                {/* Main line */}
                <path
                  d={`M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`}
                  stroke="#ff8f00"
                  strokeWidth="1"
                  fill="none"
                  filter="url(#glow)"
                />
                {/* Connection points */}
                <circle
                  cx={startX}
                  cy={startY}
                  r="2"
                  fill="#ff8f00"
                  filter="url(#glow)"
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r="2"
                  fill="#ff8f00"
                  filter="url(#glow)"
                />
              </svg>
            );
          }
        });
      }

      // Draw spouse connections
      if (member.spouse) {
        const spouse = members.find(m => m.id === member.spouse);
        if (spouse && member.x !== undefined && member.y !== undefined && spouse.x !== undefined && spouse.y !== undefined) {
          const startX = member.x + 60;
          const endX = spouse.x;
          const lineY = member.y + 30;

          connections.push(
            <svg
              key={`spouse-${member.id}-${spouse.id}`}
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
              {/* Spouse glow base */}
              <path
                d={`M ${startX} ${lineY} H ${endX}`}
                stroke="#ff8f00"
                strokeWidth="4"
                strokeOpacity="0.3"
                strokeDasharray="5,5"
                fill="none"
                filter="url(#glow)"
              />
              {/* Main spouse line */}
              <path
                d={`M ${startX} ${lineY} H ${endX}`}
                stroke="#ff8f00"
                strokeWidth="1"
                strokeDasharray="5,5"
                fill="none"
                filter="url(#glow)"
              />
              {/* Connection points */}
              <circle
                cx={startX}
                cy={lineY}
                r="2"
                fill="#ff8f00"
                filter="url(#glow)"
              />
              <circle
                cx={endX}
                cy={lineY}
                r="2"
                fill="#ff8f00"
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

  const updateMemberPosition = (id: string, newX: number, newY: number) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id
          ? { ...member, x: newX, y: newY }
          : member
      )
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          bgcolor: '#1E1E1E',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">My Shijra</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: 'white' }}>
            <ShareIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Tree View */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          height: 'calc(100vh - 64px)',
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
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={() => handleZoom(-0.1)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
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
            width: '100%',
            height: '100%',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {drawConnections()}
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                drag
                dragMomentum={false}
                dragElastic={0}
                onDragStart={(event, info) => {
                  setIsDraggingNode(true);
                  setWasDragged(false);
                  event.stopPropagation();
                }}
                onDrag={() => {
                  setWasDragged(true);
                }}
                onDragEnd={(event, info) => {
                  setIsDraggingNode(false);
                  if (member.x !== undefined && member.y !== undefined) {
                    const newX = member.x + info.offset.x / scale;
                    const newY = member.y + info.offset.y / scale;
                    updateMemberPosition(member.id, newX, newY);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: member.x,
                  top: member.y,
                  zIndex: isDraggingNode ? 2 : 1,
                  cursor: 'move',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!wasDragged) {
                      handleOpenDialog(member);
                    }
                    setWasDragged(false);
                  }}
                >
                  <Avatar
                    src={member.photo}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '2px solid #ff8f00',
                      boxShadow: '0 0 10px rgba(255, 143, 0, 0.4)',
                      bgcolor: '#2A2A2A',
                      color: '#ff8f00',
                      fontSize: '2rem',
                    }}
                  >
                    {getMemberEmoji(member)}
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      color: 'white',
                      fontWeight: 'medium',
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
        </Box>

        {/* Add Member Button */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            bgcolor: '#ff8f00',
            color: 'white',
            '&:hover': {
              bgcolor: '#f57c00',
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

      {/* Add/Edit Member Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1E1E1E',
            backgroundImage: 'none',
            color: 'white',
          },
        }}
      >
        <DialogTitle>
          {selectedMember ? 'Edit Family Member' : 'Add Family Member'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
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
                bgcolor: '#2A2A2A',
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
                    border: '2px solid #ff8f00',
                    boxShadow: '0 0 10px rgba(255, 143, 0, 0.4)',
                    bgcolor: '#2A2A2A',
                    color: '#ff8f00',
                    fontSize: '3rem',
                  }}
                >
                  {getMemberEmoji(selectedMember)}
                </Avatar>
              ) : (
                <IconButton sx={{ color: '#ff8f00' }}>
                  <PhotoIcon sx={{ fontSize: 40 }} />
                </IconButton>
              )}
            </Box>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              size="small"
              defaultValue={selectedMember?.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              defaultValue={selectedMember?.birthDate}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Birth Place"
              variant="outlined"
              size="small"
              defaultValue={selectedMember?.birthPlace}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#ff8f00',
              '&:hover': {
                bgcolor: '#f57c00',
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

export default Shijra; 