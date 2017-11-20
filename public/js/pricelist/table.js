// function drawTable() {
//     var filter = $('#searchBox').val(); // filter from searchbox
//     document.getElementById("tableDiv").innerHTML = '<table id="table" class="table table-striped">';
//     var tableData = '<thead>';
//     tableData += tableRow(["Model", "Part", ""], "th");
//     tableData += '</thead> <tbody>';
//     for (var i = 0; i < mainData.length; i++) {
//         if (((filter == null || filter == "") || mainData[i].model.toUpperCase().includes(filter.toUpperCase())) && (mainData[i].model != dtholder_name)) {
//             var columns = [mainData[i].model, mainData[i].part];
//             if(user.write){
//                 columns.push('<a href="javascript:;" onclick="deleteRow(' + i + ')">X</a>, <a href="javascript:;" data-fancybox data-src="#partForm" onclick="editPriceForm(' + i + ')">Edit</a>');
//             }
//             tableData += tableRow(columns, 'td', i, i);
//         }
//     }
//     tableData += '</tbody></table>';
//     $("table").html(tableData);
//     basket = [];
//     calcBasket();
// }

// function tableRow(columns, type, cclass, id) {
//     var result = '<tr';
//     if (id != null) {
//         result += ' id="' + id + '"';
//     }
//     if (cclass != null) {
//         result += ' class="' + cclass + '"';
//     }
//     result += '>';
//     for (var i = 0; i < columns.length; i++) {
//         result += '<'+ type + ' class="column' + i + '"';
//         if(i < 2 && type == 'td') {
//             result += ' onclick="basketTrigger(' + id + ')"';
//         }
//         result += '>' + columns[i] + '</' + type + '>';
//     }
//     result += '</tr>';
//     return result;
// }

// It'll refresh table when text is typed in searchbox
$('#searchBox').on('input propertychange paste', function() {
    drawTable();
});


function drawTable() {
    var filter = $('#searchBox').val(); // filter from searchbox    
    $('#tableDiv').html('');
    mainData.forEach(model => {
        if(((filter == null || filter == "") || model.model.toUpperCase().includes(filter.toUpperCase()))){
            if(!model.name) {
                model.name = 'Samsung';
            }
            var header = `<div class="col-xl-6 col-sm-12"><div class="card mt-4"><div class="card-body"><h4 id="${model._id}" class="card-title model-item">${ model.model }</h4><p class="card-text">${ model.name }</p><ul class="list-group list-group-flush">`;

            var lines = '';
            model.prices.forEach(price => {
                lines += `<li id="${price._id}" class="list-group-item pl-0 price-item" onclick>${price.name}</li>`;
            });
            var footer = `</ul></div></div></div>`;
            $('#tableDiv').append(header + lines + footer);
        }
    });
    $('li.price-item').click(function(){
        var id = $(this).attr('id');
        basketTrigger(id);
    });
}


