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
});

function postUser(id) {
    var url = urlAdd($(location).attr('origin'), `api/users/${ id }?_method=PUT`);
    if(!$.isEmptyObject(user)){
        $.ajax({
            type: "POST",
            url: url,
            data: {user: user},
          }).done(function(res){
              if(res._id && res._id == id){
                showPopUp("Success!", "Your changes have been saved.", 1500);
              }
          });
    } else {
        showPopUp("Error!", "Nothing to save!", 1500);
    }
}