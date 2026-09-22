-- ==========================================================================
-- Flyway Migration: V6__seed_theories.sql
-- Generated: 29 theory articles for Dapcode
-- ==========================================================================

INSERT INTO theories (id, title, slug, category, summary, content_markdown, order_index, is_published, created_at, updated_at)
VALUES (
    '4aa18c9d-2253-5a3a-8a65-253bc89d9c42',
    'Mảng (Array)',
    'mang-array',
    'Array & Hashing',
    'Mảng là cấu trúc dữ liệu tuyến tính lưu trữ các phần tử tại các vị trí bộ nhớ liên tiếp, cho phép truy cập ngẫu nhiên với hiệu suất cao.',
    $content$## 1. Đặt vấn đề & Khái niệm
Mảng (Array) là cấu trúc dữ liệu cơ bản nhất, lưu trữ một tập hợp các phần tử có cùng kiểu dữ liệu tại các ô nhớ liên tiếp. 
- **Cơ chế lưu trữ:** Trong các ngôn ngữ như C/C++, các phần tử được lưu trực tiếp tại các địa chỉ bộ nhớ liền kề. Trong các ngôn ngữ như Python, JavaScript hoặc Java (đối với kiểu đối tượng), mảng lưu trữ các tham chiếu (references) đến các đối tượng đó.
- **Đặc điểm:** Tính liên tục trong bộ nhớ giúp mảng tận dụng tối đa cơ chế "Locality of Reference" (tính cục bộ của tham chiếu), giúp cải thiện hiệu năng thông qua bộ nhớ đệm (Cache).

## 2. Các thao tác cơ bản (Core Operations)
- **Truy cập (Access):** Lấy giá trị tại chỉ số (index) cho trước.
- **Tìm kiếm (Search):** Tìm vị trí của một phần tử (tuyến tính hoặc nhị phân nếu mảng đã sắp xếp).
- **Chèn/Xóa (Insert/Delete):** Thêm hoặc loại bỏ phần tử. Lưu ý: Thao tác này ở giữa mảng yêu cầu dịch chuyển các phần tử còn lại, gây tốn kém chi phí.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Truy cập | O(1) | O(1) | O(1) |
| Tìm kiếm | O(n) | O(n) | O(1) |
| Chèn | O(n) | O(n) | O(1) |
| Xóa | O(n) | O(n) | O(1) |

## 4. Cài đặt mẫu (Implementation)
Ví dụ minh họa khởi tạo và truy cập mảng trong Python:

```python
# Khởi tạo mảng (List trong Python)
arr = [10, 20, 30, 40, 50]

# Truy cập phần tử O(1)
print(arr[2])  # Output: 30

# Duyệt mảng
for i in range(len(arr)):
    print(arr[i], end=" ")
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
  - Truy cập ngoài phạm vi (Index Out of Bounds).
  - Nhầm lẫn giữa kích thước mảng và chỉ số cuối cùng (index = size - 1).
  - Quên rằng việc chèn/xóa ở giữa mảng có độ phức tạp O(n).
- **Ứng dụng phỏng vấn:**
  - Mảng là nền tảng để xây dựng các cấu trúc dữ liệu phức tạp hơn như Stack, Queue, Hash Table.
  - Các kỹ thuật tối ưu thường gặp: Two Pointers (Hai con trỏ), Sliding Window (Cửa sổ trượt), Prefix Sum (Tổng tiền tố) và Binary Search (Tìm kiếm nhị phân).$content$,
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
    '7642c326-83dc-5367-89a5-0a596df3d1f2',
    'Cấp phát bộ nhớ Stack và Heap (Stack vs Heap Memory Allocation)',
    'cap-phat-bo-nho-stack-va-heap',
    'Array & Hashing',
    'Bài học phân tích sự khác biệt giữa Stack và Heap trong quản lý bộ nhớ, tập trung vào cơ chế cấp phát, vòng đời dữ liệu và vai trò cốt lõi trong các cấu trúc dữ liệu động.',
    $content$## 1. Đặt vấn đề & Khái niệm
Trong khoa học máy tính, bộ nhớ được chia thành hai vùng chính để phục vụ các mục đích khác nhau:
- **Stack (Ngăn xếp):** Là vùng nhớ được quản lý tự động bởi hệ thống, tuân theo cơ chế LIFO (Last-In, First-Out). Nó lưu trữ các biến cục bộ, tham số hàm và địa chỉ trả về. Khi một hàm kết thúc, bộ nhớ trên Stack được giải phóng ngay lập tức.
- **Heap (Vùng nhớ động):** Là vùng nhớ lớn hơn, được cấp phát thủ công (trong C/C++) hoặc quản lý bởi Garbage Collector (trong Java/Python). Dữ liệu trên Heap tồn tại độc lập với phạm vi hàm, cho phép tạo ra các cấu trúc dữ liệu có kích thước thay đổi linh hoạt.

## 2. Các thao tác cơ bản (Core Operations)
- **Stack:** 
  - Cấp phát: Tự động khi gọi hàm.
  - Giải phóng: Tự động khi hàm kết thúc.
- **Heap:**
  - Cấp phát: Sử dụng `new` (C++), `malloc` (C), hoặc khởi tạo đối tượng (Java/Python).
  - Giải phóng: Sử dụng `delete`/`free` (C/C++) hoặc cơ chế tự động (Garbage Collection).

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Stack Allocation | O(1) | O(1) | O(1) |
| Heap Allocation | O(1) | O(n) | O(1) |

*Lưu ý: Heap có thể tốn kém hơn do quá trình tìm kiếm khối nhớ trống (fragmentation).* 

## 4. Cài đặt mẫu (Implementation)
Ví dụ minh họa sự khác biệt trong C++:

```cpp
#include <iostream>
using namespace std;

int main() {
    // Stack: Biến cục bộ
    int x = 10; 

    // Heap: Cấp phát động
    int* y = new int(20); 

    cout << "Stack: " << x << ", Heap: " << *y << endl;

    // Giải phóng Heap thủ công
    delete y; 
    return 0;
}
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:**
  - **Stack Overflow:** Xảy ra khi đệ quy quá sâu hoặc cấp phát mảng quá lớn trên Stack.
  - **Memory Leak:** Quên giải phóng bộ nhớ Heap (trong C/C++), dẫn đến cạn kiệt tài nguyên.
  - **Dangling Pointer:** Truy cập vào vùng nhớ Heap đã bị giải phóng.
- **Ứng dụng phỏng vấn:**
  - Hiểu rõ Stack/Heap là chìa khóa để giải thích cách các cấu trúc dữ liệu như Linked List, Tree, Graph được lưu trữ.
  - Câu hỏi thường gặp: "Tại sao đệ quy có thể gây lỗi Stack Overflow?" hoặc "Sự khác biệt giữa biến tham trị và tham chiếu trong bộ nhớ?"$content$,
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
    'Mảng tĩnh và mảng động là hai cách tiếp cận quản lý bộ nhớ cơ bản trong cấu trúc dữ liệu, quyết định khả năng linh hoạt về kích thước và hiệu năng truy xuất của chương trình.',
    $content$## 1. Đặt vấn đề & Khái niệm

Mảng (Array) là cấu trúc dữ liệu lưu trữ các phần tử cùng kiểu dữ liệu tại các ô nhớ liên tiếp. Dựa trên cơ chế cấp phát bộ nhớ, ta chia làm hai loại:

- **Mảng tĩnh (Static Array):** Kích thước được xác định tại thời điểm biên dịch (compile-time). Bộ nhớ được cấp phát trên Stack, không thể thay đổi kích thước sau khi khai báo.
- **Mảng động (Dynamic Array):** Kích thước được xác định tại thời điểm thực thi (run-time). Bộ nhớ được cấp phát trên Heap, cho phép thay đổi kích thước linh hoạt khi cần thiết.

## 2. Các thao tác cơ bản (Core Operations)

- **Truy cập (Access):** Truy xuất phần tử qua chỉ số (index) với thời gian O(1).
- **Chèn/Xóa (Insertion/Deletion):** 
    - Mảng tĩnh: Không thể thay đổi kích thước.
    - Mảng động: Khi đầy, mảng động thường cấp phát một vùng nhớ mới lớn hơn (thường gấp đôi), sao chép dữ liệu cũ sang và giải phóng vùng nhớ cũ.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Truy cập | O(1) | O(1) | O(n) |
| Chèn (cuối) | O(1) | O(n) | O(n) |
| Xóa (cuối) | O(1) | O(1) | O(n) |

*Lưu ý: Độ phức tạp O(n) cho chèn/xóa trong trường hợp xấu nhất xảy ra khi mảng động cần tái cấp phát bộ nhớ (resize).* 

## 4. Cài đặt mẫu (Implementation)

Ví dụ minh họa bằng C++:

```cpp
#include <iostream>
#include <vector>

int main() {
    // Mảng tĩnh: Kích thước cố định
    int staticArr[5] = {1, 2, 3, 4, 5};

    // Mảng động: Sử dụng std::vector trong C++
    std::vector<int> dynamicArr;
    dynamicArr.push_back(10); // Thêm phần tử
    dynamicArr.push_back(20);
    
    std::cout << "Phần tử đầu mảng động: " << dynamicArr[0] << std::endl;
    return 0;
}
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)

- **Lỗi thường gặp:** 
    - Truy cập ngoài phạm vi (Out of bounds) dẫn đến lỗi Segmentation Fault.
    - Rò rỉ bộ nhớ (Memory leak) khi sử dụng mảng động thủ công (dùng `new` mà quên `delete`).
- **Ứng dụng phỏng vấn:**
    - Mảng tĩnh thường dùng khi biết trước số lượng phần tử (ví dụ: bảng chữ cái, ma trận cố định).
    - Mảng động là nền tảng của các cấu trúc dữ liệu cao cấp hơn như `ArrayList` (Java), `std::vector` (C++), hoặc `list` (Python). Khi phỏng vấn, hãy luôn cân nhắc chi phí của việc tái cấp phát bộ nhớ (resize) khi mảng động đầy.$content$,
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
    'Ngăn xếp (Stack)',
    'ngan-xep-stack',
    'Array & Hashing',
    'Ngăn xếp (Stack) là cấu trúc dữ liệu tuyến tính tuân thủ nguyên lý LIFO (Last In, First Out), thường được ứng dụng trong quản lý lời gọi hàm, trình duyệt web và các thuật toán xử lý biểu thức.',
    $content$## 1. Đặt vấn đề & Khái niệm
Ngăn xếp (Stack) là một cấu trúc dữ liệu tuyến tính hoạt động dựa trên nguyên lý **LIFO (Last In, First Out)**. Điều này có nghĩa là phần tử được thêm vào sau cùng sẽ là phần tử đầu tiên được lấy ra.

Hãy hình dung một chồng đĩa: bạn chỉ có thể đặt thêm đĩa lên trên cùng hoặc lấy đĩa từ trên cùng xuống. Để lấy được chiếc đĩa ở dưới cùng, bạn bắt buộc phải lấy hết các đĩa ở phía trên trước.

## 2. Các thao tác cơ bản (Core Operations)
Một Stack tiêu chuẩn cung cấp các thao tác chính sau:
- **Push**: Thêm một phần tử vào đỉnh của ngăn xếp.
- **Pop**: Loại bỏ phần tử ở đỉnh của ngăn xếp.
- **Peek (Top)**: Xem giá trị của phần tử ở đỉnh mà không loại bỏ nó.
- **IsEmpty**: Kiểm tra xem ngăn xếp có trống hay không.
- **IsFull**: Kiểm tra xem ngăn xếp đã đầy hay chưa (đối với cài đặt mảng có kích thước cố định).

## 3. Đánh giá độ phức tạp (Big-O Complexity)
Đối với cài đặt dựa trên mảng hoặc danh sách liên kết, các thao tác cơ bản đều đạt hiệu suất tối ưu:

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Push | O(1) | O(1) | O(1) |
| Pop | O(1) | O(1) | O(1) |
| Peek | O(1) | O(1) | O(1) |

## 4. Cài đặt mẫu (Implementation)
Dưới đây là ví dụ cài đặt Stack đơn giản bằng Python sử dụng `list`:

```python
class Stack:
    def __init__(self):
        self.stack = []

    def push(self, item):
        self.stack.append(item)

    def pop(self):
        if not self.is_empty():
            return self.stack.pop()
        return "Stack is empty"

    def peek(self):
        return self.stack[-1] if not self.is_empty() else None

    def is_empty(self):
        return len(self.stack) == 0

# Sử dụng
s = Stack()
s.push(10)
s.push(20)
print(s.pop())  # Output: 20
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
### Lỗi thường gặp:
- **Stack Overflow**: Xảy ra khi cố gắng `push` vào một ngăn xếp đã đầy (đối với mảng cố định) hoặc đệ quy quá sâu.
- **Stack Underflow**: Xảy ra khi cố gắng `pop` hoặc `peek` từ một ngăn xếp trống.

### Ứng dụng thực tế:
- **Quản lý lời gọi hàm (Call Stack)**: Hệ thống sử dụng stack để lưu trữ địa chỉ trả về và các biến cục bộ khi gọi hàm.
- **Trình duyệt web**: Nút "Back" sử dụng stack để lưu lịch sử các trang đã truy cập.
- **Xử lý biểu thức**: Chuyển đổi biểu thức trung tố sang hậu tố (Postfix) hoặc kiểm tra tính cân bằng của dấu ngoặc `()`, `{}`, `[]`.$content$,
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
    'Danh sách liên kết đơn là cấu trúc dữ liệu tuyến tính gồm các nút liên kết với nhau qua con trỏ, cho phép cấp phát bộ nhớ động và tối ưu hóa các thao tác chèn/xóa.',
    $content$## 1. Đặt vấn đề & Khái niệm
Danh sách liên kết đơn (Singly Linked List) là một cấu trúc dữ liệu tuyến tính, trong đó các phần tử không được lưu trữ tại các vị trí bộ nhớ liên tiếp. Mỗi phần tử được gọi là một **Node**, bao gồm hai thành phần:
- **Data**: Lưu trữ giá trị của nút.
- **Next**: Con trỏ (hoặc tham chiếu) trỏ đến nút kế tiếp.

Nút cuối cùng của danh sách sẽ có con trỏ `next` trỏ đến `null`, đánh dấu sự kết thúc của danh sách.

## 2. Các thao tác cơ bản (Core Operations)
- **Duyệt (Traversal)**: Đi qua từng nút từ đầu đến cuối để truy xuất dữ liệu.
- **Chèn (Insertion)**: Thêm nút mới vào đầu, cuối hoặc tại một vị trí cụ thể.
- **Xóa (Deletion)**: Loại bỏ nút khỏi danh sách tại vị trí bất kỳ.
- **Tìm kiếm (Searching)**: Tìm kiếm một giá trị cụ thể bằng cách duyệt danh sách.
- **Đảo ngược (Reversal)**: Thay đổi hướng của các con trỏ để đảo ngược thứ tự danh sách.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Truy cập (Access) | O(n) | O(n) | O(1) |
| Tìm kiếm (Search) | O(n) | O(n) | O(1) |
| Chèn (Insertion) | O(1) | O(1) | O(1) |
| Xóa (Deletion) | O(1) | O(1) | O(1) |

*Lưu ý: Chèn/Xóa tại đầu danh sách là O(1), nhưng tại vị trí bất kỳ cần O(n) để tìm kiếm vị trí đó.*

## 4. Cài đặt mẫu (Implementation)
Ví dụ cài đặt cấu trúc Node và khởi tạo danh sách bằng Python:

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Khởi tạo danh sách: 10 -> 20 -> 30
head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

# Duyệt danh sách
temp = head
while temp:
    print(temp.data, end=" ")
    temp = temp.next
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
### Lỗi thường gặp:
- **Null Pointer Exception**: Quên kiểm tra con trỏ `next` trước khi truy cập, dẫn đến lỗi khi danh sách rỗng hoặc duyệt quá cuối danh sách.
- **Memory Leak**: Trong các ngôn ngữ không có Garbage Collector (như C++), quên giải phóng bộ nhớ của các nút khi xóa.
- **Mất liên kết**: Thay đổi con trỏ `next` trước khi lưu trữ địa chỉ của nút tiếp theo trong quá trình chèn/xóa.

### Ứng dụng:
- Triển khai các cấu trúc dữ liệu khác như **Stack** và **Queue**.
- Quản lý bộ nhớ trong hệ điều hành.
- Sử dụng trong các bài toán cần thay đổi kích thước linh hoạt mà không muốn tốn chi phí sao chép mảng (như `std::vector` trong C++).$content$,
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
    'Danh sách liên kết đôi là cấu trúc dữ liệu tuyến tính trong đó mỗi nút chứa dữ liệu và hai con trỏ trỏ đến nút kế tiếp và nút tiền nhiệm, cho phép duyệt hai chiều linh hoạt.',
    $content$## 1. Đặt vấn đề & Khái niệm
Danh sách liên kết đôi (Doubly Linked List - DLL) là một biến thể của danh sách liên kết đơn, nơi mỗi nút (node) không chỉ lưu trữ giá trị và địa chỉ của nút tiếp theo (`next`), mà còn lưu trữ địa chỉ của nút trước đó (`prev`). Cấu trúc này cho phép duyệt danh sách theo cả hai chiều: tiến và lùi.

## 2. Các thao tác cơ bản (Core Operations)
- **Duyệt (Traversal):** Có thể bắt đầu từ đầu danh sách (head) đến cuối (tail) hoặc ngược lại.
- **Chèn (Insertion):** Thêm nút mới vào đầu, cuối hoặc sau một nút cho trước. Cần cập nhật cả con trỏ `next` và `prev` của các nút lân cận.
- **Xóa (Deletion):** Loại bỏ một nút bằng cách cập nhật lại liên kết của nút tiền nhiệm và nút kế tiếp.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Truy cập (Access) | O(n) | O(n) | O(1) |
| Tìm kiếm (Search) | O(n) | O(n) | O(1) |
| Chèn (Insertion) | O(1) | O(1) | O(1) |
| Xóa (Deletion) | O(1) | O(1) | O(1) |

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt cơ bản bằng Python:

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    def push(self, new_data):
        new_node = Node(new_data)
        new_node.next = self.head
        if self.head is not None:
            self.head.prev = new_node
        self.head = new_node
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên cập nhật con trỏ `prev` khi chèn/xóa, dẫn đến mất kết nối hoặc lỗi `NullPointerException` khi duyệt ngược.
- **Ứng dụng:** 
    - Triển khai bộ nhớ đệm (LRU Cache) nhờ khả năng xóa nút nhanh chóng.
    - Trình duyệt web (lịch sử duyệt web - nút Back/Forward).
    - Quản lý bộ nhớ (Dynamic Memory Allocation) trong hệ điều hành.
- **Lưu ý phỏng vấn:** Luôn kiểm tra các trường hợp biên (edge cases) như danh sách rỗng hoặc danh sách chỉ có một phần tử khi thực hiện thao tác xóa.$content$,
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
    '542d3d06-49ab-5ef5-af99-8fa94bc0336d',
    'Hàng đợi sử dụng Danh sách liên kết (Queue using Linked List)',
    'hang-doi-su-dung-danh-sach-lien-ket-queue-using-linked-list',
    'Linked List',
    'Hàng đợi (Queue) là cấu trúc dữ liệu tuyến tính tuân thủ nguyên tắc FIFO (First-In-First-Out), được hiện thực hóa bằng danh sách liên kết để tối ưu hóa việc cấp phát bộ nhớ động.',
    $content$## 1. Đặt vấn đề & Khái niệm
Hàng đợi (Queue) là cấu trúc dữ liệu hoạt động theo nguyên tắc **FIFO (First-In-First-Out)**: phần tử được thêm vào đầu tiên sẽ là phần tử được lấy ra đầu tiên. Khác với mảng (Array) có kích thước cố định, việc sử dụng danh sách liên kết (Linked List) cho phép hàng đợi có kích thước linh hoạt, chỉ bị giới hạn bởi bộ nhớ khả dụng.

Để quản lý hàng đợi, ta cần hai con trỏ:
- `front`: Trỏ đến nút đầu tiên (nơi thực hiện thao tác lấy dữ liệu).
- `rear`: Trỏ đến nút cuối cùng (nơi thực hiện thao tác thêm dữ liệu).

## 2. Các thao tác cơ bản (Core Operations)
- **Enqueue**: Thêm một phần tử vào cuối hàng đợi (`rear`). Nếu hàng đợi rỗng, cả `front` và `rear` đều trỏ đến nút mới.
- **Dequeue**: Loại bỏ phần tử ở đầu hàng đợi (`front`). Cập nhật `front` sang nút kế tiếp. Nếu sau khi xóa hàng đợi rỗng, cần cập nhật `rear` thành `null`.
- **isEmpty**: Kiểm tra xem hàng đợi có rỗng hay không bằng cách kiểm tra `front == null`.
- **getFront**: Trả về giá trị của nút tại `front` mà không loại bỏ nó.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Enqueue | O(1) | O(1) | O(1) |
| Dequeue | O(1) | O(1) | O(1) |
| isEmpty | O(1) | O(1) | O(1) |
| getFront | O(1) | O(1) | O(1) |

## 4. Cài đặt mẫu (Implementation)
Ví dụ cài đặt bằng ngôn ngữ Python:

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Queue:
    def __init__(self):
        self.front = self.rear = None

    def enqueue(self, item):
        new_node = Node(item)
        if self.rear is None:
            self.front = self.rear = new_node
            return
        self.rear.next = new_node
        self.rear = new_node

    def dequeue(self):
        if self.front is None:
            return None
        temp = self.front
        self.front = temp.next
        if self.front is None:
            self.rear = None
        return temp.data
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
  - Quên cập nhật con trỏ `rear` khi hàng đợi trở về trạng thái rỗng sau thao tác `dequeue`.
  - Không xử lý trường hợp `Underflow` (cố gắng lấy phần tử từ hàng đợi rỗng).
- **Ứng dụng:**
  - Quản lý tiến trình (Scheduling) trong hệ điều hành.
  - Xử lý yêu cầu trong các hệ thống phân tán (Message Queues).
  - Thuật toán duyệt đồ thị theo chiều rộng (BFS).$content$,
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
    'Đệ quy (Recursion) và Bài toán Giai thừa',
    'de-quy-recursion-va-bai-toan-giai-thua',
    'Recursion (Đệ quy)',
    'Đệ quy là kỹ thuật lập trình trong đó một hàm tự gọi chính nó để giải quyết các bài toán con nhỏ hơn, điển hình là bài toán tính giai thừa (n!).',
    $content$## 1. Đặt vấn đề & Khái niệm
Đệ quy (Recursion) là một phương pháp giải quyết bài toán bằng cách chia nhỏ bài toán lớn thành các bài toán con cùng loại. Một hàm đệ quy cần hai thành phần chính:
- **Điều kiện dừng (Base Case):** Điểm kết thúc để ngăn chặn việc gọi hàm vô hạn.
- **Bước đệ quy (Recursive Step):** Nơi hàm tự gọi chính nó với tham số tiến dần về điều kiện dừng.

Ví dụ: Giai thừa của n (n!) được định nghĩa là:
- n! = 1 nếu n = 0 hoặc n = 1
- n! = n * (n-1)! nếu n > 1

## 2. Các thao tác cơ bản (Core Operations)
- **Thiết lập trạng thái:** Truyền tham số vào hàm.
- **Kiểm tra điều kiện dừng:** Nếu thỏa mãn, trả về giá trị cơ sở.
- **Gọi đệ quy:** Thực hiện lời gọi hàm với giá trị đã thay đổi (thường là n-1).
- **Kết hợp kết quả:** Nhân hoặc cộng kết quả từ các lời gọi con để trả về kết quả cuối cùng.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tính giai thừa | O(n) | O(n) | O(n) |

*Lưu ý: Độ phức tạp không gian là O(n) do mỗi lời gọi hàm đều chiếm một khung ngăn xếp (stack frame) trong bộ nhớ.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt bằng ngôn ngữ C:

```c
#include <stdio.h>

// Hàm đệ quy tính giai thừa
long int factorial(int n) {
    // Điều kiện dừng
    if (n <= 1) return 1;
    // Bước đệ quy
    return n * factorial(n - 1);
}

int main() {
    int n = 6;
    printf("Giai thừa của %d là %ld", n, factorial(n));
    return 0;
}
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
  - Quên điều kiện dừng dẫn đến lỗi `Stack Overflow`.
  - Không thay đổi tham số đầu vào khiến hàm gọi vô tận.
- **Ứng dụng phỏng vấn:** 
  - Đệ quy thường được dùng trong các bài toán duyệt cây (Tree Traversal), đồ thị (DFS), hoặc các bài toán chia để trị (Divide and Conquer) như QuickSort, MergeSort.
  - Trong phỏng vấn, hãy luôn cân nhắc xem liệu giải pháp đệ quy có thể tối ưu bằng quy hoạch động (Dynamic Programming) để tránh tính toán lại các bài toán con hay không.$content$,
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
    '330c03a1-9222-582b-a543-2d6d308a3206',
    'Fibonacci Heap (Fibonacci Heap)',
    'fibonacci-heap',
    'Recursion (Đệ quy)',
    'Fibonacci Heap là một cấu trúc dữ liệu hàng đợi ưu tiên (priority queue) dựa trên tập hợp các cây, tối ưu hóa các thao tác như chèn, hợp nhất và giảm khóa thông qua kỹ thuật ''lazy consolidation''.',
    $content$## 1. Đặt vấn đề & Khái niệm
Fibonacci Heap là một cấu trúc dữ liệu nâng cao được thiết kế để tối ưu hóa các thao tác trên hàng đợi ưu tiên. Khác với Binary Heap hay Binomial Heap, Fibonacci Heap không yêu cầu cấu trúc cây nghiêm ngặt, cho phép các cây có hình dạng bất kỳ.

Đặc điểm chính:
- **Cấu trúc:** Là một tập hợp các cây tuân thủ tính chất min-heap (hoặc max-heap).
- **Lazy Consolidation:** Các thao tác như hợp nhất (merge) được thực hiện một cách "lười biếng" (trì hoãn việc hợp nhất các cây cho đến khi cần thiết), giúp giảm độ phức tạp thời gian.
- **Con trỏ Min:** Luôn duy trì một con trỏ tới nút có giá trị nhỏ nhất trong danh sách các gốc cây.

## 2. Các thao tác cơ bản (Core Operations)
- **Insert:** Thêm một nút mới như một cây đơn lẻ vào danh sách gốc. Độ phức tạp: O(1).
- **Merge:** Hợp nhất hai heap bằng cách nối danh sách các gốc của chúng lại với nhau. Độ phức tạp: O(1) (amortized).
- **Extract-Min:** Loại bỏ nút nhỏ nhất, sau đó hợp nhất các cây con của nó vào danh sách gốc và thực hiện gom nhóm (consolidate) để giảm số lượng cây. Độ phức tạp: O(log n).
- **Decrease-Key:** Giảm giá trị của một nút. Nếu vi phạm tính chất heap, nút đó sẽ được cắt (cut) và đưa lên danh sách gốc. Độ phức tạp: O(1) (amortized).

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average (Amortized) | Worst | Space |
| :--- | :--- | :--- | :--- |
| Find Min | Θ(1) | Θ(1) | O(n) |
| Insert | Θ(1) | Θ(1) | O(n) |
| Extract Min | O(log n) | O(n) | O(n) |
| Decrease Key | Θ(1) | Θ(n) | O(n) |
| Merge | Θ(1) | Θ(1) | O(n) |

## 4. Cài đặt mẫu (Implementation)
Cấu trúc nút cơ bản trong Python:

```python
class FibonacciHeapNode:
    def __init__(self, key):
        self.key = key
        self.degree = 0
        self.parent = None
        self.child = None
        self.left = self
        self.right = self
        self.mark = False

# Fibonacci Heap thường được quản lý thông qua một con trỏ 'min' 
# và danh sách liên kết đôi vòng tròn của các gốc cây.
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
  - Quên cập nhật con trỏ `min` sau khi thực hiện các thao tác thay đổi cấu trúc cây.
  - Hiểu sai về cơ chế `mark` (đánh dấu nút đã bị cắt một con) dẫn đến việc không duy trì được tính chất cây.
- **Ứng dụng:** 
  - Cải thiện độ phức tạp của thuật toán **Dijkstra** và **Prim** từ O(E log V) xuống O(E + V log V), cực kỳ hữu ích trong các bài toán đồ thị quy mô lớn.
- **Lưu ý thực tế:** Mặc dù có độ phức tạp lý thuyết tốt, Fibonacci Heap có hằng số ẩn lớn và cài đặt phức tạp, nên trong thực tế, Binary Heap thường được ưu tiên sử dụng hơn nếu không yêu cầu hiệu năng cực hạn.$content$,
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
    'Thuật toán Sắp xếp chèn (Insertion Sort)',
    'thuat-toan-sap-xep-chen-insertion-sort',
    'Sorting (Sắp xếp)',
    'Insertion Sort là thuật toán sắp xếp dựa trên việc chèn từng phần tử vào đúng vị trí trong một danh sách đã được sắp xếp, hoạt động hiệu quả với các tập dữ liệu nhỏ hoặc gần như đã có thứ tự.',
    $content$## 1. Đặt vấn đề & Khái niệm
Insertion Sort là thuật toán sắp xếp so sánh đơn giản, mô phỏng cách con người sắp xếp các quân bài trên tay. Thuật toán chia danh sách thành hai phần: phần đã sắp xếp và phần chưa sắp xếp. Ở mỗi bước, nó lấy một phần tử từ phần chưa sắp xếp và chèn vào vị trí thích hợp trong phần đã sắp xếp.

## 2. Các thao tác cơ bản (Core Operations)
1. Giả định phần tử đầu tiên (index 0) đã được sắp xếp.
2. Duyệt từ phần tử thứ hai đến cuối danh sách (biến `i`).
3. Lưu giá trị hiện tại vào biến `key`.
4. So sánh `key` với các phần tử đứng trước nó (trong phần đã sắp xếp).
5. Dịch chuyển các phần tử lớn hơn `key` sang phải một vị trí.
6. Chèn `key` vào vị trí trống vừa tạo ra.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Insertion Sort | O(n²) | O(n²) | O(1) |

*Lưu ý: Trong trường hợp tốt nhất (danh sách đã sắp xếp), độ phức tạp là O(n).*

## 4. Cài đặt mẫu (Implementation)
```python
def insertion_sort(arr):
    # Duyệt từ phần tử thứ 2
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # Dịch chuyển phần tử lớn hơn key sang phải
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        # Chèn key vào vị trí đúng
        arr[j + 1] = key
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Nhầm lẫn điều kiện dừng của vòng lặp `while` (quên kiểm tra `j >= 0` dẫn đến lỗi `IndexOutOfBounds`).
- **Ưu điểm:** Thuật toán ổn định (stable), tiết kiệm bộ nhớ (in-place), cực kỳ hiệu quả với dữ liệu nhỏ hoặc gần như đã sắp xếp.
- **Ứng dụng:** Thường được dùng làm thuật toán con trong các thuật toán lai (Hybrid Sorting) như Timsort (Python) hoặc Introsort (C++ STL) khi kích thước mảng con đủ nhỏ.
- **Phỏng vấn:** Người phỏng vấn thường hỏi về tính "thích nghi" (adaptive) của thuật toán này so với Bubble Sort hoặc Selection Sort.$content$,
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
    '34a37cea-e295-5916-b7bc-cf57f5fb58a5',
    'Sắp xếp trộn (Merge Sort)',
    'sap-xep-tron-merge-sort',
    'Sorting (Sắp xếp)',
    'Merge Sort là thuật toán sắp xếp dựa trên tư duy Chia để trị (Divide and Conquer), chia mảng thành các phần nhỏ, sắp xếp chúng và hợp nhất lại để đạt được độ phức tạp O(n log n) ổn định.',
    $content$## 1. Đặt vấn đề & Khái niệm
Merge Sort là một thuật toán sắp xếp hiệu quả, ổn định và dựa trên chiến lược **Chia để trị (Divide and Conquer)**. Thuật toán hoạt động bằng cách chia đệ quy mảng đầu vào thành hai nửa, sắp xếp từng nửa và cuối cùng hợp nhất (merge) chúng lại thành một mảng đã sắp xếp hoàn chỉnh.

## 2. Các thao tác cơ bản (Core Operations)
Thuật toán bao gồm ba bước chính:
- **Divide (Chia):** Chia mảng thành hai nửa bằng nhau cho đến khi mỗi mảng con chỉ còn một phần tử (trạng thái đã được sắp xếp).
- **Conquer (Trị):** Sắp xếp các mảng con một cách đệ quy.
- **Merge (Trộn):** Hợp nhất hai mảng con đã sắp xếp thành một mảng duy nhất theo thứ tự tăng dần.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
Merge Sort đảm bảo hiệu suất ổn định trong mọi trường hợp.

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Time Complexity | O(n log n) | O(n log n) | O(n) |

*Lưu ý: Độ phức tạp không gian là O(n) do cần mảng phụ để lưu trữ các phần tử trong quá trình trộn.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt bằng ngôn ngữ Python:

```python
def merge(arr, left, mid, right):
    L = arr[left:mid+1]
    R = arr[mid+1:right+1]
    i = j = 0
    k = left
    
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
    
    while i < len(L): arr[k] = L[i]; i += 1; k += 1
    while j < len(R): arr[k] = R[j]; j += 1; k += 1

def merge_sort(arr, left, right):
    if left < right:
        mid = (left + right) // 2
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)
        merge(arr, left, mid, right)
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên xử lý các phần tử còn dư trong mảng con khi độ dài hai mảng con không bằng nhau; cấp phát bộ nhớ dư thừa trong mỗi bước đệ quy.
- **Ứng dụng:** 
    - Sắp xếp các tập dữ liệu lớn (External Sorting).
    - Sắp xếp danh sách liên kết (Linked List) vì không yêu cầu truy cập ngẫu nhiên.
    - Ứng dụng trong các bài toán đếm nghịch thế (Inversion Counting).
    - Là nền tảng cho các thuật toán hiện đại như TimSort (sử dụng trong Python, Java, Swift).$content$,
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
    'Quick Sort là thuật toán sắp xếp dựa trên tư tưởng Chia để trị (Divide and Conquer), sử dụng phần tử chốt (pivot) để phân hoạch mảng thành các phần nhỏ hơn, giúp tối ưu hóa hiệu suất sắp xếp trên các tập dữ liệu lớn.',
    $content$## 1. Đặt vấn đề & Khái niệm
