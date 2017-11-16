function fontBigger() {
    $("#table tr").addClass("font_mo");
    $("#moLink").text("Default").attr("onclick", "fontDefault()");
};

function fontDefault() {
    $("#table tr").removeClass("font_mo");
    $("#moLink").text("Bigger").attr("onclick", "fontBigger()");
};