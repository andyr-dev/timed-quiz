const startBtn = document.getElementById("start-btn");
const questionBoxEl = document.getElementById("question-box");
const questionEl = document.getElementById("question");
const answerBox = document.getElementById("answer-buttons");
const answerBtns = document.getElementById("answer-buttons").children;
const resultBoxEl = document.getElementById("resultMsg");
const scoreBoxEl = document.getElementById("score");
const timerEl = document.querySelector(".timer");
const timeLimit = 60;

var questions = [
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    answers: [
      { text: "var x = 10", correct: true },
      { text: "variable x = 10", correct: false },
      { text: "x = 10", correct: false },
      { text: "declare x = 10", correct: false },
    ],
  },
  {
    question:
      "Which built-in method removes the last element from an array and returns it?",
    answers: [
      { text: "shift()", correct: false },
      { text: "pop()", correct: true },
      { text: "unshift()", correct: false },
      { text: " push()", correct: false },
    ],
  },
  {
    question: `What does the "typeof" operator return in JavaScript?`,
    answers: [
      { text: "the data type of a variable", correct: true },
      { text: "the value of a variable", correct: false },
      { text: "the memory location of a variable", correct: false },
      { text: "an error message", correct: false },
    ],
  },
  {
    question: `What does the "this" keyword refer to in JavaScript?`,
    answers: [
      { text: "the current function", correct: false },
      { text: "the global object", correct: false },
      { text: "the object that the function is a method of", correct: true },
      { text: "the parent object of the current object", correct: false },
    ],
  },
  {
    question: "What is JavaScript?",
    answers: [
      { text: "A programming language", correct: true },
      { text: "A markup language", correct: false },
      { text: "A query language", correct: false },
      { text: "A styling language", correct: false },
    ],
  },
  {
    question: "Which built-in method returns the length of a string?",
    answers: [
      { text: "strlen()", correct: false },
      { text: "count()", correct: false },
      { text: "size()", correct: false },
      { text: "length()", correct: true },
    ],
  },
];
var remainingTime = timeLimit;
// function to start quiz
function startQuiz() {
  // starts the countdown when the quiz is started
  startCountdown();
  // hides start button and shuffles questions and removes the hide class
  startBtn.classList.add("hide");
  var shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  var currentQuestion = 0;
  var displayQuestions = shuffledQuestions[currentQuestion];
  questionBoxEl.classList.remove("hide");
  // calls the showQuestion function
  showQuestion(displayQuestions);

  // starts timer and display the countdown
  function startCountdown() {
    var countdownEl = document.getElementById("countdown");
    countdownEl.textContent = "Time left: " + remainingTime;

    var timerInterval = setInterval(function () {
      remainingTime--;
      countdownEl.textContent = "Time left: " + remainingTime;
    }, 1000);
  }

  // shows the question and answers options based on the index of the displayQuestions variable
  function showQuestion(displayQuestions) {
    console.log(displayQuestions);
    questionEl.innerText = displayQuestions.question;
    displayQuestions.answers.forEach((answer) => {
      var button = document.createElement("button");
      button.classList.add("ans-btns");
      button.innerText = answer.text;
      // listens for the selected Answer click event and runs the function to check the answer
      button.addEventListener("click", selectAnswer);
      answerBox.appendChild(button);
    });
  }
  function selectAnswer(event) {
    var selectedAnswer = event.target;
    var correct = selectedAnswer.dataset.correct;
    setStatusClass(selectedAnswer, correct);
    Array.from(answerBtns).forEach((button) => {
      if (button.dataset.correct === "true") {
        setStatusClass(button, "correct");
      } else {
        setStatusClass(button, "incorrect");
      }
      button.disabled = true;
    });
    checkAnswer(selectedAnswer);
  }
  // if the answer is correct increments the time +10 seconds and decerements -10 seconds if incorrect
  function checkAnswer(selectedAnswer) {
    if (selectedAnswer.dataset.correct === "true") {
      remainingTime += 10;
    } else {
      remainingTime -= 10;
    }
    // calls the resetBoard function and increments the currectQuestion and checks if there are more questions
    resetBoard();
    currentQuestion++;
    if (currentQuestion < shuffledQuestions.length) {
      showQuestion(shuffledQuestions[currentQuestion]);
    } else {
      // calls the endQuiz function
      endQuiz();
    }
  }

  function endQuiz() {
    clearInterval(remainingTime);
    // hides the timer and question box
    timerEl.classList.add("hide");
    questionBoxEl.classList.add("hide");
    resultBoxEl.classList.remove("hide");
    // stores the remaining time as the score
    var score = remainingTime;
    scoreBoxEl.textContent = "Your score: " + score;
    // prompts for initials
    var initials = prompt("Please enter your initials");

    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    // stores the initials and score in local storage
    highScores.push({ initials: initials, score: score });
    localStorage.setItem("highScores", JSON.stringify(highScores));
    displayHighScores();
  }

  function setStatusClass(element, status) {
    element.classList.remove("correct");
    element.classList.remove("incorrect");
    element.classList.add(status);
  }

  function displayHighScores() {
    // get high scores from local storage
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // sort high scores by score in descending order
    highScores.sort(function (a, b) {
      return b.score - a.score;
    });

    // create HTML for leaderBoard
    var leaderBoard = "<table><tr><th>Initials</th><th>Score</th></tr>";
    for (var i = 0; i < highScores.length; i++) {
      leaderBoard +=
        "<tr><td>" +
        highScores[i].initials +
        "</td><td>" +
        highScores[i].score +
        "</td></tr>";
    }
    leaderBoard += "</table>";

    // display leaderBoard in result box element
    resultBoxEl.innerHTML = leaderBoard;
  }
  function resetBoard() {
    while (answerBox.firstChild) {
      answerBox.removeChild(answerBox.firstChild);
    }
  }
}

startBtn.addEventListener("click", startQuiz);
