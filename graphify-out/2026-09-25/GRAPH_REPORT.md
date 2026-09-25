# Graph Report - Dapcode  (2026-09-25)

## Corpus Check
- 80 files · ~389,260 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .properties 1, .cmd 1)

## Summary
- 454 nodes · 1217 edges · 20 communities (17 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ff1c05d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Judge0SubmissionRequest
- org.junit.jupiter.api.Test
- ApiResponse
- lombok.AllArgsConstructor
- SecurityConfig.java
- Problem
- Judge0Status
- seed_theory.py
- AuthServiceImpl.java
- mvnw
- BackendCoreApplication.java
- com.dapcode:backend-core
- JwtAuthenticationFilter.java
- 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor
- 🐳 Judge0 Code Execution Sandbox
- rules/graphify.md
- workflows/graphify.md
- 🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)
- Hướng Dẫn Khởi Động & Chạy Spring Boot (backend-core)
- Hướng Dẫn Seeding Dữ Liệu Lý Thuyết (Theory) - Dapcode

## God Nodes (most connected - your core abstractions)
1. `Users` - 29 edges
2. `ApiResponse` - 26 edges
3. `ErrorCode` - 21 edges
4. `Judge0Status` - 21 edges
5. `Problem` - 19 edges
6. `UserRepository` - 19 edges
7. `TestCase` - 17 edges
8. `AppException` - 17 edges
9. `Submission` - 16 edges
10. `Judge0SubmissionRequest` - 15 edges

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

## Communities (20 total, 3 thin omitted)

### Community 0 - "Judge0SubmissionRequest"
Cohesion: 0.11
Nodes (13): Judge0Client, BatchResponse, Override, Judge0ClientImpl, Judge0Response, Status, Judge0SubmissionRequest, Ngày 1: Setup Workspace & Docker Sandbox (Đã hoàn thành 100% ✅) (+5 more)

### Community 1 - "org.junit.jupiter.api.Test"
Cohesion: 0.08
Nodes (26): assertequals, assertfalse, assertnotnull, asserttrue, autowired, JwtTokenProvider, Users, UserRepository (+18 more)

### Community 2 - "ApiResponse"
Cohesion: 0.08
Nodes (35): authenticationprincipal, ApiResponse, AuthController, ProblemController, SubmissionController, TheoryController, UserController, LoginGoogleRequest (+27 more)

### Community 3 - "lombok.AllArgsConstructor"
Cohesion: 0.20
Nodes (19): accesslevel, arraylist, AuthResponse, UserSummaryDto, ProblemDetailResponse, PublicTestCaseDto, SubmissionResponse, SubmitCodeRequest (+11 more)

### Community 4 - "SecurityConfig.java"
Cohesion: 0.12
Nodes (20): abstracthttpconfigurer, CorsConfig, SecurityConfig, Judge0Config, corsconfiguration, duration, httpmethod, org.springframework.context.annotation.Bean (+12 more)

### Community 5 - "Problem"
Cohesion: 0.24
Nodes (20): Problem, Submission, TestCase, Theories, SubmissionRepository, column, creationtimestamp, fetchtype (+12 more)

### Community 6 - "Judge0Status"
Cohesion: 0.11
Nodes (15): Judge0Status, ACCEPTED, COMPILATION_ERROR, EXEC_FORMAT_ERROR, IN_QUEUE, INTERNAL_ERROR, PROCESSING, RUNTIME_ERROR_NZEC (+7 more)

### Community 7 - "seed_theory.py"
Cohesion: 0.13
Nodes (25): argparse, html, json, os, re, escape_sql(), extract_slug(), fetch_problem_metadata() (+17 more)

### Community 8 - "AuthServiceImpl.java"
Cohesion: 0.06
Nodes (30): ErrorCode, INVALID_REQUEST, PROBLEM_NOT_FOUND, THEORY_NOT_FOUND, UNAUTHENTICATED, UNAUTHORIZED, UNCATEGORIZED_EXCEPTION, USER_NOT_FOUND (+22 more)

