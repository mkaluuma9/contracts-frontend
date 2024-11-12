import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// material-ui
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

// Define table headers based on the legislation model
const headCells = [
  { id: 'name', align: 'left', disablePadding: false, label: 'Name' },
  { id: 'legislation_type', align: 'left', disablePadding: false, label: 'Type' },
  { id: 'year', align: 'left', disablePadding: false, label: 'Year' },
  { id: 'actions', align: 'center', disablePadding: false, label: 'Actions' },
];

// Main Legislation Table Component
export default function LegislationTable() {
  const [legislations, setLegislations] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const navigate = useNavigate();

  const handleAddLegislation = () => {
    navigate('/add-legislation');
  };

  // Fetch legislation data
  useEffect(() => {
    const fetchLegislations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/legislations/');
        const data = await response.json();
        setLegislations(data);
      } catch (error) {
        console.error('Error fetching legislations:', error);
      }
    };

    fetchLegislations();
  }, []);

  // Delete legislation by ID
  const handleDeleteLegislation = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/legislations/${id}`, {
        method: 'DELETE',
      });
      setLegislations((prevLegislations) => prevLegislations.filter(legislation => legislation.id !== id));
    } catch (error) {
      console.error('Error deleting legislation:', error);
    }
  };

  // Navigate to the edit legislation page
  const handleEditLegislation = (id) => {
    navigate(`/edit-legislation/${id}`);
  };

  // PDF Download Function
  const handleDownloadPDF = async () => {
    const input = document.getElementById('legislation-table'); // Add an ID to the table container
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

    pdf.save('legislations.pdf');
  };

  // Sorting helper functions (unchanged)
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  return (
    <Box>
      <TableContainer
        id="legislation-table" // Add ID for PDF generation
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' },
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
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(legislations, getComparator(order, orderBy)).map((legislation, index) => {
              const labelId = `legislation-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={legislation.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {legislation.name}</Link>
                  </TableCell>
                  <TableCell>{legislation.legislation_type}</TableCell>
                  <TableCell>{legislation.year}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditLegislation(legislation.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLegislation(legislation.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 5 }}>
        <Button type="button" variant="contained" color="primary" onClick={handleAddLegislation}>
          Add Legislation
        </Button>
        <Button type="button" variant="contained" color="secondary" onClick={handleDownloadPDF}>
          Download Legislation PDF
        </Button>
      </Stack>
    </Box>
  );
}
