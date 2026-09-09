# 🐳 Judge0 Code Execution Sandbox

Môi trường Sandbox cô lập dùng để biên dịch và chấm mã nguồn bài nộp của học viên (C++, Java, Python 3).

## 🚀 Khởi động Sandbox

Yêu cầu máy đã cài **Docker Desktop** (Windows/macOS) hoặc **Docker Engine** (Linux).

```bash
cd infra/sandbox
docker compose -f docker-compose.sandbox.yml up -d
```

## 🔍 Kiểm tra trạng thái

```bash
docker compose -f docker-compose.sandbox.yml ps
```

Các dịch vụ sẽ lắng nghe tại:
* **Judge0 API**: `http://localhost:2358`
* **Healthcheck API**: `http://localhost:2358/system_info`
* **Languages API**: `http://localhost:2358/languages`

## ⏹ Dừng cụm Sandbox

```bash
docker compose -f docker-compose.sandbox.yml down
```
