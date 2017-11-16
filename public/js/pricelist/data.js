function deleteRow(id) {
    if (confirm("Are you sure you want to delete " + mainData[id].model + " " + mainData[id].part + "?")) {
        console.log("No code to remove items :D");
        // TODO - Add code to remvoe items from list
    }
};


function basketTrigger(id) {
    if(basket.includes(id)){
        removeFromBasket(id);
    } else {
        addToBasket(id);
    }
}


function addToBasket(id) {
    if (basket.length == 0 || mainData[basket[basket.length - 1]].model == mainData[id].model) {
        basket[basket.length] = id;
        $("tr." + id).addClass("table-success");
        calcBasket();
    }
    else {
        window.alert("Cannot use parts for " + mainData[id].model + 
        " to repair: " + mainData[basket[basket.length - 1]].model + 
        " bud");
    }
    return id;
};

function removeFromBasket(id) {
    $("tr." + id).removeClass("table-success");
    var i = basket.indexOf(id);
    if (i >= 0) {
        basket[i] = -1;
        basket.sort();
        basket.shift();
    };
    calcBasket();
};

function calcBasket() {
    var sum = 0.00;
    var min = 0.00;
    var parts = 0.00;
    basket.sort(function (a, b) {
        return mainData[b].labour - mainData[a].labour;
    });

    for (var i = 0; i < basket.length; i++) {
        if (i == 0) {
            sum += mainData[basket[i]].cost + mainData[basket[i]].labour;
            min += mainData[basket[i]].cost + (mainData[basket[i]].labour * (mainData[basket[i]].min / 100));
            parts += mainData[basket[i]].cost;
        } else {
            sum += mainData[basket[i]].cost + (mainData[basket[i]].labour * (mainData[basket[i]].second / 100));
            min += mainData[basket[i]].cost + (mainData[basket[i]].labour * (mainData[basket[i]].second / 100));
            parts += mainData[basket[i]].cost;
        };
    };
    $("#basket").text(total_round(sum));
    $("#min").text(total_round(min));
    $("#partscost").text(parts.toFixed(2));
};


function exportToCSV() {
    var result = "";
    for(var i = 0; i < mainData.length; i++) {
        result += mainData[i].model + ";" + mainData[i].part + ";" + total_round(mainData[i].cost + mainData[i].labour) + '\r\n';
    }
    $('#csv').text(result).removeClass("hidden");
    
};


