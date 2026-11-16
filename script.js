
// Music and navigation buttons
const birthdayMusic = document.getElementById("birthdayMusic");

const continueButton = document.getElementById("continueButton");
const playGameButton = document.getElementById("playGameButton");
const heartsGameButton = document.getElementById("heartsGame");
const backToLobbyButton = document.getElementById("backToLobby");

// Screens
const screen1 = document.querySelector(".welcome-screen");
const screen2 = document.getElementById("screen2");
const gameLobby = document.getElementById("gameLobby");
const heartsGameScreen = document.getElementById("heartsGameScreen");

// Screen 1 → Screen 2
continueButton.addEventListener("click", async function () {
    try {
        await birthdayMusic.play();
    } catch (error) {
        console.log("Music could not start:", error);
    }

    screen1.style.display = "none";
    screen2.style.display = "flex";
});

// Screen 2 → Game Lobby
playGameButton.addEventListener("click", function () {
    screen2.style.display = "none";
    gameLobby.style.display = "flex";
});

// Game Lobby → Catch the Hearts
heartsGameButton.addEventListener("click", function () {
    gameLobby.style.display = "none";
    heartsGameScreen.style.display = "flex";
});

// Catch the Hearts → Game Lobby
backToLobbyButton.addEventListener("click", function() {
    heartsGameScreen.style.display = "none";
    gameLobby.style.display = "flex";
});


 // CATCH THE HEARTS GAME

const startHeartsGame = document.getElementById("startHeartsGame");
const movingHeart = document.getElementById("movingHeart");
const heartPlayArea = document.getElementById("heartPlayArea");
const heartScoreDisplay = document.getElementById("heartScore");
const heartTimerDisplay = document.getElementById("heartTimer");
const heartInstructions = document.getElementById("heartInstructions");
const heartResult = document.getElementById("heartResult");

let heartScore = 0;
let heartTime = 30;
let heartInterval = null;
let gameRunning = false;

function moveHeart() {
    const maxX = heartPlayArea.clientWidth - movingHeart.offsetWidth;
    const maxY = heartPlayArea.clientHeight - movingHeart.offsetHeight;

    const randomX = Math.random() * Math.max(0, maxX);
    const randomY = Math.random() * Math.max(0, maxY);

    movingHeart.style.left = randomX + "px";
    movingHeart.style.top = randomY + "px";
}

startHeartsGame.addEventListener("click", function() {
    clearInterval(heartInterval);

    heartScore = 0;
    heartTime = 30;
    gameRunning = true;

    heartScoreDisplay.textContent = heartScore;
    heartTimerDisplay.textContent = heartTime;
    heartResult.textContent = "";

    heartInstructions.style.display = "none";
    movingHeart.style.display = "block";

    startHeartsGame.textContent = "PLAYING...";
    startHeartsGame.disabled = true;

    moveHeart();

    heartInterval = setInterval(function() {
        heartTime--;
        heartTimerDisplay.textContent = heartTime;

        if (heartTime <= 0) {
            clearInterval(heartInterval);
            gameRunning = false;

            movingHeart.style.display = "none";

            startHeartsGame.disabled = false;
            startHeartsGame.textContent = "PLAY AGAIN ♡";

            heartResult.textContent =
                "Time's up! You caught " + heartScore + " hearts! 💗";
        }
    }, 1000);
});

movingHeart.addEventListener("click", function() {
    if (!gameRunning) return;

    heartScore++;
    heartScoreDisplay.textContent = heartScore;

    moveHeart();
});

// =================================
// GAME 2: MEMORY MATCH
// =================================

const memoryGameButton = document.getElementById("memoryGame");
const memoryGameScreen = document.getElementById("memoryGameScreen");
const memoryBackButton = document.getElementById("memoryBackButton");
const restartMemory = document.getElementById("restartMemory");

const memoryBoard = document.getElementById("memoryBoard");
const memoryMovesDisplay = document.getElementById("memoryMoves");
const memoryPairsDisplay = document.getElementById("memoryPairs");
const memoryResult = document.getElementById("memoryResult");

let memoryMoves = 0;
let memoryPairs = 0;
let firstCard = null;
let secondCard = null;
let memoryLocked = false;
let memoryTimeout = null;

const memorySymbols = ["🎀", "🎀", "💗", "💗", "🌙", "🌙", "🧸", "🧸"];

