# 📋 Kế Hoạch Triển Khai Chi Tiết: Phase 1
## Hạ Tầng Chấm Code, Core Domain & Sub-Task Evaluation Engine (Tuần 1 - Tuần 2)

> **Mục tiêu cốt lõi của Phase 1:** Xây dựng xong nền móng Backend (Spring Boot 3 + PostgreSQL), cụm Sandbox (Judge0 Docker), thiết kế Database chuyên biệt cho mô hình **Sub-Tasks**, và hoàn thiện toàn bộ luồng xử lý: **Client gửi Code $\rightarrow$ Backend điều phối Sandbox $\rightarrow$ Chấm điểm phân loại từng Sub-Task $\rightarrow$ Trả kết quả Realtime (SSE).**

---

## 🏗 1. Kiến Trúc Kỹ Thuật Phase 1

```text
[ Client (Postman / Web Test) ]
       │
       │ (1) POST /api/v1/submissions
       ▼
[ Spring Boot Core API - Port 8080 ]
  ├── 1. Security & Auth (JWT Validation)
  ├── 2. Submission Manager (Lưu trạng thái PENDING vào Postgres)
  ├── 3. Judge0 Client (Dispatch code & test cases sang Sandbox)
  └── 4. Sub-Task Evaluator (Tổng hợp kết quả từng task & stream SSE)
       │                              │
       │ (Internal REST)              │ (JDBC)
       ▼                              ▼
[ Judge0 Sandbox - Port 2358 ]   [ PostgreSQL (App DB) - Port 5432 ]
  ├── Server (Job Dispatcher)      ├── users & roles
  ├── Redis (Queue)                ├── problems
  ├── Workers (isolate sandbox)    ├── sub_tasks
  └── Postgres (Judge0 internal)   ├── test_cases
                                   └── submissions & subtask_results
```

---

## 📅 2. Lộ Trình Triển Khai 14 Ngày (Task Breakdown)

### 🔹 Sprint 1: Hạ Tầng Sandbox & Database Schema (Ngày 1 - 7)

