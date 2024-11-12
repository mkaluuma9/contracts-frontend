import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// Material-UI components
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Define your table headers based on the file model
const headCells = [
  { id: 'fileName', align: 'left', disablePadding: false, label: 'File Name' },
  { id: 'numberOfFiles', align: 'left', disablePadding: true, label: 'Number of Files' },
  { id: 'details', align: 'left', disablePadding: true, label: 'Details' },
  { id: 'location', align: 'left', disablePadding: true, label: 'Location' },
  { id: 'actions', align: 'center', disablePadding: false, label: 'Actions' },
];

// Main File Table Component
export default function FileTable() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleAddFile = () => {
    navigate('/add-file');
  };

  // Fetch file data
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/files/');
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Delete file by ID
  const handleDeleteFile = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/files/${id}`, {
        method: 'DELETE',
      });
      setFiles((prevFiles) => prevFiles.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Navigate to the edit file page
  const handleEditFile = (id) => {
    navigate(`/edit-file/${id}`);
  };

  // PDF Download Function
  const handleDownloadPDF = async () => {
    const input = document.getElementById('file-table'); // Add an ID to the table container
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 190; // Adjust based on your needs
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if necessary
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('files.pdf');
  };

  return (
    <Box>
      <TableContainer
        id="file-table" // Add ID for PDF generation
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, index) => (
              <TableRow
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                key={file.id}
              >
                <TableCell component="th" scope="row">
                  <Link color="secondary"> {file.file_name}</Link>
                </TableCell>
                <TableCell>{file.number_of_files}</TableCell>
                <TableCell>{file.details}</TableCell>
                <TableCell>{file.location}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEditFile(file.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteFile(file.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 5 }}>
        <Button type="button" variant="contained" color="primary" onClick={handleAddFile}>
          Add a File
        </Button>
        <Button type="button" variant="contained" color="secondary" onClick={handleDownloadPDF}>
          Download Files PDF
        </Button>
      </Stack>
    </Box>
  );
}
