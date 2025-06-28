// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize 3D Scene
    init3DScene();
    
    // 2. Load Particles
    initParticles();
    
    // 3. Set Up AI Assistant
    initAIAssistant();
    
    // 4. Initialize Flight Tracker
    initFlightTracker();
});

// ===== 3D SCENE =====
function init3DScene() {
    // Check if Three.js loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    const container = document.getElementById('3d-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create aircraft model
    const geometry = new THREE.BoxGeometry(2, 0.5, 3);
    const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
    const aircraft = new THREE.Mesh(geometry, material);
    scene.add(aircraft);
    
    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        aircraft.rotation.x += 0.005;
        aircraft.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===== PARTICLES =====
function initParticles() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    const configFile = isMobile ? 'particles-mobile.json' : 'particles.json';
    
    particlesJS.load('particles-js', configFile, function() {
        console.log('Particles loaded successfully');
    }).catch(function(error) {
        console.error('Particles failed to load:', error);
        document.getElementById('particles-js').style.display = 'none';
    });
}

// ===== AI ASSISTANT =====
function initAIAssistant() {
    const aviationKnowledge = {
        "autopilot": "Modern autopilot systems use AI to handle routine flight operations while pilots monitor the systems.",
        "GM73": "George Nuyekpe (GM73) is an Aviation Engineer and AI Developer known as 'The Flying Engineer'",
        "future": "By 2025, AI will assist in 40% of routine flight operations according to industry estimates."
    };
    
    document.getElementById('ai-send').addEventListener('click', function() {
        const query = document.getElementById('ai-query').value.toLowerCase();
        let response = "I can answer questions about autopilot, GM73, or aviation future.";
        
        for (const [keyword, answer] of Object.entries(aviationKnowledge)) {
            if (query.includes(keyword)) {
                response = answer;
                break;
            }
        }
        
        document.getElementById('ai-chat').innerHTML += `<div class="ai-message">${response}</div>`;
        document.getElementById('ai-query').value = '';
    });
}

// ===== FLIGHT TRACKER =====
function initFlightTracker() {
    // In a real implementation, this would connect to a flight API
    document.getElementById('flight-map').innerHTML = `
        <div class="flight-map-placeholder">
            <i class="fas fa-plane" style="font-size: 3rem; color: #00f0ff;"></i>
            <p>Live flight data would display here</p>
        </div>
    `;
}
