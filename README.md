# TruthSeeker AI

<p align="center">
  <strong>Một trò chơi suy luận xã hội do AI cung cấp, nơi bạn phải phân biệt sự thật khỏi hư cấu.</strong>
</p>

<p align="center">
  <img src="https://placehold.co/600x400.png" alt="TruthSeeker AI Gameplay Screenshot" data-ai-hint="gameplay screenshot"/>
</p>

## Giới thiệu

TruthSeeker AI là một trò chơi tương tác, thách thức khả năng tư duy phản biện của bạn. Trong mỗi màn chơi, bạn sẽ được cung cấp một chủ đề và một loạt các "lời khai của nhân chứng" do AI (Google Gemini) tạo ra. Một số lời khai là sự thật, trong khi những lời khác là bịa đặt được thiết kế để đánh lừa bạn. Nhiệm vụ của bạn là phân tích cẩn thận từng bằng chứng, đánh giá độ tin cậy và cuối cùng là khám phá ra sự thật.

Trò chơi này không chỉ là một bài kiểm tra về khả năng nhận biết sự thật mà còn là một trải nghiệm thú vị về cách AI có thể tạo ra các câu chuyện phức tạp và thuyết phục.

## Tính năng chính

-   **Lối chơi năng động**: Tạo ra các kịch bản điều tra độc đáo về bất kỳ chủ đề nào bạn có thể nghĩ ra.
-   **Nội dung do AI tạo ra**: Các lời khai được tạo bởi Google Gemini, mang đến những thử thách mới mẻ mỗi khi chơi.
-   **Giao diện tương tác**: Đánh giá bằng chứng, theo dõi tiến độ của bạn và đưa ra kết luận cuối cùng.
-   **Bản địa hóa tiếng Việt**: Toàn bộ giao diện người dùng và nội dung được thiết kế cho người chơi nói tiếng Việt.

## Công nghệ sử dụng

-   **Frontend**: [Next.js](https://nextjs.org/) (React Framework), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) với mô hình [Google Gemini](https://ai.google.dev/)

## Cài đặt và Chạy dự án

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau.

### 1. Điều kiện tiên quyết

-   [Node.js](https://nodejs.org/en) (phiên bản 18 trở lên)
-   `npm` hoặc `yarn`

### 2. Lấy khóa API Google

1.  Truy cập [Google AI Studio](https://aistudio.google.com/).
2.  Nhấp vào **"Get API key"** và tạo một khóa API mới trong một dự án Google Cloud hiện có hoặc một dự án mới.
3.  Sao chép khóa API của bạn.

### 3. Cài đặt dự án

1.  **Sao chép kho mã nguồn:**
    ```bash
    git clone <URL_KHO_MA_NGUON_CUA_BAN>
    cd <TEN_THU_MUC_DU_AN>
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

3.  **Thiết lập biến môi trường:**
    Tạo một tệp mới có tên là `.env` ở thư mục gốc của dự án và thêm khóa API của bạn vào đó:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
    ```
    Thay thế `YOUR_GOOGLE_API_KEY_HERE` bằng khóa API bạn đã lấy ở bước trước.

### 4. Chạy ứng dụng

Bây giờ bạn có thể khởi động máy chủ phát triển:

```bash
npm run dev
```

Mở trình duyệt của bạn và truy cập [http://localhost:9002](http://localhost:9002) để bắt đầu chơi.

Chúc bạn có những giờ phút điều tra vui vẻ!
