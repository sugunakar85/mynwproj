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
        question: "What is the primary function of the autonomic nervous system (ANS)?",
        options: ["Control voluntary muscle movements", "Regulate involuntary physiological functions", "Process sensory information", "Coordinate reflex actions"],
        correct: 1
    },
    {
        question: "Which branch of the ANS is responsible for the 'fight or flight' response?",
        options: ["Sympathetic nervous system", "Parasympathetic nervous system", "Enteric nervous system", "Somatic nervous system"],
        correct 0
    },
    {
        question: "Which neurotransmitter is primarily released by the sympathetic nervous system?",
        options: ["Dopamine", "Acetylcholine", "Norepinephrine", "Serotonin"],
        correct: 2
    },
    {
        question: "What effect does the parasympathetic nervous system have on heart rate?",
        options: ["Increases heart rate", "Decreases heart rate", "No effect on heart rate", "Causes irregular heartbeat"],
        correct: 1
    },
    {
        question: "Which receptor type is activated by norepinephrine in the sympathetic nervous system?",
        options: ["Muscarinic receptors", "Nicotinic receptors", "Adrenergic receptors", "Cholinergic receptors"],
        correct: 2
    },
    {
        question: "What is the primary role of beta-1 adrenergic receptors in the heart?",
        options: ["Decrease heart rate", "Increase heart rate and contractility", "Cause vasodilation", "Reduce blood pressure"],
        correct: 1
    },
    {
        question: "Which cranial nerve is primarily responsible for parasympathetic regulation of the heart?",
        options: ["Optic nerve (CN II)", "Vagus nerve (CN X)", "Facial nerve (CN VII)", "Trigeminal nerve (CN V)"],
        correct: 1
    {
        question: "What is the primary neurotransmitter used by the parasympathetic nervous system?",
        options: ["Norepinephrine", "Acetylcholine", "Glutamate", "Dopamine"],
        correct: 1
    },
    {
        question: "Which response is characteristic of parasympathetic activation?",
        options: ["Pupil dilation", "Increased digestion", "Increased heart rate", "Bronchodilation"],
        correct: 1
    },
    {
        question: "Which division of the ANS is responsible for the 'rest and digest' functions?",
        options: ["Sympathetic nervous system", "Parasympathetic nervous system", "Enteric nervous system", "Central nervous system"],
        correct: 1
    }
];
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
MCQ Results   Chapter 6: Autonomic nervous system   

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