Quick Sort là một thuật toán sắp xếp hiệu quả, hoạt động dựa trên chiến lược **Chia để trị (Divide and Conquer)**. Thuật toán chọn một phần tử làm 'chốt' (pivot) và phân hoạch mảng sao cho các phần tử nhỏ hơn pivot nằm bên trái và các phần tử lớn hơn nằm bên phải. Sau đó, thuật toán đệ quy thực hiện lại quá trình này trên hai mảng con.

## 2. Các thao tác cơ bản (Core Operations)
Thuật toán bao gồm 3 bước chính:
1. **Chọn Pivot**: Chọn một phần tử từ mảng (đầu, cuối, ngẫu nhiên hoặc trung vị).
2. **Phân hoạch (Partitioning)**: Sắp xếp lại mảng sao cho các phần tử nhỏ hơn pivot đứng trước, các phần tử lớn hơn đứng sau. Vị trí của pivot sau bước này là vị trí cố định trong mảng đã sắp xếp.
3. **Đệ quy (Recursion)**: Gọi đệ quy cho mảng con bên trái và bên phải của pivot.

Các thuật toán phân hoạch phổ biến:
- **Lomuto Partition**: Đơn giản, dễ cài đặt, sử dụng một con trỏ để theo dõi các phần tử nhỏ hơn.
- **Hoare's Partition**: Hiệu quả hơn, sử dụng hai con trỏ di chuyển từ hai phía.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Time Complexity | O(n log n) | O(n²) | O(log n) |

