// Rental Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    
    console.log('Rental page initialized');
});

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Contact for service function
function contactForService(serviceName) {
    const message = `Xin chào! Tôi muốn thuê ${serviceName}. Vui lòng tư vấn cho tôi về các gói dịch vụ.`;
    
    // Show toast notification
    showToast(`Liên hệ qua Discord để thuê ${serviceName}...`);
    
    // Open Discord server
    const discordUrl = `https://discord.gg/WT9bUkVCTx`;
    
    // Open Discord after a short delay
    setTimeout(() => {
        window.open(discordUrl, '_blank');
    }, 1000);
}



// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Price option hover effects
document.querySelectorAll('.price-option').forEach(option => {
    option.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    option.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

