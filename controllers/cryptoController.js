const router = require('express').Router();

const { paymentMethodsMap } = require('../constants');
const { isAuth } = require('../middlewares/authMiddleware');
const cryptoService = require('../services/cryptoService');
const { getErrorMessage } = require('../utils/errorUtils');
const { getPaymentMethodViewData } = require('../utils/viewDataUtils');

router.get('/catalog', async (req, res) => {
   const crypto = await cryptoService.getAll();

   res.render('crypto/catalog', { crypto }); //pass it here the lean object from method
   //{ crypto: [] }) for testing if no cryptos to show no cryptos bellow
});

router.get('/search', async (req, res) => {
   const { name, paymentMethod } = req.query; //query is get request
   const crypto = await cryptoService.search(name, paymentMethod);
   const paymentMethods = getPaymentMethodViewData(paymentMethod);

   res.render('crypto/search', { crypto, paymentMethods, name });
});

router.get('/:cryptoId/details', async (req, res) => {
   const crypto = await cryptoService.getOne(req.params.cryptoId); //returning the crypto by id and find the details  page for it

   const isOwner = crypto.owner == req.user?._id; //if have user return it, else is it false // == equality operator
   //const isOwner = crypto.owner.toString() === req.user?._id;  --> object.toString(), === identity operator, object-object, string-string

   const isBuyer = crypto.buyers?.some(id => id == req.user._id); //in buyers with this id if someone buy it //? if not have a buyer undefiend

   crypto.paymentMethod = paymentMethodsMap[crypto.paymentMethod]; //label to show in detail page

   res.render('crypto/details', { crypto, isOwner, isBuyer }); //view data, crypto/details--> view, {crypto, isOwner} --> data for view
});

router.get('/:cryptoId/buy', isAuth, async (req, res) => {
   try{
      await cryptoService.buy(req.user._id, req.params.cryptoId);
   }catch(error){
      return res.status(400).render('404', {error: getErrorMessage(error)});
   }
  
   res.redirect(`/crypto/${req.params.cryptoId}/details`);
});

router.get('/:cryptoId/edit', isAuth, async (req, res) => {
   const crypto = await cryptoService.getOne(req.params.cryptoId); // for access -> for crypto.name, crypto.image 
   const paymentMethods = getPaymentMethodViewData(crypto.paymentMethod);
   // console.log(paymentMethods);

   res.render('crypto/edit', { crypto, paymentMethods });
});


router.post('/:cryptoId/edit', isAuth, async (req, res) => {
   const cryptoData = req.body;
   await cryptoService.edit(req.params.cryptoId, cryptoData); //editing this req.params.cryptoId, with this cryptoData

   //Check if owner

   res.redirect(`/crypto/${req.params.cryptoId}/details`);
})

router.get('/:cryptoId/delete', isAuth, async (req, res) => {
   await cryptoService.delete(req.params.cryptoId);

   //Check if owner

   res.redirect('/crypto/catalog')
})


router.get('/create', isAuth, (req, res) => {
   res.render('crypto/create');
});

router.post('/create', isAuth, async (req, res) => {
   const cryptoData = req.body;

   //whe we have await always use try and catch
   try {
      await cryptoService.create(req.user._id, cryptoData); //calling our service, creatin db and validation and create our data, req.user_id --> req.user_id
   } catch (error) {
      return res.status(400).render('crypto/create', { error: getErrorMessage(error) }); //when we have mistake to return in same page with the error message
   }

   res.redirect('/crypto/catalog');
});

module.exports = router;