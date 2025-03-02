import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Lightbulb as LightbulbIcon } from '@mui/icons-material';

interface Business {
  id: string;
  name: string;
  description: string;
}

const BusinessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/business/${id}`);
      setBusiness(response.data);
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    if (!business) return;

    setGeneratingInsights(true);
    try {
      const response = await axios.post(`http://localhost:5001/api/business/${id}/insights`, {
        businessData: {
          name: business.name,
          description: business.description,
          // Add any additional business data here
        },
      });
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!business) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" color="error">
          Business not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/businesses')}
          sx={{ mt: 2 }}
        >
          Back to Businesses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/businesses')} sx={{ mb: 3 }}>
        Back to Businesses
      </Button>

      <Grid container spacing={3}>
        {/* Business Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {business.name}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {business.description}
            </Typography>
          </Paper>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LightbulbIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">AI Business Insights</Typography>
              </Box>

              {!insights && (
                <Button
                  variant="contained"
                  onClick={generateInsights}
                  disabled={generatingInsights}
                  sx={{ mb: 2 }}
                >
                  {generatingInsights ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Generating Insights...
                    </>
                  ) : (
                    'Generate Insights'
                  )}
                </Button>
              )}

              {insights && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      mt: 2,
                    }}
                  >
                    {insights}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={generateInsights}
                    disabled={generatingInsights}
                    sx={{ mt: 2 }}
                  >
                    Regenerate Insights
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BusinessDetails;