*Lưu ý: Độ phức tạp không gian O(n) trong trường hợp xấu nhất do độ sâu của ngăn xếp đệ quy.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt sử dụng phương pháp **Lomuto Partition** (ngôn ngữ Python):

```python
def partition(arr, low, high):
    pivot = arr[high]  # Chọn phần tử cuối làm chốt
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp**:
    - Chọn pivot cố định (đầu hoặc cuối) trên mảng đã sắp xếp dẫn đến độ phức tạp O(n²).
    - Không xử lý đúng trường hợp mảng có các phần tử trùng lặp.
- **Ứng dụng**:
    - Sắp xếp dữ liệu lớn trong bộ nhớ (thư viện `std::sort` trong C++ thường dùng biến thể của Quick Sort).
    - Thuật toán **Quickselect** để tìm phần tử lớn thứ k.
    - Sử dụng trong các hệ thống cơ sở dữ liệu để tối ưu hóa tìm kiếm.$content$,
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
    '5b163d82-6a93-5fb6-affe-a0ab1dd79906',
    'Thuật toán sắp xếp thùng (Bucket Sort)',
    'thuat-toan-sap-xep-thung-bucket-sort',
    'Sorting (Sắp xếp)',
    'Bucket Sort là thuật toán sắp xếp phân phối, hoạt động bằng cách chia các phần tử vào các ''thùng'' (buckets) riêng biệt, sau đó sắp xếp từng thùng và gộp lại để tạo ra dãy đã sắp xếp.',
    $content$## 1. Đặt vấn đề & Khái niệm
Bucket Sort là một thuật toán sắp xếp không so sánh (non-comparison sort) dựa trên nguyên lý phân phối. Thay vì so sánh trực tiếp các phần tử, thuật toán chia tập dữ liệu thành các nhóm nhỏ (buckets) dựa trên giá trị của chúng. Mỗi thùng sau đó được sắp xếp độc lập bằng một thuật toán sắp xếp khác (thường là Insertion Sort hoặc QuickSort). Cuối cùng, các phần tử được thu thập từ các thùng theo thứ tự để tạo thành dãy kết quả.

## 2. Các thao tác cơ bản (Core Operations)
Quy trình thực hiện Bucket Sort bao gồm 3 bước chính:
1. **Scatter (Phân tán):** Tạo ra một số lượng thùng nhất định. Duyệt qua mảng đầu vào và đưa mỗi phần tử vào thùng tương ứng dựa trên giá trị của nó.
2. **Sort (Sắp xếp):** Sắp xếp từng thùng riêng lẻ. Nếu số lượng phần tử trong mỗi thùng nhỏ, các thuật toán như Insertion Sort rất hiệu quả.
3. **Gather (Thu thập):** Duyệt qua các thùng theo thứ tự và nối các phần tử lại để tạo thành mảng đã sắp xếp hoàn chỉnh.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
Độ phức tạp của Bucket Sort phụ thuộc rất lớn vào sự phân bổ của dữ liệu đầu vào.

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Time Complexity | O(n + k) | O(n²) | O(n + k) |

*Trong đó n là số phần tử, k là số lượng thùng.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt minh họa bằng Python:

```python
def bucket_sort(arr):
    # 1. Tạo các thùng trống
    bucket = [[] for _ in range(len(arr))]
    
    # 2. Phân tán phần tử vào thùng
    for j in arr:
        index_b = int(len(arr) * j)
        bucket[index_b].append(j)
    
    # 3. Sắp xếp từng thùng và gộp lại
    sorted_array = []
    for i in range(len(arr)):
        bucket[i].sort() # Sử dụng Timsort có sẵn
        sorted_array.extend(bucket[i])
        
    return sorted_array