### Community 9 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 10 - "BackendCoreApplication.java"
Cohesion: 0.50
Nodes (3): BackendCoreApplication, org.springframework.boot.autoconfigure.SpringBootApplication, springapplication

### Community 12 - "JwtAuthenticationFilter.java"
Cohesion: 0.09
Nodes (26): Override, JwtAuthenticationFilter, claims, collections, collectors, date, ioexception, jakarta.servlet.FilterChain (+18 more)

### Community 13 - "🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor"
Cohesion: 0.40
Nodes (4): 🛠 1. Techstack Chuẩn Hóa, 📅 2. Kế Hoạch Triển Khai Chi Tiết (8 Tuần), 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor, Phân Chia Trách Nhiệm Kiến Trúc (Architecture Split)

### Community 14 - "🐳 Judge0 Code Execution Sandbox"
Cohesion: 0.40
Nodes (4): ⏹ Dừng cụm Sandbox, 🐳 Judge0 Code Execution Sandbox, 🚀 Khởi động Sandbox, 🔍 Kiểm tra trạng thái

### Community 17 - "🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)"
Cohesion: 0.15
Nodes (12): 🏗 1. Kiến Trúc Kỹ Thuật Phase 1, 📅 2. Lộ Trình Triển Khai 14 Ngày (Task Breakdown), 📊 3. Tiêu Chí Nghiệm Thu Phase 1 (Acceptance Criteria), Hạ Tầng Chấm Code, Core Domain & Submission Evaluation Engine (Tuần 1 - Tuần 2), 📋 Kế Hoạch Triển Khai Chi Tiết: Phase 1, Ngày 10: Xây Dựng Problem REST APIs, Ngày 11: Xây Dựng Authentication & User APIs, Ngày 12: Xây Dựng Submission APIs & Realtime Execution Stream (SSE) (+4 more)

### Community 18 - "Hướng Dẫn Khởi Động & Chạy Spring Boot (backend-core)"
Cohesion: 0.15
Nodes (12): 1. Yêu cầu môi trường, 2. Bước 1: Khởi động Cơ sở dữ liệu PostgreSQL, 3. Bước 2: Chạy Spring Boot Backend, 4. Cơ chế tự động chạy Migration (Flyway), 5. Kiểm tra dữ liệu sau khi chạy, 6. Các lệnh hữu ích khác, 🔹 Cách 1: Khởi động Server trực tiếp (Dev Server), 🔹 Cách 2: Chạy Test để nạp Migration nhanh (Không giữ server) (+4 more)

### Community 19 - "Hướng Dẫn Seeding Dữ Liệu Lý Thuyết (Theory) - Dapcode"
Cohesion: 0.17
Nodes (11): 1. Chuẩn bị môi trường, 2. Các lệnh chạy chính, 3. Bảng tham số (CLI Arguments), 4. Các file được tạo ra sau khi chạy, 5. Khắc phục sự cố thường gặp, 6. Nạp dữ liệu vào Java Spring Boot qua Flyway, 🔹 Cách 1: Chạy thử nghiệm 1–2 bài trước (Khuyên dùng), 🔹 Cách 2: Chạy toàn bộ danh sách (+3 more)

## Knowledge Gaps
- **58 isolated node(s):** `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST`, `UNAUTHENTICATED`, `UNAUTHORIZED` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 117 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users` connect `org.junit.jupiter.api.Test` to `ApiResponse`, `lombok.AllArgsConstructor`, `Problem`, `AuthServiceImpl.java`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `Judge0Status` connect `Judge0Status` to `lombok.AllArgsConstructor`, `Problem`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `UserRepository` connect `org.junit.jupiter.api.Test` to `AuthServiceImpl.java`, `ApiResponse`, `lombok.AllArgsConstructor`, `JwtAuthenticationFilter.java`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Judge0SubmissionRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Should `org.junit.jupiter.api.Test` be split into smaller, more focused modules?**
  _Cohesion score 0.08048289738430583 - nodes in this community are weakly interconnected._
- **Should `ApiResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.08085317460317461 - nodes in this community are weakly interconnected._