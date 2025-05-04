// Get user info from URL
const params = new URLSearchParams(window.location.search);
const userName = params.get('name') || "Unknown User";
const userId = params.get('id') || "No ID";

// Timer variables
let timerSeconds = 0;
let timerInterval;

// Shuffle options randomly
const shuffleOptions = (question) => {
    let options = question.options.map((option, index) => ({ option, index }));
    options.sort(() => Math.random() - 0.5);

    question.correct = options.findIndex(item => item.index === question.correct);
    question.options = options.map(item => item.option);
};

// Quiz data
const quizData = [
    {
        question: "What is the primary function of a synapse?",
        options: ["Generate action potentials", "Transmit signals between neurons", "Store neurotransmitters", "Break down neurotransmitters"],
        correct: 1
    },
    {
        question: "Which type of synapse uses neurotransmitters for signal transmission?",
        options: ["Electrical synapse", "Chemical synapse", "Mechanical synapse", "Magnetosynapse"],
        correct: 1
    },
    {
        question: "Which neurotransmitter is primarily involved in muscle contraction at the neuromuscular junction?",
        options: ["Dopamine", "Serotonin", "Acetylcholine", "Glutamate"],
        correct: 2
    },
    {
        question: "Which type of receptor detects changes in temperature?",
        options: ["Mechanoreceptor", "Thermoreceptor", "Chemoreceptor", "Photoreceptor"],
        correct: 1
    },
    {
        question: "What is the main function of the fasciculus gracilis?",
        options: ["Carry motor commands", "Transmit proprioceptive information from the lower body", "Regulate balance", "Control reflexes"],
        correct: 1
    },
    {
        question: "Which descending pathway is primarily responsible for voluntary movement?",
        options: ["Spinothalamic tract", "Corticospinal tract", "Vestibulospinal tract", "Reticulospinal tract"],
        correct: 1
    },
    {
        question: "Which of the following is a characteristic feature of Brown-Séquard syndrome?",
        options: ["Bilateral loss of motor function", "Ipsilateral loss of motor function and contralateral loss of pain and temperature sensation", "Loss of only sensory function", "Complete paralysis below the lesion"],
        correct: 1
    },
    {
        question: "What is the function of the vestibular apparatus?",
        options: ["Regulate voluntary movements", "Process auditory information", "Maintain balance and posture", "Control facial muscles"],
        correct: 2
    },
    {
        question: "Which structure is primarily involved in memory consolidation?",
        options: ["Cerebellum", "Hippocampus", "Basal ganglia", "Thalamus"],
        correct: 1
    },
    {
        question: "Which part of the brain is responsible for regulating circadian rhythms?",
        options: ["Basal ganglia", "Hypothalamus", "Hippocampus", "Thalamus"],
        correct: 1
    }
];

// Shuffle all questions
quizData.forEach(shuffleOptions);

// Initialize variables
let currentQuestionIndex = 0;
let userResponses = [];

// On page load
document.addEventListener("DOMContentLoaded", function () {
    const quizContainer = document.getElementById("mcq-questions");
    const userInfoDiv = document.getElementById("user-info");

    userInfoDiv.innerHTML = `
        <h3>User: ${userName} | ID: ${userId}</h3>
        <div id="timer" style="font-size: 1.2rem; color: orange;">Time: 00:00:00</div>
    `;

    startTimer();
    loadQuestion(currentQuestionIndex);
});

// Timer function
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

// Load question
function loadQuestion(index) {
    const quizContainer = document.getElementById('mcq-questions');
    quizContainer.innerHTML = '';
    const q = quizData[index];

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

    const button = document.createElement('button');
    button.textContent = index < quizData.length - 1 ? "Next" : "Submit";
    button.onclick = () => validateAndProceed(index, index < quizData.length - 1 ? index + 1 : "submit");
    questionDiv.appendChild(button);

    quizContainer.appendChild(questionDiv);
}

// Validate answer and proceed
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

// Save selected response
function saveResponse(index) {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    userResponses[index] = selected ? parseInt(selected.value) : null;
}

// Submit and display results
function submitQuiz() {
    clearInterval(timerInterval);

    const correctAnswers = userResponses.filter((r, i) => r === quizData[i].correct).length;
    const totalQuestions = quizData.length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    let resultHTML = `
        <h3>Quiz Summary</h3>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>ID:</strong> ${userId}</p>
        <p><strong>Total Time:</strong> ${formatTime(timerSeconds)}</p>
        <p><strong>Total Questions:</strong> ${totalQuestions}</p>
        <p style="color: green;"><strong>Correct Answers:</strong> ${correctAnswers}</p>
        <p style="color: red;"><strong>Wrong Answers:</strong> ${wrongAnswers}</p>
        <p><strong>Score:</strong> ${scorePercentage}%</p>
    `;

    if (parseFloat(scorePercentage) === 100) {
        resultHTML += `
            <div style="text-align:center; margin-top:20px;">
                <h2 style="color:green;">🎉 Congratulations! You got a perfect score! 🎉</h2>
                <img src="images/congrats.png" style="max-width:300px; border-radius:10px; margin-top:10px;">
            </div>
        `;
    }

    resultHTML += `<button onclick="saveResultsToPDF()">Download Report</button>`;

    document.getElementById("mcq-questions").innerHTML = resultHTML;
}

// Format time display
function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `00:${minutes}:${seconds}`;
}

// Save results as PDF
function saveResultsToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let content = `
MCQ Results: Central nervous system - Chapter 7
User: ${userName}
ID: ${userId}
Total Time: ${formatTime(timerSeconds)}
Total Questions: ${quizData.length}
Correct Answers: ${userResponses.filter((r, i) => r === quizData[i].correct).length}
Wrong Answers: ${quizData.length - userResponses.filter((r, i) => r === quizData[i].correct).length}
`;

    quizData.forEach((q, i) => {
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

