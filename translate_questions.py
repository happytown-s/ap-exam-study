import json
import re

with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Translation map: question English -> Japanese
q_translations = {
    "What is the difference between symmetric and asymmetric key cryptography?":
        "対称鍵暗号と非対称鍵暗号の違いはどれか。",
    "What is a security audit?":
        "セキュリティ監査とは何か。",
    "What is the difference between a vulnerability and an exploit?":
        "脆弱性とエクスプロイトの違いはどれか。",
    "What is the purpose of a Certificate Authority (CA)?":
        "認証局(CA)の目的はどれか。",
    "What is the difference between TLS 1.2 and TLS 1.3?":
        "TLS 1.2とTLS 1.3の違いはどれか。",
    "What is rate limiting used for in security?":
        "セキュリティにおけるレート制限の用途はどれか。",
    "What is the concept of defense in depth?":
        "ディフェンス・イン・デプス(多層防御)の概念とは何か。",
    "What is a session hijacking attack?":
        "セッションハイジャック攻撃とは何か。",
    "What is the purpose of input validation in application security?":
        "アプリケーションセキュリティにおける入力検証の目的はどれか。",
    "What is perfect forward secrecy (PFS)?":
        "完全前方秘匿性(PFS)とは何か。",
    "What is the principle of separation of duties?":
        "職務の分離の原則とは何か。",
    "What is multi-factor authentication (MFA)?":
        "多要素認証(MFA)とは何か。",
    "What is the CAP theorem about distributed systems?":
        "分散システムにおけるCAP定理の内容はどれか。",
    "What is the primary benefit of microservices architecture over monolithic architecture?":
        "モノリシックアーキテクチャに対するマイクロサービスアーキテクチャの最大の利点はどれか。",
    "What is a load balancer's primary function in a web application architecture?":
        "Webアプリケーションアーキテクチャにおけるロードバランサーの主な機能はどれか。",
    "What is an API gateway used for in microservices architecture?":
        "マイクロサービスアーキテクチャにおけるAPIゲートウェイの用途はどれか。",
    "What is the difference between horizontal and vertical scaling?":
        "水平スケーリングと垂直スケーリングの違いはどれか。",
    "What is the Circuit Breaker pattern used for?":
        "サーキットブレーカーパターンの用途はどれか。",
    "What is event-driven architecture?":
        "イベント駆動アーキテクチャとは何か。",
    "What is eventual consistency in distributed databases?":
        "分散データベースにおける結果整合性(イベントual consistency)とは何か。",
    "What is the difference between REST and GraphQL APIs?":
        "REST APIとGraphQL APIの違いはどれか。",
    "What is a service mesh in microservices architecture?":
        "マイクロサービスアーキテクチャにおけるサービスメッシュとは何か。",
    "What is the Strangler Fig pattern?":
        "ストラングラーフィグパターンとは何か。",
    "What is the purpose of the CQRS (Command Query Responsibility Segregation) pattern?":
        "CQRS(コマンドクエリ責任分離)パターンの目的はどれか。",
    "What is the difference between stateless and stateful services?":
        "ステートレスサービスとステートフルサービスの違いはどれか。",
    "What is a message broker used for in distributed systems?":
        "分散システムにおけるメッセージブローカーの用途はどれか。",
    "What is the Saga pattern in microservices?":
        "マイクロサービスにおけるサガパターンとは何か。",
    "What is blue-green deployment?":
        "ブルーグリーンデプロイメントとは何か。",
    "What is the difference between idempotency and exactly-once delivery?":
        "冪等性と Exactly-Once 配信の違いはどれか。",
    "What is the purpose of a service registry in microservices?":
        "マイクロサービスにおけるサービスレジストリの目的はどれか。",
    "What is the difference between synchronous and asynchronous communication in microservices?":
        "マイクロサービスにおける同期通信と非同期通信の違いはどれか。",
    "What is serverless architecture?":
        "サーバーレスアーキテクチャとは何か。",
    "What is the Bulkhead pattern?":
        "バルクヘッドパターンとは何か。",
    "What is gRPC and its main advantage over REST?":
        "gRPCとは何か。またRESTに対する主な利点はどれか。",
    "What is the Sidecar pattern?":
        "サイドカーパターンとは何か。",
    "What is the primary advantage of using containers over virtual machines?":
        "仮想マシンに対するコンテナの最大の利点はどれか。",
    "What is the Backpressure pattern?":
        "バックプレッシャーパターンとは何か。",
    "What is the purpose of the Observer pattern in system design?":
        "システム設計におけるオブザーバーパターンの目的はどれか。",
    "What is Infrastructure as Code (IaC)?":
        "Infrastructure as Code(IaC)とは何か。",
    "What is the twelve-factor app methodology?":
        "Twelve-Factor Appメソドロジーとは何か。",
    "What is a canary release?":
        "カナリアリリースとは何か。",
    "What is the role of a reverse proxy in web architecture?":
        "Webアーキテクチャにおけるリバースプロキシの役割はどれか。",
    "In PERT/CPM, what is the critical path?":
        "PERT/CPMにおけるクリティカルパス(最長経路)とは何か。",
    "What does the Earned Value (EV) in EVM represent?":
        "EVM(earned value management)における達成価値(EV)は何を表すか。",
    "What is the formula for calculating the variance at completion (VAC)?":
        "完了時差異(VAC)の計算式はどれか。",
    "What is the purpose of a Work Breakdown Structure (WBS)?":
        "WBS(作業分解構造)の目的はどれか。",
    "What does the CPI (Cost Performance Index) of 1.25 indicate?":
        "CPI(コスト効率指数)が1.25であることは何を示すか。",
    "What is the difference between PERT and CPM?":
        "PERTとCPMの違いはどれか。",
    "What is float (slack) in project management?":
        "プロジェクトマネジメントにおけるフロート(余裕時間)とは何か。",
    "In agile methodologies, what is a sprint retrospective?":
        "アジャイル手法におけるスプリントレトロスペクティブ(振り返り)とは何か。",
    "What is the estimated time (te) in PERT using the three-point estimation formula?":
        "PERTの三点見積もりにおける期待時間(te)はどれか。",
    "What is the purpose of risk management in software projects?":
        "ソフトウェアプロジェクトにおけるリスクマネジメントの目的はどれか。",
    "What is the difference between quality assurance (QA) and quality control (QC)?":
        "品質保証(QA)と品質管理(QC)の違いはどれか。",
    "What is the EAC (Estimate at Completion) formula when current variances are atypical?":
        "現在の差異が非定型の場合、EAC(完成時総コスト見積)の計算式はどれか。",
    "What is a Gantt chart primarily used for?":
        "ガントチャートの主な用途はどれか。",
    "In agile development, what is velocity used for?":
        "アジャイル開発におけるベロシティの用途はどれか。",
    "What is the difference between effort and duration in project estimation?":
        "プロジェクト見積もりにおける工数(effort)と期間(duration)の違いはどれか。",
    "What is a project charter?":
        "プロジェクトチャーターとは何か。",
    "What is the To-Complete Performance Index (TCPI)?":
        "TCPI(残作業パフォーマンス指数)とは何か。",
    "In Scrum, what is the maximum recommended sprint duration?":
        "Scrumにおいて推奨されるスプリント期間の最大値はどれか。",
    "What is Monte Carlo simulation used for in project management?":
        "プロジェクトマネジメントにおけるモンテカルロシミュレーションの用途はどれか。",
    "What is the difference between a milestone and a deliverable?":
        "マイルストーンと成果物(デリバラブル)の違いはどれか。",
    "What is the definition of done (DoD) in Scrum?":
        "Scrumにおける完了の定義(DoD)とは何か。",
    "What is crashing in schedule management?":
        "スケジュール管理におけるクラッシングとは何か。",
    "What is fast-tracking in project scheduling?":
        "プロジェクトスケジューリングにおけるファストトラッキングとは何か。",
    "What is the purpose of a change control board (CCB)?":
        "CCB(変更管理委員会)の目的はどれか。",
    "In EVM, what does SV (Schedule Variance) of -$50,000 indicate?":
        "EVMにおいてSV(スケジュール差異)が-50,000ドルであることは何を示すか。",
    "What is Porter's Five Forces model used for?":
        "ポーターの五つの力モデルの用途はどれか。",
    "What is an SLA (Service Level Agreement)?":
        "SLA(サービス品質水準合意)とは何か。",
    "What is the difference between a patent and a copyright?":
        "特許と著作権の違いはどれか。",
    "What is SWOT analysis used for?":
        "SWOT分析の用途はどれか。",
    "What is ISO/IEC 27001?":
        "ISO/IEC 27001とは何か。",
    "In business strategy, what is a value chain analysis?":
        "ビジネス戦略におけるバリューチェーン分析とは何か。",
    "What is the difference between a trademark and a trade secret?":
        "商標と営業秘密(トレードシークレット)の違いはどれか。",
    "What is IT governance primarily concerned with?":
        "ITガバナンスは主に何に concern しているか。",
    "What is the purpose of a non-disclosure agreement (NDA)?":
        "NDA(秘密保持契約)の目的はどれか。",
    "What is a business model canvas?":
        "ビジネスモデルキャンバスとは何か。",
    "What does the Personal Information Protection Law (PIPL) regulate?":
        "個人情報保護法(PIPL)は何を規定しているか。",
    "What is the BCP (Business Continuity Plan)?":
        "BCP(事業継続計画)とは何か。",
    "What is the difference between RTO and RPO?":
        "RTOとRPOの違いはどれか。",
    "What is ITIL (Information Technology Infrastructure Library)?":
        "ITIL(ITインフラストラクチャライブラリ)とは何か。",
    "What is a CRM (Customer Relationship Management) system?":
        "CRM(顧客関係管理)システムとは何か。",
    "What is the purpose of a licensing agreement for software?":
        "ソフトウェアライセンス契約の目的はどれか。",
    "What is the concept of 'bring your own device' (BYOD) policy?":
        "BYOD(私物端末持ち込み)ポリシーの概念とは何か。",
    "What is a KPI (Key Performance Indicator)?":
        "KPI(重要業績評価指標)とは何か。",
    "What is the DRP (Disaster Recovery Plan)?":
        "DRP(災害復旧計画)とは何か。",
    "What is the difference between ERP and CRM systems?":
        "ERPとCRMシステムの違いはどれか。",
    "What is the purpose of a feasibility study?":
        "フィージビリティスタディ(実現可能性調査)の目的はどれか。",
    "What is green IT (Green Computing)?":
        "グリーンIT(環境配慮型コンピューティング)とは何か。",
    "What is the difference between a SaaS and an on-premise solution?":
        "SaaSとオンプレミスソリューションの違いはどれか。",
    "What is the purpose of an RFP (Request for Proposal)?":
        "RFP(提案依頼書)の目的はどれか。",
    "What is the difference between benchmarking and baselining?":
        "ベンチマーキングとベースライニングの違いはどれか。",
    "What is the purpose of the PDCA (Plan-Do-Check-Act) cycle?":
        "PDCAサイクルの目的はどれか。",
    "What is cloud computing defined by NIST?":
        "NISTが定義するクラウドコンピューティングとは何か。",
    "What is the difference between IaaS, PaaS, and SaaS cloud service models?":
        "IaaS、PaaS、SaaSのクラウドサービスモデルの違いはどれか。",
    "What is the role of a Chief Information Security Officer (CISO)?":
        "CISO(最高情報セキュリティ責任者)の役割はどれか。",
    "What is open-source software licensing (GPL) primarily characterized by?":
        "オープンソースソフトウェアライセンス(GPL)の主な特徴はどれか。",
    "OWASP Top 10とは何か。":
        None,  # already Japanese
}

