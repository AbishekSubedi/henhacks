import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const businessCategories = [
  'Retail',
  'Food & Beverage',
  'Technology',
  'Professional Services',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Construction',
  'Entertainment',
  'Other',
];

const BusinessDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      category: '',
      description: '',
      location: '',
      contactNumber: '',
      additionalInfo: '',
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Category is required'),
      description: Yup.string().required('Description is required'),
      location: Yup.string().required('Location is required'),
      contactNumber: Yup.string().required('Contact number is required'),
      additionalInfo: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:5000/api/business/update-details',
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating business details:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const steps = ['Basic Information', 'Contact Details', 'Additional Information'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              select
              fullWidth
              margin="normal"
              name="category"
              label="Business Category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            >
              {businessCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Business Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              name="location"
              label="Business Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <TextField
              fullWidth
              margin="normal"
              name="contactNumber"
              label="Contact Number"
              value={formik.values.contactNumber}
              onChange={formik.handleChange}
              error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
              helperText={formik.touched.contactNumber && formik.errors.contactNumber}
            />
          </>
        );
      case 2:
        return (
          <TextField
            fullWidth
            margin="normal"
            name="additionalInfo"
            label="Additional Information"
            multiline
            rows={6}
            placeholder="Please provide any additional information about your business that would help us better understand your needs..."
            value={formik.values.additionalInfo}
            onChange={formik.handleChange}
            error={formik.touched.additionalInfo && Boolean(formik.errors.additionalInfo)}
            helperText={formik.touched.additionalInfo && formik.errors.additionalInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Business Details
          </Typography>
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1, width: '100%' }}
          >
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BusinessDetails; 