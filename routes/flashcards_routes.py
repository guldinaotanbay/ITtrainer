from flask import Blueprint, render_template, request
from utils.randomizer import load_flashcards, get_random_flashcards

flashcards_routes = Blueprint("flashcards_routes", __name__)

# Сопоставление тем с вопросами
TOPIC_FILE_MAP = {
    "python": "data/backend_python.json",
    "java": "data/backend_java.json",
    "javascript": "data/frontend_javascript.json",
    "ci/cd": "data/devops_cd.json",
    "docker": "data/devops_docker.json",
    "алгоритмы": "data/general_algorithms.json",
    "структуры данных": "data/general_data_structure.json",
}

@flashcards_routes.route("/flashcards")
def flashcards_page():
    topics_param = request.args.get("topics", "")
    selected_topics = [topic.strip().lower() for topic in topics_param.split(",") if topic.strip()]

    all_questions = []

    for topic in selected_topics:
        json_path = TOPIC_FILE_MAP.get(topic)
        if json_path:
            questions = load_flashcards(json_path)
            all_questions.extend(questions)

    cards_count = len(selected_topics) * 10

    flashcards = get_random_flashcards(all_questions, cards_count)

    return render_template("flashcards.html", flashcards=flashcards)
