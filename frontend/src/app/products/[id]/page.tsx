import { fetchProduct } from "@/stores/products/productStore";
import { apiUrl } from "@/globalConstants";

interface ProductPageProps {
    params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await fetchProduct(Number(params.id));

    const discountedPrice =
        product.discount > 0
            ? Number(product.price) * (1 - product.discount / 100)
            : Number(product.price);

    return (
        <main className="max-w-5xl mx-auto p-8 bg-white text-gray-900 min-h-screen">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                    {product.image_url ? (
                        <img
                            src={`${apiUrl}/${product.image_url}`}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">
                            Нет изображения
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-gray-700 mb-8 whitespace-pre-line leading-relaxed text-lg">
                            {product.description}
                        </p>

                        {product.discount > 0 ? (
                            <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-extrabold text-black">
                  {discountedPrice.toFixed(2)} ₽
                </span>
                                <span className="text-lg line-through text-gray-500">
                  {Number(product.price).toFixed(2)} ₽
                </span>
                                <span className="uppercase text-sm font-semibold tracking-wider bg-gray-900 text-white rounded px-3 py-1 select-none">
                  -{product.discount}%
                </span>
                            </div>
                        ) : (
                            <p className="text-4xl font-extrabold mb-8">{Number(product.price).toFixed(2)} ₽</p>
                        )}

                        <p
                            className={`font-semibold text-sm uppercase tracking-wide ${
                                product.stock ? "text-green-700" : "text-gray-500"
                            } mb-10`}
                        >
                            {product.stock ? "В наличии" : "Нет в наличии"}
                        </p>
                    </div>

                    <button
                        disabled={!product.stock}
                        className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors duration-300 ${
                            product.stock
                                ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {product.stock ? "Добавить в корзину" : "Товар недоступен"}
                    </button>
                </div>
            </div>
        </main>
    );
}