// Shuffle the cards
function shuffleMemoryCards() {
    const shuffled = [...memorySymbols];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// Create the game board
function createMemoryBoard() {
    clearTimeout(memoryTimeout);

    memoryMoves = 0;
    memoryPairs = 0;
    firstCard = null;
    secondCard = null;
    memoryLocked = false;

    memoryMovesDisplay.textContent = "0";
    memoryPairsDisplay.textContent = "0 / 4";
    memoryResult.textContent = "";

    const shuffledCards = shuffleMemoryCards();

    memoryBoard.innerHTML = "";

    shuffledCards.forEach(function(symbol) {
        const card = document.createElement("button");

        card.className = "memory-card";
        card.textContent = "?";
        card.dataset.symbol = symbol;

        card.addEventListener("click", function() {
            flipMemoryCard(card);
        });

        memoryBoard.appendChild(card);
    });
}

// Flip a card
function flipMemoryCard(card) {
    if (
        memoryLocked ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.textContent = card.dataset.symbol;
    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    memoryMoves++;

    memoryMovesDisplay.textContent = memoryMoves;

    // Check whether the cards match
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard = null;
        secondCard = null;

        memoryPairs++;
        memoryPairsDisplay.textContent = memoryPairs + " / 4";

        if (memoryPairs === 4) {
            memoryResult.textContent =
                "Amazing! You found all the pairs! 🎀💗";
        }

    } else {
        memoryLocked = true;

        memoryTimeout = setTimeout(function() {
            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard = null;
            secondCard = null;
            memoryLocked = false;
        }, 900);
    }
}

// Open Memory Match from the lobby
memoryGameButton.addEventListener("click", function() {
    gameLobby.style.display = "none";
    memoryGameScreen.style.display = "flex";

    createMemoryBoard();
});

// Restart the game
restartMemory.addEventListener("click", function() {
    createMemoryBoard();
});

// Return to the game lobby
memoryBackButton.addEventListener("click", function() {
    clearTimeout(memoryTimeout);
    memoryGameScreen.style.display = "none";
    gameLobby.style.display = "flex";
});
// =================================
// GAME 3: FRIENDSHIP QUIZ
// =================================

const quizGameButton = document.getElementById("quizGame");
const quizGameScreen = document.getElementById("quizGameScreen");
const quizBackButton = document.getElementById("quizBackButton");
const quizNextButton = document.getElementById("quizNextButton");

const quizNumber = document.getElementById("quizNumber");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizResult = document.getElementById("quizResult");

const quizQuestions = [
    {
        question: "What makes a friendship truly special?",
        options: ["Trust", "Expensive gifts", "Being popular", "Matching clothes"],
        answer: 0
    },
    {
        question: "What is the best thing to do when a friend feels sad?",
        options: ["Ignore them", "Listen and support them", "Laugh at them", "Change the topic"],
        answer: 1
    },
    {
        question: "Which one is a perfect friendship activity?",
        options: ["Arguing all day", "Ignoring messages", "Making memories together", "Competing always"],
        answer: 2
    },
    {
        question: "Can you guess till when i want to be a friend of you?",
        options: ["till the college", "one month", "after college", "forever"],
        answer: 3
    },
    {
    question: "What do you think is my favourite thing about our friendship?",
    options: [
        "Our endless conversations",
        "The memories we make",
        "How we support each other",
        "All of these"
    ],
    answer: 3
},
];

let currentQuestion = 0;
let quizScore = 0;
let quizAnswered = false;

function showQuizQuestion() {
    quizAnswered = false;

    const question = quizQuestions[currentQuestion];

    quizNumber.textContent = currentQuestion + 1;
    quizQuestion.textContent = question.question;
    quizFeedback.textContent = "";
    quizResult.textContent = "";
    quizOptions.innerHTML = "";
    quizNextButton.style.display = "none";

    question.options.forEach(function(option, index) {
        const button = document.createElement("button");
        button.textContent = option;

        button.addEventListener("click", function() {
            if (quizAnswered) return;

            quizAnswered = true;

            if (index === question.answer) {
                quizScore++;
                quizFeedback.textContent = "Correct! You're amazing! 💗";
            } else {
                quizFeedback.textContent = "Oops! Not quite! Keep going 🎀";
            }

            const allOptions = quizOptions.querySelectorAll("button");
            allOptions.forEach(function(optionButton) {
                optionButton.disabled = true;
            });

            quizNextButton.style.display = "inline-block";
        });

        quizOptions.appendChild(button);
    });
}

quizGameButton.addEventListener("click", function() {
    gameLobby.style.display = "none";
    quizGameScreen.style.display = "flex";

    currentQuestion = 0;
    quizScore = 0;

    showQuizQuestion();
});

quizNextButton.addEventListener("click", function() {
    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        showQuizQuestion();
    } else {
        quizQuestion.textContent = "Quiz completed! 💌";
        quizOptions.innerHTML = "";
        quizFeedback.textContent = "";
        quizNumber.textContent = "5";

        quizResult.textContent =
            "You scored " + quizScore + " out of 5! 💗";

        quizNextButton.style.display = "none";
    }
});

