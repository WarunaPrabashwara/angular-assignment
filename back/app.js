// app.js

const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());
const bodyParser = require('body-parser');

// Use body-parser middleware to parse JSON requests
//app.use(bodyParser.json());

// Parse URL-encoded bodies (deprecated in Express 4.16+)
//app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + "/uploads/images"));

// Import route files
const userRoutes = require('./routes/admin');

// Use routes in the application
app.use('/admin', userRoutes);


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
