jQuery.ajaxSetup({async:false});

/* Preload emojis */
const emojis = getResource('json/native.json')
const iso639_langs = getResource('json/iso639-1.json')

/* A Google API Key (for the Cloud Translation API) is needed to get this script to work */
var googleApiKey = "AIzaSyA8m0bay1Sg545_mrZKkmEFIh5bJw7A4a8";
var prefTranslationLang = localStorage.getItem("prefTranslationLang")
var translationLanguages = []

/* html templates */
var htmlModelOverlay = getResource("html/modelinfo-overlay.html");
var htmlLangChooser = getResource("html/language-chooser.html");
var htmlAutoTipOverlay = getResource("html/overlay-auto-tip.html")
var htmlLangPicker = getResource("html/language-picker.html")
var htmlTranslateButton = '<span class="translate-line"><button class="a11y-button chat-message-translate-button" style="float: none; display: inline-block;" type="button"><svg style="height: 14px; width: 14px;" viewBox="0 0 16 14"><path fill="currentColor" fill-rule="evenodd" d="M10.28 1.72V3h-1.5a18.53 18.53 0 0 1-2.6 4.52l.05.05c.43.46.86.93 1.3 1.38l-.9.9c-.37-.36-.72-.74-1.07-1.13l-.2-.21c-.9.99-1.9 1.88-3 2.67l-.77-1.02.03-.02a17.36 17.36 0 0 0 2.87-2.58c-.52-.6-1.03-1.19-1.52-1.8L2.1 4.68l1-.8.86 1.08c.44.54.9 1.07 1.36 1.6C6.15 5.46 6.84 4.27 7.4 3H.68V1.72h4.48V.44h1.28v1.28h3.84Zm5.04 11.84h-1.38L13 11.32H9.48l-.93 2.24H7.17l3.32-8H12l3.33 8ZM11.24 7.1l-1.22 2.94h2.45L11.24 7.1Z" clip-rule="evenodd"></path></svg></button></span>'
var htmlEnhancedOptions = chrome.runtime.getURL('html/enhanced-options.html')
var htmlCustomGenderTabs = getResource("html/custom-gender-tabs.html")

/* misc global vars */
var varDefaultGender = localStorage.getItem('SE_defaultGender')


/**
 * Default Gender
 */
waitForKeyElements("#logoLink", defaultGender, false);
function defaultGender(el) {
  if(varDefaultGender)
    $(el).attr('href', $(el).attr('href')+varDefaultGender+'-cams/')
}


/**
 * Move Bottom Tabs to Top Tab Bar
 */
waitForKeyElements("#settings-tab-default", moveBottomTabs, false);
function moveBottomTabs(el) {

  // add tabnav items
  $(el).before('<div ts="bi" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="bio" id="bio-tab-default" data-paction-name="BIO" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="BIO" style="vertical-align: top;">BIO</span></span></div>')
  //$(el).before('<div ts="pv" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="more" id="pics-tab-default" data-paction-name="PICS & VIDEOS" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="PICS & VIDEOS" style="vertical-align: top;">Pics & Videos</span></span></div>')
  //$(el).before('<div ts="mo" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="pics" id="more-tab-default" data-paction-name="MORE" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="MORE" style="vertical-align: top;">More</span></span></div>')
  //$(el).before('<div ts="sh" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="share" id="share-tab-default" data-paction-name="SHARE" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="SHARE" style="vertical-align: top;">Share</span></span></div>')

  // add tabs
  $('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-bio" data-tab="bio" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">Bio</div></div></div>')
  //$('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-pics" data-tab="more" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">Pics</div></div></div>')
  //$('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-more" data-tab="pics" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">More</div></div></div>')
  //$('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-share" data-tab="share" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">Share</div></div></div>')

  $('.se-tab-bio>div>div').html($('#BioContents').html())
  //$('.se-tab-pics>div>div').html($('#PhotoVideos').html())
  //$('.se-tab-more>div>div').html($('#MoreRooms').html())
  //$('.se-tab-share>div>div').html($('#shareTab').html())

  // regular tabs
  $('.chat-tab-handle:not(.goto-custom-tab,.active)').on('click', function(e) {
    $('#ChatTabContainer #tab-row>*').removeClass('active')
    $(this).addClass('active')
    $('.se-tab').hide()
    $('#ChatTabContainer #tab-row+.window>*').eq(($(this).index() >= 2 ? $(this).index()-1 : $(this).index())).show()
  })

  // custom tabs
  $('.goto-custom-tab').on('click', function(e) {
    e.preventDefault
    e.stopImmediatePropagation
    e.stopPropagation
    $('#ChatTabContainer #tab-row>*').removeClass('active')
    $('#ChatTabContainer #tab-row+.window>*').hide()
    $(this).addClass('active')
    $('.window [data-tab="'+$(this).attr('data-tab')+'"]').show()
  })
}


/**
 * Profile Menu: Themes Dropdown 
 */
waitForKeyElements('.userMenuDropDown', addProfileMenuThemes, false);
function addProfileMenuThemes(el) {
  let htmlThemesDropdown = '<div class="se-theme-select userInfoDropdownTextColor userInfoDropdownHighlightColor" style="user-select: none; font-size: 14px; font-weight: normal; cursor: pointer; font-family: UbuntuMedium, Arial, Helvetica, sans-serif; padding: 5px 0px 5px 10px;">Site Theme<select name="gender" required="" class="fieldInput" data-listener-count-change="1" data-listener-count-blur="1" data-testid="bio-tab-gender" style="border-width: 1px;border-style: solid;border-radius: 4px;padding: 2px 4px;line-height: 16px;font-size: 12px;margin-top: -2px;float: right;"><option value="">Current Default</option><option value="halloween">Halloween</option><option value="christmas">Christmas</option><option value="valentines">Valentine\'s Day</option></select></div>'

  // prepare page view
  $(el).prepend(htmlThemesDropdown)

  $('.se-theme-select select').on('change', function(e) {
    e.preventDefault
    $('body').attr('class', function(i, c){ return c.replace(/(^|\s)se-theme-\S+/g, '') }).addClass('se-theme-'+$(this).val())
    localStorage.setItem('SE_FrontendTheme', $(this).val())
  })
}


/**
 * Custom Page: Hidden Cams
 */
waitForKeyElements('body.se-page-my-hidden-cams #main .content_body', showHiddenCamsPage, false);
function showHiddenCamsPage(el) {
  let htmlTopSection = '<div class="top-section" ts="H" style="padding-left: 15px; padding-right: 16px;"><ul class="sub-nav genderTabs" ts="u" data-userscript-1761263927196-alreadyfound="true"><div ts="k" class="scanNext" data-paction="NextCam" style="height: 27px; position: relative; overflow: visible; -webkit-tap-highlight-color: transparent; z-index: 1; top: 2px; text-align: right; float: right; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; display: none;"><a ts="m" href="#" class="tabActiveColor transparentBg" data-listener-count-mouseenter="1" data-listener-count-mouseleave="1" style="display: inline-block; padding: 7px 3px 7px 5px; text-decoration: none; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 10.008px; position: relative; background-color: transparent; right: 5px;"><span data-testid="scan-cams">SCAN CAMS</span></a><div ts="n" style="position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; float: right; height: 100%; visibility: hidden;"></div><a ts="m" href="#" data-testid="next-cam" class="nextCamBgColor tabBorder tabActiveColor" data-listener-count-mouseenter="1" data-listener-count-mouseleave="1" style="display: inline-block; text-decoration: none; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 10.008px; line-height: normal; position: relative; border-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: initial; border-left-style: solid; border-bottom-color: initial; border-radius: 4px 4px 0px 0px; padding: 6px 3px 6px 5px;">NEXT CAM (Ctrl+/)</a><div class="nextCamBgColor tabBorder tabActiveColor dropdown-anchor" data-listener-count-mouseenter="1" data-listener-count-mouseleave="1" ts="h" data-listener-count-click="1" data-listener-count-keydown="1" style="display: none; cursor: pointer; padding: 4px 6px; text-decoration: none; font-size: 10.008px; position: relative; border-width: 1px 1px 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: initial; border-left-style: solid; border-bottom-color: initial; border-radius: 4px 4px 0px 0px; text-align: center; user-select: none; top: 1px;">SCAN / NEXT</div></div><li class="gender-tab" ts="m" style="display: inline-block; position: relative; font: 13.0016px / 16px UbuntuMedium, Arial, Helvetica, sans-serif;"><a data-paction="TopTab" data-listener-count-click="1" href="https://chaturbate.com/" class="gender-tab" data-testid="top-section-tab-featured" data-listener-count-pointerenter="1" data-listener-count-pointerleave="1">FEATURED</a></li><div ts="n" style="position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; float: right; height: 100%; visibility: hidden; width: 12px;"></div><li class="gender-tab" ts="m" style="display: inline-block; position: relative; font: 13.0016px / 16px UbuntuMedium, Arial, Helvetica, sans-serif;"><a data-paction="TopTab" data-testid="top-section-tab-women" data-listener-count-click="1" href="https://chaturbate.com/female-cams/" class="gender-tab tabElement tabElementLink" data-listener-count-pointerenter="1" data-listener-count-pointerleave="1" style="display: inline-block;">WOMEN</a></li><li class="gender-tab" ts="m" style="display: inline-block; position: relative; font: 13.0016px / 16px UbuntuMedium, Arial, Helvetica, sans-serif;"><a data-paction="TopTab" data-testid="top-section-tab-men" data-listener-count-click="1" href="https://chaturbate.com/male-cams/" class="gender-tab tabElement tabElementLink" data-listener-count-pointerenter="1" data-listener-count-pointerleave="1" style="display: inline-block;">MEN</a></li><li class="gender-tab" ts="m" style="display: inline-block; position: relative; font: 13.0016px / 16px UbuntuMedium, Arial, Helvetica, sans-serif;"><a data-paction="TopTab" data-testid="top-section-tab-couples" data-listener-count-click="1" href="https://chaturbate.com/couple-cams/" class="gender-tab tabElement tabElementLink" data-listener-count-pointerenter="1" data-listener-count-pointerleave="1" style="display: inline-block;">COUPLES</a></li><li class="gender-tab" ts="m" style="display: inline-block; position: relative; font: 13.0016px / 16px UbuntuMedium, Arial, Helvetica, sans-serif;"><a data-paction="TopTab" data-testid="top-section-tab-trans" data-listener-count-click="1" href="https://chaturbate.com/trans-cams/" class="gender-tab tabElement tabElementLink" data-listener-count-pointerenter="1" data-listener-count-pointerleave="1" style="display: inline-block;">TRANS</a></li><div ts="d" class="chatAreaTabColor dropdown-anchor gender-tab" data-listener-count-click="1" data-listener-count-keydown="1" style="position: absolute; overflow: hidden; -webkit-tap-highlight-color: transparent; cursor: pointer; padding: 0px 10px; text-align: center; user-select: none; display: none; border-width: 1px; border-style: solid; border-radius: 4px 4px 0px 0px; height: 27px; line-height: 27px; margin-right: 2px; width: 41px;">. . .</div><li class="se-custom-gender-tab gender-tab" ts="m" style="display: inline-block; position: relative; font: 13.0029px / 16px UbuntuMedium, Arial, Helvetica, sans-serif;"> <a data-paction="TopTab" data-testid="top-section-tab-women" class="gender-tab tabElement tabElementLink" href="#" style="display: inline-block;">+</a> <div class="se-sub-menu" style="display: none"> <a data-testid="profile-link" href="/my-hidden-cams" style="text-decoration: none; display: block; font-size: 14px; padding: 5px 0px 5px 10px;">Hidden Cams</a> <a class="se-button-disabled" data-testid="profile-link" href="/banned-cams" style="text-decoration: none; display: block; font-size: 14px; padding: 5px 0px 5px 10px;">Banned Cams</a></div></li></ul></div>'
  let htmlViewHiddenCams = getResource('html/view-hidden-cams.html')

  // prepare page view
  document.title = 'My Hidden Cams - Chaturbate - 100% Free Chat &amp; Webcams'
  $(el).closest('#main').prepend(htmlTopSection)
  
  // empty page / add html
  $(el).closest('#main').find('.content').empty().append(htmlViewHiddenCams)

  // view hidden cams
  let hiddenCams = ["aalliyahh", "crystalnut", "its_lily"]
  //let hiddenCams = localStorage.getItem('SE_hiddenCams')
  $.each(hiddenCams, function(k, v) {

    // get roomdossier
    let roomDossier = getRoomDossier(v)
    console.log(roomDossier)

    let tpl = $('.roomCard.se-template').clone()
    tpl.removeClass('se-hidden').removeClass('se-template')
    tpl.find('a[data-room]').attr('data-room', v)
    tpl.find('.age').text(roomDossier.age)
    tpl.find('.room_thumbnail_container').attr('href', '/'+v+'/')
    tpl.find('.cardTitle a').text(v).attr('href', '/'+v+'/')
    tpl.find('img').attr('src', 'https://jpeg.live.mmcdn.com/minifwap/'+v+'.jpg')
    tpl.find('.cams .viewers').text((roomDossier.num_viewers ? roomDossier.num_viewers+' viewers' : "Offline"))
    if(roomDossier.following) { tpl.find('.follow_star').addClass('icon_following') } else { tpl.find('.follow_star').addClass('icon_not_following') }
    tpl.find('.subject span').text(roomDossier.room_title)
    if(roomDossier.broadcaster_gender)
      tpl.find('.age_gender_container .camAltTextColor').addClass('gender'+roomDossier.broadcaster_gender.toString()[0])
    
    
    // append
    $('.list.endless_page_template').append(tpl)
  })
  if(!hiddenCams || hiddenCams.length === 0) $('.NoSearchResultsMessage').removeClass('NoSearchResultsMessage__hidden')
  
}


