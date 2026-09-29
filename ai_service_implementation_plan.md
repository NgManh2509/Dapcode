# 📋 Kế Hoạch Triển Khai: AI Socratic Tutor Service (RAG + Groq)

> **Mục tiêu:** Xây dựng Microservice `AI-service` bằng **Python (FastAPI)**, sử dụng mô hình siêu tốc **Groq Cloud (`llama-3.3-70b-versatile`)** kết hợp **RAG (ChromaDB + all-MiniLM-L6-v2)** nạp từ 150 bài toán có lời giải mẫu của `NeetCode-150-main`. Hệ thống đóng vai trò gia sư Socratic định hướng tư duy cho học viên (không in code giải sẵn).

---

## 🏗 1. Kiến Trúc Kỹ Thuật

```text
[ Học viên bấm "Xin gợi ý" trên Web ]
                    │
                    │ HTTP POST /api/v1/ai/hint
                    ▼
[ Spring Boot Core Backend - Port 8080 ]
  ├── Xác thực JWT & lấy thông tin đề bài
  └── Gọi HTTP nội bộ (RestClient) ────────┐
                                            │
                                            ▼
                    [ FastAPI AI-service - Port 8000 ]
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
     [ 1. RAG Retriever ]                                      [ 2. Prompt Engine ]
  Tra cứu ChromaDB lấy:                                   Ghép vào System Prompt Socratic:
  - Đề bài chuẩn & Constraints                           - Tier 1: Nudge (Gợi mở lỗi sai/Big-O)
  - Code mẫu tối ưu (Optimal Solution)                   - Tier 2: Pseudocode (Mã giả từng bước)
  - Lý thuyết DSA liên quan                              - Quy tắc: CẤM in code giải hoàn chỉnh
               │                                                         │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
                              [ 3. Groq API Client ]
                            Model: llama-3.3-70b-versatile
                            Tốc độ: ~250-300 tokens/s
                                            │
                                            ▼
                              [ Trả về câu gợi ý JSON ]
```

---

## 📅 2. Lộ Trình Triển Khai 5 Giai Đoạn (Task Breakdown)

### 🔹 Giai đoạn 1: Môi trường & Cấu hình Nền tảng
- [ ] Khởi tạo file `requirements.txt`:
  - `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`, `python-dotenv`.
  - `groq`: SDK chính thức kết nối Groq Cloud API.
  - `chromadb`: Vector DB nhúng local.
  - `sentence-transformers`: Model embedding `all-MiniLM-L6-v2` chạy trực tiếp trên CPU local (~80MB).
- [ ] Cấu hình `AI-service/.env` & `AI-service/app/core/config.py`:
  - `GROQ_API_KEY`, `PORT=8000`, `HOST=0.0.0.0`, `EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2`.

---

### 🔹 Giai đoạn 2: Xây dựng RAG Ingestion Pipeline (Kho Tri Thức)
- [ ] Xây dựng `app/rag/parser.py`:
  - Đọc đệ quy 150 file `.md` trong thư mục `NeetCode-150-main/`.
  - Parse tách bạch các trường:
    - `title`: Tên bài toán (ví dụ: "Contains Duplicate").
    - `difficulty`: Easy, Medium, Hard.
    - `category`: Tên thư mục (ví dụ: "Arrays & Hashing", "Two Pointers",...).
    - `description`: Mô tả đề bài, ví dụ mẫu (Examples).
    - `constraints`: Ràng buộc dữ liệu ($N \le 10^5$, giá trị âm, mảng rỗng,...).
    - `optimal_solution`: Đoạn mã giải mẫu chuẩn có trong file markdown.
- [ ] Xây dựng `app/rag/vector_store.py`:
  - Khởi tạo ChromaDB client lưu dữ liệu bền vững (persistent directory) tại `AI-service/data/chroma_db/`.
  - Khởi tạo collection `neetcode_150_knowledge`.
- [ ] Viết script `app/rag/ingest.py`:
  - Chạy quét 1 lần duy nhất: Embed 150 bài và lưu vào ChromaDB.

---

### 🔹 Giai đoạn 3: RAG Retriever & Socratic Prompt Engine
- [ ] Xây dựng `app/rag/retriever.py`:
  - Tra cứu tài liệu theo `problem_title` hoặc `problem_slug`.
  - Tìm kiếm tương đồng ngữ nghĩa (semantic similarity) nếu học viên gặp lỗi chưa rõ ràng.
