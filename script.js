// ======================
// 3D COCKPIT VISUALIZATION
// ======================
function init3DCockpit() {
    try {
        // Check if Three.js is loaded
        if (!THREE) throw new Error("Three.js not loaded!");
        
        const container = document.getElementById('cockpit-3d');
        if (!container) return;

        // Setup scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Add lighting
        const light = new THREE.AmbientLight(0x404040);
        scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Load cockpit model (simplified version)
        const geometry = new THREE.BoxGeometry(2, 1, 3);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x1a2b3c,
            specular: 0x64ffda,
            shininess: 100 
        });
        const cockpit = new THREE.Mesh(geometry, material);
        scene.add(cockpit);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            cockpit.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

    } catch (error) {
        console.error("3D Error:", error);
        // Fallback to static image
        document.getElementById('cockpit-3d').innerHTML = '<img src="assets/fallback-cockpit.jpg" alt="Cockpit">';
    }
}

// ======================
// VOICE COMMAND SYSTEM
// ======================
function setupVoiceControls() {
    const voiceBtn = document.getElementById('voice-command');
    if (!voiceBtn) return;

    voiceBtn.onclick = () => {
        try {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                if(command.includes('takeoff')) {
                    document.getElementById('typewriter').textContent = "Preparing for takeoff...";
                }
            };
            
            recognition.start();
        } catch (e) {
            alert("Voice commands not supported in your browser");
        }
    };
}

// ======================
// MOBILE GESTURES
// ======================
function setupMobileGestures() {
    if (!/Android|iPhone/i.test(navigator.userAgent)) return;

    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, false);

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            // Swipe left - navigate next
            window.location.href = 'posts/neural-flight.html';
        }
    }, false);
}

// ======================
// INITIALIZE EVERYTHING
// ======================
document.addEventListener('DOMContentLoaded', () => {
    init3DCockpit();
    setupVoiceControls();
    setupMobileGestures();
    
    // Typewriter effect
    const phrases = ["AI Aviation Lab", "Future Cockpit Tech", "By GM73"];
    let i = 0, j = 0, currentPhrase = [];
    const typewriter = document.getElementById('typewriter');
    
    function type() {
        if (i < phrases.length) {
            if (j < phrases[i].length) {
                currentPhrase.push(phrases[i][j]);
                typewriter.textContent = currentPhrase.join('');
                j++;
                setTimeout(type, 100);
            } else {
                setTimeout(erase, 1500);
            }
        }
    }
    type();
});
