
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
function editPrice(modelId, priceId) {
    clearAddForm(); // clears form and all tmp data
    var model = mainData.find(model => {
        return model._id == modelId;
    });
    console.log(model);
    var part = model.prices.find(price => {
        return price._id == priceId;
    });
    console.log(part);
    $("#localId").val(priceId);
    $("#part").val(part.name);
    $("#labour").val(part.labour);
    $("#minPercentage").val(part.min);
    $("#second").val(part.second);
    if (part.parts) {
        listParts(part.parts);
        
        console.log("Editing item id: " + part._id);
    }
}

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
            });
            
            // add part to parts_tmp, they'll be saved to database when form is successfully submitted
            listParts(parts_tmp);

            //after part is successfuly added clear add part fields
            $("#partNumber").val('');
            $("#partAmount").val('1');
        } else {
            $("#partNumber").addClass("is-invalid");
            console.log("Couldn't find part number, check: " + sql_getpart);
        }
    });
});

function listParts(parts) {
    var parts_html = '<div><label for="parts">Parts:</label></div>';
    parts.forEach((part) => {
        parts_html += '<div class="row mt-3"><div class="col-9"><input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.part.part + '"></div>';
        parts_html += '<div class="col"><input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.amount + '"></div></div>';
        parts_html +=   '<div class="row"><div class="col-9">' +
                        '<input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.part.description + '">' +
                        '</div>' +
                        '<div class="col">' +
                        '<input type="text" class="form-control parts-text form-control-sm" readonly value="' + (part.part.cost * 1.2).toFixed(2) + '">' +
                        '</div></div>';
    }, this);
    
    parts_html += '<a href="javascript:;" class="btn btn-danger btn-sm top-buffer" onclick="removeParts()">Remove parts</a>';
    $('#partsDiv').removeClass('hidden').html(parts_html);
}

function removeParts() {
    console.log("Removing all parts");
    $("#partNumber").val('');
    $("#partAmount").val('1');
    $('#partsDiv').addClass('hidden');
    parts_tmp = [];
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
