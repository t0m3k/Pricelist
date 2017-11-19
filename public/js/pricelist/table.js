function drawTable() {
    var filter = $('#searchBox').val(); // filter from searchbox
    document.getElementById("tableDiv").innerHTML = '<table id="table" class="table table-striped">';
    var tableData = '<thead>';
    tableData += tableRow(["Model", "Part", ""], "th");
    tableData += '</thead> <tbody>';
    for (var i = 0; i < mainData.length; i++) {
        if (((filter == null || filter == "") || mainData[i].model.toUpperCase().includes(filter.toUpperCase())) && (mainData[i].model != dtholder_name)) {
            var columns = [mainData[i].model, mainData[i].part];
            if(user.write){
                columns.push('<a href="javascript:;" onclick="deleteRow(' + i + ')">X</a>, <a href="javascript:;" data-fancybox data-src="#partForm" onclick="editPriceForm(' + i + ')">Edit</a>');
            }
            tableData += tableRow(columns, 'td', i, i);
        }
    }
    tableData += '</tbody></table>';
    $("table").html(tableData);
    basket = [];
    calcBasket();
}

function tableRow(columns, type, cclass, id) {
    var result = '<tr';
    if (id != null) {
        result += ' id="' + id + '"';
    }
    if (cclass != null) {
        result += ' class="' + cclass + '"';
    }
    result += '>';
    for (var i = 0; i < columns.length; i++) {
        result += '<'+ type + ' class="column' + i + '"';
        if(i < 2 && type == 'td') {
            result += ' onclick="basketTrigger(' + id + ')"';
        }
        result += '>' + columns[i] + '</' + type + '>';
    }
    result += '</tr>';
    return result;
}

// It'll refresh table when text is typed in searchbox
$('#searchBox').on('input propertychange paste', function() {
    drawTable();
});