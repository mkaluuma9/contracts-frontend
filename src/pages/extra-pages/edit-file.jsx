import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// ================================|| EDIT FILE FORM ||================================ //

export default function EditFile() {
  const [fileData, setFileData] = useState({
    file_name: '',
    number_of_files: '',
    details: '',
    location: ''
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Get the file ID from the URL

  // Fetch the file data when the component mounts
  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/files/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFileData(data);
        } else {
          console.error('Error fetching file data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching file data:', error);
      }
    };

    fetchFileData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFileData({
      ...fileData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/files/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileData)
      });

      if (response.ok) {
        navigate('/files');
      } else {
        console.error('Error updating file:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3">Edit File</Typography>
      </Grid>

      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="File Name"
                name="file_name"
                value={fileData.file_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Files"
                name="number_of_files"
                type="number"
                value={fileData.number_of_files}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                name="details"
                value={fileData.details}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={fileData.location}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Update File
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}
