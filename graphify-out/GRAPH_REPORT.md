# Graph Report - Dapcode  (2026-09-21)

## Corpus Check
- 52 files · ~299,733 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .properties 1, .cmd 1)

## Summary
- 314 nodes · 765 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad70347f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Judge0SubmissionRequest
- org.junit.jupiter.api.Test
- ApiResponse
- lombok.AllArgsConstructor
- CorsConfig.java
- Users
- Judge0Status
- seed_problems.py
- SubmissionServiceImpl.java
- mvnw
- BackendCoreApplication.java
- com.dapcode:backend-core
- 🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)
- 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor
- 🐳 Judge0 Code Execution Sandbox
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `Judge0Status` - 21 edges
2. `Users` - 20 edges
3. `Problem` - 19 edges
4. `ApiResponse` - 18 edges
5. `ErrorCode` - 17 edges
6. `TestCase` - 17 edges
7. `Submission` - 16 edges
8. `Judge0SubmissionRequest` - 15 edges
9. `SubmissionServiceImpl` - 15 edges
10. `ProblemDetailResponse` - 13 edges

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

## Communities (17 total, 3 thin omitted)

### Community 0 - "Judge0SubmissionRequest"
Cohesion: 0.08
Nodes (20): Judge0Client, BatchResponse, Override, Judge0ClientImpl, Judge0Response, Status, Judge0SubmissionRequest, collections (+12 more)

### Community 1 - "org.junit.jupiter.api.Test"
Cohesion: 0.10
Nodes (20): assertequals, assertnotnull, asserttrue, autowired, UserRepository, SubmissionService, BackendCoreApplicationTests, ProblemApiIntegrationTest (+12 more)

### Community 2 - "ApiResponse"
Cohesion: 0.11
Nodes (23): accesslevel, ApiResponse, ProblemController, SubmissionController, GlobalExceptionHandler, ProblemService, com.fasterxml.jackson.annotation.JsonInclude, lombok.experimental.FieldDefaults (+15 more)

### Community 3 - "lombok.AllArgsConstructor"
Cohesion: 0.26
Nodes (15): PageResponse, ProblemDetailResponse, PublicTestCaseDto, ProblemSummaryResponse, SubmissionResponse, SubmitCodeRequest, TestCaseResult, list (+7 more)

### Community 4 - "CorsConfig.java"
Cohesion: 0.14
Nodes (17): abstracthttpconfigurer, CorsConfig, SecurityConfig, Judge0Config, corsconfiguration, duration, org.springframework.context.annotation.Bean, org.springframework.context.annotation.Configuration (+9 more)

### Community 5 - "Users"
Cohesion: 0.16
Nodes (25): Problem, Submission, TestCase, Users, SubmissionRepository, column, creationtimestamp, fetchtype (+17 more)

### Community 6 - "Judge0Status"
Cohesion: 0.11
Nodes (15): Judge0Status, ACCEPTED, COMPILATION_ERROR, EXEC_FORMAT_ERROR, IN_QUEUE, INTERNAL_ERROR, PROCESSING, RUNTIME_ERROR_NZEC (+7 more)

### Community 7 - "seed_problems.py"
Cohesion: 0.17
Nodes (16): argparse, html, json, os, re, escape_sql(), extract_slug(), fetch_problem_metadata() (+8 more)

### Community 8 - "SubmissionServiceImpl.java"
Cohesion: 0.11
Nodes (19): arraylist, ErrorCode, INVALID_REQUEST, PROBLEM_NOT_FOUND, UNAUTHENTICATED, UNAUTHORIZED, UNCATEGORIZED_EXCEPTION, USER_NOT_FOUND (+11 more)

### Community 9 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 10 - "BackendCoreApplication.java"
Cohesion: 0.50
Nodes (3): BackendCoreApplication, org.springframework.boot.autoconfigure.SpringBootApplication, springapplication

### Community 12 - "🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)"
Cohesion: 0.15
Nodes (12): 🏗 1. Kiến Trúc Kỹ Thuật Phase 1, 📅 2. Lộ Trình Triển Khai 14 Ngày (Task Breakdown), 📊 3. Tiêu Chí Nghiệm Thu Phase 1 (Acceptance Criteria), Hạ Tầng Chấm Code, Core Domain & Submission Evaluation Engine (Tuần 1 - Tuần 2), 📋 Kế Hoạch Triển Khai Chi Tiết: Phase 1, Ngày 10: Xây Dựng Problem REST APIs, Ngày 11: Xây Dựng Authentication & User APIs, Ngày 12: Xây Dựng Submission APIs & Realtime Execution Stream (SSE) (+4 more)

### Community 13 - "🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor"
Cohesion: 0.40
Nodes (4): 🛠 1. Techstack Chuẩn Hóa, 📅 2. Kế Hoạch Triển Khai Chi Tiết (8 Tuần), 🚀 Kế Hoạch Triển Khai: Nền Tảng Học DSA Task-Driven & AI Socratic Tutor, Phân Chia Trách Nhiệm Kiến Trúc (Architecture Split)

### Community 14 - "🐳 Judge0 Code Execution Sandbox"
Cohesion: 0.40
Nodes (4): ⏹ Dừng cụm Sandbox, 🐳 Judge0 Code Execution Sandbox, 🚀 Khởi động Sandbox, 🔍 Kiểm tra trạng thái

## Knowledge Gaps
- **40 isolated node(s):** `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST`, `UNAUTHENTICATED`, `UNAUTHORIZED` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 91 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Judge0Status` connect `Judge0Status` to `SubmissionServiceImpl.java`, `Users`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `Users` connect `Users` to `SubmissionServiceImpl.java`, `org.junit.jupiter.api.Test`, `lombok.AllArgsConstructor`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `🔹 Sprint 1: Hạ Tầng Sandbox, Schema & Database Seeding (Ngày 1 - 7) — ĐÃ HOÀN THÀNH 100% ✅` connect `Judge0SubmissionRequest` to `Users`, `🔹 Sprint 2: Evaluation Engine, APIs & Realtime Execution (Ngày 8 - 14)`, `CorsConfig.java`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `com.dapcode:backend-core`, `UNCATEGORIZED_EXCEPTION`, `INVALID_REQUEST` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Judge0SubmissionRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Should `org.junit.jupiter.api.Test` be split into smaller, more focused modules?**
  _Cohesion score 0.09898989898989899 - nodes in this community are weakly interconnected._
- **Should `ApiResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._