
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// Підключення до БД
// =====================
const connection = mysql.createConnection({
    host: '127.0.1.15',
    port: 3306,
    user: 'root',
    password: '',
    database: 'FlamesOfDarkness'
});

connection.connect(err => {
    if (err) {
        console.error("Помилка підключення до БД:", err);
        process.exit(1);
    } else {
        console.log("База даних підключена успішно");
    }
});

// =====================
// Пошук продуктів
// =====================
app.get('/search', (req, res) => {
    const query = req.query.query || '';
    const sql = `
        SELECT * FROM Product 
        WHERE Product_Name LIKE ? OR Product_Description LIKE ?
    `;
    const likeQuery = `%${query}%`;

    connection.query(sql, [likeQuery, likeQuery], (err, results) => {
        if (err) {
            console.error('Помилка SQL:', err);
            return res.status(500).json({ error: 'Помилка сервера' });
        }
        res.json(results);
    });
});


app.get('/product/id/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Product WHERE Product_Id=?";
    
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: "Not found" });

        res.json(results[0]);
    });
});


// =====================
// CRUD для браслетів (адмін-частина)
// =====================

//GET: універсальне
app.get('/products/:type', (req, res) => {
    const type = req.params.type;
    const sql = "SELECT * FROM Product WHERE Product_Type = ?";
    connection.query(sql, [type], (err, results) => {
        if (err) {
            console.error('SQL помилка:', err);
            return res.status(500).json({ error: 'Помилка сервера' });
        }
        res.json(results);
    });
});


// PUT: оновити продукт
app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    const { Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability } = req.body;

    const sql = `
        UPDATE Product SET 
        Product_Name=?, Product_Price=?, Product_Type=?, Product_Color=?, Product_Model=?, Product_Description=?, Product_Availability=? 
        WHERE Product_Id=?`;

    connection.query(sql, 
        [Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability, id], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated' });
        }
    );
});

// POST: додати новий браслет
app.post('/products/:type', (req, res) => {
    const type = req.params.type;
    const { Product_Name, Product_Price, Product_Color, Product_Model, Product_Description, Product_Availability } = req.body;
    const sql = `INSERT INTO Product 
        (Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    connection.query(sql,
        [Product_Name, Product_Price, type, Product_Color, Product_Model, Product_Description, Product_Availability],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Помилка сервера' });
            res.status(201).json({ Product_Id: result.insertId, ...req.body });
        }
    );
});

// DELETE: видалити браслет
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Product WHERE Product_Id=?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    });
});


app.post('/register', async (req, res) => {
    const { Customer_FirstName, Customer_LastName, Customer_Phone, Customer_Email, Customer_Password } = req.body;

    if (!Customer_FirstName || !Customer_LastName || !Customer_Phone || !Customer_Email || !Customer_Password) {
        return res.status(400).json({ error: 'Недостатньо даних для реєстрації' });
    }

    // Перевірка на існуючого користувача
    const checkSql = `SELECT Customer_Id FROM Customer WHERE Customer_Email = ? OR Customer_Phone = ?`;
    connection.query(checkSql, [Customer_Email, Customer_Phone], async (err, rows) => {
        if (err) return res.status(500).json({ error: 'Помилка сервера' });
        if (rows.length > 0) return res.status(409).json({ error: 'Користувач з таким email або телефоном вже існує' });

        const hashedPassword = await bcrypt.hash(Customer_Password, 10);

        const insertSql = `INSERT INTO Customer (Customer_FirstName, Customer_LastName, Customer_Phone, Customer_Email, Customer_Password)
                           VALUES (?, ?, ?, ?, ?)`;

        connection.query(insertSql, [
            Customer_FirstName,
            Customer_LastName,
            Customer_Phone,
            Customer_Email,
            hashedPassword
        ], (err, result) => {
            if (err) return res.status(500).json({ error: 'Помилка вставки' });

            const customerId = result.insertId;

            // Додаємо роль User
            const roleSql = `INSERT INTO UserRole (Customer_Id, Role_Id) VALUES (?, 2)`;
            connection.query(roleSql, [customerId], (err2) => {
                if (err2) {
                    connection.query('DELETE FROM Customer WHERE Customer_Id = ?', [customerId]);
                    return res.status(500).json({ error: 'Помилка при призначенні ролі' });
                }
                return res.status(201).json({ success: true, customerId, role: 2 });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) return res.status(400).json({ error: 'Введіть логін і пароль' });

    const sql = `
        SELECT c.Customer_Id, c.Customer_Password, ur.Role_Id
        FROM Customer c
        LEFT JOIN UserRole ur ON c.Customer_Id = ur.Customer_Id
        WHERE c.Customer_Email = ? OR c.Customer_Phone = ?
    `;

    connection.query(sql, [identifier, identifier], async (err, rows) => {
        if (err) return res.status(500).json({ error: 'Помилка сервера' });
        if (rows.length === 0) return res.status(401).json({ error: 'Користувача не знайдено' });

        const dbPassword = rows[0].Customer_Password;

        // --- ПОРІВНЯННЯ ХЕШУ ---
        const passwordMatch = await bcrypt.compare(password, dbPassword);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Невірний пароль' });
        }

        const customerId = rows[0].Customer_Id;
        const roles = rows.map(r => r.Role_Id).filter(r => r != null);

        let role = 2;
        if (roles.includes(1)) role = 1;

        return res.json({ success: true, customerId, role });
    });
});


// =====================
// Запуск сервера
// =====================
const PORT = 3000;
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
