-- ==========================================================================
-- Flyway Migration: V6__seed_theories.sql
-- Generated: 29 theory articles for Dapcode
-- ==========================================================================

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'a6bb74b9-dddc-5f64-9019-e16e4f4bf85b',
    'Cấu trúc dữ liệu Mảng (Array Data Structure)',
    'cau-truc-du-lieu-mang-array',
    'Array & Hashing',
    'Mảng là cấu trúc dữ liệu tuyến tính lưu trữ các phần tử tại các vị trí bộ nhớ liên tục, cho phép truy cập ngẫu nhiên với độ phức tạp O(1). Đây là nền tảng cốt lõi để xây dựng các cấu trúc phức tạp hơn như Stack, Queue và Hash Table, tối ưu hóa hiệu năng nhờ tính cục bộ của bộ nhớ (Cache Locality).',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong lập trình, khi cần lưu trữ một tập hợp các phần tử cùng kiểu dữ liệu, việc khai báo từng biến riêng lẻ là không khả thi. Mảng (Array) ra đời để giải quyết bài toán lưu trữ nhóm dữ liệu có thứ tự, cho phép truy cập nhanh chóng thông qua chỉ số (index).

**Bản chất:** Mảng là một khối bộ nhớ liên tục. 
- **C/C++:** Lưu trữ trực tiếp giá trị.
- **Python/Java (Non-primitive):** Lưu trữ các tham chiếu (references) đến đối tượng.

**Sơ đồ bộ nhớ:**
| Index | 0 | 1 | 2 | 3 |
|-------|---|---|---|---|
| Value | 10| 20| 30| 40|
| Addr  | 0x100 | 0x104 | 0x108 | 0x10C |

## 2. Chi tiết các thao tác cốt lõi

- **Truy cập (Access):** `arr[i]` = `BaseAddress + i * SizeOfElement`.
- **Chèn (Insert):** Nếu chèn vào giữa, cần dịch chuyển các phần tử phía sau sang phải (O(n)).
- **Xóa (Delete):** Cần dịch chuyển các phần tử phía sau sang trái để lấp đầy khoảng trống (O(n)).

**Mô phỏng (Dry Run):** Chèn giá trị 25 vào index 2 của [10, 20, 30].
1. Dịch 30 sang index 3: [10, 20, 30, 30]
2. Gán 25 vào index 2: [10, 20, 25, 30]

## 3. Đánh giá độ phức tạp (Big-O)

| Thao tác | Best | Average | Worst | Space |
|----------|------|---------|-------|-------|
| Access   | O(1) | O(1)    | O(1)  | O(1)  |
| Search   | O(1) | O(n)    | O(n)  | O(1)  |
| Insert   | O(1) | O(n)    | O(n)  | O(1)  |
| Delete   | O(1) | O(n)    | O(n)  | O(1)  |

## 4. Cài đặt mã nguồn

### C++
```cpp
#include <iostream>
#include <vector>
int main() {
    std::vector<int> arr = {1, 2, 3};
    arr.push_back(4); // Thêm vào cuối
    std::cout << arr[0]; // Truy cập O(1)
    return 0;
}
```

### Java
```java
int[] arr = new int[5];
arr[0] = 10; // Gán giá trị
System.out.println(arr[0]);
```

### Python
```python
arr = [1, 2, 3]
arr.append(4) # Thêm vào cuối
print(arr[0]) # Truy cập
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error:** Truy cập `arr[n]` trong khi mảng chỉ có `n` phần tử (index từ 0 đến n-1).
- **Index Out of Bounds:** Luôn kiểm tra `i >= 0 && i < size` trước khi truy cập.
- **Memory Leak:** Trong C++, nếu dùng mảng động (`new`), phải `delete[]` để tránh rò rỉ bộ nhớ.

## 6. Ứng dụng thực tế & Phỏng vấn
- **Ứng dụng:** Bộ đệm (Buffer), bảng băm (Hash Table), ma trận trong xử lý ảnh.
- **Bài toán phỏng vấn:** 
  1. *Two Sum:* Sử dụng Hash Map kết hợp mảng để tìm cặp số có tổng bằng K.
  2. *Trapping Rain Water:* Bài toán kinh điển về tối ưu hóa mảng bằng kỹ thuật Two Pointers.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'ad0ef3b0-215a-59e7-9fe6-9f01a1535b2b',
    'Phân bổ bộ nhớ: Ngăn xếp (Stack) và Vùng nhớ động (Heap)',
    'phan-bo-bo-nho-stack-vs-heap',
    'Array & Hashing',
    'Stack và Heap là hai vùng nhớ cốt lõi trong kiến trúc máy tính, đóng vai trò quyết định đến hiệu năng và tính ổn định của chương trình. Stack quản lý các lời gọi hàm và biến cục bộ theo cơ chế LIFO tự động, trong khi Heap cung cấp không gian linh hoạt cho các cấu trúc dữ liệu động với sự quản lý thủ công hoặc thông qua Garbage Collector.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Trong lập trình, bộ nhớ không phải là một khối đồng nhất. Để tối ưu hóa hiệu năng, hệ điều hành chia bộ nhớ thành các vùng chuyên biệt. Stack được thiết kế cho tốc độ và tính tự động, trong khi Heap được thiết kế cho sự linh hoạt về kích thước và thời gian sống của dữ liệu.

### Mô hình bộ nhớ:
| Vùng nhớ | Đặc tính | Cơ chế quản lý |
| :--- | :--- | :--- |
| **Stack** | LIFO (Last-In, First-Out), kích thước cố định | Tự động bởi CPU/Compiler |
| **Heap** | Phân tán, kích thước linh hoạt | Thủ công (C/C++) hoặc GC (Java/Python) |

### Sơ đồ trực quan:
```text
[ Bộ nhớ RAM ]
+-----------------------+
| Stack (Lớn dần xuống)  | -> Biến cục bộ, Frame hàm
+-----------------------+
|       ...             |
+-----------------------+
| Heap (Lớn dần lên)    | -> Đối tượng, Linked List, Tree
+-----------------------+
```

## 2. Chi tiết các thao tác cốt lõi
- **Stack Allocation:** Khi một hàm được gọi, một 'Stack Frame' được đẩy vào. Khi hàm kết thúc, frame đó bị hủy (pop). Thao tác này cực nhanh vì chỉ cần di chuyển con trỏ ngăn xếp (Stack Pointer).
- **Heap Allocation:** Khi dùng `new` hoặc `malloc`, hệ thống tìm một khối nhớ trống đủ lớn trong Heap, trả về địa chỉ (con trỏ). Việc này chậm hơn do phải tìm kiếm và quản lý danh sách các khối nhớ trống.

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Stack | Heap |
| :--- | :--- | :--- |
| Cấp phát | O(1) | O(log N) hoặc O(N) |
| Truy cập | O(1) | O(1) (qua con trỏ) |
| Giải phóng | O(1) | O(1) hoặc O(N) (GC) |

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
#include <iostream>
int main() {
    int x = 10; // Stack
    int* y = new int(20); // Heap
    std::cout << "Stack: " << x << ", Heap: " << *y << std::endl;
    delete y; // Giải phóng thủ công
    return 0;
}
```

### Java
```java
public class Main {
    public static void main(String[] args) {
        int x = 10; // Stack
        Integer y = new Integer(20); // Heap
        System.out.println("Stack: " + x + ", Heap: " + y);
        // GC tự động thu hồi y khi không còn tham chiếu
    }
}
```

### Python
```python
# Mọi đối tượng trong Python đều nằm trên Heap
x = 10 
y = [1, 2, 3] 
print(f"Stack reference: {x}, Heap object: {y}")
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Stack Overflow:** Xảy ra khi đệ quy quá sâu hoặc khai báo mảng cục bộ quá lớn.
- **Memory Leak:** Quên `delete` hoặc `free` trong C/C++, dẫn đến cạn kiệt Heap.
- **Dangling Pointer:** Truy cập vào vùng nhớ Heap đã bị giải phóng.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn Big Tech
- **Ứng dụng:** Stack dùng cho cơ chế Undo/Redo, duyệt cây (DFS). Heap dùng cho các cấu trúc dữ liệu động như Linked List, Graph.
- **Câu hỏi phỏng vấn:** 
  1. "Tại sao đệ quy sâu lại gây Stack Overflow?" (Giải thích về giới hạn Stack Frame).
  2. "Sự khác biệt giữa biến tham trị và tham chiếu trong bộ nhớ?" (Biến tham trị nằm trên Stack, đối tượng tham chiếu nằm trên Heap).$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'e170408f-a265-53c9-8cce-e6c1332df0d5',
    'Mảng Tĩnh (Static Array) và Mảng Động (Dynamic Array)',
    'mang-tinh-static-array-va-mang-dong-dynamic-array',
    'Array & Hashing',
    'Mảng là cấu trúc dữ liệu lưu trữ các phần tử cùng kiểu trong các ô nhớ liên tiếp. Trong khi mảng tĩnh có kích thước cố định được cấp phát tại thời điểm biên dịch, mảng động cho phép thay đổi kích thước linh hoạt tại thời điểm thực thi, là nền tảng cho hầu hết các cấu trúc dữ liệu bậc cao như ArrayList hay Vector.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong lập trình, mảng (Array) là cấu trúc dữ liệu cơ bản nhất. Tuy nhiên, khi đối mặt với các bài toán mà số lượng dữ liệu không xác định trước, việc sử dụng mảng tĩnh (Static Array) trở nên kém hiệu quả do giới hạn về kích thước. Mảng động (Dynamic Array) ra đời để giải quyết bài toán "tái cấp phát" bộ nhớ.

- **Mảng tĩnh**: Kích thước được xác định tại thời điểm biên dịch (Compile-time). Bộ nhớ được cấp phát trên Stack, tốc độ truy xuất cực nhanh nhưng không thể thay đổi kích thước.
- **Mảng động**: Kích thước được xác định tại thời điểm thực thi (Run-time). Bộ nhớ được cấp phát trên Heap, cho phép mở rộng bằng cách cấp phát một vùng nhớ mới lớn hơn và sao chép dữ liệu cũ sang.

### Sơ đồ bộ nhớ:
| Loại | Vùng nhớ | Kích thước | Thời điểm cấp phát |
| :--- | :--- | :--- | :--- |
| Static | Stack | Cố định | Compile-time |
| Dynamic | Heap | Linh hoạt | Run-time |

## 2. Chi tiết các thao tác cốt lõi

### Thao tác với Mảng động (Dynamic Array):
1. **Truy cập (Access)**: O(1) - Sử dụng địa chỉ cơ sở + (index * size_of_element).
2. **Chèn (Append)**: O(1) trung bình (Amortized). Nếu mảng đầy, cần O(n) để cấp phát vùng nhớ mới và copy dữ liệu.
3. **Xóa (Remove)**: O(n) do phải dịch chuyển các phần tử phía sau để lấp đầy khoảng trống.

**Mô phỏng (Dry Run) - Mở rộng mảng:**
- Mảng hiện tại: `[1, 2]` (Capacity = 2)
- Thêm `3`: Mảng đầy -> Cấp phát vùng nhớ mới (Capacity = 4) -> Copy `[1, 2]` -> Thêm `3` -> Kết quả: `[1, 2, 3, null]`.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Access | O(1) | O(1) | O(1) | O(1) |
| Insert (End) | O(1) | O(1) | O(n) | O(n) |
| Delete (End) | O(1) | O(1) | O(1) | O(1) |

*Lưu ý: Độ phức tạp O(n) khi chèn xảy ra do cơ chế nhân đôi kích thước (Resizing).* 

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
#include <iostream>
#include <vector>
int main() {
    // Mảng tĩnh
    int arr[5] = {1, 2, 3, 4, 5};
    // Mảng động (Vector)
    std::vector<int> dynArr = {1, 2, 3};
    dynArr.push_back(4); // Tự động cấp phát nếu đầy
    return 0;
}
```

### Java
```java
import java.util.ArrayList;
public class Main {
    public static void main(String[] args) {
        int[] staticArr = new int[5];
        ArrayList<Integer> dynArr = new ArrayList<>();
        dynArr.add(10); // Thêm phần tử
        dynArr.remove(0); // Xóa phần tử
    }
}
```

### Python
```python
# Python list thực chất là một Dynamic Array
static_like = [1, 2, 3, 4, 5]
dynamic_list = []
dynamic_list.append(10) # Thêm phần tử
dynamic_list.pop()      # Xóa phần tử cuối
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Index Out of Bounds**: Truy cập chỉ số âm hoặc lớn hơn kích thước hiện tại.
- **Memory Leak (C++)**: Quên `delete[]` khi cấp phát bằng `new`.
- **Off-by-one**: Lỗi phổ biến khi duyệt vòng lặp `i <= size` thay vì `i < size`.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng**: Bộ đệm (Buffer) trong hệ điều hành, danh sách các tiến trình, lưu trữ dữ liệu trong các ứng dụng web.
- **Bài toán phỏng vấn**:
  1. *Merge Sorted Arrays*: Kỹ thuật con trỏ để gộp hai mảng.
  2. *Two Sum*: Sử dụng Hash Map kết hợp mảng để tìm cặp số có tổng bằng K.
  3. *Dynamic Array Implementation*: Tự viết lại lớp `ArrayList` (yêu cầu quản lý capacity và resize).$content$,
    3,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '7761bf00-77d4-53c5-bf74-c181b5677459',
    'Ngăn xếp (Stack Data Structure)',
    'ngan-xep-stack',
    'Array & Hashing',
    'Ngăn xếp là cấu trúc dữ liệu tuyến tính tuân thủ nguyên lý LIFO (Last In, First Out), nơi phần tử được thêm vào và loại bỏ tại cùng một đầu gọi là đỉnh (top). Đây là công cụ nền tảng trong quản lý lời gọi hàm, xử lý biểu thức toán học và các thuật toán duyệt đồ thị/cây.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong lập trình, chúng ta thường xuyên đối mặt với các bài toán yêu cầu xử lý dữ liệu theo thứ tự ngược lại với thứ tự nhập vào (ví dụ: nút 'Back' trên trình duyệt, kiểm tra dấu ngoặc hợp lệ). Cấu trúc dữ liệu Stack ra đời để giải quyết nhu cầu này với độ phức tạp thời gian tối ưu.

**Mô hình tư duy:** Hãy tưởng tượng một chồng đĩa. Bạn chỉ có thể đặt thêm đĩa lên trên cùng hoặc lấy đĩa từ trên cùng xuống. Bạn không thể can thiệp vào các đĩa ở giữa mà không di chuyển các đĩa phía trên.

**Cơ chế bộ nhớ:** Stack thường được triển khai bằng mảng (Array) hoặc danh sách liên kết (Linked List). Khi dùng mảng, Stack tận dụng tính cục bộ bộ nhớ (Cache Locality) rất tốt, giúp tăng tốc độ truy xuất dữ liệu.

**Sơ đồ minh họa:**
```
|   |  <-- Đỉnh (TOP)
| 3 |  (Phần tử mới nhất)
| 2 |
| 1 |  (Phần tử đầu tiên)
-----
```

## 2. Chi tiết các thao tác cốt lõi

- **Push(x):** Thêm phần tử vào đỉnh. Kiểm tra `isFull()` trước khi thực hiện.
- **Pop():** Loại bỏ phần tử ở đỉnh. Kiểm tra `isEmpty()` trước khi thực hiện.
- **Peek/Top():** Xem giá trị đỉnh mà không xóa.
- **isEmpty():** Kiểm tra stack rỗng (TOP == -1).

**Dry Run (Push 1, 2, Pop):**
1. Khởi tạo: `TOP = -1`
2. Push(1): `TOP = 0`, `Stack[0] = 1`
3. Push(2): `TOP = 1`, `Stack[1] = 2`
4. Pop(): Trả về `Stack[1]`, `TOP = 0`

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Push | O(1) | O(1) | O(n) | O(1) |
| Pop | O(1) | O(1) | O(1) | O(1) |
| Peek | O(1) | O(1) | O(1) | O(1) |

*Lưu ý: Trường hợp xấu nhất của Push là O(n) khi mảng cần cấp phát lại (resize) nếu dùng mảng động.*

## 4. Cài đặt mã nguồn

### C++
```cpp
#include <iostream>
#include <vector>
using namespace std;

class Stack {
    vector<int> data;
public:
    void push(int x) { data.push_back(x); }
    void pop() { if(!data.empty()) data.pop_back(); }
    int top() { return data.back(); }
    bool empty() { return data.empty(); }
};
```

### Java
```java
import java.util.ArrayList;

