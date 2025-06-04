'use client';

import { useState } from 'react';

const images = [
    'https://images.pexels.com/photos/32115461/pexels-photo-32115461/free-photo-of-fashion-trio-in-avant-garde-urban-landscape.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/9771509/pexels-photo-9771509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/8717525/pexels-photo-8717525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Слайд ${index + 1}`}
                        className="min-w-full h-auto object-cover"
                    />
                ))}
            </div>

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4">
                <button
                    onClick={prevImage}
                    className="bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100"
                >
                    &#10094;
                </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4">
                <button
                    onClick={nextImage}
                    className="bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100"
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
}
