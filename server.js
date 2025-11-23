
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

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

// // GET: універсальне
// app.get('/products/:type', (req, res) => {
//     const type = req.params.type; 
//     const sql = "SELECT * FROM Product WHERE Product_Type=?";
//     connection.query(sql, [type], (err, results) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(results);
//     });
// });

//GET: браслети
// app.get('/products/braslets', (req, res) => {
//     const sql = "SELECT * FROM Product WHERE Product_Type='braslet'";
//     connection.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(results);
//     });
// });

// //GET: джгути
// app.get('/products/braslets', (req, res) => {
//     const sql = "SELECT * FROM Product WHERE Product_Type='jgut'";
//     connection.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(results);
//     });
// });

// =====================
// CRUD для браслетів (адмін-частина)
// =====================

//GET: браслети
// app.get('/products/braslets', (req, res) => {
//     const sql = "SELECT * FROM Product WHERE Product_Type='braslet'";
//     connection.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(results);
//     });
// });

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

// app.get('/products/:type', (req, res) => {
//     const type = req.params.type;
//     const sql = 'SELECT * FROM Product WHERE Product_Type=?';
//     connection.query(sql, [type], (err, results) => {
//         if (err) return res.status(500).json({ error: 'Помилка сервера' });
//         res.json(results);
//     });
// });

// PUT: оновити продукт
// app.put('/products/:id', (req, res) => {
//     const id = req.params.id;
//     const { Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability } = req.body;
//     const sql = `UPDATE Product SET 
//         Product_Name=?, Product_Price=?, Product_Type=?, Product_Color=?, Product_Model=?, Product_Description=?, Product_Availability=? 
//         WHERE Product_Id=?`;
//     connection.query(sql, [Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability, id], (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'Продукт не знайдено' });
//         res.json({ message: 'Продукт оновлено' });
//     });
// });

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

// // POST: додати новий браслет
// app.post('/products', (req, res) => {
//     const { Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability } = req.body;
//     const sql = `INSERT INTO Product 
//         (Product_Name, Product_Price, Product_Type, Product_Color, Product_Model, Product_Description, Product_Availability)
//         VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
//     connection.query(sql, 
//         [Product_Name, Product_Price, Product_Type || 'браслет', Product_Color, Product_Model, Product_Description, Product_Availability],
//         (err, result) => {
//             if (err) {
//                 console.error('Помилка SQL:', err);
//                 return res.status(500).json({ error: 'Помилка сервера' });
//             }
//             res.status(201).json({ Product_Id: result.insertId, ...req.body });
//         }
//     );
// });


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
// app.delete('/products/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "DELETE FROM Product WHERE Product_Id=?";
//     connection.query(sql, [id], (err, result) => {
//         if (err) {
//             console.error('Помилка SQL:', err);
//             return res.status(500).json({ error: 'Помилка сервера' });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Браслет не знайдено' });
//         }
//         res.json({ message: 'Браслет видалено' });
//     });
// });

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

// =====================
// Запуск сервера
// =====================
const PORT = 3000;
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
