addWrite = function(){
    addEditPrice(); // will add edit icon and listener to edit every price item
    addDeletePrice(); // add delete icon to every price item
    
    // add delete icon to every model item
    $(".model-item").each(function(){
        $(this).append(`<a href="javascript:;" class="removeModel  ml-1 btn btn-outline-danger float-right"><i class="fa fa-times" aria-hidden="true"></i></a>`);
    });
    // add listener to every delete button for model item
    $(".model-item .removeModel").click(function(event){
        event.stopPropagation();
        var myId = $(this).parent().attr('id');
        removeModel(myId);
    });
    
    // add edit icon to every model item
    $(".model-item").each(function(){
        $(this).append(`<a href="javascript:;" class="editModel ml-1 btn btn-outline-info float-right"><i class="fa fa-pencil" aria-hidden="true"></i></a>`);
    });
    // add listener to every edit button for model item
    $(".model-item .editModel").click(function(event){
        event.stopPropagation();
        var myId = $(this).parent().attr('id');
        editModel(myId);
    });
    
    // add add price icon to every model item
    $(".model-item").each(function(){
        $(this).append(`<a href="javascript:;" class="addPrice ml-1 btn btn-outline-info float-right"><i class="fa fa-plus" aria-hidden="true"></i></a>`);
    });
    // add listener to every add price button for model item
    $(".model-item .addPrice").click(function(event){
        event.stopPropagation();
        var myId = $(this).parent().attr('id');
        addPrice(myId);
    });
};

function addEditPrice() {
     // add edit icon to every price item
    $(".price-item").each(function(){
        $(this).append(`<a href="javascript:;" class="editPrice ml-1 btn btn-outline-info btn-sm float-right"><i class="fa fa-pencil" aria-hidden="true"></i></a>`);
    });

    // add listener to every edit button for price item
    $(".price-item .editPrice").click(function(event){
        event.stopPropagation();
        var priceId = $(this).parent().attr('id');
        var modelId = $(this).parents('.card-body').find('.model-item').attr('id');
        editPrice(modelId, priceId);
    });
}

function addDeletePrice() {
    // add delete icon to every price item
    $(".price-item").each(function(){
        $(this).append(`<a href="javascript:;" class="removePrice btn  ml-1 btn-outline-danger btn-sm float-right"><i class="fa fa-times" aria-hidden="true"></i></a>`);
    });
    // add listener to every delete button for price item
    $(".price-item .removePrice").click(function(event){
        event.stopPropagation();
        var myId = $(this).parent().attr('id');
        var modelId = $(this).parents('.card-body').find('.model-item').attr('id');
        removePrice(modelId, myId);
    });
}

function editPrice(modelId, priceId) {
    $.get("/other/pricelist/newForm.html")
    .done(form => {
        var model = mainData.find(model => model._id === modelId);
        var price = model.prices.find(price => price._id === priceId);
        $('#editFormContainer').html('').append(form);
        $("#part").val(price.name);
        $("#labour").val(price.labour);
        $("#minPercentage").val(price.min);
        $("#second").val(price.second);
        if(price.parts) {
            listParts(price.parts);
        }
        $('#editPriceModal').modal('show');

        // add parts button
        $("#addPartButton").click(function () {
            // runs getPart function that will confirm if part is genuine 
            getPart($("#partNumber").val(), function (newPart) {
                var amount = $("#partAmount").val();
                $("#partNumber").removeClass("is-invalid");
                if (newPart) { // check if part was returned
                    price.parts.push({
                        _id:  newPart._id,
                        amount: amount,
                        description: newPart.description,
                        cost: newPart.cost
                    });
                    
                    console.log(price.parts);
                    // add part to parts_tmp, they'll be saved to database when form is successfully submitted
                    listParts(price.parts);

                    //after part is successfuly added clear add part fields
                    $("#partNumber").val('');
                    $("#partAmount").val('1');
                } else {
                    $("#partNumber").addClass("is-invalid");
                    console.log("Couldn't find part number");
                }
            });
        });

        $("#removePartsButton").click(function () {
                    price.parts = [];
                    removeParts();
        });

        $("#formElement").submit(function (e) {
            e.preventDefault();
            // TODO - some data validation
        
            //take id from hidden id field
            $("#modelId").val();
            price.name = $("#part").val();
            price.labour = $("#labour").val();
            price.min = $("#minPercentage").val();
            price.second = $("#second").val();

            var url = urlAdd($(location).attr('origin'), `api/pricelist/models/${ model._id }/${ price._id }`);
            
            console.log(url, price);

            $.ajax({
                type: "PUT",
                url: url,
                data: price
              })
              .done(res => {
                  console.log(res);
                  refreshTable();
                });

            $('#editPriceModal').modal('hide');
        });


    })
}

