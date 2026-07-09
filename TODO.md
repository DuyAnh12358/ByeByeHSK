# TODO - Kết nối số liệu thi thử (lượt làm / số đề) từ backend

## Plan đã chốt
- Áp dụng phương án tối ưu cho code hiện tại: **A + sort**.
- Backend cung cấp stats theo `level` và `examNumber`.
- Frontend **merge** stats vào 3 đề có sẵn và **sắp xếp đề ít làm hơn lên trước**.

## Các bước thực hiện
1. [x] Backend: tạo model lưu attempt theo từng đề (hskLevel, examNumber, attemptsCount, bestScore, passed)
2. [x] Backend: tạo route/controller `GET /api/exams/stats?level=...`
3. [x] Backend: gắn route vào `backend/src/index.ts`
4. [x] Frontend: cập nhật `frontend/src/data/examsData.jsx` bỏ `MOCK_ATTEMPTS` (chỉ giữ meta đề + skills)
5. [x] Frontend: cập nhật `frontend/src/pages/Exams.jsx` fetch stats, merge vào exam object
6. [x] (Tuỳ chọn) Backend/Frontend: sort đề theo `attemptsCount` tăng dần

7. [ ] (Tuỳ chọn) Frontend: cập nhật `ExamsLanding.jsx` để lấy tổng attempts theo level thay vì mock
8. [x] Chạy backend + frontend để kiểm tra endpoint và UI hiển thị đúng




