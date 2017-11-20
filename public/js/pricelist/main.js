var mainData = [];
var basket = [];

var objectsData = [];

var loaded = false;

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
    loaded = false;
    $("table").html('<div class="spinner"></div><h1 class="text-center">LOADING...</h1>'); 
    var url = urlAdd($(location).attr('origin'), 'api/pricelist')
    $.get(url)
        .done(data => {
            mainData = data;
            drawTable();
            if(typeof cb === 'function'){
                cb();
            }
            loaded = true;
        });
}

// function that wil check if part with partName exist and then run function cb with part object named partName
function getPart(partName, cb) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if( typeof cb === 'function'){
                if(this.responseText) {
                    cb(JSON.parse(this.responseText));
                } else
                    cb(false);
            }
        }
    };
    xmlhttp.open("POST", sql_getpart + partName, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function addWrite() {

}
