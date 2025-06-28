// ===== QUANTUM FLIGHT TRACKER =====
class QuantumFlightTracker {
    constructor() {
        this.canvas = document.getElementById('flightCanvas');
        this.flights = [];
        this.gpuAdapter = null;
        this.gpuDevice = null;
        this.renderPipeline = null;
        
        this.initWebGPU();
        this.loadFlightData();
    }
    
    async initWebGPU() {
        if (!navigator.gpu) {
            console.error("WebGPU not supported!");
            return;
        }
        
        this.gpuAdapter = await navigator.gpu.requestAdapter();
        this.gpuDevice = await this.gpuAdapter.requestDevice();
        
        const context = this.canvas.getContext('webgpu');
        const format = navigator.gpu.getPreferredCanvasFormat();
        
        context.configure({
            device: this.gpuDevice,
            format: format,
            alphaMode: 'premultiplied'
        });
        
        this.renderPipeline = this.gpuDevice.createRenderPipeline({
            vertex: {
                module: this.gpuDevice.createShaderModule({
                    code: `
                        @vertex
                        fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
                            let pos = array(
                                vec2(-1.0, -1.0),
                                vec2(3.0, -1.0),
                                vec2(-1.0, 3.0)
                            );
                            return vec4(pos[vertex_index], 0.0, 1.0);
                        }
                    `
                }),
                entryPoint: 'vs_main'
            },
            fragment: {
                module: this.gpuDevice.createShaderModule({
                    code: `
                        @fragment
                        fn fs_main() -> @location(0) vec4<f32> {
                            return vec4(0.0, 1.0, 1.0, 1.0);
                        }
                    `
                }),
                entryPoint: 'fs_main',
                targets: [{ format: format }]
            },
            primitive: {
                topology: 'triangle-list'
            }
        });
        
        this.render();
    }
    
    async loadFlightData() {
        try {
            // In production, replace with real API call
            const response = await fetch('https://api.aviationstack.com/v1/flights?access_key=YOUR_API_KEY');
            const data = await response.json();
            this.flights = data.data;
            this.updateTelemetry();
        } catch (error) {
            console.error("Error loading flight data:", error);
            // Fallback to simulated data
            this.flights = this.generateSimulatedFlights(50000);
            this.updateTelemetry();
        }
    }
    
    generateSimulatedFlights(count) {
        const flights = [];
        for (let i = 0; i < count; i++) {
            flights.push({
                icao24: this.randomHex(6),
                callsign: this.randomCallsign(),
                latitude: Math.random() * 180 - 90,
                longitude: Math.random() * 360 - 180,
                altitude: Math.random() * 40000,
                velocity: Math.random() * 1000 + 200
            });
        }
        return flights;
    }
    
    randomHex(length) {
        return Array.from({length}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
    }
    
    randomCallsign() {
        const airlines = ['UAL', 'AAL', 'DAL', 'BAW', 'AFR', 'QFA', 'SIA'];
        const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return airlines[Math.floor(Math.random() * airlines.length)] + numbers;
    }
    
    updateTelemetry() {
        const totalFlights = this.flights.length;
        const avgSpeed = this.flights.reduce((sum, flight) => sum + flight.velocity, 0) / totalFlights;
        
        document.getElementById('liveCount').textContent = 
            new Intl.NumberFormat().format(totalFlights);
        document.getElementById('avgSpeed').textContent = 
            `${Math.round(avgSpeed)} km/h`;
    }
    
    render() {
        if (!this.gpuDevice) return;
        
        const context = this.canvas.getContext('webgpu');
        const commandEncoder = this.gpuDevice.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();
        
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.05, b: 0.1, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store'
            }]
        });
        
        renderPass.setPipeline(this.renderPipeline);
        renderPass.draw(3);
        renderPass.end();
        
        this.gpuDevice.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(() => this.render());
    }
}

// ===== 2025 AI NEWS NETWORK =====
class AINews2025 {
    constructor() {
        this.newsGrid = document.getElementById('news2025');
        this.articles = [];
        this.currentCategory = 'all';
        
        this.loadNews();
        this.setupEventListeners();
    }
    
    async loadNews() {
        try {
            // In production, replace with real API call
            const response = await fetch('https://newsapi.org/v2/everything?q=aviation&from=2025-01-01&sortBy=popularity&apiKey=YOUR_API_KEY');
            const data = await response.json();
            this.articles = data.articles.slice(0, 6);
        } catch (error) {
            console.error("Error loading news:", error);
            // Fallback to simulated 2025 news
            this.articles = this.generate2025News();
        }
        
        this.renderNews();
    }
    
