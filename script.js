// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const optionsGrid = document.getElementById('optionsGrid');
    const optionCards = document.querySelectorAll('.option-card');

    // Search functionality
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        optionCards.forEach(card => {
            const cardName = card.getAttribute('data-name').toLowerCase();
            
            if (cardName.includes(searchTerm)) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Show/hide "no results" message
        const visibleCards = Array.from(optionCards).filter(card => !card.classList.contains('hidden'));
        
        let noResultsMsg = document.querySelector('.no-results');
        if (visibleCards.length === 0 && searchTerm !== '') {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.textContent = 'Không tìm thấy tùy chọn cấu hình phù hợp';
                noResultsMsg.style.cssText = `
                    text-align: center;
                    color: #6c757d;
                    font-style: italic;
                    padding: 40px 20px;
                    grid-column: 1 / -1;
                `;
                optionsGrid.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }

    // Add search event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keyup', handleSearch);

    // Clear search functionality
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            handleSearch();
        }
    });

    // Option card click functionality
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardName = this.getAttribute('data-name');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Simulate configuration selection
            console.log(`Selected configuration: ${cardName}`);
            
            // You can add actual functionality here, such as:
            // - Opening a modal with configuration details
            // - Redirecting to a configuration page
            // - Copying configuration to clipboard
            // - etc.
            
            // For now, we'll show a simple alert
            showToast(`Đã chọn cấu hình: ${cardName}`);
        });

        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });

    // Configuration button functionality
    const configButtons = document.querySelectorAll('.config-btn');
    configButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            configButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const buttonText = this.textContent;
            console.log(`Selected config type: ${buttonText}`);
            
            showToast(`Đã chọn loại cấu hình: ${buttonText}`);
        });
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const navText = this.textContent;
            console.log(`Navigation to: ${navText}`);
        });
    });

    // Toast notification function
    function showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            font-size: 0.9rem;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Add animation keyframes
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Auto-remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // Add smooth scrolling for better UX
    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Initialize any additional functionality
    console.log('Giao diện ShadowRocket đã được khởi tạo');
    
    // Performance optimization: lazy loading for large grids
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe option cards for fade-in effect
    optionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Additional utility functions
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
});

// Handle offline/online status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
});