class Stack {
    private ArrayList<Integer> list = new ArrayList<>();
    public void push(int x) { list.add(x); }
    public int pop() { return list.remove(list.size() - 1); }
    public boolean isEmpty() { return list.isEmpty(); }
}
```

### Python
```python
class Stack:
    def __init__(self): self.stack = []
    def push(self, item): self.stack.append(item)
    def pop(self): return self.stack.pop() if self.stack else None
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Stack Underflow:** Gọi `pop()` khi stack rỗng. Luôn kiểm tra `isEmpty()`.
- **Stack Overflow:** Gọi `push()` khi stack đã đầy (nếu dùng mảng cố định). Luôn kiểm tra `isFull()`.
- **Off-by-one:** Sai lầm khi quản lý chỉ số `TOP` (thường bắt đầu từ -1).

## 6. Ứng dụng thực tế & Phỏng vấn
- **Ứng dụng:** Trình biên dịch (kiểm tra cú pháp ngoặc), Undo/Redo trong phần mềm, DFS (Depth First Search).
- **Bài toán kinh điển:**
  1. *Valid Parentheses (LeetCode 20):* Dùng stack để khớp các cặp ngoặc.
  2. *Next Greater Element:* Dùng Monotonic Stack để tìm phần tử lớn hơn tiếp theo trong O(n).$content$,
    4,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'a0d66c78-c128-51f7-957f-ca9110c2ffbc',
    'Danh sách liên kết đơn (Singly Linked List)',
    'danh-sach-lien-ket-don-singly-linked-list',
    'Linked List',
    'Danh sách liên kết đơn là cấu trúc dữ liệu tuyến tính gồm các nút (nodes) được kết nối thông qua con trỏ, cho phép cấp phát bộ nhớ động linh hoạt. Khác với mảng, nó không yêu cầu không gian lưu trữ liên tục, giúp tối ưu hóa các thao tác chèn và xóa ở đầu danh sách nhưng đánh đổi bằng khả năng truy cập ngẫu nhiên.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong lập trình, mảng (Array) có nhược điểm cố định về kích thước và chi phí lớn khi chèn/xóa phần tử ở giữa (do phải dịch chuyển các phần tử). Danh sách liên kết đơn ra đời để giải quyết bài toán cấp phát bộ nhớ động, nơi kích thước dữ liệu không thể dự đoán trước.

**Mô hình tư duy:** Hãy tưởng tượng một chuỗi các toa tàu, mỗi toa chứa hàng hóa (data) và một móc nối (pointer) dẫn đến toa tiếp theo. Bạn không cần biết vị trí của cả đoàn tàu, chỉ cần biết vị trí toa đầu tiên (head).

**Cấu trúc bộ nhớ:**
- Các nút được lưu trữ phân tán trong vùng nhớ Heap.
- Mỗi nút bao gồm: `data` (giá trị) và `next` (địa chỉ nút kế tiếp).
- **Cache Locality:** Do không nằm liên tục, danh sách liên kết thường có hiệu năng kém hơn mảng khi duyệt do hiện tượng Cache Miss (CPU không thể dự đoán trước địa chỉ tiếp theo).

**Sơ đồ minh họa:**
[Head] -> [Data|Next] -> [Data|Next] -> [Data|NULL]

## 2. Chi tiết các thao tác cốt lõi

- **Duyệt (Traversal):** Bắt đầu từ `head`, đi theo con trỏ `next` cho đến khi gặp `NULL`.
- **Chèn (Insertion):** 
  - Tại đầu: Tạo nút mới, trỏ `new_node->next` vào `head`, cập nhật `head` là `new_node`.
  - Tại cuối: Duyệt đến nút cuối, trỏ `last->next` vào `new_node`.
- **Xóa (Deletion):** Cập nhật con trỏ của nút đứng trước nút cần xóa để bỏ qua nút đó.

**Mô phỏng (Dry Run):** Chèn 15 vào danh sách [10] -> [20] -> NULL
1. Tạo node(15).
2. `node(15)->next` = `head` (10).
3. `head` = `node(15)`. Kết quả: [15] -> [10] -> [20] -> NULL.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Truy cập | O(1) | O(n) | O(n) | O(1) |
| Chèn (đầu) | O(1) | O(1) | O(1) | O(1) |
| Chèn (cuối) | O(1) | O(n) | O(n) | O(1) |
| Xóa | O(1) | O(n) | O(n) | O(1) |

*Lưu ý: Chèn/Xóa ở cuối là O(n) vì phải duyệt từ đầu để tìm nút cuối.*

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
struct Node { int data; Node* next; Node(int d) : data(d), next(nullptr) {} };
// Chèn đầu
void insertHead(Node*& head, int val) {
    Node* newNode = new Node(val);
    newNode->next = head;
    head = newNode;
}
```

### Java
```java
class Node { int data; Node next; Node(int d) { data = d; next = null; } }
// Duyệt
void printList(Node head) {
    Node temp = head;
    while(temp != null) { System.out.print(temp.data + " "); temp = temp.next; }
}
```

### Python
```python
class Node: 
    def __init__(self, data): self.data = data; self.next = None
