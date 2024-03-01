const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../constants');

exports.authentication = async  (req, res, next) => {

    //for all requestes -> guest users, and login users, authonticated and not
    const token = req.cookies['auth'];

    if (token) {
        try {
            const decodedToken = await jwt.verify(token, SECRET );

            req.user = decodedToken; //this is the token user receive when login
            res.locals.isAuthenticated = true;
            res.locals.user = decodedToken; //live only in request, global variable, res.locals
        }
        catch(err){
            res.clearCookie('auth'); //deleting token, it is wrong anyways

            return res.status(401).render('home/404'); //return, because it's gonna stop here and not go down for next
        }
    }

    next(); //nothing happens move to next action, continue

}

exports.isAuth = (req, res, next) => 
{
    if (!req.user) {
        res.redirect('/login');
    }

    next();
}