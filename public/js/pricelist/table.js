// It'll refresh table when text is typed in searchbox
$('#searchBox').on('input propertychange paste', function() {
    drawTable();
});


function drawTable() {
    var filter = $('#searchBox').val(); // filter from searchbox    
    $('#tableDiv').html('');
    mainData.sort((a, b) => {
        return a._id.localeCompare(b._id);
    })
    mainData.forEach(model => {
        if(((filter == null || filter == "") || model.model.toUpperCase().includes(filter.toUpperCase()))){
            if(!model.name) {
                model.name = 'Samsung';
            }
            var header = `<div class="col-xl-4 col-md-6 mt-4"><div class="card"><div class="card-body"><h4 id="${model._id}" class="card-title model-item">${ model._id }</h4><p class="mb-2 text-muted card-subtitle">${ model.name }</p><ul class="list-group list-group-flush">`;

            var lines = '';
            model.prices.forEach(price => {
                lines += `<li id="${price._id}" class="list-group-item pl-0 price-item">${price.name} </li>`;
            });
            var footer = `</ul></div></div></div>`;
            $('#tableDiv').append(header + lines + footer);
        }
    });
    $('li.price-item').click(function(){
        var id = $(this).attr('id');
        basketTrigger(id);
    });
    addWrite();
    calcBasket();
}