# Xóa đầu
def deleteHead(head):
    if not head: return None
    return head.next
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Null Pointer Exception:** Luôn kiểm tra `if (head == null)` trước khi truy cập `head->next`.
- **Memory Leak:** Trong C++, luôn phải `delete` nút khi xóa khỏi danh sách để tránh rò rỉ bộ nhớ.
- **Dangling Pointer:** Tránh truy cập vào con trỏ đã bị giải phóng.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Triển khai Stack/Queue, quản lý bộ nhớ trong hệ điều hành (Free list), trình duyệt (nút Back/Forward).
- **Câu hỏi phỏng vấn:**
  1. *Reverse a Linked List:* Đảo ngược danh sách (Kỹ thuật con trỏ prev, curr, next).
  2. *Detect Cycle:* Phát hiện vòng lặp (Thuật toán Floyd's Cycle-Finding - Rùa và Thỏ).
  3. *Merge Two Sorted Lists:* Trộn hai danh sách đã sắp xếp.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '96d47c86-d6b4-5d73-a38c-cfce1586f65d',
    'Danh sách liên kết đôi (Doubly Linked List)',
    'danh-sach-lien-ket-doi-doubly-linked-list',
    'Linked List',
    'Danh sách liên kết đôi là cấu trúc dữ liệu tuyến tính cho phép duyệt hai chiều nhờ việc mỗi nút lưu trữ hai con trỏ (next và prev). Đây là nền tảng quan trọng để tối ưu hóa các thao tác chèn/xóa tại vị trí bất kỳ và là thành phần cốt lõi trong các cấu trúc phức tạp như LRU Cache.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong danh sách liên kết đơn (Singly Linked List), chúng ta chỉ có thể duyệt theo một chiều (từ đầu đến cuối). Khi cần xóa một nút tại vị trí bất kỳ, chúng ta buộc phải duyệt từ đầu để tìm nút tiền nhiệm (predecessor), dẫn đến độ phức tạp O(N). Danh sách liên kết đôi (Doubly Linked List - DLL) ra đời để giải quyết hạn chế này bằng cách cho phép duyệt ngược.

### Mô hình tư duy
Mỗi nút (Node) trong DLL bao gồm 3 phần: `data` (dữ liệu), `next` (con trỏ đến nút kế tiếp), và `prev` (con trỏ đến nút trước đó).

### Sơ đồ cấu trúc
```
[NULL] <-> [Prev|Data|Next] <-> [Prev|Data|Next] <-> [NULL]
```

## 2. Chi tiết các thao tác cốt lõi

- **Chèn (Insertion):** Cần cập nhật 4 con trỏ (nút mới.next, nút mới.prev, nút trước.next, nút sau.prev).
- **Xóa (Deletion):** Cần cập nhật lại liên kết của nút trước và nút sau của nút bị xóa.

### Mô phỏng chèn vào giữa:
1. Tạo nút mới `newNode`.
2. `newNode->next = current->next`
3. `newNode->prev = current`
4. `current->next->prev = newNode`
5. `current->next = newNode`

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Thời gian (Trung bình) | Thời gian (Xấu nhất) | Không gian |
| :--- | :--- | :--- | :--- |
| Truy cập | O(N) | O(N) | O(1) |
| Chèn/Xóa (biết vị trí) | O(1) | O(1) | O(1) |
| Tìm kiếm | O(N) | O(N) | O(1) |

*Lưu ý: Mặc dù chèn/xóa là O(1), nhưng việc tìm đến vị trí đó vẫn mất O(N).* 

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
struct Node { int data; Node *next, *prev; };
// Cần quản lý con trỏ head và tail để tối ưu thao tác 2 đầu
```

### Java
```java
class Node { int data; Node next, prev; }
// Sử dụng đối tượng Node để quản lý liên kết
```

### Python
```python
class Node:
    def __init__(self, data): 
        self.data = data
        self.next = None
        self.prev = None
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Null Pointer Exception:** Luôn kiểm tra `head` hoặc `current` có bằng `null` trước khi truy cập `next` hoặc `prev`.
- **Memory Leak:** Trong C++, phải giải phóng (delete) từng nút khi hủy danh sách.
- **Cập nhật Head/Tail:** Khi xóa nút đầu hoặc cuối, phải cập nhật lại con trỏ `head` hoặc `tail` của danh sách.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn Big Tech
- **Ứng dụng:** Trình duyệt (nút Back/Forward), trình phát nhạc (danh sách phát), LRU Cache (sử dụng DLL kết hợp Hash Map).
- **Bài toán LeetCode:** 
  1. *Design LRU Cache:* Bài toán kinh điển yêu cầu O(1) cho cả get và put.
  2. *Reverse a Doubly Linked List:* Kỹ thuật hoán đổi con trỏ `next` và `prev`.$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '5ea3f61a-9618-55e2-a179-bb4722a8f287',
    'Hàng đợi sử dụng Danh sách liên kết (Queue using Linked List)',
    'hang-doi-su-dung-danh-sach-lien-ket',
    'Linked List',
    'Hàng đợi (Queue) là cấu trúc dữ liệu tuyến tính tuân thủ nguyên tắc FIFO (First-In-First-Out). Việc triển khai bằng danh sách liên kết giúp loại bỏ giới hạn dung lượng cố định của mảng, cho phép cấp phát bộ nhớ động linh hoạt và đảm bảo các thao tác chèn/xóa đạt độ phức tạp O(1).',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong lập trình, khi cần xử lý các tác vụ theo thứ tự đến trước phục vụ trước (như hàng đợi in ấn, bộ đệm gói tin mạng), Queue là cấu trúc dữ liệu tối ưu. Nếu dùng mảng (Array), chúng ta gặp vấn đề về kích thước cố định hoặc chi phí dịch chuyển phần tử khi xóa (O(n)). Sử dụng Danh sách liên kết (Linked List) giúp giải quyết triệt để vấn đề này.

### Mô hình tư duy
Queue được quản lý bởi hai con trỏ:
- `front`: Trỏ tới nút đầu tiên (nơi thực hiện Dequeue).
- `rear`: Trỏ tới nút cuối cùng (nơi thực hiện Enqueue).

### Sơ đồ trực quan
```text
[Front] -> [Node 1] -> [Node 2] -> [Node 3] -> [Rear]
             (Đầu)                    (Cuối)
```

## 2. Chi tiết các thao tác cốt lõi

- **Enqueue (Chèn)**: Thêm vào cuối danh sách. Cập nhật `rear->next` và di chuyển `rear` tới nút mới.
- **Dequeue (Xóa)**: Lấy từ đầu danh sách. Cập nhật `front = front->next`. Nếu `front` trở thành `null`, cập nhật `rear = null`.

### Mô phỏng (Dry Run)
1. Khởi tạo: `front=null, rear=null`.
2. Enqueue(10): `front=10, rear=10`.
3. Enqueue(20): `rear->next=20, rear=20`. Queue: `10 -> 20`.
4. Dequeue(): `temp=10, front=20`. Trả về 10.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Thời gian (Best/Avg/Worst) | Không gian (Space) |
| :--- | :--- | :--- |
| Enqueue | O(1) | O(1) |
| Dequeue | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
| Front | O(1) | O(1) |

*Phân tích*: Vì ta duy trì con trỏ `rear`, việc chèn vào cuối không cần duyệt lại danh sách, giúp đạt O(1).

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
class Node { public: int data; Node* next; Node(int d) : data(d), next(nullptr) {} };
class Queue {
    Node *front, *rear;
public:
    Queue() : front(nullptr), rear(nullptr) {}
    void enqueue(int x) {
        Node* temp = new Node(x);
        if (!rear) { front = rear = temp; return; }
        rear->next = temp; rear = temp;
    }
    int dequeue() {
        if (!front) return -1; // Underflow
        Node* temp = front; int d = temp->data;
        front = front->next;
        if (!front) rear = nullptr;
        delete temp; return d;
    }
};
```

### Java
```java
class Node { int data; Node next; Node(int d) { data = d; } }
class Queue {
    private Node front, rear;
    public void enqueue(int x) {
        Node temp = new Node(x);
        if (rear == null) { front = rear = temp; return; }
        rear.next = temp; rear = temp;
    }
    public int dequeue() {
        if (front == null) return -1;
        int d = front.data; front = front.next;
        if (front == null) rear = null;
        return d;
    }
}
```

### Python
```python
class Node: 
    def __init__(self, data): self.data = data; self.next = None
class Queue:
    def __init__(self): self.front = self.rear = None
    def enqueue(self, x):
        temp = Node(x)
        if not self.rear: self.front = self.rear = temp; return
        self.rear.next = temp; self.rear = temp
    def dequeue(self):
        if not self.front: return None
        d = self.front.data; self.front = self.front.next
        if not self.front: self.rear = None
        return d
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Queue Underflow**: Cố gắng Dequeue khi `front` là null. Luôn kiểm tra `isEmpty()` trước.
- **Memory Leak**: Trong C/C++, quên `delete` hoặc `free` nút đã dequeue sẽ gây rò rỉ bộ nhớ.
- **Dangling Pointer**: Sau khi xóa nút cuối, phải đảm bảo `rear` được cập nhật về `null`.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng**: Hệ thống xử lý tác vụ bất đồng bộ (Message Queue), thuật toán duyệt đồ thị BFS (Breadth-First Search).
- **Câu hỏi phỏng vấn**: 
  1. "Làm thế nào để triển khai Queue với 2 Stack?" (LeetCode: Implement Queue using Stacks).
  2. "Tại sao Linked List lại tốt hơn Array trong việc triển khai Queue?" (Gợi ý: Trả lời về vấn đề cấp phát bộ nhớ động và chi phí dịch chuyển phần tử).$content$,
    3,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '671506d2-0114-5acd-b6b2-30b92772f20b',
    'Đệ quy (Recursion) và Bài toán Giai thừa (Factorial)',
    'de-quy-recursion-va-bai-toan-giai-thua',
    'Recursion (Đệ quy)',
    'Đệ quy là kỹ thuật lập trình mà một hàm tự gọi chính nó để giải quyết các bài toán con nhỏ hơn, dựa trên nguyên lý chia để trị. Đây là công cụ mạnh mẽ để giải quyết các cấu trúc dữ liệu phân cấp và các bài toán có tính chất lặp lại, với bản chất cốt lõi là việc quản lý ngăn xếp (Call Stack) để lưu trữ trạng thái thực thi.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Đệ quy (Recursion) xuất phát từ tư duy toán học: định nghĩa một đối tượng thông qua chính nó. Trong lập trình, đệ quy cho phép chúng ta giải quyết các bài toán phức tạp bằng cách chia nhỏ chúng thành các bài toán con cùng loại nhưng có kích thước nhỏ hơn.

### Bản chất bộ nhớ (Memory Layout)
Khi một hàm đệ quy được gọi, hệ thống sẽ đẩy một **Stack Frame** mới vào **Call Stack**. Mỗi frame chứa:
- Tham số truyền vào.
- Biến cục bộ.
- Địa chỉ trả về (Return address).

Nếu không có điều kiện dừng (Base Case), chương trình sẽ gây ra lỗi `Stack Overflow` do bộ nhớ ngăn xếp bị cạn kiệt.

### Sơ đồ mô phỏng (Call Stack cho 3!)
```text
multiplyNumbers(3) -> 3 * multiplyNumbers(2)
  multiplyNumbers(2) -> 2 * multiplyNumbers(1)
    multiplyNumbers(1) -> 1 * multiplyNumbers(0)
      multiplyNumbers(0) -> return 1 (Base Case)
```

## 2. Chi tiết các thao tác cốt lõi
Một hàm đệ quy chuẩn cần 2 thành phần:
1. **Base Case (Điều kiện dừng):** Tránh vòng lặp vô tận.
2. **Recursive Step (Bước đệ quy):** Thu hẹp bài toán về phía Base Case.

### Dry Run (n=3):
- Gọi `multiplyNumbers(3)`: 3 >= 1, gọi `3 * multiplyNumbers(2)`
- Gọi `multiplyNumbers(2)`: 2 >= 1, gọi `2 * multiplyNumbers(1)`
- Gọi `multiplyNumbers(1)`: 1 >= 1, gọi `1 * multiplyNumbers(0)`
- Gọi `multiplyNumbers(0)`: 0 < 1, trả về 1.
- Quay lui (Backtracking): 1*1=1 -> 2*1=2 -> 3*2=6.

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Thời gian (Best) | Thời gian (Average) | Thời gian (Worst) | Không gian (Space) |
| :--- | :--- | :--- | :--- | :--- |
| Tính Giai thừa | O(1) | O(n) | O(n) | O(n) |

- **Thời gian:** O(n) vì hàm được gọi n lần.
- **Không gian:** O(n) do mỗi lần gọi chiếm một Stack Frame trên bộ nhớ.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
#include <iostream>
long long factorial(int n) {
    if (n < 0) return -1; // Xử lý lỗi
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}
```

### Java
```java
public class Factorial {
    public static long calculate(int n) {
        if (n < 0) throw new IllegalArgumentException("Số âm không có giai thừa");
        return (n == 0) ? 1 : n * calculate(n - 1);
    }
}
```

### Python
```python
def factorial(n):
    if n < 0: raise ValueError("Số âm không hợp lệ")
    return 1 if n == 0 else n * factorial(n - 1)
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Stack Overflow:** Xảy ra khi n quá lớn (vượt quá giới hạn stack).
- **Thiếu Base Case:** Dẫn đến vòng lặp vô tận.
- **Input âm:** Giai thừa không định nghĩa cho số âm, cần kiểm tra đầu vào.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Duyệt cây (Tree Traversal), thuật toán đồ thị (DFS), bài toán chia để trị (Merge Sort, Quick Sort).
- **Câu hỏi phỏng vấn:**
  1. *"Làm thế nào để tối ưu đệ quy?"* -> Gợi ý: Tail Recursion (Đệ quy đuôi) hoặc Memoization (Quy hoạch động).
  2. *"So sánh đệ quy và vòng lặp (Iteration)?"* -> Đệ quy dễ đọc, vòng lặp tiết kiệm bộ nhớ hơn.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'd685cf21-7cab-5746-b02a-2c4887dd7e05',
    'Fibonacci Heap (Cấu trúc dữ liệu Fibonacci Heap)',
    'fibonacci-heap-cau-truc-du-lieu',
    'Recursion (Đệ quy)',
    'Fibonacci Heap là một cấu trúc dữ liệu hàng đợi ưu tiên (priority queue) tối ưu hóa các thao tác giảm khóa (decrease-key) và hợp nhất (merge) thông qua kỹ thuật ''lazy consolidation''. Đây là lựa chọn hàng đầu để cải thiện độ phức tạp thời gian của các thuật toán đồ thị như Dijkstra và Prim trong các hệ thống yêu cầu hiệu năng cực cao.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong các bài toán đồ thị (như tìm đường đi ngắn nhất Dijkstra hay cây khung nhỏ nhất Prim), thao tác `Decrease-Key` được gọi rất thường xuyên. Với Binary Heap, độ phức tạp là O(log n), làm tổng thời gian thuật toán bị giới hạn. Fibonacci Heap ra đời để giảm độ phức tạp của `Decrease-Key` xuống O(1) amortized.

**Bản chất:** Fibonacci Heap không phải là một cây đơn lẻ mà là một **tập hợp các cây** (forest) tuân thủ tính chất min-heap. Các cây này được liên kết với nhau bằng danh sách liên kết đôi vòng (circular doubly linked list).

**Mô hình trực quan:**
```text
[Min Pointer] -> (Node 1) <-> (Node 2) <-> (Node 3)
                   |            |            |
                (Child)      (Child)      (Child)
```

## 2. Chi tiết các thao tác cốt lõi

- **Insert:** Thêm một node mới vào danh sách gốc (root list) như một cây đơn lẻ. O(1).
- **Merge:** Nối danh sách gốc của hai heap lại với nhau. O(1).
- **Extract-Min:** 
  1. Lấy node min.
  2. Đưa các con của node min vào danh sách gốc.
  3. Thực hiện 'Consolidation' (hợp nhất các cây có cùng bậc) để duy trì cấu trúc cây cân bằng.

**Dry Run (Extract-Min):**
1. Giả sử root list có các cây bậc 0, 0, 1.
2. Sau khi xóa min, các con của min được đẩy vào root list.
3. Duyệt qua danh sách, nếu thấy hai cây cùng bậc, gộp chúng lại (cây lớn hơn làm con của cây nhỏ hơn).

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Thời gian (Amortized) | Thời gian (Worst) |
| :--- | :--- | :--- |
| Find Min | Θ(1) | Θ(1) |
| Insert | Θ(1) | Θ(1) |
| Extract Min | O(log n) | O(n) |
| Decrease Key | Θ(1) | Θ(n) |
| Merge | Θ(1) | Θ(1) |

*Phân tích:* Độ phức tạp amortized đạt được nhờ vào việc trì hoãn (lazy) việc hợp nhất các cây cho đến khi thực hiện `Extract-Min`.

## 4. Cài đặt mã nguồn (Cấu trúc cơ bản)

### C++
```cpp
struct Node {
    int key;
    int degree;
    Node *parent, *child, *left, *right;
    bool mark; // Dùng cho Decrease-Key
};
// Cần quản lý danh sách liên kết đôi cho root list
```

### Java
```java
public class FibonacciHeapNode {
    int key;
    int degree = 0;
    FibonacciHeapNode parent, child, left, right;
    boolean mark = false;
}
```

### Python
```python
class FibonacciNode:
    def __init__(self, key):
        self.key = key
        self.degree = 0
        self.parent = self.child = None
        self.left = self.right = self
        self.mark = False
```

## 5. Các trường hợp biên & Lỗi thường gặp

- **Memory Leak:** Do sử dụng nhiều con trỏ (parent, child, left, right), cần cẩn thận khi giải phóng bộ nhớ trong C++.
- **Circular List Traversal:** Khi duyệt danh sách liên kết vòng, nếu không kiểm tra điều kiện dừng (quay lại node đầu), sẽ dẫn đến vòng lặp vô tận.
- **Marking Logic:** Quên cập nhật cờ `mark` khi thực hiện `Decrease-Key` sẽ làm hỏng cấu trúc cây, khiến độ phức tạp không còn là O(log n).

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn

- **Ứng dụng:** Định tuyến mạng (Network Routing), thuật toán tìm đường đi ngắn nhất trong bản đồ số (GIS).
- **Câu hỏi phỏng vấn:**
  1. "Tại sao Fibonacci Heap lại nhanh hơn Binary Heap trong thuật toán Dijkstra?" (Tập trung vào thao tác Decrease-Key).
  2. "Giải thích khái niệm Lazy Consolidation và tại sao nó giúp cải thiện hiệu năng?"
  3. "Khi nào thì Fibonacci Heap trở nên kém hiệu quả hơn Binary Heap?" (Trả lời: Khi số lượng thao tác ít hoặc cần bộ nhớ tối thiểu do hằng số ẩn lớn).$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '247117f1-1b90-50f7-86b2-99b8e926bfbb',
    'Thuật toán Sắp xếp Chèn (Insertion Sort)',
    'thuat-toan-sap-xep-chen-insertion-sort',
    'Sorting (Sắp xếp)',
    'Insertion Sort là thuật toán sắp xếp dựa trên cơ chế chèn từng phần tử vào vị trí thích hợp trong một mảng con đã được sắp xếp. Đây là thuật toán ổn định (stable), hiệu quả cao với các tập dữ liệu nhỏ hoặc gần như đã sắp xếp, và thường được dùng làm thành phần tối ưu trong các thuật toán lai như Timsort hay Introsort.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong thực tế, khi bạn sắp xếp một bộ bài trên tay, bạn thường lấy từng lá bài từ nhóm chưa sắp xếp và chèn nó vào đúng vị trí trong nhóm đã sắp xếp. Insertion Sort mô phỏng chính xác tư duy này. Khác với các thuật toán như Bubble Sort (đổi chỗ liên tục) hay Selection Sort (tìm phần tử nhỏ nhất), Insertion Sort xây dựng mảng kết quả dần dần bằng cách mở rộng vùng đã sắp xếp.

### Mô hình tư duy:
- Chia mảng thành hai phần: **Đã sắp xếp** (bên trái) và **Chưa sắp xếp** (bên phải).
- Ở mỗi bước, lấy phần tử đầu tiên của phần chưa sắp xếp và 'chèn' nó vào vị trí đúng trong phần đã sắp xếp.

### Sơ đồ minh họa:
```
[Đã sắp xếp] | [Chưa sắp xếp]
[ 5, 10, 12 ] | [ 11, 6 ]
      ^          ^
    Key (11) được chọn để chèn vào bên trái
```

## 2. Chi tiết các thao tác cốt lõi

Thuật toán hoạt động theo vòng lặp từ chỉ số `i = 1` đến `n-1`:
1. **Chọn Key**: Lưu giá trị tại `arr[i]` vào biến tạm `key`.
2. **Dịch chuyển**: So sánh `key` với các phần tử ở phía trước (`j = i-1`). Nếu `arr[j] > key`, dịch `arr[j]` sang phải một vị trí.
3. **Chèn**: Khi tìm thấy vị trí `j` mà `arr[j] <= key` hoặc `j < 0`, đặt `key` vào vị trí `j + 1`.

### Dry Run Trace: {12, 11, 13, 5}
- **i=1 (key=11)**: 12 > 11 -> dịch 12. Mảng: {12, 12, 13, 5} -> Chèn 11: {11, 12, 13, 5}
- **i=2 (key=13)**: 12 < 13 -> Không dịch. Mảng: {11, 12, 13, 5}
- **i=3 (key=5)**: 13>5, 12>5, 11>5 -> Dịch tất cả. Mảng: {5, 11, 12, 13}

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| Insertion Sort | O(n) | O(n^2) | O(n^2) | O(1) |

- **Best Case (O(n))**: Khi mảng đã sắp xếp, vòng lặp `while` không bao giờ thực thi, chỉ tốn O(n) để duyệt qua mảng.
- **Worst Case (O(n^2))**: Khi mảng ngược chiều, mỗi phần tử cần so sánh và dịch chuyển qua toàn bộ phần đã sắp xếp.
- **Space**: Thuật toán thực hiện 'in-place', không cần thêm cấu trúc dữ liệu phụ.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

### Java
```java
public void sort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

### Python
```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error**: Thường xảy ra khi thiết lập điều kiện vòng lặp `j >= 0`. Nếu quên điều kiện này, chương trình sẽ truy cập vào vùng nhớ ngoài mảng (Segmentation Fault).
- **Mảng rỗng hoặc 1 phần tử**: Thuật toán cần xử lý đúng bằng cách kiểm tra `n` trước khi chạy vòng lặp.
- **Tính ổn định**: Insertion Sort là thuật toán ổn định (giữ nguyên thứ tự các phần tử bằng nhau), rất quan trọng khi sắp xếp các đối tượng phức tạp.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn Big Tech
- **Ứng dụng**: Được dùng trong các thư viện chuẩn để tối ưu hóa các thuật toán chia để trị (như QuickSort) khi kích thước mảng con nhỏ (thường < 10-20 phần tử) vì chi phí khởi tạo đệ quy của QuickSort lớn hơn chi phí O(n^2) của Insertion Sort.
- **Câu hỏi phỏng vấn**: 
  1. "Tại sao Insertion Sort lại nhanh hơn QuickSort trên mảng nhỏ?" (Trả lời: Do tính cục bộ bộ nhớ (Cache Locality) và không có overhead đệ quy).
  2. "Làm thế nào để tối ưu hóa việc tìm vị trí chèn?" (Gợi ý: Sử dụng Binary Insertion Sort để giảm số phép so sánh xuống O(n log n), tuy nhiên số lần dịch chuyển vẫn là O(n^2)).$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'ef01b283-752e-596a-9cc2-f578ecfe1f97',
    'Thuật toán Sắp xếp Trộn (Merge Sort)',
    'thuat-toan-sap-xep-tron-merge-sort',
    'Sorting (Sắp xếp)',
    'Merge Sort là thuật toán sắp xếp dựa trên tư duy ''Chia để trị'' (Divide and Conquer), đảm bảo độ phức tạp thời gian ổn định O(n log n) trong mọi trường hợp. Đây là thuật toán ổn định (stable sort), cực kỳ hiệu quả cho các tập dữ liệu lớn và là nền tảng cho các biến thể hiện đại như TimSort trong Python và Java.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Trong các bài toán sắp xếp, các thuật toán đơn giản như Bubble Sort hay Insertion Sort có độ phức tạp O(n²) không hiệu quả với tập dữ liệu lớn. Merge Sort ra đời để giải quyết vấn đề này bằng cách chia nhỏ bài toán thành các phần con dễ giải quyết hơn.

**Bản chất:** Merge Sort chia mảng thành hai nửa, sắp xếp từng nửa một cách đệ quy, sau đó trộn (merge) hai nửa đã sắp xếp lại với nhau.

**Sơ đồ tư duy (Divide & Conquer):**
```
[38, 27, 43, 10] (Chia)
   /        \
[38, 27]   [43, 10] (Chia tiếp)
 /   \      /   \
[38] [27]  [43] [10] (Cơ sở đệ quy)
 \   /      \   /
[27, 38]   [10, 43] (Trộn)
    \       /
  [10, 27, 38, 43] (Kết quả)
```

## 2. Chi tiết các thao tác cốt lõi
Thao tác quan trọng nhất là `merge(arr, left, mid, right)`. Nó nhận vào hai mảng con đã sắp xếp và trộn chúng thành một mảng duy nhất.

**Mô phỏng (Dry Run):**
Giả sử trộn `L = [27, 38]` và `R = [10, 43]`:
1. So sánh 27 và 10 -> lấy 10. Mảng: `[10, ...]`
2. So sánh 27 và 43 -> lấy 27. Mảng: `[10, 27, ...]`
3. So sánh 38 và 43 -> lấy 38. Mảng: `[10, 27, 38, ...]`
4. Hết mảng L, chép phần còn lại của R (43). Kết quả: `[10, 27, 38, 43]`.

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |

*   **Tại sao O(n log n)?** Cây đệ quy có độ sâu log n, mỗi tầng thực hiện n phép so sánh để trộn.
*   **Tại sao O(n) space?** Cần mảng phụ để lưu trữ các phần tử trong quá trình trộn.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> L(arr.begin() + l, arr.begin() + m + 1);
    vector<int> R(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < L.size() && j < R.size()) arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}
