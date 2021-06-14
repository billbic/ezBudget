//DOM is Ready: Executes Page_Load()
$(function () {
    setInterval(function () { updateImg() }, 30000);
});
function updateImg(){
    try {
        var d = new Date();
        $('.coverPage').fadeIn(function () {
            $(".coverPage").fadeOut(3000, function () {
                $('.coverPage').css('background-image', "url(" + "https://source.unsplash.com/random/915x620?x=" + d.getTime() + ")");
            });
            $(".coverPage").fadeIn(3000);
        });
    } catch (e) {
        alert(e.message);
        //553 - 637 - 172
    }
}
