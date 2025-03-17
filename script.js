document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
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

    // Typewriter effect for hero section
    const typewriterText = document.querySelector('.typewriter');
    const text = typewriterText.textContent;
    typewriterText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typewriterText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Observe architecture layers
    document.querySelectorAll('.layer').forEach(layer => {
        layer.style.opacity = '0';
        layer.style.transform = 'translateX(-20px)';
        observer.observe(layer);
    });

    // AI Assistant button interaction
    const aiAssistant = document.querySelector('.assistant-btn');
    aiAssistant.addEventListener('click', () => {
        aiAssistant.classList.add('active');
        // Add your AI assistant logic here
    });

    // SOS button interaction
    const sosBtn = document.querySelector('.sos-btn');
    sosBtn.addEventListener('click', () => {
        sosBtn.classList.add('emergency-active');
        // Add your emergency alert logic here
        setTimeout(() => {
            sosBtn.classList.remove('emergency-active');
        }, 2000);
    });

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // Initialize Google Maps
    let map;
    let markers = [];
    let infoWindow;

    function initMap() {
        map = new google.maps.Map(document.getElementById('hospitalMap'), {
            zoom: 14,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#242f3e' }]
                },
                {
                    featureType: 'all',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#242f3e' }]
                },
                {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#746855' }]
                }
            ]
        });

        infoWindow = new google.maps.InfoWindow();

        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(pos);
                    searchNearbyHospitals(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        }
    }

    function searchNearbyHospitals(location) {
        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: location,
            radius: '5000',
            type: ['hospital']
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                results.forEach(place => {
                    createHospitalMarker(place);
                });
                updateHospitalsList(results);
            }
        });
    }

    function createHospitalMarker(place) {
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#dc2626',
                fillOpacity: 0.7,
                strokeWeight: 2,
                strokeColor: '#ffffff'
            }
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', () => {
            const content = `
                <div class="info-window">
                    <h3>${place.name}</h3>
                    <p>${place.vicinity}</p>
                    ${place.rating ? `<p>Rating: ${place.rating} ⭐</p>` : ''}
                    ${place.opening_hours?.open_now ? '<p>Open Now</p>' : ''}
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" 
                       class="website-link" target="_blank">Get Directions</a>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
    }

    function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    function updateHospitalsList(hospitals) {
        const hospitalsList = document.querySelector('.hospitals-list');
        hospitalsList.innerHTML = hospitals.map(hospital => `
            <div class="hospital-card glass-card">
                <h3>${hospital.name}</h3>
                <p class="hospital-address">
                    <span class="material-icons">location_on</span>
                    ${hospital.vicinity}
                </p>
                <div class="hospital-meta">
                    ${hospital.opening_hours?.open_now 
                        ? '<span><span class="material-icons">check_circle</span> Open Now</span>' 
                        : '<span><span class="material-icons">schedule</span> Closed</span>'}
                    ${hospital.rating 
                        ? `<span><span class="material-icons">star</span> ${hospital.rating}</span>` 
                        : ''}
                </div>
                <div class="hospital-actions">
                    <button class="primary-btn" onclick="showDirections('${hospital.place_id}')">
                        Get Directions
                    </button>
                    <button class="icon-btn" onclick="showDetails('${hospital.place_id}')">
                        <span class="material-icons">info</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Health Records Upload
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            uploadArea.classList.add('highlight');
        }

        function unhighlight(e) {
            uploadArea.classList.remove('highlight');
        }

        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            // Here you would typically upload the files to your server
            // For now, we'll just show a success message
            const analysisResults = document.querySelector('.analysis-results');
            analysisResults.style.display = 'block';
            // Add loading state and then show results
            setTimeout(() => {
                showAnalysisResults();
            }, 2000);
        }
    }

    function showAnalysisResults() {
        const resultContent = document.querySelector('.result-content');
        resultContent.innerHTML = `
            <div class="analysis-summary">
                <h4>Analysis Complete</h4>
                <p>The AI has analyzed your medical report and found the following:</p>
                <ul>
                    <li>Normal blood pressure levels</li>
                    <li>Cholesterol levels slightly elevated</li>
                    <li>Blood sugar within normal range</li>
                </ul>
                <div class="recommendations">
                    <h4>Recommendations</h4>
                    <p>Based on the analysis, we recommend:</p>
                    <ul>
                        <li>Regular exercise</li>
                        <li>Reduced intake of saturated fats</li>
                        <li>Follow-up in 3 months</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Initialize map if the element exists
    const mapElement = document.getElementById('hospitalMap');
    if (mapElement) {
        initMap();
    }

    // Family Member Management
    const addMemberBtn = document.querySelector('.add-member');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            // Here you would typically show a modal or form to add a new family member
            console.log('Add family member clicked');
        });
    }

    // Modal Management
    const modals = {
        login: document.getElementById('loginModal'),
        register: document.getElementById('registerModal'),
        profile: document.getElementById('profileModal'),
        notifications: document.getElementById('notificationsModal'),
        sos: document.getElementById('sosModal')
    };

    const buttons = {
        login: document.getElementById('loginBtn'),
        register: document.getElementById('registerBtn'),
        profile: document.getElementById('profileBtn'),
        notifications: document.getElementById('notificationsBtn'),
        sos: document.getElementById('sosBtn'),
        switchToRegister: document.getElementById('switchToRegister'),
        switchToLogin: document.getElementById('switchToLogin')
    };

    // Modal Controls
    function showModal(modalId) {
        modals[modalId].classList.add('active');
    }

    function hideModal(modalId) {
        modals[modalId].classList.remove('active');
    }

    function hideAllModals() {
        Object.keys(modals).forEach(key => hideModal(key));
    }

    // Event Listeners for Modals
    Object.keys(buttons).forEach(key => {
        if (buttons[key]) {
            buttons[key].addEventListener('click', () => {
                hideAllModals();
                showModal(key);
            });
        }
    });

    // Close buttons for modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllModals();
        });
    });

    // Switch between login and register
    buttons.switchToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('login');
        showModal('register');
    });

    buttons.switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('register');
        showModal('login');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        Object.values(modals).forEach(modal => {
            if (e.target === modal) {
                hideAllModals();
            }
        });
    });

    // Authentication Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                hideAllModals();
                updateUIForLoggedInUser(data.user);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            showError('Login failed. Please try again.');
        }
    });

    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                hideModal('register');
                showModal('login');
                showSuccess('Registration successful! Please log in.');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            showError('Registration failed. Please try again.');
        }
    });

    // Notifications
    function updateNotificationBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    async function fetchNotifications() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const notifications = await response.json();
                updateNotificationsList(notifications);
                updateNotificationBadge(notifications.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }

    function updateNotificationsList(notifications) {
        const list = document.querySelector('.notifications-list');
        if (list) {
            list.innerHTML = notifications.map(notification => `
                <div class="notification-item ${notification.read ? '' : 'unread'}">
                    <span class="material-icons notification-icon">${notification.icon}</span>
                    <div class="notification-content">
                        <p>${notification.message}</p>
                        <span class="notification-time">${formatTime(notification.timestamp)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Emergency SOS
    const emergencyBtns = document.querySelectorAll('.emergency-btn');
    emergencyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.textContent.trim();
            switch (action) {
                case 'Call Ambulance':
                    await handleEmergencyCall();
                    break;
                case 'Emergency Contact':
                    await notifyEmergencyContacts();
                    break;
                case 'Share Location':
                    await shareLocation();
                    break;
            }
        });
    });

    async function handleEmergencyCall() {
        try {
            // Replace with your actual emergency service API
            const response = await fetch('/api/emergency/ambulance', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                showSuccess('Emergency services have been notified. Help is on the way.');
            }
        } catch (error) {
            showError('Failed to contact emergency services. Please dial emergency number directly.');
        }
    }

    async function notifyEmergencyContacts() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/emergency/contacts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                showSuccess('Emergency contacts have been notified.');
            }
        } catch (error) {
            showError('Failed to notify emergency contacts.');
        }
    }

    async function shareLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    // Replace with your actual API endpoint
                    const response = await fetch('/api/emergency/location', {
                        method: 'POST',
                        body: JSON.stringify({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }),
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        showSuccess('Location shared with emergency services.');
                    }
                } catch (error) {
                    showError('Failed to share location.');
                }
            }, () => {
                showError('Unable to access location. Please enable location services.');
            });
        } else {
            showError('Geolocation is not supported by your browser.');
        }
    }

    // Utility Functions
    function showError(message) {
        // Implement your error notification system
        console.error(message);
    }

    function showSuccess(message) {
        // Implement your success notification system
        console.log(message);
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    function updateUIForLoggedInUser(user) {
        // Update UI elements for logged-in state
        const profileInfo = document.querySelector('.profile-info');
        if (profileInfo) {
            profileInfo.innerHTML = `
                <h4>${user.name}</h4>
                <p>${user.email}</p>
            `;
        }

        // Show/hide appropriate buttons
        if (buttons.login) buttons.login.style.display = 'none';
        if (buttons.register) buttons.register.style.display = 'none';
        if (buttons.profile) buttons.profile.style.display = 'block';
    }

    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token and get user data
        fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                updateUIForLoggedInUser(data.user);
                fetchNotifications();
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
        });
    }

    // Mobile Navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks?.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.8s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .emergency-active {
        animation: emergencyPulse 0.5s ease infinite;
    }

    @keyframes emergencyPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .assistant-btn.active {
        transform: scale(0.95);
        background: var(--accent);
    }
`;
document.head.appendChild(style); 