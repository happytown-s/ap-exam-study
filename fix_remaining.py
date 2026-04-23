import json

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Fix remaining issues
fixes = {
    "If SPI (Schedule Performance Index) = 0.8, what does this indicate?":
        "SPI(スケジュール効率指数)が0.8の場合、何を示すか。",
}

for q in data:
    qt = q.get('question', '')
    if qt in fixes:
        q['question'] = fixes[qt]
        print(f'Fixed question: {qt[:60]} -> {fixes[qt][:60]}')
    
    # Fix option translations too
    for opt in q.get('options', []):
        ot = opt.get('text', '')
        if ot in fixes:
            opt['text'] = fixes[ot]

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done fixing remaining issues')