function addPrice(modelId) {
    $.get("/other/pricelist/newForm.html")
    .done(form => {
        var model = mainData.find(model => model._id === modelId);
        $('#editFormContainer').html('').append(form);
        $('#editPriceModal').modal('show');
        var price = {};
        price.parts = [];

        // add parts button
        $("#addPartButton").click(function () {
            // runs getPart function that will confirm if part is genuine 
            getPart($("#partNumber").val(), function (newPart) {
                var amount = $("#partAmount").val();
                $("#partNumber").removeClass("is-invalid");
                if (newPart) { // check if part was returned
                    price.parts.push({
                        _id:  newPart._id,
                        amount: amount,
                        description: newPart.description,
                        cost: newPart.cost
                    });
                    
                    console.log(price.parts);
                    // add part to parts_tmp, they'll be saved to database when form is successfully submitted
                    listParts(price.parts);

                    //after part is successfuly added clear add part fields
                    $("#partNumber").val('');
                    $("#partAmount").val('1');
                } else {
                    $("#partNumber").addClass("is-invalid");
                    console.log("Couldn't find part number");
                }
            });
        });

        $("#removePartsButton").click(function () {
                    price.parts = [];
                    removeParts();
        });

        $("#formElement").submit(function (e) {
            e.preventDefault();
            // TODO - some data validation
        
            //take id from hidden id field
            $("#modelId").val();
            price.name = $("#part").val();
            price.labour = $("#labour").val();
            price.min = $("#minPercentage").val();
            price.second = $("#second").val();

            var url = urlAdd($(location).attr('origin'), `api/pricelist/models/${model._id}`);
            
            console.log(url, price);

            $.ajax({
                type: "POST",
                url: url,
                data: price
              })
              .done(res => {
                  console.log(res);
                  refreshTable();
                });

            $('#editPriceModal').modal('hide');
        });
    })
}

function addPrice(modelId) {
    $.get("/other/pricelist/newForm.html")
    .done(form => {
        var model = mainData.find(model => model._id === modelId);
        $('#editFormContainer').html('').append(form);
        $('#editPriceModal').modal('show');
        var price = {};
        price.parts = [];

        // add parts button
        $("#addPartButton").click(function () {
            // runs getPart function that will confirm if part is genuine 
            getPart($("#partNumber").val(), function (newPart) {
                var amount = $("#partAmount").val();
                $("#partNumber").removeClass("is-invalid");
                if (newPart) { // check if part was returned
                    price.parts.push({
                        _id:  newPart._id,
                        amount: amount,
                        description: newPart.description,
                        cost: newPart.cost
                    });
                    
                    console.log(price.parts);
                    // add part to parts_tmp, they'll be saved to database when form is successfully submitted
                    listParts(price.parts);

                    //after part is successfuly added clear add part fields
                    $("#partNumber").val('');
                    $("#partAmount").val('1');
                } else {
                    $("#partNumber").addClass("is-invalid");
                    console.log("Couldn't find part number");
                }
            });
        });
        $("#removePartsButton").click(function () {
                    price.parts = [];
                    removeParts();
        });

        $("#formElement").submit(function (e) {
            e.preventDefault();
            // TODO - some data validation
        
            //take id from hidden id field
            $("#modelId").val();
            price.name = $("#part").val();
            price.labour = $("#labour").val();
            price.min = $("#minPercentage").val();
            price.second = $("#second").val();

            var url = urlAdd($(location).attr('origin'), `api/pricelist/models/${model._id}`);
            
            console.log(url, price);

            $.ajax({
                type: "POST",
                url: url,
                data: price
              })
              .done(res => console.log(res));
            parent.$.fancybox.close();
        });
    })
}


