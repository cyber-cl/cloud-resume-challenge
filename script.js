// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navbar = document.querySelector('#navbar');

    // Toggle navigation menu
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Typing effect for hero heading
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        typeWriter();
    }

    // Animate timeline items in experience section
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimeline() {
        timelineItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                setTimeout(() => {
                    item.classList.add('animate-timeline');
                }, index * 200);
            }
        });
    }

    // Add CSS for timeline animation
    const style = document.createElement('style');
    style.innerHTML = `
        .timeline-item {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease;
        }
        
        .animate-timeline {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-item:nth-child(odd) {
            transform: translateX(-50px);
        }
        
        .timeline-item:nth-child(even) {
            transform: translateX(50px);
        }
        
        .animate-timeline:nth-child(odd),
        .animate-timeline:nth-child(even) {
            transform: translateX(0);
        }

        .certification-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-certification {
            opacity: 1;
            transform: translateY(0);
        }

        .blog-post {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-blog-post {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Animate certification cards
    const certificationCards = document.querySelectorAll('.certification-card');
    
    function animateCertifications() {
        certificationCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                setTimeout(() => {
                    card.classList.add('animate-certification');
                }, index * 200);
            }
        });
    }

    // Animate blog posts
    const blogPosts = document.querySelectorAll('.blog-post');
    
    function animateBlogPosts() {
        blogPosts.forEach((post, index) => {
            const postPosition = post.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (postPosition < screenPosition) {
                setTimeout(() => {
                    post.classList.add('animate-blog-post');
                }, index * 150);
            }
        });
    }

    // Animate skill progress bars when they come into view
    function animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        const skillsSection = document.querySelector('.skills');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        // First set width to 0
                        bar.style.width = '0';
                        // Then animate to the actual width
                        setTimeout(() => {
                            bar.style.transition = 'width 1.5s ease-in-out';
                            bar.style.width = width;
                        }, 100);
                    });
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        skillItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Animate project cards on scroll
    const projectCards = document.querySelectorAll('.project-card');
    
    function animateProjects() {
        projectCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                setTimeout(() => {
                    card.classList.add('show');
                }, index * 100);
            }
        });
    }

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                // First hide all cards with animation
                card.classList.remove('show');
                
                setTimeout(() => {
                    // Show cards based on filter
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const categories = card.getAttribute('data-category').split(' ');
                        if (categories.includes(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                    
                    // Re-animate visible cards
                    if (card.style.display === 'block') {
                        setTimeout(() => {
                            card.classList.add('show');
                        }, 50);
                    }
                }, 300);
            });
        });
    });

    // Animate counter digits
    const counterDigits = document.querySelectorAll('.digit');
    
    function animateCounter() {
        const counterPosition = document.querySelector('.counter').getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (counterPosition < screenPosition) {
            counterDigits.forEach((digit, index) => {
                setTimeout(() => {
                    digit.classList.add('animate');
                }, index * 200);
            });
        }
    }

    // Visitor counter functionality with Lambda integration
    async function fetchVisitorCount() {
        try {
            // Call your API Gateway endpoint that triggers the Lambda function
            const response = await fetch('https://2esp5jhh75y4rskw6tq7blrszu0jtcdb.lambda-url.us-east-1.on.aws');
            const count = await response.json();
            
            // Update the counter display with the real count
            updateCounterDisplay(count);
        } catch (error) {
            console.error('Error fetching visitor count:', error);
        }
    }

    function updateCounterDisplay(count) {
        const counterDigits = document.querySelectorAll('.digit');
        const countStr = count.toString().padStart(4, '0');
        
        counterDigits.forEach((digit, index) => {
            digit.textContent = countStr[index];
        });
    }

    // Call fetchVisitorCount when the counter section is visible
    const counterSection = document.querySelector('.visitor-counter');
    let counterFetched = false;
    
    function checkCounterVisibility() {
        if (!counterFetched && counterSection) {
            const counterPosition = counterSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (counterPosition < screenPosition) {
                fetchVisitorCount();
                counterFetched = true;
            }
        }
    }

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, you would send this data to your backend
            // For demonstration, we'll just log it and show a success message
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => group.style.display = 'none');
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.style.display = 'none';
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out, ${name}. I'll get back to you soon.</p>
            `;
            
            contactForm.appendChild(successMessage);
            
            // Reset form after 5 seconds
            setTimeout(() => {
                formGroups.forEach(group => group.style.display = 'block');
                submitBtn.style.display = 'block';
                successMessage.remove();
                contactForm.reset();
            }, 5000);
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // In a real implementation, you would send this to your backend
            console.log('Newsletter subscription:', email);
            
            // Show success message
            const originalContent = newsletterForm.innerHTML;
            newsletterForm.innerHTML = `<p class="success">Thanks for subscribing!</p>`;
            
            // Reset form after 3 seconds
            setTimeout(() => {
                newsletterForm.innerHTML = originalContent;
            }, 3000);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Call animation functions on scroll
    window.addEventListener('scroll', () => {
        animateTimeline();
        animateCertifications();
        animateBlogPosts();
        animateSkills();
        animateProjects();
        animateCounter();
        checkCounterVisibility();
    });

    // Initial call to animation functions
    animateTimeline();
    animateCertifications();
    animateBlogPosts();
    animateSkills();
    animateProjects();
    animateCounter();
    checkCounterVisibility();

    // Add hover effect for skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
    
    // Animate profile image
    const profileImage = document.querySelector('.about-image');
    if (profileImage) {
        // Add initial animation class
        profileImage.classList.add('animate');
        
        // Add interactive effects on mouse move
        profileImage.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = profileImage.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            // Apply subtle rotation based on mouse position
            profileImage.querySelector('img').style.transform = `
                perspective(1000px) 
                rotateY(${x * 10}deg) 
                rotateX(${y * -10}deg) 
                scale(1.05)
            `;
        });
        
        // Reset transform on mouse leave
        profileImage.addEventListener('mouseleave', () => {
            profileImage.querySelector('img').style.transform = 'scale(1)';
        });
    }
    
    // Initialize visitor counter animation
    const visitorCount = document.getElementById('visitor-count-value');
    if (visitorCount) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const count = parseInt(visitorCount.textContent);
                    animateCounter(count);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('.visitor-counter'));
    }
    
    function animateCounter(finalCount) {
        let count = 0;
        const duration = 2000; // 2 seconds
        const interval = 50; // Update every 50ms
        const steps = duration / interval;
        const increment = finalCount / steps;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= finalCount) {
                clearInterval(timer);
                count = finalCount;
            }
            visitorCount.textContent = Math.floor(count);
        }, interval);
    }
});

// Add a class to body when page is fully loaded
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Navigation toggle
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeIn 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Project filtering
const filterProjects = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                card.classList.remove('show');
                
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    setTimeout(() => {
                        card.classList.add('show');
                    }, 100);
                }
            });
        });
    });
    
    // Show all projects initially
    projectCards.forEach(card => {
        card.classList.add('show');
    });
}

// Sticky navigation
const stickyNav = () => {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });
}

// Initialize all functions
const app = () => {
    navSlide();
    animateSkills();
    filterProjects();
    stickyNav();
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', app);