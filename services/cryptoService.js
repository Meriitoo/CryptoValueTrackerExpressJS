const Crypto = require('../models/Crypto');

exports.getAll = () => Crypto.find({}).lean(); //find my all crypto we have, lean is receiving a object

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).lean();

exports.search = async (name, paymentMethod) => {
    let crypto = await this.getAll();

    if (name){
        crypto = crypto.filter(x => x.name.toLowerCase() == name.toLowerCase());
    }

    if (paymentMethod){
        crypto = crypto.filter(x => x.paymentMethod == paymentMethod);
    }

    return crypto;
};


exports.buy = async (userId, cryptoId) => {
    const crypto = await Crypto.findById(cryptoId); //wrong --> two request for one operation
    //Todo: if user already bought the crypto
    crypto.buyers.push(userId);

    return await crypto.save();

    // Crypto.findByIdAndUpdate(cryptoId, { $push: { buyers: userId }}); //find one and update, push userId in buyers
}

//adding owner in crypto db function, for relation
exports.create = (ownerId, cryptoData) => Crypto.create({ ...cryptoData, owner: ownerId }); 

exports.edit = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true }); //runValidators: true--> when we update!!

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);