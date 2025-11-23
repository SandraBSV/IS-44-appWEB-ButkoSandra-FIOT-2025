document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('bagsContainer');

    try {
        const res = await fetch('http://localhost:3000/bags');
        const products = await res.json();

        if (products.length === 0) {
            container.innerHTML = '<p>Сумок не знайдено</p>';
            return;
        }

        products.forEach(item => {
            const html = `
                <div class="product">
                    <img class="photoProduct" src="../images/PhotoBag/photo${item.Product_Id}.jpg" alt="${item.Product_Name}"><br>
                    <div class="name-product">${item.Product_Name}</div>
                    <div class="price-product">${item.Product_Price} ₴</div>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (err) {
        console.error('Помилка завантаження сумок:', err);
        container.innerHTML = '<p>Сталася помилка під час завантаження сумок</p>';
    }
});
