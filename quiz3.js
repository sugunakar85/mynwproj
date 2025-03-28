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
        question: "What is the primary function of Growth Hormone (GH)?",
        options: [
            "Stimulates milk production",
            "Regulates metabolism",
            "Stimulates growth and development of tissues and organs",
            "Triggers ovulation"
        ],
        correct: 2
    },
    {
        question: "Which hormone stimulates milk production in the mammary glands?",
        options: [
            "Prolactin",
            "Oxytocin",
            "Vasopressin",
            "Luteinizing Hormone"
        ],
        correct: 0
    },
    {
        question: "Which hormone stimulates the thyroid gland to produce thyroid hormones?",
        options: [
            "ACTH",
            "TSH",
            "FSH",
            "LH"
        ],
        correct: 1
    },
    {
        question: "What is the function of Adrenocorticotropic Hormone (ACTH)?",
        options: [
            "Stimulates cortisol production in the adrenal glands",
            "Regulates water balance",
            "Triggers uterine contractions",
            "Stimulates sperm production"
        ],
        correct: 0
    },
    {
        question: "Which hormone plays a crucial role in the regulation of reproductive processes?",
        options: [
            "Growth Hormone",
            "Oxytocin",
            "FSH",
            "Vasopressin"
        ],
        correct: 3
    },
    {
        question: "Which hormone triggers ovulation in females?",
        options: [
            "LH",
            "GH",
            "PRL",
            "ADH"
        ],
        correct: 0
    },
    {
        question: "What is a key function of oxytocin?",
        options: [
            "Regulates metabolism",
            "Triggers ovulation",
            "Stimulates uterine contractions during childbirth",
            "Increases blood sugar levels"
        ],
        correct: 2
    },
    {
        question: "Which hormone regulates water balance and blood pressure?",
        options: [
            "Prolactin",
            "Vasopressin",
            "Oxytocin",
            "TSH"
        ],
        correct: 1
    },
    {
        question: "What triggers the release of oxytocin during labor?",
        options: [
            "Low blood pressure",
            "Stretching of the cervix and uterus",
            "Increased blood sugar",
            "Exercise"
        ],
        correct: 1
    },
    {
        question: "Which hormone acts on the kidneys to increase water reabsorption?",
        options: [
            "Oxytocin",
            "FSH",
            "Vasopressin",
            "TSH"
        ],
        correct: 2
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
MCQ Results : Endocrine system - Chapter 3
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

