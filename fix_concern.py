import json

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    qt = q.get('question', '')
    if 'concern' in qt:
        # Replace English "concern" with Japanese equivalent
        q['question'] = qt.replace(' concern ', '')
        print(f'Fixed concern in question: {repr(qt[:80])}')

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done')
