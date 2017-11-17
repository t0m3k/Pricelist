var mainData = [];
var basket = [];
var parts_tmp = [];
var site_address = "http://tracz.me/samsung/" // the main page address fo db requests


// below all address used for data queries
var sql_getall = site_address + "pricelist/data/get_pricelist/";
var sql_getparts = site_address + "pricelist/data/get_parts/";
var sql_getpart = site_address + "pricelist/data/get_part/";
var sql_setparts  = site_address + "pricelist/data/set_parts/";
var sql_setprice  = site_address + "pricelist/data/set_price/";

// dataholder is localization in mainData where temoporary data is holded
var dataholder = -1;
var dtholder_name = "dATAhOLDER";


var edit = true;


// It'll run when all data is retrieved frim databse and table is fully drawn.
function Main() {
    checkList();
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
    jsonFromPhp();
});

// get data and draw table
function jsonFromPhp() {
    console.log("Loading!!");

    $("table").html('<div class="spinner"></div><h1 class="text-center">LOADING...</h1>');
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            mainData = JSON.parse(this.responseText);
            for (var i = 0; i < mainData.length; i++) {
                mainData[i].cost = parseFloat(mainData[i].cost);
                mainData[i].labour = parseFloat(mainData[i].labour);
                if(mainData[i].model == dtholder_name ) {
                    dataholder = i; // save the dataholder position
                }
            }
            drawTable();
            Main();
        }
    };
    xmlhttp.open("GET", sql_getall, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
};

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
};