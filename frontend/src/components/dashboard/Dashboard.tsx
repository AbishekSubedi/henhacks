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
  Box,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';

interface Business {
  id: string;
  name: string;
  description: string;
}

const Dashboard = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
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

    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  const handleCreateBusiness = () => {
    navigate('/businesses');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              Welcome back!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateBusiness}
            >
              Add Business
            </Button>
          </Paper>
        </Grid>

        {/* Business Summary */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Your Businesses
          </Typography>
          <Grid container spacing={3}>
            {businesses.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No businesses yet
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Start by adding your first business to get AI-powered insights
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateBusiness}
                  >
                    Add Business
                  </Button>
                </Paper>
              </Grid>
            ) : (
              businesses.map((business) => (
                <Grid item xs={12} md={4} key={business.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {business.name}
                      </Typography>
                      <Typography color="text.secondary" noWrap>
                        {business.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => navigate(`/businesses/${business.id}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 