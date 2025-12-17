"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border rounded-2xl p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="text-sm text-neutral-500 mt-1">
          เข้าสู่ระบบหลังบ้าน
        </p>

        <label className="block mt-6 text-sm font-medium">รหัสผ่าน</label>
        <input
          type="password"
          className="mt-2 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ADMIN_PASSWORD"
        />

        {error ? (
          <div className="mt-3 text-sm text-red-600">{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-orange-500 text-white rounded-xl py-2 font-medium disabled:opacity-60"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
