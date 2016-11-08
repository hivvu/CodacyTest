// YOUTUBE SCRIPT
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var startTime = 0,
    endTime = 7,
    playVideo = false,
    pausedVideo = false,
    endVideo = false,
    isMobile = false;

// LIST OF YOUTUBE VIDEOS: id = <div class="video-frame" id="video01"></div> videoId = youtube url
var playerList = [{
    id: 'intro',
    videoId: 'h8edL2cvwgg' //CHANGE THIS FOR THE FINAL YOUTUBE ID VIDEO
}]; 

function onYouTubeIframeAPIReady() {
    if (typeof playerList === 'undefined') return;

    for (var i = 0; i < playerList.length; i++) {
        var curplayer = createPlayer(playerList[i]);
        players[i] = curplayer;
    }
}

var players = new Array();

function createPlayer(playerInfo) {
    return new YT.Player(playerInfo.id, {

        height: '100%',
        width: '100%',
        wmode: 'transparent',
        videoId: playerInfo.videoId,
        playerVars: {
            'controls': 1,
            'fs': 1,
            'iv_load_policy': 3,
            'modestbranding': 0,
            'rel': 0,
            'showinfo': 0,
            'wmode': 'transparent'
        },
        events: {
            'onStateChange': onPlayerStateChange(playerInfo)
        }
    });
}

function hideBannerContent() {
  $('.bg-video').removeClass('show');
  $('.feature-content').fadeIn('slow');
}

function showBannerContent() {
  $('.feature-content').fadeOut('slow');
  $('.bg-video').addClass('show');
}

function onPlayerStateChange(playerInfo) {
    return function(event) {

        if (event.data == YT.PlayerState.PAUSED) {

            hideBannerContent();
            pausedVideo = true;
            setTimeout(function() {
                if (pausedVideo) {
                    pausedVideo = false;
                }
            }, 100);
        }
        if (event.data == YT.PlayerState.PLAYING) {

            showBannerContent();
            pausedVideo = false;
        }
        if (event.data == YT.PlayerState.ENDED) {
            hideBannerContent();
            if (endVideo) {
                endVideo = false;
            }
        }
    }
}
// END YOUTUBE SCRIPT

function isInView(elem, offset){
    var docViewTop = $(window).scrollTop() - offset,
        docViewBottom = docViewTop + $(window).height(),
        elemTop = $(elem).offset().top,
        elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function showModal(title, videoID){
  $('.modal iframe').remove();
  $('<iframe width="1280" height="720" src="https://www.youtube.com/embed/'+videoID+'?rel=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>').appendTo($('.modal .responsive-video'));
  $('.modal .title').text(title);
  $('.modal').animateCSS("fadeIn");
}

//On DOM Ready
$(function(){
    $('.menu-button').click(function(e){
      e.preventDefault();

      $('.menu-button').children().toggle();
    });

    $('.feature .play-video').click(function(e) {
        e.preventDefault();
        
        var thisvideo = $('.video-frame');
        $('.bg-video').addClass('show');
        
        $('.feature .video').fadeIn(200);  
        $('.feature-content').fadeOut(180);  

        //find current video and play it
        $(players).each(function(i) {
            if ($(this)[0].a.id == thisvideo.attr('id')) {
                this.playVideo();
            }
        });
    });

    //stop all videos
    $('.bg-video').click(function() {
        $(players).each(function(i) {
            this.stopVideo();
        });
    });

    //NAVIGATION ANIMATION
    //Only scrolls the page if it has a hashtag (#) in HREF.
    $('nav a, .mobile .menu a').click(function(e){
      var target = $(this).attr('href');
      if (target.indexOf('#') > -1){
        e.preventDefault();

        $('html, body').animate({
           scrollTop: $(target).offset().top - 50 
         }, 1000);
      }
    });

    $('.participation-item .play').click(function(e){
      e.preventDefault();
      showModal($(this).parent().next().find($('.title')).text(), $(this).attr('data-videoID'));
    });

    $('.avatar-upload button').click(function(e){
      e.preventDefault();
      $(this).next('input').click();
    });

    $('.modal button.close-modal').click(function(e){
      e.preventDefault();
        
      $('.modal').animateCSS("fadeOut", function(){
        $(this).hide();
        $('.modal iframe').attr('src', '');
      });
    });
});

$(window).scroll(function() {
  $('section').each(function(){
    if (isInView($(this), 100)){
      $('nav a').removeClass('active');
      $('nav a[href="#'+$(this).attr('id')+'"]').addClass('active');
    }
  });
});

//After Finish loading the page
//Calculate the offset of navigation bar to make it sticky
$(window).load(function(){
  
  $('.feature').height($('.feature-content').height());

  if ($('nav').length){
    var stickyNavTop = $('nav').offset().top,
        stickyNav = function(){
          var scrollTop = $(window).scrollTop();
          scrollTop > stickyNavTop ? $('nav').addClass('sticky') : $('nav').removeClass('sticky');
        };

    stickyNav();

    $(window).scroll(function() { stickyNav(); });
  }
});