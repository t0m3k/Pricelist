function showPopUp(title, body, timeout) {
    if(title) {
        $('#popUpTitle').text(title);
    }
    if(body) {
        $('#popUpBody').text(body);
    }
    $('#popUpMessage').modal('show');
    if(timeout){
        setTimeout(function(){
            $('#popUpMessage').modal('hide')}
            , timeout);
    }
}

function urlAdd(first, second) {
    return first[first.length - 1] === '/' ? first + second : first + '/' + second;
}
