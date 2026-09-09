# 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor

> **Mô hình cốt lõi:** Nền tảng luyện tập DSA theo phong cách LeetCode chia bài tập thành các Sub-tasks tuần tự, tích hợp Visualizer và trợ lý AI gợi ý tư duy (không giải hộ).

---

## 🛠 1. Techstack Chuẩn Hóa

* **Frontend (SPA):** React (Vite), Tailwind CSS, `@monaco-editor/react`, `react-resizable-panels`, `zustand`, `lucide-react`
* **Visualization & Animation:** Framer Motion, React Flow (hoặc SVG components)
* **Core Backend:** Java 21, Spring Boot 3.x (Spring Web, Spring Security + JWT, Spring Data JPA, WebSocket/SSE)
* **AI & Analysis Microservice:** Python 3.11+, FastAPI, LangChain / LlamaIndex, Pydantic, Tree-sitter / AST
* **Code Execution Sandbox:** Judge0 (Self-hosted qua Docker) / Isolate
* **AI Models & Vectors:** GPT-4o mini / Claude 3.5 Haiku, pgvector (PostgreSQL)
* **Database & Cache:** PostgreSQL, Redis

---



## 📅 2. Kế Hoạch Triển Khai Chi Tiết (8 Tuần)

##  Phân Chia Trách Nhiệm Kiến Trúc (Architecture Split)

