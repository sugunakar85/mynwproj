const params = new URLSearchParams(window.location.search);
const userName = params.get('name') || "Unknown User";
const userId = params.get('id') || "No ID";


let timerSeconds = 0;
let timerInterval;


const shuffleOptions = (question) => {
    let options = question.options.map((option, index) => ({ option, index }));
    options.sort(() => Math.random() - 0.5);
    
    question.correct = options.findIndex(item => item.index === question.correct);
    question.options = options.map(item => item.option);
};


const quizData = [
    {
        question: "What marks the beginning of ventricular systole?",
        options: ["Closure of semilunar valves", "Closure of atrioventricular valves", "Opening of mitral valve", "Relaxation of ventricles"],
        correct: 1
    },
    {
        question: "Which heart sound corresponds to the closure of the semilunar valves?",
        options: ["S1", "S2", "S3", "S4"],
        correct: 1
    },
    {
        question: "Where is the radial pulse most commonly palpated?",
        options: ["Neck", "Wrist", "Ankle", "Elbow"],
        correct: 1
    },
    {
        question: "What is the formula for calculating cardiac output?",
        options: ["Heart rate × Stroke volume", "Stroke volume ÷ Heart rate", "Blood pressure × Heart rate", "Venous return × Blood volume"],
        correct: 0
    },
    {
        question: "Which part of an ECG represents ventricular depolarization?",
        options: ["P wave", "QRS complex", "T wave", "PR interval"],
        correct: 1
    },
    {
        question: "Which mechanism aids venous return to the heart?",
        options: ["Baroreceptor reflex", "Skeletal muscle pump", "Parasympathetic activation", "Ventricular contraction"],
        correct: 1
    },
    {
        question: "Which factor directly affects jugular venous pressure (JVP)?",
        options: ["Left atrial pressure", "Right atrial pressure", "Arterial pulse", "Peripheral resistance"],
        correct: 1
    },
    {
        question: "Which reflex is responsible for short-term blood pressure regulation?",
        options: ["Chemoreceptor reflex", "Baroreceptor reflex", "Renin-angiotensin system", "Atrial natriuretic peptide release"],
        correct: 1
    },
    {
        question: "What is the most common cause of myocardial infarction?",
        options: ["Coronary artery spasm", "Atherosclerotic plaque rupture", "Hypertension", "Arrhythmia"],
        correct: 1
    },
    {
        question: "Which condition is characterized by the narrowing and hardening of arteries due to plaque formation?",
        options: ["Aneurysm", "Atherosclerosis", "Arrhythmia", "Myocarditis"],
        correct: 1
    }
];



quizData.forEach(shuffleOptions);

let currentQuestionIndex = 0;
let userResponses = [];

document.addEventListener("DOMContentLoaded", function () {
    const quizContainer = document.getElementById("mcq-questions");
    const userInfoDiv = document.getElementById("user-info");
    userInfoDiv.innerHTML = `<h3>User: ${userName} | ID: ${userId}</h3>
    <div id="timer" style="font-size: 1.2rem; color: orange;">Time: 00:00:00</div>`;

    startTimer();
    loadQuestion(currentQuestionIndex);
});

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

    if (index < quizData.length - 1) {
        questionDiv.innerHTML += `<button onclick="validateAndProceed(${index}, ${index + 1})">Next</button>`;
    } else {
        questionDiv.innerHTML += `<button onclick="validateAndProceed(${index}, 'submit')">Submit</button>`;
    }

    quizContainer.appendChild(questionDiv);
}

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

function saveResponse(index) {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    userResponses[index] = selected ? parseInt(selected.value) : null;
}

function submitQuiz() {
    clearInterval(timerInterval);

    let correctAnswers = 0;
    const totalQuestions = quizData.length;

    userResponses.forEach((response, i) => {
        if (response === quizData[i].correct) {
            correctAnswers++;
        }
    });

    const wrongAnswers = totalQuestions - correctAnswers;
    const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

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
      <button onclick="saveResultsToPDF()">Download Report</button>
    `;
}

function saveResultsToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let content = `
MCQ Results: Cardiovascular system - Chapter 9
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

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `00:${minutes}:${seconds}`;
}

