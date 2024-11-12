import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

// project import
// import AuthWrapper from './AuthWrapper';

// ================================|| ADD NEW CONTRACT FORM ||================================ //

export default function AddContract() {
  const [contractData, setContractData] = useState({
    contractName: '',
    companyName: '',
    commencementDate: '',
    expiryDate: '',
    terminationPeriod: '',
    contractualSum: '',
    status: '',
    volume: ''
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setContractData({
      ...contractData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contracts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contractData)
      });

      if (response.ok) {
        // Handle successful creation (e.g., navigate to contracts list or show success message)
        navigate('/contracts');
      } else {
        // Handle errors (e.g., show error message)
        console.error('Error creating contract:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  return (
    // <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Add New Contract</Typography>
            <Typography component={Link} to="/contracts" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Back to Contracts
            </Typography>
          </Stack>
        </Grid>

        {/* Form Fields */}
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract Name"
                  name="contractName"
                  value={contractData.contractName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={contractData.companyName}
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
                  value={contractData.commencementDate}
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
                  value={contractData.expiryDate}
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
                  value={contractData.terminationPeriod}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contractual Sum"
                  name="contractualSum"
                  value={contractData.contractualSum}
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
                  value={contractData.status}
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
                  value={contractData.volume}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Add Contract
              </Button>
            </Stack>
          </form>
        </Grid>
      </Grid>
    
  );
}
