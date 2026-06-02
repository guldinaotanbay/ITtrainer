from flask import Blueprint, render_template, request, redirect, session
from database.auth_db import get_connection
from datetime import datetime

auth_routes = Blueprint("auth_routes", __name__)


@auth_routes.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT * FROM users
            WHERE username=? AND password=?
            """,
            (username, password)
        )
        user = cursor.fetchone()
        connection.close()

        if user:
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            session["created_at"] = user["created_at"]
            return redirect("/")

    return render_template("login.html")


@auth_routes.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        created_at = datetime.now().strftime("%d.%m.%Y")

        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO users(username, password, created_at)
            VALUES (?, ?, ?)
            """,
            (username, password, created_at)
        )
        connection.commit()
        connection.close()

        return redirect("/login")

    return render_template("register.html")


@auth_routes.route("/logout")
def logout():
    session.clear()
    return redirect("/")
