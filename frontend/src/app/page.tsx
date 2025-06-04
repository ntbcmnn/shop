import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
      <>
          <main className="py-8">
              <div className="max-w-7xl mx-auto px-4">
                  <Carousel />
                  <hr className="my-8 border-gray-300" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <ProductCard
                          image="https://i.pinimg.com/736x/88/42/20/884220df37a500c06f1b4ce34ac47c92.jpg"
                          title="Платье летнее"
                          category="Женская одежда"
                          subCategory="Платья"
                          price={2499}
                      />
                      <ProductCard
                          image="https://i.pinimg.com/736x/35/4c/d6/354cd6f0dbac8bd861000211f9b7795f.jpg"
                          title="Топ с открытыми плечами"
                          category="Женская одежда"
                          subCategory="Топы"
                          price={1299}
                      />
                      <ProductCard
                          image="https://i.pinimg.com/736x/35/4c/d6/354cd6f0dbac8bd861000211f9b7795f.jpg"
                          title="Топ с открытыми плечами"
                          category="Женская одежда"
                          subCategory="Топы"
                          price={1299}
                      />
                      <ProductCard
                          image="https://i.pinimg.com/736x/35/4c/d6/354cd6f0dbac8bd861000211f9b7795f.jpg"
                          title="Топ с открытыми плечами"
                          category="Женская одежда"
                          subCategory="Топы"
                          price={1299}
                      />
                  </div>
              </div>
          </main>
          <Footer/>
      </>

  );
}