/**
 * Custom Gender Tabs
 */
waitForKeyElements('.genderTabs', addCustomGenderTabs, false);
function addCustomGenderTabs(el) {

  // add gender tab (html differs per template)
  if(!$('.se-custom-gender-tab').length) {

    // page: home & favorites
    if($('.genderTabs.sub-nav').length) {
      $(el).append(htmlCustomGenderTabs)
    } 
    // page: view cam
    else {
      $(el).find('div:first-child > div:first-child').append(htmlCustomGenderTabs)
    }
  }

  // open submenu toggle
  $('.se-custom-gender-tab > a').on('auxclick', (e) => { if(e.button === 1) e.preventDefault() })
  $('.se-custom-gender-tab > a').on('mouseup', function(e) {
    e.preventDefault
    if( e.which <= 2 ) {
      $(this).parent().toggleClass('se-open')
    }
  })

  // close submenu on outside click
  $(document).on('click', function (e) {
    if($(".se-custom-gender-tab").hasClass('se-open')) {
      if (!$('.se-custom-gender-tab').is(e.target) && !$('.se-custom-gender-tab a').is(e.target) && !$('.se-open').is(e.target)) {
        $(".se-custom-gender-tab").removeClass('se-open');
      }
    }
  });

  // default gender
  if(varDefaultGender)
    $('.genderTabs .gender-tab').find('a[href*="'+varDefaultGender+'"]').prependTo('.genderTabs')
}


/**
 * View Banned Rooms
 */
waitForKeyElements('.BaseRoomContents [data-testid="denied-notice"]', viewBannedRoom, false);
function viewBannedRoom(el) {
  $('body').addClass('se-banned-room')

  // append
  $(el).parent().append(getResource('html/view-banned-room.html'))

  let bannedRooms = localStorage.getItem('bannedRooms')
  $.each(bannedRooms, function(k, v) {
    
  })

  $('.se-follow-enhanced').on('click', function(e) {
    e.preventDefault;

    gCurrentBroadcaster = $('.activeRoom').text().toLowerCase().split('\'')[0];
    if(!gCurrentBroadcaster) return;
    let furl = 'https://chaturbate.com/api/chatvideocontext/' + gCurrentBroadcaster + '/';
    if(gCurrentRoomIsInaccessible) {
      furl = 'https://cb-enh-api2.improper.dev/api/room/' + gCurrentBroadcaster + '?key=' + acre7;
    }
    xmlhttpRequest({
      method: 'GET',
      url: furl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://chaturbate.com/' + gCurrentBroadcaster + '/',
      },
      timeout: 60*1*1000,
      onload: function(resp) {
        let data;
        try {
          data = JSON.parse(resp.responseText);
        }
        catch(SyntaxError) {
          return;
        }
        if(!('hls_source' in data) || data['hls_source'] === '') {
          alert(getLocale('err_vurl', 'ERROR: No video URL.'));
          return;
        }
        let srcurl = data['hls_source'];
        let pos = srcurl.indexOf('/playlist.m3u8');
        if(pos === -1) {
          pos = srcurl.indexOf('/playlist_sfm4s.m3u8');
        }
        if(pos === -1) {
          alert(getLocale('err_vurl', 'ERROR: No video URL.'));
          return;
        }
        srcurl = fixCBHLSURL(srcurl);
        srcurl = srcurl.slice(0, pos + '/playlist_sfm4s.m3u8'.length);
        setClipboard(srcurl, 'text');
        alert(srcurl + '\n\n(' + getLocale('copied_to_clipboard', 'copied to clipboard') + ')');
      }
    });

    //$.ajax({
    //  type: 'POST',
    //  url: "//247camming-api.local.dev/models/follow",
    //  data: '{"type":"email","model_username":"dreckigerkanacke"}', // or JSON.stringify ({name: 'jonas'}),
    //  success: function(data) { alert('data: ' + data); },
    //  contentType: "application/json",
    //  dataType: 'json'
    //});

    //$.post(
    //  "//247camming-api.local.dev/models/follow", 
    //  { 
    //    "csrfmiddlewaretoken": jQuery.cookie("csrftoken"),
    //    "type": 'email', 
    //    'model_username': $('.activeRoom').text().toLowerCase().split('\'')[0],
    //  }
    //)
  })
  
  // https://chaturbate.com/affiliates/promotools/api_usersonline/
  //$.post("/affiliates/promotools/api_usersonline/", {"csrfmiddlewaretoken":$.cookie("csrftoken"), tip_amount: tip_amount})
}


/**
 * Dark Mode Detection
 */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  $('body').removeClass('lightmode').addClass('darkmode')
}


/**
 * Save Player Volume
 */
waitForKeyElements("#TheaterModePlayer .vjs-tech", savePlayerVolume, false);
function savePlayerVolume(player) {

  if(localStorage.getItem("SE_playerVolume")) {
    $(player).get(0).volume = localStorage.getItem("SE_playerVolume")
  }

  $(player).on('volumechange', function(e) {
    localStorage.setItem("SE_playerVolume", $(player).get(0).volume)
  })
}


/**
 * Hide Auto Refill Feature
 */
waitForKeyElements('form[data-testid="settings-tab-form"]', hideAutoRefillFeature);
function hideAutoRefillFeature() {
  processOption("SE_optionDisableAutoRefill")
}


/**
 * Add global options flyout & Output website time in header
 */
