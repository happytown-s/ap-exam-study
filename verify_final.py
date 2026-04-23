import json, re

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def is_english(s):
    if not s:
        return False
    # Check if the string starts with English (5+ consecutive Latin chars in first 20)
    return bool(re.search(r'[a-zA-Z]{5,}', s[:20]))

print("=== REMAINING ENGLISH QUESTIONS ===")
q_count = 0
for i, q in enumerate(data):
    qt = q.get('question', '')
    if is_english(qt) and (qt.startswith('What ') or qt.startswith('In ') or qt.startswith('How ') or qt.startswith('Why ')):
        q_count += 1
        print(f'  [{i}] {qt[:100]}')

print(f'\nPure English questions remaining: {q_count}')

print("\n=== REMAINING ENGLISH OPTIONS ===")
o_count = 0
for i, q in enumerate(data):
    for j, opt in enumerate(q.get('options', [])):
        ot = opt.get('text', '')
        if is_english(ot):
            o_count += 1
            # Check if it's already Japanese (contains Japanese chars)
            has_jp = bool(re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]', ot))
            if not has_jp and (ot.startswith('The ') or ot.startswith('A ') or ot.startswith('An ') or ot.startswith('To ')):
                print(f'  [Q{i} O{j}] {ot[:100]}')

print(f'\nPure English options remaining: {o_count}')
print(f'Total questions: {len(data)}')
