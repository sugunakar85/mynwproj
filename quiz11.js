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
        question: "What is the primary function of nephrons in the kidneys?",
        options: ["Produce hormones", "Regulate blood glucose", "Filter blood and form urine", "Store urine"],
        correct: 2
    },
    {
        question: "Which type of nephron is responsible for producing concentrated urine?",
        options: ["Cortical nephron", "Juxtamedullary nephron", "Medullary nephron", "Renal corpuscle"],
        correct: 1
    },
    {
        question: "What hormone regulates water reabsorption in the kidneys?",
        options: ["Aldosterone", "Renin", "Antidiuretic hormone (ADH)", "Erythropoietin"],
        correct: 2
    },
    {
        question: "What is the normal range for glomerular filtration rate (GFR) in healthy adults?",
        options: ["10-20 mL/min", "30-50 mL/min", "60-120 mL/min", "150-200 mL/min"],
        correct: 2
    },
    {
        question: "Which part of the nephron is primarily responsible for glucose reabsorption?",
        options: ["Loop of Henle", "Proximal convoluted tubule", "Distal convoluted tubule", "Collecting duct"],
        correct: 1
    },
    {
        question: "Which structure releases renin in response to low blood pressure?",
        options: ["Macula densa", "Juxtaglomerular apparatus", "Bowman’s capsule", "Loop of Henle"],
        correct: 1
    },
    {
        question: "What is the role of aldosterone in kidney function?",
        options: ["Increases sodium reabsorption", "Decreases potassium excretion", "Promotes urine formation", "Inhibits ADH release"],
        correct: 0
    },
    {
        question: "Which condition is characterized by the presence of glucose in urine due to exceeding the renal threshold?",
        options: ["Proteinuria", "Glycosuria", "Hematuria", "Azotemia"],
        correct: 1
    },
    {
        question: "What is the function of the countercurrent multiplier system in the kidney?",
        options: ["Increase blood pressure", "Maintain pH balance", "Concentrate urine", "Regulate glucose levels"],
        correct: 2
    },
    {
        question: "What is the primary treatment for end-stage renal disease (ESRD)?",
        options: ["Diuretics", "Dialysis", "Corticosteroids", "Beta-blockers"],
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
MCQ Results: Renal system - Chapter 11
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

