const gameArea = document.getElementById('game-area');
const terminalBody = document.getElementById('terminal-body');

const quizData = [
    {
        question: "1. Security Questions // IDENTIFY_COOKING_SKILL",
        text: "Who cooks better? 🍳",
        options: ["Noam", "You (My Valentine)"], // Removed "Me"
        correct: -1 // Both correct
    },
    {
        question: "2. Memory Access // FIRST_DATE_LOCATOR",
        text: "Where was our first date? 🥂",
        options: ["Coffee Shop - Barbarini", "The Beach", "Beit Asis", "Bhad 15"], // Updated options
        correct: 0 // Assuming Barbarini is correct, defaulting to first
    },
    {
        question: "3. Heart Rate Analysis // LOVE_MEASUREMENT",
        text: "How much do I love you? 📏",
        options: ["A lot", "Infinity", "To the moon", "מפה עד לירח בחזקה אינסוף"], // Specific Hebrew answer
        correct: 3,
        isTricky: false // Removed tricky behavior
    }
];

let currentStep = 0;

function typeWriter(text, element, speed = 30) {
    return new Promise(resolve => {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                terminalBody.scrollTop = terminalBody.scrollHeight;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

async function loadQuestion(index) {
    gameArea.innerHTML = ''; // clear previous options but keep history in 'output' if we wanted, but let's clear for cleaner view

    const qBlock = document.createElement('div');
    qBlock.classList.add('question-block');

    // Terminal Header for Question
    const header = document.createElement('div');
    header.style.direction = 'ltr';
    header.style.marginBottom = '10px';
    header.style.color = '#d63384';
    header.innerText = `> EXECUTING: ${quizData[index].question}`;
    qBlock.appendChild(header);

    // Question Text
    const qText = document.createElement('div');
    qText.classList.add('question-text');
    qText.innerText = quizData[index].text;
    qBlock.appendChild(qText);

    gameArea.appendChild(qBlock);

    // Render Options
    quizData[index].options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(i, index);

        // Tricky Logic
        if (quizData[index].isTricky && i !== quizData[index].correct) {
            btn.addEventListener('mouseover', (e) => {
                const x = (Math.random() - 0.5) * 200;
                const y = (Math.random() - 0.5) * 50;
                btn.style.transform = `translate(${x}px, ${y}px)`;
                btn.style.borderColor = 'red';
                btn.style.color = 'red';
            });
        }

        gameArea.appendChild(btn);
    });

    // Helper Logic (Dustin & Dog & Luna)
    const dog = document.getElementById('dog-container');
    const dustin = document.getElementById('dustin-container');
    const luna = document.getElementById('luna-container');

    // Reset all
    dog.classList.remove('show');
    dustin.classList.remove('show');
    luna.classList.remove('show');

    if (index === 0) { // First Question -> Dustin (Left)
        setTimeout(() => {
            dustin.classList.add('show');
        }, 500);
    } else if (index === 1) { // Second Question -> Dog (Right)
        setTimeout(() => {
            dog.classList.add('show');
        }, 500);
    } else if (index === 2) { // Third Question -> Luna (Right)
        setTimeout(() => {
            luna.classList.add('show');
        }, 500);
    }
}

function handleAnswer(choiceIndex, attemptIndex) {
    const q = quizData[attemptIndex];
    const btns = document.querySelectorAll('.option-btn');

    // Normal Check (Tricky removed)
    if (q.correct === -1 || choiceIndex === q.correct) {
        // Correct
        const feedback = document.createElement('p');
        feedback.style.color = '#27c93f';
        feedback.direction = 'ltr';
        feedback.innerText = `> IDENTITY VERIFIED. [ACCESS_TOKEN_${attemptIndex}_GRANTED]`;
        gameArea.appendChild(feedback);

        currentStep++;
        setTimeout(() => {
            if (currentStep < quizData.length) {
                loadQuestion(currentStep);
            } else {
                successSequence();
            }
        }, 1000);

    } else {
        // Wrong
        btns[choiceIndex].classList.add('error');
        btns[choiceIndex].innerText += " [ACCESS DENIED]";
        setTimeout(() => btns[choiceIndex].classList.remove('error'), 500);
    }
}

function successSequence() {
    gameArea.innerHTML = '';
    const terminal = document.querySelector('.terminal-container');

    // Force Hide helpers immediately
    const resetHelpers = () => {
        document.getElementById('dog-container').classList.remove('show');
        document.getElementById('dustin-container').classList.remove('show');
        document.getElementById('luna-container').classList.remove('show');
    };
    resetHelpers();

    const lines = [
        "> ALL SECURITY CHECKS PASSED.",
        "> HEART_FIREWALL STATUS: INACTIVE FOR YOU.",
        "> EXECUTING: sudo download_reverse_shell_to_my_heart.sh",
        "> [||||||||||||||||||] 100%",
        "> ACCESS GRANTED."
    ];

    let delay = 0;
    lines.forEach(line => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.innerText = line;
            p.style.color = '#27c93f';
            gameArea.appendChild(p);
        }, delay);
        delay += 800;
    });

    setTimeout(() => {
        showFinalCard();
        playMusic();
        startConfetti();
    }, delay + 500);
}

function showFinalCard() {
    // Add GIF to bottom right corner
    const gif = document.createElement('img');
    gif.src = 'assets/tenor.gif';
    gif.alt = 'Volume';
    gif.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 100px; z-index: 100000; border-radius: 10px; box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);';
    document.body.appendChild(gif);

    gameArea.innerHTML = `
        <div class="final-card">
            <h1>❤️ TEST PASSED! ❤️</h1>
            <p>I'm picking you up at 21:00.</p>
            <p>Dress nicely.</p>
            <br>
            <p style="font-size: 0.8rem; color: #ff00ff;">SESSION TERMINATED. LOVE IS ACTIVE.</p>
        </div>
    `;
}

// Audio Logic
function playMusic() {
    const audio = new Audio('assets/song.mp3');
    audio.volume = 0.4;
    audio.currentTime = 53; // Start at 0:53
    audio.play().catch(e => console.log("Audio play failed (user interaction needed?):", e));

    audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= 72) { // End at 1:12 (72s)
            audio.currentTime = 53;
            audio.play();
        }
    });
}

// Confetti Logic
function startConfetti() {
    // Simple canvas confetti implementation
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '99999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff00ff', '#d63384', '#ffffff', '#ff69b4'];

    for (let i = 0; i < 150; i++) { // Reduced from 300
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 2 + 1, // Slower (was 3+2)
            speedX: Math.random() * 2 - 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 2;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Start
setTimeout(() => {
    loadQuestion(0);
}, 1000);
