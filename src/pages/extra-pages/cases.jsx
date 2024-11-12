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
// third-party
import { NumericFormat } from 'react-number-format';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// project import
import Dot from 'components/@extended/Dot';

// Define your table headers based on the litigation model
const headCells = [
  { id: 'caseNumber', align: 'left', disablePadding: false, label: 'Case Number' },
  { id: 'partiesInvolved', align: 'left', disablePadding: true, label: 'Parties Involved' },
  { id: 'causeOfAction', align: 'left', disablePadding: true, label: 'Cause of Action' },
  { id: 'brief', align: 'left', disablePadding: true, label: 'Brief' },
  { id: 'suitAmount', align: 'right', disablePadding: false, label: 'Suit Amount' },
  { id: 'chancesOfSuccess', align: 'left', disablePadding: false, label: 'Chances of Success' },
  { id: 'status', align: 'left', disablePadding: false, label: 'Status' },
  { id: 'presidingJudge', align: 'left', disablePadding: false, label: 'Presiding Judge' },
  { id: 'actions', align: 'center', disablePadding: false, label: 'Actions' },
];

// Litigation Status Component
function LitigationStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'ongoing':
      color = 'success';
      title = 'Ongoing';
      break;
    case 'completed':
      color = 'success';
      title = 'Completed';
      break;
    default:
      color = 'primary';
      title = 'Unknown';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

LitigationStatus.propTypes = { status: PropTypes.string };

// Main Litigation Table Component
export default function LitigationTable() {
  const [litigations, setLitigations] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('caseNumber');

  const navigate = useNavigate();

  const handleAddLitigation = () => {
    navigate('/add-case');
  };

  // Fetch litigation data
  useEffect(() => {
    const fetchLitigations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/litigations/');
        const data = await response.json();
        setLitigations(data);
      } catch (error) {
        console.error('Error fetching litigations:', error);
      }
    };

    fetchLitigations();
  }, []);

  // Delete litigation by ID
  const handleDeleteLitigation = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/litigations/${id}`, {
        method: 'DELETE'
      });
      setLitigations((prevLitigations) => prevLitigations.filter(litigation => litigation.id !== id));
    } catch (error) {
      console.error('Error deleting litigation:', error);
    }
  };

  // Navigate to the edit litigation page
  const handleEditLitigation = (id) => {
    navigate(`/edit-case/${id}`);
  };

  // PDF Download Function
  const handleDownloadPDF = async () => {
    const input = document.getElementById('litigation-table'); // Add an ID to the table container
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

    pdf.save('litigations.pdf');
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
        id="litigation-table" // Add ID for PDF generation
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
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(litigations, getComparator(order, orderBy)).map((litigation, index) => {
              const labelId = `litigation-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={litigation.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {litigation.caseNumber}</Link>
                  </TableCell>
                  <TableCell>{litigation.partiesInvolved}</TableCell>
                  <TableCell>{litigation.causeOfAction}</TableCell>
                  <TableCell>{litigation.brief}</TableCell>
                  <TableCell align="right">
                    <NumericFormat value={litigation.suitAmount} displayType="text" thousandSeparator prefix="$" />
                  </TableCell>
                  <TableCell>
                    <LitigationStatus status={litigation.chancesOfSuccess} />
                  </TableCell>
                  <TableCell>{litigation.status}</TableCell>
                  <TableCell>{litigation.presidingJudge}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditLitigation(litigation.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLitigation(litigation.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button type="button" variant="contained" color="primary" onClick={handleAddLitigation}>
          Add a Case
        </Button>
        <Button type="button" variant="contained" color="secondary" onClick={handleDownloadPDF}>
          Download Cases PDF
        </Button>
      </Stack>
    </Box>
  );
}
