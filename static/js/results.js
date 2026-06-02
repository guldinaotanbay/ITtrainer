const data = JSON.parse(localStorage.getItem("flashcardsResults")); // Загружаем данные результатов из localStorage

// Получаем элементы DOM для вывода результатов
const summaryValue = document.getElementById("summaryValue");
const knowValue = document.getElementById("knowValue");
const repeatValue = document.getElementById("repeatValue");
const dontKnowValue = document.getElementById("dontKnowValue");
const analysisText = document.getElementById("analysisText");
const questionsContainer = document.getElementById("questionsContainer");


const total = data.cards.length; // общее количество карт
const percent = Math.round((data.know / total) * 100); // процент знаний

summaryValue.textContent = `${percent}%`; // Выводим сводку в DOM
knowValue.textContent = data.know;
repeatValue.textContent = data.repeat;
dontKnowValue.textContent = data.dontKnow;

if (percent >= 80) {  // Определяем сообщение в зависимости от уровня знаний
  analysisText.textContent =
    "Отличный результат! Вы уверенно владеете материалом и хорошо ориентируетесь в изученной теме";
} else if (percent >= 50) {
  analysisText.textContent =
    "Хороший результат! Вы хорошо справились с большинством вопросов, но отдельные требуют дополнительного изучения и повторения";
} else {
  analysisText.textContent =
    "К сожалению, вы не справились с вопросами на собеседовании. Рекомендуется повторить материал и попробовать снова";
}

data.cards.forEach((card, index) => {
  const result = data.answers[index] || "Не отвечено";
  const normalized = result.toLowerCase();

  let resultClass = "gray-text";

  if (normalized.includes("знаю") && !normalized.includes("не знаю")) {
    resultClass = "green-text";
  } else if (normalized.includes("повтор")) {
    resultClass = "orange-text";
  } else if (normalized.includes("не знаю")) {
    resultClass = "red-text";
  } else if (normalized.includes("не отвеч")) {
    resultClass = "gray-text";
  }

  const item = document.createElement("div");
  item.className = "question-item";

  item.innerHTML = ` 
    <div class="question-top">
      <span class="question-topic">${card.topic}</span>
      <span class="question-result ${resultClass}">${result}</span>
    </div>
    <h3>${card.question}</h3>
    <p>${card.answer}</p>
  `;

  questionsContainer.appendChild(item);
});
