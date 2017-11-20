var mainData = [];
var basket = [];
var parts_tmp = [];
var site_address = "http://tracz.me/samsung/"; // the main page address fo db requests


// below all address used for data queries
var sql_getall = site_address + "pricelist/data/get_pricelist/";
var sql_getparts = site_address + "pricelist/data/get_parts/";
var sql_getpart = site_address + "pricelist/data/get_part/";
var sql_setparts  = site_address + "pricelist/data/set_parts/";
var sql_setprice  = site_address + "pricelist/data/set_price/";

// privileges of current user

var user;

// dataholder is localization in mainData where temoporary data is holded
var dataholder = -1;
var dtholder_name = "dATAhOLDER";


var edit = true;
var stopper;

var objectsData = [];


// It'll run when all data is retrieved frim databse and table is fully drawn.
function Main() {
    checkList();
    mainData.forEach(repair => {
        var object = {};
        object.part = repair.part;
        object.labour = repair.labour;
        object.second = repair.second;
        object.min = repair.min;
        if(repair.parts){
            object.parts = repair.parts;
        }
        if(!(repair.model in objectsData)){
            objectsData[repair.model] = [];
        }
        objectsData[repair.model].push(object);
    });
    console.log(objectsData);
}

function checkList() {
    if(dataholder == -1) {
        console.log("No dataholder!");
        newDataHolder();
    } else {
        console.log("Dataholder id: " + mainData[dataholder].id);
    }
}


// Run function that will receive pricelist from database
$(document).ready(function () {
    getUser();
    jsonFromPhp();
});

// get data and draw table
function jsonFromPhp() {
    $("table").html('<div class="spinner"></div><h1 class="text-center">LOADING...</h1>');
    if(!user || !user.read) {
        stopper = setInterval(function(){
            if(user.read){
                clearInterval(stopper);
            }
        }, 300);
    }
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            mainData = JSON.parse(this.responseText).map(function(element, i){
                element.cost = parseFloat(element.cost);
                element.labour = parseFloat(element.labour);
                if(element.model == dtholder_name ) {
                    dataholder = i; // save the dataholder position
                }
                return element;
            });
            drawTable();
            Main();
        }
    };
    xmlhttp.open("GET", sql_getall, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
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

function getUser() {
    var url = urlAdd($(location).attr('href'), "currentUser");
    $.get(url)
    .done(data => {
        user = data;
    });
}