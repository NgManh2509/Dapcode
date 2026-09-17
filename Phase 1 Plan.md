# 📋 Kế Hoạch Triển Khai Chi Tiết: Phase 1
## Hạ Tầng Chấm Code, Core Domain & Submission Evaluation Engine (Tuần 1 - Tuần 2)

> **Mục tiêu cốt lõi của Phase 1:** Xây dựng xong nền móng Backend (Spring Boot 3 + PostgreSQL), cụm Sandbox (Judge0 Docker), quản lý bài toán và test suite (Public & Hidden), hoàn thiện toàn bộ luồng xử lý: **Client gửi Code $\rightarrow$ Backend điều phối Sandbox chấm toàn diện $\rightarrow$ Phân tích kết quả thực thi $\rightarrow$ Cập nhật tiến độ & Trả kết quả Realtime.** Khi gặp khó khăn, hệ thống sẵn sàng tích hợp **AI Socratic Tutor** để gợi mở tư duy (Nudge) hoặc cung cấp mã giả (Pseudocode) thay vì bắt buộc chia nhỏ Sub-Task cứng nhắc.

---

## 🏗 1. Kiến Trúc Kỹ Thuật Phase 1

```text
[ Client (Postman / Web UI) ]
       │
       │ (1) POST /api/v1/submissions (code, lang, problem)
       ▼
[ Spring Boot Core API - Port 8080 ]
  ├── 1. Security & Auth (JWT Validation)
  ├── 2. Problem Manager (Tra cứu 250 bài Neetcode & Test Cases)
  ├── 3. Judge0 Client (Dispatch batch test cases sang Sandbox)
  ├── 4. Submission Evaluation Engine (Chấm điểm, đo runtime/memory, cộng XP/streak)
  └── 5. AI Socratic Tutor Service (Gợi ý Socratic Nudge / Pseudocode)
       │                              │
       │ (Internal REST)              │ (JDBC)
       ▼                              ▼
[ Judge0 Sandbox - Port 2358 ]   [ PostgreSQL (App DB) - Port 5432 ]
  ├── Server (Job Dispatcher)      ├── users & roles
  ├── Redis (Queue)                ├── problems (250 bài + category)
  ├── Workers (isolate sandbox)    ├── test_cases (3.351 test cases)
  └── Postgres (Judge0 internal)   └── submissions (lịch sử nộp bài)
```

---

## 📅 2. Lộ Trình Triển Khai 14 Ngày (Task Breakdown)

### 🔹 Sprint 1: Hạ Tầng Sandbox, Schema & Database Seeding (Ngày 1 - 7) — ĐÃ HOÀN THÀNH 100% ✅

