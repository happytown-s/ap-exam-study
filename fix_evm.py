import json

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    qt = q.get('question', '')
    if 'EVM(EVM)' in qt:
        q['question'] = qt.replace('EVM(EVM)', 'EVM(Earned Value Management)')
        print(f'Fixed: {repr(qt[:80])}')
        print(f'To:    {repr(q["question"][:80])}')

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done')