```

### Java
```java
public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
```

### Python
```python
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L, R = arr[:mid], arr[mid:]
        merge_sort(L)
        merge_sort(R)
        # Logic trộn tương tự C++...
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error:** Sai sót khi tính `mid` hoặc chỉ số `right`. Luôn dùng `l + (r - l) / 2` để tránh tràn số.
- **Memory Leak:** Trong C++, nếu cấp phát mảng động bằng `new` mà không `delete` sẽ gây rò rỉ bộ nhớ. Nên dùng `std::vector`.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Sắp xếp dữ liệu lớn không vừa RAM (External Sorting), ổn định dữ liệu trong các hệ thống cần giữ thứ tự phần tử bằng nhau.
- **Bài toán phỏng vấn:**
    1. **Count Inversions:** Đếm số cặp nghịch thế trong mảng (dùng Merge Sort để đếm).
    2. **Merge K Sorted Lists:** Trộn K danh sách liên kết đã sắp xếp (LeetCode #23).$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'ac589e7c-7798-5549-b927-eae39cc272c4',
    'Thuật toán Sắp xếp nhanh (Quick Sort)',
    'thuat-toan-sap-xep-nhanh-quick-sort',
    'Sorting (Sắp xếp)',
    'Quick Sort là thuật toán sắp xếp theo chiến lược ''Chia để trị'' (Divide and Conquer), nổi tiếng với hiệu năng vượt trội trên các tập dữ liệu lớn nhờ tính thân thiện với bộ nhớ đệm (Cache Locality). Đây là lựa chọn hàng đầu cho các thư viện chuẩn (như std::sort trong C++) nhờ tốc độ trung bình O(n log n) và khả năng sắp xếp tại chỗ (in-place).',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Quick Sort ra đời để giải quyết hạn chế về tốc độ của các thuật toán sắp xếp bậc O(n²) như Bubble Sort hay Insertion Sort. Bản chất của Quick Sort là chọn một phần tử làm 'chốt' (pivot), sau đó phân hoạch mảng sao cho các phần tử nhỏ hơn nằm bên trái và lớn hơn nằm bên phải chốt.

**Mô hình tư duy:** Hãy tưởng tượng bạn đang phân loại một chồng bài. Bạn chọn một lá bài làm chuẩn, đặt tất cả lá nhỏ hơn sang trái và lớn hơn sang phải. Sau đó, bạn lặp lại quy trình này cho hai chồng bài vừa tạo cho đến khi mỗi chồng chỉ còn một lá.

**Tính cục bộ bộ nhớ (Cache Locality):** Khác với Merge Sort cần mảng phụ, Quick Sort thực hiện thao tác trực tiếp trên mảng gốc, giúp tận dụng tối đa bộ nhớ đệm CPU, giảm thiểu độ trễ truy xuất dữ liệu.

## 2. Chi tiết các thao tác cốt lõi (Core Operations)
Thao tác quan trọng nhất là `partition()` (Phân hoạch). Dưới đây là logic Lomuto:
1. Chọn `pivot` (thường là phần tử cuối).
2. Duy trì biến `i` là chỉ số của phần tử nhỏ hơn pivot.
3. Duyệt `j` từ `low` đến `high-1`. Nếu `arr[j] < pivot`, tăng `i` và đổi chỗ `arr[i]` với `arr[j]`.
4. Đưa `pivot` vào đúng vị trí `i + 1`.

**Dry Run (Mảng: [10, 7, 8, 9, 1, 5]):**
- Pivot = 5. Duyệt j từ 0 đến 4.
- j=0 (10 > 5): Bỏ qua.
- j=1 (7 > 5): Bỏ qua.
- j=2 (8 > 5): Bỏ qua.
- j=3 (9 > 5): Bỏ qua.
- j=4 (1 < 5): i=0, swap(arr[0], arr[4]) -> [1, 7, 8, 9, 10, 5].
- Kết thúc: Swap(arr[1], arr[5]) -> [1, 5, 8, 9, 10, 7]. Pivot 5 đã ở đúng vị trí.

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Tốt nhất | Trung bình | Xấu nhất | Không gian |
| :--- | :--- | :--- | :--- | :--- |
| Sắp xếp | O(n log n) | O(n log n) | O(n²) | O(log n) |

- **Tại sao O(n²)?** Khi mảng đã sắp xếp hoặc chứa toàn phần tử trùng lặp, việc chọn pivot không tối ưu khiến cây đệ quy bị lệch (skewed), dẫn đến độ sâu O(n).
- **Tại sao O(log n) không gian?** Đây là không gian ngăn xếp (stack) cho các lời gọi đệ quy.

## 4. Cài đặt mã nguồn hoàn chỉnh
### C++
```cpp
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```
### Java
```java
static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```
### Python
```python
def quickSort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one:** Sai sót trong chỉ số `low` và `high` khi gọi đệ quy (ví dụ: `pi` thay vì `pi-1`).
- **Worst-case:** Tránh chọn phần tử đầu/cuối làm pivot cho mảng đã sắp xếp. Giải pháp: Chọn pivot ngẫu nhiên (Randomized Quick Sort) hoặc Median-of-three.
- **Stack Overflow:** Với mảng cực lớn, đệ quy sâu có thể gây tràn stack. Giải pháp: Sử dụng đệ quy đuôi (Tail Recursion) hoặc dùng Stack thủ công.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Hệ quản trị CSDL (sắp xếp dữ liệu trước khi join), thuật toán QuickSelect (tìm phần tử lớn thứ k).
- **Câu hỏi phỏng vấn:** 
  1. "Làm sao để biến Quick Sort thành thuật toán ổn định (stable)?" (Gợi ý: Sử dụng thêm bộ nhớ phụ hoặc lưu trữ chỉ số gốc).
  2. "Tại sao std::sort trong C++ lại dùng Introsort (kết hợp Quick Sort, Heap Sort và Insertion Sort)?" (Gợi ý: Để đảm bảo O(n log n) trong mọi trường hợp).$content$,
    3,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '34bce99c-3d6a-526d-9be0-6772fa749fd6',
    'Sắp xếp thùng (Bucket Sort)',
    'sap-xep-thung-bucket-sort',
    'Sorting (Sắp xếp)',
    'Bucket Sort là thuật toán sắp xếp phân phối (distribution sort) hoạt động bằng cách chia dữ liệu thành các ''thùng'' nhỏ, sắp xếp từng thùng riêng biệt rồi gộp lại. Đây là giải pháp tối ưu cho dữ liệu phân phối đều trong một khoảng xác định, đạt độ phức tạp tiệm cận thời gian tuyến tính O(n).',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Các thuật toán sắp xếp dựa trên so sánh (Comparison-based sort) như QuickSort hay MergeSort bị giới hạn bởi cận dưới lý thuyết là O(n log n). Bucket Sort phá vỡ giới hạn này bằng cách sử dụng thông tin về phạm vi giá trị của dữ liệu để phân phối chúng vào các nhóm (buckets), từ đó giảm số lượng phép so sánh cần thiết.

**Mô hình tư duy:** Hãy tưởng tượng bạn có hàng ngàn lá bài được đánh số từ 0 đến 99. Thay vì so sánh từng cặp, bạn chia chúng vào 10 cái hộp: hộp 0 (0-9), hộp 1 (10-19),..., hộp 9 (90-99). Sau khi bỏ vào hộp, bạn chỉ cần sắp xếp từng hộp nhỏ rồi xếp chồng các hộp lại.

**Sơ đồ minh họa:**
```
Input: [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51]

Bucket 0: []
Bucket 3: [0.32, 0.33, 0.37]
Bucket 4: [0.42, 0.47]
Bucket 5: [0.52, 0.51]
...

Sau khi sort từng bucket:
Bucket 3: [0.32, 0.33, 0.37]
Bucket 4: [0.42, 0.47]
Bucket 5: [0.51, 0.52]

Kết quả: [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52]
```

## 2. Chi tiết các thao tác cốt lõi
1. **Khởi tạo:** Tạo n thùng rỗng.
2. **Phân tán (Scatter):** Duyệt qua mảng, tính toán chỉ số thùng bằng công thức `index = floor(value * n)`. Đưa phần tử vào thùng tương ứng.
3. **Sắp xếp (Sort):** Sắp xếp từng thùng (thường dùng Insertion Sort hoặc QuickSort).
4. **Gộp (Gather):** Duyệt qua các thùng theo thứ tự và nối các phần tử lại vào mảng gốc.

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Bucket Sort | O(n+k) | O(n) | O(n^2) | O(n+k) |

- **Tại sao O(n)?** Khi dữ liệu phân phối đều, mỗi thùng chỉ chứa một số lượng phần tử hằng số, việc sắp xếp từng thùng tốn O(1), tổng cộng là O(n).
- **Tại sao O(n^2)?** Nếu tất cả phần tử rơi vào cùng một thùng, thuật toán trở thành thuật toán sắp xếp được dùng cho thùng đó (ví dụ Insertion Sort là O(n^2)).

## 4. Cài đặt mã nguồn
### C++
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
// Cài đặt sử dụng vector để quản lý các thùng
void bucketSort(float arr[], int n) {
    std::vector<float> b[n];
    for (int i = 0; i < n; i++) {
        int bi = n * arr[i];
        b[bi].push_back(arr[i]);
    }
    for (int i = 0; i < n; i++) std::sort(b[i].begin(), b[i].end());
    int index = 0;
    for (int i = 0; i < n; i++) 
        for (auto j : b[i]) arr[index++] = j;
}
```
### Java
```java
import java.util.*;
public void bucketSort(float[] arr) {
    int n = arr.length;
    List<Float>[] buckets = new ArrayList[n];
    for(int i=0; i<n; i++) buckets[i] = new ArrayList<>();
    for(float f : arr) buckets[(int)(f * n)].add(f);
    for(List<Float> b : buckets) Collections.sort(b);
    int idx = 0;
    for(List<Float> b : buckets) for(float f : b) arr[idx++] = f;
}
```
### Python
```python
def bucket_sort(arr):
    n = len(arr)
    buckets = [[] for _ in range(n)]
    for x in arr:
        buckets[int(x * n)].append(x)
    for b in buckets:
        b.sort()
    return [x for b in buckets for x in b]
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Lỗi chỉ số:** Khi giá trị là 1.0, `int(value * n)` có thể vượt quá chỉ số mảng (n-1). Cần xử lý giá trị biên.
- **Dữ liệu không đều:** Nếu dữ liệu tập trung vào một dải hẹp, Bucket Sort mất hiệu năng. Cần chọn hàm băm (hash function) phù hợp.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Sắp xếp các giá trị dấu phẩy động (floating point) trong khoảng [0, 1), phân phối dữ liệu trong hệ thống phân tán.
- **Câu hỏi phỏng vấn:** 
  1. "Làm thế nào để Bucket Sort hoạt động với số nguyên lớn?" (Gợi ý: Sử dụng hàm băm modulo hoặc chia khoảng).
  2. "So sánh Bucket Sort và Radix Sort trong bài toán sắp xếp danh sách sinh viên theo điểm số?"$content$,
    4,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '6f262605-198d-546e-a784-90a045b88903',
    'Tìm kiếm tuyến tính (Linear Search Algorithm)',
    'tim-kiem-tuyen-tinh-linear-search',
    'Binary search',
    'Tìm kiếm tuyến tính là thuật toán tìm kiếm cơ bản nhất, hoạt động bằng cách duyệt tuần tự qua từng phần tử của tập dữ liệu cho đến khi tìm thấy mục tiêu hoặc kết thúc danh sách. Đây là phương pháp duy nhất khả thi cho các tập dữ liệu không có thứ tự và là nền tảng để hiểu về độ phức tạp thời gian O(N).',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong khoa học máy tính, bài toán tìm kiếm là việc xác định vị trí của một phần tử trong một tập hợp dữ liệu. Khi dữ liệu không được sắp xếp, chúng ta không có manh mối nào về vị trí của phần tử mục tiêu. Do đó, cách tiếp cận duy nhất đảm bảo tính đúng đắn là kiểm tra từng phần tử một.

**Mô hình tư duy:** Hãy tưởng tượng bạn đang tìm một cuốn sách cụ thể trong một chồng sách lộn xộn. Bạn phải nhấc từng cuốn lên, kiểm tra tiêu đề, nếu đúng thì dừng lại, nếu sai thì tiếp tục với cuốn tiếp theo.

**Cơ chế bộ nhớ:** Linear Search tận dụng tính cục bộ bộ nhớ (Cache Locality) rất tốt khi duyệt mảng (Array) vì các phần tử nằm liên tiếp nhau trong bộ nhớ, giúp CPU nạp dữ liệu vào Cache hiệu quả hơn so với các cấu trúc phân tán như Linked List.

**Sơ đồ minh họa:**
```
Tìm kiếm x = 30 trong mảng:
[10, 50, 30, 70, 80]
 ^   ^   ^ 
 i=0 i=1 i=2 (Tìm thấy tại index 2!)
```

## 2. Chi tiết các thao tác cốt lõi

Thao tác duy nhất là **Tìm kiếm (Search)**:
1. Bắt đầu từ chỉ số `i = 0`.
2. So sánh `arr[i]` với `x`.
3. Nếu `arr[i] == x`, trả về `i`.
4. Nếu `i` đạt đến cuối mảng mà vẫn không tìm thấy, trả về `-1`.

**Mô phỏng (Dry Run):** `arr = [10, 8, 30], x = 6`
- Bước 1: `i=0`, `arr[0]=10 != 6`. Tiếp tục.
- Bước 2: `i=1`, `arr[1]=8 != 6`. Tiếp tục.
- Bước 3: `i=2`, `arr[2]=30 != 6`. Tiếp tục.
- Bước 4: `i=3` (hết mảng), trả về `-1`.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| Tìm kiếm | O(1) | O(N) | O(N) | O(1) |

- **Best Case:** Phần tử cần tìm nằm ngay vị trí đầu tiên.
- **Worst Case:** Phần tử nằm ở cuối hoặc không tồn tại trong mảng, ta phải duyệt qua toàn bộ N phần tử.
- **Space:** Chỉ sử dụng một biến đếm `i`, nên độ phức tạp không gian là hằng số O(1).

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
int search(const std::vector<int>& arr, int x) {
    for (int i = 0; i < arr.size(); ++i) {
        if (arr[i] == x) return i; // Tìm thấy
    }
    return -1; // Không tìm thấy
}
```

### Java
```java
public static int search(int[] arr, int x) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == x) return i;
    }
    return -1;
}
```

### Python
```python
def search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error:** Lỗi phổ biến khi đặt điều kiện vòng lặp `i <= n` thay vì `i < n` (dẫn đến truy cập ngoài phạm vi mảng).
- **Empty Array:** Luôn kiểm tra mảng rỗng trước khi thực hiện để tránh lỗi logic.
- **Data Types:** Đảm bảo kiểu dữ liệu của `x` khớp với kiểu dữ liệu của mảng để tránh lỗi so sánh.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn Big Tech
- **Ứng dụng:** Tìm kiếm trong danh sách liên kết (Linked List), tìm kiếm trong các tập dữ liệu nhỏ, hoặc khi dữ liệu thay đổi liên tục khiến việc sắp xếp (Sorting) trở nên quá tốn kém.
- **Câu hỏi phỏng vấn:**
  1. *"Tìm vị trí xuất hiện cuối cùng của phần tử x"*: Yêu cầu duyệt từ cuối về đầu hoặc lưu lại chỉ số mỗi khi tìm thấy.
  2. *"Tìm phần tử xuất hiện nhiều nhất (Mode)"*: Kết hợp Linear Search với Hash Map để đếm tần suất.
  3. *"Tại sao không dùng Binary Search cho mọi trường hợp?"*: Cần giải thích về điều kiện tiên quyết (mảng đã sắp xếp) và chi phí của việc sắp xếp (O(N log N)).$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'c3c05b0f-a2ea-5f12-881e-4444cd0e20ba',
    'Tìm kiếm nhị phân (Binary Search)',
    'tim-kiem-nhi-phan-binary-search',
    'Binary search',
    'Tìm kiếm nhị phân là thuật toán tìm kiếm tối ưu trên tập dữ liệu đã sắp xếp, hoạt động dựa trên chiến lược chia để trị (Divide and Conquer). Bằng cách liên tục chia đôi không gian tìm kiếm, thuật toán đạt độ phức tạp thời gian O(log N), trở thành nền tảng cho nhiều hệ thống lưu trữ và tối ưu hóa hiệu năng trong khoa học máy tính.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong các bài toán tìm kiếm cơ bản, nếu dữ liệu chưa được sắp xếp, chúng ta buộc phải duyệt tuần tự (Linear Search) với độ phức tạp O(N). Khi tập dữ liệu lên tới hàng triệu phần tử, O(N) trở nên quá chậm. Binary Search ra đời để giải quyết bài toán này trên các tập dữ liệu đã được sắp xếp (Sorted/Monotonic).

**Mô hình tư duy:** Hãy tưởng tượng bạn đang tìm một từ trong từ điển. Bạn không lật từng trang từ đầu đến cuối, mà bạn mở ở giữa. Nếu từ cần tìm đứng trước trang đó, bạn bỏ qua nửa sau và tiếp tục lật giữa nửa đầu. Đó chính là bản chất của Binary Search.

**Cơ chế bộ nhớ:** Binary Search yêu cầu truy cập ngẫu nhiên (Random Access) tới các phần tử, do đó nó hoạt động hiệu quả nhất trên các cấu trúc dữ liệu lưu trữ liên tục như Mảng (Array) hoặc Vector, tận dụng tốt tính cục bộ bộ nhớ đệm (Cache Locality).

**Sơ đồ minh họa:**
```
[2, 5, 8, 12, 16, 23, 38, 56, 72, 91] (Target: 23)
 ^        ^                       ^
low      mid                     high
```

## 2. Chi tiết các thao tác cốt lõi

Thuật toán thực hiện qua các bước:
1. Xác định `low = 0`, `high = n - 1`.
2. Tính `mid = low + (high - low) / 2` (tránh tràn số).
3. Nếu `arr[mid] == target`, trả về `mid`.
4. Nếu `arr[mid] < target`, tìm ở nửa phải: `low = mid + 1`.
5. Nếu `arr[mid] > target`, tìm ở nửa trái: `high = mid - 1`.
6. Lặp lại cho đến khi `low > high`.

**Dry Run (Target 23):**
- Bước 1: `low=0, high=9, mid=4 (val=16)`. 16 < 23 -> `low=5`.
- Bước 2: `low=5, high=9, mid=7 (val=56)`. 56 > 23 -> `high=6`.
- Bước 3: `low=5, high=6, mid=5 (val=23)`. Tìm thấy tại index 5.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Tìm kiếm | O(1) | O(log N) | O(log N) | O(1) |

*Giải thích:* Mỗi bước lặp, không gian tìm kiếm giảm đi một nửa. Số lần lặp tối đa là log2(N).

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Tránh tràn số
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
```

### Java
```java
public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
```

### Python
```python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error:** Sử dụng sai điều kiện `low < high` thay vì `low <= high`.
- **Integer Overflow:** Tính `mid = (low + high) / 2` có thể gây tràn số nếu `low + high` vượt quá giới hạn kiểu dữ liệu. Luôn dùng `low + (high - low) / 2`.
- **Dữ liệu không sắp xếp:** Binary Search sẽ trả về kết quả sai nếu mảng không được sắp xếp trước.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Database Indexing (B-Trees), Git Bisect (tìm commit gây lỗi), Network Routing.
- **Bài toán phỏng vấn:**
  1. *Search in Rotated Sorted Array:* Tìm kiếm trong mảng đã xoay (LeetCode 33).
  2. *Find First and Last Position:* Tìm vị trí xuất hiện đầu và cuối của phần tử (LeetCode 34).
  3. *Sqrt(x):* Tính căn bậc hai của số nguyên bằng Binary Search.$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '1c462e56-43ae-5d33-85d0-08456d8426a6',
    'Cấu trúc dữ liệu Cây nhị phân (Binary Tree Data Structure)',
    'cau-truc-du-lieu-cay-nhi-phan-binary-tree',
    'Trees',
    'Cây nhị phân là cấu trúc dữ liệu phân cấp phi tuyến tính, nơi mỗi nút có tối đa hai nút con, đóng vai trò là nền tảng cho các cấu trúc phức tạp hơn như BST, Heap và AVL. Đây là công cụ cốt lõi để tối ưu hóa việc tìm kiếm, lưu trữ dữ liệu có thứ bậc và xử lý các bài toán đệ quy trong hệ thống phần mềm.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong các cấu trúc dữ liệu tuyến tính như Mảng hay Danh sách liên kết, việc tìm kiếm hoặc chèn dữ liệu thường mất thời gian O(n). Cây nhị phân (Binary Tree) ra đời để giải quyết bài toán phân cấp dữ liệu, cho phép thực hiện các thao tác tìm kiếm, chèn và xóa với độ phức tạp tốt hơn trong các trường hợp tối ưu.

### Mô hình tư duy
Cây nhị phân là một tập hợp các nút (nodes), trong đó mỗi nút chứa dữ liệu và hai con trỏ (hoặc tham chiếu) tới nút con trái và nút con phải. 

### Sơ đồ trực quan
```text
        1          <-- Gốc (Root)
       / \ 
      2   3        <-- Nút cha (Parent)
     / \   \ 
    4   5   6      <-- Nút lá (Leaf)
```

### Cơ chế bộ nhớ
Cây nhị phân thường được cấp phát động trên **Heap**. Mỗi nút là một đối tượng chứa giá trị và hai con trỏ 8-byte (trên hệ thống 64-bit). Do tính chất phân tán, cây nhị phân không có tính cục bộ bộ nhớ (Cache Locality) tốt như mảng, dẫn đến khả năng xảy ra cache miss cao hơn khi duyệt cây.

## 2. Chi tiết các thao tác cốt lõi

- **Duyệt cây (Traversal):** 
  - *Inorder (L-Root-R):* Duyệt cây con trái, thăm nút gốc, duyệt cây con phải.
  - *Preorder (Root-L-R):* Thăm nút gốc, duyệt cây con trái, duyệt cây con phải.
  - *Postorder (L-R-Root):* Duyệt cây con trái, duyệt cây con phải, thăm nút gốc.
- **Chèn (Insertion):** Thường được thực hiện theo thứ tự tầng (Level Order) hoặc theo quy tắc của cây tìm kiếm nhị phân.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Trung bình | Xấu nhất |
| :--- | :--- | :--- |
| Tìm kiếm | O(log n) | O(n) |
| Chèn | O(log n) | O(n) |
| Xóa | O(log n) | O(n) |

*Lưu ý:* Độ phức tạp xấu nhất xảy ra khi cây bị suy biến thành danh sách liên kết (cây chỉ có một nhánh).

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
struct Node {
    int data;
    Node *left, *right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};
```

### Java
```java
class Node {
    int data;
    Node left, right;
    public Node(int item) {
        data = item;
        left = right = null;
    }
}
```

### Python
```python
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Null Pointer Exception:** Luôn kiểm tra `if (node == null)` trước khi truy cập `node.left` hoặc `node.right`.
- **Stack Overflow:** Khi sử dụng đệ quy trên cây quá sâu (cây bị suy biến), hãy cân nhắc giải pháp lặp (iterative) với Stack.
- **Memory Leak:** Trong C++, cần giải phóng bộ nhớ (delete) thủ công khi hủy cây.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Cây cú pháp (Syntax Trees) trong trình biên dịch, DOM trong trình duyệt, hệ thống tệp (File System).
- **Bài toán phỏng vấn:** 
  1. *Diameter of Binary Tree:* Tìm đường đi dài nhất giữa hai nút bất kỳ.
  2. *Lowest Common Ancestor (LCA):* Tìm tổ tiên chung gần nhất của hai nút.
  3. *Binary Tree to Doubly Linked List:* Chuyển đổi cấu trúc cây sang danh sách liên kết kép.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'ed610106-ed77-54de-b365-8a71fa488afc',
    'Cây Tìm Kiếm Nhị Phân (Binary Search Tree - BST)',
    'cay-tim-kiem-nhi-phan-bst',
    'Trees',
    'Cây tìm kiếm nhị phân (BST) là cấu trúc dữ liệu cây phân cấp cho phép tìm kiếm, chèn và xóa dữ liệu hiệu quả với độ phức tạp trung bình O(log n). Bản chất của nó là duy trì tính thứ tự: mọi nút bên trái đều nhỏ hơn nút cha và mọi nút bên phải đều lớn hơn nút cha.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong các cấu trúc dữ liệu tuyến tính như mảng hay danh sách liên kết, việc tìm kiếm một phần tử thường mất O(n). BST ra đời để tối ưu hóa việc tìm kiếm, chèn và xóa bằng cách áp dụng tư duy "chia để trị" vào cấu trúc cây.

**Định nghĩa:** BST là một cây nhị phân mà tại mỗi nút `N`:
- Mọi khóa trong cây con bên trái của `N` đều nhỏ hơn khóa của `N`.
- Mọi khóa trong cây con bên phải của `N` đều lớn hơn khóa của `N`.

**Sơ đồ minh họa:**
```
        27
       /  \
     12    30
    /  \     \
   4   17    56
```

**Cơ chế bộ nhớ:** BST sử dụng cấp phát bộ nhớ động (Heap). Mỗi nút là một đối tượng chứa giá trị và hai con trỏ (trái, phải). Do sử dụng con trỏ, BST không yêu cầu không gian liên tục như mảng, nhưng tốn thêm bộ nhớ cho các con trỏ.

## 2. Chi tiết các thao tác cốt lõi

### Tìm kiếm (Search)
- **Logic:** So sánh giá trị cần tìm với nút hiện tại. Nếu nhỏ hơn, rẽ trái; nếu lớn hơn, rẽ phải. Lặp lại cho đến khi tìm thấy hoặc gặp `NULL`.

### Chèn (Insert)
- **Logic:** Tìm vị trí thích hợp (giống như tìm kiếm) cho đến khi gặp một nút lá, sau đó gắn nút mới vào vị trí trống tương ứng.

### Duyệt cây (Traversal)
- **Inorder (Trung tự):** Trái -> Gốc -> Phải (Kết quả là dãy số tăng dần).
- **Preorder (Tiền tự):** Gốc -> Trái -> Phải.
- **Postorder (Hậu tự):** Trái -> Phải -> Gốc.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Trung bình | Xấu nhất (Cây lệch) |
| :--- | :--- | :--- |
| Tìm kiếm | O(log n) | O(n) |
| Chèn | O(log n) | O(n) |
| Xóa | O(log n) | O(n) |
| Không gian | O(n) | O(n) |

*Lưu ý: Trường hợp xấu nhất xảy ra khi cây trở thành một danh sách liên kết (cây bị lệch).* 

## 4. Cài đặt mã nguồn

### C++
```cpp
struct Node { int data; Node *left, *right; };
Node* insert(Node* root, int val) {
    if (!root) return new Node{val, nullptr, nullptr};
    if (val < root->data) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}
```

### Java
```java
class Node { int data; Node left, right; Node(int d) { data = d; } }
public Node insert(Node root, int val) {
    if (root == null) return new Node(val);
    if (val < root.data) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}
```

### Python
```python
class Node:
    def __init__(self, data):
        self.left, self.right, self.data = None, None, data

def insert(root, val):
    if not root: return Node(val)
    if val < root.data: root.left = insert(root.left, val)
    else: root.right = insert(root.right, val)
    return root
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Cây lệch (Skewed Tree):** Khi dữ liệu đầu vào đã được sắp xếp, BST sẽ biến thành danh sách liên kết. Giải pháp: Sử dụng cây cân bằng (AVL, Red-Black).
- **Null Pointer:** Luôn kiểm tra `root == NULL` trước khi truy cập `root->data`.
- **Xóa nút có 2 con:** Đây là thao tác phức tạp nhất, cần tìm nút thay thế (nút nhỏ nhất bên phải hoặc lớn nhất bên trái).

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Hệ thống quản trị cơ sở dữ liệu (Indexing), bộ nhớ đệm, trình biên dịch.
- **Bài toán kinh điển:**
  1. *Validate Binary Search Tree:* Kiểm tra một cây có phải là BST hợp lệ không (LeetCode #98).
  2. *Lowest Common Ancestor:* Tìm tổ tiên chung gần nhất của hai nút (LeetCode #235).
  3. *Kth Smallest Element:* Tìm phần tử nhỏ thứ k trong BST (LeetCode #230).$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '8fdc4ce3-a7d5-5347-b7c6-93ffb322b078',
    'Xóa nút trong Cây tìm kiếm nhị phân (Deletion in Binary Search Tree - BST)',
    'xoa-nut-trong-cay-tim-kiem-nhi-phan-bst',
    'Trees',
    'Xóa nút trong BST là thao tác đòi hỏi sự khéo léo để duy trì tính chất cây (mọi nút con trái < nút cha < mọi nút con phải). Bài giảng phân tích sâu 3 trường hợp xóa nút, từ nút lá đơn giản đến nút có hai con cần tìm nút kế cận (inorder successor) để thay thế.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong cấu trúc dữ liệu Cây tìm kiếm nhị phân (BST), việc xóa một nút không đơn giản như xóa một phần tử trong mảng. Chúng ta phải đảm bảo sau khi xóa, cấu trúc cây vẫn thỏa mãn tính chất: mọi giá trị ở cây con trái nhỏ hơn nút cha, và mọi giá trị ở cây con phải lớn hơn nút cha.

### Mô hình tư duy
Khi xóa một nút, chúng ta cần tìm một "người thay thế" phù hợp để lấp đầy khoảng trống mà không làm xáo trộn thứ tự của các nút còn lại.

### Sơ đồ minh họa
```
      10
     /  \
    5    15
        /  \
       12   18
```
Nếu xóa nút 15, ta cần tìm nút kế cận (inorder successor) là 18 (hoặc 12 tùy quy ước) để thay thế, nhằm bảo toàn tính chất BST.

## 2. Chi tiết các thao tác cốt lõi (Core Operations)

Việc xóa nút được chia thành 3 trường hợp:

1. **Nút lá (0 con):** Chỉ cần gỡ bỏ nút đó bằng cách gán `nullptr` cho con của nút cha.
2. **Nút có 1 con:** Gỡ bỏ nút đó và nối nút cha của nó trực tiếp với nút con duy nhất.
3. **Nút có 2 con:** 
   - Tìm nút kế cận (inorder successor - giá trị nhỏ nhất trong cây con phải) hoặc nút tiền nhiệm (inorder predecessor - giá trị lớn nhất trong cây con trái).
   - Sao chép giá trị của nút kế cận vào nút cần xóa.
   - Xóa nút kế cận đó (nút này chắc chắn sẽ rơi vào trường hợp 1 hoặc 2).

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Xóa (Delete) | O(1) | O(log n) | O(n) | O(h) |

- **Tại sao O(h)?** Trong trường hợp xấu nhất (cây suy biến thành danh sách liên kết), chiều cao `h` bằng `n`. Đệ quy sử dụng ngăn xếp (stack) nên không gian bộ nhớ phụ thuộc vào chiều cao cây.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
Node* delNode(Node* root, int x) {
    if (!root) return nullptr;
    if (x < root->data) root->left = delNode(root->left, x);
    else if (x > root->data) root->right = delNode(root->right, x);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        Node* succ = getSuccessor(root); // Tìm min bên phải
        root->data = succ->data;
        root->right = delNode(root->right, succ->data);
    }
    return root;
}
```

### Java
```java
static Node delNode(Node root, int x) {
    if (root == null) return null;
    if (x < root.data) root.left = delNode(root.left, x);
    else if (x > root.data) root.right = delNode(root.right, x);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        Node succ = getSuccessor(root);
        root.data = succ.data;
        root.right = delNode(root.right, succ.data);
    }
    return root;
}
```

### Python
```python
def delNode(root, x):
    if not root: return root
    if x < root.data: root.left = delNode(root.left, x)
    elif x > root.data: root.right = delNode(root.right, x)
    else:
        if not root.left: return root.right
        if not root.right: return root.left
        succ = getSuccessor(root)
        root.data = succ.data
        root.right = delNode(root.right, succ.data)
    return root
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Null Pointer:** Luôn kiểm tra `root == null` trước khi truy cập `root->data`.
- **Memory Leak:** Trong C/C++, đừng quên `delete` hoặc `free` nút đã xóa để tránh rò rỉ bộ nhớ.
- **Cây suy biến:** Nếu cây chỉ có một nhánh, độ phức tạp sẽ là O(n). Cần cân nhắc sử dụng AVL hoặc Red-Black Tree nếu dữ liệu đầu vào không ngẫu nhiên.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Hệ thống quản lý cơ sở dữ liệu (Indexing), bộ nhớ đệm (Cache), trình duyệt (DOM tree).
- **Bài tập:** 
  1. *LeetCode 450: Delete Node in a BST* (Bài tập kinh điển).
  2. *Tìm kiếm nút kế cận (Inorder Successor in BST)*: Kỹ thuật quan trọng để giải bài toán xóa nút.$content$,
    3,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '257fbc43-87a9-5047-968f-83092a825354',
    'Các kỹ thuật duyệt cây (Tree Traversal Techniques)',
    'cac-ky-thuat-duyet-cay-tree-traversal',
    'Trees',
    'Duyệt cây là quá trình truy cập mỗi nút trong cấu trúc cây đúng một lần, đóng vai trò nền tảng trong việc xử lý dữ liệu phân cấp. Các kỹ thuật này được chia thành hai nhóm chính: Duyệt theo chiều sâu (DFS) để khám phá nhánh và Duyệt theo chiều rộng (BFS) để xử lý theo từng tầng, phục vụ các bài toán từ đánh giá biểu thức đến tối ưu hóa bộ nhớ.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Khác với mảng hay danh sách liên kết có cấu trúc tuyến tính, cây là cấu trúc dữ liệu phi tuyến tính. Để xử lý dữ liệu trong cây (tìm kiếm, sao chép, xóa), ta cần một chiến lược truy cập có hệ thống. Duyệt cây (Tree Traversal) chính là giải pháp để "phẳng hóa" cấu trúc phân cấp này thành một chuỗi các thao tác tuần tự.

### Mô hình tư duy
- **DFS (Depth-First Search):** Đi sâu xuống dưới trước khi quay lui (Backtracking). Giống như việc bạn khám phá một mê cung bằng cách luôn rẽ trái cho đến khi gặp ngõ cụt.
- **BFS (Breadth-First Search):** Đi ngang qua các nút cùng cấp trước khi xuống tầng tiếp theo. Giống như việc quét radar theo từng vòng tròn đồng tâm.

## 2. Chi tiết các thao tác cốt lõi
### A. Duyệt theo chiều sâu (DFS)
1. **Inorder (Left-Root-Right):** Thường dùng cho BST để lấy dữ liệu đã sắp xếp.
2. **Preorder (Root-Left-Right):** Dùng để sao chép cây (cấu trúc cha trước con).
3. **Postorder (Left-Right-Root):** Dùng để xóa cây (xóa con trước cha) hoặc tính toán biểu thức hậu tố.

### B. Duyệt theo chiều rộng (BFS)
- **Level Order:** Sử dụng hàng đợi (Queue) để lưu trữ các nút theo thứ tự tầng.

### Mô phỏng (Dry Run)
Cho cây: `1 -> (2, 3)`
- Preorder: 1, 2, 3
- Inorder: 2, 1, 3
- Postorder: 2, 3, 1
- Level Order: 1, 2, 3

## 3. Đánh giá độ phức tạp
| Thao tác | Thời gian (Time) | Không gian (Space) |
| :--- | :--- | :--- |
| Duyệt toàn bộ | O(N) | O(H) (H là chiều cao cây) |

- **Giải thích:** Mỗi nút được thăm đúng 1 lần. Không gian phụ thuộc vào ngăn xếp đệ quy (DFS) hoặc hàng đợi (BFS).

## 4. Cài đặt mã nguồn
### C++
```cpp
struct Node { int data; Node *left, *right; };
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}
```
### Java
```java
void preorder(Node node) {
    if (node == null) return;
    System.out.print(node.data + " ");
    preorder(node.left);
    preorder(node.right);
}
```
### Python
```python
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val)
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Null Pointer Exception:** Luôn kiểm tra `root == null` trước khi truy cập `root.left` hoặc `root.right`.
- **Stack Overflow:** Với cây quá sâu (cây suy biến thành danh sách liên kết), đệ quy có thể gây tràn ngăn xếp. Giải pháp: Sử dụng ngăn xếp thủ công (Iterative approach).

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Trình biên dịch (Expression Trees), Hệ thống tệp (File System traversal), DOM tree trong trình duyệt.
- **Bài toán kinh điển:** 
  1. *Binary Tree Level Order Traversal (LeetCode 102):* Yêu cầu dùng BFS.
  2. *Validate Binary Search Tree (LeetCode 98):* Ứng dụng Inorder traversal để kiểm tra tính sắp xếp.$content$,
    4,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '95314b04-146d-55ab-ad37-83aa26ee2047',
    'Duyệt cây theo tầng (Level Order Traversal - Breadth First Search)',
    'duyet-cay-theo-tang-level-order-traversal',
    'Trees',
    'Duyệt cây theo tầng (Level Order Traversal) là kỹ thuật duyệt cây nhị phân theo chiều rộng (BFS), ưu tiên thăm tất cả các nút ở cùng một cấp độ trước khi chuyển sang cấp độ tiếp theo. Đây là nền tảng quan trọng cho các bài toán tìm đường đi ngắn nhất trong đồ thị và xử lý cấu trúc dữ liệu phân cấp.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong các phương pháp duyệt cây truyền thống (Pre-order, In-order, Post-order), chúng ta duyệt theo chiều sâu (DFS). Tuy nhiên, trong nhiều bài toán thực tế như tìm kiếm trong hệ thống phân cấp hoặc tìm đường đi ngắn nhất, chúng ta cần thăm các nút theo thứ tự 'gần' với gốc trước.

**Bản chất:** Duyệt theo tầng là chiến lược duyệt theo chiều rộng (Breadth-First Search - BFS). Chúng ta coi cây như một đồ thị và thăm các nút theo khoảng cách tăng dần từ gốc.

**Sơ đồ minh họa:**
```
      5          (Level 0)
     / \ 
   12   13       (Level 1)
   /  \    \
  7    14   2    (Level 2)
```
Thứ tự duyệt: 5 -> 12 -> 13 -> 7 -> 14 -> 2.

## 2. Chi tiết các thao tác cốt lõi

Để thực hiện duyệt theo tầng, ta sử dụng cấu trúc dữ liệu **Hàng đợi (Queue)** để lưu trữ các nút cần thăm theo nguyên tắc FIFO (First-In-First-Out).

**Giải thuật (Iterative):**
1. Nếu cây rỗng, trả về danh sách rỗng.
2. Khởi tạo một Queue và đưa nút gốc vào.
3. Trong khi Queue không rỗng:
   a. Lấy kích thước hiện tại của Queue (đây chính là số nút ở tầng hiện tại).
   b. Duyệt qua số lượng nút đó, lấy từng nút ra, thêm giá trị vào danh sách kết quả tầng.
   c. Nếu nút có con trái/phải, đẩy chúng vào Queue.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Thời gian (Time) | Không gian (Space) |
| :--- | :--- | :--- |
| Duyệt toàn bộ cây | O(N) | O(W) |

*   **Thời gian:** O(N) vì mỗi nút được thăm đúng một lần.
*   **Không gian:** O(W) với W là độ rộng tối đa của cây (số nút nhiều nhất ở một tầng), trong trường hợp xấu nhất là O(N).

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct Node {
    int data; Node *left, *right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

vector<vector<int>> levelOrder(Node* root) {
    if (!root) return {};
    vector<vector<int>> res;
    queue<Node*> q;
    q.push(root);
    while(!q.empty()) {
        int size = q.size();
        vector<int> level;
        for(int i=0; i<size; i++) {
            Node* curr = q.front(); q.pop();
            level.push_back(curr->data);
            if(curr->left) q.push(curr->left);
            if(curr->right) q.push(curr->right);
        }
        res.push_back(level);
    }
    return res;
}
```

### Java
```java
import java.util.*;

public class Solution {
    public List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                Node curr = q.poll();
                level.add(curr.data);
                if (curr.left != null) q.offer(curr.left);
                if (curr.right != null) q.offer(curr.right);
            }
            res.add(level);
        }
        return res;
    }
}
```

### Python
```python
from collections import deque

def levelOrder(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.data)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Cây rỗng:** Luôn kiểm tra `root == null` ngay từ đầu.
- **Cây lệch (Skewed Tree):** Độ rộng bằng 1, thuật toán vẫn chạy đúng nhưng không gian O(1).
- **Null Pointer Exception:** Luôn kiểm tra con trái/phải trước khi đẩy vào Queue.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Tìm đường đi ngắn nhất trong đồ thị không trọng số, duyệt mạng xã hội (tìm bạn bè theo cấp độ).
- **Bài tập kinh điển:**
    1. Binary Tree Level Order Traversal (LeetCode 102).
    2. Binary Tree Zigzag Level Order Traversal (LeetCode 103) - Biến thể dùng Deque.
    3. N-ary Tree Level Order Traversal (LeetCode 429).$content$,
    5,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '06e7a102-ab15-568d-b79f-d6d9a11a6fd8',
    'Cây cân bằng AVL (AVL Tree)',
    'cay-can-bang-avl-avl-tree',
    'Trees',
    'Cây AVL là một dạng cây tìm kiếm nhị phân tự cân bằng, nơi chênh lệch chiều cao giữa các cây con của mỗi nút không bao giờ vượt quá 1. Cấu trúc này đảm bảo các thao tác tìm kiếm, chèn và xóa luôn đạt độ phức tạp O(log n), là nền tảng quan trọng trong các hệ thống cơ sở dữ liệu và lưu trữ chỉ mục.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong Cây tìm kiếm nhị phân (BST) thông thường, nếu dữ liệu đầu vào đã được sắp xếp, cây có thể bị suy biến thành một danh sách liên kết (linked list), khiến độ phức tạp tìm kiếm tăng từ O(log n) lên O(n). Cây AVL (Adelson-Velsky và Landis) ra đời để giải quyết vấn đề này bằng cách duy trì tính cân bằng thông qua các phép quay (rotation).

**Định nghĩa:** Cây AVL là một BST mà tại mọi nút, hệ số cân bằng (Balance Factor - BF) được định nghĩa là `Height(LeftSubtree) - Height(RightSubtree)` phải thuộc tập {-1, 0, 1}.

**Mô hình trực quan:**
```text
      30 (BF: 0)           30 (BF: 1)
     /  \                 /  
    20   40     =>       20   (Cây cân bằng)
   /                    /
  10                   10
```

## 2. Chi tiết các thao tác cốt lõi

### Phép quay (Rotations)
- **Left Rotate (Quay trái):** Dùng khi nút bị lệch phải (Right-Right case).
- **Right Rotate (Quay phải):** Dùng khi nút bị lệch trái (Left-Left case).
- **Left-Right / Right-Left Rotate:** Dùng khi nút bị lệch theo hình zic-zac.

### Chèn (Insertion)
1. Thực hiện chèn như BST thông thường.
2. Cập nhật chiều cao của các nút tổ tiên.
3. Kiểm tra BF. Nếu |BF| > 1, thực hiện quay để cân bằng lại.

### Xóa (Deletion)
1. Xóa nút như BST.
2. Cập nhật chiều cao và thực hiện quay cân bằng từ nút cha của nút vừa xóa ngược lên gốc.

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Tìm kiếm | O(log n) | O(log n) | O(log n) | O(1) |
| Chèn | O(log n) | O(log n) | O(log n) | O(log n) |
| Xóa | O(log n) | O(log n) | O(log n) | O(log n) |

*Giải thích:* Do cây luôn duy trì chiều cao h = O(log n), mọi thao tác đi từ gốc xuống lá đều bị giới hạn bởi chiều cao này.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
// Cấu trúc nút
struct Node { int key; Node *left, *right; int height; };
// Hàm quay phải
Node* rightRotate(Node *y) {
    Node *x = y->left; Node *T2 = x->right;
    x->right = y; y->left = T2;
    y->height = max(h(y->left), h(y->right)) + 1;
    x->height = max(h(x->left), h(x->right)) + 1;
    return x;
}
```

### Java
```java
class AVLTree {
    int getBalance(Node N) { return (N == null) ? 0 : height(N.left) - height(N.right); }
    // Logic chèn tương tự C++ với việc gọi đệ quy và kiểm tra getBalance
}
```

### Python
```python
class TreeNode:
    def __init__(self, key): self.key = key; self.height = 1
# Sử dụng đệ quy để cập nhật height sau mỗi thao tác chèn/xóa
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Quên cập nhật chiều cao:** Sau mỗi phép quay, chiều cao của nút cha và con phải được tính toán lại.
- **Null Pointer:** Luôn kiểm tra `node == null` trước khi truy cập `node->left` hoặc `node->height`.
- **Cân bằng sau xóa:** Sau khi xóa, cần tiếp tục kiểm tra cân bằng cho đến tận gốc cây.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Hệ thống quản trị CSDL (như SQLite), bộ nhớ đệm (Cache) cần tìm kiếm nhanh.
- **Câu hỏi phỏng vấn:**
  1. "Tại sao chọn AVL thay vì Red-Black Tree?" (AVL tìm kiếm nhanh hơn, Red-Black chèn/xóa nhanh hơn).
  2. "Cho một mảng, hãy xây dựng cây AVL cân bằng nhất?" (Sử dụng phương pháp chia để trị).
  3. LeetCode: *Balanced Binary Tree* (Kiểm tra cây có cân bằng hay không).$content$,
    6,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '37e0be49-6f4f-5827-acb6-8114a46e5909',
    'Thuật toán Quay lui (Backtracking Algorithm)',
    'thuat-toan-quay-lui-backtracking',
    'Backtracking',
    'Quay lui là kỹ thuật giải thuật dựa trên đệ quy, tập trung vào việc khám phá không gian trạng thái bằng cách thử nghiệm các lựa chọn và ''quay lui'' khi gặp bế tắc. Đây là công cụ mạnh mẽ để giải quyết các bài toán tổ hợp, hoán vị và tìm kiếm trong không gian cấu hình lớn.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong khoa học máy tính, nhiều bài toán không thể giải quyết bằng các thuật toán tham lam (Greedy) hay quy hoạch động (Dynamic Programming) do không gian lời giải quá lớn hoặc không có tính chất tối ưu con. Quay lui (Backtracking) ra đời như một phương pháp tìm kiếm có hệ thống trên cây không gian trạng thái (State-Space Tree).

**Mô hình tư duy:** Hãy tưởng tượng bạn đang đi trong một mê cung. Bạn đi đến một ngã ba, bạn chọn một hướng. Nếu hướng đó dẫn đến ngõ cụt, bạn quay trở lại ngã ba đó và chọn hướng khác. Quá trình này lặp lại cho đến khi tìm thấy lối ra hoặc đã thử hết mọi khả năng.

**Cơ chế:** Quay lui sử dụng ngăn xếp đệ quy (Recursion Stack) để lưu trữ trạng thái hiện tại. Khi một nhánh không thỏa mãn điều kiện (Constraint), thuật toán sẽ 'undo' (hoàn tác) thay đổi gần nhất để khôi phục trạng thái trước đó.

## 2. Chi tiết các thao tác cốt lõi

Cấu trúc chung của một thuật toán quay lui:
1. **Kiểm tra cơ sở (Base Case):** Nếu trạng thái hiện tại là lời giải, lưu lại hoặc in ra.
2. **Vòng lặp lựa chọn:** Duyệt qua tất cả các lựa chọn khả thi tại bước hiện tại.
3. **Ràng buộc (Constraint Check):** Kiểm tra xem lựa chọn có hợp lệ không.
4. **Đệ quy (Recursive Step):** Thực hiện lựa chọn và gọi đệ quy cho bước tiếp theo.
5. **Hoàn tác (Backtrack):** Loại bỏ lựa chọn vừa thực hiện để thử lựa chọn khác.

**Mô phỏng (Dry Run):** Với bài toán tìm hoán vị của [1, 2].
- Bắt đầu: []
- Chọn 1: [1] -> Đệ quy chọn 2: [1, 2] (Thành công)
- Quay lui: [1] -> Hết lựa chọn.
- Quay lui: [] -> Chọn 2: [2] -> Đệ quy chọn 1: [2, 1] (Thành công)

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Độ phức tạp |
| :--- | :--- |
| Thời gian | Thường là O(b^d) với b là nhánh, d là độ sâu |
| Không gian | O(d) do độ sâu của ngăn xếp đệ quy |

*Giải thích:* Vì quay lui duyệt qua toàn bộ không gian trạng thái (trừ các nhánh bị cắt tỉa), độ phức tạp thường là hàm mũ. Việc tối ưu hóa phụ thuộc vào khả năng cắt tỉa (Pruning) các nhánh không tiềm năng.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
void backtrack(vector<int>& path, vector<bool>& used) {
    if (path.size() == n) { /* Lưu kết quả */ return; }
    for (int i = 0; i < n; ++i) {
        if (!used[i]) {
            used[i] = true; path.push_back(i); // Chọn
            backtrack(path, used); // Đệ quy
            path.pop_back(); used[i] = false; // Hoàn tác
        }
    }
}
```

### Java
```java
void backtrack(List<Integer> path, boolean[] used) {
    if (path.size() == n) { /* Lưu kết quả */ return; }
    for (int i = 0; i < n; i++) {
        if (!used[i]) {
            used[i] = true; path.add(i);
            backtrack(path, used);
            path.remove(path.size() - 1); used[i] = false;
        }
    }
}
```

### Python
```python
def backtrack(path, used):
    if len(path) == n: # Lưu kết quả
        return
    for i in range(n):
        if not used[i]:
            used[i] = True; path.append(i)
            backtrack(path, used)
            path.pop(); used[i] = False # Hoàn tác
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Quên hoàn tác:** Đây là lỗi phổ biến nhất khiến thuật toán chạy sai kết quả.
- **Tràn ngăn xếp (Stack Overflow):** Do độ sâu đệ quy quá lớn.
- **Điều kiện dừng sai:** Dẫn đến vòng lặp vô tận.
- **Cách phòng tránh:** Luôn vẽ cây trạng thái trước khi code và kiểm tra kỹ trạng thái trước/sau khi gọi đệ quy.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn Big Tech
- **Ứng dụng:** Giải Sudoku, lập lịch (Scheduling), thiết kế mạch tích hợp (VLSI), tìm đường trong đồ thị.
- **Bài toán kinh điển:**
  1. **N-Queens Problem:** Đặt N quân hậu trên bàn cờ NxN sao cho không quân nào ăn được nhau.
  2. **Subset Sum:** Tìm tập con có tổng bằng K.
  3. **Word Search:** Tìm từ trong lưới ký tự (LeetCode 79).$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    'b0b7f115-0d64-58fe-927f-9d5af8110226',
    'Bài toán N-Hậu (N-Queen Problem) với Kỹ thuật Quay lui (Backtracking)',
    'bai-toan-n-hau-n-queen-backtracking',
    'Backtracking',
    'Bài toán N-Hậu là bài toán kinh điển trong khoa học máy tính, yêu cầu đặt N quân hậu trên bàn cờ N×N sao cho không quân hậu nào tấn công lẫn nhau. Đây là ví dụ hoàn hảo để minh họa kỹ thuật quay lui (backtracking) nhằm tìm kiếm không gian trạng thái một cách hiệu quả thông qua việc cắt tỉa các nhánh không hợp lệ.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Bài toán N-Hậu yêu cầu đặt N quân hậu trên bàn cờ N×N sao cho không có hai quân hậu nào nằm trên cùng một hàng, cùng một cột hoặc cùng một đường chéo. 

**Bản chất:** Đây là bài toán tìm kiếm trong không gian trạng thái (State Space Search). Với mỗi hàng, ta thử đặt quân hậu vào từng cột và kiểm tra tính hợp lệ. Nếu một vị trí dẫn đến bế tắc, ta thực hiện 'quay lui' (backtrack) để thử vị trí khác.

**Mô hình tư duy:**
- Mỗi hàng là một tầng trong cây đệ quy.
- Mỗi cột là một nhánh con.
- Việc kiểm tra an toàn giúp cắt tỉa (pruning) các nhánh không khả thi, giảm đáng kể số lượng trạng thái cần duyệt.

## 2. Chi tiết các thao tác cốt lõi
### Thuật toán cơ bản:
1. Bắt đầu từ hàng 0.
2. Với mỗi cột từ 0 đến N-1:
   - Kiểm tra xem vị trí (row, col) có an toàn không (không bị tấn công bởi các quân hậu đã đặt).
   - Nếu an toàn: Đặt quân hậu, đánh dấu vị trí, đệ quy sang hàng tiếp theo.
   - Nếu đệ quy trả về kết quả hoặc hoàn thành, thực hiện quay lui: bỏ đánh dấu vị trí để thử cột tiếp theo.

### Mô phỏng (Dry Run cho N=4):
- Hàng 0, Cột 0: Đặt hậu. Hàng 1, Cột 0, 1 bị chặn. Hàng 1, Cột 2: Đặt hậu. Tiếp tục cho đến khi tìm thấy cấu hình [2, 4, 1, 3].

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Thời gian (Worst) | Không gian (Space) |
| :--- | :--- | :--- |
| Tìm kiếm | O(N!) | O(N) |

- **Tại sao O(N!):** Ở hàng đầu tiên có N lựa chọn, hàng thứ hai có tối đa N-2 lựa chọn, hàng thứ ba có N-4... dẫn đến giai thừa.
- **Không gian:** O(N) cho mảng đánh dấu và ngăn xếp đệ quy.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++ (Tối ưu hóa với Hashing)
```cpp
#include <vector>
using namespace std;
void solve(int row, int n, vector<int>& cols, vector<int>& ld, vector<int>& rd, vector<int>& cur, vector<vector<int>>& res) {
    if (row == n) { res.push_back(cur); return; }
    for (int col = 0; col < n; col++) {
        if (cols[col] || ld[row + col] || rd[row - col + n - 1]) continue;
        cols[col] = ld[row + col] = rd[row - col + n - 1] = 1;
        cur.push_back(col + 1);
        solve(row + 1, n, cols, ld, rd, cur, res);
        cur.pop_back();
        cols[col] = ld[row + col] = rd[row - col + n - 1] = 0;
    }
}
```

### Java
```java
import java.util.*;
class NQueen {
    public void solve(int row, int n, int[] cols, int[] ld, int[] rd, List<Integer> cur, List<List<Integer>> res) {
        if (row == n) { res.add(new ArrayList<>(cur)); return; }
        for (int col = 0; col < n; col++) {
            if (cols[col] == 1 || ld[row + col] == 1 || rd[row - col + n - 1] == 1) continue;
            cols[col] = ld[row + col] = rd[row - col + n - 1] = 1;
            cur.add(col + 1);
            solve(row + 1, n, cols, ld, rd, cur, res);
            cur.remove(cur.size() - 1);
            cols[col] = ld[row + col] = rd[row - col + n - 1] = 0;
        }
    }
}
```

### Python
```python
def solve(row, n, cols, ld, rd, cur, res):
    if row == n:
        res.append(list(cur))
        return
    for col in range(n):
        if cols[col] or ld[row + col] or rd[row - col + n - 1]: continue
        cols[col] = ld[row + col] = rd[row - col + n - 1] = 1
        cur.append(col + 1)
        solve(row + 1, n, cols, ld, rd, cur, res)
        cur.pop()
        cols[col] = ld[row + col] = rd[row - col + n - 1] = 0
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **N < 4:** Không có nghiệm (trừ N=1).
- **Lỗi chỉ số:** Khi tính toán đường chéo (row - col + n - 1), cần đảm bảo mảng đủ kích thước 2*N-1.
- **Quên quay lui:** Không đặt lại trạng thái (reset) sau khi đệ quy sẽ dẫn đến kết quả sai.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Giải quyết các bài toán xếp lịch (Scheduling), phân bổ tài nguyên, thiết kế mạch tích hợp (VLSI).
- **Bài tập LeetCode:** 
  1. N-Queens (LeetCode 51): Tìm tất cả các cấu hình.
  2. N-Queens II (LeetCode 52): Đếm số lượng cấu hình.
- **Gợi ý phỏng vấn:** Luôn hỏi về cách tối ưu hóa kiểm tra an toàn bằng Bitmasking để đạt hiệu suất cao nhất.$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '04f7783a-4f11-5f9b-a2f9-078ac754fd67',
    'Cấu trúc dữ liệu Đống (Heap Data Structure)',
    'cau-truc-du-lieu-dong-heap',
    'Heap / Priority Queue',
    'Heap là một cây nhị phân hoàn chỉnh (Complete Binary Tree) tuân thủ tính chất đống, cho phép truy xuất phần tử cực trị (lớn nhất hoặc nhỏ nhất) với độ phức tạp O(1). Đây là nền tảng cốt lõi để xây dựng hàng đợi ưu tiên (Priority Queue) và các thuật toán tối ưu hóa như Heap Sort, Dijkstra hay Prim.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Trong nhiều bài toán thực tế, chúng ta không cần duy trì toàn bộ tập dữ liệu theo thứ tự (như mảng đã sắp xếp), mà chỉ cần truy xuất nhanh phần tử có giá trị lớn nhất hoặc nhỏ nhất. Nếu dùng mảng, việc chèn/xóa mất O(N); nếu dùng cây tìm kiếm nhị phân (BST), độ phức tạp là O(log N) nhưng có thể bị mất cân bằng. Heap ra đời để giải quyết bài toán này với hiệu năng ổn định.

### Định nghĩa
Heap là một cây nhị phân hoàn chỉnh:
- **Min-Heap**: Giá trị của nút cha luôn nhỏ hơn hoặc bằng giá trị của các nút con.
- **Max-Heap**: Giá trị của nút cha luôn lớn hơn hoặc bằng giá trị của các nút con.

### Memory Layout
Vì là cây nhị phân hoàn chỉnh, Heap thường được biểu diễn bằng mảng (Array-based representation) để tối ưu bộ nhớ và tận dụng tính cục bộ của Cache (Cache Locality). Với nút tại chỉ số `i` (bắt đầu từ 0):
- Nút cha: `(i - 1) / 2`
- Con trái: `2 * i + 1`
- Con phải: `2 * i + 2`

## 2. Chi tiết các thao tác cốt lõi
- **Heapify**: Duy trì tính chất đống sau khi thay đổi giá trị nút.
- **Insert**: Thêm phần tử vào cuối mảng, sau đó thực hiện 'Sift-up' (đưa phần tử lên vị trí phù hợp).
- **Extract-Min/Max**: Lấy gốc, thay thế bằng phần tử cuối, sau đó thực hiện 'Sift-down' (đưa phần tử xuống vị trí phù hợp).

### Mô phỏng (Dry Run - Min Heap)
Thêm 3 vào [10, 20]:
1. Mảng: [10, 20, 3].
2. So sánh 3 với cha (20): 3 < 20 -> Hoán đổi.
3. Mảng: [10, 3, 20].
4. So sánh 3 với cha (10): 3 < 10 -> Hoán đổi.
5. Mảng: [3, 10, 20] (Đã thỏa mãn).

## 3. Đánh giá độ phức tạp
| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Find Min/Max | O(1) | O(1) | O(1) | O(1) |
| Insert | O(1) | O(log N) | O(log N) | O(1) |
| Extract | O(1) | O(log N) | O(log N) | O(1) |

## 4. Cài đặt mã nguồn
### C++
```cpp
#include <vector>
#include <algorithm>
// Sử dụng std::priority_queue có sẵn trong <queue>
```
### Java
```java
import java.util.PriorityQueue;
// PriorityQueue<Integer> pq = new PriorityQueue<>();
```
### Python
```python
import heapq
# heapq.heappush(heap, item), heapq.heappop(heap)
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Index Out of Bounds**: Luôn kiểm tra `2*i + 1 < size` trước khi truy cập con.
- **Off-by-one**: Nhầm lẫn giữa chỉ số 0-based và 1-based khi tính toán vị trí cha/con.
- **Memory Leak**: Trong các ngôn ngữ quản lý bộ nhớ thủ công, cần giải phóng mảng sau khi sử dụng.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng**: Lập lịch tác vụ (Task Scheduling), thuật toán Dijkstra (tìm đường đi ngắn nhất), Huffman Coding (nén dữ liệu).
- **Bài toán kinh điển**:
  1. **K-th Largest Element in an Array**: Dùng Min-Heap kích thước K.
  2. **Merge K Sorted Lists**: Dùng Min-Heap để lấy phần tử nhỏ nhất từ K danh sách tại mỗi bước.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '78dbae09-e240-54e8-80cc-01c8326229d1',
    'Hàng đợi (Queue Data Structure)',
    'hang-doi-queue',
    'Heap / Priority Queue',
    'Hàng đợi (Queue) là cấu trúc dữ liệu tuyến tính tuân thủ nguyên tắc FIFO (First-In, First-Out), nơi phần tử được thêm vào cuối và loại bỏ từ đầu. Đây là thành phần cốt lõi trong việc quản lý tài nguyên hệ thống, lập lịch tác vụ và các thuật toán duyệt đồ thị như BFS.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Trong khoa học máy tính, chúng ta thường xuyên đối mặt với bài toán 'lệch pha tốc độ' (speed mismatch) giữa các tiến trình hoặc thiết bị. Ví dụ: CPU xử lý dữ liệu cực nhanh trong khi bàn phím nhập liệu chậm. Để giải quyết, ta cần một vùng đệm (buffer) lưu trữ tạm thời các yêu cầu theo đúng thứ tự đến trước được xử lý trước.

Queue mô hình hóa hàng đợi thực tế: 
- **Front (Đầu):** Nơi thực hiện thao tác xóa (Dequeue).
- **Rear (Cuối):** Nơi thực hiện thao tác thêm (Enqueue).

### Sơ đồ trực quan:
```
[Front] <--- [A] [B] [C] [D] <--- [Rear]
             (Đã vào trước)      (Mới vào)
```

## 2. Chi tiết các thao tác cốt lõi
- **Enqueue(x):** Thêm phần tử vào cuối hàng đợi. Nếu hàng đợi đầy (trong mảng cố định), gây lỗi Overflow.
- **Dequeue():** Loại bỏ phần tử ở đầu hàng đợi. Nếu hàng đợi rỗng, gây lỗi Underflow.
- **Peek/Front():** Xem giá trị phần tử đầu mà không xóa.
- **isEmpty():** Kiểm tra hàng đợi có trống không.

### Mô phỏng (Dry Run):
Khởi tạo: `Q = []`
1. Enqueue(10): `Q = [10]`
2. Enqueue(20): `Q = [10, 20]`
3. Dequeue(): Trả về 10, `Q = [20]`

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Best | Average | Worst | Space |
| :--- | :--- | :--- | :--- | :--- |
| Enqueue | O(1) | O(1) | O(1) | O(1) |
| Dequeue | O(1) | O(1) | O(1) | O(1) |
| Peek | O(1) | O(1) | O(1) | O(1) |

*Lưu ý:* Với mảng tĩnh, Dequeue có thể tốn O(n) nếu không dùng con trỏ vòng (Circular Queue).

## 4. Cài đặt mã nguồn

### C++ (Sử dụng std::queue)
```cpp
#include <queue>
#include <iostream>
int main() {
    std::queue<int> q;
    q.push(10); // Enqueue
    q.pop();    // Dequeue
    return 0;
}
```

### Java (Sử dụng LinkedList)
```java
import java.util.LinkedList;
import java.util.Queue;
Queue<Integer> q = new LinkedList<>();
q.add(10); // Enqueue
q.poll();  // Dequeue
```

### Python (Sử dụng collections.deque)
```python
from collections import deque
q = deque()
q.append(10) # Enqueue
q.popleft()  # Dequeue (O(1))
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Underflow:** Gọi `pop()` khi hàng đợi rỗng. Luôn kiểm tra `isEmpty()` trước.
- **Circular Queue Overflow:** Khi dùng mảng vòng, cần chú ý điều kiện `(rear + 1) % size == front` để tránh ghi đè dữ liệu.
- **Memory Leak:** Trong C++, nếu dùng con trỏ, phải giải phóng bộ nhớ khi dequeue.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** CPU Scheduling (Round Robin), BFS (Duyệt đồ thị theo chiều rộng), xử lý yêu cầu Web Server.
- **Bài toán phỏng vấn:**
  1. *Implement Queue using Stacks:* Sử dụng 2 ngăn xếp để mô phỏng hàng đợi (tư duy đảo ngược thứ tự).
  2. *Sliding Window Maximum:* Tìm giá trị lớn nhất trong cửa sổ trượt (sử dụng Deque để tối ưu O(n)).$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '85e8bb3c-bb71-5ba7-ac88-233ec22b4b6d',
    'Quy hoạch động (Dynamic Programming - DP)',
    'quy-hoach-dong-dynamic-programming',
    '1-D Dynamic Programming',
    'Quy hoạch động là kỹ thuật tối ưu hóa giải thuật bằng cách chia nhỏ bài toán lớn thành các bài toán con chồng lấp, lưu trữ kết quả trung gian để tránh tính toán lại. Đây là chìa khóa để chuyển đổi các thuật toán có độ phức tạp hàm mũ (exponential) sang đa thức (polynomial), là nền tảng cốt lõi trong phỏng vấn kỹ thuật tại các tập đoàn công nghệ lớn.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm

Trong khoa học máy tính, nhiều bài toán có cấu trúc đệ quy tự nhiên (như dãy Fibonacci). Tuy nhiên, đệ quy thuần túy thường dẫn đến việc tính toán lại cùng một bài toán con nhiều lần, gây ra độ phức tạp thời gian hàm mũ $O(2^n)$. 

**Bản chất của DP:**
- **Optimal Substructure:** Bài toán tối ưu có thể được giải bằng cách kết hợp lời giải của các bài toán con.
- **Overlapping Subproblems:** Các bài toán con được giải đi giải lại nhiều lần.

**Mô hình tư duy:**
Thay vì tính lại, ta dùng một "bảng ghi nhớ" (Memoization table) hoặc "bảng quy hoạch" (Tabulation table) để lưu kết quả. 

| Trạng thái | Ý nghĩa |
| :--- | :--- |
| `dp[i]` | Kết quả tối ưu cho bài toán con tại bước `i` |
| `Base Case` | Điểm dừng cơ sở (ví dụ: `dp[0] = 0`, `dp[1] = 1`) |

## 2. Chi tiết các thao tác cốt lõi

Có hai cách tiếp cận chính:
1. **Top-Down (Memoization):** Bắt đầu từ bài toán lớn, đệ quy xuống bài toán con, lưu kết quả vào mảng/hash map.
2. **Bottom-Up (Tabulation):** Giải quyết các bài toán con nhỏ nhất trước, xây dựng dần lên bài toán lớn thông qua vòng lặp.

**Mô phỏng (Ví dụ Fibonacci):**
Để tính `F(4)`:
- `F(4) = F(3) + F(2)`
- `F(3) = F(2) + F(1)`
- `F(2) = F(1) + F(0)`
*DP sẽ lưu `F(0), F(1), F(2), F(3)` vào mảng, mỗi giá trị chỉ tính đúng 1 lần.*

## 3. Đánh giá độ phức tạp giải thuật

| Thao tác | Thời gian (Best) | Thời gian (Avg) | Thời gian (Worst) | Không gian |
| :--- | :--- | :--- | :--- | :--- |
| DP (Tabulation) | O(N) | O(N) | O(N) | O(N) |

*Lưu ý: Không gian có thể tối ưu xuống O(1) nếu chỉ cần vài trạng thái trước đó (ví dụ: Fibonacci chỉ cần 2 biến).* 

## 4. Cài đặt mã nguồn (Ví dụ: Climbing Stairs)

### C++
```cpp
int climbStairs(int n) {
    if (n <= 2) return n;
    vector<int> dp(n + 1);
    dp[1] = 1; dp[2] = 2;
    for(int i = 3; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

### Java
```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1; dp[2] = 2;
    for(int i = 3; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

### Python
```python
def climbStairs(n):
    if n <= 2: return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error:** Sai lệch chỉ số mảng (thường gặp khi khởi tạo `dp[n+1]` nhưng truy cập `dp[n+1]`).
- **Tràn bộ nhớ:** Với bài toán 2D/3D, mảng DP quá lớn gây `Memory Limit Exceeded`.
- **Quên khởi tạo:** Không đặt giá trị cơ sở (base case) dẫn đến kết quả sai.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Nén dữ liệu, xử lý ngôn ngữ tự nhiên (Edit Distance), tối ưu hóa lộ trình (Bellman-Ford).
- **Bài toán kinh điển:**
    1. **House Robber:** Tối ưu hóa lựa chọn không kề nhau.
    2. **Coin Change:** Tìm số cách hoặc số lượng đồng xu tối thiểu.
    3. **Longest Increasing Subsequence:** Tìm dãy con tăng dài nhất.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '70eff730-c653-5260-ae71-18de992b50d6',
    'Quy hoạch động 1 chiều: Ghi nhớ (Memoization) và Bảng hóa (Tabulation)',
    'quy-hoach-dong-1-chieu-memoization-vs-tabulation',
    '1-D Dynamic Programming',
    'Quy hoạch động (Dynamic Programming - DP) là kỹ thuật tối ưu hóa bằng cách chia nhỏ bài toán thành các bài toán con trùng lặp. Memoization (Top-down) sử dụng đệ quy kết hợp lưu trữ kết quả, trong khi Tabulation (Bottom-up) sử dụng vòng lặp để xây dựng bảng trạng thái từ cơ sở, giúp tối ưu hóa hiệu năng trong các bài toán tối ưu hóa.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Trong các bài toán tối ưu hóa, phương pháp vét cạn (Brute Force) thường dẫn đến độ phức tạp hàm mũ do tính toán lại các bài toán con nhiều lần. Quy hoạch động (DP) giải quyết vấn đề này bằng cách lưu trữ kết quả của các bài toán con đã giải.

- **Memoization (Top-down):** Bắt đầu từ bài toán lớn, phân rã đệ quy xuống các bài toán con. Kết quả được lưu vào một bảng (cache) khi cần.
- **Tabulation (Bottom-up):** Bắt đầu từ các bài toán con nhỏ nhất, giải quyết tuần tự và lưu vào bảng để xây dựng dần đến bài toán lớn.

### Bảng so sánh tư duy
| Đặc điểm | Memoization (Top-down) | Tabulation (Bottom-up) |
| :--- | :--- | :--- |
| Cách tiếp cận | Đệ quy | Lặp (Iterative) |
| Trạng thái | Giải khi cần | Giải theo thứ tự từ nhỏ đến lớn |
| Overhead | Có (Stack frame) | Không (Trực tiếp) |
| Ưu điểm | Chỉ giải bài toán cần thiết | Tối ưu bộ nhớ, không đệ quy |

## 2. Chi tiết các thao tác cốt lõi
Xét bài toán **Cắt thanh (Rod Cutting)**: Cho thanh độ dài `n`, giá `price[i]`. Tìm giá trị lớn nhất.

### Mô phỏng (Dry Run) với n=4:
1. **Memoization:** Gọi `cut(4)` -> gọi `cut(3)`, `cut(2)`... kiểm tra `memo[i]` trước khi tính.
2. **Tabulation:** Tính `dp[0]=0`, `dp[1]=price[0]`, `dp[2]=max(price[1], price[0]+dp[1])`... cho đến `dp[4]`.

## 3. Đánh giá độ phức tạp giải thuật
| Thuật toán | Thời gian (Time) | Không gian (Space) |
| :--- | :--- | :--- |
| Memoization | O(n^2) | O(n) |
| Tabulation | O(n^2) | O(n) |

*Giải thích:* Cả hai đều duyệt qua các trạng thái (n) và với mỗi trạng thái thực hiện vòng lặp (n), dẫn đến O(n^2). Không gian O(n) dùng để lưu bảng kết quả.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++ (Tabulation)
```cpp
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int cutRod(vector<int>& price) {
    int n = price.size();
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            dp[i] = max(dp[i], price[j - 1] + dp[i - j]);
        }
    }
    return dp[n];
}
```

### Java (Tabulation)
```java
public class RodCutting {
    public static int cutRod(int[] price) {
        int n = price.length;
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                dp[i] = Math.max(dp[i], price[j - 1] + dp[i - j]);
            }
        }
        return dp[n];
    }
}
```

### Python (Tabulation)
```python
def cut_rod(price):
    n = len(price)
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        for j in range(1, i + 1):
            dp[i] = max(dp[i], price[j - 1] + dp[i - j])
    return dp[n]
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Off-by-one error:** Thường xảy ra khi truy cập chỉ số mảng `price[j-1]` hoặc `dp[i-j]`. Luôn kiểm tra kích thước mảng.
- **Stack Overflow:** Với Memoization, nếu `n` quá lớn, đệ quy sâu có thể gây tràn bộ nhớ ngăn xếp.
- **Khởi tạo sai:** Quên khởi tạo bảng `dp` với giá trị cơ sở (thường là 0 hoặc -1).

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Tối ưu hóa chuỗi cung ứng, phân bổ tài nguyên, xử lý tín hiệu.
- **Bài tập kinh điển:**
  1. **Climbing Stairs (LeetCode 70):** Bài toán cơ bản nhất về DP 1D.
  2. **Coin Change (LeetCode 322):** Bài toán tìm số lượng đồng xu tối thiểu.
  3. **Longest Increasing Subsequence (LeetCode 300):** Bài toán kinh điển về dãy con tăng dài nhất.$content$,
    2,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '5a80e479-82c3-5c6a-85de-6fdbf40ca4ca',
    'Bài toán đổi tiền (Coin Change - Count Ways)',
    'bai-toan-doi-tien-coin-change-count-ways',
    '1-D Dynamic Programming',
    'Bài toán đổi tiền là một ví dụ kinh điển của Quy hoạch động (Dynamic Programming), tập trung vào việc đếm số cách kết hợp các mệnh giá tiền để đạt được một tổng mục tiêu cho trước với số lượng tiền không giới hạn. Bản chất của bài toán là giải quyết sự trùng lặp trong các bài toán con (overlapping subproblems) bằng cách lưu trữ kết quả trung gian để tối ưu hóa thời gian thực thi.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Bài toán yêu cầu tìm số cách kết hợp các mệnh giá tiền (coins) để tạo thành một tổng (sum) cho trước. Vì mỗi loại tiền có số lượng vô hạn, đây là biến thể của bài toán "Unbounded Knapsack".

