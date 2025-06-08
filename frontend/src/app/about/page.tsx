'use client';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-6 text-center">О нас</h2>
                <p className="text-gray-700 mb-8">
                    Мы — не просто магазин одежды. Мы команда, которая вдохновляется вашей уникальностью
                    и стремится подчеркнуть её через стильные, качественные и современные образы.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 text-gray-800">
                <p>
                    В нашем магазине каждая вещь — это история, рассказывающая о красоте, уверенности
                    и самовыражении. Мы тщательно отбираем коллекции, чтобы вы могли создавать свой
                    индивидуальный стиль с легкостью и удовольствием.
                </p>

                <p>
                    <span className="font-semibold">Наша миссия</span> — помогать вам чувствовать себя
                    уверенно в каждой детали: будь то повседневный образ, деловой стиль или особенный
                    наряд. Мы верим, что одежда — это не просто ткань, это способ рассказать миру свою историю.
                </p>

                <div className="p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2 text-black">Почему выбирают нас?</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li> Уникальные коллекции, которые обновляются каждый сезон</li>
                        <li> Качество и внимание к деталям</li>
                        <li> Забота о клиентах и безупречный сервис</li>
                        <li> Удобство покупок — онлайн и офлайн</li>
                    </ul>
                </div>

                <p>
                    Создайте свой стиль с нами — потому что мода начинается с вас!
                </p>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Image
                    src="/photo1.jpg"
                    alt="Фото 1"
                    width={300}
                    height={200}
                    className="w-full h-120 object-cover rounded shadow"
                />
                <Image
                    src="/photo2.jpg"
                    alt="Фото 2"
                    width={300}
                    height={200}
                    className="w-full h-120 object-cover rounded shadow"
                />
                <Image
                    src="/photo 3.jpg"
                    alt="Фото 3"
                    width={300}
                    height={200}
                    className="w-full h-120 object-cover rounded shadow"
                />
                <Image
                    src="/photo4.jpg"
                    alt="Фото 4"
                    width={300}
                    height={200}
                    className="w-full h-120 object-cover rounded shadow"
                />
            </div>
        </div>
    );
}
