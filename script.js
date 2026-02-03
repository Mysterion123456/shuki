document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    const container = document.querySelector('.hearts-container');

    // Custom Cursor Movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 1. Floating Hearts (Upwards)
    const createHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // 3-5s
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    };

    // 2. Side Floating Photos
    const createSidePhoto = () => {
        const photos = [
            'photo1.jpg',
            'photo2.jpg',
            'photo3.jpg',
            'photo4.jpg',
            'photo5.jpg'
        ];
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

        const photo = document.createElement('img');
        photo.src = `assets/${randomPhoto}`;
        photo.classList.add('side-photo');

        // Random size
        const size = Math.random() * 60 + 40; // 40-100px
        photo.style.width = `${size}px`;
        photo.style.height = `${size}px`;

        // Random vertical position
        photo.style.top = Math.random() * 80 + 10 + 'vh'; // Avoid very top/bottom edge

        // Random direction (Left to Right OR Right to Left)
        const isMovingRight = Math.random() > 0.5;

        if (isMovingRight) {
            photo.style.animation = `moveRight ${Math.random() * 5 + 5}s linear forwards`;
        } else {
            photo.style.animation = `moveLeft ${Math.random() * 5 + 5}s linear forwards`;
        }

        document.body.appendChild(photo);

        setTimeout(() => {
            photo.remove();
        }, 11000);
    };

    // Start intervals
    setInterval(createHeart, 300);       // Lots of hearts
    setInterval(createSidePhoto, 800);   // Photos every 0.8 seconds

    // 3. Button Interactions
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    yesBtn.addEventListener('click', () => {
        // Redirect to the Hacker Quiz
        window.location.href = 'quiz.html';
    });

    // --- No Button Logic (Preserved & Adjusted) ---
    let noClickCount = 0;
    let noScale = 1;
    const overlay = document.getElementById('overlay');
    const overlayImg = document.getElementById('overlay-img');
    const overlayText = document.getElementById('overlay-text');

    // Move No Button Randomly (but smooth)
    const moveNoButton = (e) => {
        const mouseX = e ? e.clientX : window.innerWidth / 2;
        const mouseY = e ? e.clientY : window.innerHeight / 2;

        let x, y, dist;
        // Try to find a spot far from the mouse
        do {
            x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
            y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

            // Calculate distance from mouse to new spot
            const dx = x - mouseX;
            const dy = y - mouseY;
            dist = Math.sqrt(dx * dx + dy * dy);
        } while (dist < 300);

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    }

    noBtn.addEventListener('mouseover', moveNoButton);

    noBtn.addEventListener('click', (e) => {
        noClickCount++;
        noScale = Math.max(0.2, noScale - 0.02);
        noBtn.style.transform = `scale(${noScale})`;

        moveNoButton(e);

        if (noClickCount > 34) {
            // Trigger Sequence
            overlay.classList.remove('hidden');
            overlayImg.src = 'assets/please.jpg';
            overlayImg.style.display = 'block';
            overlayText.textContent = ''; // Clear text initially

            // 1. Show Photo for 3 seconds
            setTimeout(() => {
                // 2. Show Text "Again" for 2 seconds
                overlayImg.style.display = 'none';
                overlayText.textContent = 'Again...';

                setTimeout(() => {
                    // 3. Reset Page
                    overlay.classList.add('hidden');
                    noClickCount = 0;
                    noScale = 1;
                    noBtn.style.transform = 'scale(1)';
                    // Reset No button position to relative/initialish or just somewhere center
                    noBtn.style.position = 'relative';
                    noBtn.style.left = 'auto';
                    noBtn.style.top = 'auto';
                }, 2000); // 2 seconds text

            }, 3000); // 3 seconds photo
        }
    });
});
