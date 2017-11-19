$(".admin-nav").each(function(){
    var url = $(this).attr('href');
    if(url == $(location).attr('pathname')){
        $(this).addClass('active');
    }
});