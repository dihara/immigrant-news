var map;
var geocoder;
var drawerEl = document.querySelector('.mdc-persistent-drawer');
var MDCPersistentDrawer = mdc.drawer.MDCPersistentDrawer;
// var drawer = new MDCPersistentDrawer(drawerEl);
var myResults = [];
var mapMarkers = [];
// document.querySelector('.hamburger-menu').addEventListener('click', function() {
//     drawer.open = !drawer.open;
// });
// drawerEl.addEventListener('MDCPersistentDrawer:open', function() {
//     console.log('Received MDCPersistentDrawer:open');
// });
// drawerEl.addEventListener('MDCPersistentDrawer:close', function() {
//     console.log('Received MDCPersistentDrawer:close');
// });

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

function addNewsToMap(address, verified, contentString) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
          

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });          
          
        
        // map.setCenter(results[0].geometry.location);
        
        if (verified<0) {
            var image = 'img/red-marker.png';
        }
        
        if (verified==0) {
            var image = 'img/yellow-marker.png';
        }

        if (verified>0) {
            var image = 'img/green-marker.png';
        }

        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            icon: image
        });
        
        mapMarkers.push(marker);
        
        marker.addListener('click', function() {
          infowindow.open(map, marker);
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

function clearAllMarkers(){
    for (var i = 0; i < mapMarkers.length; i++) {
        mapMarkers[i].setMap(null);
    };
    
    mapMarkers = [];
}

function search_to_map(what) {
    var count = 0;
    var result = [];
    var news = {};

                
    // $('#results-header').text('Results for: ' + what);
    // $('.mdc-list-item').not('#template').remove();
    // $('.mdc-toolbar-fixed-adjust').removeClass('hide');
    clearAllMarkers();
    $.getJSON("https://immigrant-news.firebaseio.com/stories.json", function(data) {
        
        $.each(data, function(key, val) {
            if (JSON.stringify(val).toLowerCase().includes(what.toLowerCase())) {
                count++;
                
                // var $t = $('#template').clone();
                // $t.prop('id', key);
                
                // $t.find('.ranking').text(val.percentage + '%');
                // if (val.percentage > 80) {
                //     $t.find('.ranking').addClass('high_ranking');    
                // } else if (val.percentage < 40) {
                //     $t.find('.ranking').addClass('low_ranking');    
                // } else {
                //     $t.find('.ranking').addClass('medium_ranking');    
                // };
                
                // $t.find('.result-title').text(val.title.substring(0,100));
                // $t.find('.result-title').prop('href', '/stories.html?id=' + key.replace('story',''));
                // $t.find('.mdc-list-item__text__secondary').text(val.description.substring(0,100));
                // if (count < 10) {
                //     $t.removeClass('hide');    
                // };
                
                // $t.appendTo('#search-results-list');
                
                // console.log(val.validations);
                
                var validity_index = 0;
                 
                $.each(val.validations, function(key, val) {
                    if (val.vote=='valid') {
                        validity_index = validity_index + 1;    
                    } else {
                        validity_index = validity_index - 1;
                    };
                
                });

                 var contentString = '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            '<h1 id="firstHeading" class="firstHeading">' + val.title + '</h1>' +
                            '<div id="bodyContent">' +
                            '<p>' + val.description + '</p>' +
                            '<p>See <a href="/stories.php?id=' + key.replace('story', '') + '">' + 
                            'the complete post</a></p>' +
                            '</div>' +
                            '</div>';


                
                addNewsToMap(val.location, validity_index, contentString);

            };
        });
        
        
        if (count > 0) {
                $('#results-header').text('Results for: ' + what);
                $('#showmoreresults').removeClass('hide');
                $('#results-footer').text(count + ' results found');
        } else {
            $('#map-tab').click();
        };
    });
    
};


/* Search for some word and look it up on all news 
   and add those results to the result list */
function search_and_display(what, panel) {
    var count = 0;
    var result = [];
    var news = {};

    clearAllMarkers();
                
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
                
                var validity_index = 0;
                 
                $.each(val.validations, function(key, val) {
                    if (val.vote=='valid') {
                        validity_index = validity_index + 1;    
                    } else {
                        validity_index = validity_index - 1;
                    };
                
                });                
                
                if (validity_index > 0) {
                    $t.find('#news-ranking').css('background', 'green');
                };
                
                if (validity_index < 0) {
                    $t.find('#news-ranking').css('background', 'red');
                };
                
                if (validity_index == 0) {
                    $t.find('#news-ranking').css('background', 'yellow');
                };                
                // if (val.percentage > 80) {
                //     $t.find('.ranking').addClass('high_ranking');    
                // } else if (val.percentage < 40) {
                //     $t.find('.ranking').addClass('low_ranking');    
                // } else {
                //     $t.find('.ranking').addClass('medium_ranking');    
                // };
                
                $t.find('.result-title').text(val.title.substring(0,100));
                $t.find('.result-title').prop('href', 'stories.html?id=' + key.replace('story',''));
                $t.find('.mdc-list-item__text__secondary').text(val.description.substring(0,100));
                if (count < 10) {
                    $t.removeClass('hide');    
                };
                
                $t.appendTo('#search-results-list');
                


                 var contentString = '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            '<h1 id="firstHeading" class="firstHeading">' + val.title + '</h1>' +
                            '<div id="bodyContent">' +
                            '<p>' + val.description + '</p>' +
                            '<p>See <a href="/stories.php?id=' + key.replace('story', '') + '">' + 
                            'the complete post</a></p>' +
                            '</div>' +
                            '</div>';


                
                addNewsToMap(val.location, validity_index, contentString);

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
    
    if (panel=='map') {
      $('#map-tab').click();
    } else {
      $('#list-tab').click();
    };
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


 