waitForKeyElements(".broadcast-yourself", addOptionsMenu);
function addOptionsMenu(el) {

  // Add global options flyout
  if(!$(el).closest('ul').find('.open-enhanced-options').length) {

    // add button
    $(el).after('<button class="open-enhanced-options" type="button"><span><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="height: 1.2em;"><path d="M14.9474 6.50932L14.1034 6.20998C13.9826 6.16702 13.8721 6.09916 13.7791 6.01078C13.6862 5.92241 13.6128 5.8155 13.5638 5.69697C13.5148 5.57845 13.4912 5.45094 13.4946 5.32272C13.498 5.19451 13.5282 5.06843 13.5834 4.95265L13.9674 4.14398C14.1075 3.84868 14.1528 3.51727 14.0971 3.19521C14.0414 2.87315 13.8874 2.57621 13.6563 2.3451C13.4252 2.11398 13.1283 1.96002 12.8062 1.90432C12.4842 1.84862 12.1528 1.89391 11.8574 2.03398L11.0488 2.41865C10.9329 2.47361 10.8069 2.50365 10.6787 2.50683C10.5505 2.51002 10.4231 2.48628 10.3046 2.43715C10.1862 2.38802 10.0794 2.31458 9.99111 2.2216C9.90283 2.12861 9.83504 2.01814 9.79211 1.89732L9.49211 1.05398C9.38235 0.746123 9.18003 0.479756 8.91292 0.291408C8.6458 0.103059 8.32696 0.00195313 8.00011 0.00195312C7.67327 0.00195312 7.35443 0.103059 7.08731 0.291408C6.82019 0.479756 6.61788 0.746123 6.50811 1.05398L6.20811 1.89798C6.16512 2.01875 6.09728 2.12915 6.00897 2.22206C5.92066 2.31498 5.81384 2.38834 5.69541 2.4374C5.57699 2.48647 5.44959 2.51015 5.32144 2.50692C5.19329 2.50369 5.06725 2.47362 4.95145 2.41865L4.14278 2.03398C3.84747 1.89391 3.51607 1.84862 3.19401 1.90432C2.87195 1.96002 2.575 2.11398 2.34389 2.3451C2.11278 2.57621 1.95882 2.87315 1.90312 3.19521C1.84742 3.51727 1.89271 3.84868 2.03278 4.14398L2.41678 4.95265C2.47188 5.06844 2.50207 5.19451 2.5054 5.3227C2.50873 5.45089 2.48513 5.57835 2.43613 5.69685C2.38712 5.81535 2.31379 5.92224 2.22089 6.01063C2.12799 6.09902 2.01757 6.16693 1.89678 6.20998L1.05278 6.50998C0.744848 6.61958 0.478381 6.8218 0.289952 7.08887C0.101523 7.35595 0.000366211 7.6748 0.000366211 8.00165C0.000366211 8.32851 0.101523 8.64735 0.289952 8.91443C0.478381 9.1815 0.744848 9.38372 1.05278 9.49332L1.89678 9.79332C2.01755 9.83629 2.12795 9.90414 2.22085 9.99246C2.31375 10.0808 2.38708 10.1876 2.43609 10.3061C2.4851 10.4245 2.50871 10.5519 2.50538 10.6801C2.50206 10.8082 2.47187 10.9342 2.41678 11.05L2.03278 11.8587C1.89271 12.154 1.84742 12.4854 1.90312 12.8074C1.95882 13.1295 2.11278 13.4264 2.34389 13.6575C2.575 13.8887 2.87195 14.0426 3.19401 14.0983C3.51607 14.154 3.84747 14.1087 4.14278 13.9687L4.95145 13.5847C5.06722 13.5295 5.19329 13.4992 5.3215 13.4959C5.44971 13.4926 5.57718 13.5162 5.69566 13.5653C5.81415 13.6144 5.92099 13.6878 6.00927 13.7809C6.09755 13.8739 6.1653 13.9844 6.20811 14.1053L6.50811 14.9487C6.61788 15.2565 6.82019 15.5229 7.08731 15.7112C7.35443 15.8996 7.67327 16.0007 8.00011 16.0007C8.32696 16.0007 8.6458 15.8996 8.91292 15.7112C9.18003 15.5229 9.38235 15.2565 9.49211 14.9487L9.79211 14.1047C9.83509 13.9839 9.90293 13.8735 9.99126 13.7806C10.0796 13.6877 10.1864 13.6144 10.3049 13.5653C10.4233 13.5163 10.5507 13.4927 10.6789 13.496C10.807 13.4994 10.933 13.5296 11.0488 13.5847L11.8574 13.9687C12.1528 14.1087 12.4842 14.154 12.8062 14.0983C13.1283 14.0426 13.4252 13.8887 13.6563 13.6575C13.8874 13.4264 14.0414 13.1295 14.0971 12.8074C14.1528 12.4854 14.1075 12.154 13.9674 11.8587L13.5834 11.05C13.5284 10.9342 13.4982 10.8082 13.4948 10.6801C13.4915 10.5519 13.5151 10.4245 13.5641 10.3061C13.6131 10.1876 13.6865 10.0808 13.7794 9.99246C13.8723 9.90414 13.9827 9.83629 14.1034 9.79332L14.9474 9.49265C15.2554 9.38305 15.5218 9.18084 15.7103 8.91376C15.8987 8.64669 15.9999 8.32784 15.9999 8.00098C15.9999 7.67413 15.8987 7.35528 15.7103 7.08821C15.5218 6.82113 15.2554 6.61892 14.9474 6.50932ZM8.00011 11.1907C7.37045 11.1815 6.75667 10.9917 6.2318 10.6437C5.70693 10.2958 5.29306 9.80438 5.03945 9.22798C4.71516 8.44275 4.71553 7.56095 5.04046 6.77598C5.3654 5.99102 5.98838 5.36695 6.77278 5.04065C7.55892 4.72626 8.43681 4.73154 9.21911 5.05537C10.0014 5.3792 10.6262 5.99594 10.9601 6.77398C11.2844 7.55922 11.284 8.44102 10.9591 9.22598C10.6342 10.011 10.0112 10.635 9.22678 10.9613C8.83799 11.1212 8.42042 11.1993 8.00011 11.1907Z"></path></svg></span></button>')

    // html options overlay
    $('body').append('<div class="blurred-login-overlay se-blurred-login-overlay hidden" style="position: fixed; display: block; inset: 0px; z-index: 1100; visibility: visible;"></div><div class="enhanced-options-modal hidden"></div>')
    $('.enhanced-options-modal').load(htmlEnhancedOptions);

    // process options
    processOptions()
  }

  // open options menu
  $('.open-enhanced-options').on('click', (e) => {
    $('.enhanced-options-modal,.se-blurred-login-overlay').toggleClass('hidden')
  })

  // close options menu
  $('.enhanced-options-modal').on('click', '.enhanced-options-close', (e) => {
    $('.enhanced-options-modal,.se-blurred-login-overlay').toggleClass('hidden')
  })

  // close options menu when clicking on chaturbate's blurred overlay
  $('.se-blurred-login-overlay').on('click', (e) => {
    $('.enhanced-options-modal,.se-blurred-login-overlay').addClass('hidden')
  })

  // options change handler
  $('.enhanced-options-content').on('change', 'input[type="checkbox"]', function(e) {
    let name = $(this).attr('name')
    let val = ($(this).prop('checked') ? "1" : "0")
    localStorage.setItem("SE_"+name, val)
    processOption(name, val)
  })

  // select save option
  $('.enhanced-options-content').on('change', 'select.se-save-option', function(e) {
    let name = $(this).attr('name')
    localStorage.setItem("SE_"+name, $(this).val())
    processOption(name, $(this).val())
  })
  
}

function processOption(name, val) {

  switch(name) {
    case "SE_optionDisableAutoRefill":
      $('fieldset.auto-refill-fieldset').addClass('hidden')
      break;
    case "SE_optionEnableTranslations":
      break;
    default:
      // code block
  }
}

function processOptions() {

}


/**
 * Message templates
 */
waitForKeyElements('.theatermodeEmojiButtonChat', addMessageTemplates, false);
function addMessageTemplates(el) {

  if(!$('.se-message-templates-btn').length)
    $(el).before('<button class="se-message-templates-btn ChatInput__inputActionBtn#a_ ChatInput__smilesBtn#tx SmilesButton__btn#Dr" type="button" aria-label="Show smiles"><svg class="IconV2__icon#YR" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2.16 2.16" xml:space="preserve"><path d="M.836 2.048a.06.06 0 0 1-.06-.061l.006-.224H.631c-.114 0-.197-.094-.197-.21V.768c0-.113.082-.205.197-.205h1.204c.114 0 .22.092.22.205v.784c0 .116-.105.21-.22.21h-.582l-.382.274a.06.06 0 0 1-.035.012M.632.683C.583.683.555.72.555.768v.784c0 .049.029.09.077.09h.212a.06.06 0 0 1 .06.061L.9 1.867l.3-.215a.06.06 0 0 1 .035-.012h.602c.048 0 .1-.041.1-.09V.768c0-.048-.05-.085-.1-.085z"/><path d="M.201 1.264q-.019 0-.034-.015a.2.2 0 0 1-.062-.147V.318c0-.113.082-.205.197-.205h1.204c.114 0 .22.092.22.205v.035a.06.06 0 0 1-.12 0V.318c0-.048-.05-.085-.1-.085H.301C.252.233.224.27.224.318v.784c0 .023.003.042.021.058.025.022.024.06.002.084a.07.07 0 0 1-.048.02"/><path d="M1.023.952h-.24a.03.03 0 1 1 0-.06h.24a.03.03 0 1 1 0 .06m.421 0h-.3a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m.24 0h-.12a.03.03 0 1 1 0-.06h.12a.03.03 0 1 1 0 .06m-.781.15h-.12a.03.03 0 1 1 0-.06h.12a.03.03 0 1 1 0 .06m.36 0h-.24a.03.03 0 1 1 0-.06h.24a.03.03 0 1 1 0 .06m.421 0h-.3a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m-.6.181H.783a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m.42 0h-.3a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m.181 0h-.06a.03.03 0 1 1 0-.06h.06a.03.03 0 1 1 0 .06m-.781.149h-.12a.03.03 0 1 1 0-.06h.12a.03.03 0 1 1 0 .06m.331 0h-.21a.03.03 0 1 1 0-.06h.21a.03.03 0 1 1 0 .06"/></svg></button>')

  $('.se-message-templates-btn').off().on('click', function(e) {
    
    // append overlay
    $('.language-chooser').addClass('hidden')
    if($(this).closest('.ChatTabContents').find('.se-message-templates').length) {
      $('.se-message-templates').toggleClass('hidden')
    } else {
      $('.msg-list-wrapper-split').append('<div class="se-message-templates"><div class="title-block"><h3>Templates</h3><span class="se-add-message add-icon-wrapper"><svg class="icon icon-add"><use xlink:href="#icons-add"></use></svg></span><div class="add hidden"><input type="text" value="" placeholder="Your Text"></div><div class="search"><input class="inline-block input text-default theme-default se-msg-tpl-search" name="s" type="search" value="" placeholder="Search message templates ..."></div><button type="button" class="se-close-message-tpl SmilesWidgetContainer__closeBtn#GV" title="Close Languages"><svg style="height:20px;width:20px" class="IconV2__icon#YR" viewBox="0 0 24 24"><path fill="currentColor" d="M20.027 3.985a1.27 1.27 0 0 0-1.796 0L12 10.203l-6.23-6.23a1.27 1.27 0 0 0-1.797 0 1.27 1.27 0 0 0 0 1.796L10.203 12l-6.23 6.23a1.27 1.27 0 0 0 0 1.797c.497.497 1.3.497 1.796 0L12 13.797l6.23 6.23c.498.497 1.3.497 1.797 0s.497-1.3 0-1.796L13.797 12l6.23-6.23c.485-.485.485-1.3 0-1.785"/></svg></button></div><ul class="se-messages-tpl-list"></ul><span class="empty hidden">You haven\'t added any messages yet</span><span class="no-results hidden">No messages found.</span></div>')

      // fetch & insert templates
      localStorage.setItem('SE_messageTemplates', JSON.stringify([
        "Want to talk in their language? Try the Chaturbate Enhanced browser extension. See my bio.",
        "Lorem ipsum dolor amet Lorem ipsum dolor amet Lorem ipsum dolor amet2.",
        "Lorem ipsum dolor amet Lorem ipsum dolor amet Lorem ipsum dolor amet3.",
        "Lorem ipsum dolor amet Lorem ipsum dolor amet Lorem ipsum dolor amet4."
      ]))
      let templates = localStorage.getItem('SE_messageTemplates')
      if(templates) {
        templates = JSON.parse(templates)
        $.each(templates, (k, v) => {
          $('.se-messages-tpl-list').append('<li class="se-message-tpl"><span>'+v+'</span></li>')
        })
        $('.empty').addClass('hidden')
      } else {
        $('.empty').removeClass('hidden')
      }

      // click message
      $('.se-add-message').off().on('click', function(e) {

        // html options overlay
        $('body').append('<div class="blurred-login-overlay se-blurred-login-overlay hidden" style="position: fixed; display: block; inset: 0px; z-index: 1100; visibility: visible;"></div><div class="message-templates-add-modal hidden"></div>')
        $('.message-templates-add-modal').load(htmlEnhancedOptions);
        
      })

      // click message
      $('.se-messages-tpl-list span').on('click', function() {
        $('.se-custom-input').val('').focus()
        document.execCommand('insertText', false, $(this).text())
        $('.se-message-templates').toggleClass('hidden')
      })

      // close overlay
      $('.se-close-message-tpl').on('click', function() {
        $('.se-message-templates').toggleClass('hidden')
      })

      // search messages
      $(".se-msg-tpl-search").off().on("keyup", function() {
        var value = this.value.toLowerCase().trim();
        if(value.length) {
          let results = $(".se-message-tpl").show().filter(function() {
              return $(this).text().toLowerCase().indexOf(value) == -1;
          }).hide();
        } else {
          $(".se-message-tpl").show();
        }
      })
    }
  })
}


