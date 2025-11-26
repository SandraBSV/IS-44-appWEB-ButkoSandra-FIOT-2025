document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".button");
    const rlButton = document.querySelector("#RL");

    // Встановити текст кнопки у шапці відповідно до статусу
    if (localStorage.getItem("userId")) {
        rlButton.textContent = "Cabinet";
    } else {
        rlButton.textContent = "Register/Login";
    }

    // Обробник натискання кнопки ВИЙТИ
    logoutButton.addEventListener("click", () => {

        // Видаляємо дані авторизації
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        // Заміна кнопки у шапці
        rlButton.textContent = "Register/Login";

        // Переадресація на головну
        window.location.href = "../index.html";
    });
});
