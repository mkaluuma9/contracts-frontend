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

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Contract ID'
  },
  {
    id: 'contractName',
    align: 'left',
    disablePadding: true,
    label: 'Contract Name'
  },
  {
    id: 'companyName',
    align: 'left',
    disablePadding: true,
    label: 'Company Name'
  },
  {
    id: 'contractualSum',
    align: 'right',
    disablePadding: false,
    label: 'Contractual Sum'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'volume',
    align: 'right',
    disablePadding: false,
    label: 'Volume'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

// Contract Table Header
function ContractTableHead({ order, orderBy }) {
  return (
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
  );
}

ContractTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

// Contract Status
function ContractStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'ongoing':
      color = 'success';
      title = 'Ongoing';
      break;
    case 'close to expiry':
      color = 'warning';
      title = 'Close to Expiry';
      break;
    case 'expired':
      color = 'error';
      title = 'Expired';
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

ContractStatus.propTypes = { status: PropTypes.string };

// Main Contract Table Component
export default function ContractTable() {
  const [contracts, setContracts] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  const navigate = useNavigate();

  const handleAddContract = () => {
    navigate('/add-contract');
  };

  // Fetch contract data
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contracts/');
        const data = await response.json();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, []);

  // Delete contract by ID
  const handleDeleteContract = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/contracts/${id}`, {
        method: 'DELETE'
      });
      setContracts((prevContracts) => prevContracts.filter(contract => contract.id !== id));
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  // Navigate to the edit contract page
  const handleEditContract = (id) => {
    navigate(`/edit-contract/${id}`);
  };

  // PDF Download Function
  const handleDownloadPDF = async () => {
    const input = document.getElementById('contract-table'); // Add an id to the table container
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

    pdf.save('contracts.pdf');
  };

  // Sorting helper functions
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
        id="contract-table" // Add ID for PDF generation
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
          <ContractTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(contracts, getComparator(order, orderBy)).map((contract, index) => {
              const labelId = `contract-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={contract.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {contract.id}</Link>
                  </TableCell>
                  <TableCell>{contract.contractName}</TableCell>
                  <TableCell>{contract.companyName}</TableCell>
                  <TableCell align="right">
                    <NumericFormat value={contract.contractualSum} displayType="text" thousandSeparator prefix="$" />
                  </TableCell>
                  <TableCell>
                    <ContractStatus status={contract.status} />
                  </TableCell>
                  <TableCell align="right">{contract.volume}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditContract(contract.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteContract(contract.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Button variant="contained" onClick={handleAddContract}>
          Add Contract
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
          Download Contracts PDF
        </Button>
      </Stack>
    </Box>
  );
}
