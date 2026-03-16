document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration & Elements ---
    const scenes = {
        matrix: document.getElementById('scene-matrix'),
        bear: document.getElementById('scene-bear'),
        card: document.getElementById('scene-card'),
        final: document.getElementById('scene-final')
    };

    const neonTextEl = document.getElementById('neon-text');
    const textSequence = ['3', '2', '1', 'HAPPY', 'BIRTHDAY', 'TO', 'GUMYY'];
    let textIndex = 0;

    // --- Timing Configuration (ms) ---
    const textInterval = 1200; // time per word
    const scene2Delay = textSequence.length * textInterval + 1000;
    const scene3Delay = scene2Delay + 4000;
    // The rest is triggered by user interaction

    // --- Start Sequence ---
    initMatrix();
    startTextAnimation();

    setTimeout(() => {
        transitionToScene(scenes.matrix, scenes.bear);
        createStars('stars-container');
    }, scene2Delay);

    setTimeout(() => {
        transitionToScene(scenes.bear, scenes.card);
        createStars('stars-container-2');
    }, scene3Delay);

    // --- Scene Transition Function ---
    function transitionToScene(oldScene, newScene) {
        oldScene.classList.remove('active');
        newScene.classList.add('active');
    }

    // --- Text Animation Logic ---
    function startTextAnimation() {
        const showNextText = () => {
            if (textIndex < textSequence.length) {
                // Hide current
                neonTextEl.classList.remove('show');

                setTimeout(() => {
                    // Update and show next
                    neonTextEl.textContent = textSequence[textIndex];
                    neonTextEl.classList.add('show');
                    textIndex++;
                }, 300); // Wait for fade out

                setTimeout(showNextText, textInterval);
            }
        };
        setTimeout(showNextText, 500); // Initial delay
    }

    // --- Matrix Rain Effect ---
    function initMatrix() {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            // Translucent black background to create trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Pink neon text color
            ctx.fillStyle = '#ff00ff';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(draw, 30);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // --- Starry Sky Generator ---
    function createStars(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; // clear if existing
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            let star = document.createElement('div');
            star.classList.add('star');

            // Random properties
            let size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            star.style.animationDelay = (Math.random() * 2) + 's';

            container.appendChild(star);
        }
    }

    // --- Interactive Book Logic ---
    const bookContainer = document.getElementById('birthday-book');
    const leaf1 = document.getElementById('leaf-1');
    const leaf2 = document.getElementById('leaf-2');
    const leaf3 = document.getElementById('leaf-3');
    let bookState = 0; // 0: closed, 1: leaf1 flipped, 2: leaf2 flipped, 3: leaf3 flipped, 4: final

    if (bookContainer) {
        bookContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.tap-target');
            if (!target) return;

            if (bookState === 0 && target.id === 'cover-tap') {
                // Tap 1: Open cover (flip leaf 1)
                bookContainer.classList.add('book-is-open');
                leaf1.classList.add('flipped');
                bookState = 1;

            } else if (bookState === 1 && target.id === 'page-1-tap') {
                // Tap 2: Turn to Spread 2 (flip leaf 2)
                leaf2.classList.add('flipped');
                bookState = 2;

            } else if (bookState === 2 && target.id === 'page-2-tap') {
                // Tap 3: Turn to Message (flip leaf 3) - closing the book to the back cover
                leaf3.classList.add('flipped');
                bookContainer.classList.remove('book-is-open');
                bookContainer.classList.add('book-is-closed-back');
                bookState = 3;

            } else if (bookState === 3 && target.id === 'message-tap') {
                // Tap 4: Transition to final scene
                bookState = 4;
                bookContainer.classList.remove('book-is-closed-back');
                
                setTimeout(() => {
                    transitionToScene(scenes.card, scenes.final);
                    createStars('stars-container-3');
                    buildHeart();
                }, 800);
            }
        });
    }

    // --- Final Heart Formation ---
    function buildHeart() {
        const container = document.getElementById('heart-formation');
        // Define points for a heart shape using parametric equation
        const numPoints = 60; // More points for a larger heart
        const scale = window.innerWidth < 600 ? 12 : 16;

        for (let i = 0; i < numPoints; i++) {
            let t = i * (Math.PI * 2) / numPoints;
            // Heart Equation
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            // Scale points
            x *= scale;
            y *= scale;

            let piece = document.createElement('img');
            piece.src = `corazon${i + 1}.jpg`; // Archivos: corazon1.jpg a corazon60.jpg
            piece.alt = `Pieza del corazón ${i + 1}`;
            piece.classList.add('heart-piece');
            
            // Random start position outside the screen
            let angle = Math.random() * Math.PI * 2;
            let distance = Math.max(window.innerWidth, window.innerHeight);
            let startX = Math.cos(angle) * distance;
            let startY = Math.sin(angle) * distance;

            piece.style.setProperty('--start-x', startX + 'px');
            piece.style.setProperty('--start-y', startY + 'px');
            piece.style.setProperty('--end-x', x + 'px');
            piece.style.setProperty('--end-y', y + 'px');
            
            // Random rotation
            let rot = Math.random() * 360 - 180;
            piece.style.setProperty('--rot', rot);

            // Optional: fallback color if the image is missing
            piece.style.backgroundColor = '#ff00ff';
            piece.style.objectFit = 'cover';

            container.appendChild(piece);

            // Animate in with delay
            setTimeout(() => {
                piece.classList.add('show');
            }, i * 40 + 100);
        }

        // Trigger heartbeat and center text after all pieces are in place
        const totalAnimationTime = (numPoints - 1) * 40 + 100 + 1500; // delay of last piece + transition duration
        setTimeout(() => {
            container.classList.add('beating');
            const centerContent = document.getElementById('heart-center-content');
            if (centerContent) {
                centerContent.classList.add('show');
            }
        }, totalAnimationTime);
    }
});
