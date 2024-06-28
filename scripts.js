// scripts.js
document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('next-btn').addEventListener('click', nextQuestion);

let timer;
let questions;
let currentQuestion = 0;
let timeRemaining;
let userAnswers = [];

function startTest() {
    const time = parseInt(document.getElementById('time').value);
    const numberOfQuestions = parseInt(document.getElementById('questions').value);
    const level = parseInt(document.getElementById('level').value);

    if (isNaN(time) || isNaN(numberOfQuestions) || isNaN(level)) {
        alert('Please fill out all fields with valid numbers.');
        return;
    }

    timeRemaining = time;
    questions = generateQuestions(numberOfQuestions, level);
    currentQuestion = 0;
    userAnswers = [];

    document.querySelector('.input-section').style.display = 'none';
    document.querySelector('.test-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';

    updateTimer();
    showQuestion();
    startTimer();
}

function generateQuestions(number, level) {
    let questions = [];
    for (let i = 0; i < number; i++) {
        const isAddition = Math.random() < 0.5;
        const x = Math.floor(Math.random() * level);
        const y = Math.floor(Math.random() * (level - x));

        if (isAddition) {
            const format = Math.floor(Math.random() * 3);
            if (format === 0) {
                questions.push({ question: `${x} + ${y} = __`, answer: x + y });
            } else if (format === 1) {
                questions.push({ question: `${x} + __ = ${x + y}`, answer: y });
            } else {
                questions.push({ question: `__ + ${x} = ${x + y}`, answer: y });
            }
        } else {
            const format = Math.floor(Math.random() * 3);
            if (format === 0) {
                questions.push({ question: `${x + y} - ${x} = __`, answer: y });
            } else if (format === 1) {
                questions.push({ question: `${x + y} - __ = ${x}`, answer: y });
            } else {
                questions.push({ question: `__ - ${x} = ${y}`, answer: x + y });
            }
        }
    }
    return questions;
}

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        updateTimer();
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endTest();
        }
    }, 1000);
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Time: ${timeRemaining}s`;
    if (timeRemaining <= 10) {
        timerElement.classList.add('pulse');
    } else {
        timerElement.classList.remove('pulse');
    }
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        document.getElementById('question').textContent = questions[currentQuestion].question;
        document.getElementById('answer').value = '';
        document.getElementById('answer').focus();
    } else {
        endTest();
    }
}

function nextQuestion() {
    const answer = parseInt(document.getElementById('answer').value);
    userAnswers.push({ 
        question: questions[currentQuestion].question, 
        correctAnswer: questions[currentQuestion].answer, 
        userAnswer: answer 
    });
    currentQuestion++;
    showQuestion();
}

function endTest() {
    clearInterval(timer);
    document.querySelector('.test-section').style.display = 'none';
    displayResults();
    document.getElementById('result-section').style.display = 'block';
}

function displayResults() {
    const resultList = document.getElementById('result-list');
    resultList.innerHTML = '';

    let correctCount = 0;
    userAnswers.forEach(answer => {
        const li = document.createElement('li');
        li.textContent = `${answer.question} ${answer.userAnswer}`;
        if (answer.userAnswer === answer.correctAnswer) {
            li.innerHTML += ' ✔️';
            correctCount++;
        } else {
            li.innerHTML += ' ❌';
        }
        resultList.appendChild(li);
    });

    const scoreElement = document.getElementById('score');
    const totalQuestions = userAnswers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    let message = percentage >= 90 ? '👍' : 'Keep trying!';
    scoreElement.textContent = `Score: ${correctCount} out of ${totalQuestions} (${percentage.toFixed(2)}%) ${message}`;
}
