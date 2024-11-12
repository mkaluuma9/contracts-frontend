import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Grid, Stack, Typography, TextField, Button, MenuItem } from '@mui/material';

const EditContract = () => {
  const { id } = useParams(); // Get contract ID from URL
  const navigate = useNavigate();

  // State to hold contract data
  const [contract, setContract] = useState({
    contractName: '',
    companyName: '',
    commencementDate: '',
    expiryDate: '',
    terminationPeriod: '',
    contractualSum: '',
    status: '',
    volume: '',
  });

  // Fetch contract data by ID
  useEffect(() => {
    const fetchContract = async () => {
      const response = await fetch(`http://localhost:5000/api/contracts/${id}`);
      const data = await response.json();
      setContract(data);
    };

    fetchContract();
  }, [id]);

  // Handle form submission
  const handleUpdateContract = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/contracts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contract),
    });

    if (response.ok) {
      navigate('/contracts'); // Navigate back to contract list
    } else {
      console.error('Failed to update contract');
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContract((prevContract) => ({
      ...prevContract,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Edit Contract</Typography>
          <Typography component={Link} to="/contracts" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Back to Contracts
          </Typography>
        </Stack>
      </Grid>

      {/* Form Fields */}
      <Grid item xs={12}>
        <form onSubmit={handleUpdateContract}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contract Name"
                name="contractName"
                value={contract.contractName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={contract.companyName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Commencement Date"
                name="commencementDate"
                type="date"
                value={contract.commencementDate.split('T')[0]} // Format the date
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={contract.expiryDate.split('T')[0]} // Format the date
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Termination Period (days)"
                name="terminationPeriod"
                type="number"
                value={contract.terminationPeriod}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contractual Sum"
                name="contractualSum"
                value={contract.contractualSum}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Status Dropdown */}
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={contract.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="close to expiry">Close to Expiry</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Volume"
                name="volume"
                value={contract.volume}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Update Contract
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default EditContract;
