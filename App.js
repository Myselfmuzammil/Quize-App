const url = "https://raw.githubusercontent.com/googlearchive/android-Quiz/master/Application/src/main/assets/Quiz.json";
const options = document.querySelectorAll(".options");
const playAgainBtn = document.createElement("button");
const resultBox = document.createElement("section");
playAgainBtn.innerHTML = "Play Again";
playAgainBtn.classList.add("btn");
resultBox.classList.add("resultBox");

const newData = [
  { question: "In which decade was the American Institute of Electrical Engineers (AIEE) founded?", answers: ["1850s", "1880s", "1930s", "1950s"], correctIndex: 1 },
  { question: "What is part of a database that holds only one type of information?", answers: ["Report", "Field", "Record", "File"], correctIndex: 1 },
  { question: "'OS' computer abbreviation usually means ?", answers: ["Order of Significance", "Open Software", "Operating System", "Optical Sensor"], correctIndex: 2 },
  { question: "'.MOV' extension refers usually to what kind of file?", answers: ["Image file", "Animation/movie file", "Audio file", "MS Office document"], correctIndex: 1 },
];

let quizeData;
let index = 0;
let wrong = 0;
let right = 0;
let answers = 0;
let counter = 30;
let quizeCounterRefresher;
let correctIndex = 0;

async function quizeRandomizer() {
  try {
    const response = await fetch(url);
    const questions = await response.json();
    quizeData = questions.questions;
    quizeData.push(...newData);
    quizeData.sort(() => Math.random() - 0.5);
    loadData();
  } catch (err) {
    QuizeBox.innerHTML = err;
    QuizeBox.style.cssText = `
    justify-content: center;
    text-align: center;`;
  }
}
quizeRandomizer();

function loadData() {
  if (index >= quizeData.length) {
    QuizeBox.style.display = "none";
    document.querySelector("main").appendChild(resultBox);
    resultBox.innerHTML = `<p>Result ${right}/${quizeData.length}</p>`;
    resultBox.style.cssText = `
    justify-content: center;
    align-items: center;
    font-size: 2rem;`;
    resultBox.appendChild(playAgainBtn);
    playAgainBtn.addEventListener("click", () => {
      index = 0;
      wrong = 0;
      right = 0;
      resultBox.remove();
      QuizeBox.style.cssText = `display: flex;`;
      quizeData.sort(() => Math.random() - 0.5);
      counter = 30;
      clearInterval(quizeCounterRefresher);
      loadData();
    });
  } else {
    timer.innerHTML = counter;
    correctIndex = quizeData[index].correctIndex;
    questionIndex.innerHTML = `${index + 1})`;
    question.innerText = quizeData[index].question;
    options.forEach((option, i) => {
      option.nextElementSibling.innerHTML = quizeData[index].answers[i];
      option.checked = false;
    });
    quizeCounterRefresher = setInterval(() => {
      if (counter <= 0) {
        counter = 30;
        alert(`Time over The answer is => ( ${quizeData[index].answers[correctIndex]} )`);
        index++;
        clearInterval(quizeCounterRefresher);
        loadData();
      } else {
        counter--;
        counter < 10 ? (timer.innerHTML = "0" + counter) : (timer.innerHTML = counter);
      }
    }, 1000);
  }
}

function submit() {
  options.forEach((ans) => {
    if (ans.checked) {
      if (ans.value == correctIndex) {
        index++;
        right++;
      } else {
        alert(`Incorrect answer The correct answer is => ( ${quizeData[index].answers[correctIndex]} )`);
        index++;
        wrong++;
      }
      counter = 30;
      clearInterval(quizeCounterRefresher);
      loadData();
    }
  });
}
