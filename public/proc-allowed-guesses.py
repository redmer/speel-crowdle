import json
import re
import unicodedata

matches = re.compile("[^A-Z]")

CROWDLE_ALLOWED_GUESSES = set()
MAX_WORD_LENGTH = 8


def asciify(s: str):
    n = unicodedata.normalize("NFKD", s)
    return "".join([c for c in n if not unicodedata.combining(c)])


with open("wordlist.txt") as file:
    for line in file.readlines():
        WORD = line.upper().strip().replace("-", "").replace(" ", "").replace("'", "")
        if not WORD.isalpha():
            continue
        WORD = asciify(WORD)
        word = WORD.replace("IJ", "Ĳ")
        CROWDLE_ALLOWED_GUESSES.add(word)


with open("crowdle-possible-targets.jsonld", "rb") as file:
    contents = json.load(file)
    for word in contents["answer"]:
        if word not in CROWDLE_ALLOWED_GUESSES:
            print(f"CROW's {word} not in OpenTaal")
        CROWDLE_ALLOWED_GUESSES.add(word)


with (
    open("allowed-1.txt", "w") as allowed_1,
    open("allowed-2.txt", "w") as allowed_2,
    open("allowed-3.txt", "w") as allowed_3,
    open("allowed-4.txt", "w") as allowed_4,
    open("allowed-5.txt", "w") as allowed_5,
    open("allowed-6.txt", "w") as allowed_6,
    open("allowed-7.txt", "w") as allowed_7,
    open("allowed-8.txt", "w") as allowed_8,
):
    for word in sorted(CROWDLE_ALLOWED_GUESSES):
        match len(word):
            case 1:
                allowed_1.write(word + "\n")
            case 2:
                allowed_2.write(word + "\n")
            case 3:
                allowed_3.write(word + "\n")
            case 4:
                allowed_4.write(word + "\n")
            case 5:
                allowed_5.write(word + "\n")
            case 6:
                allowed_6.write(word + "\n")
            case 7:
                allowed_7.write(word + "\n")
            case 8:
                allowed_8.write(word + "\n")
