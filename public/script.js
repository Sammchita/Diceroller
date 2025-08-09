
function rollDice(numDice, forcedValue = null) {
    const diceImage = document.getElementById('diceImage');
    const rollSound = document.getElementById('rollSound');
    const resultElement = document.getElementById('result');
    let rolledValues = [];

    // Play sound
    rollSound.currentTime = 0;
    rollSound.play();

    for (let i = 0; i < numDice; i++) {
        let diceRoll = forcedValue ? forcedValue : Math.floor(Math.random() * 6) + 1;
        rolledValues.push(diceRoll);
    }

    // Animate dice image
    diceImage.classList.remove('rolling');
    void diceImage.offsetWidth;
    diceImage.classList.add('rolling');

    // Highlight rolled dice in dice-images row
    const diceImgs = document.querySelectorAll('.dice-img');
    diceImgs.forEach(img => img.classList.remove('highlight'));
    rolledValues.forEach(val => {
        if (diceImgs[val-1]) diceImgs[val-1].classList.add('highlight');
    });

    // Update the dice image to show the last rolled value after animation
    setTimeout(() => {
        diceImage.src = `images1/${rolledValues[rolledValues.length - 1]}.png`;
        diceImage.classList.remove('rolling');
    }, 500);

    // Prepare the result string
    let results = rolledValues.join(', ');
    resultElement.textContent = `You rolled: ${results}`;

    // Confetti effect if 6 is rolled
    if (rolledValues.includes(6)) {
        launchConfetti();
    }
}

// Roll button event
document.getElementById('rollButton').addEventListener('click', function() {
    const numDice = parseInt(document.getElementById('numDice').value);
    rollDice(numDice);
});

// Click on dice images to roll that value
document.querySelectorAll('.dice-img').forEach((img, idx) => {
    img.addEventListener('click', () => {
        rollDice(1, idx + 1);
    });
});

// Confetti effect (simple canvas confetti)
function launchConfetti() {
    if (document.getElementById('confetti-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let confetti = [];
    for (let i = 0; i < 80; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: Math.random() * 8 + 4,
            d: Math.random() * 80 + 40,
            color: `hsl(${Math.random()*360},90%,60%)`,
            tilt: Math.random() * 10 - 10
        });
    }
    let angle = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        angle += 0.01;
        for (let i = 0; i < confetti.length; i++) {
            let c = confetti[i];
            c.y += (Math.cos(angle + c.d) + 3 + c.r/2) * 0.8;
            c.x += Math.sin(angle) * 2;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
            ctx.fillStyle = c.color;
            ctx.fill();
        }
        confetti = confetti.filter(c => c.y < canvas.height + 20);
        if (confetti.length > 0) {
            requestAnimationFrame(draw);
        } else {
            document.body.removeChild(canvas);
        }
    }
    draw();
}
