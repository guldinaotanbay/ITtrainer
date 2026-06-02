// Получаем текущего пользователя 
const userId = localStorage.getItem("userId") || "defaultUser";

// Кэширование DOM-элементов для удобства и читаемости
const modal = document.getElementById("favoriteModal");
const modalQuestion = document.getElementById("modalQuestion");
const modalAnswer = document.getElementById("modalAnswer");
const closeModal = document.getElementById("closeModal");
const favoritesContainer = document.getElementById("favoritesContainer");
const emptyFavorites = document.getElementById("emptyFavorites");

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(`favoriteQuestions_${userId}`)) || [];
  } catch (e) {
    console.error("Ошибка чтения избранного из localStorage", e);
    return [];
  }
}

function renderFavorites() {
  const favorites = getFavorites();
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    emptyFavorites.classList.remove("hidden");
    return;
  }
  emptyFavorites.classList.add("hidden");

  favorites.forEach(item => {
    const card = document.createElement("div");
    card.className = "favorite-card";
    card.innerHTML = `
      <h3>${item.question}</h3>
      <div class="favorite-topic">${item.topic}</div>
    `;
    card.addEventListener("click", () => openFavorite(item.question, item.answer));
    favoritesContainer.appendChild(card);
  });
}

// Открытие окна с подробностями
function openFavorite(question, answer) {
  modal.classList.remove("hidden");
  modalQuestion.textContent = question;
  modalAnswer.textContent = answer;
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

// Инициализация
renderFavorites();
