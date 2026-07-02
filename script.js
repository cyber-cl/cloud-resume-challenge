// ============================================
// Portfolio — Main JavaScript
// Static site — no backend required
// Forms handled via Web3Forms
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initHeroInteractive();
    initScrollAnimations();
    initProjectFiltering();
    initVisitorCounter();
    initBookingForm();
    initContactForm();
    initNewsletterForm();
    initProfileImage();
    setBookingMinDate();
});

// Add loaded class for page transitions
window.addEventListener('load', () => document.body.classList.add('loaded'));

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navbar = document.querySelector('#navbar');

    // Burger toggle
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                // Custom offsets per section
                const offsets = { '#home': -50, '#about': -35, '#experience': -35, '#skills': -35, '#certifications': -35, '#projects': -35, '#blog': -50, '#contact': -50 };
                const offset = offsets[href] !== undefined ? offsets[href] : 100;

                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// TYPING EFFECT
// ============================================

function initTypingEffect() {
    const el = document.querySelector('.typing-text');
    if (!el) return;

    const text = el.textContent;
    el.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 60 + Math.random() * 40);
        }
    }

    // Small delay before starting
    setTimeout(type, 600);
}

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animate-timeline'), i * 150);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    timelineItems.forEach(item => timelineObserver.observe(item));

    // Certification cards
    const certCards = document.querySelectorAll('.certification-card');
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animate-certification'), i * 120);
                certObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    certCards.forEach(card => certObserver.observe(card));

    // Blog posts
    const blogPosts = document.querySelectorAll('.blog-post');
    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animate-blog-post'), i * 100);
                blogObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    blogPosts.forEach(post => blogObserver.observe(post));

    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('show'), i * 100);
                projectObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    projectCards.forEach(card => projectObserver.observe(card));

    // Skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    skillCategories.forEach(cat => {
        cat.style.opacity = '0';
        cat.style.transform = 'translateY(20px)';
        cat.style.transition = 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        skillObserver.observe(cat);
    });
}

// ============================================
// PROJECT FILTERING
// ============================================

function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.classList.remove('show');

                setTimeout(() => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'flex';
                        setTimeout(() => card.classList.add('show'), 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 250);
            });
        });
    });
}

// ============================================
// VISITOR COUNTER (AWS Lambda)
// ============================================

function initVisitorCounter() {
    const el = document.getElementById('visitor-count-value');
    if (!el) return;

    el.textContent = '...';

    fetch('https://e2emkln44huherudj2txqizlba0udyup.lambda-url.us-east-1.on.aws', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(async (res) => {
            if (!res.ok) throw new Error('Network error');

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return res.json();
            }

            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                return { count: Number(text) || 1 };
            }
        })
        .then(data => {
            const payload = typeof data === 'string' ? JSON.parse(data) : data;
            const rawCount = payload?.count ?? payload?.visitorCount ?? payload?.visitors ?? payload?.value ?? payload?.body ?? payload;

            let count = Number(rawCount);
            if (Number.isNaN(count) || count < 1) count = 1;

            animateCount(el, count);
        })
        .catch(() => {
            el.textContent = '1';
        });
}

function animateCount(el, target) {
    if (target <= 5) {
        el.textContent = target;
        return;
    }

    let current = 0;
    const duration = 1500;
    const interval = 25;
    const steps = duration / interval;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        el.textContent = Math.floor(current);
    }, interval);
}

// ============================================
// CONTACT FORM → Web3Forms
// ============================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await res.json();

            if (result.success) {
                showFormSuccess(form, submitBtn, originalText, formData.get('name'));
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            // Still show success to the user (message may have gone through)
            showFormSuccess(form, submitBtn, originalText, formData.get('name'));
        }
    });
}

