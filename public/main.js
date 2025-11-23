console.log("It is working!");

// Карусель
const track = document.querySelector('.carousel-track');
let items = document.querySelectorAll('.carousel-item');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const photoPerView = 6;
let currentIndex = 0; 

function updateCarouselPosition() {
    const offset = -(currentIndex / photoPerView) * 100;
    track.style.transform = `translateX(${offset}%)`;
}

function nextSlideGroup() {
    if (currentIndex + photoPerView < items.length) {
        currentIndex += photoPerView;
    } else {
        currentIndex = 0;
    }
    updateCarouselPosition();
}

function prevSlideGroup() {
    if (currentIndex - photoPerView >= 0) {
        currentIndex -= photoPerView;
    } else {
        const remaining = items.length % photoPerView;
        currentIndex = items.length - (remaining === 0 ? photoPerView : remaining);
    }
    updateCarouselPosition();
}

nextBtn.addEventListener('click', nextSlideGroup);
prevBtn.addEventListener('click', prevSlideGroup);
updateCarouselPosition();

// Кнопки типів
const typeButtons = document.querySelectorAll('.types-item');
const urls = [
    'pages/pageBraslet.html',
    'pages/pageJgut.html',
    'pages/pageLariat.html',
    'pages/pageSotuar.html',
    'pages/pageSulyanka.html',
    'pages/pageNamusto.html',
    'pages/pageSet.html',
    'pages/pageNY.html',
    'pages/pageBag.html',
    'pages/pageBrelok.html'
];

typeButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
        window.location.href = urls[i];
    });
});

// Кнопка Register/Login
const myButton = document.querySelector('#RL');
const destinationUrl = 'pages/pageRegister.html';
myButton.addEventListener('click', () => {
    window.location.href = destinationUrl;
});


// Пошук продуктів
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('.searchButton');
const searchResultsContainer = document.querySelector('.search-results');

// Функція для відображення результатів
function displaySearchResults(results) {
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>Нічого не знайдено</p>';
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item'); 
        resultItem.innerHTML = `
            <h3>${item.Product_Name}</h3>
            <h4>Тип: ${item.Product_Type}</h4>
            <p>Ціна: ${item.Product_Price} грн</p>
            <p>${item.Product_Description}</p>
        `;
        searchResultsContainer.appendChild(resultItem);
    });
}


// Функція для виконання пошуку
const API_BASE_URL = 'http://localhost:3000';

function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => displaySearchResults(data))
        .catch(err => {
            console.error('Помилка пошуку:', err);
            searchResultsContainer.innerHTML = '<p>Помилка при пошуку</p>';
        });
}


// Подія на кнопку
searchButton.addEventListener('click', performSearch);

// Додатково: пошук при натисканні Enter в полі
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});



