# Hướng Dẫn Khởi Động & Chạy Spring Boot (backend-core)

Tài liệu hướng dẫn khởi động hệ thống Backend, cấu hình cơ sở dữ liệu PostgreSQL và cơ chế tự động nạp Migration (Flyway) cho Dapcode.

---

## 1. Yêu cầu môi trường

- **Java**: JDK 21 trở lên (kiểm tra bằng lệnh `java -version`)
- **Docker**: Dùng để chạy container PostgreSQL và Judge0 Sandbox
- **Maven**: Dự án đã tích hợp sẵn Maven Wrapper (`mvnw` / `mvnw.cmd`), không bắt buộc phải cài Maven trên máy.

---

## 2. Bước 1: Khởi động Cơ sở dữ liệu PostgreSQL

Trước khi chạy Spring Boot, database PostgreSQL phải đang hoạt động:

```powershell
# Từ thư mục gốc dự án Dapcode:
cd infra\database
docker compose -f docker-compose.db.yml up -d
```

> **Thông tin kết nối mặc định (theo `application.yaml`):**
> - **Host**: `localhost:5432`
> - **Database**: `dapcode_db`
> - **User**: `postgres`
> - **Password**: `123123`

*(Tùy chọn) Nếu bạn muốn chạy cả sandbox chấm code Judge0:*
```powershell
cd infra\sandbox
docker compose up -d
```

---

## 3. Bước 2: Chạy Spring Boot Backend

Mở terminal tại thư mục `backend-core`:
```powershell
cd i:\Github\Dapcode\backend-core
```

### 🔹 Cách 1: Khởi động Server trực tiếp (Dev Server)
Sử dụng Maven Wrapper để chạy ứng dụng trên cổng `8080`:

- **Trên Windows (CMD / PowerShell):**
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```
- **Nếu máy đã cài sẵn Maven:**
  ```powershell
  mvn spring-boot:run
  ```

---

### 🔹 Cách 2: Chạy Test để nạp Migration nhanh (Không giữ server)
Nếu bạn chỉ muốn Flyway nạp các file migration mới (`V5`, `V6`) vào database mà không cần giữ server chạy liên tục:
```powershell
.\mvnw.cmd test
```

---

## 4. Cơ chế tự động chạy Migration (Flyway)

Khi Spring Boot khởi động, thư viện **Flyway** sẽ tự động quét thư mục:
`src/main/resources/db/migration/`

Nó sẽ so sánh với bảng lịch sử `flyway_schema_history` trong PostgreSQL. Nếu phát hiện file mới, nó sẽ tự động thực thi theo đúng thứ tự:
1. `V5__create_theories_table.sql`: Tự động tạo bảng `theories` và các index.
2. `V6__seed_theories.sql`: Tự động nạp toàn bộ 29 bài học lý thuyết vào database.

### Dấu hiệu thành công trên Terminal Log:
Khi khởi động, bạn sẽ thấy log tương tự như sau:
```text
o.f.c.i.database.base.BaseDatabaseType   : Database: jdbc:postgresql://localhost:5432/dapcode_db (PostgreSQL 16.x)
o.f.core.internal.command.DbMigrate      : Current version of schema "public": 4
o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "5 - create theories table"
o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "6 - seed theories"
o.f.core.internal.command.DbMigrate      : Successfully applied 2 migrations to schema "public"
...
Tomcat started on port 8080 (http) with context path '/'
Started BackendCoreApplication in 3.456 seconds
```

---

## 5. Kiểm tra dữ liệu sau khi chạy

### 🔹 Kiểm tra qua SQL (DBeaver / DataGrip / psql):
```sql
-- Kiểm tra số lượng bài lý thuyết đã được nạp
SELECT count(*) FROM theories;
-- Kết quả kỳ vọng: 29 rows

-- Xem thử danh sách bài học
SELECT title, slug, category, order_index FROM theories ORDER BY category, order_index;
```

### 🔹 Kiểm tra các API đang hoạt động:
Sau khi server khởi động trên cổng `8080`:
- Danh sách bài tập: `http://localhost:8080/api/v1/problems`
- Chi tiết bài tập: `http://localhost:8080/api/v1/problems/two-sum`

---

## 6. Các lệnh hữu ích khác

| Mục đích | Lệnh PowerShell |
| :--- | :--- |
| Dọn dẹp và đóng gói file JAR | `.\mvnw.cmd clean package -DskipTests` |
| Xóa build cache cũ | `.\mvnw.cmd clean` |
| Chạy 1 test cụ thể | `.\mvnw.cmd test -Dtest=ProblemApiIntegrationTest` |
