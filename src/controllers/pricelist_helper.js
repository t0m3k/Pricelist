var Part                    = require('../models/pricelist/part');

exports.getParts = function(parts) { //
    return new Promise((resolve, reject) => {
        var resultParts = [];
        var findPartsPromise = []; // create array of promises to which promise for each FOUND PART will be saved
        parts.map(part => {             
            findPartsPromise.push(Part.findById(part._id));
        });
        Promise.all(findPartsPromise)
        .then((foundParts) => { // when all promises for Part.findById
            var newPartsPromise = []; // create array of promises to which promise of each NEW PART will be saved
            foundParts.forEach((foundPart) => {
                if(foundPart){
                    let amount = parts.find(part => part._id == foundPart._id).amount;
                    resultParts.push({part: foundPart, amount: amount}); // push found part to price.parts array
                    parts = parts.filter(part => part._id != foundPart._id); // remove found part from parts array
                }
            });
            parts.forEach(newPart => {
                newPartsPromise.push(Part.create(newPart)); // for each part that wasn't found create new part
            });
            Promise.all(newPartsPromise)
            .then((newParts) => { // when all promises for Part.create are finished we will save new parts
                newParts.forEach((newPart) => {
                    if(newPart){
                        let amount = parts.find(part => part._id == newPart._id).amount;
                        resultParts.push({part: newPart, amount: amount});
                    }
                });
                resolve(resultParts);
            })       
        })
        .catch(err => {
            reject(err);
        }); 
    });
}


module.exports = exports;