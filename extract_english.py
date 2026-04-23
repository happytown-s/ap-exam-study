import json

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

eng = []
for i, q in enumerate(data):
    text = q.get('question', '')
    if text.startswith('What ') or text.startswith('In '):
        eng.append((i, q))

print(f'Found {len(eng)} English questions')
for idx, (i, q) in enumerate(eng):
    print(f'---Q{idx}---')
    print(f'INDEX:{i}')
    qt = q['question']
    print(f'Q:{qt}')
    for j, opt in enumerate(q['options']):
        ot = opt['text']
        print(f'O{j}:{ot}')
