import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface BusinessDetails {
  category: string;
  description: string;
  location: string;
  contactNumber: string;
  additionalInfo: string;
  analyzedInfo: {
    strengths: string[];
    targetAudience: string[];
    growthAreas: string[];
    marketingSuggestions: string[];
    digitalPresence: string[];
  };
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/business/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinessDetails(response.data.businessDetails);
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">
                Welcome, {user?.businessName}
              </Typography>
              <Button variant="outlined" color="primary" onClick={logout}>
                Logout
              </Button>
            </Paper>
          </Grid>

          {businessDetails && (
            <>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Business Information
                    </Typography>
                    <Typography variant="body1">
                      <strong>Category:</strong> {businessDetails.category}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {businessDetails.location}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Contact:</strong> {businessDetails.contactNumber}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {businessDetails.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      AI Analysis Insights
                    </Typography>
                    {businessDetails.analyzedInfo && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Strengths:
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {businessDetails.analyzedInfo.strengths.join(', ')}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                          Target Audience:
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {businessDetails.analyzedInfo.targetAudience.join(', ')}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                          Growth Opportunities:
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {businessDetails.analyzedInfo.growthAreas.join(', ')}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                          Marketing Suggestions:
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {businessDetails.analyzedInfo.marketingSuggestions.join(', ')}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 