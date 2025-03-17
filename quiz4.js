// Capture user details from URL
const params = new URLSearchParams(window.location.search);
const userName = params.get('name') || "Unknown User";
const userId = params.get('id') || "No ID";

// Timer variables
let timerSeconds = 0;
let timerInterval;

// Function to shuffle answer options while maintaining correct answer index
const shuffleOptions = (question) => {
    let options = question.options.map((option, index) => ({ option, index }));
    options.sort(() => Math.random() - 0.5);
    
    question.correct = options.findIndex(item => item.index === question.correct);
    question.options = options.map(item => item.option);
};

// Sample questions
const mcqQuestions = [
    {
        question: "What is the primary function of the cornea in vision?",
        options: [
            "To detect color",
            "To refract light",
            "To produce tears",
            "To send signals to the brain"
        ],
        correct: 1
    },
    {
        question: "Which part of the brain processes visual information?",
        options: [
            "Frontal lobe",
            "Temporal lobe",
            "Occipital lobe",
            "Parietal lobe"
        ],
        correct: 2
    },
    {
        question: "What is the function of the optic chiasm?",
        options: [
            "It stores visual memories",
            "It processes color vision",
            "It allows partial crossover of optic nerve fibers",
            "It controls the movement of the eye"
        ],
        correct: 2
    },
    {
        question: "Which theory explains the mechanism of color vision?",
        options: [
            "Trichromatic theory",
            "Wave theory",
            "Opponent-process theory",
            "Refraction theory"
        ],
        correct: 0
    },
    {
        question: "Which cells in the retina are responsible for color vision?",
        options: [
            "Rods",
            "Cones",
            "Bipolar cells",
            "Ganglion cells"
        ],
        correct: 2
    },
    {
        question: "Which of the following best describes the function of the tympanic reflex?",
        options: [
            "Enhances sound perception",
            "Protects the cochlea from loud sounds",
            "Improves speech recognition",
            "Amplifies low-frequency sounds"
        ],
        correct: 1
    },
    {
        question: "What is the function of the cochlea?",
        options: [
            "To transmit visual signals",
            "To amplify sound waves",
            "To convert sound vibrations into neural signals",
            "To regulate balance"
        ],
        correct: 2
    },
    {
        question: "Which part of the brain receives auditory signals?",
        options: [
            "Cerebellum",
            "Temporal lobe",
            "Parietal lobe",
            "Occipital lobe"
        ],
        correct: 1
    },
    {
        question: "Which type of taste papillae contains the highest number of taste buds?",
        options: [
            "Filiform papillae",
            "Fungiform papillae",
            "Foliate papillae",
            "Circumvallate papillae"
        ],
        correct: 3
    },
    {
        question: "Which nerve carries taste signals from the anterior two-thirds of the tongue?",
        options: [
            "Glossopharyngeal nerve",
            "Facial nerve",
            "Vagus nerve",
            "Olfactory nerve"
        ],
        correct: 1
    }
];

console.log(mcqQuestions);

// Shuffle options for each question
mcqQuestions.forEach(shuffleOptions);

let currentQuestionIndex = 0;
let userResponses = [];

// Display user info and start the timer
document.addEventListener("DOMContentLoaded", function () {
    const userInfoDiv = document.getElementById("user-info");
    userInfoDiv.innerHTML = `<h3>User: ${userName} | ID: ${userId}</h3>
    <div id="timer" style="font-size: 1.2rem; color: orange;">Time: 00:00:00</div>`;

    startTimer();
    loadQuestion(currentQuestionIndex);
});

// Function to start the timer
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timerSeconds++;
        const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const seconds = String(timerSeconds % 60).padStart(2, '0');
        timerDisplay.textContent = `Time: 00:${minutes}:${seconds}`;
        
        timerDisplay.style.color = timerSeconds >= 600 ? "orange" : "yellow";
    }, 1000);
}

// Function to load a question
function loadQuestion(index) {
    const quizContainer = document.getElementById('mcq-questions');
    if (!quizContainer) return;

    quizContainer.innerHTML = '';
    const q = mcqQuestions[index];

    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `<h3>${q.question}</h3>`;

    if (q.image) {
        const img = document.createElement('img');
        img.src = q.image;
        img.alt = "Question Image";
        img.style.maxWidth = "200px";
        questionDiv.appendChild(img);
    }

    q.options.forEach((option, i) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="q${index}" value="${i}"> ${option}`;
        questionDiv.appendChild(label);
        questionDiv.appendChild(document.createElement('br'));
    });

    if (index < mcqQuestions.length - 1) {
        questionDiv.innerHTML += `<button onclick="validateAndProceed(${index}, ${index + 1})">Next</button>`;
    } else {
        questionDiv.innerHTML += `<button onclick="validateAndProceed(${index}, 'submit')">Submit</button>`;
    }

    quizContainer.appendChild(questionDiv);
}

// Function to validate selection and proceed
function validateAndProceed(currentIndex, nextAction) {
    const selected = document.querySelector(`input[name="q${currentIndex}"]:checked`);
    if (!selected) {
        alert("Please select an answer before proceeding!");
        return;
    }

    saveResponse(currentIndex);

    if (nextAction === "submit") {
        submitQuiz();
    } else {
        loadQuestion(nextAction);
    }
}

// Function to save user response
function saveResponse(index) {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    userResponses[index] = selected ? parseInt(selected.value) : null;
}

// Function to submit quiz and display results
function submitQuiz() {
    clearInterval(timerInterval);

    let correctAnswers = 0;
    const totalQuestions = mcqQuestions.length;

    userResponses.forEach((response, i) => {
        if (response === mcqQuestions[i].correct) {
            correctAnswers++;
        }
    });

    const wrongAnswers = totalQuestions - correctAnswers;
    const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    // Display summary on the page
    const quizContainer = document.getElementById('mcq-questions');
    quizContainer.innerHTML = `
      <h3>Quiz Summary</h3>
      <p><strong>User:</strong> ${userName}</p>
      <p><strong>ID:</strong> ${userId}</p>
      <p><strong>Total Time:</strong> ${formatTime(timerSeconds)}</p>
      <p><strong>Total Questions:</strong> ${totalQuestions}</p>
      <p style="color: green;"><strong>Correct Answers:</strong> ${correctAnswers}</p>
      <p style="color: red;"><strong>Wrong Answers:</strong> ${wrongAnswers}</p>
      <p><strong>Score:</strong> ${scorePercentage}%</p>
    `;

    saveResultsToPDF();
}

// Function to save results as PDF
function saveResultsToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let content = `
MCQ Results   Chapter 4: Special senses 

User: ${userName}
ID: ${userId}
Total Time: ${formatTime(timerSeconds)}
Total Questions: ${mcqQuestions.length}
Correct Answers: ${userResponses.filter((r, i) => r === mcqQuestions[i].correct).length}
Wrong Answers: ${mcqQuestions.length - userResponses.filter((r, i) => r === mcqQuestions[i].correct).length}
`;

    mcqQuestions.forEach((q, i) => {
        content += `
Question: ${q.question}
Your Answer: ${q.options[userResponses[i]] || "No answer"}
Correct Answer: ${q.options[q.correct]}
        `;
    });

    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 180);
    pdf.text(lines, 10, 10);

    pdf.save(`quiz_results_${userName}_${Date.now()}.pdf`);
}

// Helper function to format time in MM:SS
function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `00:${minutes}:${seconds}`;
}

