const express = require('express');
const pool = require('./database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());

// Get all inventory items
app.get('/egi', (req, res) => {
    pool.query('SELECT * FROM inventory', (error, results) => {
        if (error) throw error; 
        res.status(200).json(results);
    });
});

// Get a single inventory item by ID
app.get('/egi/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM inventory WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('inventory tidak ditemukan');
        }
    });
});

app.post('/egi', (req, res) => {
    const { nama_produk, jumlah, harga, tgl_masuk } = req.body;
    if (!nama_produk || !jumlah || !harga || !tgl_masuk) {
        return res.status(400).send('Semua field harus diisi');
    }

    const query = 'INSERT INTO inventory (nama_produk, jumlah, harga, tgl_masuk) VALUES (?, ?, ?, ?)';
    pool.query(query, [nama_produk, jumlah, harga, tgl_masuk], (error, results) => {
        if (error) throw error;
        res.status(201).send('inventory berhasil ditambahkan dengan ID: ${results.insertId}');
    });
});


// Update an existing inventory item
app.put('/egi/:id', (req, res) => {
    const { id } = req.params;
    const { nama_produk, jumlah, harga, tgl_masuk } = req.body;
    if (!nama_produk || !jumlah || !harga || !tgl_masuk) {
        return res.status(400).send('Semua field harus diisi');
    }

    const query = 'UPDATE inventory SET nama_produk = ?, jumlah = ?, harga = ?, tgl_masuk = ? WHERE id = ?';
    pool.query(query, [nama_produk, jumlah, harga, tgl_masuk, id], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).send('inventory tidak ditemukan');
        }
        res.status(200).send('inventory berhasil diubah');
    });
});

// Delete an inventory item
app.delete('/egi/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventory WHERE id = ?';
    pool.query(query, [id], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).send('inventory tidak ditemukan');
        }
        res.status(200).send('inventory berhasil dihapus');
    });
});

app.listen(port, () => {
    console.log('Server berjalan di http://localhost:${port}');
});
