// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Language Selector
    const languageSelect = document.querySelector('.glass-select');
    languageSelect.addEventListener('change', (e) => {
        // TODO: Implement language change functionality
        console.log('Language changed to:', e.target.value);
    });

    // Emergency SOS
    const sosButtons = document.querySelectorAll('.sos-btn, .sos-icon, .secondary-btn.pulse-btn');
    sosButtons.forEach(btn => {
        btn.addEventListener('click', handleEmergency);
    });

    // Add Family Member
    const addMemberBtn = document.querySelector('.add-member');
    addMemberBtn.addEventListener('click', showAddMemberModal);

    // Hospital Search
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', searchHospitals);

    // AI Report Analysis
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.addEventListener('click', () => document.getElementById('report-upload').click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);

    // Health Plan Tabs
    const planTabs = document.querySelectorAll('.tab-btn');
    planTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            planTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            updatePlanContent(e.target.textContent);
        });
    });

    // AI Assistant
    const assistantBtn = document.querySelector('.assistant-btn');
    assistantBtn.addEventListener('click', toggleAIAssistant);

    // Initialize the map
    initializeMap();
});

// Emergency Handler
function handleEmergency() {
    const confirmation = confirm('This will call emergency services. Continue?');
    if (confirmation) {
        alert('Contacting emergency services and notifying emergency contacts...');
        // TODO: Implement actual emergency service integration
    }
}

// Add Family Member Modal
function showAddMemberModal() {
    const modal = document.createElement('div');
    modal.className = 'modal glass-card';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Family Member</h2>
            <form id="add-member-form">
                <input type="text" placeholder="Name" required class="glass-input">
                <input type="number" placeholder="Age" required class="glass-input">
                <select class="glass-input">
                    <option value="">Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
                <button type="submit" class="primary-btn">Add Member</button>
                <button type="button" class="secondary-btn" onclick="this.closest('.modal').remove()">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('add-member-form').addEventListener('submit', handleAddMember);
}

// Handle Add Member Form Submission
function handleAddMember(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value;
    const age = form.querySelector('input[type="number"]').value;
    const bloodGroup = form.querySelector('select').value;

    // Create new member card
    const memberCard = createMemberCard(name, age, bloodGroup);
    document.querySelector('.family-grid').insertBefore(memberCard, document.querySelector('.add-member'));
    
    // Close modal
    form.closest('.modal').remove();
}

// Create Member Card
function createMemberCard(name, age, bloodGroup) {
    const div = document.createElement('div');
    div.className = 'member-card glass-card';
    div.innerHTML = `
        <div class="member-avatar">${name[0].toUpperCase()}</div>
        <h3>${name}</h3>
        <p>Family Member</p>
        <div class="member-stats">
            <span>Age: ${age}</span>
            <span>Blood: ${bloodGroup}</span>
        </div>
        <button class="view-btn">View Records</button>
    `;
    return div;
}

// Hospital Search
function searchHospitals() {
    const location = document.querySelector('.search-box input').value;
    if (!location) {
        alert('Please enter a location');
        return;
    }

    // Simulate hospital search
    const hospitals = [
        { name: 'City Hospital', distance: '2.5 km', hours: '24/7', emergency: true },
        { name: 'Medicare Center', distance: '3.1 km', hours: '9AM-9PM', emergency: true },
        { name: 'Health Plus', distance: '4.2 km', hours: '24/7', emergency: false }
    ];

    const hospitalList = document.querySelector('.hospital-list');
    hospitalList.innerHTML = hospitals.map(hospital => `
        <div class="hospital-card glass-card">
            <h3>${hospital.name}</h3>
            <div class="hospital-info">
                <span>🚶‍♂️ ${hospital.distance} away</span>
                <span>⏰ ${hospital.hours}</span>
                <span>🚑 ${hospital.emergency ? 'Emergency Available' : 'No Emergency'}</span>
            </div>
            <button class="route-btn" onclick="showRoute('${hospital.name}')">Show Route</button>
        </div>
    `).join('');
}

// Map Integration
function initializeMap() {
    // Placeholder for map integration
    const mapView = document.querySelector('.map-view');
    mapView.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <p>Map Integration</p>
            <p>You can integrate Google Maps or any other map service here</p>
        </div>
    `;
}

function showRoute(hospitalName) {
    alert(`Showing route to ${hospitalName}`);
    // TODO: Implement actual route display using maps API
}

// File Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    const file = files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
        // Simulate AI analysis
        showAnalysisResults();
    } else {
        alert('Please upload a PDF or image file');
    }
}

function showAnalysisResults() {
    const results = document.querySelector('.result-content');
    results.innerHTML = `
        <div class="analysis-item">
            <h4>Report Summary</h4>
            <p>Analysis in progress... Please wait.</p>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        </div>
    `;

    // Simulate analysis completion
    setTimeout(() => {
        results.innerHTML = `
            <div class="analysis-item">
                <h4>Report Summary</h4>
                <p>✅ All vital signs are normal</p>
                <p>⚠️ Vitamin D levels are slightly low</p>
                <p>📋 Recommended follow-up in 3 months</p>
            </div>
        `;
    }, 2000);
}

// AI Assistant
function toggleAIAssistant() {
    const assistant = document.querySelector('.ai-assistant');
    if (assistant) {
        assistant.remove();
    } else {
        const div = document.createElement('div');
        div.className = 'ai-assistant glass-card';
        div.innerHTML = `
            <div class="assistant-header">
                <h3>AI Health Assistant</h3>
                <button onclick="toggleAIAssistant()" class="close-btn">×</button>
            </div>
            <div class="assistant-chat">
                <div class="message bot">Hello! How can I help you with your health today?</div>
            </div>
            <div class="assistant-input">
                <input type="text" placeholder="Type your health query..." class="glass-input">
                <button class="send-btn">Send</button>
            </div>
        `;
        document.body.appendChild(div);

        // Add chat functionality
        const input = div.querySelector('input');
        const sendBtn = div.querySelector('.send-btn');
        const chat = div.querySelector('.assistant-chat');

        function sendMessage() {
            const text = input.value.trim();
            if (text) {
                chat.innerHTML += `<div class="message user">${text}</div>`;
                input.value = '';
                // Simulate AI response
                setTimeout(() => {
                    chat.innerHTML += `<div class="message bot">I understand your concern about "${text}". Let me help you with that...</div>`;
                    chat.scrollTop = chat.scrollHeight;
                }, 1000);
            }
        }

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
} 