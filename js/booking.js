// Booking Form JavaScript

let currentStep = 1;
const totalSteps = 4;
let bookingData = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingForm();
    loadServiceFromURL();
    setupFormValidation();
});

function initializeBookingForm() {
    updateStepDisplay();
    setupStepNavigation();
    bindFormEvents();
}

function loadServiceFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    
    if (service) {
        const serviceData = getServiceData(service);
        if (serviceData) {
            populateServiceDetails(serviceData);
        }
    }
}

function getServiceData(serviceKey) {
    const services = {
        'general-consultation': {
            name: 'General Consultation',
            description: 'Comprehensive health checkup with certified doctors',
            price: 75,
            duration: '45 minutes',
            icon: '🏥',
            category: 'healthcare'
        },
        'dental-checkup': {
            name: 'Dental Checkup',
            description: 'Complete dental examination and cleaning',
            price: 120,
            duration: '60 minutes',
            icon: '🦷',
            category: 'healthcare'
        },
        'spa-treatment': {
            name: 'Spa Treatment',
            description: 'Relaxing full-body spa and massage therapy',
            price: 85,
            duration: '90 minutes',
            icon: '💆‍♀️',
            category: 'beauty'
        },
        'beauty-consultation': {
            name: 'Beauty Consultation',
            description: 'Professional makeup and skincare consultation',
            price: 65,
            duration: '60 minutes',
            icon: '💄',
            category: 'beauty'
        },
        'personal-training': {
            name: 'Personal Training',
            description: 'One-on-one fitness training session',
            price: 60,
            duration: '60 minutes',
            icon: '🏋️‍♂️',
            category: 'fitness'
        },
        'yoga-session': {
            name: 'Yoga Session',
            description: 'Guided yoga and meditation session',
            price: 40,
            duration: '75 minutes',
            icon: '🧘‍♀️',
            category: 'fitness'
        },
        'business-consultation': {
            name: 'Business Consultation',
            description: 'Strategic business planning and advice',
            price: 150,
            duration: '90 minutes',
            icon: '💼',
            category: 'consulting'
        },
        'legal-consultation': {
            name: 'Legal Consultation',
            description: 'Professional legal advice and guidance',
            price: 100,
            duration: '60 minutes',
            icon: '⚖️',
            category: 'consulting'
        },
        'tutoring-session': {
            name: 'Tutoring Session',
            description: 'One-on-one academic tutoring',
            price: 45,
            duration: '60 minutes',
            icon: '📚',
            category: 'education'
        },
        'car-maintenance': {
            name: 'Car Maintenance',
            description: 'Complete vehicle inspection and maintenance',
            price: 80,
            duration: '120 minutes',
            icon: '🚗',
            category: 'automotive'
        }
    };
    
    return services[serviceKey] || services['general-consultation'];
}

function populateServiceDetails(serviceData) {
    document.getElementById('serviceName').textContent = serviceData.name;
    document.getElementById('serviceDescription').textContent = serviceData.description;
    document.getElementById('servicePrice').textContent = `$${serviceData.price}`;
    document.getElementById('serviceDuration').textContent = serviceData.duration;
    document.getElementById('serviceIcon').textContent = serviceData.icon;
    
    // Store in booking data
    bookingData.service = serviceData;
}

function setupStepNavigation() {
    // Update step indicators when moving between steps
    updateStepIndicators();
}

function bindFormEvents() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Bind form field events for real-time validation
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            saveCurrentStepData();
            currentStep++;
            updateStepDisplay();
            updateStepIndicators();
            
            if (currentStep === 4) {
                populateConfirmationSummary();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateStepIndicators();
    }
}

function updateStepDisplay() {
    // Hide all step contents
    document.querySelectorAll('.booking-step-content').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicators() {
    document.querySelectorAll('.booking-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

function validateStep1() {
    // Step 1 is always valid (service details are pre-populated)
    return true;
}

function validateStep2() {
    if (!window.bookingCalendar || !window.bookingCalendar.selectedDate || !window.bookingCalendar.selectedTime) {
        showNotification('Please select both a date and time for your appointment.', 'error');
        return false;
    }
    return true;
}

function validateStep3() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const termsCheckbox = document.getElementById('terms');
    
    let isValid = true;
    
    // Validate required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError({ target: field });
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone format
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!termsCheckbox || !termsCheckbox.checked) {
        showNotification('Please accept the Terms of Service to continue.', 'error');
        isValid = false;
    }
    
    return isValid;
}

function saveCurrentStepData() {
    switch (currentStep) {
        case 1:
            bookingData.provider = document.getElementById('providerSelect').value;
            bookingData.specialRequests = document.getElementById('specialRequests').value;
            break;
        case 2:
            if (window.bookingCalendar) {
                const selectedDateTime = window.bookingCalendar.getSelectedDateTime();
                if (selectedDateTime) {
                    bookingData.appointment = selectedDateTime;
                }
            }
            break;
        case 3:
            bookingData.customer = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zipCode').value,
                newsletter: document.getElementById('newsletter').checked
            };
            break;
    }
}

function populateConfirmationSummary() {
    if (bookingData.service) {
        document.getElementById('summaryService').textContent = bookingData.service.name;
        document.getElementById('summaryDuration').textContent = bookingData.service.duration;
        document.getElementById('summaryTotal').textContent = `$${bookingData.service.price}`;
    }
    
    if (bookingData.provider) {
        const providerSelect = document.getElementById('providerSelect');
        const selectedOption = providerSelect.querySelector(`option[value="${bookingData.provider}"]`);
        document.getElementById('summaryProvider').textContent = 
            selectedOption ? selectedOption.textContent : 'Any available';
    }
    
    if (bookingData.appointment) {
        document.getElementById('summaryDate').textContent = bookingData.appointment.formatted.date;
        document.getElementById('summaryTime').textContent = bookingData.appointment.formatted.time;
    }
    
    if (bookingData.customer) {
        document.getElementById('summaryName').textContent = 
            `${bookingData.customer.firstName} ${bookingData.customer.lastName}`;
        document.getElementById('summaryEmail').textContent = bookingData.customer.email;
        document.getElementById('summaryPhone').textContent = bookingData.customer.phone;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (currentStep !== totalSteps) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate booking ID
        const bookingId = 'BK' + Date.now().toString().slice(-6);
        
        // Store booking data in localStorage (in real app, this would be sent to server)
        localStorage.setItem('lastBooking', JSON.stringify({
            ...bookingData,
            bookingId,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        }));
        
        // Redirect to confirmation page
        window.location.href = `confirmation.html?booking=${bookingId}`;
    }, 2000);
}

function setupFormValidation() {
    // Real-time validation for form fields
    const formFields = document.querySelectorAll('.form-input');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField({ target: this });
        });
        
        field.addEventListener('input', function() {
            clearFieldError({ target: this });
        });
    });
}

// Utility functions
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    clearFieldError(e);
    
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (value) {
        switch (type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
        }
    }
    
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.form-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Global function exports
window.nextStep = nextStep;
window.prevStep = prevStep;