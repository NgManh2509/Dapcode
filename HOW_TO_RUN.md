# 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Dapcode (How To Run)

Tài liệu hướng dẫn chi tiết từng bước thiết lập môi trường và khởi chạy toàn bộ các thành phần của hệ thống **Dapcode** từ mã nguồn trên máy phát triển (Windows, Linux, macOS).

---

## 📋 Mục Lục

1. [Yêu Cầu Môi Trường (Prerequisites)](#1-yêu-cầu-môi-trường-prerequisites)
2. [Cấu Trúc Hệ Thống & Cổng Dịch Vụ](#2-cấu-trúc-hệ-thống--cổng-dịch-vụ)
3. [Thiết Lập Biến Môi Trường (.env)](#3-thiết-lập-biến-môi-trường-env)
4. [Các Bước Khởi Chạy Từng Dịch Vụ](#4-các-bước-khởi-chạy-từng-dịch-vụ)
   - [Bước 1: Khởi động Hạ tầng Docker (PostgreSQL & Sandbox)](#bước-1-khởi-động-hạ-tầng-docker-postgresql--sandbox)
   - [Bước 2: Khởi động Backend Core (Spring Boot 4)](#bước-2-khởi-động-backend-core-spring-boot-4)
   - [Bước 3: Khởi động AI Socratic Tutor Service (FastAPI)](#bước-3-khởi-động-ai-socratic-tutor-service-fastapi)
   - [Bước 4: Khởi động Frontend Client (React 19 + Vite)](#bước-4-khởi-động-frontend-client-react-19--vite)
5. [Nạp Dữ Liệu Khởi Tạo (Seeding Data)](#5-nạp-dữ-liệu-khởi-tạo-seeding-data)
6. [Xử Lý Lỗi Thường Gặp (Troubleshooting)](#6-xử-lý-lỗi-thường-gặp-troubleshooting)

---

## 1. Yêu Cầu Môi Trường (Prerequisites)

Hãy đảm bảo máy tính đã cài đặt các công cụ sau trước khi tiến hành:

| Phần mềm / Công cụ | Phiên bản khuyến nghị | Lệnh kiểm tra |
| :--- | :--- | :--- |
| **Java JDK** | Java 21 LTS (OpenJDK / Eclipse Temurin) | `java -version` |
| **Node.js & npm** | Node.js 18+ (khuyên dùng Node 20 LTS) | `node -v` && `npm -v` |
| **Python** | Python 3.11+ | `python --version` |
| **Docker Desktop** | Phiên bản mới nhất (hỗ trợ Compose v2) | `docker --version` |
| **Git** | Phiên bản bất kỳ | `git --version` |

> [!NOTE]
> Dự án đã tích hợp sẵn **Maven Wrapper** (`mvnw` và `mvnw.cmd`) tại thư mục `backend-core/`, nên bạn **không cần** cài riêng Maven toàn cục.

---

## 2. Cấu Trúc Hệ Thống & Cổng Dịch Vụ

Khi toàn bộ hệ thống hoạt động, các dịch vụ sẽ lắng nghe trên các cổng mặc định sau:

| Dịch vụ | Công nghệ | Cổng mặc định | Địa chỉ truy cập / Health check |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | React 19 + Vite | `5173` | `http://localhost:5173` |
| **Backend Core** | Spring Boot 4.1.1 | `8080` | `http://localhost:8080/api/v1/problems` |
| **AI Socratic Tutor** | FastAPI + ChromaDB | `8000` | `http://localhost:8000/health` |
| **Judge0 Sandbox** | Judge0 CE + Redis | `2358` | `http://localhost:2358/system_info` |
| **PostgreSQL Main** | Postgres 16 Alpine | `5432` | `localhost:5432` (database: `dapcode_db`) |

---

## 3. Thiết Lập Biến Môi Trường (.env)

### 3.1. Cấu hình Backend Core (`backend-core/.env`)
Tạo file `.env` bên trong thư mục `backend-core/` dựa trên file mẫu [`.env.example`](file:///i:/Github/Dapcode/backend-core/.env.example):

```bash
cd backend-core
cp .env.example .env
```

Nội dung file `backend-core/.env`:
```env
# Chuỗi khóa bí mật JWT (Base64 tối thiểu 256-bit)
JWT_SECRET=K7vQ8zP2mR4wX9yL1tN5bC0fG3jH6kE8sA1dF4gJ7hL=

# Google OAuth2 Credentials (tùy chọn khi cần đăng nhập qua Google)
GOOGLE_CLIENT_ID=dummy-google-client-id
GOOGLE_CLIENT_SECRET=dummy-google-client-secret
```

### 3.2. Cấu hình AI Service (`AI-service/.env`)
Tạo file `.env` bên trong thư mục `AI-service/` dựa trên file mẫu [`AI-service/.env.example`](file:///i:/Github/Dapcode/AI-service/.env.example):

```bash
cd AI-service
cp .env.example .env
```

Nội dung file `AI-service/.env`:
```env
# Lấy API Key miễn phí tại https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=8000
HOST=0.0.0.0
APP_ENV=development
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHROMA_PERSIST_DIR=./data/chroma_db
```

---

## 4. Các Bước Khởi Chạy Từng Dịch Vụ

Khuyến nghị khởi chạy theo đúng thứ tự 4 bước dưới đây:

### Bước 1: Khởi động Hạ tầng Docker (PostgreSQL & Sandbox)

Mở cửa sổ Terminal thứ nhất:

```bash
# 1. Khởi động cơ sở dữ liệu chính PostgreSQL (dapcode_db)
cd infra/database
docker compose -f docker-compose.db.yml up -d

# 2. Khởi động cụm Sandbox chấm bài Judge0 CE + Redis
cd ../sandbox
docker compose -f docker-compose.sandbox.yml up -d
```

**Kiểm tra trạng thái container:**
```bash
docker ps
```
Bạn sẽ thấy 4 container đang chạy:
- `dapcode-postgres` (Port `5432`)
- `dapcode-judge0-server` (Port `2358`)
- `dapcode-judge0-workers`
- `dapcode-judge0-redis`

**Kiểm tra Judge0 đã sẵn sàng:**
```bash
curl http://localhost:2358/system_info
```

---

### Bước 2: Khởi động Backend Core (Spring Boot 4)

Mở cửa sổ Terminal thứ hai:

```bash
cd backend-core

# Trên Windows (PowerShell / Command Prompt):
.\mvnw.cmd spring-boot:run

# Trên Linux / macOS:
./mvnw spring-boot:run
```

> [!NOTE]
> Khi khởi động lần đầu tiên, **Flyway Migration** sẽ tự động chạy liên tiếp các script từ `V1` đến `V8` trong thư mục `backend-core/src/main/resources/db/migration/`:
> - Tự tạo cấu trúc các bảng (`users`, `problems`, `theories`, `submissions`,...).
> - Tự nạp 250 bài tập thuật toán NeetCode kèm test case.
> - Tự nạp 29 chuyên đề lý thuyết thuật toán.
> - Tự cập nhật starter code template (C++, Java, Python 3) cho tất cả bài tập.

Khi thấy log hiển thị:
```text
Started BackendCoreApplication in ... seconds (process running for ...)
```
Backend đã sẵn sàng phục vụ tại `http://localhost:8080`.

---

### Bước 3: Khởi động AI Socratic Tutor Service (FastAPI)

Mở cửa sổ Terminal thứ ba:

```bash
cd AI-service

# 1. Tạo môi trường ảo Python
python -m venv venv

# 2. Kích hoạt môi trường ảo:
# Trên Windows:
venv\Scripts\activate
# Trên Linux/macOS:
source venv/bin/activate

# 3. Cài đặt các thư viện phụ thuộc:
pip install -r requirements.txt

# 4. Chạy service:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> [!TIP]
> Trong lần chạy đầu tiên, FastAPI sẽ tự động tải mô hình embedding `sentence-transformers/all-MiniLM-L6-v2` (~80MB) về bộ nhớ đệm và khởi tạo vector store ChromaDB trong `AI-service/data/chroma_db`.

**Kiểm tra trạng thái:**
Truy cập `http://localhost:8000/health` trên trình duyệt hoặc chạy `curl http://localhost:8000/health`, nhận về:
```json
{"status": "ok", "service": "AI Socratic Tutor"}
```

---

### Bước 4: Khởi động Frontend Client (React 19 + Vite)

Mở cửa sổ Terminal thứ tư:

```bash
cd DapcodeFrontend

# 1. Cài đặt gói phụ thuộc npm
npm install

# 2. Khởi chạy máy chủ phát triển Vite
npm run dev
```

Mở trình duyệt và truy cập:
👉 **`http://localhost:5173`**

Tại đây bạn có thể:
- Xem danh sách và lọc 250 bài tập thuật toán.
- Xem biểu đồ lộ trình **Roadmap DAG**.
- Đọc 29 bài giảng lý thuyết tại mục **Theories**.
- Mở **Workspace**, chọn ngôn ngữ (C++, Java, Python 3), viết lời giải và bấm **Run** / **Submit** để nhận kết quả chấm trực tiếp qua SSE.
- Mở ngăn **AI Tutor** để nhận gợi ý tư duy Socratic thời gian thực.

---

## 5. Nạp Dữ Liệu Khởi Tạo (Seeding Data)

Thông thường, **Flyway** đã tự động nạp toàn bộ dữ liệu qua các file migration SQL. Nếu bạn muốn bóc tách thêm lý thuyết mới bằng AI hoặc cập nhật lại starter code, hãy sử dụng các công cụ trong thư mục `seedingData/`:

```bash
cd seedingData
```

1. **Cập nhật Starter Code cho toàn bộ 250 bài tập:**
   ```bash
   python fetch_and_seed_starter_codes.py
   ```
2. **Cào & Chuẩn hóa bài giảng lý thuyết bằng Gemini API:**
   ```bash
   # Chạy thử nghiệm 2 bài đầu tiên
   python seed_theory.py --limit 2

   # Chạy toàn bộ và tự copy sang backend:
   python seed_theory.py --copy-to-migrations
   ```
Xem chi tiết tại [seedingData/README.md](file:///i:/Github/Dapcode/seedingData/README.md).

---

## 6. Xử Lý Lỗi Thường Gặp (Troubleshooting)

### ❓ Lỗi 1: Cổng 5432 đã bị chiếm dụng (PostgreSQL Conflict)
- **Nguyên nhân**: Máy tính đã cài đặt PostgreSQL dạng service cục bộ chạy ngầm.
- **Cách khắc phục**:
  - Dừng PostgreSQL service cục bộ:
    ```powershell
    # Windows:
    Stop-Service postgresql*
    ```
  - Hoặc đổi cổng ngoài trong file `infra/database/docker-compose.db.yml` (ví dụ `5433:5432`) và cập nhật `spring.datasource.url` trong `backend-core/src/main/resources/application.yaml`.

---

### ❓ Lỗi 2: Judge0 Container báo lỗi quyền hoặc không khởi động
- **Nguyên nhân**: Docker Desktop trên Windows chưa kích hoạt WSL 2 integration hoặc thiếu quyền `privileged`.
- **Cách khắc phục**:
  1. Đảm bảo cấu hình `privileged: true` trong `infra/sandbox/docker-compose.sandbox.yml` không bị xóa.
  2. Khởi động lại Docker Desktop.
  3. Kiểm tra log của Judge0 server:
     ```bash
     docker logs dapcode-judge0-server -f
     ```

---

### ❓ Lỗi 3: Backend không kết nối được tới AI Service
- **Hiện tượng**: Bấm "Hỏi AI Tutor" trên Workspace báo lỗi kết nối hoặc phản hồi chậm.
- **Cách khắc phục**:
  1. Kiểm tra Terminal chạy `AI-service` đã mở cổng `8000`.
  2. Kiểm tra `GROQ_API_KEY` trong file `AI-service/.env` có hợp lệ hay không.
  3. Kiểm tra file `backend-core/src/main/resources/application.yaml` có trỏ đúng `ai-service.base-url: http://localhost:8000`.

---

### ❓ Lỗi 4: Lỗi Base64 kết quả chạy Judge0
- **Hiện tượng**: Output test case chứa chuỗi Base64 nhiều dòng hoặc ký tự xuống dòng.
- **Đã được giải quyết**: Hệ thống đã tích hợp `Base64.getMimeDecoder()` tại lớp `Judge0Response.java` và fallback tự động giải mã Base64 ở phía React (`ConsoleDrawer.jsx`).

---

🎉 **Chúc bạn có những giờ phút luyện tập thuật toán thật hiệu quả với Dapcode!**
