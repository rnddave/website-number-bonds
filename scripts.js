// scripts.js
document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartTest);

let timer;
let questions;
let currentQuestion = 0;
let timeRemaining;
let userAnswers = [];
let totalTime;

function startTest() {
    const time = parseInt(document.getElementById('time').value);
    const numberOfQuestions = parseInt(document.getElementById('questions').value);
    const level = parseInt(document.getElementById('level').value);

    if (isNaN(time) || isNaN(numberOfQuestions) || isNaN(level)) {
        alert('Please fill out all fields with valid numbers.');
        return;
    }

    timeRemaining = time;
    totalTime = time;
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
    const numb = document.getElementById('numb');
    numb.textContent = timeRemaining;

    const totalTimePassed = totalTime - timeRemaining;
    const degrees = (totalTimePassed / totalTime) * 360;

    const leftProgress = document.getElementById('left-progress');
    const rightProgress = document.getElementById('right-progress');

    if (degrees <= 180) {
        rightProgress.style.transform = `rotate(${degrees}deg)`;
        leftProgress.style.transform = 'rotate(0deg)';
    } else {
        rightProgress.style.transform = 'rotate(180deg)';
        leftProgress.style.transform = `rotate(${degrees - 180}deg)`;
    }

    if (timeRemaining <= 10) {
        numb.classList.add('pulse');
    } else {
        numb.classList.remove('pulse');
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
        userAnswer: isNaN(answer) ? 'oops, that\'s wrong' : answer 
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
    const resultBody = document.getElementById('result-body');
    resultBody.innerHTML = '';

    let correctCount = 0;
    userAnswers.forEach(answer => {
        const tr = document.createElement('tr');
        const questionTd = document.createElement('td');
        const answerTd = document.createElement('td');
        const resultTd = document.createElement('td');
        
        questionTd.textContent = answer.question;
        answerTd.textContent = answer.userAnswer;
        if (answer.userAnswer === answer.correctAnswer) {
            resultTd.innerHTML = '✔️';
            correctCount++;
        } else {
            resultTd.innerHTML = '❌';
        }

        tr.appendChild(questionTd);
        tr.appendChild(answerTd);
        tr.appendChild(resultTd);
        resultBody.appendChild(tr);
    });

    const scoreElement = document.getElementById('score');
    const totalQuestions = userAnswers.length;
    const percentage = isNaN(correctCount / totalQuestions) ? 0 : (correctCount / totalQuestions) * 100;
    let message = percentage >= 90 ? '👍' : 'Keep trying!';
    scoreElement.textContent = `Score: ${correctCount} out of ${totalQuestions} (${percentage.toFixed(2)}%) ${message}`;
}

function restartTest() {
    document.querySelector('.input-section').style.display = 'block';
    document.querySelector('.test-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'none';
}
