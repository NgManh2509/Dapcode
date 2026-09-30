# Graph Report - Dapcode  (2026-09-26)

## Corpus Check
- 81 files · ~389,358 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .properties 1, .cmd 1)

## Summary
- 458 nodes · 1223 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28e22e24`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Judge0Client
- Users
- ApiResponse
- lombok.AllArgsConstructor
- SecurityConfig.java
- Problem
- Judge0Status
- seed_theory.py
- list
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
- AppException

## God Nodes (most connected - your core abstractions)
1. `Users` - 34 edges
2. `ApiResponse` - 27 edges
3. `ErrorCode` - 22 edges
4. `Judge0Status` - 21 edges
5. `Problem` - 19 edges
6. `AppException` - 19 edges
7. `SubmissionServiceImpl` - 18 edges
8. `TestCase` - 17 edges
9. `UserRepository` - 17 edges
10. `Submission` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Ngày 10: Xây Dựng Problem REST APIs` --references--> `ProblemDetailResponse`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/dto/problem/ProblemDetailResponse.java
- `Ngày 5: Xây Dựng JPA Entities & Repositories (Đã hoàn thành 100% ✅)` --references--> `Users`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/entity/Users.java
- `Ngày 3: Thiết Lập Cấu Trúc Mã Nguồn & Base Classes (Đã hoàn thành 100% ✅)` --references--> `GlobalExceptionHandler`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/exception/GlobalExceptionHandler.java
- `Ngày 6: Xây Dựng Judge0 Integration Client (Đã hoàn thành 100% ✅)` --references--> `Judge0Client`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/main/java/com/dapcode/backend_core/judge0/Judge0Client.java
- `Ngày 7: Viết Unit & Integration Test Cho Judge0 Client (Đã hoàn thành 100% ✅)` --references--> `Judge0ClientIntegrationTest`  [INFERRED]
  Phase 1 Plan.md → backend-core/src/test/java/com/dapcode/backend_core/judge0/Judge0ClientIntegrationTest.java

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "Judge0Client"
Cohesion: 0.10
Nodes (19): Judge0Client, 🏗 1. Kiến Trúc Kỹ Thuật Phase 1, 📅 2. Lộ Trình Triển Khai 14 Ngày (Task Breakdown), 📊 3. Tiêu Chí Nghiệm Thu Phase 1 (Acceptance Criteria), Hạ Tầng Chấm Code, Core Domain & Submission Evaluation Engine (Tuần 1 - Tuần 2), 📋 Kế Hoạch Triển Khai Chi Tiết: Phase 1, Ngày 10: Xây Dựng Problem REST APIs, Ngày 11: Xây Dựng Authentication & User APIs (+11 more)

### Community 1 - "Users"
Cohesion: 0.09
Nodes (21): assertequals, assertnotnull, asserttrue, autowired, Users, UserRepository, SubmissionService, BackendCoreApplicationTests (+13 more)

### Community 2 - "ApiResponse"
Cohesion: 0.10
Nodes (28): authenticationprincipal, ApiResponse, AuthController, ProblemController, SubmissionController, TheoryController, UserController, PageResponse (+20 more)

### Community 3 - "lombok.AllArgsConstructor"
Cohesion: 0.14
Nodes (23): accesslevel, arraylist, AuthResponse, LoginGoogleRequest, UserSummaryDto, PublicTestCaseDto, SubmissionDetailResponse, SubmissionProgressEvent (+15 more)

### Community 4 - "SecurityConfig.java"
Cohesion: 0.12
Nodes (20): abstracthttpconfigurer, CorsConfig, SecurityConfig, Judge0Config, corsconfiguration, duration, httpmethod, org.springframework.context.annotation.Bean (+12 more)

### Community 5 - "Problem"
Cohesion: 0.20
Nodes (22): Problem, Submission, TestCase, Theories, SubmissionRepository, TestCaseRepository, column, creationtimestamp (+14 more)

### Community 6 - "Judge0Status"
Cohesion: 0.11
Nodes (15): Judge0Status, ACCEPTED, COMPILATION_ERROR, EXEC_FORMAT_ERROR, IN_QUEUE, INTERNAL_ERROR, PROCESSING, RUNTIME_ERROR_NZEC (+7 more)