    generate2025News() {
        return [
            {
                title: "Neural-Link Controlled Air Taxis Launch in Dubai",
                description: "Pilots now navigate using direct brainwaves with 2ms latency, revolutionizing urban air mobility.",
                publishedAt: "2025-03-15T08:30:00Z",
                credibility: 98.7
            },
            {
                title: "Quantum Radar Evades All Current Detection Systems",
                description: "Boeing's new stealth tech uses entangled photons to make aircraft invisible to conventional radar.",
                publishedAt: "2025-03-14T14:15:00Z",
                credibility: 95.2
            },
            {
                title: "Anti-Gravity Research Breakthrough at MIT",
                description: "Scientists achieve 5% mass reduction in controlled environment, paving way for gravity-defying aircraft.",
                publishedAt: "2025-03-13T11:45:00Z",
                credibility: 92.1
            },
            {
                title: "AI Air Traffic Control Handles 200% More Flights",
                description: "Google's DeepSky AI now manages all east-coast airspace with zero human intervention.",
                publishedAt: "2025-03-12T16:20:00Z",
                credibility: 97.3
            },
            {
                title: "Hypersonic Passenger Jets: NYC to Tokyo in 90 Minutes",
                description: "Boom Supersonic unveils Overture 2.0 with scramjet technology for commercial routes.",
                publishedAt: "2025-03-11T09:10:00Z",
                credibility: 96.5
            },
            {
                title: "Plasma Stealth Coating Cuts Fuel Use by 15%",
                description: "New ionized gas layer reduces drag while absorbing radar waves, dual benefit for military and commercial aviation.",
                publishedAt: "2025-03-10T13:30:00Z",
                credibility: 94.8
            }
        ];
    }
    
