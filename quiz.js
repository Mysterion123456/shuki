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
    }, delay + 500);
}

function showFinalCard() {
    gameArea.innerHTML = `
        <div class="final-card">
            <h1>❤️ TEST PASSED! ❤️</h1>
            <p>I'm picking you up at 21:00.</p>
            <p>Dress nicely.</p>
            <br>
            <p style="font-size: 0.8rem; color: #ff00ff;">SESSION TERMINATED. LOVE IS ACTIVE.</p>
        </div>
    `;

    // Optional: Confetti Effect via simple CSS/JS or just generic celebration
}

// Start
setTimeout(() => {
    loadQuestion(0);
}, 1000);
