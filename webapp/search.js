var map;
var geocoder;
var drawerEl = document.querySelector('.mdc-persistent-drawer');
var MDCPersistentDrawer = mdc.drawer.MDCPersistentDrawer;
var drawer = new MDCPersistentDrawer(drawerEl);
var myResults = [];

document.querySelector('.hamburger-menu').addEventListener('click', function() {
    drawer.open = !drawer.open;
});
drawerEl.addEventListener('MDCPersistentDrawer:open', function() {
    console.log('Received MDCPersistentDrawer:open');
});
drawerEl.addEventListener('MDCPersistentDrawer:close', function() {
    console.log('Received MDCPersistentDrawer:close');
});

$("#mainsearchbox").keypress(function(event) {
    if (event.which == 13) {
        $("#do_search").click();
    }
});

$(window).scroll(function() {
    
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        $('.hide, .mdc-list-item').not('#template').first().removeClass('hide');;
    }
});

function show_map() {
    $('#map-tab').addClass('mdc-tab--active');
    $('#list-tab').removeClass('mdc-tab--active');
    $('#newsmap').show();
    $('#newslist').hide();
};

function show_list() {
    $('#list-tab').addClass('mdc-tab--active');
    $('#map-tab').removeClass('mdc-tab--active');
    $('#newsmap').hide();
    $('#newslist').show();    
};

function addNewsToMap(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
};

function advanced_search(what) {
    $("#adv-search-switch").click();
    search_and_display(what);
    
};

function search_to_map(what) {
        var count = 0;
    var result = [];
    var news = {};

                
    $('#results-header').text('Results for: ' + what);
    $('.mdc-list-item').not('#template').remove();
    $('.mdc-toolbar-fixed-adjust').removeClass('hide');
    $.getJSON("https://immigrant-news.firebaseio.com/stories.json", function(data) {
        
        $.each(data, function(key, val) {
            if (JSON.stringify(val).toLowerCase().includes(what.toLowerCase())) {
                // news.id = key;
                // news.value = JSON.parse(val);
                // console.log(hola, news);
                // result.push(news);
                
                count++;
                
                var $t = $('#template').clone();
                $t.prop('id', key);
                
                $t.find('.ranking').text(val.percentage + '%');
                if (val.percentage > 80) {
                    $t.find('.ranking').addClass('high_ranking');    
                } else if (val.percentage < 40) {
                    $t.find('.ranking').addClass('low_ranking');    
                } else {
                    $t.find('.ranking').addClass('medium_ranking');    
                };
                
                $t.find('.result-title').text(val.title.substring(0,100));
                $t.find('.result-title').prop('href', 'stories.html?id=' + key.replace('story',''));
                $t.find('.mdc-list-item__text__secondary').text(val.description.substring(0,100));
                if (count < 10) {
                    $t.removeClass('hide');    
                };
                
                $t.appendTo('#search-results-list');
                
                addNewsToMap(val.location);
            };
        });
        
        
        if (count > 0) {
                $('#results-header').text('Results for: ' + what);
                $('#showmoreresults').removeClass('hide');
                $('#results-footer').text(count + ' results found');
        } else {
            $('#map-tab').click();
        }
    });
    
};


/* Search for some word and look it up on all news 
   and add those results to the result list */
function search_and_display(what) {
    var count = 0;
    var result = [];
    var news = {};

                
    $('#results-header').text('Results for: ' + what);
    $('.mdc-list-item').not('#template').remove();
    $('.mdc-toolbar-fixed-adjust').removeClass('hide');
    $.getJSON("https://immigrant-news.firebaseio.com/stories.json", function(data) {
        
        $.each(data, function(key, val) {
            if (JSON.stringify(val).toLowerCase().includes(what.toLowerCase())) {
                // news.id = key;
                // news.value = JSON.parse(val);
                // console.log(hola, news);
                // result.push(news);
                
                count++;
                
                var $t = $('#template').clone();
                $t.prop('id', key);
                
                $t.find('.ranking').text(val.percentage + '%');
                if (val.percentage > 80) {
                    $t.find('.ranking').addClass('high_ranking');    
                } else if (val.percentage < 40) {
                    $t.find('.ranking').addClass('low_ranking');    
                } else {
                    $t.find('.ranking').addClass('medium_ranking');    
                };
                
                $t.find('.result-title').text(val.title.substring(0,100));
                $t.find('.result-title').prop('href', 'stories.html?id=' + key.replace('story',''));
                $t.find('.mdc-list-item__text__secondary').text(val.description.substring(0,100));
                if (count < 10) {
                    $t.removeClass('hide');    
                };
                
                $t.appendTo('#search-results-list');
                
                addNewsToMap(val.location);
            };
        });
        
        
        if (count > 0) {
                $('#results-header').text('Results for: ' + what);
                $('#showmoreresults').removeClass('hide');
                $('#results-footer').text(count + ' results found');
        } else {
            $('#showmoreresults').hide();
            $('#results-footer').removeClass('hide').text(count + ' results found');
        }
    });
}

function show_more_results(count) {
    if (count > 0) {
        $('.hide.mdc-list-item').not('#template').first().removeClass('hide');  
        setTimeout(function(){
           show_more_results(count -1);
        }, 70);
    };

    if ($('.hide.mdc-list-item').not('#template').length == 0) {
        $('#showmoreresults').hide();
        $('#results-footer').removeClass('hide').text(count + ' results found');

    }
}
    
function toggleAdvancedSearch() {
    // $('#advanced_search_form').slideToggle();
    $('#simple-search-box').slideToggle();
    $('.srch').toggle();
}


 