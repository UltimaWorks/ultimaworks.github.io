// Ultima Online GitHub Pages - Interactive Effects
// © 2025 JBob / NerdyGamers

document.addEventListener('DOMContentLoaded', () => {
    initGumpEffects();
    initServerStatus();
    initScrollAnimations();
});

// === GUMP INTERACTION EFFECTS ===
function initGumpEffects() {
    const gumpWindows = document.querySelectorAll('.gump-window');
    
    gumpWindows.forEach((gump, index) => {
        // Staggered animation on load
        gump.style.animationDelay = `${index * 0.1}s`;
        
        // Subtle hover effect
        gump.addEventListener('mouseenter', () => {
            gump.style.transform = 'translateY(-2px)';
            gump.style.transition = 'transform 0.3s ease';
        });
        
        gump.addEventListener('mouseleave', () => {
            gump.style.transform = 'translateY(0)';
        });
    });
}

// === SERVER STATUS SIMULATION ===
function initServerStatus() {
    const statusElement = document.querySelector('.stat-value.online');
    
    if (!statusElement) return;
    
    // Pulse effect for online status
    setInterval(() => {
        statusElement.style.animation = 'none';
        setTimeout(() => {
            statusElement.style.animation = 'statusPulse 2s ease-in-out infinite';
        }, 10);
    }, 5000);
    
    // Add CSS animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes statusPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.feature-item, .project-button');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// === PARTICLE EFFECT (OPTIONAL) ===
function createParticles() {
    const particleCount = 30;
    const container = document.body;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(255, 215, 0, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            opacity: ${Math.random() * 0.5};
        `;
        container.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

// Uncomment to enable particle effect
// createParticles();