### Community 7 - "seed_theory.py"
Cohesion: 0.13
Nodes (25): argparse, html, json, os, re, escape_sql(), extract_slug(), fetch_problem_metadata() (+17 more)

### Community 8 - "list"
Cohesion: 0.19
Nodes (9): TheoryRepository, Override, TheoryServiceImpl, list, optional, org.springframework.data.jpa.repository.Query, org.springframework.stereotype.Service, org.springframework.transaction.annotation.Transactional (+1 more)

### Community 9 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 10 - "BackendCoreApplication.java"
Cohesion: 0.50
Nodes (3): BackendCoreApplication, org.springframework.boot.autoconfigure.SpringBootApplication, springapplication

### Community 12 - "AuthServiceImpl.java"
Cohesion: 0.06
Nodes (40): Override, JwtAuthenticationFilter, JwtTokenProvider, BatchResponse, Override, Judge0ClientImpl, Judge0Response, Status (+32 more)

### Community 13 - "🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor"
Cohesion: 0.40
Nodes (4): 🛠 1. Techstack Chuẩn Hóa, 📅 2. Kế Hoạch Triển Khai Chi Tiết (8 Tuần), 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor, Phân Chia Trách Nhiệm Kiến Trúc (Architecture Split)

### Community 14 - "🐳 Judge0 Code Execution Sandbox"
Cohesion: 0.40
Nodes (4): ⏹ Dừng cụm Sandbox, 🐳 Judge0 Code Execution Sandbox, 🚀 Khởi động Sandbox, 🔍 Kiểm tra trạng thái

### Community 17 - "ErrorCode"
Cohesion: 0.13
Nodes (15): ErrorCode, INVALID_REQUEST, PROBLEM_NOT_FOUND, SUBMISSION_NOT_FOUND, THEORY_NOT_FOUND, UNAUTHENTICATED, UNAUTHORIZED, UNCATEGORIZED_EXCEPTION (+7 more)

### Community 18 - "Hướng Dẫn Khởi Động & Chạy Spring Boot (backend-core)"
Cohesion: 0.15
Nodes (12): 1. Yêu cầu môi trường, 2. Bước 1: Khởi động Cơ sở dữ liệu PostgreSQL, 3. Bước 2: Chạy Spring Boot Backend, 4. Cơ chế tự động chạy Migration (Flyway), 5. Kiểm tra dữ liệu sau khi chạy, 6. Các lệnh hữu ích khác, 🔹 Cách 1: Khởi động Server trực tiếp (Dev Server), 🔹 Cách 2: Chạy Test để nạp Migration nhanh (Không giữ server) (+4 more)

### Community 19 - "Hướng Dẫn Seeding Dữ Liệu Lý Thuyết (Theory) - Dapcode"
Cohesion: 0.17
Nodes (11): 1. Chuẩn bị môi trường, 2. Các lệnh chạy chính, 3. Bảng tham số (CLI Arguments), 4. Các file được tạo ra sau khi chạy, 5. Khắc phục sự cố thường gặp, 6. Nạp dữ liệu vào Java Spring Boot qua Flyway, 🔹 Cách 1: Chạy thử nghiệm 1–2 bài trước (Khuyên dùng), 🔹 Cách 2: Chạy toàn bộ danh sách (+3 more)

### Community 23 - "AppException"
Cohesion: 0.24
Nodes (6): AppException, EvaluationSummary, Override, SubmissionServiceImpl, SubmissionStreamManager, org.springframework.web.servlet.mvc.method.annotation.SseEmitter

## Knowledge Gaps
- **59 isolated node(s):** `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST`, `UNAUTHENTICATED`, `UNAUTHORIZED` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 122 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users` connect `Users` to `ApiResponse`, `lombok.AllArgsConstructor`, `Problem`, `AuthServiceImpl.java`, `AppException`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `Judge0Status` connect `Judge0Status` to `lombok.AllArgsConstructor`, `Problem`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `ErrorCode` connect `ErrorCode` to `ApiResponse`, `lombok.AllArgsConstructor`, `Problem`, `list`, `AuthServiceImpl.java`, `AppException`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Judge0Client` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Users` be split into smaller, more focused modules?**
  _Cohesion score 0.09224489795918367 - nodes in this community are weakly interconnected._
- **Should `ApiResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.09740259740259741 - nodes in this community are weakly interconnected._