/**
 * Add Model Info Overlay
 */
waitForKeyElements(".roomCard", addModelInfoOverlay, false);
function addModelInfoOverlay(el) {

  // add modal toggle button
  if(!$(el).hasClass('se-processed')) {
    $(el).find('.sub-info').append('<li class="se-open-overlay"><svg width="12" height="12" viewBox="0 0 0.225 0.225" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M.129.037a.017.017 0 1 1-.034 0 .017.017 0 0 1 .034 0m0 .075a.017.017 0 1 1-.034 0 .017.017 0 0 1 .034 0M.112.204a.017.017 0 1 0 0-.034.017.017 0 0 0 0 .034" fill="currentColor"/></svg></li>')
    $(el).addClass('se-processed')
  }
}
waitForKeyElements(".list.endless_page_template", addModelInfoOverlayFncs, false);
function addModelInfoOverlayFncs(el) {
 
  $(el).find('.se-open-overlay').on('click', function(e) {
    let username = $(this).closest('.details').find('.cardTitle a').text().toLowerCase()

    // get roomDossier
    let roomDossier = getRoomDossier(username, '.global-toast')
    console.log("roomdick", roomDossier)
    $(this).append(htmlModelOverlay)
  })

}


/**
 * Hide Chat Rooms (Player Title Bar)
 */
waitForKeyElements(".playerTitleBar .reportAbuseLink", hideChatRooms, false);
function hideChatRooms(el) {

    if(!$(el).siblings('.se-hide-room').length) {
        $(el).after('<div class="se-hide-room reportAbuseLink"><a class="SeHideRoom reportRoom" data-testid="hide-room-button" data-paction="HideRoom">Hide Room</a></div>')
        
        $('.playerTitleBar .se-hide-room').off().on('click', function(e) {
          let username = $('.activeRoom').text().toLowerCase().split("'")[0]
          seHideRoom(username)
        })
    }
}

/**
 * Hide Chat Rooms (Room Card)
 */
waitForKeyElements("#roomlist_content_wrapper", hideChatRoomsListing, false);
function hideChatRoomsListing(el) {

  if(!$('.se-hide-room').length) {
    $(el).find('.roomCard .sub-info').append('<li class="se-hide-room"><svg width="1em" height="1em" viewBox="0 0 12 12" role="img"><path fill="currentColor" d="M7.15 6.092a.125.125 0 0 1 0-.177l4.631-4.63A.75.75 0 1 0 10.72.223L6.09 4.853a.125.125 0 0 1-.178 0L1.281.223A.75.75 0 0 0 .218 1.285l4.63 4.631a.125.125 0 0 1 0 .177L.22 10.724a.749.749 0 0 0 .531 1.28.75.75 0 0 0 .53-.22l4.631-4.631a.125.125 0 0 1 .177 0l4.631 4.631a.75.75 0 0 0 1.061-1.06z"></path></svg></li>')

    $('.roomCard .se-hide-room').on('click', function(e) {
      let username = $(this).closest('.details').find('.cardTitle a').text().trim()
      seHideRoom(username)
    })
  }
}
function seHideRoom(username) {
  
    if (confirm("Do you really want to block this room? It will be only visible on the Hidden Rooms page after blocking it.") == true) {
      
      // append username to localStorage
      let hiddenRooms = localStorage.getItem("SE_hiddenRooms")
      if(!hiddenRooms) {
        hiddenRooms = [username]
      } else {
        hiddenRooms = JSON.parse(hiddenRooms)
        hiddenRooms.push(username);
      }
      localStorage.setItem('SE_hiddenRooms', JSON.stringify(hiddenRooms))
      
      // remove model card & redirect if model page
      $('.roomCard a[data-room="'+username+'"]').parent().remove()
      if($('.playerTitleBar .se-hide-room').length)
        window.location.href = "/"
    }
}


/**
 * Message Translation
 */
waitForKeyElements(".message-list", translateMainChat, false);
function translateMainChat(el) {
  let username = $('.user_information_header_username').text()
  let usernameModel = $('.activeRoom').text().split('\'')[0].toLowerCase()

  // observe messages div
  var observer = new MutationObserver(function(e) {

    // DND Mode (filter everything else)
    if(localStorage.getItem('SE_dndMode') === "1") {
      $(el).find('[data-testid="chat-message"]').slice(-50).each(function(index, item) {
        if(
          $(this).find('[data-testid="username"]').text() != username && $(this).find('[data-testid="username"]').text() != usernameModel
          && !$(this).find('.roomNotice.isTip,.roomNotice.titleChange,.roomNotice.bright-background').length || $(this).text().includes("Lovense")
        )
          $(this).addClass("se-hidden")
      })
    } else {
      $(el).find('[data-testid="chat-message"].se-hidden').removeClass('se-hidden')
    }

    
    $(el).find('.roomNotice').slice(-50).each(function(index, item) {
      if($(this).text().indexOf('The show will start in') !== -1) {
        $('#TheaterModePlayer').next('div').append('<h1>Yoooo the show is starting soon!</h1>')
      }
      else if($(this).text().indexOf('until the show starts') !== -1) {
        alert("2")
        $('#TheaterModePlayer').next('div').append('<h1>Yoooo the show is starting soon!</h1>')
      }
      else if($(this).text().indexOf('Ticket Show sales are active') !== -1) {
        alert("3")
        $('#TheaterModePlayer').next('div').append('<h1>Yoooo the show is starting soon!</h1>')
        
      }
    })

    // add translation button to regular messages
    $(el).find('[data-testid="chat-message"]:not(.se-processed):not(.se-hidden)').slice(-50).each(function(index, item) {
      if(!$(this).find('.translate-line').length) {
        $(this).find('.msg-text').append(htmlTranslateButton)
        $(this).addClass("se-processed")
      }
    })

    // auto translate
    if($('.switch-auto-translate input[type="checkbox"]').is(':checked')) {
      $(el).find('[data-testid="chat-message"]:not(.se-hidden):not(.se-translated)').slice(-1).each(function(index, item) {
        let that = $(this)
        let ell = $(this).find('.msg-text').clone()
        ell.find('.defaultUser').remove()
        let text = ell.text().trim()

        translateGoogle(text, 'en_US', $('.model-chat-content')).then(function(data) {
          if(!that.find('.msg-text').find('.translated-line').length) {
            that.find('.msg-text').find('.translate-line').before('<small class="translated-line">'+decodeHtml(data.data.translations[0].translatedText)+'</small>')
          }
        })

        $(this).addClass("se-translated")
      })
    }

  });
  observer.observe($('.message-list')[0], {characterData: true, childList: true, subtree: true});


  // translate button click handler
  $('.message-list').off().on('click', '.translate-line button', function(e) {
      let ell = $(this).closest('.msg-text').clone()
      ell.find('.defaultUser').remove()
      let text = ell.text().trim()
      let that = $(this)
      $(this).prop('disabled', true)

      translateGoogle(text, 'en_US', $('.model-chat-content')).then(function(data) {
        if(!that.closest('.msg-text').find('.translated-line').length) {
            that.closest('.translate-line').before('<small class="translated-line">'+decodeHtml(data.data.translations[0].translatedText)+'</small>')
        }
        $(this).prop('disabled', false)
      })
  })
}


