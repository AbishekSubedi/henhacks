import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Business {
  id: string;
  name: string;
  description: string;
}

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchBusinesses();
  }, [user]);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/business/user/${user?.uid}`
      );
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (business?: Business) => {
    if (business) {
      setEditingBusiness(business);
      setBusinessName(business.name);
      setBusinessDescription(business.description);
    } else {
      setEditingBusiness(null);
      setBusinessName('');
      setBusinessDescription('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBusiness(null);
    setBusinessName('');
    setBusinessDescription('');
  };

  const handleSubmit = async () => {
    try {
      if (editingBusiness) {
        // Update existing business
        await axios.put(`http://localhost:5001/api/business/${editingBusiness.id}`, {
          name: businessName,
          description: businessDescription,
        });
      } else {
        // Create new business
        await axios.post('http://localhost:5001/api/business', {
          name: businessName,
          description: businessDescription,
          userId: user?.uid,
        });
      }
      
      handleCloseDialog();
      fetchBusinesses();
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleDelete = async (businessId: string) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await axios.delete(`http://localhost:5001/api/business/${businessId}`);
        fetchBusinesses();
      } catch (error) {
        console.error('Error deleting business:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Manage Businesses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Business
        </Button>
      </Paper>

      <Grid container spacing={3}>
        {businesses.map((business) => (
          <Grid item xs={12} md={4} key={business.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {business.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {business.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  onClick={() => navigate(`/businesses/${business.id}`)}
                >
                  View Details
                </Button>
                <div>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(business)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(business.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBusiness ? 'Edit Business' : 'Add New Business'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!businessName || !businessDescription}
          >
            {editingBusiness ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BusinessList; 