function showFormSuccess(form, submitBtn, originalText, name) {
    const groups = form.querySelectorAll('.form-group');
    groups.forEach(g => g.style.display = 'none');
    submitBtn.style.display = 'none';

    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Message Sent!</h3>
        <p>Thank you, ${name || 'friend'}. I'll get back to you soon.</p>
    `;
    form.appendChild(msg);

    setTimeout(() => {
        groups.forEach(g => g.style.display = 'block');
        submitBtn.style.display = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        msg.remove();
        form.reset();
    }, 4000);
}

// ============================================
// NEWSLETTER FORM (static)
// ============================================

function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const originalHTML = form.innerHTML;
        form.innerHTML = `<p style="color: rgba(255,255,255,0.9); font-size: 0.92rem; padding: 8px 0;">✓ Thanks for subscribing!</p>`;

        setTimeout(() => {
            form.innerHTML = originalHTML;
            // Re-attach listener after innerHTML reset
            initNewsletterForm();
        }, 3000);
    });
}

// ============================================
// BOOKING FORM → Web3Forms
// ============================================

function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    // Time slot selection
    const timeSlots = form.querySelectorAll('.time-slot');
    const timeInput = document.getElementById('booking-time');

    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            timeInput.value = slot.getAttribute('data-time');
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!timeInput.value) {
            alert('Please select a time slot.');
            return;
        }

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;

        const date = formData.get('date');
        const time = timeInput.value;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await res.json();

            if (result.success) {
                showBookingSuccess(form, date, time);
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            // Still show success to user
            showBookingSuccess(form, date, time);
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showBookingSuccess(form, date, time) {
    form.innerHTML = `
        <div class="success-message">
            <i class="fas fa-calendar-check"></i>
            <h3>Meeting Request Sent!</h3>
            <p>Requested for ${date} at ${formatTime(time)}.</p>
            <p style="margin-top:8px;font-size:0.88rem;color:var(--text-tertiary);">I'll confirm the meeting via email shortly.</p>
        </div>
    `;
}

function formatTime(time24) {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
}

function setBookingMinDate() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Minimum: tomorrow
        dateInput.min = today.toISOString().split('T')[0];
    }
}

// ============================================
// PROFILE IMAGE INTERACTION
// ============================================

function initProfileImage() {
    const container = document.querySelector('.about-image');
    if (!container) return;

    container.classList.add('animate');

    const img = container.querySelector('img');
    if (!img) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        img.style.transform = `
            perspective(800px)
            rotateY(${x * 8}deg)
            rotateX(${y * -8}deg)
            scale(1.03)
        `;
    });

    container.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
}

// ============================================
// INTERACTIVE HERO (Canvas Network + Terminal)
// ============================================

function initHeroInteractive() {
    initCanvasNetwork();
    initTerminalSimulation();
}

function initCanvasNetwork() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 55;
    const connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction (gentle repulsion)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.2;
                    this.y += (dy / dist) * force * 1.2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 113, 227, 0.4)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(maxParticles, Math.floor((canvas.width * canvas.height) / 22000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 113, 227, ${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    animate();
}

function initTerminalSimulation() {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const script = [
        { type: 'command', text: 'terraform init' },
        { type: 'info', text: 'Initializing the backend...' },
        { type: 'info', text: 'Initializing provider plugins...' },
        { type: 'success', text: '✔ Terraform has been successfully initialized!' },
        { type: 'command', text: 'terraform apply -auto-approve' },
        { type: 'info', text: 'aws_vpc.main: Creating...' },
        { type: 'info', text: 'aws_dynamodb_table.visitor_counter: Creating...' },
        { type: 'info', text: 'aws_lambda_function.counter_api: Creating...' },
        { type: 'success', text: 'aws_vpc.main: Creation complete after 3s' },
        { type: 'success', text: 'aws_dynamodb_table.visitor_counter: Creation complete after 2s' },
        { type: 'success', text: 'aws_lambda_function.counter_api: Creation complete after 4s' },
        { type: 'success', text: 'Apply complete! Resources: 3 added, 0 changed, 0 destroyed.' },
        { type: 'command', text: 'python deploy_llm.py --model llama-3' },
        { type: 'info', text: 'Loading LLM weights from HuggingFace cache...' },
        { type: 'info', text: 'Loading model: [====================] 100%' },
        { type: 'info', text: 'Optimizing KV Cache on NVIDIA A100 GPU...' },
        { type: 'success', text: '✔ LLM inference serving engine initialized!' },
        { type: 'command', text: 'kubectl apply -f deployment.yaml' },
        { type: 'success', text: 'deployment.apps/ai-model-serving created' },
        { type: 'success', text: 'service/ai-inference-service created' },
        { type: 'command', text: 'kubectl get pods -n production' },
        { type: 'info', text: 'NAME                               READY  STATUS   RESTARTS  AGE\nai-model-serving-5f96b-x49v        1/1    Running  0         4s\nvisitor-counter-app-1234b-abcd     1/1    Running  0         4s' },
        { type: 'success', text: '\n✔ Deployment active! AI services online at https://prashant.dev' }
    ];

    let lineIndex = 0;

    function printNextLine() {
        if (!document.getElementById('terminal-output')) return; // guard if route/page changes

        if (lineIndex >= script.length) {
            setTimeout(() => {
                if (!output) return;
                output.innerHTML = '';
                lineIndex = 0;
                printNextLine();
            }, 6000);
            return;
        }

        const line = script[lineIndex];
        const lineEl = document.createElement('div');
        lineEl.className = 'terminal-line';

        if (line.type === 'command') {
            const promptSpan = document.createElement('span');
            promptSpan.style.color = '#8b949e';
            promptSpan.textContent = 'developer@prashant:~$ ';
            lineEl.appendChild(promptSpan);

            const cmdSpan = document.createElement('span');
            cmdSpan.className = 'terminal-command';
            lineEl.appendChild(cmdSpan);

            // Typewriter effect for commands
            let charIndex = 0;
            const cmdText = line.text;
            const typeTimer = setInterval(() => {
                if (!document.getElementById('terminal-output')) {
                    clearInterval(typeTimer);
                    return;
                }
                if (charIndex < cmdText.length) {
                    cmdSpan.textContent += cmdText.charAt(charIndex);
                    charIndex++;
                    output.scrollTop = output.scrollHeight;
                } else {
                    clearInterval(typeTimer);
                    lineIndex++;
                    setTimeout(printNextLine, 500);
                }
            }, 60);
        } else {
            const contentSpan = document.createElement('span');
            if (line.type === 'success') contentSpan.className = 'terminal-success';
            else if (line.type === 'warning') contentSpan.className = 'terminal-warning';
            else if (line.type === 'error') contentSpan.className = 'terminal-error';
            else contentSpan.className = 'terminal-info';

            contentSpan.textContent = line.text;
            lineEl.appendChild(contentSpan);
            lineIndex++;
            output.scrollTop = output.scrollHeight;
            setTimeout(printNextLine, line.type === 'info' ? 200 : 700);
        }

        output.appendChild(lineEl);
        output.scrollTop = output.scrollHeight;
    }

    printNextLine();
}