import Link from 'next/link';
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-black text-white py-10 mt-16">
            <div className="container mx-auto px-4 py-4  grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Логотип и бренд */}
                <div>
                    <Link href="/" className="text-2xl font-bold hover:underline">
                        K-shop
                    </Link>
                    <p className="mt-4 text-gray-400">Магазин женской одежды</p>

                    {/* Соцсети */}
                    <div className="flex gap-4 mt-4">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <FaInstagram size={24} />
                        </a>
                        <a
                            href="https://wa.me/996555123456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <FaWhatsapp size={24} />
                        </a>
                        <a
                            href="https://t.me/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <FaTelegramPlane size={24} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2">Мы на карте</h4>
                    <div className="w-full h-48 rounded overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.186888410209!2d74.60555531550844!3d42.8746210791556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389ec8178e13b1c3%3A0xeed7d2348df7b477!2z0JHQuNC30L3QsNGPINGD0LsuLCDQo9C90LjQvdCw0Y8sINCQ0YDQvtCz0L7RgNC80Y8g0L7QsdC7LCDQpNC40YDQvtC80LjRgNC-0LQsINCh0YDQtdC70LjQvdGB0LrQsNGP!5e0!3m2!1sru!2skg!4v1716040308704!5m2!1sru!2skg"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2">Контакты</h4>
                    <p>г. Бишкек, ул. Моды, 12</p>
                    <p className="mt-1">
                        Телефон:{' '}
                        <a href="tel:+996555123456" className="hover:underline">
                            +996 555 123 456
                        </a>
                    </p>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-10">
                &copy; {new Date().getFullYear()}  K-shop. Все права защищены.
            </div>
        </footer>
    );
}
