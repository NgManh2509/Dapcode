# Graph Report - Dapcode  (2026-09-21)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 239 nodes · 580 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad70347f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SubmissionServiceImpl.java
- Users
- ErrorCode
- lombok.AllArgsConstructor
- CorsConfig.java
- Submission.java
- Judge0Status
- seed_problems.py
- ProblemRepository.java
- mvnw
- BackendCoreApplication.java
- com.dapcode:backend-core

## God Nodes (most connected - your core abstractions)
1. `Judge0Status` - 21 edges
2. `Users` - 17 edges
3. `Problem` - 17 edges
4. `ErrorCode` - 16 edges
5. `Judge0SubmissionRequest` - 15 edges
6. `SubmissionServiceImpl` - 15 edges
7. `Submission` - 15 edges
8. `TestCase` - 15 edges
9. `ApiResponse` - 13 edges
10. `Judge0Response` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AppException` --references--> `ErrorCode`  [EXTRACTED]
  backend-core/src/main/java/com/dapcode/backend_core/exception/AppException.java → backend-core/src/main/java/com/dapcode/backend_core/common/ErrorCode.java
- `Judge0ClientIntegrationTest` --references--> `Judge0Client`  [EXTRACTED]
  backend-core/src/test/java/com/dapcode/backend_core/judge0/Judge0ClientIntegrationTest.java → backend-core/src/main/java/com/dapcode/backend_core/judge0/Judge0Client.java
- `BatchResponse` --references--> `Judge0Response`  [EXTRACTED]
  backend-core/src/main/java/com/dapcode/backend_core/judge0/Judge0ClientImpl.java → backend-core/src/main/java/com/dapcode/backend_core/judge0/Judge0Response.java
- `TestCaseRepository` --references--> `TestCase`  [EXTRACTED]
  backend-core/src/main/java/com/dapcode/backend_core/repository/TestCaseRepository.java → backend-core/src/main/java/com/dapcode/backend_core/entity/TestCase.java
- `EvaluationSummary` --references--> `TestCaseResult`  [EXTRACTED]
  backend-core/src/main/java/com/dapcode/backend_core/service/submission/SubmissionServiceImpl.java → backend-core/src/main/java/com/dapcode/backend_core/dto/submission/TestCaseResult.java

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "SubmissionServiceImpl.java"
Cohesion: 0.08
Nodes (23): arraylist, AppException, Judge0Client, BatchResponse, Override, Judge0ClientImpl, Judge0Response, Status (+15 more)

### Community 1 - "Users"
Cohesion: 0.14
Nodes (14): assertequals, assertnotnull, asserttrue, autowired, Users, UserRepository, SubmissionService, BackendCoreApplicationTests (+6 more)

### Community 2 - "ErrorCode"
Cohesion: 0.12
Nodes (17): accesslevel, ApiResponse, ErrorCode, INVALID_REQUEST, PROBLEM_NOT_FOUND, UNAUTHENTICATED, UNAUTHORIZED, UNCATEGORIZED_EXCEPTION (+9 more)

### Community 3 - "lombok.AllArgsConstructor"
Cohesion: 0.28
Nodes (15): PageResponse, ProblemDetailResponse, PublicTestCaseDto, ProblemSummaryResponse, SubmissionResponse, SubmitCodeRequest, TestCaseResult, list (+7 more)

### Community 4 - "CorsConfig.java"
Cohesion: 0.15
Nodes (16): abstracthttpconfigurer, CorsConfig, SecurityConfig, Judge0Config, corsconfiguration, duration, org.springframework.context.annotation.Bean, org.springframework.context.annotation.Configuration (+8 more)

### Community 5 - "Submission.java"
Cohesion: 0.31
Nodes (17): Problem, Submission, TestCase, column, creationtimestamp, fetchtype, generatedvalue, generationtype (+9 more)

### Community 6 - "Judge0Status"
Cohesion: 0.11
Nodes (15): Judge0Status, ACCEPTED, COMPILATION_ERROR, EXEC_FORMAT_ERROR, IN_QUEUE, INTERNAL_ERROR, PROCESSING, RUNTIME_ERROR_NZEC (+7 more)

### Community 7 - "seed_problems.py"
Cohesion: 0.17
Nodes (16): argparse, html, json, os, re, escape_sql(), extract_slug(), fetch_problem_metadata() (+8 more)

### Community 8 - "ProblemRepository.java"
Cohesion: 0.17
Nodes (8): ProblemRepository, SubmissionRepository, optional, org.springframework.data.domain.Page, org.springframework.data.domain.Pageable, org.springframework.data.jpa.repository.JpaRepository, org.springframework.data.jpa.repository.Query, param

### Community 9 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 10 - "BackendCoreApplication.java"
Cohesion: 0.50
Nodes (3): BackendCoreApplication, org.springframework.boot.autoconfigure.SpringBootApplication, springapplication

## Knowledge Gaps
- **21 isolated node(s):** `com.dapcode:backend-core`, `INVALID_REQUEST`, `PROBLEM_NOT_FOUND`, `UNAUTHENTICATED`, `UNAUTHORIZED` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 60 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Judge0Status` connect `Judge0Status` to `SubmissionServiceImpl.java`, `Submission.java`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `ErrorCode` connect `ErrorCode` to `SubmissionServiceImpl.java`, `Submission.java`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Judge0SubmissionRequest` connect `SubmissionServiceImpl.java` to `Users`, `lombok.AllArgsConstructor`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `com.dapcode:backend-core`, `INVALID_REQUEST`, `PROBLEM_NOT_FOUND` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SubmissionServiceImpl.java` be split into smaller, more focused modules?**
  _Cohesion score 0.07862679955703211 - nodes in this community are weakly interconnected._
- **Should `Users` be split into smaller, more focused modules?**
  _Cohesion score 0.1350806451612903 - nodes in this community are weakly interconnected._
- **Should `ErrorCode` be split into smaller, more focused modules?**
  _Cohesion score 0.12169312169312169 - nodes in this community are weakly interconnected._