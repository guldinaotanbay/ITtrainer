const params = new URLSearchParams(window.location.search);// Получаем параметры из URL

const timerMinutes = Number(params.get("timer")) || 3; // Таймер по умолчанию 3

const topics = params.get("topics") || "";

const trainingTitle = topics.split(",").join(" + ");

const userId = localStorage.getItem("userId") || "defaultUser";

const state = {
  currentIndex: 0,
  know: 0,
  repeat: 0,
  dontKnow: 0,
  answers: [],
  seconds: timerMinutes * 60,
};

// Кэшируем DOM-элементы для удобства
const elements = {
  flipInner: document.getElementById("flipInner"),
  flipCard: document.getElementById("flipCard"),
  questionTitle: document.getElementById("questionTitle"),
  questionText: document.getElementById("questionText"),
  answerText: document.getElementById("answerText"),
  questionTopic: document.getElementById("questionTopic"),
  answerTopic: document.getElementById("answerTopic"),
  viewed: document.getElementById("viewed"),
  totalCards: document.getElementById("totalCards"),
  currentCard: document.getElementById("currentCard"),
  knowCount: document.getElementById("knowCount"),
  repeatCount: document.getElementById("repeatCount"),
  dontKnowCount: document.getElementById("dontKnowCount"),
  answerBlock: document.getElementById("answerBlock"),
  selectedAnswer: document.getElementById("selectedAnswer"),
  nextBtn: document.getElementById("nextBtn"),
  prevBtn: document.getElementById("prevBtn"),
  timer: document.getElementById("timer"),
  favorite: document.querySelector(".favorite"),
};

