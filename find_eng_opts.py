import json, re

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def is_pure_english(s):
    if not s:
        return False
    has_jp = bool(re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]', s))
    if has_jp:
        return False
    return bool(re.search(r'[a-zA-Z]{5,}', s))

print("=== ALL ENGLISH OPTIONS ===")
eng_opts = []
for i, q in enumerate(data):
    for j, opt in enumerate(q.get('options', [])):
        ot = opt.get('text', '')
        if is_pure_english(ot):
            eng_opts.append((i, j, ot))
            print(f'  [Q{i} O{j}] {ot}')

print(f'\nTotal English options: {len(eng_opts)}')
