const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const cryptoController = require('./controllers/cryptoController');

router.use(homeController);
router.use(authController);
router.use('/crypto', cryptoController);
//when we do something else than above 
router.all('*', (req, res) => {
    res.render('home/404');
});

module.exports = router;