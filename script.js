// --- MOBILE MENU TOGGLE ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const body = document.body;

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        // Toggle Active Class
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Icon Toggle
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}

// --- THREE.JS SETUP (VISIBILITY BOOSTED) ---
const canvasContainer = document.getElementById('canvas-container');

if (canvasContainer) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();

    // INCREASED PARTICLE COUNT FOR VISIBILITY
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 1200 : 2500;

    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // INCREASED SIZE AND OPACITY
    const material = new THREE.PointsMaterial({
        size: 0.025, // Bigger dots
        color: 0xccff00, // Pure Neon Green
        transparent: true,
        opacity: 1.0, // Fully opaque material (controlled by container opacity)
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX);
            mouseY = (event.touches[0].clientY - windowHalfY);
        }
    }, { passive: true });

    const clock = new THREE.Clock();

    const tick = () => {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = 0.05 * elapsedTime;
        particlesMesh.rotation.x = 0.02 * elapsedTime;
        particlesMesh.rotation.y += 0.5 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- CURSOR LOGIC ---
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        });
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        });
    }
}

// --- GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

if (document.querySelector(".hero-text")) {
    const tl = gsap.timeline();
    tl.from(".hero-text", { y: 50, opacity: 0, duration: 1, ease: "power4.out", delay: 0.2 })
        .from(".hero-subtext", { y: 20, opacity: 0, duration: 0.8, stagger: 0.2 }, "-=0.5")
        .from(".hero-image-wrapper", { x: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=1");
}

if (document.querySelector(".bento-card")) {
    gsap.utils.toArray('.bento-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top 85%" },
            y: 50, opacity: 0, duration: 0.8, ease: "power2.out"
        });
    });
}

if (document.querySelector(".timeline-item")) {
    gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 80%" },
            x: -20, opacity: 0, duration: 0.6, ease: "power2.out"
        });
    });
}