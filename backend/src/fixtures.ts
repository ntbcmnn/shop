import mysql, { ResultSetHeader } from 'mysql2/promise';
import { randomUUID } from 'crypto';

const dbConfig = {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root_password',
    database: 'shop_db',
};

async function seed() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.query(`SET FOREIGN_KEY_CHECKS=0`);
        await connection.query(`TRUNCATE TABLE order_items`);
        await connection.query(`TRUNCATE TABLE orders`);
        await connection.query(`TRUNCATE TABLE cart_items`);
        await connection.query(`TRUNCATE TABLE carts`);
        await connection.query(`TRUNCATE TABLE products`);
        await connection.query(`TRUNCATE TABLE subcategories`);
        await connection.query(`TRUNCATE TABLE categories`);
        await connection.query(`TRUNCATE TABLE users`);
        await connection.query(`SET FOREIGN_KEY_CHECKS=1`);

        const usersData = [
            ['jane.doe@example.com', 'Jane', 'Doe', '1234567890', 'hashed_password_1', randomUUID(), 'ADMIN'],
            ['john.smith@example.com', 'John', 'Smith', null, 'hashed_password_2', randomUUID(), 'USER'],
        ];

        const [usersResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO users (email, first_name, last_name, phone, password, token, role) VALUES ?`,
            [usersData]
        );

        const categoryData = [
            { name: 'Джинсы', photo: 'fixtures/jeans.jpg' },
            { name: 'Сумки', photo: 'fixtures/bag.jpg' },
            { name: 'Футболки', photo: 'fixtures/t-shirt.jpg' },
            { name: 'Толстовки', photo: 'fixtures/sweatshirt.png' },
            { name: 'Кроссовки', photo: 'fixtures/sneakers.jpg' },
            { name: 'Рубашки', photo: 'fixtures/shirt.jpg' },
            { name: 'Платья', photo: 'fixtures/dress.jpg' }
        ];

        const categoriesData = categoryData.map(item => [item.name, item.photo]);

        const [categoriesResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO categories (name, photo) VALUES ?`,
            [categoriesData]
        );

        const firstCategoryId = categoriesResult.insertId;

        const subcategoriesData = [
            [firstCategoryId, 'Skinny Jeans'],
            [firstCategoryId, 'Regular Fit Jeans'],
            [firstCategoryId, 'Bootcut Jeans'],

            [firstCategoryId + 1, 'Рюкзаки'],
            [firstCategoryId + 1, 'Сумки через плечо'],

            [firstCategoryId + 2, 'Футболки с принтом'],
            [firstCategoryId + 2, 'Спортивные футболки'],

            [firstCategoryId + 3, 'Худи'],
            [firstCategoryId + 3, 'Толстовки с молнией'],

            [firstCategoryId + 4, 'Беговые кроссовки'],
            [firstCategoryId + 4, 'Повседневные кроссовки'],

            [firstCategoryId + 5, 'Классические рубашки'],
            [firstCategoryId + 5, 'Фланелевые рубашки'],

            [firstCategoryId + 6, 'Вечерние платья'],
            [firstCategoryId + 6, 'Летние платья'],
        ];


        const [subcategoriesResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO subcategories (category_id, name) VALUES ?`,
            [subcategoriesData]
        );

        const firstSubcategoryId = subcategoriesResult.insertId;

        const image_url = [
            'fixtures/jeans.jpg',
            'fixtures/t-shirt-product-1.jpg',
            'fixtures/dress-product.jpg',
            'fixtures/t-shirt-product-2.jpg',
            'fixtures/sweatshirt-product-1.jpg',
            'fixtures/shirt-ptoduct.jpg',
            'fixtures/swetshirt-product-2.jpg',
            'fixtures/shirt-product-2.jpg',
            'fixtures/jeans=product.jpg',
            'fixtures/jeans-product-3.jpg',
            'fixtures/sneakers-product-1.jpg',
            'fixtures/sneakers-product-2.jpg',
            'fixtures/dress2-product.jpg',
            'fixtures/bag-product-2.jpg',
            'fixtures/bags-product-1.jpg',
        ];


        const productsData: (string | number | boolean)[][] = [];

        const productNamesByCategory = [
            ['Skinny Jeans', 'Regular Fit Jeans', 'Bootcut Jeans', 'Slim Jeans'],
            ['Рюкзак городской', 'Сумка через плечо', 'Клатч', 'Портфель'],
            ['Футболка с принтом', 'Спортивная футболка', 'Поло', 'Топ'],
            ['Худи на молнии', 'Толстовка с капюшоном', 'Свободное худи', 'Кофта'],
            ['Беговые кроссовки', 'Повседневные кроссовки', 'Треккинговые кроссовки', 'Кеды'],
            ['Классическая рубашка', 'Фланелевая рубашка', 'Джинсовая рубашка', 'Рубашка с коротким рукавом'],
            ['Вечернее платье', 'Летнее платье', 'Коктейльное платье', 'Платье макси'],
        ];

        const descriptions = [
            'Высококачественный товар.',
            'Очень популярен среди покупателей.',
            'Комфортный и стильный.',
            'Идеально подходит для повседневного использования.',
            'Новинка сезона.',
            'Отличное соотношение цена/качество.',
            'Эксклюзивный дизайн.'
        ];

        const stocks = [true, false];
        const discounts = [0, 5, 10, 15, 20];

        let subcategoryIndex = 0;

        for (let i = 0; i < 50; i++) {
            const subcategoryIndex = i % subcategoriesData.length;
            const realSubcategoryId = firstSubcategoryId + subcategoryIndex;

            const catGroup = Math.floor(subcategoryIndex / 2);
            const nameOptions = productNamesByCategory[catGroup] || ['Product'];
            const name = nameOptions[i % nameOptions.length] + ' #' + (i + 1);

            const description = descriptions[i % descriptions.length];
            const price = parseFloat((Math.random() * 100 + 10).toFixed(2));
            const stock = stocks[Math.floor(Math.random() * stocks.length)];
            const discount = discounts[Math.floor(Math.random() * discounts.length)];
            const photo = image_url[i % image_url.length];

            productsData.push([
                name,
                description,
                price,
                realSubcategoryId,
                stock,
                discount,
                photo
            ]);
        }

        await connection.query(
            `INSERT INTO products (name, description, price, subcategory_id, stock, discount, image_url) VALUES ?`,
            [productsData]
        );

        console.log('Фикстуры успешно загружены');
    } catch (error) {
        console.error('Ошибка при загрузке фикстур:', error);
    } finally {
        await connection.end();
    }
}

seed();
