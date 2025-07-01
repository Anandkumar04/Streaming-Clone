// Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeServiceFilters();
    initializeServiceSearch();
});

function initializeServiceFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    
    [categoryFilter, priceFilter, ratingFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterServices);
        }
    });
}

function initializeServiceSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterServices, 300);
        });
    }
}

function filterServices() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const priceFilter = document.getElementById('priceFilter')?.value || '';
    const ratingFilter = document.getElementById('ratingFilter')?.value || '';
    
    const serviceCards = document.querySelectorAll('.service-card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;
    
    serviceCards.forEach(card => {
        const title = card.querySelector('.service-card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.service-card-description')?.textContent.toLowerCase() || '';
        const category = card.dataset.category || '';
        const price = parseFloat(card.dataset.price) || 0;
        const rating = parseFloat(card.dataset.rating) || 0;
        
        let showCard = true;
        
        // Search filter
        if (searchTerm && !title.includes(searchTerm) && !description.includes(searchTerm)) {
            showCard = false;
        }
        
        // Category filter
        if (categoryFilter && category !== categoryFilter) {
            showCard = false;
        }
        
        // Price filter
        if (priceFilter) {
            const [minPrice, maxPrice] = parsePriceRange(priceFilter);
            if (price < minPrice || (maxPrice && price > maxPrice)) {
                showCard = false;
            }
        }
        
        // Rating filter
        if (ratingFilter) {
            const minRating = parseFloat(ratingFilter.replace('+', ''));
            if (rating < minRating) {
                showCard = false;
            }
        }
        
        // Show/hide card
        if (showCard) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (noResults) {
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}

function parsePriceRange(priceRange) {
    switch (priceRange) {
        case '0-50':
            return [0, 50];
        case '50-100':
            return [50, 100];
        case '100-200':
            return [100, 200];
        case '200+':
            return [200, Infinity];
        default:
            return [0, Infinity];
    }
}

// Service card interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('service-card') || e.target.closest('.service-card')) {
        const card = e.target.classList.contains('service-card') ? e.target : e.target.closest('.service-card');
        
        // Add a subtle animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
});

// Add loading state to booking buttons
document.querySelectorAll('.service-card .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Don't prevent default since we want the navigation to work
        this.classList.add('loading');
        this.textContent = 'Loading...';
        
        // Reset after a short delay (in case navigation doesn't happen)
        setTimeout(() => {
            this.classList.remove('loading');
            this.textContent = 'Book Now';
        }, 3000);
    });
});

// Keyboard navigation for service cards
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('service-card')) {
            const bookButton = focusedElement.querySelector('.btn');
            if (bookButton) {
                bookButton.click();
            }
        }
    }
});

// Make service cards focusable for accessibility
document.querySelectorAll('.service-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Book ${card.querySelector('.service-card-title')?.textContent || 'service'}`);
});

// URL parameter handling (for direct links to specific categories)
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
    }
    
    if (search) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = search;
        }
    }
    
    if (category || search) {
        filterServices();
    }
}

// Initialize URL parameters on page load
handleURLParameters();

// Export functions for use in other scripts
window.serviceFilters = {
    filter: filterServices,
    search: initializeServiceSearch
};