# Option translations
o_translations = {
    # Q149 symmetric/asymmetric
    "Symmetric uses one shared key; asymmetric uses a public/private key pair":
        "対称鍵は1つの共有鍵を使用; 非対称鍵は公開鍵/秘密鍵ペアを使用",
    "Symmetric uses two keys; asymmetric uses one":
        "対称鍵は2つの鍵を使用; 非対称鍵は1つの鍵を使用",
    "Asymmetric is always more secure":
        "非対称鍵が常に安全",

    # Q150 security audit
    "A systematic evaluation of an organization's security policies, procedures, and controls":
        "組織のセキュリティポリシー、手順、統制を体系的に評価すること",
    "A type of penetration test":
        "ペネトレーションテストの一種",
    "A software update for security patches":
        "セキュリティパッチのソフトウェアアップデート",
    "An encrypted communication channel":
        "暗号化された通信チャネル",

    # Q153 vulnerability vs exploit
    "A vulnerability is a weakness; an exploit is code that takes advantage of it":
        "脆弱性は弱点; エクスプロイトはそれを悪用するコード",
    "An exploit is a weakness; a vulnerability takes advantage of it":
        "エクスプロイトは弱点; 脆弱性がそれを悪用する",
    "A vulnerability is always software; an exploit is always hardware":
        "脆弱性は常にソフトウェア; エクスプロイトは常にハードウェア",

    # Q154 CA
    "To issue and verify digital certificates that bind public keys to entity identities":
        "公開鍵をエンティティのアイデンティティに紐付けるデジタル証明書の発行と検証",
    "To store private keys":
        "秘密鍵の保存",
    "To encrypt internet traffic":
        "インターネットトラフィックの暗号化",
    "To block malicious websites":
        "悪意のあるWebサイトのブロック",

    # Q155 TLS 1.2 vs 1.3
    "TLS 1.3 removes obsolete cipher suites, reduces handshake to 1-RTT, and mandates perfect forward secrecy":
        "TLS 1.3は旧式暗号スイートを削除し、ハンドシェイクを1-RTTに短縮し、完全前方秘匿性を必須化",
    "TLS 1.2 is not secure":
        "TLS 1.2は安全でない",
    "TLS 1.3 uses UDP instead of TCP":
        "TLS 1.3はTCPの代わりにUDPを使用",
    "TLS 1.3 only works with RSA":
        "TLS 1.3はRSAのみ対応",

    # Q156 rate limiting
    "Restricting the number of requests a client can make within a time period to prevent abuse":
        "一定期間内のクライアントリクエスト数を制限し、悪用を防止",
    "Limiting network bandwidth usage":
        "ネットワーク帯域使用量の制限",
    "Compressing data before transmission":
        "送信前のデータ圧縮",
    "Encrypting data at rest":
        "保存データの暗号化",

    # Q157 defense in depth
    "Relying on a single strong firewall":
        "単一の強力なファイアウォールに依存",
    "Encrypting data multiple times with different algorithms":
        "異なるアルゴリズムで複数回データを暗号化",
    "Having multiple passwords for the same account":
        "同じアカウントに複数のパスワードを設定",

    # Q158 session hijacking
    "Stealing a valid session token to impersonate an authenticated user":
        "有効なセッショントークンを盗み、認証済みユーザーになりすます",
    "Intercepting database queries":
        "データベースクエリの傍受",
    "Overwriting server configuration files":
        "サーバー設定ファイルの上書き",
    "Creating fake user accounts":
        "偽のユーザーアカウントの作成",

    # Q159 input validation
    "To ensure that user-supplied data meets expected format, length, and type requirements":
        "ユーザー入力データが期待される形式、長さ、型の要件を満たすことを確認",
    "To improve application performance":
        "アプリケーションパフォーマンスの向上",
    "To encrypt user input":
        "ユーザー入力の暗号化",
    "To log all user actions":
        "全ユーザーアクションの記録",

    # Q160 PFS
    "Compromising a long-term key does not compromise past session keys":
        "長期鍵が漏洩しても過去のセッション鍵は漏洩しない",
    "Encrypting all future communications automatically":
        "将来の全通信を自動的に暗号化",
    "A key management protocol":
        "鍵管理プロトコル",
    "A method to detect compromised keys":
        "漏洩鍵を検出する手法",

    # Q162 separation of duties
    "Critical functions should be divided among multiple people to prevent fraud and errors":
        "重要機能を複数人に分割し、不正とエラーを防止",
    "Each person should have all necessary permissions":
        "各人に全ての必要な権限を付与",
    "Security should be handled by a single administrator":
        "セキュリティは単一の管理者が担当すべき",
    "Duties should rotate daily":
        "職務は毎日ローテーションすべき",

    # Q163 MFA
    "Requiring two or more independent verification factors: something you know, have, or are":
        "知っているもの、持っているもの、自分自身の2つ以上の独立した認証要素を要求",
    "Using multiple passwords":
        "複数のパスワードの使用",
    "Logging in from multiple devices":
        "複数デバイスからのログイン",
    "Having multiple user accounts":
        "複数のユーザーアカウントの保持",

    # Q164 CAP theorem
    "A system can provide at most two of: Consistency, Availability, Partition tolerance":
        "整合性、可用性、分断耐性のうち最大2つまでしか同時に満たせない",
    "All three properties can be simultaneously achieved":
        "3つの特性を同時に達成できる",
    "Consistency and Availability are always trade-offs":
        "整合性と可用性は常にトレードオフ",
    "Partition tolerance is optional":
        "分断耐性は任意",

    # Q165 microservices benefit
    "Independent deployment, scaling, and development of individual services":
        "個別サービスの独立したデプロイ、スケーリング、開発",
    "Reduced network communication overhead":
        "ネットワーク通信オーバーヘッドの削減",
    "Simpler deployment process":
        "よりシンプルなデプロイプロセス",
    "Better performance for single-user applications":
        "単一ユーザーアプリケーションのパフォーマンス向上",

    # Q166 load balancer
    "Distributing incoming requests across multiple servers to optimize resource utilization":
        "複数サーバーにリクエストを分散し、リソース利用を最適化",
    "Encrypting all traffic":
        "全トラフィックの暗号化",
    "Storing session data":
        "セッションデータの保存",
    "Compiling application code":
        "アプリケーションコードのコンパイル",

    # Q167 API gateway
    "A single entry point that routes requests to appropriate services and handles cross-cutting concerns":
        "リクエストを適切なサービスにルーティングし、横断的関心事を処理する単一エントリポイント",
    "A database connection pool":
        "データベース接続プール",
    "A message queue for async communication":
        "非同期通信用メッセージキュー",
    "A service registry":
        "サービスレジストリ",

    # Q168 horizontal vs vertical
    "Horizontal adds more machines; vertical adds more resources to existing machines":
        "水平はマシンを追加; 垂直は既存マシンにリソースを追加",
    "Vertical is more scalable than horizontal":
        "垂直スケーリングの方がスケーラブル",
    "Horizontal increases single machine capacity":
        "水平スケーリングは単一マシンの容量を増加",

    # Q169 circuit breaker
    "Preventing cascading failures by stopping calls to a failing service":
        "障害中のサービスへの呼び出しを停止し、連鎖障害を防止",
    "Balancing network traffic":
        "ネットワークトラフィックの分散",
    "Caching frequently accessed data":
        "頻繁にアクセスされるデータのキャッシュ",

    # Q170 event-driven
    "Components communicate by producing and consuming events asynchronously":
        "コンポーネントが非同期にイベントを生成・消費して通信",
    "Components communicate through direct synchronous function calls":
        "コンポーネントが直接的な同期関数呼び出しで通信",
    "A monolithic application with event logging":
        "イベントロギング付きモノリシックアプリケーション",
    "A database-centric architecture":
        "データベース中心のアーキテクチャ",

    # Q171 eventual consistency
    "Replicas will converge to the same state given enough time without new updates":
        "新しい更新がない場合、十分な時間後に全レプリカが同じ状態に収束",
    "All replicas are always identical at all times":
        "全レプリカは常に常に同一状態",

    # Q172 REST vs GraphQL
    "REST uses fixed endpoints; GraphQL allows clients to specify exactly what data they need":
        "RESTは固定エンドポイント; GraphQLはクライアントが必要なデータを正確に指定可能",
    "REST is always faster than GraphQL":
        "RESTは常にGraphQLより高速",
    "GraphQL does not support HTTP":
        "GraphQLはHTTPをサポートしない",
    "They are the same protocol":
        "同じプロトコル",

    # Q173 service mesh
    "An infrastructure layer for handling service-to-service communication":
        "サービス間通信を処理するインフラストラクチャ層",
    "A type of database for microservices":
        "マイクロサービス用のデータベースの一種",
    "A load balancer for HTTP traffic":
        "HTTPトラフィック用のロードバランサー",
    "A container orchestration platform":
        "コンテナオーケストレーションプラットフォーム",

    # Q174 strangler fig
    "Gradually replacing a legacy system by building new functionality alongside it and routing traffic incrementally":
        "新機能を既存システムの横に構築し、トラフィックを段階的に移行して旧システムを置換",
    "A database migration strategy":
        "データベース移行戦略",
    "A security hardening technique":
        "セキュリティ強化技術",
    "A testing strategy":
        "テスト戦略",

    # Q175 CQRS
    "Separating read and write operations into different models for optimization":
        "読み取りと書き込み操作を別モデルに分離して最適化",
    "Combining read and write operations for simplicity":
        "シンプルさのために読み書き操作を統合",
    "Encrypting all database queries":
        "全データベースクエリの暗号化",
    "Caching query results":
        "クエリ結果のキャッシュ",

    # Q176 stateless vs stateful
    "Stateless services don't store client context between requests; stateful services maintain session data":
        "ステートレスはリクエスト間でクライアントコンテキストを保存しない; ステートフルはセッションデータを維持",
    "Stateless services are always faster":
        "ステートレスサービスが常に高速",
    "Stateful services cannot be load balanced":
        "ステートフルサービスはロードバランスできない",
    "Stateless services require more memory":
        "ステートレスサービスはより多くのメモリが必要",

    # Q177 message broker
    "Decoupling services by routing and buffering messages between producers and consumers":
        "プロデューサーとコンシューマー間でメッセージをルーティング・バッファリングし、サービスを疎結合化",
    "Storing persistent application data":
        "永続的なアプリケーションデータの保存",
    "Managing user authentication":
        "ユーザー認証の管理",

    # Q178 saga
    "Managing distributed transactions across services using a sequence of local transactions with compensating actions":
        "補償アクション付きのローカルトランザクションの列でサービス間の分散トランザクションを管理",
    "A database backup strategy":
        "データベースバックアップ戦略",
    "A caching pattern":
        "キャッシュパターン",
    "A logging framework":
        "ロギングフレームワーク",

    # Q179 blue-green
    "Maintaining two identical production environments and switching between them for zero-downtime deployment":
        "2つの同一本番環境を維持し、切り替えることでダウンタイムなしデプロイを実現",
    "Deploying to a single server with backup":
        "バックアップ付き単一サーバーへのデプロイ",
    "Using blue and green color coding for log levels":
        "ログレベルに青と緑の色分けを使用",
    "A database clustering strategy":
        "データベースクラスタリング戦略",

    # Q180 idempotency vs exactly-once
    "Idempotent operations produce the same result when repeated; exactly-once ensures delivery without duplication":
        "冪等操作は繰り返しても同じ結果; Exactly-Onceは重複なく確実に配信",
    "They are the same concept":
        "同じ概念",
    "Idempotency requires exactly-once delivery":
        "冪等性にExactly-Once配信が必要",
    "Exactly-once is always achievable":
        "Exactly-Onceは常に達成可能",

    # Q181 service registry
    "A dynamic directory where services register their locations for discovery by other services":
        "サービスが自身の位置を登録し、他のサービスに発見させる動的ディレクトリ",
    "A DNS server for the internet":
        "インターネット用DNSサーバー",
    "A database schema registry":
        "データベーススキーマレジストリ",
    "A version control system":
        "バージョン管理システム",

    # Q182 sync vs async
    "Synchronous blocks the caller until a response; asynchronous does not block and uses callbacks/events":
        "同期は応答まで呼び出し元をブロック; 非同期はブロックせずコールバック/イベントを使用",
    "Synchronous is always better for microservices":
        "同期はマイクロサービスに常に適している",
    "Asynchronous is always faster":
        "非同期は常に高速",
    "They have the same performance characteristics":
        "同じパフォーマンス特性を持つ",

    # Q183 serverless
    "Cloud provider manages server infrastructure; developers focus on code deployed as functions triggered by events":
        "クラウドプロバイダーがサーバーインフラを管理; 開発者はイベントで起動する関数に集中",
    "Applications without any servers":
        "サーバーが全くないアプリケーション",
    "Client-side only applications":
        "クライアントサイドのみのアプリケーション",
    "Applications that use P2P networking":
        "P2Pネットワークを使用するアプリケーション",

    # Q184 bulkhead
    "Isolating different parts of a system so that a failure in one does not cascade to others":
        "システムの異なる部分を分離し、一部の障害が他に波及しないようにする",
    "A database partitioning strategy":
        "データベースパーティショニング戦略",
    "A network security technique":
        "ネットワークセキュリティ技術",
    "A memory management scheme":
        "メモリ管理方式",

    # Q185 gRPC
    "A high-performance RPC framework using Protocol Buffers for efficient binary serialization":
        "Protocol Buffersによる効率的なバイナリシリアライゼーションを使用する高性能RPCフレームワーク",
    "A JavaScript framework for REST APIs":
        "REST API用JavaScriptフレームワーク",
    "A GraphQL alternative using XML":
        "XMLを使用するGraphQL代替",
    "A WebSocket replacement":
        "WebSocketの代替",

    # Q186 sidecar
    "Deploying a helper container alongside the main application container to handle cross-cutting concerns":
        "横断的関心事を処理するヘルパーコンテナをメインアプリケーションに横に配置",
    "A load balancing algorithm":
        "ロードバランスアルゴリズム",
    "A database replication strategy":
        "データベースレプリケーション戦略",
    "A caching mechanism":
        "キャッシュメカニズム",

    # Q187 containers vs VMs
    "Lighter weight, faster startup, and more efficient resource utilization":
        "より軽量、高速な起動、効率的なリソース利用",
    "Better isolation and security":
        "より高い分離性とセキュリティ",
    "Support for more operating systems":
        "より多くのOSのサポート",
    "Lower hardware requirements":
        "より低いハードウェア要件",

    # Q188 backpressure
    "A mechanism for a downstream component to signal an upstream component to slow down or stop sending data":
        "下流コンポーネントが上流に送信速度の低下または停止を通知するメカニズム",
    "A network congestion control protocol":
        "ネットワーク輻輳制御プロトコル",
    "A database query optimization technique":
        "データベースクエリ最適化技術",
    "A security access control method":
        "セキュリティアクセス制御方式",

    # Q189 observer
    "Allowing objects to subscribe to and receive notifications about state changes":
        "オブジェクトが状態変化の通知を購読して受信できるようにする",
    "Encrypting communications between services":
        "サービス間通信の暗号化",
    "Load balancing requests":
        "リクエストのロードバランス",
    "Storing event logs":
        "イベントログの保存",

    # Q190 IaC
    "Managing and provisioning infrastructure through machine-readable configuration files":
        "機械可読な設定ファイルでインフラストラクチャを管理・プロビジョニング",
    "Writing infrastructure in assembly language":
        "アセンブリ言語でのインフラ記述",
    "Manually configuring servers":
        "サーバーの手動設定",
    "Using a GUI for deployment":
        "GUIでのデプロイ",

    # Q191 twelve-factor
    "Best practices for building cloud-native, portable, and maintainable SaaS applications":
        "クラウドネイティブでポータブル、保守性の高いSaaSアプリケーション構築のベストプラクティス",
    "A testing framework":
        "テストフレームワーク",
    "A security standard":
        "セキュリティ標準",

    # Q192 canary release
    "Gradually rolling out a new version to a small subset of users before full deployment":
        "フルデプロイ前に少数ユーザーに新バージョンを段階的に展開",
    "A type of database migration":
        "データベース移行の一種",
    "A monitoring tool":
        "監視ツール",
    "A deployment rollback mechanism":
        "デプロイロールバックメカニズム",

    # Q193 reverse proxy
    "Sitting between clients and servers, forwarding requests to backend servers and providing caching, SSL termination, and compression":
        "クライアントとサーバー間に位置し、バックエンドにリクエストを転送。キャッシュ、SSL終端、圧縮を提供",
    "Forwarding requests from internal network to the internet":
        "内部ネットワークからインターネットへのリクエスト転送",
    "Blocking all incoming traffic":
        "全着信トラフィックのブロック",
    "Providing DNS resolution":
        "DNS解決の提供",

    # Q194 critical path
    "The longest path through the project network that determines the minimum project duration":
        "プロジェクトの最小所要期間を決定するネットワーク上の最長経路",
    "The shortest path through the network":
        "ネットワーク上の最短経路",
    "The path with the most activities":
        "最も多くのアクティビティを含む経路",
    "The path with the highest cost":
        "最も高いコストの経路",

    # Q195 EV
    "The budgeted cost of work actually completed":
        "実際に完了した作業の予定コスト",
    "The actual cost of work completed":
        "完了した作業の実際のコスト",
    "The total project budget":
        "プロジェクトの総予算",
    "The planned cost of work scheduled":
        "予定された作業の計画コスト",

    # Q197 VAC
    "VAC = BAC - EAC":
        "VAC = BAC - EAC",
    "VAC = EV - AC":
        "VAC = EV - AC",
    "VAC = PV - EV":
        "VAC = PV - EV",
    "VAC = BAC / SPI":
        "VAC = BAC / SPI",

    # Q198 WBS
    "Decomposing the total project scope into manageable, hierarchical work packages":
        "プロジェクト全体の範囲を管理可能な階層的なワークパッケージに分解",
    "Creating a project schedule":
        "プロジェクトスケジュールの作成",
    "Estimating project costs":
        "プロジェクトコストの見積もり",
    "Assigning team members":
        "チームメンバーの割り当て",

    # Q199 CPI
    "The project is under budget, earning $1.25 of value for every $1 spent":
        "プロジェクトは予算内で、1ドルあたり1.25ドルの価値を生み出している",
    "The project is over budget":
        "プロジェクトは予算超過",
    "The project is exactly on budget":
        "プロジェクトは予算ぴったり",
    "The project schedule is delayed":
        "プロジェクトスケジュールが遅延",

    # Q200 PERT vs CPM
    "PERT uses probabilistic time estimates (optimistic, most likely, pessimistic); CPM uses deterministic single-point estimates":
        "PERTは確率的時間見積もり(楽観・最頻・悲観)を使用; CPMは決定論的単一ポイント見積もりを使用",
    "PERT is for software; CPM is for construction":
        "PERTはソフトウェア用; CPMは建設用",
    "CPM is probabilistic; PERT is deterministic":
        "CPMは確率的; PERTは決定論的",

    # Q201 float
    "The amount of time an activity can be delayed without delaying the project end date":
        "プロジェクト完了日を遅らせずにアクティビティを遅延できる時間",
    "The total budget reserve":
        "総予算の予備費",
    "The number of resources available":
        "利用可能なリソース数",
    "The project completion margin":
        "プロジェクト完了の余裕",

    # Q202 sprint retrospective
    "A meeting at the end of a sprint to reflect on what went well, what could improve, and action items":
        "スプリント終了時に何が上手くいったか、改善点、アクションアイテムを振り返るミーティング",
    "A review of the product backlog":
        "プロダクトバックログのレビュー",
    "A planning meeting for the next sprint":
        "次スプリントの計画ミーティング",
    "A demo of completed features to stakeholders":
        "ステークホルダーへの完了機能のデモ",

    # Q203 PERT te
    "te = (O + 4M + P) / 6":
        "te = (O + 4M + P) / 6",
    "te = (O + M + P) / 3":
        "te = (O + M + P) / 3",
    "te = (O + P) / 2":
        "te = (O + P) / 2",
    "te = (4M + P) / 5":
        "te = (4M + P) / 5",

    # Q204 risk management
    "Identifying, analyzing, and mitigating potential risks to minimize their impact on project objectives":
        "潜在的リスクを識別・分析・軽減し、プロジェクト目標への影響を最小化",
    "Eliminating all project risks":
        "全プロジェクトリスクの除去",
    "Creating a project schedule":
        "プロジェクトスケジュールの作成",
    "Estimating project costs":
        "プロジェクトコストの見積もり",

    # Q205 QA vs QC
    "QA is process-focused prevention; QC is product-focused detection":
        "QAはプロセス重視の予防; QCは製品重視の検出",
    "QA tests the product; QC manages processes":
        "QAが製品をテスト; QCがプロセスを管理",
    "QC is more important than QA":
        "QCはQAより重要",

    # Q206 EAC atypical
    "EAC = AC + (BAC - EV)":
        "EAC = AC + (BAC - EV)",
    "EAC = BAC / CPI":
        "EAC = BAC / CPI",
    "EAC = AC + EV":
        "EAC = AC + EV",
    "EAC = BAC * CPI":
        "EAC = BAC * CPI",

    # Q207 Gantt chart
    "Visualizing project schedule by showing task start/end dates, durations, and dependencies":
        "タスクの開始/終了日、期間、依存関係を表示し、プロジェクトスケジュールを可視化",
    "Managing project budgets":
        "プロジェクト予算の管理",
    "Tracking project risks":
        "プロジェクトリスクの追跡",
    "Documenting requirements":
        "要件の文書化",

    # Q208 velocity
    "Measuring the amount of work a team completes per sprint for future planning":
        "将来の計画のためにスプリントあたりのチーム完了作業量を測定",
    "Measuring individual developer productivity":
        "個人開発者の生産性測定",
    "Calculating project costs":
        "プロジェクトコストの計算",
    "Determining project deadlines":
        "プロジェクト期限の決定",

    # Q209 effort vs duration
    "Effort is the total work required; duration is the calendar time needed considering resource availability":
        "工数は必要な総作業量; 期間はリソース利用可能性を考慮したカレンダー時間",
    "Duration is the work required; effort is the calendar time":
        "期間は必要な作業量; 工数はカレンダー時間",
    "Effort is always greater than duration":
        "工数は常に期間より大きい",

    # Q210 project charter
    "A formal document authorizing the project and giving the project manager authority":
        "プロジェクトを承認し、プロジェクトマネージャーに権限を与える正式文書",
    "A detailed project schedule":
        "詳細なプロジェクトスケジュール",
    "A budget breakdown":
        "予算内訳",
    "A risk register":
        "リスクレジスタ",

    # Q211 TCPI
    "The projected cost performance needed to complete the project within the approved budget":
        "承認済み予算内でプロジェクトを完了するために必要な将来のコスト効率",
    "The actual performance to date":
        "現時点までの実際のパフォーマンス",
    "The total remaining budget":
        "残りの総予算",
    "The variance from the original plan":
        "当初計画からの差異",

    # Q212 sprint duration
    "One month (4 weeks)":
        "1ヶ月(4週間)",
    "Two months":
        "2ヶ月",
    "One week":
        "1週間",
    "Three months":
        "3ヶ月",

    # Q213 Monte Carlo
    "Estimating project completion probability by running thousands of simulations with varied inputs":
        "様々に入力を変えた数千回のシミュレーションでプロジェクト完了確率を推定",
    "Optimizing resource allocation":
        "リソース配分の最適化",
    "Creating project schedules":
        "プロジェクトスケジュールの作成",
    "Tracking project progress":
        "プロジェクト進捗の追跡",

    # Q214 milestone vs deliverable
    "A milestone is a significant event or checkpoint; a deliverable is a tangible output produced":
        "マイルストーンは重要なイベントやチェックポイント; 成果物は生産された有形の出力",
    "A milestone is a deliverable with a deadline":
        "マイルストーンは期限付き成果物",
    "A deliverable is always a milestone":
        "成果物は常にマイルストーン",

    # Q215 DoD
    "A shared checklist of criteria that must be met for a product backlog item to be considered complete":
        "プロダクトバックログアイテムが完了と見なされるための共有チェックリスト",
    "The project deadline":
        "プロジェクトの期限",
    "The sprint review date":
        "スプリントレビュー日",
    "The sprint goal statement":
        "スプリントゴールのステートメント",

    # Q216 crashing
    "Adding resources to critical path activities to shorten the project duration at increased cost":
        "クリティカルパスのアクティビティにリソースを追加し、コスト増でプロジェクト期間を短縮",
    "Removing non-critical activities":
        "非クリティカルアクティビティの削除",
    "Extending the project timeline":
        "プロジェクトタイムラインの延長",
    "Reducing project scope":
        "プロジェクト範囲の縮小",

    # Q217 fast-tracking
    "Performing critical path activities in parallel that were originally planned sequentially":
        "当初順次計画されていたクリティカルパスアクティビティを並行して実行",
    "Adding more resources to all activities":
        "全アクティビティにリソースを追加",
    "Skipping quality assurance steps":
        "品質保証ステップの省略",
    "Reducing project scope":
        "プロジェクト範囲の縮小",

    # Q218 CCB
    "To formally review and approve/reject proposed changes to the project scope, schedule, or budget":
        "プロジェクトの範囲、スケジュール、予算に対する変更提案を正式に審査・承認/却下",
    "To write code for the project":
        "プロジェクトのコード作成",
    "To test software quality":
        "ソフトウェア品質のテスト",
    "To manage team assignments":
        "チーム割り当ての管理",

    # Q219 SV
    "The project is $50,000 behind the planned schedule (EV < PV)":
        "プロジェクトは計画より50,000ドル遅延している(EV < PV)",
    "The project is $50,000 under budget":
        "プロジェクトは予算より50,000ドル少ない",
    "The project is $50,000 over budget":
        "プロジェクトは予算より50,000ドル超過",
    "The project is ahead of schedule":
        "プロジェクトは計画より進んでいる",

    # Q220 Porter's Five Forces
    "Analyzing industry competitiveness and profitability by examining five competitive forces":
        "5つの競争力を検討して業界の競争力と収益性を分析",
    "Analyzing internal company strengths":
        "企業内部の強みの分析",
    "Evaluating employee performance":
        "従業員パフォーマンスの評価",
    "Assessing financial risk":
        "財務リスクの評価",

    # Q221 SLA
    "A formal contract defining the expected level of service, including uptime, response time, and penalties":
        "稼働率、応答時間、ペナルティを含む期待されるサービス水準を定義する正式契約",
    "An internal team meeting agenda":
        "内部チームミーティング議題",
    "A software license agreement":
        "ソフトウェアライセンス契約",
    "A project timeline document":
        "プロジェクトタイムライン文書",

    # Q222 patent vs copyright
    "Patents protect inventions and processes; copyrights protect original creative works":
        "特許は発明とプロセスを保護; 著作権は独創的な創作物を保護",
    "Patents are for books; copyrights are for machines":
        "特許は書籍用; 著作権は機械用",
    "They provide identical protection":
        "同じ保護を提供",
    "Copyrights last longer than patents":
        "著作権は特許より長期間有効",

    # Q223 SWOT
    "Evaluating Strengths, Weaknesses, Opportunities, and Threats of a business or project":
        "ビジネスやプロジェクトの強み、弱み、機会、脅威を評価",
    "Measuring software quality":
        "ソフトウェア品質の測定",
    "Calculating financial ratios":
        "財務比率の計算",
    "Managing project risks":
        "プロジェクトリスクの管理",

    # Q224 ISO 27001
    "An international standard for information security management systems (ISMS)":
        "情報セキュリティ管理システム(ISMS)の国際規格",
    "A software development methodology":
        "ソフトウェア開発手法",
    "A database management standard":
        "データベース管理標準",

    # Q225 value chain
    "Identifying primary and support activities that create value for customers and competitive advantage":
        "顧客に価値を創造し、競争優位性を生む主要活動と支援活動を特定",
    "A supply chain management technique":
        "サプライチェーン管理手法",
    "A financial analysis method":
        "財務分析方法",
    "A quality assurance process":
        "品質保証プロセス",

    # Q226 trademark vs trade secret
    "Trademarks protect brand identifiers; trade secrets protect confidential business information":
        "商標はブランド識別子を保護; 営業秘密は機密事業情報を保護",
    "Trademarks require registration; trade secrets cannot be registered":
        "商標は登録が必要; 営業秘密は登録不可",
    "Trade secrets expire after 20 years":
        "営業秘密は20年後に失効",

    # Q227 IT governance
    "Ensuring IT strategy aligns with business objectives and IT resources are managed responsibly":
        "IT戦略がビジネス目標と一致し、ITリソースが責任を持って管理されることを確保",
    "Writing software code":
        "ソフトウェアコードの作成",
    "Managing physical servers":
        "物理サーバーの管理",
    "Designing network topologies":
        "ネットワークトポロジーの設計",

    # Q228 NDA
    "Legally binding parties to keep confidential information secret":
        "秘密情報を秘密に保つ法的拘束力のある契約",
    "Granting permission to use intellectual property":
        "知的財産の使用許可",
    "Defining service levels":
        "サービス水準の定義",
    "Outsourcing technical support":
        "テクニカルサポートの外部委託",

    # Q229 business model canvas
    "A strategic management template for developing new or documenting existing business models":
        "新規ビジネスモデルの開発や既存モデルの文書化に使用する戦略管理テンプレート",
    "A financial spreadsheet":
        "財務スプレッドシート",
    "A project planning tool":
        "プロジェクト計画ツール",
    "A software architecture diagram":
        "ソフトウェアアーキテクチャ図",

    # Q230 PIPL
    "The handling of personal information by business operators, including collection, use, and disclosure":
        "事業者による個人情報の取扱い(収集、利用、開示を含む)",
    "Intellectual property rights for software":
        "ソフトウェアの知的財産権",
    "Network infrastructure standards":
        "ネットワークインフラ標準",
    "Financial reporting requirements":
        "財務報告要件",

    # Q231 BCP
    "A plan to maintain critical business operations during and after a disaster":
        "災害時および災害後に重要な事業運営を維持する計画",
    "A software development plan":
        "ソフトウェア開発計画",
    "A budget planning document":
        "予算計画文書",
    "A marketing strategy":
        "マーケティング戦略",

    # Q232 RTO vs RPO
    "RTO is the maximum acceptable downtime; RPO is the maximum acceptable data loss in time":
        "RTOは許容される最大ダウンタイム; RPOは許容される最大データ損失時間",
    "RTO measures data loss; RPO measures downtime":
        "RTOはデータ損失を測定; RPOはダウンタイムを測定",
    "RPO is always longer than RTO":
        "RPOは常にRTOより長い",

    # Q233 ITIL
    "A framework of best practices for IT service management (ITSM)":
        "ITサービス管理(ITSM)のベストプラクティスフレームワーク",
    "A programming language":
        "プログラミング言語",
    "A hardware standard":
        "ハードウェア標準",
    "A database management system":
        "データベース管理システム",

    # Q234 CRM
    "Software for managing company interactions with current and potential customers":
        "現在および見込み顧客との企業インタラクションを管理するソフトウェア",
    "A project management tool":
        "プロジェクト管理ツール",
    "A network monitoring system":
        "ネットワーク監視システム",
    "A financial accounting system":
        "財務会計システム",

    # Q235 licensing
    "Granting permission to use, distribute, or modify software under specific conditions":
        "特定の条件でソフトウェアの使用、配布、または修正を許可",
    "Guaranteeing software quality":
        "ソフトウェア品質の保証",
    "Providing free software forever":
        "永遠に無料ソフトウェアを提供",
    "Transferring software ownership":
        "ソフトウェア所有権の移転",

    # Q236 BYOD
    "Allowing employees to use personal devices for work purposes with appropriate security controls":
        "適切なセキュリティ管理のもと、従業員が私物デバイスを業務に使用することを許可",
    "Requiring employees to use company-provided devices only":
        "従業員に会社支給デバイスのみ使用を要求",
    "A hardware procurement strategy":
        "ハードウェア調達戦略",
    "A network access control method":
        "ネットワークアクセス制御方式",

    # Q237 KPI
    "A measurable value that demonstrates how effectively objectives are being achieved":
        "目標がどの程度効果的に達成されているかを示す測定可能な値",
    "A project management tool":
        "プロジェクト管理ツール",
    "A programming concept":
        "プログラミング概念",
    "A network metric":
        "ネットワーク指標",

    # Q238 DRP
    "A documented process for recovering IT infrastructure and systems after a disaster":
        "災害後にITインフラとシステムを復旧する文書化されたプロセス",
    "A database backup strategy":
        "データベースバックアップ戦略",
    "A project risk assessment":
        "プロジェクトリスク評価",
    "A financial recovery plan":
        "財務復旧計画",

    # Q239 ERP vs CRM
    "ERP manages internal business processes; CRM manages external customer interactions":
        "ERPは社内業務プロセスを管理; CRMは外部顧客とのインタラクションを管理",
    "ERP is for large companies; CRM is for small companies":
        "ERPは大企業用; CRMは中小企業用",
    "CRM manages finances; ERP manages customers":
        "CRMが財務を管理; ERPが顧客を管理",

    # Q240 feasibility study
    "Evaluating the practicality and viability of a proposed project before committing resources":
        "リソースを投資する前に提案プロジェクトの実現可能性と有効性を評価",
    "Creating a project schedule":
        "プロジェクトスケジュールの作成",
    "Assigning team members to tasks":
        "チームメンバーへのタスク割り当て",
    "Testing software functionality":
        "ソフトウェア機能のテスト",

    # Q241 green IT
    "Environmentally sustainable computing practices to reduce energy consumption and e-waste":
        "エネルギー消費と電子廃棄物を削減する環境に配慮したコンピューティング実践",
    "Using the color green in UI design":
        "UIデザインで緑色を使用",
    "A specific programming language":
        "特定のプログラミング言語",
    "A data center cooling technique only":
        "データセンターエアクーリング技術のみ",

    # Q242 SaaS vs on-premise
    "SaaS is cloud-hosted and subscription-based; on-premise is installed locally on company servers":
        "SaaSはクラウドホストでサブスクリプション方式; オンプレミスは自社サーバーにローカルインストール",
    "SaaS is less secure than on-premise":
        "SaaSはオンプレミスより安全でない",
    "On-premise is always cheaper":
        "オンプレミスは常に安い",

    # Q243 RFP
    "Soliciting detailed proposals from vendors for a specific project or service requirement":
        "特定のプロジェクトやサービス要件についてベンダーから詳細な提案を募集",
    "Requesting free software from companies":
        "企業に無料ソフトウェアを要求",
    "A legal document for filing patents":
        "特許出願の法律文書",
    "An internal budget approval form":
        "内部予算承認フォーム",

    # Q244 benchmarking vs baselining
    "Benchmarking compares against industry best practices; baselining establishes a reference point for measuring change":
        "ベンチマーキングは業界のベストプラクティスと比較; ベースライニングは変化測定のための基準点を設定",
    "Baselining compares against competitors":
        "ベースライニングは競合と比較",
    "Benchmarking is only used in software":
        "ベンチマーキングはソフトウェアのみで使用",

    # Q245 PDCA
    "A continuous improvement methodology for quality management":
        "品質管理のための継続的改善手法",
    "A software development lifecycle model":
        "ソフトウェア開発ライフサイクルモデル",
    "A project scheduling technique":
        "プロジェクトスケジューリング手法",
    "A budgeting methodology":
        "予算策定手法",

    # Q246 NIST cloud
    "On-demand network access to a shared pool of configurable computing resources with minimal management effort":
        "最小限の管理努力で構成可能なコンピューティングリソースの共有プールへのオンデマンドネットワークアクセス",
    "Only storing files on the internet":
        "インターネット上へのファイル保存のみ",
    "A specific vendor's product":
        "特定ベンダーの製品",
    "Replacing all local computing with remote servers":
        "全ローカルコンピューティングをリモートサーバーに置換",

    # Q247 IaaS vs PaaS vs SaaS
    "IaaS provides infrastructure; PaaS provides a platform; SaaS provides ready-to-use software":
        "IaaSはインフラを提供; PaaSはプラットフォームを提供; SaaSは利用可能なソフトウェアを提供",
    "They all provide the same level of abstraction":
        "全て同じレベルの抽象化を提供",
    "IaaS is for storage only; PaaS is for databases; SaaS is for email":
        "IaaSはストレージ専用; PaaSはDB用; SaaSはメール用",
    "SaaS provides the most control; IaaS the least":
        "SaaSが最も制御権があり; IaaSが最も少ない",

    # Q248 CISO
    "Leading the organization's information security program and strategy":
        "組織の情報セキュリティプログラムと戦略を主導",
    "Managing the software development team":
        "ソフトウェア開発チームの管理",
    "Handling customer support requests":
        "カスタマーサポート対応",
    "Negotiating vendor contracts":
        "ベンダー契約の交渉",

    # Q249 GPL
    "Copyleft requirement that derivative works must also be open-sourced under the same license":
        "派生物も同一ライセンスでオープンソースにするコピーレフト要件",
    "No restrictions on use, modification, or distribution":
        "使用、修正、配布に制限なし",
    "Software cannot be used commercially":
        "ソフトウェアは商業利用不可",
    "Source code is not available":
        "ソースコードが利用不可",
}

def is_english(s):
    """Check if string is primarily English (5+ consecutive Latin chars in first 20)"""
    if not s:
        return False
    return bool(re.search(r'[a-zA-Z]{5,}', s[:20]))

changed = 0
for q in data:
    # Translate question
    qt = q.get('question', '')
    if qt in q_translations and q_translations[qt] is not None:
        q['question'] = q_translations[qt]
        changed += 1
    
    # Translate options
    for opt in q.get('options', []):
        ot = opt.get('text', '')
        if ot in o_translations:
            opt['text'] = o_translations[ot]
            changed += 1

print(f'Translated {changed} items')

# Write back
with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('File written successfully')

# Verify
with open(r'C:\Users\haro\.openclaw\workspace\ap-exam-study\src\data\ap-exam.json', 'r', encoding='utf-8') as f:
    data2 = json.load(f)

remaining = 0
for q in data2:
    qt = q.get('question', '')
    if is_english(qt):
        remaining += 1
        print(f'  REMAINING: {qt[:80]}')

print(f'Remaining English questions: {remaining}')
