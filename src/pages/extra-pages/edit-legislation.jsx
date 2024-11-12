import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

// ================================|| UPDATE LEGISLATION FORM ||================================ //

export default function UpdateLegislation() {
  const [legislationData, setLegislationData] = useState({
    name: '',
    legislation_type: '',
    year: ''
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Get the legislation ID from the URL

  // Fetch the legislation data when the component mounts
  useEffect(() => {
    const fetchLegislationData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/legislations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setLegislationData(data);
        } else {
          console.error('Error fetching legislation data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching legislation data:', error);
      }
    };

    fetchLegislationData();
  }, [id]);

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
      const response = await fetch(`http://localhost:5000/api/legislations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(legislationData)
      });

      if (response.ok) {
        // Handle successful update (e.g., navigate to legislations list or show success message)
        navigate('/legislations'); // Update to the correct path for your legislations page
      } else {
        // Handle errors (e.g., show error message)
        console.error('Error updating legislation:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating legislation:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Update Legislation</Typography>
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
                value={legislationData.year}
                onChange={handleChange}
                required
                type="number"
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Update Legislation
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}