# Ví dụ sử dụng
data = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51]
print(bucket_sort(data))
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
    - Chọn sai số lượng thùng: Nếu số lượng thùng quá ít, thuật toán sẽ suy biến thành thuật toán sắp xếp thông thường. Nếu quá nhiều, gây lãng phí bộ nhớ.
    - Dữ liệu không phân bổ đều: Nếu tất cả phần tử rơi vào một thùng, độ phức tạp sẽ trở thành O(n²) do thuật toán sắp xếp bên trong thùng đó.
- **Ứng dụng:** 
    - Rất hiệu quả khi dữ liệu đầu vào được phân bổ đều (uniformly distributed) trên một khoảng giá trị (ví dụ: số thực từ 0 đến 1).
    - Thường được dùng trong các bài toán xử lý dữ liệu lớn hoặc làm tiền đề cho các thuật toán sắp xếp phức tạp hơn.$content$,
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
    'Tìm kiếm tuyến tính (Linear Search)',
    'tim-kiem-tuyen-tinh-linear-search',
    'Binary search',
    'Tìm kiếm tuyến tính là thuật toán tìm kiếm cơ bản nhất bằng cách duyệt tuần tự qua từng phần tử của danh sách cho đến khi tìm thấy mục tiêu hoặc kết thúc tập dữ liệu.',
    $content$## 1. Đặt vấn đề & Khái niệm
Tìm kiếm tuyến tính (Linear Search), hay còn gọi là tìm kiếm tuần tự (Sequential Search), là thuật toán tìm kiếm đơn giản nhất. Bài toán đặt ra là: Cho một mảng `arr` gồm `n` phần tử và một giá trị `x`, hãy xác định vị trí (index) của `x` trong mảng. Nếu `x` không tồn tại, trả về -1.

## 2. Các thao tác cơ bản (Core Operations)
Thuật toán hoạt động theo quy trình sau:
1. Bắt đầu từ phần tử đầu tiên của mảng.
2. So sánh phần tử hiện tại với giá trị `x` cần tìm.
3. Nếu bằng nhau, trả về chỉ số (index) của phần tử đó.
4. Nếu không bằng, di chuyển sang phần tử kế tiếp.
5. Lặp lại cho đến khi duyệt hết mảng. Nếu không tìm thấy, trả về -1.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tìm kiếm | O(N) | O(N) | O(1) |

- **Best Case (O(1)):** Phần tử cần tìm nằm ngay ở vị trí đầu tiên.
- **Worst Case (O(N)):** Phần tử cần tìm nằm ở cuối mảng hoặc không tồn tại trong mảng.
- **Space Complexity:** O(1) vì thuật toán không sử dụng thêm cấu trúc dữ liệu phụ.

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt bằng ngôn ngữ Python:

```python
def linear_search(arr, x):
    # Duyệt qua từng phần tử trong mảng
    for i in range(len(arr)):
        # Nếu tìm thấy giá trị khớp với x, trả về index
        if arr[i] == x:
            return i
    # Nếu duyệt hết mà không thấy, trả về -1
    return -1

# Ví dụ sử dụng
arr = [10, 8, 30, 4, 5]
x = 5
print(f"Index của {x} là: {linear_search(arr, x)}")
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)

**Lỗi thường gặp:**
- **Sai lệch chỉ số (Off-by-one error):** Quên kiểm tra phần tử cuối cùng hoặc bắt đầu vòng lặp sai vị trí.
- **Kiểu dữ liệu:** Không xử lý trường hợp mảng rỗng (empty array) dẫn đến lỗi truy cập bộ nhớ.

**Ứng dụng:**
- **Dữ liệu chưa sắp xếp:** Là lựa chọn duy nhất khi mảng không có thứ tự.
- **Tập dữ liệu nhỏ:** Với N nhỏ, chi phí cài đặt các thuật toán phức tạp (như Binary Search) là không cần thiết.
- **Cấu trúc dữ liệu liên kết:** Thường dùng trong Linked List vì không thể truy cập ngẫu nhiên (random access) như mảng.
- **Phỏng vấn:** Thường được dùng làm bước đệm để so sánh hiệu năng với các thuật toán tìm kiếm tối ưu hơn như Binary Search.$content$,
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
    'Tìm kiếm nhị phân là thuật toán tìm kiếm hiệu quả trên tập dữ liệu đã sắp xếp bằng cách chia đôi không gian tìm kiếm, giúp đạt độ phức tạp thời gian O(log N).',
    $content$## 1. Đặt vấn đề & Khái niệm
Tìm kiếm nhị phân (Binary Search) là thuật toán tìm kiếm tối ưu cho các tập dữ liệu đã được sắp xếp (sorted) hoặc có tính đơn điệu. Thay vì duyệt tuần tự từng phần tử (O(N)), thuật toán liên tục chia đôi không gian tìm kiếm, giúp thu hẹp phạm vi cần kiểm tra một cách nhanh chóng.

**Điều kiện áp dụng:**
- Dữ liệu phải được sắp xếp theo thứ tự (tăng dần hoặc giảm dần).
- Cấu trúc dữ liệu phải hỗ trợ truy cập ngẫu nhiên (random access) trong thời gian O(1) (ví dụ: mảng).

## 2. Các thao tác cơ bản (Core Operations)
Thuật toán hoạt động dựa trên ba biến con trỏ: `low` (đầu), `high` (cuối), và `mid` (giữa).
1. Tính chỉ số giữa: `mid = low + (high - low) / 2`.
2. So sánh giá trị tại `arr[mid]` với giá trị cần tìm (`target`):
   - Nếu `arr[mid] == target`: Tìm thấy, trả về chỉ số `mid`.
   - Nếu `arr[mid] < target`: Loại bỏ nửa bên trái, cập nhật `low = mid + 1`.
   - Nếu `arr[mid] > target`: Loại bỏ nửa bên phải, cập nhật `high = mid - 1`.
3. Lặp lại cho đến khi `low > high` (không tìm thấy).

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tìm kiếm | O(log N) | O(log N) | O(1) (Iterative) |

*Lưu ý: Nếu sử dụng đệ quy, không gian bộ nhớ phụ (Auxiliary Space) sẽ là O(log N) do stack gọi hàm.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt mẫu bằng ngôn ngữ Python (phiên bản lặp):

```python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        # Kiểm tra nếu target nằm ở giữa
        if arr[mid] == target:
            return mid
        # Nếu target lớn hơn, tìm ở nửa bên phải
        elif arr[mid] < target:
            low = mid + 1
        # Nếu target nhỏ hơn, tìm ở nửa bên trái
        else:
            high = mid - 1
            
    return -1 # Không tìm thấy
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)

