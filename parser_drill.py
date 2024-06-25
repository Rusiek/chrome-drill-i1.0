import re
import json

def parse_question_block(block):
    lines = block.strip().split('\n')
    question = lines[0].split(']', 1)[1].strip()
    answers = {}
    option_index = 1

    for line in lines[1:]:
        match = re.match(r'(>>>)*([A-Z])\) (.+)', line)
        if match:
            correct = '+' if match.group(1) else '-'
            text = match.group(3).strip()
            answers[str(option_index)] = [correct, text]
            option_index += 1
    
    return {
        "Q": question,
        "A": answers
    }

def process_data_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        data = file.read()

    question_blocks = data.strip().split('\n\n')
    questions = {str(idx): parse_question_block(block) for idx, block in enumerate(question_blocks)}

    return json.dumps(questions, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    import sys
    output_json = process_data_file(sys.argv[1])
    with open('output.json', 'w', encoding='utf-8') as json_file:
        json_file.write(output_json)

    print("Dane zostały przetworzone i zapisane w pliku output.json")
