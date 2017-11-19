function showPopUp(title, body) {
    if(title) {
        $('#popUpTitle').text(title);
    }
    if(body) {
        $('#popUpBody').text(body);
    }
    $('#popUpMessage').modal('show');
}