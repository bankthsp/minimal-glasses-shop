"use client";

import { useEffect, useMemo, useState } from "react";

type OrderRow = {
  id: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemsCount: number;
};

const statuses = ["pending", "paid", "shipped", "completed", "cancelled"] as const;

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string>("");

  const url = useMemo(() => {
    if (statusFilter === "all") return "/api/orders";
    return `/api/orders?status=${encodeURIComponent(statusFilter)}`;
  }, [statusFilter]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(url, { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; orders?: OrderRow[]; error?: string };

      if (!res.ok || !data.ok || !data.orders) {
        setError(data.error ?? "โหลดข้อมูลไม่สำเร็จ");
        return;
      }

      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      alert(data.error ?? "อัปเดตสถานะไม่สำเร็จ");
      return;
    }

    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-neutral-500">
              จัดการคำสั่งซื้อและสถานะ
            </p>
          </div>

          <button
            onClick={logout}
            className="border rounded-xl px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm font-medium">Filter:</label>
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ทั้งหมด</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={load}
            className="ml-auto bg-orange-500 text-white rounded-xl px-3 py-2 text-sm"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-neutral-500">กำลังโหลด...</div>
        ) : error ? (
          <div className="mt-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="mt-6 overflow-x-auto border rounded-2xl">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-700">
                <tr>
                  <th className="text-left p-3">Order</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-right p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3 font-mono text-xs">{o.id.slice(-8)}</td>
                    <td className="p-3">{o.customerName}</td>
                    <td className="p-3">{o.phone}</td>
                    <td className="p-3 text-right">{o.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg border">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</td>
                    <td className="p-3">
                      <select
                        className="border rounded-xl px-2 py-1 text-sm"
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 ? (
                  <tr>
                    <td className="p-3 text-neutral-500" colSpan={7}>
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