- [ ] Xây dựng `app/core/prompts.py`:
  - **Chỉ dẫn cốt lõi (Core Principles)**:
    1. Tuyệt đối **không in mã nguồn hoàn chỉnh** (Full solution code) bằng bất kỳ ngôn ngữ nào.
    2. Đóng vai một người thầy hiền triết Socratic: quan sát code của học viên, đối chiếu với code mẫu tối ưu, tìm ra "lỗ hổng tư duy" và đặt câu hỏi gợi mở.
  - **Tier 1 - Socratic Nudge Prompt**:
    - Nhận diện nếu học viên dùng thuật toán sai độ phức tạp (ví dụ $O(N^2)$ thay vì $O(N)$) $\rightarrow$ Hỏi về cấu trúc dữ liệu phù hợp hơn.
    - Nhận diện nếu bị Failed ở một test case đặc biệt $\rightarrow$ Đặt câu hỏi về trường hợp biên đó.
  - **Tier 2 - Pseudocode Prompt**:
    - Khi học viên yêu cầu trợ giúp sâu hơn $\rightarrow$ Cung cấp khung mã giả dạng các bước $1, 2, 3...$ để học viên tự cài đặt lại.

---

### 🔹 Giai đoạn 4: FastAPI Service & REST Endpoints
- [ ] Định nghĩa Pydantic Schemas trong `app/schemas/tutor.py`:
  - `HintRequest`:
    - `problem_title: str`
    - `problem_slug: str`
    - `source_code: str`
    - `language: str`
    - `failed_test_case: Optional[dict]` (input, expected, actual)
    - `hint_tier: int` (1 = Nudge, 2 = Pseudocode)
  - `HintResponse`:
    - `hint_tier: int`
    - `title: str`
    - `content: str`
    - `key_question: str`
- [ ] Xây dựng `app/services/socratic_service.py`:
  - Gọi `retriever.get_problem_context(...)`.
  - Kết nối Groq API (`llama-3.3-70b-versatile`) với nhiệt độ `temperature=0.3` (tính logic cao, ít ảo giác).
  - Trả về đối tượng `HintResponse`.
- [ ] Xây dựng Controller `app/api/v1/endpoints/tutor.py` & gắn vào `app/main.py`:
  - Endpoint `POST /api/v1/ai/hint`.
  - Khởi chạy server Uvicorn và kiểm tra Swagger UI tại `http://localhost:8000/docs`.

---

### 🔹 Giai đoạn 5: Cầu Nối Spring Boot $\leftrightarrow$ Python & Nghiệm Thu
- [ ] Trong `backend-core` (Java):
  - Viết `AiServiceClient` sử dụng Spring `RestClient` gọi HTTP sang `http://localhost:8000/api/v1/ai/hint`.
  - Mở Controller `AiController` (`POST /api/v1/ai/hint`) yêu cầu xác thực JWT.
- [ ] Kiểm thử End-to-End thực tế:
  - Gửi code bài "Contains Duplicate" dùng 2 vòng for $O(N^2)$.
  - Bấm xin gợi ý Tier 1 $\rightarrow$ Nhận câu hỏi gợi mở về `HashSet` trong thời gian $< 0.8$ giây từ Groq!

---

## 📊 3. Bảng Phân Phối Trách Nhiệm Công Nghệ

| Thành phần | Công nghệ | Chi phí | Lý do lựa chọn |
| :--- | :--- | :--- | :--- |
| **LLM Model** | Groq Cloud (`llama-3.3-70b-versatile`) | **0đ (Free Tier)** | Tốc độ nhanh nhất thế giới (~300 tokens/s), suy luận thuật toán đỉnh cao. |
| **Embedding** | `sentence-transformers` (`all-MiniLM-L6-v2`) | **0đ (Chạy local CPU)** | Nhẹ (~80MB), độc lập mạng, không sợ rate limit, tốc độ embed < 5ms. |
| **Vector DB** | `ChromaDB` | **0đ (Open source local)** | Lưu thẳng vào file thư mục, không cần cài đặt thêm container database. |
| **Web Server** | `FastAPI` + `Uvicorn` | **0đ (Open source)** | Async tốc độ cao, type-safe validation với Pydantic, tự sinh Swagger docs. |
| **Knowledge Base** | 150 bài NeetCode (`NeetCode-150-main`) | **Có sẵn trong repo** | Đầy đủ đề bài, constraints và code mẫu giải pháp tối ưu. |