/**
 * Disable Chat Notices
 */
waitForKeyElements('#TheaterModeRoomContents2 #ChatTabContainer', addDisableChat, false);
function addDisableChat(el) {
  let modelUsername = $('.activeRoom').text().toLowerCase().split('\'')[0];
  let username = $('.header-sub-item-wrapper .viewcam-profile-menu-item__label').eq(0).text().toLowerCase()
  if(!modelUsername) return false;

  // get global variable
  let roomDossier = getRoomDossier(modelUsername)

  // add input box notices
  if(roomDossier) {
    roomDossier = JSON.parse(roomDossier)
    if(roomDossier.room_status === "hidden" ) {
      $(el).find('.inputDiv').addClass('se-disabled').find('.chat-input-form').prepend('<div class="is-in-ticket">You can\'t chat while the model is in a Hidden Show.</div>')
    }
    else if(roomDossier.room_status === "private" || roomDossier.premium_show_running) {
      $(el).find('.inputDiv').addClass('se-disabled').find('.chat-input-form').prepend('<div class="is-in-p2p">You can\'t chat while the model is in a Private Show.</div>')
    }
    else if(roomDossier.room_status === "group") {
      $(el).find('.inputDiv').addClass('se-disabled').find('.chat-input-form').prepend('<div class="is-in-group">You can\'t chat while the model is in a Group Show.</div>')
    }
    else if(roomDossier.chat_settings.allowed_chat !== "all" && roomDossier.token_balance === 0) {
      $(el).find('.inputDiv').addClass('se-disabled').find('.se-langpicker').prepend('<div class="is-in-group">You can\'t chat without having tokens.</div>')
    }
  }
}
waitForKeyElements('.vjs-playing.vjs-has-started', addEnableChat, false);
function addEnableChat() {
  $('.model-chat-input').removeClass('se-disabled')
  $('[class*="is-in"]').remove()
}


/**
 * Offline view
 */
waitForKeyElements(".offlineContentContainer", modifyOfflineCamView, false);
function modifyOfflineCamView(el) {
  var htmlOfflineCamView = getResource("html/offline-cam-view.html")

  $(el).find('.offlineRoomNotice').after(htmlOfflineCamView).remove()
}



/**
 * Private Messages Translations
 */ 
waitForKeyElements(".dmWindowInput", addLangDropdownPrivateChats, false);
function addLangDropdownPrivateChats(el) {
  let dm = $(el).closest('.dmWindow')
  let dmSubmit = $(el).find('.sendButton')
  let dmInputDiv = $(el)
  let dmInput = $(el).find('textarea')

  // add language dropdown
  if(!dm.find('.language-picker').length) {
    dmInputDiv.prepend(htmlLangPicker);

    // preselect if choosen before
    if(prefTranslationLang) {
      setTimeout(function() {
        dmInputDiv.find('.se-langpicker').attr('data-active', prefTranslationLang)
        dmInputDiv.find('.se-langpicker').prepend('<svg class="flag flag-'+prefTranslationLang+'"><use xlink:href="#'+prefTranslationLang+'"></use></svg>')
      }, 500);
    }
  }

  // reset language on right click
  dmInputDiv.find(".se-langpicker,.se-langpicker > .flag").on("contextmenu", function() { return false; });
  dmInputDiv.find('.se-langpicker').on('mousedown', function(e) {
      if( e.button == 2 ) {
        dmInputDiv.find('.se-langpicker').find('.flag,use').remove()
        $('.language-chooser .flag').removeClass('active')
        dmInputDiv.find('.se-langpicker').attr('data-active', '')
        localStorage.setItem('prefTranslationLang', "")
        return false;
      }
      return true;
  })
  
  // add own keypress event
  dmInput.off().on('keydown', function(e) {
    if(e.which == 13) {
      e.preventDefault()
      e.stopImmediatePropagation()
      e.stopPropagation()

      dm.find('.language-chooser').addClass("hidden")
      if(dm.find('.se-langpicker').attr('data-active')) {
          let lang = dm.find('.se-langpicker').attr('data-active').toLowerCase()
          dmInputDiv.append('<span class="se-loader-line"></span>') // TODO please as before

          console.log($(this).val(), $(this).text(), lang)
          console.log(dm.find('textarea').val(), dm.find('textarea').text(), lang)

          translateGoogle($(this).val(), lang, dm.find('.content-messages')).then((data) => {
            alert("ok translated")
              // TODO: console.log missing/wrong languages
              $(this).val('')
              $('.messenger-chat .se-loader-line').remove()
              $(this).focus()
              document.execCommand('insertText', false, decodeHtml(data.data.translations[0].translatedText))
              dmSubmit.click()
          });
      } else {
          // no translation needed
          dmSubmit.click()
      }
    }
  })

  // open language picker click handler
  $(el).on('click', '.se-langpicker', function(e) {

      if(!dm.find('.language-chooser').length) {

        // add language picker overlay
        $(el).prev().append(htmlLangChooser);

        // add all languages
        populateLanguageDropdowns()

        setTimeout(() => { $('.flag[data-lang="'+prefTranslationLang+'"]').addClass("active") }, 300);
      } else {
        dm.find('.language-chooser').toggleClass("hidden")
      }
  })

    // select/switch language
    dm.on('click', 'button.flag', function(e) {

      dm.find('.se-langpicker .flag').remove()
      if($(this).hasClass('active')) {
          $(this).removeClass('active')
          dm.find('.se-langpicker').attr('data-active', '')
          localStorage.setItem('prefTranslationLang', "")
      } else {
          dm.find('.se-langpicker').prepend($(this).html())
          dm.find('.language-chooser .flag.active').removeClass('active')
          $(this).addClass('active')
          dm.find('.se-langpicker').attr('data-active', $(this).attr('data-lang'))
          localStorage.setItem('prefTranslationLang', $(this).attr('data-lang'))
          dm.find('.language-chooser').addClass("hidden")
      }
    })

    // search language by html attributes
    dm.on("keyup", ".language-search", function() {
      var value = this.value.toLowerCase().trim();
      if(value.length) {
        $(".language-list button").show().filter(function() {
            return $(this).attr("data-search").toLowerCase().trim().indexOf(value) == -1;
        }).hide();
      } else {
        $(".language-list button").show();
      }
    });

    // clear search input
    dm.on('search', '.language-search', function() {
      if(this.value === "") {
        dm.find(".language-list button").show()
      }
    });

    // close language chooser
    dm.on('click', '.close-language-chooser', function(e) {
      dm.find('.language-chooser').toggleClass("hidden")
    })
}


/**
 * Lifecycle: Player started
 */
waitForKeyElements('#chat-player', showTakeScreenshotButton2, false);
function showTakeScreenshotButton2(el) {
  $('.se-take-screenshot').removeClass('se-disabled') // "Take Screenshot" Button
  $('.se-pip').removeClass('se-hidden') // "Picture in Picture" Button
}


/**
 * Take Screenshot
 */
waitForKeyElements('body:not(.se-banned-room) #satisfactionScore', addTakeScreenshot);
function addTakeScreenshot(el) {
  $(el).after('<div ts="N" class="se-take-screenshot sendTipButton se-disabled" data-testid="take-screenshot-button" style="height: 15px; width: auto; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: inline; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 3px 8px 2px; top: -4px; float: right; border-radius: 3px; cursor: pointer; margin-right: 5px; line-height: 1.4;"><span></span><span>SCREENSHOT</span></div>');

  $('.se-take-screenshot').on('click', function(e) {
    e.preventDefault();

    let vid = $(".videoPlayerDiv video")
    if(vid.length === 0) return
    let canvas = document.createElement("canvas");
    canvas.width = vid[0].videoWidth;
    canvas.height = vid[0].videoHeight;
    canvas.getContext("2d").drawImage(vid[0], 0, 0, vid[0].videoWidth, vid[0].videoHeight);
    if(!canvas) return
    let username = $('.activeRoom').text().split("'")[0].toLowerCase()
    let link = document.createElement('a')
    link.download = genFilename(username, '.png', new Date())
    link.href = canvas.toDataURL()
    link.click()
  })
  function genFilename(fname, ext, date) {
    let d = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    let t = ('0' + date.getHours()).slice(-2) + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2);
    return fname + '__' + d + '_' + t + ext;
  }
}


/**
 * Privacy
 */
localStorage.setItem('followedDropdownClicked', '')


/**
 * Remove Ads & Accept Terms
 */
document.cookie = 'noads=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'agreeterms=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'fromaffiliate=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'affkey="eJxtkE0OwiAQha9C2MymTVraGsPexGtUCkYtkQDGNE3vLo9I6sIV37z5ecysPHLJ+LV3mleMK+sQnu8n+0Yc/QPxpM34miMUjxgwGgO04xx10P7yXBbIuV+Awm0qtRlEI4a6ber2wEQnh072x2y5lwWvCpr8rZWSC0lGvy5UMZog/hmIXPJFFugLpMkFXQKR3rQapO9qyKi9MQJwlKxb9FA+Cm18+wBS3UxH"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'noads=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';
document.cookie = 'agreeterms=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';
document.cookie = 'fromaffiliate=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';
document.cookie = 'affkey="eJxtkE0OwiAQha9C2MymTVraGsPexGtUCkYtkQDGNE3vLo9I6sIV37z5ecysPHLJ+LV3mleMK+sQnu8n+0Yc/QPxpM34miMUjxgwGgO04xx10P7yXBbIuV+Awm0qtRlEI4a6ber2wEQnh072x2y5lwWvCpr8rZWSC0lGvy5UMZog/hmIXPJFFugLpMkFXQKR3rQapO9qyKi9MQJwlKxb9FA+Cm18+wBS3UxH"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';


/**
 * Do Not Disturb Mode
 */
