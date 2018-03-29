$(document).ready(function () {

      
     $("#list-nearby").swipe( {
         swipeLeft: function (event, direction, distance, duration, fingerCount) {
             $('#nearby-next').trigger('click');
             return false;
         },
         swipeRight: function (event, direction, distance, duration, fingerCount) {
             $('#nearby-prev').trigger('click');
             return false;
         },
         swipeUp: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         swipeDown: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         threshold:0,
         excludedElements: ".noSwipe",
         allowPageScroll:"vertical"
     });
      

     $("#list-new").swipe( {
         swipeLeft: function (event, direction, distance, duration, fingerCount) {
             $('#new-next').trigger('click');
             return false;
         },
         swipeRight: function (event, direction, distance, duration, fingerCount) {
             $('#new-prev').trigger('click');
             return false;
         },
         swipeUp: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         swipeDown: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         threshold:0,
         excludedElements: ".noSwipe",
         allowPageScroll:"vertical"
      });


     $("#list-popular").swipe( {
         swipeLeft: function (event, direction, distance, duration, fingerCount) {
             $('#popular-next').trigger('click');
             return false;
         },
         swipeRight: function (event, direction, distance, duration, fingerCount) {
             $('#popular-prev').trigger('click');
             return false;
         },
         swipeUp: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         swipeDown: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         threshold:0,
         excludedElements: ".noSwipe",
         allowPageScroll:"vertical"
      });

     $("#big_img_slider").swipe( {
         swipeLeft: function (event, direction, distance, duration, fingerCount) {
             $('#big-img-next').trigger('click');
             return false;
         },
         swipeRight: function (event, direction, distance, duration, fingerCount) {
             $('#big-img-prev').trigger('click');
             return false;
         },
         swipeUp: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         swipeDown: function (event, direction, distance, duration, fingerCount) {
             return false;
         },
         threshold:0,
         excludedElements: ".noSwipe",
         allowPageScroll:"vertical"
      });

    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        })
    };



