function getFirstMongooseError(error) {
   const firstError = Object.values(error.errors)[0].message;
   return firstError;

//    const errors = Object.keys(error.errors).map(key => error.errors[key].message);
//    return errors[0];
}

exports.getErrorMessage = (error) => {
    switch (error.name) {
        case 'Error':
            return error.message
        case 'ValidationError':
            return getFirstMongooseError(error);
        default:
            return error.message;
    }

};