#### Ngày 1: Setup Workspace & Docker Sandbox (Đã hoàn thành 100% ✅)
- [x] Khởi tạo cấu trúc Monorepo (`backend-core`, `ai-service`, `frontend`, `infra/sandbox`).
- [x] Cấu hình `judge0.conf` và `docker-compose.sandbox.yml`.
- [x] Chạy `docker compose up -d` kích hoạt 4 containers trên Docker Desktop.
- [x] Chuyển đổi vị trí lưu trữ Docker sang ổ `I:\` an toàn, giải phóng 18.4GB cho ổ `C:\`.
- [x] Kiểm thử Sandbox chạy code Python 3 (0.02s) & C++ (0.002s) đạt trạng thái `Accepted`.
- [x] Kiểm thử bẫy vòng lặp vô tận, Sandbox tự ngắt an toàn và trả về `Time Limit Exceeded`.

#### Ngày 2: Khởi Tạo Dự Án Spring Boot 3 & Docker PostgreSQL (Đã hoàn thành 100% ✅)
- [x] Tạo dự án Spring Boot (Java 21) trong thư mục `backend-core/` với đầy đủ dependencies cốt lõi.
- [x] Tạo file `infra/database/docker-compose.db.yml` chạy PostgreSQL chính cho ứng dụng (Port `5432`, DB name `dapcode_db`).
- [x] Cấu hình chuẩn `application.yaml` kết nối DB (HikariCP, JPA, Flyway) và khởi động ứng dụng thành công trên port `8080`.

#### Ngày 3: Thiết Lập Cấu Trúc Mã Nguồn & Base Classes (Đã hoàn thành 100% ✅)
- [x] Thiết lập kiến trúc phân tầng chuẩn (`common`, `config`, `exception`, `test`).
- [x] Xây dựng `ApiResponse<T>` generic và enum quản lý mã lỗi tập trung `ErrorCode`.
- [x] Xây dựng `GlobalExceptionHandler` bắt `AppException`, lỗi validate và lỗi 500.
- [x] Cấu hình `CorsConfig` (mở kết nối cho Frontend 5173/3000) và `SecurityConfig`.
- [x] Viết `TestController` kiểm chứng thành công cả response chuẩn và xử lý lỗi tập trung.

#### Ngày 4: Thiết Kế Database Schema (Flyway Migration) (Đã hoàn thành 100% ✅)
- [x] Viết script `V1__init_schema.sql` với các bảng cốt lõi: `users`, `problems`, `test_cases`, `submissions`.
- [x] Thiết lập ràng buộc khóa ngoại (Foreign Keys), Unique Constraints và các chỉ mục Index tối ưu truy vấn.
- [x] Tối ưu hóa: Bỏ kiến trúc Sub-Tasks, loại bỏ các bảng phụ không cần thiết (`sub_tasks`, `submission_subtask_results`) qua migration `V4__drop_subtasks.sql`.

#### Ngày 5: Xây Dựng JPA Entities & Repositories (Đã hoàn thành 100% ✅)
- [x] Tạo các Entities: `Users`, `Problem`, `TestCase`, `Submission`.
- [x] Thiết lập quan hệ mapping chuẩn (`@OneToMany`, `@ManyToOne`, FetchType.LAZY để tránh N+1 query).
- [x] Tạo các Spring Data JPA Repositories và viết test repository cơ bản (`Day5RepositoryTest` 3/3 passed).

#### Ngày 6: Xây Dựng Judge0 Integration Client (Đã hoàn thành 100% ✅)
- [x] Sử dụng `RestClient` (Spring 6 / Boot 3) để tạo `Judge0Client`:
  - `POST /submissions?wait=true`: Gửi code đơn lẻ chờ kết quả.
  - `POST /submissions/batch`: Gửi batch nhiều test cases cùng lúc để tối ưu network latency.
  - Xử lý polling bất đồng bộ khi worker Judge0 xử lý batch.
- [x] Map các trạng thái từ Judge0 ID sang Enum hệ thống (`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `COMPILATION_ERROR`,...).

#### Ngày 7: Viết Unit & Integration Test Cho Judge0 Client (Đã hoàn thành 100% ✅)
- [x] Viết Unit Test / Integration Test cho `Judge0Client`.
- [x] Chạy thử nghiệm thực tế: Spring Boot gửi batch code mẫu sang Judge0 container và nhận kết quả chính xác (`Judge0ClientIntegrationTest` 3/3 passed).
- [x] **Bonus**: Xây dựng pipeline seeding dữ liệu 250 bài Neetcode + 3.351 test cases qua `seedingData/seed_problems.py` và nạp thành công vào PostgreSQL.

---

### 🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)

#### Ngày 8 - 9: Xây Dựng Full-Problem Evaluation Engine (Cốt Lõi Sản Phẩm)
- [ ] Xây dựng `SubmissionEvaluationService`:
  - Khi học viên nộp bài: Lấy danh sách toàn bộ `test_cases` tương ứng của bài toán (`problem_id`).
  - Đóng gói batch test cases và gửi sang cụm Judge0 Sandbox qua `Judge0Client.executeBatch(...)`.
  - **Đánh giá logic:**
    * So khớp output của Judge0 với `expected_output`.
    * Phân loại lỗi chính xác: `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`.
    * Tính toán tổng thời gian chạy (`totalRuntimeMs`) và bộ nhớ tiêu thụ đỉnh (`maxMemoryKb`).
    * Nếu pass 100% test cases: Đánh dấu bài nộp thành công, tự động cộng XP và cập nhật `streak` cho học viên.
- [ ] Viết bài test tích hợp `EvaluationServiceIntegrationTest` kiểm thử toàn diện các kịch bản nộp bài.

#### Ngày 10: Xây Dựng Problem REST APIs
- [ ] `GET /api/v1/problems`: Danh sách 250 bài tập:
  - Hỗ trợ phân trang (`page`, `size`, `sort`).
  - Hỗ trợ bộ lọc: Theo chủ đề `category` (Arrays & Hashing, Two Pointers,...), độ khó `difficulty` (Easy, Medium, Hard), tìm kiếm `search` theo tên/slug.
