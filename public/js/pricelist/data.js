function basketTrigger(id) {
    if(basket.includes(id)){
        removeFromBasket(id);
    } else {
        addToBasket(id);
    }
}

function addToBasket(id) {
    basket[basket.length] = id;
    $('#' + id).addClass("text-success");
    calcBasket();
}

function removeFromBasket(id) {
    $('#' + id).removeClass("text-success");
    basket = basket.filter(item => {
        return item != id;
    });
    calcBasket();
}

function calcBasket() {
    var sum = parseFloat(0.00);
    var min = parseFloat(0.00);
    var parts = parseFloat(0.00);
    mainData.forEach(model => {
         var pricelist = model.prices.filter(price => {
            return basket.includes(price._id);
        });
        pricelist.sort((a, b) => {
            return parseFloat(a.labour) < parseFloat(b.labour);
        });
        pricelist.forEach((price, i) => {
            $("#" + price._id).addClass('text-success');
            var cost = 0;
            price.parts.forEach(part => {
                console.log(part);
                cost += parseFloat(part.part.cost) * part.amount;
            });
            if(i===0){
                sum += parseFloat(cost) + parseFloat(price.labour);
                min += parseFloat(cost) + (parseFloat(price.labour) * (parseFloat(price.min) / 100));
                parts += parseFloat(cost);
                console.log("First: " + price.labour);
            } else {
                sum+= parseFloat(cost) + (parseFloat(price.labour) * (parseFloat(price.second) / 100));
                min += parseFloat(cost) + (parseFloat(price.labour) * (parseFloat(price.second) / 100));                
                parts += parseFloat(cost);
                console.log("Next: " + price.labour);
            }
        });
    });
    $("#basket").text(total_round(sum));
    $("#min").text(total_round(min));
    $("#partscost").text(parts.toFixed(2));
}
