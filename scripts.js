// Screen Elements
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');

// Buttons & Interactables
const startBtn = document.getElementById('startBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const catContainer = document.getElementById('catContainer');
const catBubble = document.getElementById('catBubble'); 

const envelopeContainer = document.getElementById('envelopeContainer');
const tooltip = document.getElementById('tooltip');
const letterPaper = document.getElementById('letterPaper');
const typewriterText = document.getElementById('typewriterText');
const signature = document.getElementById('signature');
const heartPhoto = document.getElementById('heartPhoto');

// Variables for state
let catIndex = 1;
let catTimer;
let isTyping = false;
let isEnvelopeClickable = false; // Lock the envelope initially!

// The Random Sad Texts Array
const sadTexts = [
    "දුක දුක දුක 😫",
    "ඇයි ඔයා මේම 😭",
    "මං තරහයි ඈ 😭💔",
    "මොකද අනී 🥺",
    "ඈ 😭"
];

// Letter text array
const noteLines = [
    Array.from("I love you මගෙ මැණිකේ 😚❤️"),
    Array.from("උම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්ම්මා"),
    Array.from("මං ඔයාට ගොඩක් ගොඩාක් ගොඩාරියක් ආදරෙයි ❤️🫂")
];

// Switch from Landing to Question
startBtn.addEventListener('click', () => {
    screen1.classList.remove('active');
    screen1.classList.add('hidden');
    screen2.classList.remove('hidden');
    screen2.classList.add('active');
});

// "No" Button Logic
function evadeAndShowCat(e) {
    if (e) e.preventDefault(); 

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const rect = noBtn.getBoundingClientRect();
    const maxJump = 150; 

    // Generate random jump distance
    let offsetX = (Math.random() * maxJump * 2) - maxJump;
    let offsetY = (Math.random() * maxJump * 2) - maxJump;

    // Calculate new button positions
    let newX = rect.left + offsetX;
    let newY = rect.top + offsetY;

    // Keep button securely inside the screen boundaries
    newX = Math.max(20, Math.min(newX, windowWidth - btnWidth - 20));
    newY = Math.max(20, Math.min(newY, windowHeight - btnHeight - 20));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    noBtn.style.transform = 'none'; 

    // Position GIF right above the button
    const gifSize = 115; 
    let gifX = newX + (btnWidth / 2) - (gifSize / 2); 
    let gifY = newY - gifSize - 10; 
    
    // Make sure we leave 50px of space at the TOP and RIGHT so the bubble never gets cut off
    gifX = Math.max(10, Math.min(gifX, windowWidth - gifSize - 50));
    gifY = Math.max(50, Math.min(gifY, windowHeight - gifSize - 10));

    catContainer.style.left = `${gifX}px`;
    catContainer.style.top = `${gifY}px`;

    clearTimeout(catTimer); 
    catContainer.classList.remove('cat-visible');
    
    setTimeout(() => {
        // Hide all cats
        document.querySelectorAll('.cat-frame').forEach(cat => cat.classList.remove('active-frame'));
        
        // Show the correct cat instantly
        document.getElementById(`cat${catIndex}`).classList.add('active-frame');
        
        // Pick a random text and put it in the bubble
        const randomMessage = sadTexts[Math.floor(Math.random() * sadTexts.length)];
        catBubble.innerText = randomMessage;

        // Make container and bubble visible
        catContainer.classList.add('cat-visible');
        
        // Advance counter
        catIndex++;
        if (catIndex > 5) catIndex = 1; 

        catTimer = setTimeout(() => {
            catContainer.classList.remove('cat-visible');
        }, 3000);
    }, 50);
}

noBtn.addEventListener('touchstart', evadeAndShowCat, { passive: false });
noBtn.addEventListener('click', evadeAndShowCat); 

// Switch from Question to Envelope
yesBtn.addEventListener('click', () => {
    screen2.classList.remove('active');
    screen2.classList.add('hidden');
    screen3.classList.remove('hidden');
    screen3.classList.add('active');

    setTimeout(() => {
        envelopeContainer.classList.add('envelope-enter');
    }, 50);

    // Show tooltip and ONLY THEN make the envelope clickable
    setTimeout(() => {
        tooltip.classList.remove('hidden-tooltip');
        isEnvelopeClickable = true; // Unlock the envelope!
    }, 1050);
});

// Envelope Click Logic
envelopeContainer.addEventListener('click', () => {
    if (!isEnvelopeClickable) return; // Prevent clicks if bubble hasn't loaded yet
    if (isTyping) return; 
    
    // Softly fade out envelope
    envelopeContainer.classList.add('envelope-hidden');
    
    // Wait for envelope fade, then show letter softly
    setTimeout(() => {
        envelopeContainer.style.display = 'none';
        
        letterPaper.classList.remove('letter-hidden');
        letterPaper.classList.add('letter-prep');
        
        setTimeout(() => {
            letterPaper.classList.add('letter-visible');
        }, 50);

        // Start typing and bounce in the heart photo
        setTimeout(() => {
            heartPhoto.classList.add('heart-visible');
            startTypewriter();
        }, 800);

    }, 800);
});

// Typewriter Animation 
function startTypewriter() {
    isTyping = true;
    let lineIndex = 0;
    let charIndex = 0;

    function type() {
        if (lineIndex < noteLines.length) {
            if (charIndex < noteLines[lineIndex].length) {
                typewriterText.innerHTML += noteLines[lineIndex][charIndex];
                charIndex++;
                setTimeout(type, 80); 
            } else {
                typewriterText.innerHTML += "<br>";
                lineIndex++;
                charIndex = 0;
                setTimeout(type, 600); 
            }
        } else {
            // Remove cursor
            document.getElementById('cursor').style.display = 'none';
            // Fade in the signature on the bottom right
            signature.classList.add('signature-visible');
        }
    }
    type();
}