waitForKeyElements('#tab-row', addDefaultEmojis);
function addDefaultEmojis(el) {

  // append dnd toggle
  $(el).append('<div class="se-switcher switch-dnd-mode"><span>DND Mode</span><div class="toggle"><input name="SE_dndMode" type="checkbox" id="mode-toggle" value="1" class="toggle__input"><label for="mode-toggle" class="toggle__label"></label></div></div>')
  if(localStorage.getItem('SE_dndMode') === "1") {
    $('.switch-dnd-mode .switcher').toggleClass("on")
    $('.switch-dnd-mode input[type="checkbox"]').prop('checked', true)
  }
  
  $('.switch-dnd-mode').on('click', function(e) {
    if(!$(this).find('input').prop('checked'))
      $('.msg-text.se-hidden').removeClass('se-hidden')
  })
}


/**
 *  Add Translation Button to Stream Description
 */
waitForKeyElements('#VideoPanel .RoomSubjectSpan', addTransButtonCamGroup, false);
function addTransButtonCamGroup(el) {

  if(!$(el).find('.translate-line').length) {
    $(el).append(htmlTranslateButton)
  }

  // add event click handler
  $(el).off().on('click', '.translate-line', function(e) {
      let text = $(this).closest('.RoomSubjectSpan').clone().text().trim()
      let that = $(this)
      $(this).prop('disabled', true)

      translateGoogle(text, 'en_US', $('.model-chat-content')).then(function(data) {
        if(!that.prev('.translated-line').length) {
            that.before('<small class="translated-line">'+decodeHtml(data.data.translations[0].translatedText)+'</small>')
        }
        $(this).prop('disabled', false)
      })
  })
}


/**
 * Sound for new DM's
 */
waitForKeyElements(".user_information_icon.has_unread", addIconSoundForDMs);
function addIconSoundForDMs(el) {
  playNotificationSound()
}
waitForKeyElements("#DmWindowBar .dmWindow", addSoundForDMs);
function addSoundForDMs(el) {

  // add sound toggle icon
  $(el).find('.dmWindowHeader').before('<div class="button se-dm-sound-toggle" data-testid="close" style="position: absolute; height: 20px; width: 20px; border-radius: 5px; top: 5px; right: 60px; display: block;"><svg style="position: relative; height: 16px; width: 16px; left: 5px; top: 4px;" width="16" height="16" viewBox="0 0 0.72 0.72" fill="rgba(255,255,255,.5)"><path d="M0.36 0.165a0.15 0.15 0 0 1 0.15 0.15v0.067a0.06 0.06 0 0 0 0.015 0.04l0.038 0.043c0.026 0.029 0.005 0.075 -0.034 0.075H0.19c-0.039 0 -0.059 -0.046 -0.034 -0.075l0.038 -0.043A0.06 0.06 0 0 0 0.21 0.382V0.315a0.15 0.15 0 0 1 0.15 -0.15m0 0V0.09m-0.27 0.24a0.27 0.27 0 0 1 0.12 -0.225M0.63 0.33a0.27 0.27 0 0 0 -0.12 -0.225M0.33 0.63h0.06" class="sound" stroke="rgba(255,255,255,.5)" stroke-width="0.06" stroke-linecap="round" stroke-linejoin="round"/></svg></div>')

  // start after 2sec (so it doesnt notify about loading messages)
  setTimeout(() => {

    var observer = new MutationObserver(function(e) {
      if(!$(el).find('.se-dm-sound-toggle').hasClass('se-sound-off')) { // TODO PARENT ELEMENT
        playNotificationSound()
      }
    });
    observer.observe($(el).find('.dmWindowHeader').next().find('div:first-child > div:first-child > div:not([data-testid]) > div:first-child')[0], {characterData: false, childList: true, subtree: true});
  }, 2000);

  /** sound toggle */
  $('.se-dm-sound-toggle').on('click', function(e) {
    e.preventDefault()
    e.stopImmediatePropagation
    e.stopPropagation
    $(this).toggleClass("se-sound-off")
  })
}
function playNotificationSound() {
    let src = chrome.runtime.getURL('mp3/notification.mp3');
    let audio = new Audio(src);
    audio.play();
}


/**
 * Picture in Picture
 */
waitForKeyElements(".theater-overlay", videoAddPip, false);
function videoAddPip(el) {

  // midclick fullscreen
  if(!$('body').hasClass('se-init-fullscreen')) {

    $('#TheaterModeRoomContents').on('mousedown', 'video,.vjs-tech', function(e) {
      if(e.which === 2) {
        e.preventDefault();
        toggleFullscreen(document.getElementsByClassName('vjs-tech')[0])
      }
    });
    $('#TheaterModeRoomContents').on('dblclick', 'video,.vjs-tech', function(e) {
      toggleFullscreen(document.getElementsByClassName('vjs-tech')[0])
    });
    $('body').addClass('se-init-fullscreen')
  }

  // pip
  if(!$('body').hasClass('se-init-pip')) {

    $(el).next().append('<div class="se-pip hover-btn drop-shadow-container se-hidden" aria-label="Theater Mode" data-listener-count-pointerenter="3" data-listener-count-pointerleave="3" ts="_" id="theater-mode-icon" data-listener-count-click="1" style="display: inline-flex; position: relative; align-items: center; justify-content: center; min-width: 32px; user-select: none; pointer-events: auto;"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-pip"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" fill="#fff"/><path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z" fill="#fff"/></svg><div class="no-drop-shadow video-controls-tooltip" ts="N" style="position: absolute; display: block; opacity: 0; bottom: calc(100% + 5px); left: 50%; transform: translateX(-50%); border-radius: 4px; background-color: rgba(0, 0, 0, 0.92); padding: 8px 16px; text-align: center; font-size: 13px; color: rgb(255, 255, 255); width: max-content; max-width: 150px; transition: inherit; pointer-events: none; visibility: hidden;"><p style="display: inline;">Theater Mode</p></div></div>')
    $('.se-pip').on('click', function(e) {
      $(this).attr('disabled', true)
      openPip(document.getElementsByClassName('vjs-tech')[0])
      $(this).attr('disabled', false)
    });
    $('body').addClass('se-init-pip')
  }
}
function toggleFullscreen(elem) {

    if (document.fullscreenElement === elem) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    } else {
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
      }
    }
}
function openPip(elem) {
  if (elem.requestPictureInPicture) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      elem.requestPictureInPicture();
    }
  }
}


/**
 * Add language/translation dropdown to main chat
 */
waitForKeyElements(".chat-input-form", addLangDropdown, false);
function addLangDropdown(jNode) {
  let modelChat = $(jNode).closest('.ChatTabContents')
  let modelChatInput = $(jNode).find('.customInput.chat-input-field')
  let modelChatSubmit = $(jNode).closest('.inputDiv').find('.SendButton.chat')

  // add dropdown html
  if(!modelChat.find('.se-langpicker').length) {
    $(jNode).before(htmlLangPicker);
    
    // prepopulate
    populateLanguageDropdowns()

    // preselect if choosen before
    if(prefTranslationLang) {
      setTimeout(function() {
        $('.se-langpicker').attr('data-active', prefTranslationLang)
        $('.se-langpicker').prepend('<svg class="flag flag-'+prefTranslationLang+'"><use xlink:href="#'+prefTranslationLang+'"></use></svg>')
      }, 500);
    }
  }

  // create own input
  $(jNode).find('.chat-input-field').addClass('se-hidden')
  $(jNode).append('<input class="se-custom-input customInput chat-input-field" type="text" value="" style="background: none; color: #b3b3b3; height: 16px; width: 100%; position: relative; overflow: scroll hidden; -webkit-tap-highlight-color: transparent; outline: none; border: none; box-sizing: border-box; font-size: 12px; white-space: nowrap; user-select: text; font-family: Helvetica, Arial, sans-serif; line-height: 15px;">')

  // add own keypress event
  $('.se-custom-input').on('blur input', function(e) {
    modelChatInput.text($(this).val()).trigger("blur").trigger("input").trigger("paste")
  })

  $(jNode).closest('div').off().on('click', '.SendButton.chat', function() {
    $('.se-custom-input').val('')
  })
  $('.se-custom-input').on('keydown', function(e) {
    if(e.which == 13) {
      e.preventDefault()
      e.stopImmediatePropagation()
      e.stopPropagation()
      $('.language-chooser').addClass("hidden")
      let submitButton = $(this).parent().parent().find('.SendButton')

      if($('.se-langpicker').attr('data-active')) {

        // only logged in users
        if(!$('.user_information_container').length) {
            alert("You have to be logged in to send translated messages.")
            return
        }
        
        translateGoogle($(this).val(), $('.se-langpicker').attr('data-active').toLowerCase(), $('.msg-list-wrapper-split')).then((data) => {
          let trans = decodeHtml(data.data.translations[0].translatedText)
          $(this).val('').focus()
          document.execCommand('insertText', false, trans)
          modelChatInput.text(trans)
          submitButton.click()
        })
      } else {

        // no translation needed
        submitButton.click()
        $(this).val('').focus()
      }
      $('.se-loader-line').remove()
    }
  })

  // hide language chooser on send button && smiles button click
  $('.SendButton.chat').on('click', () => { $('.language-chooser').addClass("hidden"); $(this).closest('.inputDiv').find('.se-custom-input').focus(); })

  // click language button
  $('.se-langpicker').off().on('click', function(e) {

    // split screen
    if(!$('.msg-list-wrapper-split .language-chooser').length) {
      $('.msg-list-wrapper-split').append(htmlLangChooser);
    } else {
      $('.msg-list-wrapper-split .language-chooser').toggleClass('hidden')
    }
    // full screen
    if(!$('.msg-list-wrapper-fvm .language-chooser').length) {
      $('.msg-list-wrapper-fvm').append(htmlLangChooser);
    } else {
      $('.msg-list-wrapper-fvm .language-chooser').toggleClass('hidden')
    }
    
    // add all languages
    populateLanguageDropdowns()
  })
    
  // close language chooser
  $('.window').off().on('click', '.close', function() {
    $(this).closest('.language-chooser').addClass("hidden")
  })

  // reset language on right click
  $(".se-langpicker,.se-langpicker > .flag").on("contextmenu", function() { return false; });
  $('.se-langpicker').on('mousedown', function(e) {
    if( e.button == 2 ) {
      $('.se-langpicker').find('.flag,use').remove()
      $('.language-chooser .flag').removeClass('active')
      $('.se-langpicker').attr('data-active', '')
      localStorage.setItem('prefTranslationLang', "")
      return false;
    }
    return true;
  })

  // select/switch language
  $('.msg-list-wrapper-split').off().on('click', '.language-chooser .flag', function(e) {
    let lang = $(this).attr('data-lang')
    
    // add to recent list
    $('.language-list.recent').prepend($(this).prop('outerHTML'))

    // select/switch
    $('.se-langpicker').find('.flag,use').remove()
    if($(this).hasClass('active')) {
      $(this).removeClass('active')
      $('.se-langpicker').attr('data-active', '')
      localStorage.setItem('prefTranslationLang', "")
    } else {
      $('.se-langpicker').prepend($(this).html())
      $('.language-chooser .flag.active').removeClass('active')
      $(this).addClass('active')
      $('.se-langpicker').attr('data-active', lang)
      localStorage.setItem('prefTranslationLang', lang)
      $('.language-chooser').addClass("hidden")
    }

    // add recent language to localStorage
    let recentLangs = localStorage.getItem("SE_recentLanguages")
    if(!recentLangs) {
      recentLangs = [lang]
    } else {
      recentLangs = JSON.parse(recentLangs)
      recentLangs.push(lang)
      recentLangs = recentLangs.slice(0,9)
    }
    localStorage.setItem('SE_recentLanguages', JSON.stringify(recentLangs.reverse()))
  })

  // search language by html attributes
  $('.ChatTabContents').off().on("keyup", ".language-search", function() {
    var value = this.value.toLowerCase().trim();
    if (value.length >= 1) {
      var elem = $(this);
      elem.data('search',  value)
      .clearQueue().stop()
      .queue(function() {
        $(".language-list button").removeClass('hidden').filter(function() {
            return $(this).attr("data-search").toLowerCase().indexOf(value) === -1;
        }).addClass('hidden');
        if (elem.data('search') !=  value) return;
      });
    } else if (value.length <= 1) {
      $(".language-list button").show();
    }
  });

  // clear search input
  $('.ChatTabContents').on('search', '.language-search', function() {
    if(this.value === "") {
      $(".language-list button").show()
    }
  });
}
waitForKeyElements(".emojiSelectionModal", modifyEmojiPicker, false);
function modifyEmojiPicker(el) {

  // sync emoji insert with custom input
  $(el).on('click', '.emojiDiv', function(e) { $('.se-custom-input').delay(100).val($('.se-custom-input').val() + $(this).find('img').eq(0).attr('alt')).trigger('blur') })
}


