// Menu functionality
function toggleMenu() {
    const menu = document.getElementById('flyout-menu');
    menu.classList.toggle('open');
    menu.classList.remove('hidden');
    
    if (menu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('flyout-menu');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (menu.classList.contains('open') && 
        !menu.contains(event.target) && 
        !hamburger.contains(event.target)) {
        toggleMenu();
    }
});

// Lightbox functionality
function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="" alt="" class="lightbox-image">
            <div class="lightbox-nav">
                <button class="lightbox-prev" aria-label="Previous image">←</button>
                <button class="lightbox-next" aria-label="Next image">→</button>
            </div>
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Event listeners for lightbox
    document.querySelectorAll('.carousel-images img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === document.getElementById('lightbox')) {
            closeLightbox();
        }
    });
}

let currentLightboxIndex = 0;
let currentLightboxImages = [];

function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const carousel = imgElement.closest('.carousel-images');
    currentLightboxImages = Array.from(carousel.querySelectorAll('img'));
    currentLightboxIndex = currentLightboxImages.indexOf(imgElement);
    
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const currentImg = currentLightboxImages[currentLightboxIndex];
    
    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt;
    lightboxCaption.textContent = currentImg.alt;
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxImage();
}

// Touch support for carousels
function addTouchSupport() {
    document.querySelectorAll('.carousel-images').forEach(carousel => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(carousel);
        }, {passive: true});
    });
}

function handleSwipe(carousel) {
    const id = carousel.id.split('-')[1];
    const threshold = 50;
    
    if (touchStartX - touchEndX > threshold) {
        // Swipe left - next
        updateCarousel(id, 'next');
    } else if (touchEndX - touchStartX > threshold) {
        // Swipe right - prev
        updateCarousel(id, 'prev');
    }
}

// Enhanced carousel functionality
function initCarousels() {
    document.querySelectorAll('.carousel-images').forEach(container => {
        const id = container.id.split('-')[1];
        const images = container.querySelectorAll('img');
        
        // Reset any existing active classes
        images.forEach(img => img.classList.remove('active'));
        
        // Set first image as active
        if (images.length > 0) {
            images[0].classList.add('active');
        }
        
        // Create indicators container or clear existing
        let indicatorsContainer = container.parentNode.querySelector('.carousel-indicators');
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
        } else {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            container.parentNode.appendChild(indicatorsContainer);
        }
        
        // Create indicator dots
        images.forEach((img, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(id, index));
            indicatorsContainer.appendChild(indicator);
        });
        
        // Ensure data-index is set
        container.dataset.index = 0;
    });
}

function updateCarousel(id, direction) {
    const container = document.getElementById(`items-${id}`);
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) return;
    
    let currentIndex = parseInt(container.dataset.index || 0);
    
    // Remove active class from current image
    images[currentIndex].classList.remove('active');
    
    // Find indicators and remove active class
    const indicatorsContainer = container.parentNode.querySelector('.carousel-indicators');
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.remove('active');
        }
    }
    
    // Calculate new index
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % images.length;
    } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    // Update container data attribute
    container.dataset.index = currentIndex;
    
    // Add active class to new image
    images[currentIndex].classList.add('active');
    
    // Add active class to new indicator
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.add('active');
        }
    }
}

function goToSlide(id, index) {
    const container = document.getElementById(`items-${id}`);
    const images = Array.from(container.querySelectorAll('img'));
    
    // Get current index from data attribute
    const currentIndex = parseInt(container.dataset.index || 0);
    
    // Remove active class from current image
    images[currentIndex].classList.remove('active');
    
    // Find indicators and remove active class
    const indicatorsContainer = container.parentNode.querySelector('.carousel-indicators');
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.remove('active');
        }
    }
    
    // Add active class to new image
    container.dataset.index = index;
    images[index].classList.add('active');
    
    // Add active class to new indicator
    if (indicatorsContainer) {
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.createElement('a');
    backToTopButton.href = '#';
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Add category descriptions
function addDescriptions() {
    // This function can be used to add dynamic descriptions if needed
    // For now, descriptions are already in the HTML
}

// Loading states
function initLoadingStates() {
    document.querySelectorAll('.carousel-images img').forEach(img => {
        // Set initial opacity for loading effect
        if (!img.complete) {
            img.style.opacity = '0';
        }
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Handle already cached images
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initCarousels();
    initBackToTop();
    addDescriptions();
    initLightbox();
    addTouchSupport();
    initLoadingStates();
});
