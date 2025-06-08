import OrderList from "@/components/OrderList";

export default function OrderPage() {
    return (
        <div className="px-4 flex flex-col items-center">
            <h1 className="mt-10 mb-10 text-3xl font-semibold">Заказы</h1>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <OrderList/>
            </div>
        </div>
    );
}