- **Bản chất:** Chúng ta cần đưa ra quyết định tại mỗi bước: "Có nên chọn đồng xu này hay không?". Nếu chọn, ta vẫn có thể chọn lại nó ở bước sau. Nếu không, ta chuyển sang đồng xu tiếp theo.
- **Mô hình tư duy:** Đây là bài toán đếm (counting problem). Thay vì tìm giá trị tối ưu, ta cộng dồn số cách thực hiện của các trạng thái con.

### Sơ đồ trạng thái (DP Table)
Giả sử `coins = [1, 2]`, `sum = 3`. Bảng DP `dp[i][j]` (i: số loại coin, j: tổng):

| | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **0 coin** | 1 | 0 | 0 | 0 |
| **1 coin** | 1 | 1 | 1 | 1 |
| **2 coins** | 1 | 1 | 2 | 2 |

## 2. Chi tiết các thao tác cốt lõi
- **Trạng thái:** `dp[j]` là số cách để tạo ra tổng `j`.
- **Công thức truy hồi:** `dp[j] = dp[j] + dp[j - coin]`.
- **Dry Run (sum=3, coins=[1, 2]):**
  1. Khởi tạo `dp[0] = 1`, các vị trí khác bằng 0.
  2. Xét coin 1: `dp[1]+=dp[0]` (1), `dp[2]+=dp[1]` (1), `dp[3]+=dp[2]` (1). `dp` = [1, 1, 1, 1].
  3. Xét coin 2: `dp[2]+=dp[0]` (1+1=2), `dp[3]+=dp[1]` (1+1=2). `dp` = [1, 1, 2, 2].

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Thời gian (Best) | Thời gian (Average) | Thời gian (Worst) | Không gian |
|---|---|---|---|---|
| Đếm cách đổi tiền | O(N*Sum) | O(N*Sum) | O(N*Sum) | O(Sum) |