#### Ngày 1: Setup Workspace & Docker Sandbox (Đã hoàn thành 100% ✅)
- [x] Khởi tạo cấu trúc Monorepo (`backend-core`, `ai-service`, `frontend`, `infra/sandbox`).
- [x] Cấu hình `judge0.conf` và `docker-compose.sandbox.yml`.
- [x] Chạy `docker compose up -d` kích hoạt 4 containers trên Docker Desktop.
- [x] Chuyển đổi vị trí lưu trữ Docker sang ổ `I:\` an toàn, giải phóng 18.4GB cho ổ `C:\`.
- [x] Kiểm thử Sandbox chạy code Python 3 (0.02s) & C++ (0.002s) đạt trạng thái `Accepted`.
- [x] Kiểm thử bẫy vòng lặp vô tận, Sandbox tự ngắt an toàn và trả về `Time Limit Exceeded`.

#### Ngày 2: Khởi Tạo Dự Án Spring Boot 3 & Docker PostgreSQL
- [ ] Tạo dự án Spring Boot 3.3+ (Java 21) trong thư mục `backend-core/`:
  - Dependencies: `Spring Web`, `Spring Data JPA`, `PostgreSQL Driver`, `Flyway Migration`, `Lombok`, `Validation`, `Spring Security`.
- [ ] Tạo file `infra/database/docker-compose.db.yml` chạy PostgreSQL chính cho ứng dụng (Port `5432`, DB name `dapcode_db`).
- [ ] Cấu hình chuẩn `application.yml` kết nối DB và cấu hình profile (`dev`, `prod`).

#### Ngày 3: Thiết Lập Cấu Trúc Mã Nguồn & Base Classes
- [ ] Thiết lập kiến trúc phân tầng chuẩn:
  ```text
  backend-core/src/main/java/com/dapcode/
    ├── common/          # ApiResponse, ErrorCode, Constants
    ├── config/          # Security, WebMvc, RestClient
    ├── exception/       # GlobalExceptionHandler, CustomExceptions
    └── modules/         # auth, user, problem, submission
  ```
- [ ] Xây dựng `GlobalExceptionHandler` và chuẩn hóa format response JSON:
  ```json
  { "success": true, "code": 200, "data": {}, "message": null }
  ```

#### Ngày 4: Thiết Kế Database Schema Cho Sub-Tasks (Flyway Migration)
- [ ] Viết script `V1__init_schema.sql` với các bảng:
  * `users`: `id`, `username`, `email`, `password_hash`, `role`, `created_at`.
  * `problems`: `id`, `slug`, `title`, `difficulty`, `description_markdown`, `time_limit_ms`, `memory_limit_kb`.
  * `sub_tasks`: `id`, `problem_id`, `step_order` (1..4), `title`, `description`, `hint_direction`, `verification_type`.
  * `test_cases`: `id`, `problem_id`, `sub_task_id`, `input_data`, `expected_output`, `is_hidden`.
  * `submissions`: `id`, `user_id`, `problem_id`, `source_code`, `language_id`, `status`, `total_runtime_ms`, `max_memory_kb`.
  * `submission_subtask_results`: `id`, `submission_id`, `sub_task_id`, `passed`, `feedback_message`.
- [ ] Chạy migrate Flyway và verify schema trên PostgreSQL.

#### Ngày 5: Xây Dựng JPA Entities & Repositories
- [ ] Tạo các Entities: `User`, `Problem`, `SubTask`, `TestCase`, `Submission`, `SubmissionSubTaskResult`.
- [ ] Thiết lập quan hệ mapping chuẩn (`@OneToMany`, `@ManyToOne`, FetchType.LAZY để tránh N+1 query).
- [ ] Tạo các Spring Data JPA Repositories và viết test repository cơ bản.

#### Ngày 6: Xây Dựng Judge0 Integration Client
- [ ] Sử dụng `RestClient` (Spring 6 / Boot 3) để tạo `Judge0Client`:
  - `POST /submissions?wait=true`: Gửi code đơn lẻ chờ kết quả.
  - `POST /submissions/batch`: Gửi batch nhiều test cases cùng lúc để tối ưu network latency.
  - Xử lý Base64 encoding/decoding cho `source_code`, `stdin`, `stdout`.
- [ ] Map các trạng thái từ Judge0 ID sang Enum hệ thống (`AC`, `WA`, `TLE`, `MLE`, `CE`).

#### Ngày 7: Viết Unit Test Cho Judge0 Client & Khép Lại Sprint 1
- [ ] Viết Unit Test / Mock test cho `Judge0Client`.
- [ ] Chạy thử nghiệm thực tế: Spring Boot gửi 1 đoạn code mẫu sang Judge0 container và nhận kết quả chính xác.

---

### 🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)

#### Ngày 8 - 9: Xây Dựng Sub-Task Evaluation Engine (Cốt Lõi Sản Phẩm)
- [ ] Xây dựng `SubTaskEvaluationService`:
  - Khi học viên nộp bài: Lấy danh sách toàn bộ `sub_tasks` và `test_cases` tương ứng của bài toán.
  - Gom nhóm test cases theo từng `sub_task_id` và gửi batch sang Judge0.
  - **Đánh giá logic:**
    * *Task 1 (Edge Cases):* Phải pass 100% test case biên. Nếu fail $\rightarrow$ Đánh dấu Task 1 failed, ghi chú bẫy biên.
    * *Task 2 (Data Setup / Structure):* Kiểm tra các test case logic trung gian.
    * *Task 3 (Core Logic):* Kiểm tra các public test cases chuẩn.
    * *Task 4 (Final Submit):* Chạy toàn bộ hidden test cases & stress test.
- [ ] Lưu chi tiết kết quả từng task vào bảng `submission_subtask_results`.

#### Ngày 10: Xây Dựng Problem REST APIs
- [ ] `GET /api/v1/problems`: Danh sách bài tập (hỗ trợ phân trang, filter độ khó).
- [ ] `GET /api/v1/problems/{slug}`: Chi tiết bài toán kèm danh sách `sub_tasks` và các test case công khai (ẩn test case private).
- [ ] Viết DTOs và Mappers (ModelMapper / MapStruct / Java Records).

#### Ngày 11: Xây Dựng Authentication & User APIs
- [ ] Cấu hình Spring Security 6 & JWT Filter.
- [ ] `POST /api/v1/auth/register`: Đăng ký tài khoản (mã hóa BCrypt).
- [ ] `POST /api/v1/auth/login`: Đăng nhập, trả về JWT Access Token.
- [ ] `GET /api/v1/users/me`: Lấy thông tin user hiện tại.

#### Ngày 12: Xây Dựng Submission APIs & Realtime Stream (SSE)
- [ ] `POST /api/v1/submissions`: Endpoint nhận source code, kiểm tra auth, đẩy job vào xử lý Async.
- [ ] `GET /api/v1/submissions/{id}`: Polling kết quả nộp bài.
- [ ] `GET /api/v1/submissions/{id}/stream`: Sử dụng **SSE (`SseEmitter`)** để stream kết quả realtime:
  - Event `SUBTASK_PROGRESS`: Bắn thông báo ngay khi 1 sub-task hoàn thành (Task 1: Passed ✅).
  - Event `SUBMISSION_COMPLETE`: Toàn bộ quá trình chấm hoàn tất.

#### Ngày 13: Seed Dữ Liệu 2 Bài Toán Mẫu (Proof of Concept)
- [ ] Viết script Flyway `V2__seed_sample_problems.sql` nạp 2 bài toán chuẩn:
  1. **Two Sum** (Array / Hash Table):
     - Sub-task 1: Xử lý dữ liệu biên (mảng 2 phần tử, không tìm thấy).
     - Sub-task 2: Xử lý số âm, số 0.
     - Sub-task 3: Mảng $10^4$ phần tử (chặn giải thuật $O(N^2)$ brute-force).
  2. **Valid Parentheses** (Stack):
     - Sub-task 1: Chuỗi rỗng, độ dài lẻ.
     - Sub-task 2: Đóng mở đơn giản cùng loại (`()`, `[]`, `{}`).
     - Sub-task 3: Lồng nhau phức tạp (`{[()]}`).

#### Ngày 14: End-to-End Integration Test & Nghiệm Thu Phase 1
- [ ] Viết bài test tích hợp (Integration Test) kiểm thử toàn bộ luồng:
  - User đăng ký $\rightarrow$ Đăng nhập lấy JWT $\rightarrow$ Xem bài Two Sum $\rightarrow$ Nộp code giải $\rightarrow$ Nhận kết quả từng Sub-task qua SSE.
- [ ] Đóng gói và viết tài liệu hướng dẫn chạy toàn bộ hệ thống Phase 1.

---

## 📊 3. Tiêu Chí Nghiệm Thu Phase 1 (Acceptance Criteria)

| Tiêu chí | Điều kiện đạt |
| :--- | :--- |
| **Sandbox Isolation** | Cụm Judge0 (Server, Worker, Redis, DB) chạy ổn định trên Docker Desktop, chặn code vô hạn bằng Timeout. |
| **Database Integrity** | Schema quản lý trọn vẹn quan hệ giữa Bài toán $\rightarrow$ Sub-tasks $\rightarrow$ Test cases. |
| **Sub-task Evaluation** | Chấm và phân loại chính xác từng Sub-task (Ví dụ: Code pass Task 1 & 2 nhưng fail Task 3). |
| **Throughput & Speed** | Thời gian chấm và trả kết quả trọn bộ test cases trung bình $\le 1.5$ giây. |
| **Realtime Updates** | Kết quả từng task được stream về client qua SSE mượt mà, không bị nghẽn thread. |
