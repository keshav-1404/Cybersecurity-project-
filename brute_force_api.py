from flask import Flask, request, jsonify
from flask_cors import CORS
import itertools
import string
import time

app = Flask(__name__)
CORS(app)


def common_guess(word: str) -> str | None:
    try:
        with open('words.txt', 'r') as words:
            word_list = words.read().splitlines()
        for i, match in enumerate(word_list, start=1):
            if match == word:
                return f'Common match: "{match}" found at position #{i}'
    except FileNotFoundError:
        return None

def brute_force(word: str, length: int, digits: bool = False, symbols: bool = False) -> str | None:
    chars = string.ascii_lowercase
    if digits:
        chars += string.digits
    if symbols:
        chars += string.punctuation

    attempts = 0
    for guess_tuple in itertools.product(chars, repeat=length):
        guess = ''.join(guess_tuple)
        attempts += 1
        if guess == word:
            return f'"{word}" was cracked in {attempts:,} guesses.'
    return None

@app.route('/brute-force', methods=['POST'])
def simulate():
    data = request.get_json()
    password = data.get("password", "")
    digits = data.get("digits", True)
    symbols = data.get("symbols", True)

    start_time = time.perf_counter()

    result = common_guess(password)
    if result is None:
        result = brute_force(password, len(password), digits, symbols) or "There was no match..."

    duration = round(time.perf_counter() - start_time, 2)

    return jsonify({
        "password": password,
        "result": result,
        "time_taken": f"{duration}s"
    })

if __name__ == '__main__':
     app.run(debug=True)