**Lỗi thường gặp:**
- **Tràn số (Integer Overflow):** Sử dụng `(low + high) / 2` có thể gây tràn số khi `low` và `high` quá lớn. Nên dùng `low + (high - low) / 2`.
- **Điều kiện dừng:** Nhầm lẫn giữa `low < high` và `low <= high`, dẫn đến bỏ sót phần tử cuối cùng.

**Ứng dụng thực tế:**
- **Database Indexing:** Cơ sở dữ liệu sử dụng B-Trees để truy vấn nhanh.
- **Debugging:** `git bisect` sử dụng tìm kiếm nhị phân để tìm commit gây lỗi.
- **Competitive Programming:** Giải các bài toán tối ưu hóa trên không gian đáp án (Binary Search on Answer).
- **Hệ thống mạng:** Tìm kiếm bảng định tuyến (routing tables) dựa trên dải địa chỉ IP.$content$,
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
    'Cấu trúc dữ liệu Cây nhị phân (Binary Tree)',
    'cau-truc-du-lieu-cay-nhi-phan-binary-tree',
    'Trees',
    'Cây nhị phân là cấu trúc dữ liệu phân cấp trong đó mỗi nút có tối đa hai nút con, đóng vai trò nền tảng cho nhiều cấu trúc dữ liệu nâng cao như BST, Heap và các thuật toán tìm kiếm.',
    $content$## 1. Đặt vấn đề & Khái niệm
Cây nhị phân (Binary Tree) là một cấu trúc dữ liệu phi tuyến tính, được tổ chức theo dạng phân cấp. Mỗi phần tử trong cây được gọi là một **nút (node)**. Một nút bao gồm giá trị và hai con trỏ (hoặc tham chiếu) đến nút con trái và nút con phải.

- **Nút gốc (Root):** Nút ở cấp cao nhất của cây.
- **Nút lá (Leaf):** Nút không có nút con.
- **Đặc điểm:** Mỗi nút có tối đa 2 con (trái và phải).

## 2. Các thao tác cơ bản (Core Operations)
Các thao tác trên cây nhị phân thường dựa trên kỹ thuật đệ quy hoặc duyệt cây:
- **Duyệt cây (Traversal):**
  - *Inorder (L-N-R):* Duyệt cây con trái, thăm nút gốc, duyệt cây con phải.
  - *Preorder (N-L-R):* Thăm nút gốc, duyệt cây con trái, duyệt cây con phải.
  - *Postorder (L-R-N):* Duyệt cây con trái, duyệt cây con phải, thăm nút gốc.
  - *Level Order:* Duyệt theo từng tầng từ trên xuống dưới, từ trái sang phải.
- **Thao tác khác:** Tìm kiếm, chèn, xóa nút, tính chiều cao (height) và kích thước (size) của cây.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tìm kiếm | O(log n) | O(n) | O(h) |
| Chèn | O(log n) | O(n) | O(h) |
| Xóa | O(log n) | O(n) | O(h) |

*Lưu ý: h là chiều cao của cây.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt cơ bản bằng Python:

```python
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

# Khởi tạo cây đơn giản
root = Node(1)
root.left = Node(2)
root.right = Node(3)
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:**
  - Quên xử lý trường hợp cây rỗng (null pointer exception).
  - Sử dụng đệ quy quá sâu dẫn đến lỗi tràn bộ nhớ (Stack Overflow).
  - Nhầm lẫn giữa cây nhị phân tổng quát và cây tìm kiếm nhị phân (BST).

- **Ứng dụng phỏng vấn:**
  - Cây nhị phân là nền tảng cho các bài toán về đồ thị, tìm kiếm đường đi (LCA - Lowest Common Ancestor).
  - Được sử dụng trong các hệ thống phân cấp, cấu trúc thư mục, và các thuật toán nén dữ liệu (Huffman Coding).$content$,
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
    '71c0d199-37ac-55f7-ba44-7e76a136ff51',
    'Cây tìm kiếm nhị phân (Binary Search Tree - BST)',
    'cay-tim-kiem-nhi-phan-binary-search-tree',
    'Trees',
    'Cây tìm kiếm nhị phân là cấu trúc dữ liệu cây phân cấp cho phép tìm kiếm, chèn và xóa dữ liệu hiệu quả bằng cách duy trì thứ tự khóa trên các nút con.',
    $content$## 1. Đặt vấn đề & Khái niệm
Cây tìm kiếm nhị phân (BST) là một cấu trúc dữ liệu cây nhị phân đặc biệt, nơi mỗi nút tuân thủ các quy tắc sau:
- Mọi nút trong cây con bên trái có giá trị **nhỏ hơn hoặc bằng** giá trị của nút cha.
- Mọi nút trong cây con bên phải có giá trị **lớn hơn hoặc bằng** giá trị của nút cha.

Cấu trúc này giúp tối ưu hóa việc tìm kiếm dữ liệu so với mảng hoặc danh sách liên kết.

## 2. Các thao tác cơ bản (Core Operations)
- **Tìm kiếm (Search):** Bắt đầu từ gốc, so sánh giá trị cần tìm với nút hiện tại. Nếu nhỏ hơn thì rẽ trái, nếu lớn hơn thì rẽ phải.
- **Chèn (Insert):** Tìm vị trí lá thích hợp theo quy tắc BST và thêm nút mới vào đó.
- **Duyệt cây (Traversal):**
  - *In-order (L-N-R):* Trả về các giá trị theo thứ tự tăng dần.
  - *Pre-order (N-L-R):* Hữu ích cho việc sao chép cây.
  - *Post-order (L-R-N):* Hữu ích cho việc xóa cây hoặc tính toán biểu thức.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Trung bình (Average) | Tệ nhất (Worst) | Không gian (Space) |
| :--- | :--- | :--- | :--- |
| Tìm kiếm | O(log n) | O(n) | O(1) |
| Chèn | O(log n) | O(n) | O(1) |
| Xóa | O(log n) | O(n) | O(1) |

*Lưu ý: Trường hợp tệ nhất xảy ra khi cây bị suy biến thành danh sách liên kết (cây lệch).* 

## 4. Cài đặt mẫu (Implementation)
Ví dụ cài đặt cấu trúc nút và thao tác chèn bằng Python:

```python
class Node:
    def __init__(self, data):
        self.left = None
        self.right = None
        self.data = data

def insert(root, data):
    if root is None:
        return Node(data)
    if data < root.data:
        root.left = insert(root.left, data)
    else:
        root.right = insert(root.right, data)
    return root
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên xử lý trường hợp cây rỗng hoặc không cân bằng cây (dẫn đến độ phức tạp O(n)).
- **Ứng dụng:** 
  - Triển khai các tập hợp (Set) và bản đồ (Map) trong thư viện chuẩn.
  - Hệ thống quản lý cơ sở dữ liệu cần truy vấn phạm vi (Range Queries).
  - Phỏng vấn: Thường yêu cầu chuyển đổi mảng đã sắp xếp thành BST cân bằng hoặc kiểm tra xem một cây có phải là BST hợp lệ hay không.$content$,
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
    'Xóa một nút trong BST là quá trình loại bỏ phần tử mục tiêu trong khi vẫn bảo toàn tính chất cây tìm kiếm nhị phân, đòi hỏi xử lý các trường hợp cấu trúc cây khác nhau.',
    $content$## 1. Đặt vấn đề & Khái niệm
Việc xóa một nút trong Cây tìm kiếm nhị phân (BST) không đơn giản như xóa trong danh sách liên kết vì ta phải đảm bảo sau khi xóa, cây vẫn thỏa mãn tính chất: mọi nút bên trái đều nhỏ hơn nút gốc và mọi nút bên phải đều lớn hơn nút gốc.

## 2. Các thao tác cơ bản (Core Operations)
Có ba trường hợp cần xử lý khi xóa một nút có giá trị `x`:

1. **Nút là lá (Leaf Node):** Xóa trực tiếp nút đó khỏi cây.
2. **Nút có một con (One Child):** Thay thế nút cần xóa bằng nút con duy nhất của nó.
3. **Nút có hai con (Two Children):** 
   - Tìm nút kế tiếp (inorder successor - giá trị nhỏ nhất trong cây con bên phải) hoặc nút tiền nhiệm (inorder predecessor - giá trị lớn nhất trong cây con bên trái).
   - Sao chép giá trị của nút tìm được vào nút cần xóa.
   - Xóa nút kế tiếp/tiền nhiệm đó (trường hợp này sẽ trở về Case 1 hoặc Case 2).

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Xóa (Deletion) | O(h) | O(n) | O(h) |

*Trong đó `h` là chiều cao của cây, `n` là số lượng nút.*

## 4. Cài đặt mẫu (Implementation)