- **Tại sao:** Với mỗi đồng xu (N), ta duyệt qua tổng từ `coin` đến `sum`. Tổng số phép tính là N * Sum.

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
#include <vector>
#include <iostream>
using namespace std;

int countWays(vector<int>& coins, int sum) {
    vector<int> dp(sum + 1, 0);
    dp[0] = 1; // Có 1 cách để tạo tổng 0 (không chọn gì)
    for (int coin : coins) {
        for (int j = coin; j <= sum; j++) {
            dp[j] += dp[j - coin];
        }
    }
    return dp[sum];
}
```

### Java
```java
public class CoinChange {
    public static int countWays(int[] coins, int sum) {
        int[] dp = new int[sum + 1];
        dp[0] = 1;
        for (int coin : coins) {
            for (int j = coin; j <= sum; j++) {
                dp[j] += dp[j - coin];
            }
        }
        return dp[sum];
    }
}
```

### Python
```python
def count_ways(coins, total_sum):
    dp = [0] * (total_sum + 1)
    dp[0] = 1
    for coin in coins:
        for j in range(coin, total_sum + 1):
            dp[j] += dp[j - coin]
    return dp[total_sum]
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Sum = 0:** Luôn trả về 1 (tập hợp rỗng).
- **Coins rỗng:** Nếu sum > 0, trả về 0.
- **Lỗi thứ tự vòng lặp:** Nếu đổi chỗ vòng lặp `for coin` và `for j`, bạn sẽ tính số hoán vị thay vì tổ hợp (thứ tự các đồng xu sẽ quan trọng).

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn Big Tech
- **Ứng dụng:** Hệ thống thanh toán tự động, tối ưu hóa phân bổ tài nguyên, bài toán chia cắt dữ liệu.
- **Câu hỏi phỏng vấn:**
  1. *Coin Change II (LeetCode 518):* Chính là bài toán này.
  2. *Combination Sum IV (LeetCode 377):* Yêu cầu tính hoán vị (thứ tự quan trọng) - cần đổi thứ tự vòng lặp.
  3. *Tối ưu hóa:* Làm sao để giải quyết nếu `sum` cực lớn nhưng số lượng `coins` ít? (Gợi ý: Sử dụng ma trận lũy thừa nếu bài toán cho phép).$content$,
    3,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '88cc6502-98e2-59b1-89ca-00cc5c48469d',
    'Dãy con chung dài nhất (Longest Common Subsequence - LCS)',
    'day-con-chung-dai-nhat-lcs',
    '2-D Dynamic Programming',
    'LCS là bài toán kinh điển trong Quy hoạch động (Dynamic Programming), tìm độ dài của dãy con dài nhất xuất hiện trong hai chuỗi theo đúng thứ tự. Đây là nền tảng cho các thuật toán so sánh dữ liệu (diff), kiểm soát phiên bản (Git) và xử lý chuỗi trong tin sinh học.',
    $content$## 1. Đặt vấn đề & Bản chất khái niệm
