// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupViewSwitcher();
    setupProfileMenu();
    setupNotifications();
    loadDashboardData();
});

function initializeDashboard() {
    // Check if user is logged in (in real app, this would check authentication)
    const isLoggedIn = localStorage.getItem('userLoggedIn') || true;
    
    if (!isLoggedIn) {
        window.location.href = 'loginpage.html';
        return;
    }
    
    // Load user preferences
    loadUserPreferences();
}

function setupViewSwitcher() {
    const customerViewBtn = document.getElementById('customerView');
    const providerViewBtn = document.getElementById('providerView');
    const customerDashboard = document.getElementById('customerDashboard');
    const providerDashboard = document.getElementById('providerDashboard');
    
    if (customerViewBtn && providerViewBtn) {
        customerViewBtn.addEventListener('click', () => {
            switchView('customer');
        });
        
        providerViewBtn.addEventListener('click', () => {
            switchView('provider');
        });
    }
    
    // Load saved view preference
    const savedView = localStorage.getItem('dashboardView') || 'customer';
    switchView(savedView);
}

function switchView(viewType) {
    const customerViewBtn = document.getElementById('customerView');
    const providerViewBtn = document.getElementById('providerView');
    const customerDashboard = document.getElementById('customerDashboard');
    const providerDashboard = document.getElementById('providerDashboard');
    
    // Update button states
    customerViewBtn.classList.remove('btn-primary');
    customerViewBtn.classList.add('btn-outline');
    providerViewBtn.classList.remove('btn-primary');
    providerViewBtn.classList.add('btn-outline');
    
    // Hide all dashboards
    customerDashboard.classList.add('hidden');
    providerDashboard.classList.add('hidden');
    
    if (viewType === 'customer') {
        customerViewBtn.classList.remove('btn-outline');
        customerViewBtn.classList.add('btn-primary');
        customerDashboard.classList.remove('hidden');
    } else {
        providerViewBtn.classList.remove('btn-outline');
        providerViewBtn.classList.add('btn-primary');
        providerDashboard.classList.remove('hidden');
    }
    
    // Save preference
    localStorage.setItem('dashboardView', viewType);
    
    // Load appropriate data
    loadDashboardData(viewType);
}

function setupProfileMenu() {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', () => {
            profileMenu.classList.add('hidden');
        });
        
        // Prevent menu from closing when clicking inside it
        profileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotificationPanel();
        });
    }
    
    // Simulate real-time notifications
    setInterval(() => {
        updateNotificationBadge();
    }, 30000); // Check every 30 seconds
}

function showNotificationPanel() {
    const notifications = [
        {
            id: 1,
            title: 'Appointment Reminder',
            message: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM',
            type: 'reminder',
            time: '1 hour ago',
            read: false
        },
        {
            id: 2,
            title: 'Booking Confirmed',
            message: 'Your spa treatment is confirmed for Dec 18',
            type: 'confirmation',
            time: '2 hours ago',
            read: false
        },
        {
            id: 3,
            title: 'Review Request',
            message: 'Please review your recent dental checkup',
            type: 'review',
            time: '1 day ago',
            read: true
        }
    ];
    
    // Create notification modal (simplified version)
    showNotification('Notifications panel would open here with full notification list', 'info');
}