```python
def delNode(root, x):
    if root is None: return root

    if root.data > x:
        root.left = delNode(root.left, x)
    elif root.data < x:
        root.right = delNode(root.right, x)
    else:
        # Trường hợp 1 & 2: 0 hoặc 1 con
        if root.left is None: return root.right
        if root.right is None: return root.left

        # Trường hợp 3: 2 con
        # Tìm successor (nhỏ nhất bên phải)
        succ = getSuccessor(root)
        root.data = succ.data
        root.right = delNode(root.right, succ.data)
    return root
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên cập nhật con trỏ của nút cha sau khi xóa nút con, hoặc không xử lý đúng trường hợp nút có 2 con dẫn đến mất mát dữ liệu trong cây con.
- **Ứng dụng phỏng vấn:** Đây là bài toán kinh điển để kiểm tra tư duy đệ quy và khả năng thao tác với cấu trúc dữ liệu cây. Nó thường xuất hiện trong các bài toán quản lý tập hợp dữ liệu động cần tìm kiếm và xóa nhanh.$content$,
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
    'e727d4cb-7905-56f7-9651-ef18ff94360f',
    'Duyệt cây (Tree Traversal)',
    'duyet-cay-tree-traversal',
    'Trees',
    'Duyệt cây là quá trình truy cập mỗi nút trong cấu trúc cây đúng một lần theo một thứ tự xác định, đóng vai trò nền tảng trong việc xử lý dữ liệu phân cấp và biểu thức toán học.',
    $content$## 1. Đặt vấn đề & Khái niệm
Khác với các cấu trúc dữ liệu tuyến tính (mảng, danh sách liên kết), cây là cấu trúc phi tuyến tính với nhiều phương thức duyệt khác nhau. Có hai nhóm chính:
- **Depth-First Traversal (DFT):** Duyệt sâu, ưu tiên đi xa nhất có thể theo một nhánh trước khi quay lui. Bao gồm: Inorder, Preorder, Postorder.
- **Breadth-First Traversal (BFT):** Duyệt rộng (Level Order), duyệt theo từng tầng từ trên xuống dưới.

## 2. Các thao tác cơ bản (Core Operations)
- **Inorder (Left -> Root -> Right):** Trong cây nhị phân tìm kiếm (BST), phương pháp này cho kết quả các nút theo thứ tự tăng dần.
- **Preorder (Root -> Left -> Right):** Thường dùng để sao chép cây hoặc tạo biểu thức tiền tố (prefix).
- **Postorder (Left -> Right -> Root):** Thường dùng để xóa cây hoặc giải phóng bộ nhớ (garbage collection).
- **Level Order:** Sử dụng hàng đợi (Queue) để duyệt từng tầng, hữu ích trong việc tính toán chiều rộng cây hoặc tìm kiếm theo tầng.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Duyệt cây | O(n) | O(n) | O(h) |
*Trong đó n là số nút, h là chiều cao của cây.*

## 4. Cài đặt mẫu (Implementation)
Ví dụ minh họa thuật toán Inorder sử dụng Python:
```python
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def inorder(root):
    if root:
        inorder(root.left)      # Duyệt trái
        print(root.val, end=' ') # Thăm gốc
        inorder(root.right)     # Duyệt phải
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên điều kiện dừng (base case) trong đệ quy dẫn đến lỗi Stack Overflow; nhầm lẫn thứ tự thăm nút gốc trong các loại duyệt.
- **Ứng dụng phỏng vấn:** 
    - Sử dụng Inorder để kiểm tra tính chất BST.
    - Sử dụng Postorder để tính toán giá trị biểu thức hậu tố (postfix) hoặc xóa cây.
    - Sử dụng Level Order để tìm đường đi ngắn nhất trong đồ thị không trọng số hoặc xử lý các bài toán về tầng của cây.$content$,
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
    'Duyệt cây theo tầng (Level Order Traversal)',
    'duyet-cay-theo-tang-level-order-traversal',
    'Trees',
    'Duyệt cây theo tầng là kỹ thuật duyệt cây nhị phân theo chiều rộng (BFS), trong đó các nút được thăm lần lượt theo từng cấp độ từ gốc đến lá. Đây là nền tảng quan trọng để giải quyết các bài toán liên quan đến cấu trúc phân cấp và tìm kiếm đường đi ngắn nhất trong đồ thị.',
    $content$## 1. Đặt vấn đề & Khái niệm
Duyệt cây theo tầng (Level Order Traversal) là phương pháp duyệt cây nhị phân sao cho tất cả các nút ở cùng một cấp độ (level) được duyệt hoàn toàn trước khi chuyển sang cấp độ tiếp theo. Kỹ thuật này tương đương với thuật toán Tìm kiếm theo chiều rộng (Breadth-First Search - BFS) trên đồ thị.

## 2. Các thao tác cơ bản (Core Operations)
Có hai cách tiếp cận chính để thực hiện duyệt cây theo tầng:
- **Cách tiếp cận đệ quy (Recursive):** Sử dụng một hàm đệ quy truyền vào chỉ số cấp độ hiện tại. Nếu danh sách kết quả chưa có cấp độ đó, ta khởi tạo một danh sách mới và thêm giá trị nút vào.
- **Cách tiếp cận lặp (Iterative - Khuyên dùng):** Sử dụng một hàng đợi (Queue) để lưu trữ các nút. Tại mỗi bước, ta lấy số lượng nút hiện có trong hàng đợi (tương ứng với số nút của một tầng), sau đó duyệt qua từng nút, thêm giá trị vào kết quả và đẩy các nút con (trái/phải) vào hàng đợi cho tầng tiếp theo.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Duyệt cây | O(n) | O(n) | O(n) |

*Giải thích:* Mỗi nút được thăm đúng một lần, do đó độ phức tạp thời gian là O(n). Độ phức tạp không gian là O(n) do cần lưu trữ các nút trong hàng đợi hoặc danh sách kết quả.

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt sử dụng hàng đợi (Queue) trong Python:

```python
from collections import deque

def levelOrder(root):
    if not root: return []
    
    queue = deque([root])
    result = []
    
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.data)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(current_level)
    return result
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên kiểm tra nút con khác `null` trước khi thêm vào hàng đợi, dẫn đến lỗi `NullPointerException` hoặc tương đương. Ngoài ra, việc không xử lý đúng số lượng nút trong một tầng (sử dụng `len(queue)` trước vòng lặp) sẽ làm mất cấu trúc phân tầng.
- **Ứng dụng phỏng vấn:** 
    - Tìm chiều cao của cây.
    - Kiểm tra tính đầy đủ hoặc cân bằng của cây.
    - Tìm nút có giá trị lớn nhất/nhỏ nhất tại mỗi tầng.
    - Ứng dụng trong các hệ thống phân cấp (như sơ đồ tổ chức) hoặc duyệt đồ thị không trọng số.$content$,
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
    '2db9bc08-4fb2-54dc-b76e-353b84951346',
    'Cây AVL (AVL Tree)',
    'cay-avl-avl-tree',
    'Trees',
    'Cây AVL là một dạng cây tìm kiếm nhị phân tự cân bằng, đảm bảo chiều cao cây luôn ở mức tối ưu O(log n) để tăng tốc độ truy vấn dữ liệu.',
    $content$## 1. Đặt vấn đề & Khái niệm
Cây tìm kiếm nhị phân (BST) thông thường có thể bị suy biến thành danh sách liên kết trong trường hợp xấu nhất, dẫn đến độ phức tạp O(n). Cây AVL (đặt tên theo Georgy Adelson-Velsky và Landis) giải quyết vấn đề này bằng cách duy trì tính cân bằng thông qua **Hệ số cân bằng (Balance Factor)**.

- **Hệ số cân bằng**: Là hiệu số giữa chiều cao của cây con bên trái và cây con bên phải của một nút.
- **Điều kiện**: Một cây là AVL khi hệ số cân bằng của mọi nút chỉ có thể là -1, 0, hoặc 1.

## 2. Các thao tác cơ bản (Core Operations)
Để duy trì tính cân bằng sau khi thêm hoặc xóa nút, cây AVL sử dụng các phép xoay (Rotation):
- **Xoay trái (Left Rotate)**: Dùng khi cây bị lệch phải.
- **Xoay phải (Right Rotate)**: Dùng khi cây bị lệch trái.
- **Xoay kép (Left-Right & Right-Left Rotate)**: Kết hợp xoay trái và phải để xử lý các trường hợp lệch phức tạp (zigzag).

## 3. Đánh giá độ phức tạp (Big-O Complexity)
| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tìm kiếm (Search) | O(log n) | O(log n) | O(1) |
| Chèn (Insert) | O(log n) | O(log n) | O(1) |
| Xóa (Delete) | O(log n) | O(log n) | O(1) |

## 4. Cài đặt mẫu (Implementation)
Ví dụ minh họa cấu trúc nút và hàm xoay trong Python:

```python
class TreeNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