quizBackButton.addEventListener("click", function() {
    quizGameScreen.style.display = "none";
    gameLobby.style.display = "flex";
});


// =================================
// GAME 4: MIDNIGHT WISH MAKER
// =================================

const starsGameButton = document.getElementById("starsGame");
const starsGameScreen = document.getElementById("starsGameScreen");
const starsBackButton = document.getElementById("starsBackButton");

const wishStars = document.querySelectorAll(".wish-star");
const wishCount = document.getElementById("wishCount");
const wishMessage = document.getElementById("wishMessage");
const wishFinalMessage = document.getElementById("wishFinalMessage");
const wishRestartButton = document.getElementById("wishRestartButton");

const friendshipWishes = [
    "I wish your smile never fades, even on your hardest days. 💗",
    "I wish we make countless unforgettable memories together. 🎀",
    "I wish distance and time never change our friendship. 🌙",
    "I wish all your biggest dreams come true. ✨",
    "I wish we stay friends and keep annoying each other forever! 💌"
];

let discoveredWishes = 0;

function resetWishes() {
    discoveredWishes = 0;

    wishCount.textContent = "0";
    wishMessage.textContent =
        "Choose a glowing star to reveal your wish ♡";

    wishFinalMessage.textContent = "";
    wishRestartButton.style.display = "none";

    wishStars.forEach(function(star) {
        star.disabled = false;
        star.classList.remove("discovered");
        star.textContent = "✦";
    });
}

wishStars.forEach(function(star) {
    star.addEventListener("click", function() {

        if (star.classList.contains("discovered")) return;

        const wishIndex = Number(star.dataset.wish);

        star.classList.add("discovered");
        star.textContent = "♡";
        star.disabled = true;

        discoveredWishes++;

        wishCount.textContent = discoveredWishes;

        wishMessage.textContent = friendshipWishes[wishIndex];

       if (discoveredWishes === 5) {
    wishFinalMessage.textContent =
        "All five wishes discovered! You deserve all the magic in the world! 🌙💗";

    setTimeout(function() {
        starsGameScreen.style.display = "none";
        finalSurpriseScreen.style.display = "flex";
    }, 2000);
}
    });
});

// OPEN MIDNIGHT WISH MAKER
starsGameButton.addEventListener("click", function() {
    gameLobby.style.display = "none";
    starsGameScreen.style.display = "flex";

    resetWishes();
});

// RESTART THE WISHES
wishRestartButton.addEventListener("click", function() {
    resetWishes();
});

// BACK TO GAME LOBBY
starsBackButton.addEventListener("click", function() {
    starsGameScreen.style.display = "none";
    gameLobby.style.display = "flex";
});

// =================================
// FINAL SURPRISE: LETTER & BIG BYE
// =================================

const openLetterButton = document.getElementById("openLetterButton");
const letterEnvelope = document.getElementById("letterEnvelope");
const wishesLetter = document.getElementById("wishesLetter");

const bigByeButton = document.getElementById("bigByeButton");
const bigBye = document.getElementById("bigBye");

// OPEN THE LETTER
openLetterButton.addEventListener("click", function() {
    letterEnvelope.style.display = "none";
    openLetterButton.style.display = "none";

    wishesLetter.style.display = "block";
});

// SHOW THE FINAL GOODBYE
bigByeButton.addEventListener("click", function() {
    wishesLetter.style.display = "none";
    bigBye.style.display = "block";
});
