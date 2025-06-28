// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Initialize Particle Background
    particlesJS.load('particles-js', 'particles-config.json', function() {
        console.log('Particles loaded!');
    });

    // Initialize Flight Map
    initFlightMap();

    // Initialize 3D Model Viewer
    initModelViewer();

    // Initialize AI Assistant
    initAIAssistant();

    // Initialize Voice Recognition
    initVoiceRecognition();

    // Load Aviation News
    loadAviationNews();

    // Initialize Data Visualization
    initDataVisualization();

    // AR Button Functionality
    document.getElementById('arButton').addEventListener('click', startARExperience);
});

// Theme Switching Function
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
}

// Flight Map Initialization
function initFlightMap() {
    const map = L.map('flightMap').setView([30, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // In a real implementation, you would fetch live flight data from an API like OpenSky
    // This is a simulation with sample data
    const sampleFlights = [
        { lat: 40.7128, lng: -74.0060, alt: 35000, call: 'UAL123', from: 'JFK', to: 'LAX' },
        { lat: 51.5074, lng: -0.1278, alt: 38000, call: 'BAW456', from: 'LHR', to: 'JFK' },
        { lat: 34.0522, lng: -118.2437, alt: 32000, call: 'AAL789', from: 'LAX', to: 'ORD' }
    ];

    sampleFlights.forEach(flight => {
        const planeIcon = L.divIcon({
            html: '<i class="fas fa-plane" style="color: #64ffda; font-size: 24px;"></i>',
            className: 'plane-icon'
        });
        
        const marker = L.marker([flight.lat, flight.lng], { icon: planeIcon }).addTo(map);
        marker.bindPopup(`
            <strong>Flight ${flight.call}</strong><br>
            From: ${flight.from}<br>
            To: ${flight.to}<br>
            Altitude: ${flight.alt} ft
        `);
    });

    // Refresh flights button
    document.getElementById('refreshFlights').addEventListener('click', () => {
        alert('In a real implementation, this would fetch fresh flight data from the API');
    });

    // Altitude filter
    const altitudeFilter = document.getElementById('altitudeFilter');
    const altitudeValue = document.getElementById('altitudeValue');
    
    altitudeFilter.addEventListener('input', () => {
        const value = altitudeFilter.value;
        altitudeValue.textContent = `${parseInt(value).toLocaleString()} ft`;
        // In real implementation, this would filter visible flights
    });
}

// 3D Model Viewer
function initModelViewer() {
    // This would be replaced with actual Three.js code to load 3D models
    const modelContainer = document.getElementById('modelContainer');
    modelContainer.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <i class="fas fa-space-shuttle" style="font-size: 100px; color: #64ffda;"></i>
            <p style="margin-left: 20px;">3D Model Viewer Placeholder<br>Would show Boeing/Airbus models in real implementation</p>
        </div>
    `;

    // Model navigation buttons
    const models = ['Boeing 787', 'Airbus A380', 'SpaceX Starship', 'SR-71 Blackbird'];
    let currentModel = 0;
    const modelName = document.getElementById('modelName');
    
    document.getElementById('nextModel').addEventListener('click', () => {
        currentModel = (currentModel + 1) % models.length;
        modelName.textContent = models[currentModel];
    });
    
    document.getElementById('prevModel').addEventListener('click', () => {
        currentModel = (currentModel - 1 + models.length) % models.length;
        modelName.textContent = models[currentModel];
    });
}

// AI Assistant
function initAIAssistant() {
    const aiChat = document.getElementById('aiChat');
    const aiQuery = document.getElementById('aiQuery');
    const sendAi = document.getElementById('sendAi');
    const minimizeAi = document.getElementById('minimizeAi');
    
    // Sample aviation knowledge base
    const aviationKnowledge = {
        "autopilot": "Modern autopilot systems use AI to handle routine flight operations, allowing pilots to focus on higher-level tasks. They can automatically adjust throttle, control surfaces, and navigation.",
        "predictive maintenance": "Airlines use AI to predict when aircraft components might fail by analyzing sensor data from thousands of flights. This reduces downtime and improves safety.",
        "air traffic control": "Next-gen ATC systems use AI to optimize flight paths, reduce congestion, and improve fuel efficiency. NASA is researching fully autonomous ATC systems.",
        "fuel efficiency": "AI algorithms analyze weather, aircraft weight, and other factors to calculate the most fuel-efficient routes and speeds, saving airlines millions annually."
    };
    
    sendAi.addEventListener('click', () => {
        const question = aiQuery.value.toLowerCase();
        aiQuery.value = '';
        
        // Add user question to chat
        aiChat.innerHTML += `<div class="user-message">${question}</div>`;
        
        // Simulate AI thinking
        setTimeout(() => {
            let response = "I'm not sure about that. Could you ask something about autopilot, predictive maintenance, air traffic control, or fuel efficiency?";
            
            // Check if question matches any knowledge base topic
            for (const [key, value] of Object.entries(aviationKnowledge)) {
                if (question.includes(key)) {
                    response = value;
                    break;
                }
            }
            
            aiChat.innerHTML += `<div class="ai-message">${response}</div>`;
            aiChat.scrollTop = aiChat.scrollHeight;
        }, 1000);
    });
    
    // Allow pressing Enter to send
    aiQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAi.click();
        }
    });
    
    // Minimize/maximize AI assistant
    minimizeAi.addEventListener('click', () => {
        const aiAssistant = document.querySelector('.ai-assistant');
        const isMinimized = aiAssistant.style.transform === 'translateY(calc(100% - 40px))';
        
        if (isMinimized) {
            aiAssistant.style.transform = 'translateY(0)';
            minimizeAi.textContent = '−';
        } else {
            aiAssistant.style.transform = 'translateY(calc(100% - 40px))';
            minimizeAi.textContent = '+';
        }
    });
}

// Voice Recognition
function initVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window)) {
        voiceBtn.style.display = 'none';
        voiceStatus.textContent = 'Voice commands not supported in this browser';
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Voice recognition stopped';
        } else {
            recognition.start();
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = 'Listening... Speak now about aviation';
        }
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        voiceStatus.textContent = `Heard: "${transcript}"`;
        
        // Process voice command
        if (transcript.includes('search')) {
            document.getElementById('searchInput').value = transcript.replace('search', '').trim();
            // In real implementation, trigger search
            alert(`Would search for: "${transcript.replace('search', '').trim()}"`);
        } else if (transcript.includes('dark mode') || transcript.includes('light mode')) {
            toggleTheme();
        } else if (transcript.includes('flight')) {
            // Focus on flight tracker
            document.querySelector('.tracker-section').scrollIntoView();
        } else {
            // Send to AI assistant
            document.getElementById('aiQuery').value = transcript;
            document.getElementById('sendAi').click();
        }
    };
    
    recognition.onerror = (event) => {
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = `Error: ${event.error}`;
    };
}

// Load Aviation News
async function loadAviationNews() {
    // In a real implementation, you would fetch from a news API
    // This is simulated data
    const newsGrid = document.getElementById('newsGrid');
    
    const sampleNews = [
        {
            title: "AI-Powered Air Traffic Control System Launched in Europe",
            summary: "A new AI system can handle 50% more flights with reduced delays.",
            date: "May 15, 2023"
        },
        {
            title: "Boeing Unveils Autonomous Passenger Aircraft Prototype",
            summary: "The new aircraft can fly without pilots for regional routes.",
            date: "April 28, 2023"
        },
        {
            title: "NASA Develops AI That Predicts Turbulence 10x Better",
            summary: "New machine learning model analyzes atmospheric data in real-time.",
            date: "June 2, 2023"
        }
    ];
    
    newsGrid.innerHTML = sampleNews.map(news => `
        <div class="news-card">
            <h3>${news.title}</h3>
            <p>${news.summary}</p>
            <small>${news.date}</small>
        </div>
    `).join('');
}

// Data Visualization
function initDataVisualization() {
    const ctx = document.getElementById('flightChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Fuel Savings', 'Reduced Delays', 'Safety Incidents', 'CO2 Reduction'],
            datasets: [{
                label: 'AI Impact in Aviation (%)',
                data: [12, 25, 40, 18],
                backgroundColor: [
                    'rgba(100, 255, 218, 0.7)',
                    'rgba(30, 144, 255, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(100, 255, 218, 1)',
                    'rgba(30, 144, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// AR Experience
function startARExperience() {
    alert('In a real implementation, this would launch WebXR to view aircraft models in AR');
}
