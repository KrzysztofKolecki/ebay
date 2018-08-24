$( document ).ready(function() {

    $('.auctionShow').hide();

    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        }
    );
    
    $('#addAuction').validate({
        rules: {
            title: {
                required: true,
                minlength: 5
            },
            price: {
                required: true,
                regex: /^\d*\.?\d{0,2}$/
            }
        },
        messages: {
            title: "Podaj tytuł (min 5 znaków)",
            price: "Zły format ceny",
        }
    });

    $('#auction').on('click', function() {
        $('.buyNowShow').hide();
        $('.auctionShow').show();
    });

    $('#buyNow').on('click', function() {
        $('.auctionShow').hide();
        $('.buyNowShow').show();
    });


});