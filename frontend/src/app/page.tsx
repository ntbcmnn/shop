import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { fetchProducts, fetchProductsWithLimit} from "@/stores/products/productStore";
import {fetchLimitedCategories} from "@/stores/categories/categoriesStore";
import CategoryCard from "@/components/CategoryCard";
import DiscountCarousel from "@/components/DiscountCarousel";

export default async function Home() {
    const products = await fetchProductsWithLimit(8);
    const categories = await fetchLimitedCategories(5);
    const productSale = await fetchProducts()
     console.log(categories)
    console.log(products)
    return (
        <>
            <main className="py-8">
                    <Carousel />
                    <hr className="my-8 border-gray-300" />

                    <div className="container mx-auto px-4 py-8">
                        <h2 className=" text-2xl font-semibold mb-6 text-center">Категории</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.name} category={cat}/>
                            ))}
                        </div>
                    </div>
                    <div className="w-full bg-black py-12">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-semibold mb-6 text-center text-white">Товары</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.name} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className=" mt-12">
                            <h2 className="text-2xl font-semibold mb-6 text-center">Акции</h2>
                            <DiscountCarousel products={productSale} />
                        </div>
                    </div>
            </main>
            <Footer />
        </>
    );
}
