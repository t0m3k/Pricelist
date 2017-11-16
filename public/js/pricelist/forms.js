
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


// updates add/edit form with element that will be edited or dataholder if adding new element
function editPriceForm(id = false) {
    clearAddForm(); // clears form and all tmp data
    if (id === false) {
        // if adding new element use dataholder
        $("#localId").val(dataholder);
        $("#editId").val(mainData[dataholder].id);
        console.log("New item id: " + mainData[dataholder].id);
    } else {
        // if editing current element use it's data from mainData
        $("#localId").val(id);
        $("#model").val(mainData[id].model);
        $("#part").val(mainData[id].part);
        $("#labour").val(mainData[id].labour);
        $("#minPercentage").val(mainData[id].min);
        $("#second").val(mainData[id].second);
        if (mainData[id].parts) {
            parts_tmp = mainData[id].parts;
            listParts(parts_tmp);

        };
        
        console.log("Editing item id: " + mainData[id].id);
    }
};

// updates element in mainData with infro from form
function updateFromForm() {
    var id = $("#localId").val();
    mainData[id].model = $("#model").val();
    mainData[id].part = $("#part").val();
    mainData[id].labour = $("#labour").val();
    mainData[id].min = $("#minPercentage").val();
    mainData[id].second = $("#second").val();
    mainData[id].parts = parts_tmp;
}

// clears add/edit form
function clearAddForm() {
    $("#editId").val('');
    $("#localId").val('');
    $("#formElement").trigger("reset");
    parts_tmp = [];
    $('#partsDiv').addClass('hidden').html('');
    
    $("#partNumber").removeClass("is-invalid");
}

// add parts button
$("#addPartButton").click(function () {
    // runs getPart function that will confirm if part is genuine 
    getPart($("#partNumber").val(), function (newPart) {
        var amount = $("#partAmount").val();
        $("#partNumber").removeClass("is-invalid");
        
        if (newPart) { // check if part was returned
            parts_tmp.push({
                part:  newPart.part,
                amount: amount,
                description: newPart.description,
                cost: newPart.cost
            })
            
            // add part to parts_tmp, they'll be saved to database when form is successfully submitted
            listParts(parts_tmp);

            //after part is successfuly added clear add part fields
            $("#partNumber").val('');
            $("#partAmount").val('1');
        } else {
            $("#partNumber").addClass("is-invalid");
            console.log("Couldn't find part number, check: " + sql_getpart);
        }
    })
});

function listParts(parts) {
    var parts_html = '<div><label for="parts">Parts:</label></div>';
    parts.forEach(function (part) {
        parts_html += '<div class="row  top-buffer"><div class="col-9"><input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.part + '"></div>';
        parts_html += '<div class="col"><input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.amount + '"></div></div>';
        parts_html +=   '<div class="row"><div class="col-9">' +
                        '<input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.description + '">' +
                        '</div>' +
                        '<div class="col">' +
                        '<input type="text" class="form-control parts-text form-control-sm" readonly value="' + (part.cost * 1.2).toFixed(2) + '">' +
                        '</div></div>';
    }, this);
    
    parts_html += '<a href="javascript:;" class="btn btn-danger btn-sm top-buffer" onclick="removeParts()">Remove parts</a>';
    $('#partsDiv').removeClass('hidden').html(parts_html);
};

function removeParts() {
    console.log("Removing all parts");
    $("#partNumber").val('');
    $("#partAmount").val('1');
    if(parts_tmp) {
        $('#partsDiv').addClass('hidden');
        parts_tmp = [];

    };
};

function editPriceRow(row) {
    var data = JSON.stringify(mainData[row]);
    console.log(data);
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
};

function sendParts(id) {
    var data = JSON.stringify(mainData[id].parts);
    console.log(data);
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

function newDataHolder() {
    var data = JSON.stringify({
        model: dtholder_name,
        part: dtholder_name,
        labour: 0,
        second: 0,
        min: 0,
        cost: 0
    });
    console.log("Creating dataholder");
    $.ajax({
        type: "POST",
        url: sql_setprice,
        data: data,
        cache: false,
        success: function (response) {
            console.log(response);
            jsonFromPhp();
        }
    });

}