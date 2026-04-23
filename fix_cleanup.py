import json

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

q_fixes = {
    # Fix English fragments in translated questions
    "分散データベースにおける結果整合性(イベントual consistency)とは何か。":
        "分散データベースにおける結果整合性(eventual consistency)とは何か。",
    "冪等性と Exactly-Once 配信の違いはどれか。":
        "冪等性と「Exactly-Once(正確に1回)配信」の違いはどれか。",
    "Infrastructure as Code(IaC)とは何か。":
        "Infrastructure as Code(IaC、インフラ構成のコード化)とは何か。",
    "Twelve-Factor Appメソドロジーとは何か。":
        "Twelve-Factor App(12ファクターアプリ)メソドロジーとは何か。",
}

# These need to be found by partial match since the Japanese parts are mojibake in our view
# Let me search by English fragments
for q in data:
    qt = q.get('question', '')
    
    # Fix ITガバナンス with English "concern"
    if 'concern' in qt and 'ガバナンス' in qt:  # won't match due to encoding, try ASCII
        pass
    
    # Fix EVM with English "earned value"
    if 'earned value' in qt:
        # Replace the English portion
        qt_new = qt.replace('earned value management', 'EVM').replace('達成価値', '達成価値')
        q['question'] = qt_new
        print(f'Fixed: earned value -> {repr(qt_new[:60])}')
    
    # Fix "eventual consistency" 
    if 'イベントual consistency' in qt:
        q['question'] = qt.replace('イベントual consistency', '結果整合性(eventual consistency)')
        print(f'Fixed: eventual consistency')

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done with cleanup')