function getFavorites() {
  return JSON.parse(localStorage.getItem(`favoriteQuestions_${userId}`)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(`favoriteQuestions_${userId}`, JSON.stringify(favorites));
}

function saveTrainingHistory() {
  const history = JSON.parse(localStorage.getItem("trainingHistory")) || [];
  const existingIndex = history.findIndex(item => item.title === trainingTitle);

  const trainingData = {
    title: trainingTitle,
    total: flashcardsData.length,
    know: state.know,
    repeat: state.repeat,
    dontKnow: state.dontKnow,
  };

  if (existingIndex >= 0) {
    history[existingIndex] = trainingData;
  } else {
    history.push(trainingData);
  }

  localStorage.setItem("trainingHistory", JSON.stringify(history));
}

function goToResults() {
  saveTrainingHistory();

  localStorage.setItem(
    "flashcardsResults",
    JSON.stringify({
      know: state.know,
      repeat: state.repeat,
      dontKnow: state.dontKnow,
      answers: state.answers,
      cards: flashcardsData,
    })
  );

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/results";

  flashcardsData.forEach((card, index) => {
    const answerInput = document.createElement("input");
    answerInput.type = "hidden";
    answerInput.name = "answers";
    answerInput.value = state.answers[index] || "Не знаю";
    form.appendChild(answerInput);

    const questionInput = document.createElement("input");
    questionInput.type = "hidden";
    questionInput.name = "questions";
    questionInput.value = card.question;
    form.appendChild(questionInput);

    const topicInput = document.createElement("input");
    topicInput.type = "hidden";
    topicInput.name = "topics";
    topicInput.value = card.topic;
    form.appendChild(topicInput);
  });

  const directionInput = document.createElement("input");
  directionInput.type = "hidden";
  directionInput.name = "direction";
  directionInput.value = trainingTitle;
  form.appendChild(directionInput);

  document.body.appendChild(form);
  form.submit();
}

function updateButtonState(button, disabled) {
  button.disabled = disabled;
  button.classList.toggle("disabled-btn", disabled);
}

function renderFavorite() {
  const favorites = getFavorites();
  const current = flashcardsData[state.currentIndex];
  const exists = favorites.some(item => item.question === current.question);
  elements.favorite.textContent = exists ? "★" : "☆";
}

function renderCard() {
  elements.flipInner.style.transition = "none";
  elements.flipInner.classList.remove("flipped");

  const card = flashcardsData[state.currentIndex];
  const savedAnswer = state.answers[state.currentIndex];

  requestAnimationFrame(() => {
    elements.questionTitle.textContent = `Вопрос ${state.currentIndex + 1}`;
    elements.questionText.textContent = card.question;
    elements.answerText.textContent = card.answer;
    elements.questionTopic.textContent = card.topic;
    elements.answerTopic.textContent = card.topic;

    elements.viewed.textContent = state.currentIndex + 1;
    elements.totalCards.textContent = flashcardsData.length;
    elements.currentCard.textContent = `${state.currentIndex + 1} из ${flashcardsData.length}`;

    renderFavorite();

    if (savedAnswer) {
      elements.flipInner.classList.add("flipped");
      elements.answerBlock.classList.add("hidden");
      elements.selectedAnswer.classList.remove("hidden");
      elements.selectedAnswer.innerHTML = `Ваша оценка: <span>${savedAnswer}</span>`;
    } else {
      elements.answerBlock.classList.add("hidden");
      elements.selectedAnswer.classList.add("hidden");
    }

    updateButtonState(elements.prevBtn, state.currentIndex === 0);

    requestAnimationFrame(() => {
      elements.flipInner.style.transition = "transform .7s";
    });
  });
}

elements.favorite.onclick = (event) => {
  event.stopPropagation();

  const favorites = getFavorites();
  const current = flashcardsData[state.currentIndex];
  const existsIndex = favorites.findIndex(item => item.question === current.question);

  if (existsIndex >= 0) {
    favorites.splice(existsIndex, 1);
  } else {
    favorites.push(current);
  }

  saveFavorites(favorites);
  renderFavorite();
};

elements.flipCard.onclick = () => {
  if (state.answers[state.currentIndex]) return;
  if (elements.flipInner.classList.contains("flipped")) return;

  elements.flipInner.classList.add("flipped");
  elements.answerBlock.classList.remove("hidden");
};


document.querySelectorAll(".answer-btn").forEach(button => {
  button.onclick = () => {
    const oldAnswer = state.answers[state.currentIndex];

    if (oldAnswer) {
      if (oldAnswer.includes("Знаю")) state.know--;
      else if (oldAnswer.includes("повтор")) state.repeat--;
      else if (oldAnswer.includes("Не знаю")) state.dontKnow--;
    }

    const type = button.dataset.type;
    const text = button.textContent;

    state.answers[state.currentIndex] = text;

    if (type === "know") state.know++;
    else if (type === "repeat") state.repeat++;
    else state.dontKnow++;

    elements.knowCount.textContent = state.know;
    elements.repeatCount.textContent = state.repeat;
    elements.dontKnowCount.textContent = state.dontKnow;

    elements.answerBlock.classList.add("hidden");
    elements.selectedAnswer.classList.remove("hidden");
    elements.selectedAnswer.innerHTML = `Ваша оценка: <span>${text}</span>`;

    if (state.currentIndex === flashcardsData.length - 1) {     // Переход к результатам
      setTimeout(() => {
        goToResults();
      }, 600);
    }

  };
});


elements.nextBtn.onclick = () => {
  if (state.currentIndex < flashcardsData.length - 1) {
    state.currentIndex++;
    renderCard();
  } else {
    goToResults();
  }
};


elements.prevBtn.onclick = () => {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderCard();
  }
};


function updateTimer() {
  const mins = Math.floor(state.seconds / 60);
  const secs = state.seconds % 60;
  elements.timer.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}


updateTimer(); // Запуск таймера отсчета

const timerInterval = setInterval(() => {
  if (state.seconds <= 0) {
    clearInterval(timerInterval);
    goToResults();
    return;
  }
  state.seconds--;
  updateTimer();
}, 1000);

// Инициализация отображения первой карточки
renderCard();
