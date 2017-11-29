
// when the add/edit form is submitted
$("#partForm").submit(function (e) {
    e.preventDefault();
    // TODO - some data validation

    //take id from hidden id field
    var id = $("#localId").val();
    updateFromForm();
    if(id == dataholder) {
        dataholder = -1;
    }
    editPriceRow(id);
    clearAddForm();
    parent.$.fancybox.close();
});

// // updates element in mainData with infro from form
// function updateFromForm() {
//     var id = $("#localId").val();
//     mainData[id].model = $("#model").val();
//     mainData[id].part = $("#part").val();
//     mainData[id].labour = $("#labour").val();
//     mainData[id].min = $("#minPercentage").val();
//     mainData[id].second = $("#second").val();
//     mainData[id].parts = parts_tmp;
// }

// clears add/edit form
function clearAddForm() {
    $("#editId").val('');
    $("#localId").val('');
    $("#formElement").trigger("reset");
    parts_tmp = [];
    $('#partsDiv').addClass('hidden').html('');
    
    $("#partNumber").removeClass("is-invalid");
}





function editPriceRow(row) {
    var data = JSON.stringify(mainData[row]);
    $.ajax({
        type: "POST",
        url: sql_setprice + mainData[row].id,
        data: data,
        cache: false,
        success: function (response) {
            console.log(response);
            jsonFromPhp();
        }
    });
}

function sendParts(id) {
    var data = JSON.stringify(mainData[id].parts);
    $.ajax({
        type: "POST",
        url: sql_setparts + mainData[id].id,
        data: data,
        cache: false,
        success: function (response) {
            console.log(response);
        }
    });
}
