// public/scripts/login.js
const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const button = form.querySelector('.button');

  button.addEventListener('click', async () => {
    const inputs = form.querySelectorAll('input');
    const identifier = inputs[0].value.trim();
    const password = inputs[1].value;

    if (!identifier || !password) {
      alert('Введіть логін і пароль.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Помилка при вході');
        return;
      }

      // Очікуємо від сервера { success: true, customerId: X, role: Y }
      localStorage.setItem('userId', data.customerId);
      localStorage.setItem('userRole', String(data.role));

      // Переадресація за роллю: 1 -> адмін панель, 2 -> кабінет
      if (Number(data.role) === 1) {
        window.location.href = '../admin/index.html';
      } else {
        window.location.href = '../pages/pageCabinet.html';
      }
    } catch (err) {
      console.error(err);
      alert('Не вдалося зв\'язатися з сервером.');
    }
  });
});
