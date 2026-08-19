import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-brand-dark">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-foreground/60">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-light bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-light/50 text-left">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Method</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Placed</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-brand-light align-top">
                  <td className="p-3 font-mono text-xs">{order.id}</td>
                  <td className="p-3">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-foreground/50">{order.customerEmail}</div>
                    <div className="text-xs text-foreground/50">{order.customerPhone}</div>
                    {order.deliveryAddress && (
                      <div className="text-xs text-foreground/50">{order.deliveryAddress}</div>
                    )}
                  </td>
                  <td className="p-3">{order.deliveryMethod === "DELIVERY" ? "Delivery" : "Pickup"}</td>
                  <td className="p-3">
                    <ul>
                      {order.items.map((i) => (
                        <li key={i.id}>
                          {i.quantity}&times; {i.nameSnapshot}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 font-medium">{formatCents(order.totalCents)}</td>
                  <td className="p-3 text-xs">{order.createdAt.toLocaleString()}</td>
                  <td className="p-3">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
