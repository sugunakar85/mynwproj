
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
        question: "Which hormone is primarily responsible for the development of male secondary sexual characteristics?",
        options: ["Estrogen", "Progesterone", "Testosterone", "Luteinizing Hormone"],
        correct: 2
    },
    {
        question: "What is the process of sperm production called?",
        options: ["Oogenesis", "Spermatogenesis", "Fertilization", "Implantation"],
        correct: 1
    },
    {
        question: "Which hormone plays a crucial role in the regulation of the menstrual cycle?",
        options: ["Insulin", "Progesterone", "Thyroxine", "Glucagon"],
        correct: 1
    },
    {
        question: "What marks the release of a mature egg from the ovary?",
        options: ["Menstruation", "Fertilization", "Ovulation", "Implantation"],
        correct: 2
    },
    {
        question: "Which phase of the menstrual cycle is dominated by progesterone?",
        options: ["Follicular phase", "Luteal phase", "Menstrual phase", "Ovulatory phase"],
        correct: 1
    },
    {
        question: "Which organ is responsible for the production of estrogen and progesterone in females?",
        options: ["Ovaries", "Uterus", "Pituitary gland", "Thyroid gland"],
        correct: 0
    },
    {
        question: "What is the function of the corpus luteum?",
        options: ["Produces testosterone", "Releases FSH and LH", "Secretes progesterone", "Aids in implantation"],
        correct: 2
    },
    {
        question: "Where does fertilization of the egg usually occur?",
        options: ["Uterus", "Ovary", "Fallopian tube", "Cervix"],
        correct: 2
    },
    {
        question: "Which hormone stimulates milk ejection during breastfeeding?",
        options: ["Oxytocin", "Prolactin", "Estrogen", "LH"],
        correct: 0
    },
    {
        question: "Which sexually transmitted infection is caused by a virus?",
        options: ["Syphilis", "Chlamydia", "Gonorrhea", "Human Papillomavirus (HPV)"],
        correct: 3
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
MCQ Results: Reproductive system - Chapter 12
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

