import { OrderTracker } from "@/components/order-tracker";

export default function OrderStatusPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <OrderTracker orderId={params.id} />
        </div>
    );
}
