from flask import Flask, session, redirect, request

from routes.home_routes import home_routes
from routes.settings_routes import settings_routes
from routes.flashcards_routes import flashcards_routes
from routes.results_routes import results_routes
from routes.auth_routes import auth_routes
from routes.profile_routes import profile_routes

app = Flask(__name__)
app.secret_key = "it_trainer"

blueprints = [
    home_routes,
    settings_routes,
    flashcards_routes,
    results_routes,
    auth_routes,
    profile_routes
]

for blueprint in blueprints:
    app.register_blueprint(blueprint)

@app.before_request
def check_auth():
    allowed_routes = ["/", "/login", "/register"]
    protected_prefixes = ["/settings", "/flashcards", "/results", "/profile"]

    if request.path.startswith("/static") or request.path in allowed_routes:
        return

    if any(request.path.startswith(prefix) for prefix in protected_prefixes):
        if "user_id" not in session:
            return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
