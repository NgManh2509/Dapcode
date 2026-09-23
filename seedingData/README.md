# Hướng Dẫn Seeding Dữ Liệu Lý Thuyết (Theory) - Dapcode

Tài liệu hướng dẫn sử dụng công cụ bóc tách, chuẩn hóa bài học DSA bằng AI (`gemini-3.1-flash-lite`) và sinh dữ liệu khởi tạo cho database PostgreSQL của Dapcode.

---

## 1. Chuẩn bị môi trường

1. Đảm bảo đã có **Python 3.10+** (Script sử dụng 100% thư viện chuẩn của Python, **không cần cài thêm bất kỳ package nào qua `pip`**).
2. Kiểm tra file `.env` tại thư mục `seedingData/.env` đã có API Key của Google AI Studio:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

---

## 2. Các lệnh chạy chính

Mở terminal tại thư mục `seedingData`:
```bash
cd i:\Github\Dapcode\seedingData
```

### 🔹 Cách 1: Chạy thử nghiệm 1–2 bài trước (Khuyên dùng)
Dùng tham số `--limit` để kiểm tra chất lượng dịch thuật và bóc tách của AI trước khi chạy toàn bộ:
```bash
python seed_theory.py --limit 2
```

### 🔹 Cách 2: Chạy toàn bộ danh sách
Xử lý toàn bộ ~28 bài trong file `theory.json`:
```bash
python seed_theory.py
```

### 🔹 Cách 3: Chạy và tự động copy file SQL sang Backend
Tự động copy file migration sinh ra vào thư mục Flyway của module `backend-core`:
```bash
python seed_theory.py --copy-to-migrations
```
*Đường dẫn đích:* `backend-core/src/main/resources/db/migration/V6__seed_theories.sql`

### 🔹 Cách 4: Chạy kiểm tra cào web (Không gọi Gemini API)
Dùng để kiểm tra kết nối mạng và khả năng cào text của URL:
```bash
python seed_theory.py --dry-run --limit 3
```

---

## 3. Bảng tham số (CLI Arguments)

| Tham số | Mặc định | Ý nghĩa |
| :--- | :--- | :--- |
| `--force` | `False` | **Ghi đè cache**, ép buộc cào và biên soạn lại bài học theo prompt chuyên sâu mới. |
| `--limit N` | `None` (chạy hết) | Giới hạn số bài cần xử lý (ví dụ: `--limit 2`). |
| `--copy-to-migrations` | `False` | Tự động copy file `V6__seed_theories.sql` sang `backend-core`. |
| `--dry-run` | `False` | Chỉ tải và làm sạch HTML, không gọi Gemini API và không ghi file. |
| `--delay S` | `1.5` | Thời gian nghỉ (giây) giữa các lần gọi API để tránh vượt quá Rate Limit. |
| `--api-key KEY` | Lấy từ `.env` | Nhập trực tiếp API key nếu không muốn đọc từ file `.env`. |
| `--input PATH` | `theory.json` | Đường dẫn tới file JSON chứa danh mục và link nguồn. |

---

## 4. Các file được tạo ra sau khi chạy

Khi chạy thành công, script sẽ sinh ra 3 file trong thư mục `seedingData/`:

1. **`theories_cache.json` (Bộ nhớ tạm)**:
   - Lưu trữ phản hồi từ Gemini tương ứng với từng URL.
   - **Tác dụng**: Nếu script bị ngắt quãng giữa chừng hoặc bạn chạy lại nhiều lần, những bài đã xử lý thành công sẽ được đọc trực tiếp từ cache, **hoàn toàn không tốn thêm quota gọi API**.
2. **`dapcode_theories.json`**:
   - Chứa danh sách các bài học lý thuyết hoàn chỉnh dưới định dạng JSON (gồm `id` UUID, `title`, `slug`, `category`, `summary`, `content_markdown`, `order_index`).
3. **`V6__seed_theories.sql`**:
   - File script SQL PostgreSQL chứa các lệnh `INSERT INTO theories ... ON CONFLICT (slug) DO UPDATE`.
   - Nội dung Markdown được bọc an toàn trong cú pháp `$content$...$content$` (PostgreSQL Dollar-Quoting), chống lỗi vỡ chuỗi do dấu nháy đơn `'` hoặc code block.

---

## 5. Khắc phục sự cố thường gặp

- **Lỗi HTTP 404 (Model not found)**:
  - Nếu mô hình `gemini-3.1-flash-lite` chưa hỗ trợ tại khu vực của API key, hãy mở `seed_theory.py` dòng 14 và đổi về:
    ```python
    GEMINI_MODEL = "gemini-2.5-flash"  # hoặc "gemini-1.5-flash"
    ```
- **Lỗi HTTP 429 (Resource Exhausted / Rate limit)**:
  - Tăng thời gian delay giữa các lần gọi:
    ```bash
    python seed_theory.py --delay 3.0
    ```
- **Muốn tạo lại nội dung từ đầu (bỏ qua cache)**:
  - Chỉ cần xóa file `theories_cache.json` rồi chạy lại lệnh.

---

## 6. Nạp dữ liệu vào Java Spring Boot qua Flyway

Sau khi file `V5__create_theories_table.sql` và `V6__seed_theories.sql` đã nằm trong thư mục:
`backend-core/src/main/resources/db/migration/`

Để thực thi nạp dữ liệu vào PostgreSQL:
1. Đảm bảo container PostgreSQL đang chạy:
   ```bash
   cd i:\Github\Dapcode\infra\database
   docker compose -f docker-compose.db.yml up -d
   ```
2. Khởi động Spring Boot Backend:
   ```bash
   cd i:\Github\Dapcode\backend-core
   .\mvnw.cmd spring-boot:run
   ```
   *(Hoặc chỉ chạy test để migrate nhanh: `.\mvnw.cmd test`)*

Flyway sẽ tự động phát hiện `V5` và `V6`, tự tạo bảng `theories` và insert toàn bộ 29 bài giảng vào database. Xem chi tiết tại [backend-core/README.md](file:///i:/Github/Dapcode/backend-core/README.md).

