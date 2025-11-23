// const myButton = document.querySelector('#RL');
// const destinationUrl = '../pages/pageRegister.html';
// myButton.addEventListener('click', () => {
//     window.location.href = destinationUrl;
// });


// document.addEventListener('DOMContentLoaded', () => {
//     // --- Карусель фото ---
//     const productDiv = document.querySelector('.product');

//     // Шлях до папки з фото (обов'язково слеш в кінці)
//     const photoFolder = '../images/PhotoBraslet/Product1/';

//     // Масив файлів фото
//     const photos = [
//         'photo1.jpg',
//         'photo2.jpg',
//         'photo3.jpg',
//         'photo4.jpg'
//     ];

//     let currentIndex = 0;

//     // Створюємо img, якщо ще немає
//     let imgElement = productDiv.querySelector('img');
//     if (!imgElement) {
//         imgElement = document.createElement('img');
//         imgElement.classList.add('photoProduct');
//         productDiv.appendChild(imgElement);
//     }

//     // Встановлюємо перше фото
//     imgElement.src = photoFolder + photos[currentIndex];

//     // Створюємо кнопки, якщо їх ще немає
//     let btnPrev = document.querySelector('#btnPrev');
//     let btnNext = document.querySelector('#btnNext');

//     // Функції для листання
//     btnPrev.addEventListener('click', () => {
//         currentIndex = (currentIndex - 1 + photos.length) % photos.length;
//         imgElement.src = photoFolder + photos[currentIndex];
//     });

//     btnNext.addEventListener('click', () => {
//         currentIndex = (currentIndex + 1) % photos.length;
//         imgElement.src = photoFolder + photos[currentIndex];
//     });

// });



document.addEventListener("DOMContentLoaded", async () => {

    // Беремо ID продукта з URL
    const fileName = window.location.pathname.split("/").pop(); 
    const productId = fileName.match(/\d+/)[0]; 

    if (!productId) {
        alert("Product ID not provided");
        return;
    }

    // Отримуємо дані з сервера
    let product;
    try {
        const res = await fetch(`http://localhost:3000/product/id/${productId}`);
        product = await res.json();
    } catch (e) {
        console.error("Помилка завантаження продукту", e);
        return;
    }

    // Карусель фото
    const productDiv = document.querySelector(".product");
    const photoFolder = '/images/Product' + product.Product_Id + '/';

    // Масив потенційних фото
    const photos = ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"];

    // Функція перевірки існування фото
    const fsCheckPhoto = async (path) => {
        try {
            const res = await fetch(path);
            return res.ok;
        } catch {
            return false;
        }
    };

    // Знайти перше існуюче фото
    let currentIndex = 0;
    const imgElement = document.createElement("img");
    imgElement.classList.add("photoProduct");

    for (let i = 0; i < photos.length; i++) {
        if (await fsCheckPhoto(photoFolder + photos[i])) {
            imgElement.src = photoFolder + photos[i];
            currentIndex = i;
            break;
        }
    }

    productDiv.appendChild(imgElement);

    // Кнопки каруселі
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    btnPrev.addEventListener("click", async () => {
        let loopCount = 0;
        do {
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
            loopCount++;
            if (loopCount > photos.length) return;
        } while (!(await fsCheckPhoto(photoFolder + photos[currentIndex])));
        imgElement.src = photoFolder + photos[currentIndex];
    });

    btnNext.addEventListener("click", async () => {
        let loopCount = 0;
        do {
            currentIndex = (currentIndex + 1) % photos.length;
            loopCount++;
            if (loopCount > photos.length) return;
        } while (!(await fsCheckPhoto(photoFolder + photos[currentIndex])));
        imgElement.src = photoFolder + photos[currentIndex];
    });

});
