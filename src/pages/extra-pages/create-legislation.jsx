import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

// ================================|| ADD NEW LEGISLATION FORM ||================================ //

export default function AddLegislation() {
  const [legislationData, setLegislationData] = useState({
    name: '',
    legislation_type: '',
    year: ''
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setLegislationData({
      ...legislationData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/legislations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(legislationData)
      });

      if (response.ok) {
        // Handle successful creation (e.g., navigate to legislation list or show success message)
        navigate('/legislations'); // Update to the correct path for your legislations page
      } else {
        // Handle errors (e.g., show error message)
        console.error('Error creating legislation:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating legislation:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Add New Legislation</Typography>
          <Typography component={Link} to="/legislations" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Back to Legislations
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
                label="Legislation Name"
                name="name"
                value={legislationData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Legislation Type Dropdown */}
              <TextField
                fullWidth
                select
                label="Legislation Type"
                name="legislation_type"
                value={legislationData.legislation_type}
                onChange={handleChange}
                required
              >
                <MenuItem value="Act">Act</MenuItem>
                <MenuItem value="Ordinance">Ordinance</MenuItem>
                <MenuItem value="Regulation">Regulation</MenuItem>
                <MenuItem value="Bill">Bill</MenuItem>
                <MenuItem value="Legal Notice">Legal Notice</MenuItem>
                <MenuItem value="Bylaw">Bylaw</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={legislationData.year}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Add Legislation
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}
