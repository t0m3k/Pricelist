var mainData = [];
var basket = [];

var objectsData = [];


// It'll run when all data is retrieved frim databse and table is fully drawn.
function Main() {
    checkList();
}

function checkList() {

}

// Run function that will receive pricelist from database
$(document).ready(function () {
    getData();
});

// get data and draw table
function getData(cb) {
    $("table").html('<div class="spinner"></div><h1 class="text-center">LOADING...</h1>'); 
    var url = urlAdd($(location).attr('origin'), 'api/pricelist')
    $.get(url)
        .done(data => {
            mainData = data;
            drawTable();
            if(typeof cb === 'function'){
                cb();
            }
        });
}



function addWrite() {

}
