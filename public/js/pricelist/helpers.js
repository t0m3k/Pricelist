function total_round(value) {
    if ((value > 20) && (value < 100)) {
        var rest = value % 5;
        if (rest == 0) {
            result = value;
        } else
        if (rest >= 2.5) {
            result = value + 5 - rest;
        } else
        if (rest < 2.5) {
            result = value - rest;
        }
    } else
    if (value > 100) {
        var rest = value % 10;
        if (rest >= 5) {
            result = value + 10 - rest;
        } else
        if (rest < 5) {
            result = value - rest;
        }
    } else {
        return value.toFixed(2);
    }
    return result.toFixed(2);
}

$("#searchclear").click(function () {
    $("#searchBox").val('');
    basket = [];
    calcBasket();
    drawTable();
});

function refreshTable() {
    getData();
    basket = [];
    calcBasket();
    $("#searchBox").val("");
};