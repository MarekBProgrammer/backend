const express = require('express');
const { client, connectDb } = require('./connect.js');
const { syncDataToDB } = require('./database.js');
const { instal } = require('./filter.js');
const fs = require('fs');
const { ReturnDocument } = require('mongodb');
const auth = require('./autorization.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
const port = PORT;

// call sync after DB connection established

app.get('/orders', auth, async (req, res) => {
    try {
        const db = client.db('idosellDB');
        const collection = db.collection('orders');

        const minWorth = req.query.minWorth ? Number(req.query.minWorth) : 0;
        const maxWorth = req.query.maxWorth ? Number(req.query.maxWorth) : Number.MAX_SAFE_INTEGER;

        const filter = {
            price: {
                $gte: minWorth,
                $lte: maxWorth,
            },
        };

        const orders = await collection.find(filter).toArray();

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        const headers = Object.keys(orders[0]).join(',');
        const rows = orders.map(order => Object.values(order).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        res.send(csvContent);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/', auth, async (req, res) => {
    try {
        const db = client.db('idosellDB');
        const collection = db.collection('orders');
        const orders = await collection.find({}).toArray();
        res.json(orders);

    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/order/:orderId', auth, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const db = client.db('idosellDB');
        const collection = db.collection('orders');

        const minWorth = req.query.minWorth ? Number(req.query.minWorth) : 0;
        const maxWorth = req.query.maxWorth ? Number(req.query.maxWorth) : Number.MAX_SAFE_INTEGER;

        const instaledOrderId = isNaN(orderId) ? orderId : Number(orderId);
        
        const filter = {
            orderId: instaledOrderId,
            price: {
                $gte: minWorth,
                $lte: maxWorth,
            },
        };

        const order = await collection.findOne(filter);

        if (order) {
            const headers = Object.keys(order).join(',');
            const values = Object.values(order).join(',');
            const csvContent = `${headers}\n${values}`;

            res.header('Content-Type', 'text/csv');
            res.attachment(`order_${instaledOrderId}.csv`);
            res.send(csvContent);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

connectDb().then(() => {
    syncDataToDB();
    setInterval(syncDataToDB, 120000);
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    }); 
}).catch(err => {
    console.error('Failed to connect to the database', err);
});
