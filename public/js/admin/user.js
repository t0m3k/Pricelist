var user = {};

$('li').click(function(){
    var attr = $(this).attr('id');

    // toggle the class for pressed element
    $(this).children('i').toggleClass("text-danger");
    $(this).children('i').toggleClass("text-success");
    $(this).children('i').toggleClass("fa-square");
    $(this).children('i').toggleClass("fa-check-square");

    // save elemend id ass attribute for user class
    user[attr] = $(this).children('i').hasClass("text-success");
    console.log(user);
});

function postUser() {
    if(!$.isEmptyObject(user)){
        $('#myModal').modal('toggle');
    }
}