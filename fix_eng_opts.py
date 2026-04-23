import json, re

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Translate sentence-length English options
opt_translations = {
    # Q145 - hashing vs encryption
    "Hashing is one-way (cannot be reversed); encryption is two-way (can be decrypted)":
        "ハッシュは一方向(不可逆); 暗号化は双方向(復号可能)",
    "Encryption is one-way; hashing is two-way":
        "暗号化が一方向; ハッシュが双方向",
    "Hashing produces variable-length output; encryption produces fixed-length output":
        "ハッシュは可変長出力; 暗号化は固定長出力",
    
    # Q146 - XSS
    "A server-side code injection attack":
        "サーバーサイドのコード注入攻撃",
    "A database attack technique":
        "データベース攻撃手法",
    "A method to steal Wi-Fi passwords":
        "Wi-Fiパスワードを盗む手法",
    
    # Q147 - CIA triad
    "Confidentiality, Integrity, Availability":
        "機密性、完全性、可用性",
    "Compliance, Identity, Authentication":
        "コンプライアンス、識別、認証",
    "Cryptography, Integrity, Access":
        "暗号化、完全性、アクセス",
    "Control, Isolation, Audit":
        "制御、分離、監査",
    
    # Q148 - CSRF
    "Stealing session cookies directly":
        "セッションCookieの直接盗用",
    "A server-side vulnerability":
        "サーバーサイドの脆弱性",
    "An attack targeting database integrity":
        "データベース完全性を狙う攻撃",
    
    # Q151 - OWASP
    "A list of top ten programming languages":
        "トップ10プログラミング言語のリスト",
    "A database of known vulnerabilities":
        "既知の脆弱性のデータベース",
    "A security certification standard":
        "セキュリティ認証標準",
    
    # Q152 - honeypot
    "A decoy system designed to attract and detect unauthorized access attempts":
        "不正アクセスを誘引・検出するために設計されたおとりシステム",
    "A secure backup system":
        "安全なバックアップシステム",
    "An encrypted file storage":
        "暗号化ファイルストレージ",
    
    # Q161 - zero-day
    "A vulnerability that is unknown to the vendor and has no available patch":
        "ベンダーに未知で利用可能なパッチがない脆弱性",
    "A vulnerability discovered on January 1st":
        "1月1日に発見された脆弱性",
    "A vulnerability with zero impact":
        "影響度がゼロの脆弱性",
    "A type of malware":
        "マルウェアの一種",
}

changed = 0
for q in data:
    for opt in q.get('options', []):
        ot = opt.get('text', '')
        if ot in opt_translations:
            opt['text'] = opt_translations[ot]
            changed += 1

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Translated {changed} options')
