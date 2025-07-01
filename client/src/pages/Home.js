import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Paper
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Hero = () => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      color: 'white',
      py: 8,
      borderRadius: 2,
      mb: 6
    }}
  >
    <Container maxWidth="md">
      <Box textAlign="center">
        <Typography variant="h1" component="h1" gutterBottom>
          Book Your Perfect Appointment
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
          Connect with professional service providers and book appointments seamlessly
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/services"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Browse Services
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Join as Provider
          </Button>
        </Box>
      </Box>
    </Container>
  </Box>
);

const FeaturedServices = () => {
  const services = [
    {
      title: 'Healthcare Consultation',
      description: 'Book appointments with certified healthcare professionals',
      price: 'From $50',
      category: 'Healthcare'
    },
    {
      title: 'Beauty & Wellness',
      description: 'Professional beauty treatments and wellness services',
      price: 'From $30',
      category: 'Beauty'
    },
    {
      title: 'Business Consulting',
      description: 'Expert advice for your business growth and strategy',
      price: 'From $100',
      category: 'Consulting'
    },
    {
      title: 'Fitness Training',
      description: 'Personal training sessions with certified trainers',
      price: 'From $40',
      category: 'Fitness'
    }
  ];

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
        Featured Services
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Discover popular services in your area
      </Typography>
      
      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Chip label={service.category} size="small" sx={{ mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {service.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {service.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/services">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: 'Browse Services',
      description: 'Explore our wide range of professional services'
    },
    {
      icon: <CheckIcon sx={{ fontSize: 40 }} />,
      title: 'Book Appointment',
      description: 'Select your preferred time and confirm your booking'
    },
    {
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      title: 'Get Service',
      description: 'Meet with your service provider and enjoy the experience'
    }
  ];

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
        How It Works
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Simple steps to book your perfect appointment
      </Typography>
      
      <Grid container spacing={4}>
        {steps.map((step, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'grey.200',
                height: '100%'
              }}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {step.icon}
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                {step.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Safe',
      description: 'All providers are verified and your data is protected'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Quick Booking',
      description: 'Book appointments in just a few clicks'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it'
    }
  ];

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
        Why Choose BookMe?
      </Typography>
      
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ color: 'secondary.main', mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <WhyChooseUs />
    </Container>
  );
};

export default Home;