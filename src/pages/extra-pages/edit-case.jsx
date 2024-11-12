import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

// ================================|| UPDATE CASE FORM ||================================ //


export default function UpdateCase() {
  const [caseData, setCaseData] = useState({
    caseNumber: '',
    partiesInvolved: '',
    causeOfAction: '',
    brief: '',
    actionTaken: '',
    suitAmount: '',
    chancesOfSuccess: '',
    status: '',
    presidingJudge: '',
    opposingCounselDetails: ''
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Get the case ID from the URL

  // Fetch the case data when the component mounts
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/litigations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCaseData(data);
        } else {
          console.error('Error fetching case data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching case data:', error);
      }
    };

    fetchCaseData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setCaseData({
      ...caseData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/litigations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(caseData)
      });

      if (response.ok) {
        // Handle successful update (e.g., navigate to cases list or show success message)
        navigate('/cases'); // Update to the correct path for your litigations page
      } else {
        // Handle errors (e.g., show error message)
        console.error('Error updating case:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Update Case</Typography>
          <Typography component={Link} to="/cases" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Back to Cases
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
                label="Case Number"
                name="caseNumber"
                value={caseData.caseNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parties Involved"
                name="partiesInvolved"
                value={caseData.partiesInvolved}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cause of Action"
                name="causeOfAction"
                value={caseData.causeOfAction}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brief"
                name="brief"
                value={caseData.brief}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Action Taken"
                name="actionTaken"
                value={caseData.actionTaken}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Suit Amount"
                name="suitAmount"
                value={caseData.suitAmount}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Chances of Success Dropdown */}
              <TextField
                fullWidth
                select
                label="Chances of Success"
                name="chancesOfSuccess"
                value={caseData.chancesOfSuccess}
                onChange={handleChange}
                required
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Status Dropdown */}
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={caseData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Presiding Judge"
                name="presidingJudge"
                value={caseData.presidingJudge}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Opposing Counsel Details"
                name="opposingCounselDetails"
                value={caseData.opposingCounselDetails}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Update Case
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}
