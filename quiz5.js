
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
        question: "What is the resting membrane potential of a typical neuron?",
        options: ["-70 mV", "-55 mV", "0 mV", "+40 mV"],
        correct: 0
    },
    {
        question: "What triggers the depolarization phase of an action potential?",
        options: ["Efflux of potassium ions", "Influx of sodium ions", "Efflux of calcium ions", "Influx of chloride ions"],
        correct: 1
    },
    {
        question: "Which protein covers the myosin-binding sites on actin in a resting muscle?",
        options: ["Myosin", "Tropomyosin", "Troponin", "Actinin"],
        correct: 1
    },
    {
        question: "Which neurotransmitter is released at the neuromuscular junction?",
        options: ["Dopamine", "Serotonin", "Acetylcholine", "GABA"],
        correct: 2
    },
    {
        question: "What is the function of the sarcoplasmic reticulum in muscle contraction?",
        options: ["Generate action potentials", "Store and release calcium ions", "Bind to troponin", "Break down ATP"],
        correct: 1
    },
    {
        question: "Which type of muscle fiber is best suited for endurance activities?",
        options: ["Type I", "Type IIa", "Type IIb", "Type III"],
        correct: 0
    },
    {
        question: "Which part of the nervous system is responsible for voluntary muscle movements?",
        options: ["Autonomic nervous system", "Somatic nervous system", "Enteric nervous system", "Sympathetic nervous system"],
        correct: 1
    },
    {
        question: "What type of nerve fiber conducts signals the fastest?",
        options: ["Type Aα", "Type B", "Type C", "Type Aδ"],
        correct: 0
    },
    {
        question: "Which enzyme breaks down acetylcholine at the neuromuscular junction?",
        options: ["Myosin ATPase", "Acetylcholinesterase", "Calmodulin", "Phospholipase C"],
        correct: 1
    },
    {
        question: "Which autoimmune disorder affects the neuromuscular junction, leading to muscle weakness?",
        options: ["Multiple sclerosis", "Guillain-Barré syndrome", "Myasthenia gravis", "Parkinson's disease"],
        correct: 2
    }
];


quizData.forEach(shuffleOptions);


let currentQuestionIndex = 0;
let userResponses = [];


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

    const button = document.createElement('button');
    button.textContent = index < quizData.length - 1 ? "Next" : "Submit";
    button.onclick = () => validateAndProceed(index, index < quizData.length - 1 ? index + 1 : "submit");
    questionDiv.appendChild(button);

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
            </div>
        `;
    }

    resultHTML += `<button onclick="saveResultsToPDF()">Download Report</button>`;

    document.getElementById("mcq-questions").innerHTML = resultHTML;
}


function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `00:${minutes}:${seconds}`;
}


function saveResultsToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let content = `
MCQ Results: Nerve muscle physiology - Chapter 5
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