    renderNews() {
        this.newsGrid.innerHTML = this.articles.map(article => `
            <div class="news-card" data-credibility="${article.credibility}">
                <div class="news-header">
                    <h3>${article.title}</h3>
                    <span class="credibility">${article.credibility}% AI VERIFIED</span>
                </div>
                <p>${article.description}</p>
                <div class="news-footer">
                    <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                    <button class="news-ar" data-model="${article.title.split(' ')[0]}">
                        <i class="fas fa-vr-cardboard"></i> AR PREVIEW
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        document.getElementById('refreshNews').addEventListener('click', () => {
            this.loadNews();
        });
    }
}

// ===== NEURAL AI ASSISTANT =====
class NeuralAviationAssistant {
    constructor() {
        this.chatContainer = document.getElementById('aiDialog');
        this.queryInput = document.getElementById('aiQuery');
        this.sendButton = document.getElementById('neuralSubmit');
        this.voiceButton = document.getElementById('neuralVoice');
        this.quantumMode = document.getElementById('quantumMode');
        this.recognition = null;
        
        this.setupEventListeners();
        this.initVoiceRecognition();
    }
    
    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.processQuery());
        this.queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processQuery();
        });
        this.voiceButton.addEventListener('click', () => this.toggleVoiceRecognition());
    }
    
    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.queryInput.value = transcript;
                this.processQuery();
            };
            
            this.recognition.onerror = (event) => {
                console.error("Voice recognition error:", event.error);
                this.voiceButton.classList.remove('listening');
            };
        }
    }
    
    toggleVoiceRecognition() {
        if (!this.recognition) {
            alert("Voice recognition not supported in your browser");
            return;
        }
        
        if (this.voiceButton.classList.contains('listening')) {
            this.recognition.stop();
            this.voiceButton.classList.remove('listening');
        } else {
            this.recognition.start();
            this.voiceButton.classList.add('listening');
        }
    }
    
    async processQuery() {
        const query = this.queryInput.value.trim();
        if (!query) return;
        
        this.queryInput.value = '';
        this.addMessage(query, 'user');
        
        const response = await this.generateAIResponse(query);
        this.addMessage(response, 'ai');
    }
    
    async generateAIResponse(query) {
        // In production, connect to real AI API
        const isQuantum = this.quantumMode.checked;
        const knowledgeBase = {
            "quantum navigation": `Quantum navigation systems ${isQuantum ? 
                "use entangled atoms to maintain ±1cm accuracy globally without GPS. 2025 models achieve 0.1ns clock synchronization." : 
                "are the next generation of positioning technology."}`,
            "plasma stealth": `Plasma stealth coatings ${isQuantum ? 
                "ionize air molecules around the aircraft, absorbing 99.97% of radar waves while reducing drag by 12-15%." : 
                "help make aircraft harder to detect by radar."}`,
            "anti-gravity": `Current anti-gravity research ${isQuantum ? 
                "focuses on high-temperature superconductor arrays that can distort spacetime at 3% efficiency in lab conditions (Boeing Horizon Project)." : 
                "is exploring ways to reduce aircraft weight."}`
        };
        
        // Find the best matching topic
        let bestMatch = { topic: null, score: 0 };
        for (const [topic] of Object.entries(knowledgeBase)) {
            const score = this.calculateMatchScore(query.toLowerCase(), topic.toLowerCase());
            if (score > bestMatch.score) {
                bestMatch = { topic, score };
            }
        }
        
        if (bestMatch.score > 0.3) {
            return knowledgeBase[bestMatch.topic];
        } else {
            return isQuantum ? 
                "My quantum neural networks indicate this topic requires more specific parameters. Please refine your query about aviation technology." :
                "I'm not sure about that. Ask me about quantum navigation, plasma stealth, or anti-gravity research.";
        }
    }
    
    calculateMatchScore(query, topic) {
        const queryWords = query.split(' ');
        const topicWords = topic.split(' ');
        
        let score = 0;
        for (const qWord of queryWords) {
            for (const tWord of topicWords) {
                if (qWord.includes(tWord) || tWord.includes(qWord)) {
                    score += 1;
                }
            }
        }
        
        return score / Math.max(queryWords.length, topicWords.length);
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-meta">
                <span>${new Date().toLocaleTimeString()}</span>
                ${sender === 'ai' ? '<span>NEURAL NETWORK</span>' : ''}
            </div>
        `;
        
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
}

// ===== HYPERSONIC SIMULATOR =====
class HypersonicSimulator {
    constructor() {
        this.simulator = document.getElementById('hypersonicSim');
        this.canvas = document.getElementById('simulatorCanvas');
        this.velocityDisplay = document.getElementById('simVelocity');
        this.tempDisplay = document.getElementById('simTemp');
        this.throttle = 0;
        this.velocity = 0;
        this.surfaceTemp = -50;
        
        this.initThreeJS();
        this.setupEventListeners();
    }
    
    initThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        
        // Add stars background
        const starsGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            starVertices.push(
                THREE.MathUtils.randFloatSpread(2000),
                THREE.MathUtils.randFloatSpread(2000),
                THREE.MathUtils.randFloatSpread(2000)
            );
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
        
        // Add aircraft model (simplified)
        const geometry = new THREE.ConeGeometry(5, 20, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00aaff,
            emissive: 0xff5500,
            emissiveIntensity: 0.2
        });
        this.aircraft = new THREE.Mesh(geometry, material);
        this.scene.add(this.aircraft);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        this.camera.position.z = 50;
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update aircraft position based on velocity
        this.aircraft.position.x += this.velocity * 0.01;
        
        // Rotate stars for motion effect
        this.scene.children[0].rotation.y -= 0.0005 * this.velocity;
        
        // Update temperature effect
        if (this.velocity > 2000) {
            const heatIntensity = Math.min(1, (this.velocity - 2000) / 3000);
            this.aircraft.material.emissiveIntensity = heatIntensity * 2;
            
            // Add heat distortion
            if (!this.heatDistortion) {
                this.createHeatDistortion();
            }
        } else {
            this.aircraft.material.emissiveIntensity = 0.2;
            if (this.heatDistortion) {
                this.scene.remove(this.heatDistortion);
                this.heatDistortion = null;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    createHeatDistortion() {
        const distortionGeometry = new THREE.SphereGeometry(15, 32, 32);
        const distortionMaterial = new THREE.MeshBasicMaterial({
            color: 0xff5500,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        this.heatDistortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
        this.heatDistortion.position.copy(this.aircraft.position);
        this.scene.add(this.heatDistortion);
    }
    
    updateThrottle(change) {
        this.throttle = Math.max(0, Math.min(100, this.throttle + change));
        this.calculatePhysics();
    }
    
    calculatePhysics() {
        // Simplified hypersonic physics
        const targetVelocity = this.throttle * 70; // Max 7000 m/s (Mach 20)
        this.velocity += (targetVelocity - this.velocity) * 0.05;
        
        // Calculate surface temperature (simplified)
        this.surfaceTemp = -50 + Math.pow(this.velocity / 100, 2);
        
        // Update displays
        this.velocityDisplay.textContent = `${Math.round(this.velocity)} m/s (Mach ${(this.velocity / 343).toFixed(1)})`;
        this.tempDisplay.textContent = `${Math.round(this.surfaceTemp)}°C`;
    }
    
    setupEventListeners() {
        document.getElementById('launchSimulator').addEventListener('click', () => {
            this.simulator.style.display = 'flex';
        });
        
        document.getElementById('closeSimulator').addEventListener('click', () => {
            this.simulator.style.display = 'none';
        });
        
        document.getElementById('increaseThrottle').addEventListener('click', () => {
            this.updateThrottle(10);
        });
        
        document.getElementById('decreaseThrottle').addEventListener('click', () => {
            this.updateThrottle(-10);
        });
    }
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    new QuantumFlightTracker();
    new AINews2025();
    new NeuralAviationAssistant();
    new HypersonicSimulator();
    
    // Initialize particle background
    particlesJS.load('particles-js', 'particles-config.json');
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggle.innerHTML = document.body.classList.contains('light-mode') ? 
            '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
    
    // AR button
    document.getElementById('arButton').addEventListener('click', () => {
        alert("In a full implementation, this would launch WebXR for AR aircraft viewing");
    });
});