function listParts(parts) {
    var parts_html = '<div><label for="parts">Parts:</label></div>';
    parts.forEach((part) => {
        if(part.part){
            part._id = part.part._id;
            part.description = part.part.description;
            part.cost = part.part.cost
        }
    parts_html += '<div class="row mt-2"><div class="col-9"><input type="text" class="form-control parts-text form-control-sm" readonly value="' + part._id + '"></div>';
        parts_html += '<div class="col"><input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.amount + '"></div></div>';
        parts_html +=   '<div class="row"><div class="col-9">' +
                            '<input type="text" class="form-control parts-text form-control-sm" readonly value="' + part.description + '">' +
                        '</div>' +
                        '<div class="col">' +
                            '<input type="text" class="form-control parts-text form-control-sm" readonly value="' + (part.cost * 1.2).toFixed(2) + '">' +
                        '</div></div>';
    });
    $('#partsDiv').removeClass('hidden').html(parts_html);
}

$("#addModelButton").click(function (e) {
    $.get("/other/pricelist/modelForm.html")
    .done(form => {
        $('#editFormContainer').html('').append(form);
        $('#editModelModal').modal('show');

        $("#modelForm").submit(function (e) {
            e.preventDefault();
            // TODO - some data validation
        
            //take id from hidden id field
            var model = {};
            model._id = $("#model").val();
            model.name = $("#description").val();

            var url = urlAdd($(location).attr('origin'), `api/pricelist/models`);
            
            $.ajax({
                type: "POST",
                url: url,
                data: model
              })
              .done(res => console.log(res));
            parent.$.fancybox.close();
        });
    })
});

function editModel(modelId) {
    $.get("/other/pricelist/modelForm.html")
    .done(form => {
        var model = mainData.find(model => model._id === modelId);
        $('#editFormContainer').html('').append(form);
        $("#model").val(model._id).prop('readonly', true);
        $("#description").val(model.name);
        $('#editModelModal').modal('show');

        $("#modelForm").submit(function (e) {
            e.preventDefault();        
            //take id from hidden id field
            var model = {};
            model.name = $("#description").val();

            var url = urlAdd($(location).attr('origin'), `api/pricelist/models/${model._id}`);
            
            $.ajax({
                type: "POST",
                url: url,
                data: model,
              })
              .done(res => console.log(res));
            parent.$.fancybox.close();
        });
    })
}

function removeModel(model) {
    var url = urlAdd($(location).attr('origin'), `api/pricelist/models/${ model }`);
    $.ajax({
        type: "DELETE",
        url: url,
    })
    .done(function(res){
            getData();
            showPopUp("Success!", "Your changes have been saved.", 1500);
    });
}

function removePrice(model, price) {
    var url = urlAdd($(location).attr('origin'), `api/pricelist/models/${ model }/${ price }`);
    console.log(url);
    $.ajax({
        type: "DELETE",
        url: url,
    })
    .done(function(res){
            getData();
            showPopUp("Success!", "Your changes have been saved.", 1500);
    });
}

function removeParts() {
    console.log("Removing all parts");
    $("#partNumber").val('');
    $("#partAmount").val('1');
    $('#partsDiv').addClass('hidden');
    
}



// function that wil check if part with partName exist and then run function cb with part object named partName
function getPart(partName, cb) {
    var url = urlAdd($(location).attr('origin'), 'api/pricelist/parts/' + partName)
    $.getJSON(url)
    .done(result => {
        if(result) {
            cb(result);
        } else
            cb(false);
    });
}
