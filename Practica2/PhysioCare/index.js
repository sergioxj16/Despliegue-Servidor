const express = require('express');
const mongoose = require('mongoose');

const app = express(8080);


mongoose.connect('mongodb://localhost:27017/physiocare')
    .then(() => {
    console.log('Successful connection to MongoDB');
    loadData();
    })
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    });
