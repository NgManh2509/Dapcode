# Graph Report - Dapcode  (2026-09-25)

## Corpus Check
- 78 files · ~388,772 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .properties 1, .cmd 1)

## Summary
- 437 nodes · 1125 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ff1c05d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Judge0SubmissionRequest
- UserRepository
- ApiResponse
- lombok.AllArgsConstructor
- SecurityConfig.java
- Users
- Judge0Status
- seed_theory.py
- SubmissionServiceImpl.java
- mvnw
- BackendCoreApplication.java
- com.dapcode:backend-core
- AuthServiceImpl.java
- 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor
- 🐳 Judge0 Code Execution Sandbox
- rules/graphify.md
- workflows/graphify.md
- ErrorCode
- Hướng Dẫn Khởi Động & Chạy Spring Boot (backend-core)
- Hướng Dẫn Seeding Dữ Liệu Lý Thuyết (Theory) - Dapcode
- assertfalse
- reflectiontestutils
- springsecurity

## God Nodes (most connected - your core abstractions)
1. `ApiResponse` - 26 edges
2. `Users` - 25 edges
3. `ErrorCode` - 21 edges
4. `Judge0Status` - 21 edges
5. `Problem` - 19 edges
6. `TestCase` - 17 edges
7. `AppException` - 17 edges
8. `UserRepository` - 17 edges
9. `Submission` - 16 edges
10. `Judge0SubmissionRequest` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Ngày 10: Xây Dựng Problem REST APIs` --references--> `ProblemDetailResponse`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/dto/problem/ProblemDetailResponse.java
- `Ngày 3: Thiết Lập Cấu Trúc Mã Nguồn & Base Classes (Đã hoàn thành 100% ✅)` --references--> `GlobalExceptionHandler`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/exception/GlobalExceptionHandler.java
- `Ngày 6: Xây Dựng Judge0 Integration Client (Đã hoàn thành 100% ✅)` --references--> `Judge0Client`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/judge0/Judge0Client.java
- `Ngày 7: Viết Unit & Integration Test Cho Judge0 Client (Đã hoàn thành 100% ✅)` --references--> `Judge0ClientIntegrationTest`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/test/java/com/dapcode/backend_core/judge0/Judge0ClientIntegrationTest.java
- `Ngày 3: Thiết Lập Cấu Trúc Mã Nguồn & Base Classes (Đã hoàn thành 100% ✅)` --references--> `CorsConfig`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/config/CorsConfig.java

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "Judge0SubmissionRequest"
Cohesion: 0.07
Nodes (23): Judge0Client, Override, Judge0Response, Status, Judge0SubmissionRequest, 🏗 1. Kiến Trúc Kỹ Thuật Phase 1, 📅 2. Lộ Trình Triển Khai 14 Ngày (Task Breakdown), 📊 3. Tiêu Chí Nghiệm Thu Phase 1 (Acceptance Criteria) (+15 more)

### Community 1 - "UserRepository"
Cohesion: 0.09
Nodes (21): assertequals, assertnotnull, asserttrue, autowired, UserRepository, SubmissionService, BackendCoreApplicationTests, ProblemApiIntegrationTest (+13 more)

### Community 2 - "ApiResponse"
Cohesion: 0.13
Nodes (20): authenticationprincipal, ApiResponse, AuthController, ProblemController, SubmissionController, TheoryController, UserController, AuthService (+12 more)

### Community 3 - "lombok.AllArgsConstructor"
Cohesion: 0.18
Nodes (22): accesslevel, AuthResponse, LoginGoogleRequest, UserSummaryDto, PageResponse, ProblemDetailResponse, PublicTestCaseDto, ProblemSummaryResponse (+14 more)

### Community 4 - "SecurityConfig.java"
Cohesion: 0.12
Nodes (20): abstracthttpconfigurer, CorsConfig, SecurityConfig, Judge0Config, corsconfiguration, duration, httpmethod, org.springframework.context.annotation.Bean (+12 more)

### Community 5 - "Users"
Cohesion: 0.31
Nodes (19): Problem, Submission, TestCase, Users, column, creationtimestamp, fetchtype, generatedvalue (+11 more)

### Community 6 - "Judge0Status"
Cohesion: 0.11
Nodes (15): Judge0Status, ACCEPTED, COMPILATION_ERROR, EXEC_FORMAT_ERROR, IN_QUEUE, INTERNAL_ERROR, PROCESSING, RUNTIME_ERROR_NZEC (+7 more)

### Community 7 - "seed_theory.py"
Cohesion: 0.13
Nodes (25): argparse, html, json, os, re, escape_sql(), extract_slug(), fetch_problem_metadata() (+17 more)

### Community 8 - "SubmissionServiceImpl.java"
Cohesion: 0.09
Nodes (22): arraylist, Theories, AppException, ProblemRepository, SubmissionRepository, TestCaseRepository, TheoryRepository, Override (+14 more)

### Community 9 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 10 - "BackendCoreApplication.java"
Cohesion: 0.50
Nodes (3): BackendCoreApplication, org.springframework.boot.autoconfigure.SpringBootApplication, springapplication

### Community 12 - "AuthServiceImpl.java"
Cohesion: 0.07
Nodes (35): Override, JwtAuthenticationFilter, JwtTokenProvider, BatchResponse, Judge0ClientImpl, AuthServiceImpl, Override, claims (+27 more)

### Community 13 - "🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor"
Cohesion: 0.40
Nodes (4): 🛠 1. Techstack Chuẩn Hóa, 📅 2. Kế Hoạch Triển Khai Chi Tiết (8 Tuần), 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor, Phân Chia Trách Nhiệm Kiến Trúc (Architecture Split)

### Community 14 - "🐳 Judge0 Code Execution Sandbox"
Cohesion: 0.40
Nodes (4): ⏹ Dừng cụm Sandbox, 🐳 Judge0 Code Execution Sandbox, 🚀 Khởi động Sandbox, 🔍 Kiểm tra trạng thái

### Community 17 - "ErrorCode"
Cohesion: 0.14
Nodes (14): ErrorCode, INVALID_REQUEST, PROBLEM_NOT_FOUND, THEORY_NOT_FOUND, UNAUTHENTICATED, UNAUTHORIZED, UNCATEGORIZED_EXCEPTION, USER_NOT_FOUND (+6 more)

### Community 18 - "Hướng Dẫn Khởi Động & Chạy Spring Boot (backend-core)"
Cohesion: 0.15
Nodes (12): 1. Yêu cầu môi trường, 2. Bước 1: Khởi động Cơ sở dữ liệu PostgreSQL, 3. Bước 2: Chạy Spring Boot Backend, 4. Cơ chế tự động chạy Migration (Flyway), 5. Kiểm tra dữ liệu sau khi chạy, 6. Các lệnh hữu ích khác, 🔹 Cách 1: Khởi động Server trực tiếp (Dev Server), 🔹 Cách 2: Chạy Test để nạp Migration nhanh (Không giữ server) (+4 more)

### Community 19 - "Hướng Dẫn Seeding Dữ Liệu Lý Thuyết (Theory) - Dapcode"
Cohesion: 0.17
Nodes (11): 1. Chuẩn bị môi trường, 2. Các lệnh chạy chính, 3. Bảng tham số (CLI Arguments), 4. Các file được tạo ra sau khi chạy, 5. Khắc phục sự cố thường gặp, 6. Nạp dữ liệu vào Java Spring Boot qua Flyway, 🔹 Cách 1: Chạy thử nghiệm 1–2 bài trước (Khuyên dùng), 🔹 Cách 2: Chạy toàn bộ danh sách (+3 more)

## Knowledge Gaps
- **58 isolated node(s):** `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST`, `UNAUTHENTICATED`, `UNAUTHORIZED` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 122 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users` connect `Users` to `UserRepository`, `ApiResponse`, `lombok.AllArgsConstructor`, `SubmissionServiceImpl.java`, `AuthServiceImpl.java`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `Judge0Status` connect `Judge0Status` to `SubmissionServiceImpl.java`, `Users`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `UserRepository` connect `UserRepository` to `SubmissionServiceImpl.java`, `AuthServiceImpl.java`, `Users`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Judge0SubmissionRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._
- **Should `UserRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.09250693802035152 - nodes in this community are weakly interconnected._
- **Should `ApiResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._