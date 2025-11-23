// document.addEventListener('DOMContentLoaded', async () => {
//     const container = document.getElementById('brasletsContainer');
//     const searchInput = document.getElementById('searchInput');
//     let products = [];

//     try {
//         const res = await fetch('http://localhost:3000/products/braslets');
//         products = await res.json();

//         if (products.length === 0) {
//             container.innerHTML = '<p>Браслетів не знайдено</p>';
//             return;
//         }

//         renderProducts(products);

//     } catch (err) {
//         console.error('Помилка завантаження браслетів:', err);
//         container.innerHTML = '<p>Сталася помилка під час завантаження браслетів</p>';
//     }

//     // --- Функція рендеру ---
//     function renderProducts(items) {
//         container.innerHTML = '';
//         if (items.length === 0) {
//             container.innerHTML = '<p>Браслетів не знайдено</p>';
//             return;
//         }

//         items.forEach(item => {
//             const html = `
//                 <div class="product">
//                     <a href="../pages/pageBrasletProduct${item.Product_Id}.html">
//                         <img class="photoProduct" src="../images/PhotoBraslet/Product${item.Product_Id}/photo${item.Product_Id}.jpg" alt="${item.Product_Name}"><br>
//                     </a>
//                     <div class="name-product">${item.Product_Name}</div>
//                     <div class="price-product">${item.Product_Price} ₴</div>
//                 </div>
//             `;
//             container.innerHTML += html;
//         });
//     }

//     // --- Пошук за назвою ---
//     searchInput.addEventListener('input', () => {
//         const query = searchInput.value.toLowerCase();
//         const filtered = products.filter(p => p.Product_Name.toLowerCase().includes(query));
//         renderProducts(filtered);
//     });

//     // --- Фільтри ---
//     // Ціна
//     document.querySelector('button[value="increase-prise"]').addEventListener('click', () => {
//         const sorted = [...products].sort((a, b) => parseFloat(a.Product_Price) - parseFloat(b.Product_Price));
//         renderProducts(sorted);
//     });

//     document.querySelector('button[value="reduced-price"]').addEventListener('click', () => {
//         const sorted = [...products].sort((a, b) => parseFloat(b.Product_Price) - parseFloat(a.Product_Price));
//         renderProducts(sorted);
//     });

//     // Тип виробу, колір, наявність
//     document.querySelectorAll('.field button').forEach(button => {
//         button.addEventListener('click', () => {
//             const fieldset = button.closest('fieldset');
//             const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]:checked');
//             const values = Array.from(checkboxes).map(cb => cb.value);

//             let filtered = [...products];

//             const legend = fieldset.querySelector('legend').textContent;

//             if (legend.includes('Тип виробу') && values.length > 0) {
//                 filtered = filtered.filter(p => values.includes(p.Product_Model));
//             }

//             if (legend.includes('Колір') && values.length > 0) {
//                 filtered = filtered.filter(p => values.includes(p.Product_Color));
//             }

//             if (legend.includes('Наявність') && values.length > 0) {
//                 filtered = filtered.filter(p => values.includes(p.Product_Availability));
//             }

//             renderProducts(filtered);
//         });
//     });


// });
// //Реєстрація/Логін
// const myButton = document.querySelector('#RL');
// const destinationUrl = '../pages/pageRegister.html';
// myButton.addEventListener('click', () => {
//     window.location.href = destinationUrl;
// });


document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');

    const PRODUCT_TYPE = container.dataset.type;

    let products = [];

    // --- Завантаження продуктів ---
    try {
        const res = await fetch(`http://localhost:3000/products/${encodeURIComponent(PRODUCT_TYPE)}`);
        if (!res.ok) throw new Error(`Не вдалося завантажити ${PRODUCT_TYPE}`);
        products = await res.json();

        if (products.length === 0) {
            container.innerHTML = `<p>${PRODUCT_TYPE} не знайдено</p>`;
            return;
        }

        renderProducts(products);

    } catch (err) {
        console.error(`Помилка завантаження ${PRODUCT_TYPE}:`, err);
        container.innerHTML = `<p>Сталася помилка при завантаженні ${PRODUCT_TYPE}</p>`;
    }

    // --- Функція рендеру ---
    function renderProducts(items) {
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = `<p>${PRODUCT_TYPE} не знайдено</p>`;
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'product';

            // Створюємо посилання на сторінку продукту
            const link = document.createElement('a');
            link.href = `page${item.Product_Type}Product${item.Product_Id}.html`;

            // Картинка
            const img = document.createElement('img');
            img.src = `../images/Product${item.Product_Id}/photo1.jpg`;
            img.alt = item.Product_Name;
            img.className = 'photoProduct';

            link.appendChild(img);  
            div.appendChild(link);

            // Назва та ціна
            const nameDiv = document.createElement('div');
            nameDiv.className = 'name-product';
            nameDiv.textContent = item.Product_Name;

            const priceDiv = document.createElement('div');
            priceDiv.className = 'price-product';
            priceDiv.textContent = item.Product_Price + ' ₴';

            div.appendChild(nameDiv);
            div.appendChild(priceDiv);

            container.appendChild(div);
        });

    }


    // --- Пошук ---
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = products.filter(p => p.Product_Name.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    // --- Фільтри ---
    // Ціна
    document.querySelector('button[value="increase-prise"]').addEventListener('click', () => {
        const sorted = [...products].sort((a, b) => parseFloat(a.Product_Price) - parseFloat(b.Product_Price));
        renderProducts(sorted);
    });

    document.querySelector('button[value="reduced-price"]').addEventListener('click', () => {
        const sorted = [...products].sort((a, b) => parseFloat(b.Product_Price) - parseFloat(a.Product_Price));
        renderProducts(sorted);
    });

    // Тип виробу, колір, наявність
    document.querySelectorAll('.field button').forEach(button => {
        button.addEventListener('click', () => {
            const fieldset = button.closest('fieldset');
            const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]:checked');
            const values = Array.from(checkboxes).map(cb => cb.value);

            let filtered = [...products];

            const legend = fieldset.querySelector('legend').textContent;

            if (legend.includes('Тип виробу') && values.length > 0) {
                filtered = filtered.filter(p => values.includes(p.Product_Model));
            }

            if (legend.includes('Колір') && values.length > 0) {
                filtered = filtered.filter(p => values.includes(p.Product_Color));
            }

            if (legend.includes('Наявність') && values.length > 0) {
                filtered = filtered.filter(p => values.includes(p.Product_Availability));
            }

            renderProducts(filtered);
        });
    });
});