Bài toán LCS yêu cầu tìm độ dài dãy con dài nhất có mặt trong cả hai chuỗi `s1` và `s2`. Lưu ý: Dãy con (subsequence) không nhất thiết phải liên tiếp, nhưng phải giữ nguyên thứ tự tương đối.

**Tại sao cần Quy hoạch động?**
Cách tiếp cận đệ quy thuần túy có độ phức tạp $O(2^{\min(m, n)})$ do tính toán lại các bài toán con trùng lặp. Quy hoạch động giúp lưu trữ kết quả các bài toán con, giảm độ phức tạp xuống $O(m \times n)$.

**Mô hình tư duy:**
Giả sử `dp[i][j]` là độ dài LCS của `s1[0...i-1]` và `s2[0...j-1]`:
- Nếu `s1[i-1] == s2[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`
- Nếu `s1[i-1] != s2[j-1]`: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

## 2. Chi tiết các thao tác cốt lõi
- **Khởi tạo:** Tạo bảng `dp` kích thước `(m+1) x (n+1)` với giá trị 0.
- **Lấp đầy bảng (Tabulation):** Duyệt qua từng ký tự của hai chuỗi và áp dụng công thức truy hồi trên.
- **Truy xuất kết quả:** Giá trị tại `dp[m][n]` chính là độ dài LCS.

