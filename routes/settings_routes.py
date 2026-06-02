from flask import Blueprint, render_template
from data.directions import directions_data

settings_routes = Blueprint("settings_routes", __name__)

@settings_routes.route("/settings/<direction>")
def settings(direction):
    current_direction = directions_data.get(direction)

    if not current_direction:
        current_direction = directions_data["backend"]

    return render_template(
        "settings.html",
        direction=current_direction,
        direction_key=direction
    )