/**
 * Auto Tip Button
 */
waitForKeyElements("#sendTipButton", addAutoTipButton, false);
function addAutoTipButton(el) {
  let htmlAutoTipButton = '<span class="auto-tip-button sendTipButton" title="Auto TIP" data-testid="send-tip-button" class="sendTipButton" style="overflow: hidden; line-height: 1.4; height: 24px; font-size: 12px; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; margin: 11px 4px 11px 0px; text-overflow: ellipsis; white-space: nowrap; padding: 3px 10px; box-sizing: border-box; cursor: pointer; display: inline-block; border-width: 1px; border-style: solid;">AUTO TIP</span>'

  // append button
  if(!$('.auto-tip-button').length)
    $(el).after(htmlAutoTipButton)

  // auto tip button handler
  $('.auto-tip-button').on('click', function(e) {
    if(!$('.auto-tip-overlay').length) {
      $('#main > div').append(htmlAutoTipOverlay)
    } else {
      $(".auto-tip-overlay").remove();
    }
  })

  // send auto tip
  $('.auto-tip-overlay form').on('submit', function(e) {
    e.preventDefault()

    // execute autotip js
    let timeout = xxx; // time between tips in milliseconds
    let tokens = xx; // number of times sent
    let tip_amount = xx; // number of tokens per tip
    let username = "xxxxxxx"; // user to tip
    //eval('for(i=0;i<tokens;i++) { setTimeout(function() { $.post("https://chaturbate.com/tipping/send_tip/" + username + "/", {"csrfmiddlewaretoken":$.cookie("csrftoken"), tip_amount: tip_amount})}, i*timeout)}')
  })
  
  // close auto tip overlay on outside click
  $(document).on('click', function (e) {
    if($(".auto-tip-overlay").length) {
      if (!$('.auto-tip-overlay').is(e.target) && !$('.auto-tip-overlay *').is(e.target) && !$('.auto-tip-button').is(e.target)) {
        $(".auto-tip-overlay").remove()
      }
    }
  });
}


/**
 * Hide Follow Recommendations (Follow Popup)
 */
var htmlCloseFollowRecommendation = '<button type="button" class="se-follow-recommendations-close" title="Hide Follow Recommendations"><svg style="height: 20px; width: 20px;" class="IconV2__icon#YR" viewBox="0 0 24 24"><path fill="currentColor" d="M20.0273 3.98544C19.5303 3.48852 18.7276 3.48852 18.2307 3.98544L12 10.2034L5.76926 3.9727C5.27233 3.47577 4.4696 3.47577 3.97267 3.9727C3.47574 4.46963 3.47574 5.27236 3.97267 5.76929L10.2034 12L3.97267 18.2307C3.47574 18.7276 3.47574 19.5304 3.97267 20.0273C4.4696 20.5242 5.27233 20.5242 5.76926 20.0273L12 13.7966L18.2307 20.0273C18.7276 20.5242 19.5303 20.5242 20.0273 20.0273C20.5242 19.5304 20.5242 18.7276 20.0273 18.2307L13.7966 12L20.0273 5.76929C20.5115 5.2851 20.5115 4.46963 20.0273 3.98544Z"></path></svg></button>'
var htmlOpenFollowRecommendation = '<div class="roomlist_container"><button type="button" class="se-follow-recommendations-open" title="Show Follow Recommendations">Show Follow Recommendations</button></div>'
waitForKeyElements(".followRecommendedHeader + div + .followRoomTable", hidePopupFollowRecommendations, false);
function hidePopupFollowRecommendations(el) {
  
  // append close button
  $(el).prepend(htmlCloseFollowRecommendation)

  // hide preset
  if(localStorage.getItem('SE_hidePopupFollowRecommendations')) {
    $(el).addClass('se-hidden').before(htmlOpenFollowRecommendation)
    $(el).siblings('.followRecommendedHeader').addClass('se-hidden')
  }

  // close button event
  $('.followRoomTable').on('click', '.se-follow-recommendations-close', function(e) {
    e.preventDefault
    e.stopPropagation
    e.stopImmediatePropagation
    localStorage.setItem('SE_hidePopupFollowRecommendations', 1)
    $(el).addClass('se-hidden').before(htmlOpenFollowRecommendation)
  })

  // open button event
  $('.followRecommendedContainer').on('click', '.se-follow-recommendations-open', function(e) {
    localStorage.removeItem('SE_hidePopupFollowRecommendations', 0)
    $(el).removeClass('se-hidden').siblings('.followRecommendedHeader').removeClass('se-hidden')
    $(this).parent().remove()
  })
}

/**
 * Hide Follow Recommendations (Content)
 */
waitForKeyElements(".followRecommendations.roomlist_container", hideFollowRecommendations, false);
function hideFollowRecommendations(el) {
  
  // append close button
  $(el).prepend(htmlCloseFollowRecommendation)

  // hide preset
  if(localStorage.getItem('SE_hideFollowRecommendations'))
    $(el).addClass('se-hidden').before(htmlOpenFollowRecommendation)

  // close button event
  $('.se-follow-recommendations-close').on('click', function(e) {
    localStorage.setItem('SE_hideFollowRecommendations', 1)
    $(el).addClass('se-hidden').before(htmlOpenFollowRecommendation)
  })

  // open button event
  $('#roomlist_root').on('click', '.se-follow-recommendations-open', function(e) {
    localStorage.removeItem('SE_hideFollowRecommendations', 0)
    $(this).parent().remove()
    $('.followRecommendations.roomlist_container').removeClass('se-hidden')
  })
}


/**
 * Favorites Filtering
 */
