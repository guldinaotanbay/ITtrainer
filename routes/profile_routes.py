from flask import Blueprint, render_template, session, redirect
import sqlite3

profile_routes = Blueprint("profile_routes", __name__)

@profile_routes.route("/profile")
def profile():
    if not session.get("user_id"):
        return redirect("/login")

    connection = sqlite3.connect("database/users.db")
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    cursor.execute(
        "SELECT COUNT(DISTINCT question) FROM progress WHERE user_id=?",
        (session["user_id"],)
    )
    trainings_count = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM progress WHERE user_id=?",
        (session["user_id"],)
    )
    cards_count = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM progress WHERE user_id=? AND answer_status='Знаю'",
        (session["user_id"],)
    )
    correct_answers = cursor.fetchone()[0]

    connection.close()

    return render_template(
        "profile.html",
        trainings_count=trainings_count,
        cards_count=cards_count,
        correct_answers=correct_answers,
    )
