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
function editPrice(modelId, priceId) {
    $.get("/other/pricelist/newForm.html")
    .done(form => {
        var model = mainData.find(model => model._id === modelId);
        var part = model.prices.find(price => price._id === priceId);
        $('#editPriceContainer').html('').append(form);
        $("#partId").val(priceId);
        $("#modelId").val(modelId);
        $("#part").val(part.name);
        $("#labour").val(part.labour);
        $("#minPercentage").val(part.min);
        $("#second").val(part.second);
        if(part.parts) {
            listParts(part.parts);
            
            console.log("Editing item id: " + part._id);
        }
        $('#editPriceModal').modal('show');
    })
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

function removeModel(model) {
    var url = urlAdd($(location).attr('origin'), `api/pricelist/${ model }?_method=DELETE`);
    $.ajax({
        type: "POST",
        url: url,
    }).done(function(res){
            getData();
            showPopUp("Success!", "Your changes have been saved.", 1500);
    });
}

function removePrice(model, price) {
    var url = urlAdd($(location).attr('origin'), `api/pricelist/${ model }/${ price }?_method=DELETE`);
    $.ajax({
        type: "POST",
        url: url,
    }).done(function(res){
            getData();
            showPopUp("Success!", "Your changes have been saved.", 1500);
    });
}
