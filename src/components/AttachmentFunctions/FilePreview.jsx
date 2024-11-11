import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import mammoth from "mammoth";

const FilePreview = ({ file, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docxContent, setDocxContent] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize plugins
  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { Toolbar } = toolbarPluginInstance;
  const {
    CurrentPageInput,
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
  } = pageNavigationPluginInstance;

  const handleDocxFile = async (url) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxContent(result.value);
    } catch (err) {
      console.error('Error loading DOCX:', err);
      setError('Error loading document. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      );
    }

    const extension = file?.fileType
    const fileUrl = file?.url;

    switch (extension) {
      case 'pdf':
        return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
              {/* Toolbar with page navigation */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  p: 1,
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Toolbar>
                  {(props) => {
                    const {
                      CurrentScale,
                      ZoomIn,
                      ZoomOut,
                      EnterFullScreen,
                    } = props;
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ZoomOut />
                        <CurrentScale />
                        <ZoomIn />
                        <Box sx={{ borderLeft: 1, borderColor: 'divider', mx: 1, height: 24 }} />
                        <GoToPreviousPage />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CurrentPageInput /> of <NumberOfPages />
                        </Box>
                        <GoToNextPage />
                        <Box sx={{ borderLeft: 1, borderColor: 'divider', mx: 1, height: 24 }} />
                        <EnterFullScreen />
                      </Box>
                    );
                  }}
                </Toolbar>
              </Box>
              
              {/* PDF Viewer */}
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[
                    toolbarPluginInstance,
                    pageNavigationPluginInstance
                  ]}
                  onDocumentLoad={({ doc }) => {
                    setNumPages(doc.numPages);
                  }}
                  onPageChange={({ currentPage }) => {
                    setCurrentPage(currentPage);
                  }}
                />
              </Box>
            </Box>
          </Worker>
        );
      
      // ... các case khác giữ nguyên
      case 'doc':
      case 'docx':
        return (
          <Box 
            sx={{ 
              height: '80vh', 
              overflow: 'auto',
              p: 2,
              bgcolor: 'background.paper'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: docxContent }} />
          </Box>
        );
      
      case 'txt':
        return (
          <Box 
            component="iframe"
            src={fileUrl}
            sx={{ 
              width: '100%',
              height: '80vh',
              border: 'none'
            }}
          />
        );
      
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'jfif':
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }
            }}
          >
            <img 
              src={fileUrl} 
              alt={file.filename}
              onError={() => setError('Error loading image')}
            />
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>
              Preview not available for this file type.
            </Typography>
          </Box>
        );
    }
  };

  useEffect(() => {
    if (open && file?.url && file?.fileType?.toLowerCase().endsWith('docx')) {
      handleDocxFile(file.url);
    }

    // Reset states when dialog closes
    return () => {
      setNumPages(null);
      setCurrentPage(1);
    };
  }, [open, file]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {file?.filename}
            {/* {numPages && (
              <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                ({currentPage} of {numPages} pages)
              </Typography>
            )} */}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {getPreviewContent()}
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;