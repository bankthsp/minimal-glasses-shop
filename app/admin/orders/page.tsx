"use client";

import { useEffect, useState } from "react";

type OrderRow = {
  id: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemsCount: number;
};

type OrdersApiResponse = {
  ok: boolean;
  orders: OrderRow[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data: OrdersApiResponse = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    await load();
  }

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <div className="overflow-auto bg-white rounded-lg border">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.customerName || "-"}</td>
                <td className="p-3">฿{(o.totalAmount || 0).toLocaleString()}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => updateStatus(o.id, "paid")}
                  >
                    Paid
                  </button>
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => updateStatus(o.id, "shipped")}
                  >
                    Shipped
                  </button>
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => updateStatus(o.id, "cancelled")}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
