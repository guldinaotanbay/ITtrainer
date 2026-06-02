import json
import random


def load_flashcards(path):
    """
    Загружает список флеш-карточек из JSON-файла.

    :param path: Путь к JSON-файлу с данными карточек
    :return: Список словарей с вопросами и ответами
    """
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_random_flashcards(questions, count=10):
    """
    Получает случайную подвыборку флеш-карточек.

    :param questions: Список всех карточек
    :param count: Количество карточек для выбора (по умолчанию 10)
    :return: Подсписок карточек случайного порядка длиной count или меньше
    """
    sample_size = min(count, len(questions))
    return random.sample(questions, sample_size)