function updateNotificationBadge() {
    const badge = document.querySelector('#notificationBtn .badge');
    if (badge) {
        // Simulate getting notification count from API
        const unreadCount = Math.floor(Math.random() * 5);
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function loadDashboardData(viewType = 'customer') {
    if (viewType === 'customer') {
        loadCustomerData();
    } else {
        loadProviderData();
    }
}

function loadCustomerData() {
    // Simulate loading customer data
    const customerData = {
        upcomingAppointments: 5,
        totalBookings: 12,
        totalSpent: 420,
        averageRating: 4.8,
        appointments: [
            {
                id: 1,
                service: 'General Consultation',
                provider: 'Dr. Sarah Smith',
                date: 'Dec 15, 2024',
                time: '2:00 PM',
                duration: '45 min',
                status: 'confirmed',
                icon: '🏥'
            },
            {
                id: 2,
                service: 'Spa Treatment',
                provider: 'Beauty Spa Center',
                date: 'Dec 18, 2024',
                time: '11:00 AM',
                duration: '90 min',
                status: 'confirmed',
                icon: '💆‍♀️'
            }
        ]
    };
    
    updateCustomerStats(customerData);
    updateAppointmentList(customerData.appointments);
}

function loadProviderData() {
    // Simulate loading provider data
    const providerData = {
        todayAppointments: 28,
        monthlyAppointments: 156,
        monthlyRevenue: 2340,
        averageRating: 4.9,
        todaySchedule: [
            {
                id: 1,
                time: '9:00 AM',
                service: 'General Consultation',
                customer: 'John Smith',
                phone: '(555) 123-4567',
                status: 'confirmed'
            },
            {
                id: 2,
                time: '10:30 AM',
                service: 'Follow-up Consultation',
                customer: 'Sarah Johnson',
                phone: '(555) 987-6543',
                status: 'in-progress'
            }
        ]
    };
    
    updateProviderStats(providerData);
    updateScheduleList(providerData.todaySchedule);
}

function updateCustomerStats(data) {
    const statsWidgets = document.querySelectorAll('#customerDashboard .stats-widget');
    if (statsWidgets.length >= 4) {
        statsWidgets[0].querySelector('.stats-number').textContent = data.upcomingAppointments;
        statsWidgets[1].querySelector('.stats-number').textContent = data.totalBookings;
        statsWidgets[2].querySelector('.stats-number').textContent = `$${data.totalSpent}`;
        statsWidgets[3].querySelector('.stats-number').textContent = data.averageRating;
    }
}

function updateProviderStats(data) {
    const statsWidgets = document.querySelectorAll('#providerDashboard .stats-widget');
    if (statsWidgets.length >= 4) {
        statsWidgets[0].querySelector('.stats-number').textContent = data.todayAppointments;
        statsWidgets[1].querySelector('.stats-number').textContent = data.monthlyAppointments;
        statsWidgets[2].querySelector('.stats-number').textContent = `$${data.monthlyRevenue.toLocaleString()}`;
        statsWidgets[3].querySelector('.stats-number').textContent = data.averageRating;
    }
}

function updateAppointmentList(appointments) {
    // This would update the appointment list in the customer dashboard
    // Implementation would depend on the specific DOM structure
    console.log('Updating appointment list:', appointments);
}

function updateScheduleList(schedule) {
    // This would update the schedule list in the provider dashboard
    console.log('Updating schedule list:', schedule);
}

function loadUserPreferences() {
    // Load user preferences from localStorage or API
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        theme: 'light',
        notifications: true,
        emailReminders: true,
        smsReminders: false
    };
    
    applyUserPreferences(preferences);
}

function applyUserPreferences(preferences) {
    // Apply theme
    if (preferences.theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Apply notification settings
    if (!preferences.notifications) {
        document.getElementById('notificationBtn')?.classList.add('hidden');
    }
}

// Appointment management functions
function rescheduleAppointment(appointmentId) {
    showNotification('Reschedule functionality would open here', 'info');
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        // Simulate API call
        setTimeout(() => {
            showNotification('Appointment cancelled successfully', 'success');
            loadDashboardData(); // Refresh data
        }, 1000);
    }
}

function contactCustomer(customerId) {
    showNotification('Contact options would open here', 'info');
}

// Provider schedule management
function setAvailability() {
    showNotification('Availability settings would open here', 'info');
}

function addTimeSlot() {
    showNotification('Add time slot form would open here', 'info');
}

function viewCalendar() {
    showNotification('Full calendar view would open here', 'info');
}

// Quick actions
function bookNewAppointment() {
    window.location.href = 'services.html';
}

function viewAllBookings() {
    showNotification('All bookings view would open here', 'info');
}

function updateProfile() {
    showNotification('Profile settings would open here', 'info');
}

function managePaymentMethods() {
    showNotification('Payment methods would open here', 'info');
}

// Real-time updates simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time updates
        updateNotificationBadge();
        
        // Update appointment statuses
        updateAppointmentStatuses();
    }, 60000); // Update every minute
}

function updateAppointmentStatuses() {
    // Simulate status updates for provider dashboard
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach((item, index) => {
        const badge = item.querySelector('.badge');
        if (badge && Math.random() < 0.1) { // 10% chance of status change
            const statuses = ['confirmed', 'in-progress', 'completed', 'cancelled'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Update badge class and text
            badge.className = `badge badge-${getStatusColor(randomStatus)}`;
            badge.textContent = capitalizeFirst(randomStatus);
        }
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'confirmed': return 'primary';
        case 'in-progress': return 'secondary';
        case 'completed': return 'accent';
        case 'cancelled': return 'outline';
        default: return 'primary';
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize real-time updates
startRealTimeUpdates();

// Export functions for global access
window.dashboardFunctions = {
    rescheduleAppointment,
    cancelAppointment,
    contactCustomer,
    setAvailability,
    addTimeSlot,
    viewCalendar,
    bookNewAppointment,
    viewAllBookings,
    updateProfile,
    managePaymentMethods,
    switchView
};