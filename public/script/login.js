    $(".menu-icon").click(function(){
      $(".row1").slideToggle();
    });

    $(document).ready(function(){
      $(window).resize(function(){
        console.log($('body').outerWidth());
        if($('body').outerWidth()<768){
          $('.row1').slideUp();
        }else{
          $('.row1').slideDown();
          $('.row1').css('height','25%');
          $('.row1').css('display','flex');
          $('.row1').css('flex-direction','column');
          $('.row1').css('','25%');
        }
      });
    })

  $('.signin').click(function(){
    document.querySelector('.sign-in-button').click();
  })
