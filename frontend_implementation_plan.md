# 🚀 Kế Hoạch Triển Khai Chi Tiết: Dapcode Frontend (React + Vite)

> **Mục tiêu:** Xây dựng giao diện Web SPA chuẩn mực theo phong cách LeetCode / Codeforces hiện đại, tích hợp trực tiếp với **Spring Boot Core API (Port 8080)**, trình chấm Sandbox thời gian thực (SSE Stream) và **AI Socratic Tutor**.

---

## 🛠 1. Tech Stack Chuẩn Hóa

| Thành phần | Công nghệ lựa chọn | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Core Framework** | **React 18 / 19 + Vite + TypeScript** | SPA hiệu năng cao, type-safe, tốc độ build tức thì |
| **Styling** | **Tailwind CSS** | Giao diện hiện đại, Dark mode mặc định, responsive |
| **Code Editor** | **`@monaco-editor/react`** | Trình soạn thảo chuẩn VS Code (hỗ trợ Python, Java, C++) |
| **Layout & Splitter** | **`react-resizable-panels`** | Chia cột kéo thả linh hoạt (Problem \| Editor \| Console) |
| **State Management** | **Zustand** | Quản lý Auth State, Editor Code, Submission Status gọn nhẹ |
| **Routing** | **React Router v6** | Định tuyến SPA (`/problems`, `/problems/:slug`, `/profile`) |
| **Icons & UI** | **`lucide-react`** | Bộ icon hiện đại, tối giản |
| **Markdown & Code** | **`react-markdown` + `rehype-highlight`** | Render đề bài Markdown & phản hồi AI Socratic |
| **Realtime Stream** | **`EventSource` / Fetch API** | Nhận luồng tiến độ chấm bài từng testcase qua SSE |

---

## 🗺 2. Bản Đồ Điều Hướng (Route Map)

```text
/                       --> Landing Page (Giới thiệu & CTA)
├── /login              --> Trang / Modal đăng nhập Google OAuth2
├── /problems           --> Danh sách & bộ lọc bài tập (Explore)
├── /problems/:slug     --> Coding Workspace (Monaco + SSE + AI Socratic Tutor)
├── /theories           --> Thư viện lý thuyết DSA (Misc-DSA)
└── /profile            --> Trang cá nhân, Streak & Lịch sử nộp bài
```

---

## 📅 3. Lộ Trình Triển Khai Chi Tiết (5 Giai Đoạn)

### 🔹 Giai đoạn 1: Khởi tạo Project & Hạ tầng cơ sở (Ngày 1)
- [ ] Khởi tạo dự án Vite React TypeScript trong thư mục `frontend/`.
- [ ] Cài đặt & cấu hình Tailwind CSS, Dark Theme làm chủ đạo (tông màu tối hiện đại xịn xò như LeetCode Dark).
- [ ] Cấu hình Axios Client (`src/api/client.ts`):
  - Base URL trỏ về `http://localhost:8080`.
  - Request Interceptor tự động gán Bearer JWT token từ `localStorage`.
  - Response Interceptor xử lý lỗi 401 (hết hạn token).
- [ ] Khởi tạo Zustand Store:
  - `useAuthStore`: Quản lý user profile, JWT token, login/logout.
  - `useProblemStore`: Quản lý danh sách bài tập và bài đang chọn.

---

### 🔹 Giai đoạn 2: Coding Workspace — Trọng tâm số 1 của Dapcode (Ngày 2 - 3)
> Màn hình chính nơi học viên code và thi đấu (`/problems/:slug`):

- [ ] **Bố cục 3 Panel kéo thả (`react-resizable-panels`):**
  - **Panel Trái:** Render đề bài chuẩn Markdown (`react-markdown`), bảng ví dụ Input/Output, Ràng buộc bài toán.
  - **Panel Phải trên:** Monaco Editor chọn ngôn ngữ (Python 3, Java, C++), chuyển theme, nút Reset.
  - **Panel Phải dưới (Console):** Tab xem Testcase mẫu + Tab xem Test Result.
- [ ] **Tích hợp Nộp bài & Stream SSE Realtime:**
  - Nút **"Run Code"**: Chạy thử với testcase mẫu.
  - Nút **"Submit"**: Gọi `POST /api/v1/submissions`.
  - Lắng nghe sự kiện SSE tại `GET /api/v1/submissions/{id}/stream`:
    - Cập nhật progress bar theo từng test case (`TEST_PROGRESS`).
    - Hiển thị bảng tổng kết (`SUBMISSION_COMPLETE`): `ACCEPTED` (xanh), `WRONG_ANSWER` (đỏ), thời gian chạy (ms), dung lượng RAM (KB).

---

### 🔹 Giai đoạn 3: Tích hợp Widget "AI Socratic Tutor" (Ngày 4)
- [ ] Thêm nút bấm nổi bật **"Xin gợi ý" (AI Tutor)** trên thanh công cụ của Editor.
- [ ] Xây dựng Drawer / Modal tương tác với AI:
  - Cho phép học viên chọn cấp độ:
    - **Level 1 (Gợi mở tư duy - Nudge)**.
    - **Level 2 (Mã giả - Pseudocode)**.
  - Ô nhập thắc mắc cá nhân (tùy chọn).
  - Tự động đính kèm code hiện tại và thông báo lỗi (nếu vừa chạy test fail) vào payload.
- [ ] Gọi API Spring Boot: `POST /api/v1/ai/hint`.
- [ ] Hiển thị câu trả lời Socratic định hướng bằng Markdown đẹp mắt, có hiệu ứng gõ chữ hoặc loading mượt mà.

---

### 🔹 Giai đoạn 4: Danh Sách Bài Tập & Bộ Lọc Đa Năng (Ngày 5)
- [ ] Xây dựng giao diện danh sách bài tập (`/problems`):
  - Thanh tìm kiếm theo tên/từ khóa có Debounce.
  - Dropdown lọc theo Danh mục (Arrays, Two Pointers, Dynamic Programming, Tree...).
  - Dropdown lọc theo Độ khó (Easy, Medium, Hard).
- [ ] Bảng bài tập hiển thị trạng thái (Icon tick xanh nếu tài khoản đã giải thành công).
- [ ] Sidebar tóm tắt tiến độ: Chuỗi Streak ngày, tỷ lệ hoàn thành các bài NeetCode 150.

---

### 🔹 Giai đoạn 5: Đăng Nhập Google, Profile & Hoàn Thiện (Ngày 6 - 7)
- [ ] Tích hợp nút Đăng nhập Google OAuth2 kết nối Spring Boot (`/api/v1/auth/google`).
- [ ] Trang cá nhân (`/profile`):
  - Avatar, thông tin tài khoản, điểm XP, chuỗi Streak.
  - Danh sách lịch sử nộp bài gần đây.
- [ ] Landing page giới thiệu nền tảng tại route `/`.
- [ ] Kiểm thử toàn diện đầu-cuối (E2E Test) luồng người dùng: Đăng nhập $\rightarrow$ Chọn bài $\rightarrow$ Viết code $\rightarrow$ Hỏi AI $\rightarrow$ Nộp bài thành công.
