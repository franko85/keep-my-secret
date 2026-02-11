import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Fab,
    IconButton,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {Add as AddIcon, People as PeopleIcon,} from '@mui/icons-material';
import {useGroups} from '../contexts/GroupContext';
import {useAuth} from '../contexts/AuthContext';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';
import type {Group} from '../types';
import {formatDate} from '../utils/dateUtils';

const GroupList: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // @ts-ignore - MUI theme breakpoints
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {groups, fetchGroups, addGroup} = useGroups();
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        setIsLoading(true);
        setError('');
        try {
            await fetchGroups();
        } catch (err) {
            setError('Errore nel caricamento dei gruppi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGroupClick = (group: Group) => {
        navigate(`/groups/${group.id}`);
    };

    const handleGroupCreated = (group: Group) => {
        addGroup(group);
        setCreateModalOpen(false);
    };

    const handleGroupJoined = (group: Group) => {
        addGroup(group);
        setJoinModalOpen(false);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{pt: 3}}>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton sx={{mr: 1, visibility: 'hidden'}} disabled>
                    {/* Placeholder per allineamento con le altre pagine */}
                </IconButton>
                <Typography variant="h4" component="h1">
                    I Miei Gruppi
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {groups.length === 0 ? (
                <Card sx={{mt: 3, textAlign: 'center', p: 4}}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nessun gruppo trovato
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 0}}>
                        Crea un nuovo gruppo o unisciti a uno esistente per iniziare!
                    </Typography>
                </Card>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 2,
                    mt: 1
                }}>
                    {groups.map((group) => (
                        <Card key={group.id} sx={{mb: 2}}>
                            <CardActionArea onClick={() => handleGroupClick(group)}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <PeopleIcon color="primary" sx={{mr: 1}}/>
                                        <Typography variant="h6" component="div">
                                            {group.name}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" gap={1} mb={1}>
                                        <Chip
                                            label={`${group.memberIds.length} membri`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        {group.createdById === user?.id && (
                                            <Chip
                                                label="Creatore"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Creato il {formatDate(group.createdAt)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Pulsanti azione mobile con SpeedDial */}
            {isMobile ? (
                <SpeedDial
                    ariaLabel="Azioni gruppo"
                    sx={{position: 'fixed', bottom: 72, right: 16}}
                    icon={<SpeedDialIcon icon={<AddIcon/>}/>} // Usa il + come icona principale
                    onClose={() => setSpeedDialOpen(false)}
                    onOpen={() => setSpeedDialOpen(true)}
                    open={speedDialOpen}
                >
                    <SpeedDialAction
                        icon={<AddIcon/>}
                        title="Crea Gruppo"
                        onClick={() => {
                            setSpeedDialOpen(false);
                            setCreateModalOpen(true);
                        }}
                    />
                    <SpeedDialAction
                        icon={<PeopleIcon/>}
                        title="Unisciti"
                        onClick={() => {
                            setSpeedDialOpen(false);
                            setJoinModalOpen(true);
                        }}
                    />
                </SpeedDial>
            ) : (
                <>
                    <Fab
                        color="primary"
                        aria-label="crea gruppo"
                        sx={{position: 'fixed', bottom: 16, right: 96}}
                        onClick={() => setCreateModalOpen(true)}
                    >
                        <AddIcon/>
                    </Fab>
                    <Fab
                        color="secondary"
                        aria-label="unisciti"
                        sx={{position: 'fixed', bottom: 16, right: 16}}
                        onClick={() => setJoinModalOpen(true)}
                    >
                        <PeopleIcon/>
                    </Fab>
                </>
            )}

            <CreateGroupModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onGroupCreated={handleGroupCreated}
            />

            <JoinGroupModal
                open={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                onGroupJoined={handleGroupJoined}
            />
        </Box>
    );
};

export default GroupList;