```text
[ React SPA ]
      │ (REST API & WebSocket / SSE)
      ▼
[ Spring Boot Core API ] (Port 8080)
  ├── Quản lý Auth, Users, Roles (Spring Security + JWT)
  ├── Quản lý Problems, Sub-tasks, Submissions, Streak, XP (PostgreSQL)
  ├── Điều phối chấm bài: Gửi code sang Judge0 Docker Sandbox
  └── Giao tiếp nội bộ (REST/HTTP Client) ──► [ FastAPI Service ] (Port 8000)
                                                    ├── Socratic Prompting & Tiered Hints
                                                    ├── Phân tích cú pháp / AST Code học viên
                                                    ├── Auto Edge-Case Generator khi WA
                                                    └── Phân tích Big-O & Clean Code

### Giai Đoạn 1: Hạ Tầng Chấm Code & Kiến Trúc Dữ Liệu (Tuần 1 - 2)
*Mục tiêu: Dựng môi trường sandbox chạy code an toàn và thiết kế nền tảng CSDL.*

* [ ] **Thiết lập Sandbox (Judge0 / Isolate):**
  * Triển khai Docker Compose chạy cụm Judge0 kèm Redis worker.
  * Thiết lập giới hạn tài nguyên khắt khe: `CPU: 1 core`, `RAM: 256MB`, `Timeout: 1.0s` (C++) / `2.0s` (Python).
  * Chặn syscall nguy hiểm, vô hiệu hóa hoàn toàn network outbound trong container.
* [ ] **Thiết kế Database Schema (PostgreSQL):**
  * Bảng `users`: Thông tin tài khoản, điểm XP, streak.
  * Bảng `problems` & `sub_tasks`: Đề bài, ràng buộc, danh sách nhiệm vụ nhỏ.
  * Bảng `test_cases`: Input/output mẫu (public) và test cases ẩn (private).
  * Bảng `submissions`: Lưu mã nguồn, trạng thái (`AC`, `WA`, `TLE`, `MLE`), thời gian chạy, RAM.
* [ ] **Xây dựng Execution API:**
  * Endpoint nhận code từ client $\rightarrow$ đẩy vào hàng đợi chấm $\rightarrow$ trả về kết quả test suite qua polling hoặc WebSocket.

---

### Giai Đoạn 2: Dữ Liệu Bài Tập & Phân Rã Sub-tasks (Tuần 3)
*Mục tiêu: Xây dựng kho 30 bài tập nền tảng có cấu trúc task chia nhỏ.*

* [ ] **Tuyển chọn 30 bài toán cốt lõi (Blind 75 & NeetCode 150):**
  * Array & Two Pointers (5 bài)
  * String & Sliding Window (5 bài)
  * Linked List & Stack/Queue (5 bài)
  * Binary Tree & BST (5 bài)
  * Graph Traversal (BFS/DFS) (5 bài)
  * Dynamic Programming cơ bản (5 bài)
* [ ] **Phân rã bài toán thành Sub-tasks (Mỗi bài 3-4 tasks):**
  * *Task 1 (Edge Cases):* Xử lý dữ liệu biên (mảng rỗng, giá trị âm, độ dài 1).
  * *Task 2 (Data Setup):* Khởi tạo cấu trúc dữ liệu tối ưu (HashMap, Queue, mảng DP).
  * *Task 3 (Core Logic):* Hoàn thiện hàm thuật toán lõi.
  * *Task 4 (Final Submit):* Chạy toàn bộ 20+ hidden test cases.
* [ ] **Xây dựng Data Pipeline:**
  * Viết script Python import bài tập từ file JSON/Markdown vào PostgreSQL.
  * Chạy test chéo bộ code mẫu để xác thực tính đúng đắn của toàn bộ test cases.

---

### Giai Đoạn 3: Workspace Frontend (React + Tailwind) & Visualizer (Tuần 4 - 5)
*Mục tiêu: Dựng giao diện Workspace 3 cột mượt mà, tối ưu hoàn toàn phía Client.*

* [ ] **Layout Workspace 3 Cột (`react-resizable-panels`):**
  * **Cột trái:** Đề bài, constraints, tab lý thuyết và **Sub-task Checklist** tương tác (tự động bật tick xanh khi pass task).
  * **Cột giữa:** `@monaco-editor/react` (auto-complete, shortcut, theme dark/light, selector đổi ngôn ngữ) + Console kết quả bên dưới.
  * **Cột phải:** Khung chat AI Socratic Tutor + Canvas Visualizer.
* [ ] **State Management & Local Cache (Zustand):**
  * Quản lý trạng thái code đang gõ, task checklist, kết quả chạy test.
  * Lưu tạm code nháp vào LocalStorage/IndexedDB tránh mất bài khi reload.
* [ ] **Interactive Visualizer (Framer Motion / React Flow):**
  * Dựng component mô phỏng mảng di chuyển con trỏ (Two Pointers).
  * Dựng visualizer node cho Cây nhị phân và Danh sách liên kết.

---

### Giai Đoạn 4: Tích Hợp AI Socratic Companion (Tuần 6)
*Mục tiêu: Biến AI thành gia sư gợi mở tư duy, không in code giải sẵn.*

* [ ] **Hệ Thống Gợi Ý 3 Cấp Độ (Tiered Hinting):**
  * *Cấp 1 - Hướng tiếp cận:* Gợi ý độ phức tạp Big-O và cấu trúc dữ liệu phù hợp.
  * *Cấp 2 - Phản xạ điều kiện biên:* Đặt câu hỏi về bẫy logic dựa trên code hiện tại của học viên.
  * *Cấp 3 - Mã giả (Pseudocode):* Cung cấp logic khung từng bước, cấm in mã nguồn hoàn chỉnh.
* [ ] **Auto Edge-Case Generator:**
  * Khi gặp lỗi `Wrong Answer (WA)`, AI tự động sinh một test case cực nhỏ gây lỗi để người học tự trace code debug.
* [ ] **Tối ưu Chi Phí & Độ Trễ:**
  * Sử dụng model nhỏ, tốc độ cao (GPT-4o mini / Claude 3.5 Haiku) cho việc phân tích lỗi và sinh gợi ý.
  * Caching prompt hệ thống cho các bài tập cố định.

---

### Giai Đoạn 5: Gamification, Bảo Mật & Đóng Gói Triển Khai (Tuần 7 - 8)
*Mục tiêu: Hoàn thiện tính năng giữ chân người học và deploy hệ thống lên production.*

* [ ] **Cơ Chế Gamification:**
  * Hệ thống Skill Tree (mở khóa bài theo dạng cây kỹ năng).
  * Cơ chế Daily Coding Streak và điểm thưởng EXP.
* [ ] **Kiểm Thử An Toàn & Chịu Tải (Stress Testing):**
  * Thử nghiệm các mã độc hại vào Sandbox: fork bomb, infinite loop, leak biến môi trường.
  * Đo đạc throughput và độ trễ hàng đợi khi nhiều submission đồng thời gửi về backend.
* [ ] **Triển Khai Hệ Thống (Production Deployment):**
  * Frontend (React SPA): Deploy static build lên Vercel hoặc Cloudflare Pages.
  * Backend API & Database: Docker Compose chạy trên VPS (AWS EC2 / DigitalOcean).
  * Sandbox: Cụm Judge0 worker riêng biệt để đảm bảo cô lập tải.

---

## 📊 3. Tiêu Chí Đánh Giá Thành Công (KPIs MVP)

1. **Hiệu năng Frontend:** Workspace load dưới 1 giây, thao tác kéo thả panel mượt mà 60fps.
2. **Sandbox:** Thời gian trả kết quả test case trung bình $\le 1.5$ giây.
3. **AI Guardrail:** 100% không nhả code giải trực tiếp khi học viên bấm xin gợi ý.
4. **Task Completion Rate:** Tỉ lệ học viên hoàn thành ít nhất Task 1 & Task 2 đạt trên 70%.