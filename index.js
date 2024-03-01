const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { authentication } = require('./middlewares/authMiddleware');

const app = express();

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

app.set('view engine', 'hbs');

app.use('/static', express.static('public')); //in html style path replacing with correct way
app.use(express.urlencoded({extended: false})); //parsing data from forms with post, parsing and receiving in req.body
app.use(cookieParser()); //middleware
app.use(authentication); //before routes and after cookieparser
app.use(routes);

//can change the db name 
mongoose.set('strictQuery', false); //when is wrong giving all queries
mongoose.connect(`mongodb://127.0.0.1:27017/crypto`);

app.listen(5000, () => {
    console.log(`Server is running on port 5000...`);
});