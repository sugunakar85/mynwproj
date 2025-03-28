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

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `00:${minutes}:${seconds}`;
}

