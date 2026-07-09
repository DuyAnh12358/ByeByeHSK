// hooks/useSyncUserWithBackend.js
// Theo dõi trạng thái đăng nhập (Clerk) và tự động gọi POST /api/auth/sync khi user
// VỪA chuyển từ "chưa đăng nhập" -> "đã đăng nhập" - bất kể họ đăng nhập qua modal,
// redirect, hay link email, vì tất cả đều phản ánh qua isSignedIn như nhau.
//
// hasSyncedRef đảm bảo chỉ gọi 1 lần cho mỗi phiên đăng nhập, tránh gọi lại liên tục
// mỗi khi component re-render. Khi user đăng xuất, ref được reset để lần đăng nhập
// kế tiếp (kể cả bằng tài khoản khác) vẫn sync lại bình thường.

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

export function useSyncUserWithBackend() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    // Chờ Clerk load xong trạng thái đăng nhập trước, tránh chạy nhầm lúc chưa rõ
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Reset lại để nếu user đăng xuất rồi đăng nhập lại (kể cả tài khoản khác),
      // lần đăng nhập tiếp theo vẫn được đồng bộ.
      hasSyncedRef.current = false;
      return;
    }

    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    (async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("❌ Đồng bộ tài khoản thất bại:", res.status);
          hasSyncedRef.current = false; // cho phép thử lại ở lần render kế tiếp
        }
      } catch (err) {
        console.error("❌ Lỗi khi gọi API đồng bộ tài khoản:", err);
        hasSyncedRef.current = false;
      }
    })();
  }, [isLoaded, isSignedIn, getToken]);
}