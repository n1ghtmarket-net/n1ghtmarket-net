// Modern ShadowRocket Modules Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSearch();
    initializeModules();
    initializeAnimations();
    initializeToast();

    console.log('ShadowRocket Modules website initialized');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Handle scroll-based navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const modulesGrid = document.getElementById('modulesGrid');
    const noResults = document.getElementById('noResults');
    const moduleCards = document.querySelectorAll('.module-card');
    const featuredModule = document.querySelector('.featured-module');

    if (!searchInput) return;

    // Search input handler
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        handleSearch(searchTerm);
        
        // Show/hide clear button
        if (searchTerm.length > 0) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }
    });

    // Clear search
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        handleSearch('');
        searchInput.focus();
    });

    // Handle search functionality
    function handleSearch(searchTerm) {
        let visibleCount = 0;

        // Search in featured module
        if (featuredModule) {
            const featuredName = featuredModule.getAttribute('data-name').toLowerCase();
            if (searchTerm === '' || featuredName.includes(searchTerm)) {
                featuredModule.style.display = 'flex';
                visibleCount++;
            } else {
                featuredModule.style.display = 'none';
            }
        }

        // Search in module cards
        moduleCards.forEach(card => {
            const cardName = card.getAttribute('data-name').toLowerCase();
            const cardDesc = card.querySelector('.module-desc').textContent.toLowerCase();
            
            if (searchTerm === '' || cardName.includes(searchTerm) || cardDesc.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm !== '') {
            noResults.style.display = 'block';
            modulesGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            modulesGrid.style.display = 'grid';
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Focus search on Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Clear search on Escape
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchClear.style.display = 'none';
            handleSearch('');
        }
    });
}

// Module interactions
function initializeModules() {
    const featuredModule = document.querySelector('.featured-module');
    const moduleCards = document.querySelectorAll('.module-card');
    const allModules = [...(featuredModule ? [featuredModule] : []), ...moduleCards];

    allModules.forEach(module => {
        module.addEventListener('click', function() {
            const moduleName = this.getAttribute('data-name');
            const moduleUrl = this.getAttribute('data-url');
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Copy URL to clipboard if available
            if (moduleUrl) {
                copyToClipboard(moduleUrl, moduleName);
            } else {
                showToast('Module coming soon!', 'warning');
            }
        });

        // Add keyboard support
        module.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Make modules focusable
        module.setAttribute('tabindex', '0');
    });

    // Handle featured module button click
    const featuredBtn = document.querySelector('.featured-action .btn-copy');
    if (featuredBtn) {
        featuredBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering parent click
            const featuredModule = this.closest('.featured-module');
            if (featuredModule) {
                featuredModule.click();
            }
        });
    }
}

// Copy to clipboard functionality
function copyToClipboard(text, moduleName) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern approach
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${moduleName} link!`, 'success');
        }).catch(err => {
            console.error('Failed to copy with modern API:', err);
            fallbackCopyToClipboard(text, moduleName);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyToClipboard(text, moduleName);
    }
}

// Fallback copy method
function fallbackCopyToClipboard(text, moduleName) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast(`Copied ${moduleName} link!`, 'success');
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Toast notification system
let toastTimeout;

function initializeToast() {
    // Toast is already in HTML, just need to initialize the system
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Clear existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Update message and icon
    toastMessage.textContent = message;
    
    // Update icon based on type
    toastIcon.className = 'toast-icon';
    switch (type) {
        case 'success':
            toastIcon.classList.add('fas', 'fa-check-circle');
            toastIcon.style.color = 'var(--success)';
            break;
        case 'warning':
            toastIcon.classList.add('fas', 'fa-exclamation-triangle');
            toastIcon.style.color = 'var(--warning)';
            break;
        case 'error':
            toastIcon.classList.add('fas', 'fa-times-circle');
            toastIcon.style.color = 'var(--error)';
            break;
        default:
            toastIcon.classList.add('fas', 'fa-info-circle');
            toastIcon.style.color = 'var(--primary-color)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
    
    // Allow manual dismissal
    toast.addEventListener('click', function() {
        this.classList.remove('show');
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
    });
}

// Animation and scroll effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.module-card, .step-card, .featured-module');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Phone mockup animation
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        // Add subtle floating animation
        phoneMockup.style.animation = 'float 6s ease-in-out infinite';
    }

    // Hero stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        
        if (!isNaN(numericValue) && numericValue > 0) {
            animateCounter(stat, numericValue, finalValue);
        }
    });
}

// Counter animation for stats
function animateCounter(element, target, finalText) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let current = 0;
                const increment = target / 50; // 50 frames
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = finalText;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + (finalText.includes('%') ? '%' : '+');
                    }
                }, 30);
                observer.unobserve(element);
            }
        });
    });
    
    observer.observe(element);
}

// Enhanced module interactions
function addModuleHoverEffects() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.boxShadow = '';
        });
    });
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// Handle online/offline status
window.addEventListener('online', function() {
    showToast('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showToast('Connection lost', 'warning');
});

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.setAttribute('aria-label', 'Search modules');
    }
    
    // Add role attributes
    const moduleCards = document.querySelectorAll('.module-card, .featured-module');
    moduleCards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Copy ${card.getAttribute('data-name')} module link`);
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
    addModuleHoverEffects();
});

// Utility functions
const utils = {
    // Smooth scroll to element
    scrollTo: function(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    // Get viewport dimensions
    getViewport: function() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        const viewport = this.getViewport();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= viewport.height &&
            rect.right <= viewport.width
        );
    }
};

// Export utilities for external use
window.ShadowRocketUtils = utils;