waitForKeyElements(".followed_online_offline", addFavoritesFilters, false);
function addFavoritesFilters(el) {

  // add country filter
  if(!$(el).find('.filters-favorites.page-block').length) {

    // add filters block html
    $(el).append(getResource('html/favorites-filters.html'))
  }

  // repopulate country filter on offline/offline click
  $('.followed_online_offline > .title a').on('click', function(e) {
    $('.country select option').not(':first').remove()
    populateCountryFilter()
  })

  // country filter
  populateCountryFilter()
  $('.filters-favorites').on('change', '.country select', function(e) {
    let country = $(this).val().toLowerCase()
    if(country) {
      var filteredCountries = $('.roomCard:not(.hidden)').removeClass('hidden').filter(function() {
        return (!$(this).find('.thumbnail_flag>div>span').length || $(this).find('.thumbnail_flag>div>span').attr('title').toLowerCase().indexOf(country) === -1)
      }).addClass('hidden')
    } else {
      $('.roomCard.hidden').removeClass('hidden')
    }
  })

  // search filter
  $('.filters-favorites').on('input search', '.search input', function(e) {
    let username = $(this).val().toLowerCase()
    if(username) {
      var filteredUsers = $('.roomCard:not(.hidden)').removeClass('hidden').filter(function() {
        return $(this).find('.cardTitle>a').attr('data-room').toLowerCase().indexOf(username) === -1
      }).addClass('hidden');
    } else {
      $('.roomCard.hidden').removeClass('hidden')
    }
  })

  // show all
  $('.filters-favorites').on('click', '.show-all', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden')
    $('.filters-favorites .search input').val("")
  })

  // in ticket show
  $('.filters-favorites').on('click', '.in-ticket-show', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden').filter(function() {
      return $(this).find('.icon-ticket').length === 0
    }).addClass('hidden')
  })

  // in group show
  $('.filters-favorites').on('click', '.in-group-show', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden').filter(function() {
      return $(this).find('.icon-group-ds').length === 0
    }).addClass('hidden')
  })

  // in private show
  $('.filters-favorites').on('click', '.in-private-show', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden').filter(function() {
      return (
        $(this).find('.model-list-private-badge').text().toLowerCase().indexOf("in private") === -1
        && !$(this).find('[class*="ModelThumbPrivateCover__label"]').length
      )
    }).addClass('hidden')

  })

  // switch grid template
  var cols = localStorage.getItem("SE_gridTemplate")
  if(cols) $('.list.endless_page_template').attr('data-grid', cols)
  $('.filters-favorites').on('click', '.switch-grid-tpl', function(e) {
    e.preventDefault()
    if(!cols) cols = ($('.list.endless_page_template').attr('data-grid') ? $('.list.endless_page_template').attr('data-grid') : 8)
    cols = (parseInt(cols) <= 9 ? parseInt(cols) + 1 : 1)
    updateGridColumns(cols)
  })
  
  $('.filters-favorites').on('contextmenu', '.switch-grid-tpl', function(e) {
    e.preventDefault()
    if(!cols) cols = ($('.list.endless_page_template').attr('data-grid') ? $('.list.endless_page_template').attr('data-grid') : 8)
    cols = (parseInt(cols) > 1 ? parseInt(cols) - 1 : 10)
    updateGridColumns(cols)
  })
}
waitForKeyElements(".followedPage .roomCard", filterFavoritesPageListing, false);
function filterFavoritesPageListing(el) {

  if($(el).find('.filters-favorites .search input').val()) {
    let username = $(this).val().toLowerCase()
    var filteredUsers = $('.roomCard').show().filter(function() {
      return $(this).find('.cardTitle>a').attr('data-room').toLowerCase().indexOf(username) === -1
    }).hide();
  }
}
function updateGridColumns(cols) {
  localStorage.setItem("SE_gridTemplate", cols)
  $('.list.endless_page_template').attr('data-grid', cols)
}
function populateCountryFilter() {
  // populate country filter
  setTimeout(() => {
    $('.roomlist_container:not(.followRecommendations) .roomCard .thumbnail_flag>div>span').each(function() {
      if(!$('.country select').find('select option[value="'+$(this).attr('title')+'"]').length) $('.country select').append('<option value="'+$(this).attr('title')+'">'+$(this).attr('title')+'</option')
    })
  }, 500)
}

/* Lifecycle: Start Body */
waitForKeyElements('body', lifecycleBodyStart, false);
function lifecycleBodyStart(el) {

  // set custom body classes
  let pathname = location.pathname.split('/')[1]
  if(pathname == "") pathname = "home"
  $('body').addClass('se-page-'+pathname)

  // theme preset
  let theme = localStorage.getItem('SE_FrontendTheme')
  $('body').attr('class', function(i, c){ return c.replace(/(^|\s)se-theme-\S+/g, '') }).addClass('se-theme-'+theme)


  // var observer = new MutationObserver(function(e) {

  // });
  // observer.observe($('.list.endless_page_template')[0], {characterData: true, childList: true, subtree: true});
  // SE Follows
  // $('.list.endless_page_template').append('<li class="roomCard camBgColor se-roomcard" data-testid="room-card" ts="f"><a href="#" data-room-nav="true" data-room="username" class="room_thumbnail_container"><img width="180" height="101" src="https://jpeg.live.mmcdn.com/minifwap/lizeth_salazar.jpg?f=0.2622172719922623" data-testid="room-card-image" alt="lizeth_salazar" data-room-nav="true" data-wide-image="true" class="room_thumbnail"></a><div class="labelContainer"><div class="thumbnail_label" data-testid="thumbnail-label"></div></div><div class="details" ts="w"><div class="cardTitle title"><a href="/lizeth_salazar/" data-room="lizeth_salazar" data-room-nav="true" data-testid="room-card-username" data-listener-count-click="1">lizeth_salazar</a><div class="age_gender_container"><span class="age" data-testid="room-card-age">20</span><span class="camAltTextColor genderf" title="Female" data-testid="room-card-gender"></span><span class="thumbnail_flag" data-testid="room-card-thumbnail-flag"><div ts="FlagIconWrapper"><span data-testid="room-card-country" class="fi fi-co" title="Colombia"></span></div></span></div></div><ul class="subject camSubjectColor" title="fuck my pussy wet at goal @200 #bigboobs #latina #teen #lovense #cute [0 tokens remaining]" ts="y"><li>fuck my pussy wet at goal @200 <a href="https://chaturbate.com/followed-cams/?tag=bigboobs" class="camSubjectTagColor" data-listener-count-click="1">#bigboobs</a> <a href="https://chaturbate.com/followed-cams/?tag=latina" class="camSubjectTagColor" data-listener-count-click="1">#latina</a> <a href="https://chaturbate.com/followed-cams/?tag=teen" class="camSubjectTagColor" data-listener-count-click="1">#teen</a> <a href="https://chaturbate.com/followed-cams/?tag=lovense" class="camSubjectTagColor" data-listener-count-click="1">#lovense</a> <a href="https://chaturbate.com/followed-cams/?tag=cute" class="camSubjectTagColor" data-listener-count-click="1">#cute</a> [0 tokens remaining]</li></ul><ul class="sub-info camAltTextColor"><li class="location" data-testid="room-card-location" style="white-space: nowrap;">Colombia</li><li class="cams " style="white-space: nowrap;"><span class="time">3.3 hrs</span><span class="comma">, </span><span class="viewers">8 viewers</span></li><li class="se-open-overlay"><svg width="12" height="12" viewBox="0 0 0.225 0.225" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M.129.037a.017.017 0 1 1-.034 0 .017.017 0 0 1 .034 0m0 .075a.017.017 0 1 1-.034 0 .017.017 0 0 1 .034 0M.112.204a.017.017 0 1 0 0-.034.017.017 0 0 0 0 .034" fill="currentColor"></path></svg></li></ul></div><div data-slug="lizeth_salazar" data-testid="follow-star" class="follow_star icon_following" title="Unfollow" ts="c"></div></li>')
}

/**
 * Global Functions
 */

// Get extension resources
function getResource(path) {
  let data

  $.ajax({
    url:chrome.runtime.getURL(path),
    success: function(html) {
      data = html;
    },
    async: false}
  )
    
  return data
}

// Switch Toggle
waitForKeyElements('#main.chat_room', addBodyShit);
function addBodyShit(el) {

  $(el).on('click', '.se-switcher', function(e) {
    $(this).toggleClass("on")
    $(this).find('input').prop('checked', function (i, val) {
      return !val;
    }).trigger('change');
    localStorage.setItem($(this).find('input').attr('name'), ($(this).find('input').is(':checked') ? $(this).find('input').val() : "0"))
  })
}

// Google Cloud Translation API
function translateGoogle(val, lang, errordiv) {
  let data = $.getJSON('https://translation.googleapis.com/language/translate/v2?key='+googleApiKey+'&q='+encodeURIComponent(val)+'&target='+lang.toString().trim()).fail(function(data) {
    data = $.parseJSON(data.responseText)

    // error handling
    $('.model-chat-error').remove()
    if(errordiv && data.error.code) {
      $(errordiv).append('<div class="model-chat-error"><div class="group-show-in-progress-message m-bg-error message message-base system-text-message system-text-message-error"><div class="message-body"><span class="system-text-message__body"><span class="">[StripChat Enhanced] Translation Error: <small><em>'+data.error.message+'</em></small></span></span></div></div></div>')

      // close error
      $('.model-chat-error').on('click', function() { $(this).remove() })
    }
  });

  return data
}

// decode html entities
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// populate languages to dropdowns and language lists
function populateLanguageDropdowns() {

  // all languages
  $.each(iso639_langs, function(key, val) {
    if(val.active === 1 && !$('.language-list .flag-'+val.name).length) {
      $('.language-list:not(.recent)').append('<button aria-label="'+val.name+'" class="flag flag-'+key+'" type="button" title="'+val.name+'" data-search="'+val.name+'|'+val.nativeName+'|'+key+'" data-lang="'+key+'"><svg class="flag flag-'+key+'"><use xlink:href="#'+key+'"></use></svg></button>')
    }
  })

  // recent languages
  let recent = localStorage.getItem('SE_recentLanguages')
  recent = JSON.parse(recent)
  $.each(recent, function(index, val) {
    key = val
    val = iso639_langs[key]
    if(!$('.language-list.recent .flag-'+key).length) {
      $('.language-list.recent').append('<button aria-label="'+val.name+'" class="flag flag-'+key+'" type="button" title="'+val.name+'" data-search="'+val.name+'|'+val.nativeName+'|'+key+'" data-lang="'+key+'"><svg class="flag flag-'+key+'"><use xlink:href="#'+key+'"></use></svg></button>')
    }
  })
  $('.language-list.se-loading').removeClass('.se-loading')
}

// get RoomDossier
function getRoomDossier(modelUsername, errordiv) {
  //let roomDossier = Array.from($('body').html().matchAll(/initialRoomDossier = "(.*?)"/g), m => m[1])
  //roomDossier = roomDossier[0].replaceAll("\\u0022", "\"").replaceAll("\\u003C", "\<").replaceAll("\\u002D", "-").replaceAll("\\u003D", "=").replaceAll("\\u005C", "\\").replaceAll("\\u0026", "&").replaceAll("\\u0026", "&").replaceAll("\\ud83c", ".")
  
  let data = $.getJSON('https://chaturbate.com/api/chatvideocontext/'+modelUsername+'/').fail(function(data) {
    data = JSON.parse(data.responseText)

    // error handling
    $('.model-chat-error').remove()
    if(errordiv && data.error.code) {
      $('.model-chat-error').remove()
      $(errordiv).append('<div class="model-chat-error"><div class="group-show-in-progress-message m-bg-error message message-base system-text-message system-text-message-error"><div class="message-body"><span class="system-text-message__body"><span class="">[StripChat Enhanced] Translation Error: <small><em>'+data.error.message+'</em></small></span></span></div></div></div>')

      // close error
      $('.model-chat-error').on('click', function() { $(this).remove() })
    }
  });

  return (data ? JSON.parse(data.responseText) : false)
}

// get/set remoteStorage
function remoteStorageGet(key, val) {
  
}
function remoteStorageSet(key, val) {
  
}
