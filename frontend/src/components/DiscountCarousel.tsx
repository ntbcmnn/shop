'use client';

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import {Product} from "@/stores/products/productStore";



interface DiscountCarouselProps {
    products: Product[];
}

export default function DiscountCarousel({ products }: DiscountCarouselProps) {
    // Фильтруем товары с акциями
    const discountedProducts = products.filter(p => p.discount > 0);

    // Количество товаров на слайде
    const itemsPerSlide = 4;

    // Считаем общее количество слайдов (по 4 товара в слайде)
    const totalSlides = Math.ceil(discountedProducts.length / itemsPerSlide);

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    if (discountedProducts.length === 0) {
        return <p className="text-center text-gray-500">Нет акционных товаров</p>;
    }

    return (
        <div className="relative w-full max-w-9xl mx-auto overflow-hidden">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {/* Создаем слайды, по 4 товара в каждом */}
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                    const start = slideIndex * itemsPerSlide;
                    const slideItems = discountedProducts.slice(start, start + itemsPerSlide);

                    return (
                        <div
                            key={slideIndex}
                            className="flex-shrink-0 w-full flex justify-between px-2"
                        >
                            {slideItems.map(product => (
                                <div key={product.id} className="w-[23%]"> {/* около 4 штук в ряд с небольшими отступами */}
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            {/* Если товаров меньше 4 на последнем слайде, добавляем пустые блоки для выравнивания */}
                            {slideItems.length < itemsPerSlide &&
                                Array(itemsPerSlide - slideItems.length)
                                    .fill(null)
                                    .map((_, i) => (
                                        <div key={"empty-" + i} className="w-[23%]" />
                                    ))
                            }
                        </div>
                    );
                })}
            </div>

            {/* Кнопки навигации */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                aria-label="Предыдущий слайд"
            >
                &#10094;
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                aria-label="Следующий слайд"
            >
                &#10095;
            </button>
        </div>
    );
}
