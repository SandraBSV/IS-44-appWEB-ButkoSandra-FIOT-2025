// public/scripts/register.js
const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const button = form.querySelector('.button');

  button.addEventListener('click', async () => {

    // Забираємо поля по name — надійно і без помилок
    const lastName = form.querySelector('input[name="firstname"]').value.trim();
    const firstName = form.querySelector('input[name="lastname"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;

    // Валідація
    if (!firstName || !lastName || !phone || !email || !password) {
      alert("Будь ласка, заповніть усі поля.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Customer_FirstName: firstName,
          Customer_LastName: lastName,
          Customer_Phone: phone,
          Customer_Email: email,
          Customer_Password: password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Сталася помилка при реєстрації.");
        return;
      }

      // Зберігаємо логін
      localStorage.setItem('userId', data.customerId);
      localStorage.setItem('userRole', String(data.role)); // 2 = User

      // Перехід в особистий кабінет
      window.location.href = '../pages/pageCabinet.html';

    } catch (err) {
      console.error(err);
      alert("Не вдалося підключитися до сервера.");
    }
  });
});