if($('.map_field #map').length){

	function get_map_height(){
		var hh = $(window).height();
		var top = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
		var wr_h = $('#wrap').height();

		if (top+hh>$('footer').offset().top){
			hh = wr_h-top-190-90;
		}
		else {
			hh = hh-166;
		}
        if($('#wrap').width()<=620) {
            hh = hh + 30;
        }
        $('.map_field #map').css({'height': hh});
	}
		get_map_height();


		$(window).resize(function(){
			get_map_height();
								  });
    if($('#wrap').width()>620){
		$(window).scroll(function(){
			get_map_height();
								  });
        }
	}


    jQuery.validator.addMethod("phoneRU", function (phone_number, element) {
		phone_number = phone_number.replace(/\s+/g, "");
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^\+[0-9]{11}$/) ||
			phone_number.match(/^\+[0-9]{12}$/);
	}, "Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½ Ð² Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ +79150000000");

	jQuery.validator.addMethod("is_not_equal", function (value, element, params) {
		return this.optional(element) || value != params[0];
	}, '');

	$('form input').live('keyup', function () {
		if ($(this).hasClass('valid') && $(this).next('label.error').length > 0) {
			$(this).next('label.error').remove();
		}
	});

    $(".message #close").on("click", function () {
        $(".message").hide();
    });

    if ($('#how-it-work-slider').length) {
        cat_item_jcarousel(500, '#how-it-work-slider', false, false);
    }

    if ($('#step_by_slider').length) {
        cat_item_jcarousel(500, '#step_by_slider', 'circular', false);
    }

    $(".to_down").click(function () {
        var scroll_down = $(this).attr('href');
        if ($(scroll_down).length) {
            $('html, body').animate({scrollTop: $(scroll_down).offset().top}, 500)
        }
        return false
    });

    if($('#video').length) {
        $('#video').on('change', function () {
            var a = $('#video').val();
            var b = /\?v=([0-9A-z\-_]*)/.exec(a);
            if(!b)
                b = /be\/(.*)/.exec(a);
            if(b) {

                $('#video_id').val(b[1]);
                $('#iframe_youtube_error').css('display','none');
                $('#iframe_youtube').css('display','block');
                $('#iframe_youtube').attr('src','https://www.youtube.com/embed/'+b[1]+'?html5=1');
                // $('#iframe_youtube').attr('src','https://www.youtube.com/v/'+b[1]+'?enablejsapi=1&rel=0&version=3&playerapiid=iframe_youtube');
            } else {
                $('#iframe_youtube').css('display','none');
                $('#iframe_youtube_error').css('display','block');
                $('#video_id').val("");
            }
        });
    }



    if ($('#info_form').length) {
        $('#info_form input[name="tel"]').mask("+99999999999");
        $('#info_form input[name="tel2"]').mask("+99999999999");
        $('#info_form').validate({
            rules: {
                surname: {
                    required: true
                },
                name: {
                    required: true
                },
                tel: {
                    required: true
                },
                tel2: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                city: {
                    required: true
                },
                address: {
                    required: true
                },
                company: {
                    required: true
                },
            },
            messages: {
                surname: {
                    required: ''
                },
                name: {
                    required: ''
                },
                tel: {
                    required: ''
                },
                tel2: {
                    required: ''
                },
                email: {
                    required: '',
                    email: ''
                },
                city: {
                    required: ''
                },
                address: {
                    required: ''
                },
                company: {
                    required: ''
                },
            }
        })
    }
    if ($('#enter_form').length) {
        $('#enter_form').validate({
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true
                },
            },
            messages: {
                email: {
                    required: '',
                    email: ''
                },
                password: {
                    required: ''
                },
            }
        })
    }

    // if ($('#registration_form').length) {
    //     $('#registration_form').validate({
    //         rules: {
    //             email: {
    //                 required: true,
    //                 email: true
    //             },
    //             password: {
    //                 required: true
    //             },
    //         },
    //         messages: {
    //             email: {
    //                 required: '',
    //                 email: 'Введите корректный email'
    //             },
    //             password: {
    //                 required: ''
    //             },
    //         }
    //     })
    // }

    if ($('.input_file').length) {
        $('.input_file input').live('change', function () {
            $(this).parents('.input_file').find('.val').text(this.value);
            $(this).blur();
        })
    }
    if ($('.home_search_form').length) {
        /*
         if (device.iphone()==true || device.ipod()==true || device.ipad()==true || device.android()==true || device.tablet()==true ||    device.mobile()==true ) {
         $(this).find('.active_class').removeClass('active_class');
         $('.home_search_form .label_list li:first').addClass('active_mobile');
         $('.home_search_form .label_list li label').click(function(){
         $('.home_search_form .label_list li.active').removeClass('active_mobile');
         $(this).parents('li').addClass('active_mobile')
         })
         }
         */
        $('.home_search_form .label_list li label').hover(function () {
            var left = $(this).parents('li').offset().left - $('.label_list').offset().left;
            var width = $(this).parents('li').width();
            $('.home_search_form .active_class').stop().animate({'left': left, 'width': width})
        }, function () {
            var left = $('.home_search_form .label_list li.active').offset().left - $('.label_list').offset().left;
            var width = $('.home_search_form .label_list li.active').width();
            $('.home_search_form .active_class').stop().animate({'left': left, 'width': width})
        })
        $('.home_search_form .label_list li.active label').mouseover();


        $('.home_search_form .label_list li label').click(function () {
            $('.home_search_form .label_list li.active').removeClass('active')
            $(this).parents('li').addClass('active')
        })

    }

    if ($('#big_img_slider').length) {
        cat_item_jcarousel(500, '#big_img_slider', 'circular', false);
    }


    if ($('#list-new').length) {
        cat_item_jcarousel(500, '#list-new', 'circular', false);
    }

    if ($('#list-nearby').length) {
        cat_item_jcarousel(500, '#list-nearby', 'circular', false);
    }

    if ($('#list-popular').length) {
        cat_item_jcarousel(500, '#list-popular', 'circular', false);
    }


    if ($('.change_checkbox').length) {
        enable_radios_checkboxes();
    }

    if ($('#from').length) {
        $.datepicker.regional['ru'] = {
            closeText: 'Закрыть',
            prevText: '&#x3c;Пред',
            nextText: 'След&#x3e;',
            currentText: 'Сегодня',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
            beforeShow: function (input) {
                $(input).parents('.field ').addClass('zIndex');
            },
        };

        $.datepicker.setDefaults($.datepicker.regional['ru']);


        $("#from").datepicker({

            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $("#to").datepicker("option", "minDate", selectedDate);
            }
        });
    }
    if ($('#from2').length) {
        $.datepicker.regional['ru'] = {
            closeText: 'Закрыть',
            prevText: '&#x3c;Пред',
            nextText: 'След&#x3e;',
            currentText: 'Сегодня',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
        };

        $.datepicker.setDefaults($.datepicker.regional['ru']);


        $("#from2").datepicker({

            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $("#to").datepicker("option", "minDate", selectedDate);
            }
        });
    }

    if ($('#to').length) {
        $("#to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $("#from").datepicker("option", "maxDate", selectedDate);
            }
        });

    }
    if ($('.selectTime').length) {
        $('select').styler();
    }
    // $('#basicModal').modal();

    //if ($('.dropzone').length) {
    //    Dropzone.autoDiscover = false;
    //    var myDropzone = new Dropzone('#my-awesome-dropzone');
    //
    //}
    if ($('.drops').length) {
        $('.boxdrop .name').click(function () {

            if($(this).parents('.boxdrop').find('input[name=selectdown]').val()==$('#now_drop').val()) {
                $('#now_drop').val('0');
                $('.closeAll').click();
            } else {
                $('.closeAll').click();
                if($(this).parents('.boxdrop').find('input[name=selectdown]').val()==4){
                    if (prop_type.indexOf('1')>-1 || prop_type.indexOf('2')>-1 || prop_type.indexOf('3')>-1) {
                        $(this).parents('.boxdrop').find('.selectdown').animate({'height': 'show'})
                    }
                }
                else {
                    $(this).parents('.boxdrop').find('.selectdown').animate({'height': 'show'})
                }
                $('.closeAll').css({'display': 'block'})
                $('#now_drop').val($(this).parents('.boxdrop').find('input[name=selectdown]').val());

            }
        })
    }
    if ($('.closeAll').length) {
        $('.closeAll').live('click', function () {
            $('.selectdown').animate({'height': 'hide'})
            $(this).hide();
            $('#now_drop').val('0');
            //refreshMarkers(".closeAll Click");
            return false
        })
    }
    $('.hint_box .icon').click(function () {
        if (this.className.indexOf('active') + 1) {
            $(this).parent().find('.hint_text').fadeOut()
            $(this).removeClass('active')
            $('.closeAllhint').css({'display': 'none'})
        }
        else {
            $(this).parent().find('.hint_text').fadeIn()
            $(this).addClass('active');

            $('.closeAllhint').css({'display': 'block'})
        }
    })
    $('.hint_box .closehint').click(function () {
        $(this).parents('.hint_box').find('.hint_text').fadeOut()
        $(this).parents('.hint_box').find('.icon').click()
    })
    if ($('.closeAllhint').length) {
        $('.closeAllhint').live('click', function () {
            $('.hint_text').fadeOut()
            $('.hint_box .icon').removeClass('active')
            $(this).hide();
            return false
        })
    }
    function priority_refresh(){
        form_data = $('#priority_form').serialize();
                $.ajax({
                    type: "POST",
                    url: "/object/"+$('#r_id').val()+"/add/photo/priority/",
                    data: form_data,
                    success: function(data) {
                        // alert(data);

                    }
                });

    }
    $('.close_item').live('click',function(){
        var is_checked = false;
        $("input[name='main']").each(function () {
            if ($(this).is(':checked') || $(this).val() == 'Yes') {
                is_checked = true;
            }
        });
        if (!is_checked){
            obj1 = $("input[name='main']").first();
            obj1.parent('.change_checkbox').trigger('click');
            obj1.trigger('click');

            priority_refresh();
        }
    });

    $('#main').live('click',function(){
       priority_refresh();
    });
    if ($('#sortable').length) {
        $('#sortable').sortable({
            items: 'li[data-value="moveimg"]',
            stop: function(){
                priority_now = 0;
                $('.upload_list').find('.item').each(function( index ) {
                    $(this).find('#prch').val(++priority_now);
                });
                priority_refresh();


            }
        });
        if (device.iphone() == true || device.ipod() == true || device.ipad() == true || device.android() == true || device.tablet() == true || device.mobile() == true) {
            $('#sortable').sortable('disable')
        }

    }

    $('.close_item').click(function () {
        h1 = $(this).parents('.item');
        $.ajax({
                    type: "POST",
                    url: "/object/11872730/add/photo/delete/",
                    data: "id="+$(this).parent('.item').find('#id').val()+"&csrfmiddlewaretoken="+$.cookie("csrftoken") ,
                    success: function(data) {
                        // alert(data);
                        h1.remove()
                        if ($('#delete_refresh').val() == 1) {
                            location.reload();
                        }
                    }
                });

    })
    $('#listing_type_selects input[type="checkbox"]').live('click', function () {
        discs_check();
    })
    if ($('#listing_type_selects.boxdrop .name').length) {
        discs_check();
    }
    $('#beds_select .selectdown ul li a').live('click', function () {
        var htm = $(this).text() + ' beds';
        $('#beds_select .name .count').html(htm);
        $('.closeAll').click();
        return false
    })

    function getFactor(max_price){
        var factor;
        if ((currency == '$') || (currency == '€')) rate = 1;

        if ((deal_type == 1) || (deal_type == 3)) 
           factor = 55000 * rate;
        else
           factor = 250 * rate;

        if (max_price >= 2000 * rate) factor = 500 * rate;
        if (max_price >= 10000 * rate) factor = 1000 * rate;
        if (max_price >= 30000 * rate) factor = 2000 * rate;
        if (max_price >= 50000 * rate) factor = 5000 * rate;
        if (max_price >= 100000 * rate) factor = 10000 * rate;
        if (max_price >= 200000 * rate) factor = 50000 * rate;
        if (max_price >= 500000 * rate) factor = 100000 * rate;
        if (max_price >= 1500000 * rate) factor = 200000 * rate;
        if (max_price >= 6000000 * rate) factor = 300000 * rate;
        if (max_price >= 10000000 * rate) factor = 400000 * rate;


        if ((deal_type == 1) || (deal_type == 3))
           nfloor = 1000;
        else
           nfloor = 100;

        factor = Math.floor(factor / nfloor);
        factor = factor * nfloor; 

        return factor;
    }


    
    function draw_price_to(){
        max_price = $('#min_price_filter').val();
        if(!max_price) max_price = 0;
        var html = "";
        $('#price_boxdrop ul.list-2').html("");
        for (var i=0; i<7; i++){
            max_price = parseInt(max_price.replace(/,/g, ''));
            max_price = max_price + getFactor(max_price);
            max_price = max_price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            html += '<li><a href="#" title="'+max_price+'">'+$('#currency_ico').val()+''+max_price+'</a></li>'+"\r";
        }
        html += "<li><a href='#' title=''>" + $('#any_price').val() + "</a></li>\r";
        $('#price_boxdrop ul.list-2').html(html);
    }

    $('#price_boxdrop ul.list-1 li a').live('click', function(){
        $('#price_boxdrop .selectdown input.min').val($(this).attr('title'));
        draw_price_to();
        $('#price_boxdrop ul.list-1').hide();
        $('#price_boxdrop ul.list-2').show();
        
		get_price_boxdrop();
		return false
	})

	$('#price_boxdrop ul.list-2 li a').live('click', function(){
		if ($(this).attr('title') !='0'){
			$('#price_boxdrop .selectdown input.max').val($(this).attr('title'));
		}

		$('.closeAll').click();
        get_price_boxdrop();
        setTimeout(function () {
            $('#price_boxdrop ul.list-1').show();
            $('#price_boxdrop ul.list-2').hide();
        }, 500);


		return false
	})
    $('#price_boxdrop .selectdown input.min').live('focus', function () {
        $('#price_boxdrop ul.list-1').show();
        $('#price_boxdrop ul.list-2').hide();
    })
    $('#price_boxdrop .selectdown input.max').live('focus', function () {
        $('#price_boxdrop ul.list-2').show();
        $('#price_boxdrop ul.list-1').hide();
        draw_price_to();
    })

    /*scroll-pane*/

    if ($('.scroll-pane').length > 0) {

        $('.scroll-pane').jScrollPane({
            showArrows: true,
            verticalArrowPositions: 'split',
            mouseWheelSpeed: 50
        });

    }
    if ($('#slidedots').length) {
        if (device.iphone() == true || device.ipod() == true || device.ipad() == true || device.android() == true || device.tablet() == true || device.mobile() == true) {
        }
        else {
        }
        var scrolling = true;
        $('#slidedots a').click(function () {

            scrolling = false;
            $('#slidedots li.active').removeClass('active');
            $(this).parents('li').addClass('active');
            var target = $(this).attr('href');

            if (device.mobile() == true) {
                $('html, body').animate({
                    scrollTop: ($(target).offset().top - 100)
                }, 500, function () {
                    scrolling = true;
                });
            }
            else {
                $('html, body').animate({
                    scrollTop: ($(target).offset().top - 150)
                }, 500, function () {
                    scrolling = true;
                });
            }
            return false
        })

        if (dot_buttons && dot_buttons.length > 0) {
            $(window).scroll(function () {
                if (scrolling == true) {
                    var top = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
                    for (i = 0; i < dot_buttons.length; i++) {
                        var id1 = dot_buttons[i];
                        if ((i + 1) < dot_buttons.length) {
                            var id2 = dot_buttons[i + 1];

                            if (top + 150 >= $(id1).offset().top && top < $(id2).offset().top - 150) {
                                $('#slidedots li.active').removeClass('active');
                                $('#slidedots li ').eq(i).addClass('active');

                            }
                        }
                        else {
                            if (top + 2 >= $(id1).offset().top - 150) {

                                $('#slidedots li.active').removeClass('active');
                                $('#slidedots li').eq(i).addClass('active');
                            }
                        }

                    }
                }
            })
            $(window).scroll(function () {
                var top = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
                if ($('#wrap').height() == $(window).height() + top) {
                    $('#slidedots li').addClass('actclass')
                }
                else {
                    $('#slidedots li').removeClass('actclass')
                }
            })

        }

    }


    $('.check_map').on('change', function () {
        if ($('input[name="is_land_map"]').is(":checked")) {
            $('.field_map').css({'display': 'block'});
            $(this).addClass('check');
            initialize();
        }
        else {
            $('.field_map').css({'display': 'none'});
            $(this).removeClass('check');

        }
    });


    // $('.check_map').toggle(function () {
    //     // initialize();
    //     $('.field_map').css({'display': 'block'});
    //     $(this).addClass('check');
    //     $(this).find("input").prop('checked', 'checked');
    //     // $(this).prop('checked', 'checked');
    //     initialize();
    //     //
    //
    //
    // }, function () {
    //     $('.field_map').css({'display': 'none'});
    //     $(this).removeClass('check');
    //     $(this).find("input").prop('checked', '');
    //     // $(this).prop('checked', '');
    // });


    $(window).scroll(function () {
        check_position()
    })
    if ($('#slidedots_cheker').length > 0) {
        check_position()
    }


    $('.navbar-toggle').toggle(function () {
        $('.click_space').css({'display': 'block'})
        $('.collapse.navbar-collapse').addClass('in')
    }, function () {
        $('.click_space').css({'display': 'none'})
        $('.collapse.navbar-collapse').removeClass('in')
    })
    $('.click_space').click(function () {
        $('.navbar-toggle').click()
    })
    
    /*
    $('.expand a').toggle(function () {
        $(this).parents('.details').find('.inside').css({'height': 'auto'})
        $(this).text('Unfold');
    }, function () {
        $(this).parents('.details').find('.inside').css({'height': '174px'})
        $(this).text('Fold');
    })
    $('.expand a').toggle(function () {
        $(this).parents('.about_object').find('.inside').css({'height': 'auto'})
        $(this).text('Fold');
    }, function () {
        $(this).parents('.about_object').find('.inside').css({'height': '174px'})
        $(this).text('Unfold');
    })
    */


})
/*$(document).ready(function() end*/
function check_position() {
    if ($('#slidedots_cheker').length) {
        var topxx = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
        if (topxx > $('#slidedots_cheker').offset().top) {
            $('.fixed_step2').css('height',(parseInt($('.fixed_step').height())+parseInt($('.fixed_step').css('padding-top'))));
            $('body').addClass('other_header');
        }
        else {
            $('.fixed_step2').css('height',0);
            $('body').removeClass('other_header');
        }
    }


}
function cat_item_jcarousel(sped, id, wra, autoplay) {

    var jcarousel = $(id).find('.jcarousel');
    $(jcarousel).find('.item').each(function (i) {
        $(this).attr('val', i + 1);
    })
    if (device.iphone() == true || device.ipod() == true || device.ipad() == true || device.android() == true || device.tablet() == true || device.mobile() == true) {
        var wra_mob = '1';
    }
    jcarousel
        .jcarousel({
            wrap: wra,
            vertical:false,
            animation: {
                duration: sped,
                complete: function () {

                }
            }
        });

    $(id).find('.jcarousel-control-next')
        .jcarouselControl({
            target: '+=1'
        })
        .on('jcarouselcontrol:active', function () {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function () {
            $(this).addClass('inactive');
        })
    $(id).find('.jcarousel-control-prev')
        .jcarouselControl({
            target: '-=1'
        })
        .on('jcarouselcontrol:active', function () {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function () {
            $(this).addClass('inactive');
        });
    var timeoutID = setTimeout(function () {
    }, 0);
    $(id).find('.jcarousel-pagination')
        .on('jcarouselpagination:active', 'a', function () {

            clearTimeout(timeoutID);

            $(this).addClass('active');
            var indx = $(this).text() - 0;
            if (id == '#how-it-work-slider') {
                if (indx == 5) {
                    timeoutID = setTimeout(function () {
                        if ($(id).find('.jcarousel-pagination a:eq(4)').hasClass('active')) {
                            $(id).find('.jcarousel-pagination a:eq(4)').addClass('zakras');
                        }
                        else {
                            $(id).find('.jcarousel-pagination a:eq(4)').removeClass('zakras');
                        }
                    }, 5000);
                }
                else {
                    $(id).find('.jcarousel-pagination a:eq(4)').removeClass('zakras');
                }
            }

            $(jcarousel).find('.item.active').removeClass('active');
            $(jcarousel).find('.item[val="' + indx + '"]').addClass('active');

        })
        .on('jcarouselpagination:inactive', 'a', function () {
            $(this).removeClass('active');

        })
        .on('click', function (e) {
            e.preventDefault();
        })
        .jcarouselPagination({
            perPage: 1,
            item: function (page) {
                return '<a href="#' + page + '" >' + page + '</a>';
            }
        });
    if (wra_mob == '1' && id != '#how-it-work-slider' && id != '#list-new' && id != '#list-nearby' && id != '#list-popular' && id !='#big_img_slider'){

        var coords = new Array();
        var Zleft = $(id).find('.jcarousel li:first').width();
        $(id).find('.jcarousel-pagination a').each(function (i) {
            coords[i] = i * Zleft;
        })
        var maxL = Zleft * ($(id).find('.jcarousel-pagination a').length - 1);
        var slist = $(id).find('.jcarousel ul');
        var pleft1 = 0;
        var pleft2 = 0;
        $(slist).draggable({
            axis: "x",
            start: function () {
                pleft1 = $(slist).css('left').replace('px', '') - 0;


            },
            drag: function () {
                pleft2 = $(slist).css('left').replace('px', '') - 0;
                if (Math.abs(pleft2 - pleft1) > 10) {
                    if (pleft2 - pleft1 < 0) {

                        $(id).find('.jcarousel-control-next').click();
                    }
                    else {
                        $(id).find('.jcarousel-control-prev').click();
                    }
                    return false
                }
            },
            stop: function () {
                pleft2 = $(slist).css('left').replace('px', '') - 0;
            }
        });
    }
    // Автопрокрутка слайдера
    if (autoplay != false) {
        $(jcarousel).jcarouselAutoscroll({
            interval: autoplay,
            target: '+=1',
            autostart: true
        });
    }


}
function enable_radios_checkboxes() {
    $('.change_checkbox').addClass('hide_inp');
    $('.change_checkbox').each(function () {
        var span = document.createElement("span");
        span.className = 'ch_box';
        $(this).prepend(span);
        if ($(this).find('input[type="checkbox"]').attr('checked') == true || $(this).find('input[type="checkbox"]').attr('checked') == 'checked') {
            $(this).addClass('check');
        }
        else {
            $(span).removeClass('check');
        }
        if ($(this).find('input[type="radio"]').attr('checked') == true || $(this).find('input[type="radio"]').attr('checked') == 'checked') {
            $(this).addClass('check');
        }
        else {
            $(span).removeClass('check');
        }
    })
    $('.change_checkbox input[type="checkbox"]').bind('click', function () {
        check_checkboxes(this);
    })
    $('.change_checkbox input[type="radio"]').bind('click', function () {
        check_radiobuttons(this);
    })
}


function disable_radios_checkboxes() {
    $('.change_checkbox').each(function () {
        $(this).removeClass('hide_inp').removeClass('check').find('span.ch_box').remove();
        $(this).find('input').unbind('click');

    })
}

function check_checkboxes(n) {
    if ($(n).attr('checked') == true || $(n).attr('checked') == 'checked') {
        $(n.parentNode).addClass('check');
    }
    else {
        $(n.parentNode).removeClass('check');
    }
}

function check_radiobuttons(n) {
    var name1 = $(n).attr('name');
    $('.change_checkbox input[name="' + name1 + '"]').each(function () {
        if ($(this).attr('checked') == true || $(this).attr('checked') == 'checked') {
            $(this).parents('.change_checkbox').addClass('check');
        }
        else {
            $(this).parents('.change_checkbox').removeClass('check');
        }
    })

}
function validate(inp) {
    inp.value = inp.value.replace(/[^\d,.]*/g, '')
        .replace(/([,.])[,.]+/g, '$1')
        .replace(/^[^\d]*(\d+([.,]\d{0,5})?).*$/g, '$1');
}
function discs_check() {
    $('#listing_type_selects.boxdrop .name .circle').remove();
    if ($('input#green_disc:checked').length > 0) {
        $('#listing_type_selects.boxdrop .name').prepend('<span class="circle green"></span>');
    }
    if ($('input#red_disc:checked').length > 0) {
        $('#listing_type_selects.boxdrop .name').prepend('<span class="circle red"></span>');
    }
    if ($('input#yellow_disc:checked').length > 0) {
        $('#listing_type_selects.boxdrop .name').prepend('<span class="circle yellow"></span>');
    }
}


function humanNumber(number){
    number = number.toString().replace(/,/g, '');
    if(number < 10000)
        return $('#currency_ico').val()+number;
    else if(number < 1000000)
        return $('#currency_ico').val()+Math.round(number/1000)+"K";
    else
        return $('#currency_ico').val()+Math.round(number/1000000)+"M";


}


function get_price_boxdrop(not_refresh) {
    var v1 = $('#price_boxdrop .selectdown input.min').val();
    var v2 = $('#price_boxdrop .selectdown input.max').val();
    if (v1 == 0 && ( v2 == '' || v2 == 0)) {
        $('#price_boxdrop .name .count').html($('#any_price').val());
    }
    else if (v1 != 0 && v2 == '') {
        v1 = humanNumber(v1);
        $('#price_boxdrop .name .count').html($('#more_than').val() + ' ' + v1);
    }
    else if (v1 == 0 && (v2 != '' || v2 != 0)) {
        v2 = humanNumber(v2);
        $('#price_boxdrop .name .count').html($('#txt_upto').val()+ ' ' + v2);
    }
    else {
        v1 = humanNumber(v1);
        v2 = humanNumber(v2);
        $('#price_boxdrop .name .count').html(v1 + ' – ' + v2);
        // $('#now_drop').val('0');
    }
    if(!not_refresh)
        refreshMarkers("get_price_boxdrop");
}


/**
 *
 * HTML5 Image uploader with Jcrop
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// convert bytes into friendly format
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

// check for selected crop region
function checkForm() {
    if (parseInt($('#w').val())) return true;
    $('.error').html($('#jserror_4').val()).show();
    return false;
};

// update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
    $('#x1').val(e.x);
    $('#y1').val(e.y);
    $('#x2').val(e.x2);
    $('#y2').val(e.y2);
    $('#w').val(e.w);
    $('#h').val(e.h);
};

// clear info by cropping (onRelease event handler)
function clearInfo() {
    $('.info #w').val('');
    $('.info #h').val('');
};

// Create variables (in this scope) to hold the Jcrop API and image size
var jcrop_api, boundx, boundy;

function fileSelectHandler() {

    // get selected file
    var oFile = $('#image_file')[0].files[0];

    // hide all errors
    $('.error').hide();

    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (!rFilter.test(oFile.type)) {
        $('.error').html($('#jserror_1').val()).show();
        return;
    }

    // check for file size
    if (oFile.size > 1024 * 1024) {
        $('.error').html($('#jserror_2').val()).show();
        return;
    }

    // preview element
    var oImage = document.getElementById('preview');





    // prepare HTML5 FileReader
    var oReader = new FileReader();
    oReader.onload = function (e) {

        // e.target.result contains the DataURL which we can use as a source of the image
        oImage.src = e.target.result;
        oImage.onload = function () { // onload event handler


            // display step 2
            $('.step2').fadeIn(500);
            $('#cancel_avatar').show();

            // display some basic image info
            var sResultFileSize = bytesToSize(oFile.size);
            //$('#filesize').val(sResultFileSize);
            //$('#filetype').val(oFile.type);
            //$('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);

            // destroy Jcrop if it is existed

            if (typeof jcrop_api != 'undefined') {
                jcrop_api.destroy();
                jcrop_api = null;
                //alert('destroyed');
                //$('#preview').width(oImage.naturalWidth);
                //$('#preview').height(oImage.naturalHeight);
            }

            setTimeout(function () {
                // initialize Jcrop




                $('#preview').Jcrop({
                    minSize: [200, 200], // min crop size
                    aspectRatio: 1, // keep aspect ratio 1:1
                    bgFade: true, // use fade effect
                    bgOpacity: .3, // fade opacity
                    onChange: updateInfo,
                    onSelect: updateInfo,
                    onRelease: clearInfo
                }, function () {

                    // use the Jcrop API to get the real image size
                    var bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];

                    // Store the Jcrop API in the jcrop_api variable
                    jcrop_api = this;

                    if(oImage.naturalWidth<200||oImage.naturalHeight<200) {
                        $('.error').html($('#jserror_3').val()).show();

                    return;
                    }

                    function getRandom() {
                        var dim = jcrop_api.getBounds();
                        return [
                            Math.round(0),
                            Math.round(dim[1]),
                            Math.round(dim[0]),
                            Math.round(0)
                        ];
                    };
                    jcrop_api.animateTo(getRandom());
                });
            }, 100);

        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);


}






