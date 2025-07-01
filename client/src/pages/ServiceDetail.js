import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/services/${id}`);
        setService(response.data.service);
      } catch (err) {
        setError('Service not found');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={service.category} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {service.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={service.rating.average} readOnly precision={0.5} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {service.rating.average.toFixed(1)} ({service.rating.count} reviews)
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {service.duration} minutes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5" color="primary">
                    ${service.price}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Provider
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  {service.provider.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {service.provider.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Professional Provider
                  </Typography>
                </Box>
              </Box>
              
              {service.provider.profile?.bio && (
                <Typography variant="body2" paragraph>
                  {service.provider.profile.bio}
                </Typography>
              )}
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                component={Link}
                to={`/book/${service._id}`}
                sx={{ mt: 2 }}
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceDetail;