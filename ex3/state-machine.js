export const STATUS = Object.freeze({
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
});

export function createInitialState() {
  return { status: STATUS.IDLE };
}

export async function fetchFeed() {
  // Giả lập độ trễ mạng 1.2s để DevTools và mắt thường thấy rõ Skeleton Loader
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Trả về danh sách công việc thực tế, dễ hiểu thay cho tiếng Latin
  return [
    { id: 1, title: "Đọc và kiểm tra tài liệu PR (Review PR)" },
    { id: 2, title: "Xác thực cấu trúc cây cú pháp (Verify AST)" },
    { id: 3, title: "Kiểm tra rò rỉ bộ nhớ Event Delegation" },
    { id: 4, title: "Tối ưu hóa Skeleton Screen animation" },
    { id: 5, title: "Đóng gói ứng dụng và viết test assertion" }
  ];
}