**Mô phỏng (Dry Run):** `s1="ABC", s2="AC"`
| | "" | A | C |
|---|---|---|---|
| "" | 0 | 0 | 0 |
| A | 0 | 1 | 1 |
| B | 0 | 1 | 1 |
| C | 0 | 1 | 2 |
Kết quả: 2.

## 3. Đánh giá độ phức tạp giải thuật
| Thao tác | Thời gian (Best) | Thời gian (Average) | Thời gian (Worst) | Không gian bộ nhớ |
|---|---|---|---|---|
| LCS (Tabulation) | $O(m \times n)$ | $O(m \times n)$ | $O(m \times n)$ | $O(m \times n)$ |
| LCS (Space Opt) | $O(m \times n)$ | $O(m \times n)$ | $O(m \times n)$ | $O(n)$ |

## 4. Cài đặt mã nguồn hoàn chỉnh

### C++
```cpp
#include <vector>
#include <string>
#include <algorithm>
int lcs(std::string s1, std::string s2) {
    int m = s1.size(), n = s2.size();
    std::vector<int> dp(n + 1, 0);
    for (int i = 1; i <= m; ++i) {
        int prev = dp[0];
        for (int j = 1; j <= n; ++j) {
            int temp = dp[j];
            if (s1[i-1] == s2[j-1]) dp[j] = 1 + prev;
            else dp[j] = std::max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

### Java
```java
public int lcs(String s1, String s2) {
    int n = s2.length();
    int[] dp = new int[n + 1];
    for (int i = 1; i <= s1.length(); i++) {
        int prev = dp[0];
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (s1.charAt(i-1) == s2.charAt(j-1)) dp[j] = 1 + prev;
            else dp[j] = Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

### Python
```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = dp[0]
        for j in range(1, n + 1):
            temp = dp[j]
            if s1[i-1] == s2[j-1]: dp[j] = 1 + prev
            else: dp[j] = max(dp[j], dp[j-1])
            prev = temp
    return dp[n]
```

## 5. Các trường hợp biên & Lỗi thường gặp
- **Chuỗi rỗng:** Luôn trả về 0. Cần kiểm tra điều kiện này ngay từ đầu.
- **Off-by-one:** Lưu ý chỉ số `i-1` và `j-1` khi truy cập chuỗi vì bảng `dp` có kích thước `m+1`.
- **Tràn bộ nhớ:** Với chuỗi cực dài, `O(m*n)` có thể gây tràn RAM. Hãy ưu tiên dùng phương pháp tối ưu không gian `O(n)`.

## 6. Ứng dụng thực tế & Câu hỏi phỏng vấn
- **Ứng dụng:** Git (so sánh file), chỉnh sửa ảnh (so khớp đặc trưng), tin sinh học (so sánh chuỗi DNA).
- **Bài toán phỏng vấn:**
  1. *Edit Distance (Levenshtein Distance):* Biến đổi chuỗi này thành chuỗi kia với chi phí tối thiểu.
  2. *Shortest Common Supersequence:* Tìm chuỗi ngắn nhất chứa cả hai chuỗi con.
  3. *Longest Palindromic Subsequence:* LCS của chuỗi gốc và chuỗi đảo ngược của nó.$content$,
    1,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    summary = EXCLUDED.summary,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;
