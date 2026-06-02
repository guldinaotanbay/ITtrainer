from flask import Blueprint, render_template, request, session, redirect
from database.auth_db import get_connection

results_routes = Blueprint("results_routes", __name__)

@results_routes.route("/results", methods=["GET", "POST"])
def results():
    if not session.get("user_id"):
        return redirect("/login")

    if request.method == "POST":
        answers = request.form.getlist("answers")
        questions = request.form.getlist("questions")
        topics = request.form.getlist("topics")
        direction = request.form.get("direction", "Frontend")

        connection = get_connection()
        cursor = connection.cursor()

        try:
            for idx, question in enumerate(questions):
                cursor.execute(
                    """
                    INSERT INTO progress (
                        user_id,
                        direction,
                        topic,
                        level,
                        question,
                        answer_status
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        session["user_id"],
                        direction,
                        topics[idx],
                        "Junior",
                        question,
                        answers[idx]
                    )
                )
            connection.commit()
        finally:
            connection.close()

    return render_template("results.html")
