import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '400px',
        backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#fff',
    }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? '#1e2432' : '#f5f5f5',
    padding: theme.spacing(1, 2),
    '& .MuiIconButton-root': {
        marginRight: -theme.spacing(1),
    }
}));

const EditAttachmentDialog = ({ open, onClose, file, onUpdate }) => {
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (file) {
            setFileName(file.filename);
        }
    }, [file]);

    const handleUpdate = () => {
        if (fileName.trim()) {
            onUpdate(fileName.trim());
            onClose();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleUpdate();
        }
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <StyledDialogTitle>
                Edit attachment
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ mb: 1 }}>File name</Box>
                <TextField
                    autoFocus
                    fullWidth
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: theme => 
                                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }
                    }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleUpdate}
                    sx={{ mt: 2, borderRadius: 1 }}
                >
                    Update
                </Button>
            </DialogContent>
        </StyledDialog>
    );
};

export default EditAttachmentDialog;