import json

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Fix English options for SPI question
opt_fixes = {
    "The project is behind schedule, completing only 80% of planned work":
        "プロジェクトはスケジュール遅延で、計画作業の80%しか完了していない",
    "The project is exactly on schedule":
        "プロジェクトは計画通りに進んでいる",
    "The project has been cancelled":
        "プロジェクトはキャンセルされた",
}

changed = 0
for q in data:
    for opt in q.get('options', []):
        ot = opt.get('text', '')
        if ot in opt_fixes:
            opt['text'] = opt_fixes[ot]
            changed += 1
            print(f'Fixed option: {ot[:60]}')

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Fixed {changed} options')