- [ ] `GET /api/v1/problems/{slug}`: Chi tiết bài toán:
  - Tiêu đề, độ khó, `category`, `description_markdown`.
  - Danh sách các test cases công khai (`isHidden = false`) để người học debug (bảo mật ẩn các test cases ẩn).
- [ ] Xây dựng DTOs và Mappers (`ProblemResponse`, `ProblemDetailResponse`, `TestCaseResponse`).

#### Ngày 11: Xây Dựng Authentication & User APIs
- [ ] Cấu hình Spring Security 6 & JWT Filter:
  - `POST /api/v1/auth/register`: Đăng ký tài khoản (mã hóa mật khẩu BCrypt).
  - `POST /api/v1/auth/login`: Đăng nhập, sinh mã JWT Access Token & Refresh Token.
  - `GET /api/v1/users/me`: Lấy thông tin cá nhân, cấp độ, XP và chuỗi streak học tập.

#### Ngày 12: Xây Dựng Submission APIs & Realtime Execution Stream (SSE)
- [ ] `POST /api/v1/submissions`: Endpoint tiếp nhận bài giải của học viên (kiểm tra JWT, đẩy vào luồng chấm Async).
- [ ] `GET /api/v1/submissions/{id}`: Polling tra cứu trạng thái và kết quả bài nộp.
- [ ] `GET /api/v1/submissions/{id}/stream`: Sử dụng **SSE (`SseEmitter`)** để stream kết quả realtime:
  - Event `TEST_PROGRESS`: Thông báo tiến độ khi các test case đang được chấm.
  - Event `SUBMISSION_COMPLETE`: Trả về kết quả chung cuộc (Passed/Failed, XP earned, chi tiết lỗi).

#### Ngày 13: Xây Dựng AI Socratic Tutor Service (Cầu Nối AI Trợ Giúp)
- [ ] Thiết kế endpoint `POST /api/v1/ai/hint`:
  - **Tier 1 (Socratic Nudge):** Khi học viên bấm bí, AI phân tích code hiện tại và câu test case bị sai để đặt câu hỏi gợi mở tư duy (không đưa code lời giải).
  - **Tier 2 (Pseudocode):** Khi học viên yêu cầu trợ giúp sâu hơn, AI cung cấp khung thuật toán dạng mã giả (Pseudocode) định hướng giải quyết.

#### Ngày 14: End-to-End Integration Test & Nghiệm Thu Phase 1
- [ ] Viết bài test tích hợp (E2E Integration Test) kiểm thử toàn bộ luồng hoạt động:
  - Đăng ký $\rightarrow$ Đăng nhập lấy JWT $\rightarrow$ Xem bài Two Sum $\rightarrow$ Nộp code giải $\rightarrow$ Nhận kết quả chấm qua SSE $\rightarrow$ Kiểm tra cộng XP.
- [ ] Đóng gói và viết tài liệu hướng dẫn vận hành toàn bộ hệ thống Phase 1.

---

## 📊 3. Tiêu Chí Nghiệm Thu Phase 1 (Acceptance Criteria)

| Tiêu chí | Điều kiện đạt |
| :--- | :--- |
| **Sandbox Isolation** | Cụm Judge0 (Server, Worker, Redis, DB) chạy ổn định trên Docker Desktop, ngắt code vô hạn bằng Timeout. |
| **Database Integrity** | Schema quản lý trọn vẹn quan hệ giữa Users $\rightarrow$ Problems (250 bài Neetcode) $\rightarrow$ Test cases $\rightarrow$ Submissions. |
| **Full Problem Evaluation** | Chấm chính xác toàn bộ test suite, phân loại rõ ràng Accepted, Wrong Answer, TLE, Runtime Error. |
| **Throughput & Speed** | Thời gian chấm và trả kết quả trọn bộ test cases trung bình $\le 1.5$ giây. |
| **Realtime Updates** | Kết quả thực thi được stream về client qua SSE mượt mà, không gây tắc nghẽn thread. |
| **AI Socratic Integration** | Sẵn sàng endpoint sinh gợi ý phân tầng (Nudge / Pseudocode) cho học viên khi gặp bế tắc. |
