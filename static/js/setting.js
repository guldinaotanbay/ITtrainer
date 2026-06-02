const directionButtons = document.querySelectorAll(".direction-btn"); // Элементы страницы для управления настройками
const topicWrapper = document.querySelector(".multi-select");
const startBtn = document.getElementById("startBtn");
const timerButtons = document.querySelectorAll(".timer-btn");

let selectedDirection = document.querySelector(".direction-btn.active")?.dataset.direction || "backend";// Направление и таймер по умолчанию
let selectedTopics = [];
let selectedTimer = 3;


const topicsData = {
  backend: ["Python", "Java"],
  frontend: ["JavaScript"],
  devops: ["CI/CD", "Docker"],
  general: ["Алгоритмы", "Структуры данных"]
};

function createTopics() {
  topicWrapper.innerHTML = "";
  selectedTopics = [];

  topicsData[selectedDirection].forEach(topic => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn topic-btn";
    button.textContent = topic;

    button.onclick = () => {
      button.classList.toggle("active");
      const value = topic.toLowerCase();

      if (selectedTopics.includes(value)) {
        selectedTopics = selectedTopics.filter(item => item !== value);
      } else {
        selectedTopics.push(value);
      }

      updateStartButton();
    };

    topicWrapper.appendChild(button);
  });
}

function updateStartButton() {
  if (selectedTopics.length === 0) {
    startBtn.classList.add("disabled");
    startBtn.href = "#";
    return;
  }

  const topics = selectedTopics.join(",");
  startBtn.classList.remove("disabled");
  startBtn.href = `/flashcards?topics=${topics}&timer=${selectedTimer}`;
}


directionButtons.forEach(button => { // Выбор направления
  button.onclick = () => {
    directionButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    selectedDirection = button.dataset.direction;
    createTopics();
    updateStartButton();
  };
});

timerButtons.forEach(button => { // Выбор таймера
  button.onclick = () => {
    timerButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    selectedTimer = Number(button.dataset.timer);
    updateStartButton();
  };
});

// Инициализация интерфейса
createTopics();
updateStartButton();