def rightRotate(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = 1 + max(getHeight(y.left), getHeight(y.right))
    x.height = 1 + max(getHeight(x.left), getHeight(x.right))
    return x
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp**: Quên cập nhật lại chiều cao (height) của các nút sau khi thực hiện xoay, dẫn đến tính toán hệ số cân bằng sai.
- **Ứng dụng**: 
    - Hệ thống quản trị cơ sở dữ liệu (Database Indexing) nơi cần tìm kiếm nhanh.
    - Các ứng dụng yêu cầu tra cứu dữ liệu với tần suất cao và dữ liệu thay đổi liên tục.
- **Phỏng vấn**: Người phỏng vấn thường yêu cầu bạn giải thích tại sao AVL lại tốt hơn BST thông thường và cách xác định loại xoay dựa trên hệ số cân bằng của nút con.$content$,
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
    'Thuật toán Quay lui (Backtracking)',
    'thuat-toan-quay-lui-backtracking',
    'Backtracking',
    'Quay lui là kỹ thuật giải quyết vấn đề bằng cách thử nghiệm các lựa chọn một cách đệ quy và loại bỏ các nhánh không dẫn đến lời giải (dead end) để tối ưu hóa không gian tìm kiếm.',
    $content$## 1. Đặt vấn đề & Khái niệm
Quay lui (Backtracking) là một kỹ thuật thuật toán dựa trên đệ quy, dùng để tìm kiếm lời giải cho các bài toán bằng cách xây dựng dần dần các thành phần của lời giải. Khi một nhánh tìm kiếm dẫn đến một trạng thái không hợp lệ (dead end), thuật toán sẽ "quay lui" về bước trước đó để thử một lựa chọn khác.

Đây là phương pháp vét cạn thông minh, thường được áp dụng cho các bài toán tổ hợp, hoán vị, hoặc tìm đường đi trong không gian trạng thái.

## 2. Các thao tác cơ bản (Core Operations)
Một thuật toán quay lui điển hình bao gồm 3 bước chính:
1. **Chọn (Choose):** Chọn một giá trị hoặc hướng đi khả thi cho bước hiện tại.
2. **Khám phá (Explore):** Gọi đệ quy để tiếp tục tìm kiếm lời giải dựa trên lựa chọn vừa thực hiện.
3. **Quay lui (Un-choose/Backtrack):** Nếu lựa chọn không dẫn đến kết quả, ta hoàn tác (reset) trạng thái để thử lựa chọn tiếp theo.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
Độ phức tạp của quay lui thường phụ thuộc vào không gian trạng thái của bài toán.

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tìm kiếm lời giải | O(b^d) | O(b^d) | O(d) |

*Trong đó: b là hệ số phân nhánh (branching factor), d là độ sâu của cây tìm kiếm.*

## 4. Cài đặt mẫu (Implementation)
Ví dụ minh họa cấu trúc tổng quát của thuật toán quay lui (Python):

```python
def backtrack(candidate):
    if is_solution(candidate):
        output(candidate)
        return

    for next_choice in get_candidates(candidate):
        if is_valid(next_choice):
            # 1. Chọn
            add_to_solution(next_choice)
            # 2. Khám phá
            backtrack(next_choice)
            # 3. Quay lui (Undo)
            remove_from_solution(next_choice)
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
### Lỗi thường gặp:
- **Quên hoàn tác (Undo):** Không khôi phục trạng thái sau khi gọi đệ quy dẫn đến sai lệch dữ liệu ở các nhánh khác.
- **Điều kiện dừng sai:** Không kiểm soát được độ sâu hoặc điều kiện biên, dẫn đến tràn bộ nhớ (Stack Overflow).
- **Thiếu tối ưu hóa:** Không sử dụng kỹ thuật "Cắt tỉa" (Pruning) khiến thuật toán chạy quá chậm với các bài toán lớn.

### Ứng dụng phỏng vấn:
- Giải các bài toán đố: Sudoku, N-Queens, Knight's Tour.
- Bài toán tổ hợp: Tìm tập con (Subset Sum), hoán vị (Permutations).
- Tìm đường đi: Rat in a Maze, tìm đường đi ngắn nhất trong đồ thị có ràng buộc.$content$,
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
    'bdcb0fbc-4377-5497-af86-58479da54bcb',
    'Bài toán N-Hậu (N-Queens Problem)',
    'bai-toan-n-hau-n-queens-problem',
    'Backtracking',
    'Bài toán N-Hậu là một bài toán kinh điển trong khoa học máy tính, yêu cầu đặt N quân hậu trên bàn cờ N×N sao cho không có hai quân hậu nào tấn công lẫn nhau, thường được giải quyết hiệu quả bằng kỹ thuật Quay lui (Backtracking).',
    $content$## 1. Đặt vấn đề & Khái niệm
Bài toán N-Hậu yêu cầu đặt N quân hậu trên bàn cờ kích thước N×N sao cho không có hai quân hậu nào nằm trên cùng một hàng, cùng một cột hoặc cùng một đường chéo. Đây là bài toán tối ưu hóa tổ hợp điển hình, nơi chúng ta cần tìm kiếm tất cả các cấu hình hợp lệ.

## 2. Các thao tác cơ bản (Core Operations)
- **Kiểm tra tính an toàn (isSafe):** Xác định xem vị trí (row, col) có bị tấn công bởi các quân hậu đã đặt trước đó hay không.
- **Quay lui (Backtracking):** Thử đặt quân hậu vào từng cột của hàng hiện tại. Nếu vị trí hợp lệ, tiếp tục đệ quy sang hàng tiếp theo. Nếu không tìm được vị trí hợp lệ, thực hiện "quay lui" (xóa quân hậu vừa đặt) để thử vị trí khác.
- **Tối ưu hóa (Hashing/Bitmasking):** Sử dụng các mảng đánh dấu (hashing) hoặc thao tác bit (bit-masking) để kiểm tra nhanh trạng thái của các cột và đường chéo trong O(1) thay vì duyệt lại bàn cờ.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Tìm kiếm lời giải | O(N!) | O(N!) | O(N) |

*Lưu ý: Độ phức tạp O(N!) xuất phát từ việc số lượng lựa chọn giảm dần sau mỗi hàng được đặt thành công.*

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cách tiếp cận tối ưu bằng Hashing (Python):

```python
def solve_n_queens(n):
    cols, diag1, diag2 = [0]*n, [0]*(2*n), [0]*(2*n)
    res, board = [], []

    def backtrack(row):
        if row == n:
            res.append(list(board))
            return
        for col in range(n):
            if not (cols[col] or diag1[row + col] or diag2[row - col + n]):
                cols[col] = diag1[row + col] = diag2[row - col + n] = 1
                board.append(col + 1)
                backtrack(row + 1)
                board.pop()
                cols[col] = diag1[row + col] = diag2[row - col + n] = 0
    backtrack(0)
    return res
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
    - Quên khôi phục trạng thái (backtrack) sau khi đệ quy, dẫn đến kết quả sai.
    - Tính toán sai chỉ số đường chéo (công thức `row + col` và `row - col + n` là chìa khóa).
- **Ứng dụng phỏng vấn:** 
    - Kiểm tra tư duy đệ quy và khả năng tối ưu hóa thuật toán.
    - Thường xuất hiện trong các bài toán về tìm kiếm không gian trạng thái (State Space Search) và thiết kế hệ thống yêu cầu ràng buộc chặt chẽ.$content$,
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
    '87a8bb5a-1692-5448-9957-ede3fb0a76d3',
    'Cấu trúc dữ liệu Heap (Heap Data Structure)',
    'cau-truc-du-lieu-heap',
    'Heap / Priority Queue',
    'Heap là một cây nhị phân hoàn chỉnh tuân thủ tính chất Heap, được sử dụng tối ưu để triển khai hàng đợi ưu tiên (Priority Queue) và các thuật toán sắp xếp.',
    $content$## 1. Đặt vấn đề & Khái niệm
Heap là một cấu trúc dữ liệu cây nhị phân hoàn chỉnh (complete binary tree) thỏa mãn tính chất Heap:
- **Min-Heap**: Giá trị của nút cha luôn nhỏ hơn hoặc bằng giá trị của các nút con. Nút gốc chứa giá trị nhỏ nhất.
- **Max-Heap**: Giá trị của nút cha luôn lớn hơn hoặc bằng giá trị của các nút con. Nút gốc chứa giá trị lớn nhất.

Cấu trúc này thường được biểu diễn dưới dạng mảng, trong đó với một nút tại chỉ số `i`, nút con trái nằm ở `2i + 1` và nút con phải nằm ở `2i + 2`.

## 2. Các thao tác cơ bản (Core Operations)
- **Insert**: Thêm phần tử vào vị trí cuối cùng của cây, sau đó thực hiện thao tác `Heapify Up` (sift-up) để khôi phục tính chất Heap.
- **Extract Min/Max**: Loại bỏ nút gốc, thay thế bằng phần tử cuối cùng, sau đó thực hiện `Heapify Down` (sift-down) để duy trì tính chất Heap.
- **Peek**: Truy xuất giá trị tại nút gốc (O(1)).

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Find Min/Max | O(1) | O(1) | O(1) |
| Insert | O(log n) | O(log n) | O(1) |
| Extract Min/Max | O(log n) | O(log n) | O(1) |
| Build Heap | O(n) | O(n) | O(n) |

## 4. Cài đặt mẫu (Implementation)
Ví dụ sử dụng thư viện `heapq` trong Python để triển khai Min-Heap:

```python
import heapq

# Khởi tạo heap
min_heap = []

# Thêm phần tử
heapq.heappush(min_heap, 10)
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 15)

# Lấy phần tử nhỏ nhất
smallest = heapq.heappop(min_heap) # Trả về 5

# Xem phần tử nhỏ nhất mà không xóa
peek = min_heap[0] # Trả về 10
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
**Lỗi thường gặp:**
- Nhầm lẫn giữa Heap và Binary Search Tree (BST): Heap không có thứ tự giữa các nút cùng cấp, chỉ có quan hệ cha-con.
- Quên cập nhật chỉ số khi thực hiện `Heapify` trên mảng.

**Ứng dụng phỏng vấn:**
- **Priority Queue**: Quản lý các tiến trình ưu tiên trong hệ điều hành.
- **Heap Sort**: Sắp xếp mảng với độ phức tạp O(n log n).
- **Bài toán K-th**: Tìm phần tử lớn thứ K hoặc nhỏ thứ K trong luồng dữ liệu (stream).
- **Thuật toán đồ thị**: Cải tiến Dijkstra và Prim bằng cách sử dụng Min-Heap để chọn cạnh/đỉnh có trọng số nhỏ nhất.$content$,
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
    'Hàng đợi (Queue)',
    'hang-doi-queue',
    'Heap / Priority Queue',
    'Hàng đợi là cấu trúc dữ liệu tuyến tính tuân thủ nguyên tắc FIFO (First-In, First-Out), đóng vai trò thiết yếu trong việc quản lý bộ đệm và điều phối tài nguyên hệ thống.',
    $content$## 1. Đặt vấn đề & Khái niệm

Hàng đợi (Queue) là một cấu trúc dữ liệu tuyến tính hoạt động theo nguyên tắc **FIFO (First-In, First-Out)**: phần tử được thêm vào đầu tiên sẽ là phần tử được lấy ra đầu tiên. Hãy hình dung hàng đợi như một hàng người xếp hàng mua vé; người đến trước sẽ được phục vụ trước.

Trong khoa học máy tính, Queue được sử dụng để giải quyết các vấn đề liên quan đến sự chênh lệch tốc độ xử lý giữa các thiết bị (buffer) hoặc quản lý tiến trình (scheduling).

## 2. Các thao tác cơ bản (Core Operations)

- **enqueue(x)**: Thêm một phần tử vào cuối hàng đợi (Rear).
- **dequeue()**: Loại bỏ phần tử ở đầu hàng đợi (Front).
- **peek() / front()**: Trả về giá trị của phần tử ở đầu hàng đợi mà không loại bỏ nó.
- **isEmpty()**: Kiểm tra xem hàng đợi có rỗng hay không.
- **isFull()**: Kiểm tra xem hàng đợi đã đầy chưa (đối với hàng đợi có kích thước cố định).

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Enqueue | O(1) | O(1) | O(1) |
| Dequeue | O(1) | O(1) | O(1) |
| Peek | O(1) | O(1) | O(1) |
| Search | O(n) | O(n) | O(1) |

## 4. Cài đặt mẫu (Implementation)

Dưới đây là ví dụ cài đặt Queue bằng Python sử dụng `collections.deque` để tối ưu hiệu năng:

```python
from collections import deque

# Khởi tạo hàng đợi
queue = deque()

# Enqueue: Thêm phần tử
queue.append('A')
queue.append('B')

# Dequeue: Lấy phần tử
first = queue.popleft() # Trả về 'A'

# Peek: Xem phần tử đầu
print(queue[0]) # Trả về 'B'
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)

### Ứng dụng thực tế:
- **Hệ điều hành**: CPU Scheduling, quản lý hàng đợi tiến trình.
- **Mạng máy tính**: Buffer trong các bộ định tuyến (router) hoặc switch.
- **Thuật toán**: Duyệt đồ thị theo chiều rộng (BFS), duyệt cây theo tầng (Level Order Traversal).

### Lỗi thường gặp:
- **Underflow**: Cố gắng thực hiện `dequeue` trên một hàng đợi rỗng.
- **Overflow**: Cố gắng thực hiện `enqueue` khi hàng đợi đã đầy (đối với cài đặt mảng tĩnh).
- **Lựa chọn cấu trúc**: Sử dụng `list` trong Python để làm Queue (thao tác `pop(0)` có độ phức tạp O(n)), thay vào đó nên dùng `collections.deque` để đạt O(1).$content$,
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
    'Quy hoạch động (Dynamic Programming)',
    'quy-hoach-dong-dynamic-programming',
    '1-D Dynamic Programming',
    'Quy hoạch động là kỹ thuật tối ưu hóa bằng cách chia nhỏ bài toán thành các bài toán con gối nhau và lưu trữ kết quả để tránh tính toán lặp lại, giúp giảm độ phức tạp từ hàm mũ xuống đa thức.',
    $content$## 1. Đặt vấn đề & Khái niệm
Quy hoạch động (Dynamic Programming - DP) là một phương pháp giải quyết các bài toán phức tạp bằng cách chia chúng thành các bài toán con đơn giản hơn. Khác với Chia để trị (Divide and Conquer), các bài toán con trong DP thường **gối nhau (overlapping subproblems)**. Thay vì tính toán lại nhiều lần, chúng ta lưu trữ kết quả của các bài toán con vào một bảng (bộ nhớ đệm) để tái sử dụng khi cần.

## 2. Các thao tác cơ bản (Core Operations)
Có hai cách tiếp cận chính trong DP:
- **Memoization (Top-Down):** Giải quyết bài toán từ trên xuống bằng cách sử dụng đệ quy kết hợp với lưu trữ kết quả vào một mảng hoặc bảng băm (hash map).
- **Tabulation (Bottom-Up):** Giải quyết bài toán từ dưới lên bằng cách điền dần vào bảng (thường là mảng 1D hoặc 2D) dựa trên các giá trị đã tính trước đó.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
DP giúp tối ưu hóa đáng kể thời gian thực thi so với đệ quy thuần túy.

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Truy xuất kết quả | O(1) | O(1) | O(N) |
| Tính toán bài toán con | O(N) | O(N^2) | O(N) |

*Lưu ý: Độ phức tạp phụ thuộc vào số lượng trạng thái và số lần chuyển trạng thái của bài toán cụ thể.*

