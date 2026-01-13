import json
import re

matches = re.compile("[^A-Z]")

CROWDLE_ALLOWED_GUESSES = set()

with open("wordlist.txt") as file:
    for line in file.readlines():
        WORD = line.upper().strip()
        if not WORD.isalpha():
            continue

        word = WORD.replace("IJ", "Ĳ")
        CROWDLE_ALLOWED_GUESSES.add(word)


with open("crowdle-possible-targets.jsonld", "rb") as file:
    contents = json.load(file)
    for word in contents["answer"]:
        if word not in CROWDLE_ALLOWED_GUESSES:
            print(f"CROW's {word} not in OpenTaal")
        CROWDLE_ALLOWED_GUESSES.add(word)

with (
    open("allowed-5.txt", "w") as allowed_5,
    open("allowed-6.txt", "w") as allowed_6,
    open("allowed-7.txt", "w") as allowed_7,
    open("allowed-8.txt", "w") as allowed_8,
):
    for word in sorted(CROWDLE_ALLOWED_GUESSES):
        length = len(word)
        match len(word):
            case 5:
                allowed_5.write(word + "\n")
            case 6:
                allowed_6.write(word + "\n")
            case 7:
                allowed_7.write(word + "\n")
            case 8:
                allowed_8.write(word + "\n")