## 4. Cài đặt mẫu (Implementation)
Ví dụ: Tính số Fibonacci thứ n bằng phương pháp Tabulation (Bottom-Up).

```python
def fibonacci(n):
    if n <= 1: return n
    # Khởi tạo bảng lưu trữ
    dp = [0] * (n + 1)
    dp[1] = 1
    
    # Điền bảng từ dưới lên
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
        
    return dp[n]

# Kết quả: fibonacci(10) = 55
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
**Lỗi thường gặp:**
- **Quên lưu trữ kết quả:** Dẫn đến độ phức tạp vẫn là hàm mũ.
- **Sai trạng thái (State Definition):** Xác định không đủ các biến cần thiết để mô tả trạng thái bài toán.
- **Tràn bộ nhớ:** Sử dụng mảng quá lớn cho các bài toán không cần thiết.

**Ứng dụng phỏng vấn:**
- Các bài toán tối ưu hóa: 0/1 Knapsack, Coin Change, Longest Common Subsequence.
- Các bài toán đếm: Đếm số cách đi đến đích, đếm số đường đi trong lưới.
- Các bài toán chuỗi: Edit Distance, Palindrome Partitioning.$content$,
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
    '108340c3-7c97-5b9e-b74e-2db87a77517c',
    'Quy hoạch động: Ghi nhớ (Memoization) và Bảng hóa (Tabulation)',
    'quy-hoach-dong-ghi-nho-memoization-va-bang-hoa-tabulation',
    '1-D Dynamic Programming',
    'Quy hoạch động là kỹ thuật tối ưu hóa bằng cách lưu trữ kết quả các bài toán con. Memoization tiếp cận từ trên xuống (Top-down) bằng đệ quy, trong khi Tabulation tiếp cận từ dưới lên (Bottom-up) bằng vòng lặp.',
    $content$## 1. Đặt vấn đề & Khái niệm
Quy hoạch động (Dynamic Programming - DP) giải quyết các bài toán có cấu trúc con trùng lặp (overlapping subproblems). Để tránh tính toán lại nhiều lần, chúng ta sử dụng hai kỹ thuật chính:
- **Memoization (Top-down):** Bắt đầu từ bài toán lớn, phân rã thành các bài toán con thông qua đệ quy và lưu trữ kết quả vào một bảng (thường là mảng hoặc hash map) khi cần.
- **Tabulation (Bottom-up):** Xây dựng bảng kết quả từ các bài toán con nhỏ nhất cho đến bài toán lớn nhất bằng cách sử dụng vòng lặp (iterative).

## 2. Các thao tác cơ bản (Core Operations)
- **Memoization:** Kiểm tra bảng lưu trữ trước khi thực hiện đệ quy. Nếu đã có giá trị, trả về ngay lập tức; nếu chưa, tính toán và lưu lại.
- **Tabulation:** Khởi tạo bảng DP (thường là mảng `dp[]`), thiết lập giá trị cơ sở (base case), và sử dụng vòng lặp để điền đầy bảng theo thứ tự tăng dần của kích thước bài toán.

## 3. Đánh giá độ phức tạp (Big-O Complexity)
| Tiêu chí | Memoization | Tabulation |
| :--- | :--- | :--- |
| Cách tiếp cận | Top-down (Đệ quy) | Bottom-up (Vòng lặp) |
| Độ phức tạp thời gian | O(N) | O(N) |
| Độ phức tạp không gian | O(N) (Stack + Table) | O(N) (Table) |
| Overhead | Có (Recursive call stack) | Không |

## 4. Cài đặt mẫu (Implementation)
Ví dụ bài toán Cắt thanh (Rod Cutting) bằng Tabulation (Python):

```python
def cut_rod(price):
    n = len(price)
    # dp[i] lưu giá trị lớn nhất của thanh độ dài i
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        for j in range(1, i + 1):
            # So sánh giá trị hiện tại với việc cắt một đoạn j
            dp[i] = max(dp[i], price[j - 1] + dp[i - j])
            
    return dp[n]

# Input: giá trị cho từng độ dài
price = [1, 5, 8, 9, 10, 17, 17, 20]
print(f"Lợi nhuận tối đa: {cut_rod(price)}")
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
  - Quên khởi tạo bảng DP hoặc khởi tạo sai giá trị cơ sở.
  - Tràn bộ nhớ (Stack Overflow) khi sử dụng Memoization với độ sâu đệ quy quá lớn.
  - Nhầm lẫn thứ tự vòng lặp trong Tabulation (đặc biệt trong các bài toán 2D như Knapsack).
- **Ứng dụng phỏng vấn:** 
  - Các bài toán tối ưu hóa: Knapsack, Longest Common Subsequence, Edit Distance.
  - Các bài toán đếm số cách: Coin Change, Climbing Stairs.
  - Tabulation thường được ưu tiên trong phỏng vấn vì hiệu năng tốt hơn và tránh được giới hạn đệ quy.$content$,
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
    'Bài toán yêu cầu tìm số lượng tổ hợp các đồng xu có thể tạo thành một tổng cho trước, với giả định nguồn cung cấp mỗi loại xu là vô hạn. Đây là bài toán kinh điển thuộc dạng Quy hoạch động (Dynamic Programming) trên một chiều.',
    $content$## 1. Đặt vấn đề & Khái niệm
Cho một mảng `coins[]` đại diện cho các mệnh giá tiền và một số nguyên `sum`. Mục tiêu là tìm số cách khác nhau để tạo ra `sum` bằng cách sử dụng các đồng xu trong `coins[]`. Vì nguồn cung là vô hạn, chúng ta có thể sử dụng một loại xu nhiều lần.

Đây là bài toán tối ưu hóa tổ hợp, nơi mỗi trạng thái phụ thuộc vào việc chọn hoặc không chọn đồng xu hiện tại, dẫn đến cấu trúc bài toán con gối đầu (overlapping subproblems).

## 2. Các thao tác cơ bản (Core Operations)
- **Đệ quy (Recursion):** Tại mỗi bước, ta có hai lựa chọn: bao gồm đồng xu hiện tại (giảm `sum` và giữ nguyên `n`) hoặc loại bỏ đồng xu hiện tại (giữ nguyên `sum` và giảm `n`).
- **Quy hoạch động (DP):** 
  - **Memoization (Top-Down):** Lưu trữ kết quả của các cặp `(n, sum)` đã tính toán để tránh tính toán lại.
  - **Tabulation (Bottom-Up):** Xây dựng bảng `dp[n+1][sum+1]` từ dưới lên.
  - **Tối ưu không gian (Space Optimization):** Chỉ sử dụng mảng 1 chiều `dp[sum+1]` vì trạng thái hiện tại chỉ phụ thuộc vào trạng thái trước đó của cùng một mảng.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thuật toán | Thời gian (Time) | Không gian (Space) |
| :--- | :--- | :--- |
| Đệ quy thuần túy | O(2^sum) | O(sum) |
| DP (Memoization) | O(n * sum) | O(n * sum) |
| DP (Tabulation) | O(n * sum) | O(n * sum) |
| DP (Tối ưu không gian) | O(n * sum) | O(sum) |

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt tối ưu không gian bằng Python:

```python
def count_ways(coins, target_sum):
    # dp[i] lưu số cách để tạo ra tổng i
    dp = [0] * (target_sum + 1)
    dp[0] = 1  # Có 1 cách để tạo tổng 0 (không chọn đồng xu nào)

    for coin in coins:
        for j in range(coin, target_sum + 1):
            # Cộng dồn số cách tạo ra tổng (j - coin)
            dp[j] += dp[j - coin]
            
    return dp[target_sum]

# Ví dụ sử dụng
coins = [1, 2, 3]
sum_val = 5
print(f"Số cách đổi tiền: {count_ways(coins, sum_val)}")
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** 
  - Nhầm lẫn giữa bài toán "đếm số cách" (Count Ways) và "tìm số lượng xu tối thiểu" (Minimum Coins). 
  - Quên khởi tạo `dp[0] = 1`, dẫn đến kết quả luôn bằng 0.
  - Thứ tự vòng lặp trong DP tối ưu không gian: Nếu muốn đếm tổ hợp (không quan tâm thứ tự), vòng lặp `coins` phải nằm ngoài vòng lặp `sum`.
- **Ứng dụng phỏng vấn:** 
  - Các bài toán về hệ thống thanh toán, phân bổ tài nguyên, hoặc các bài toán tối ưu hóa tổ hợp trong tài chính và logistics.$content$,
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
    '27572e17-e8f9-527f-81fb-bc74c8bb09ed',
    'Dãy con chung dài nhất (Longest Common Subsequence - LCS)',
    'day-con-chung-dai-nhat-longest-common-subsequence',
    '2-D Dynamic Programming',
    'Bài toán tìm độ dài của dãy con dài nhất xuất hiện trong cả hai chuỗi cho trước, là nền tảng quan trọng trong quy hoạch động và so sánh dữ liệu.',
    $content$## 1. Đặt vấn đề & Khái niệm
Cho hai chuỗi `s1` và `s2`, bài toán LCS yêu cầu tìm độ dài của dãy con dài nhất xuất hiện trong cả hai chuỗi. Một "dãy con" (subsequence) là chuỗi được tạo ra bằng cách xóa 0 hoặc nhiều ký tự từ chuỗi gốc mà không làm thay đổi thứ tự tương đối của các ký tự còn lại.

Ví dụ: Với `s1 = "ABC"`, các dãy con bao gồm `""`, `"A"`, `"B"`, `"C"`, `"AB"`, `"AC"`, `"BC"`, `"ABC"`.

## 2. Các thao tác cơ bản (Core Operations)
Bài toán được giải quyết bằng quy hoạch động dựa trên công thức truy hồi:
- Nếu `s1[i-1] == s2[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`
- Nếu `s1[i-1] != s2[j-1]`: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
- Trường hợp cơ sở: Nếu một trong hai chuỗi rỗng, độ dài LCS là 0.

## 3. Đánh giá độ phức tạp (Big-O Complexity)

| Thao tác | Average | Worst | Space |
| :--- | :--- | :--- | :--- |
| Đệ quy thuần | O(2^min(m,n)) | O(2^min(m,n)) | O(min(m,n)) |
| Quy hoạch động (Tabulation) | O(m*n) | O(m*n) | O(m*n) |
| Tối ưu không gian | O(m*n) | O(m*n) | O(n) |

## 4. Cài đặt mẫu (Implementation)
Dưới đây là cài đặt tối ưu không gian (O(n)) bằng Python:

```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [0] * (n + 1)
    
    for i in range(1, m + 1):
        prev = dp[0]
        for j in range(1, n + 1):
            temp = dp[j]
            if s1[i-1] == s2[j-1]:
                dp[j] = 1 + prev
            else:
                dp[j] = max(dp[j-1], dp[j])
            prev = temp
    return dp[n]
```

## 5. Những lỗi thường gặp & Ứng dụng phỏng vấn (Pitfalls & Applications)
- **Lỗi thường gặp:** Quên khởi tạo mảng DP với kích thước `(m+1) x (n+1)` dẫn đến lỗi chỉ số (index out of bounds) hoặc sai lệch kết quả ở các trường hợp biên.
- **Ứng dụng:** 
  - So sánh sự khác biệt giữa các tệp tin (diff utility).
  - Tin sinh học (Bioinformatics): So sánh các chuỗi DNA/Protein.
  - Kiểm tra độ tương đồng của văn bản trong các hệ thống chống đạo văn.$content$,
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
