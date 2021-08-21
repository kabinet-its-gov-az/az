$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
    KTApp.unblockPage()

    if( jqxhr.responseText != '' && jqxhr.responseText != null )
        alert(jqxhr.responseText);
});

$( document ).ajaxSuccess(function( event, jqxhr, settings ) {
    if( jqxhr.responseText.indexOf('goToLogin') != -1 )
    {
        var obj = ( typeof(jqxhr.responseText) != 'object' ) ? $.parseJSON(jqxhr.responseText) : data ;
        
        location.href = obj.goToLogin;
    }
});

$.extend({
    userInfoRefresher: function( href, loader, isClicked ){
        
        isClicked = isClicked || false;
        
        var show = true;
        
        if( typeof sessionStorage.isAddedInfo != 'undefined' && sessionStorage.isAddedInfo == '1' )
            show = false;
            
        if( isClicked )
            show = true;

        if( show )
        {
            $.ajax({
                type: 'POST',
                url: href,
                data: 'ajax=click',
                cache: false,
                processData: false,        
                beforeSend: function(){
                    KTApp.blockPage({
                        overlayColor: "#000000",
                        type: "v2",
                        state: "primary",
                        message: loader
                    });
                },
                success: function(data){
                    setTimeout(function() {
                        //KTApp.unblock();
                        if( data == '1' )
                        {
                            sessionStorage.setItem('isAddedInfo',1);
                            location.reload();
                        }
                        else
                            KTApp.unblock();
        
                    }, 1000);    
                }
            });
        }
    },
    fileManagerResize: function(){
        var _w = window.innerWidth;
        var addClass = '';
        
        if( _w > 600 && _w < 993)
            addClass = 'm6';
            
        if( _w > 992 && _w < 1249)
            addClass = 'm4';
        
        if( _w > 1249 && _w < 1752 )
            addClass = 'm3';
        
        if( _w > 1751 )
            addClass = 'm2';
        
        if( $('.FileArea').length > 0 )
        {
            $('.FileArea .file-item').each(function(){
                $(this).removeClass('m6 m3 m4 m2').addClass(addClass);
                
            });
        }
    },
    MCustomLoader: function(show)
    {
        if( show )
            $("#containerLoader").show();
        else
            $("#containerLoader").delay(1000).fadeOut();   
    },
    passwordGenerator: function (length) 
    {
        var password = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$#*%{]";
        
        for( var i=0; i < length; i++ )
            password += possible.charAt(Math.floor(Math.random() * possible.length));
            
        return password;
    
    },
    MStringToVariable: function (string) {
        if( string != '' )
            return eval(string);
        else
            return false;
    },
    ajaxResetPlugins: function (){
        

    }
});

$( document ).ready(function() {    
    
    $(document).on('submit', 'form[data-form="ajax"]', function(e) {
        var _this = $(this);
        var id = 'options_' + _this.attr('id').replace(/-/g,"_");
        var options = $.MStringToVariable( id.toLowerCase() );
    
        var myStaticOptions = {
            beforeSubmit: function(arr, $form, options) {
                if( id.toLowerCase() != 'options_login_form' )
                    arr.push({ name: 'ajax', value: 'submit' });
            },
            beforeSend: function(){
                $.MCustomLoader(true); 
            }
        };
        
        var newObj = $.extend({}, myStaticOptions, options);
        
        $(this).ajaxSubmit( newObj );
       
       return false;  
    });
    
    $(document).on('click', 'table.myapplies tbody tr[data-href]', function(e) {
       var _this = $(this);
       var _header = _this.find('td[data-col-name="col4"]').html();
       
        $.ajax({
            type: 'POST',
            url: _this.data('href'),
            data: 'ajax=click',
            cache: false,
            processData: false,        
            beforeSend: function(){
                KTApp.blockPage({
                    overlayColor: "#000000",
                    type: "v2",
                    state: "primary",
                    message: $('body').data('loader')
                });
                
                $( '#apply_modal_one' ).remove();
            },
            success: function(data){
                setTimeout(function() {
                    KTApp.unblockPage();
                    
                    if( data != '' )
                    {
                        $( '#kt_content' ).append( data );
                        $( '#apply_modal_one' ).modal('show');
                        $( '#apply_modal_one' ).find('.kt-portlet__head-title').html( _header );
                    }
                    
                }, 1000);    
            }
        });
       return false; 
    });
    
    $(document).on('click', '.indexChartFilter', function(e) {
        var _this = $(this);
        var _text = _this.text().trim();
        var chart = AmCharts.charts[0];
        
        _this.closest('.kt-portlet__head-toolbar').find('.dropdown-toggle').html( _text );
        
        AmCharts.loadFile(_this.data('load'), {}, function(data) {
            
            chart.dataProvider = AmCharts.parseJSON(data);
            chart.validateData();
        });
    });
    
    $(document).on('click', '.getDoctorInfo', function(e) {
        var _this = $( this );
    
        $.ajax({
            type: 'POST',
            url: _this.attr('href'),
            data: 'ajax=click',
            cache: false,
            processData: false,        
            beforeSend: function(){
                KTApp.blockPage({
                    overlayColor: "#000000",
                    type: "v2",
                    state: "primary",
                    message: $('body').data('loader')
                });
                
                $( '#doctor_info_modal_one' ).remove();
            },
            success: function(data){
                setTimeout(function() {
                    KTApp.unblockPage();
                    
                    if( data != '' )
                    {
                        $( '#kt_content' ).append( data );
                        $( '#doctor_info_modal_one' ).modal('show');
                    }
                    
                }, 1000);    
            }
        });    
    
        return false;
    });
    
    $(document).on('click', '.lobaratoryLink', function(e) {
        var _this = $( this );
    
        $.ajax({
            type: 'POST',
            url: _this.attr('href'),
            data: 'ajax=click',
            cache: false,
            processData: false,        
            beforeSend: function(){
                KTApp.blockPage({
                    overlayColor: "#000000",
                    type: "v2",
                    state: "primary",
                    message: $('body').data('loader')
                });
                //$('td .dropdown').dropdown('hide');
                $( '#lobaratory_modal_one' ).remove();
            },
            success: function(data){
                setTimeout(function() {
                    KTApp.unblockPage();
                    
                    if( data != '' )
                    {
                        $( '#kt_content' ).append( data );
                        $( '#lobaratory_modal_one' ).modal('show');
                    }
                    
                }, 1000);    
            }
        }); 
        
        return false;
    });
    
    $(document).on('click', '.readFile', function(e) {
        var _this = $( this );
        
        _this.next('form').trigger('submit');
        
        return false;
    });
    
    $(document).on('click', '.pager-link-custom', function(e) {
        var _this = $(this);
        if( _this.hasClass('kt-datatable__pager-link--disabled') )
            return false;
        
        $.ajax({
            type: 'POST',
            url: _this.attr('href'),
            data: 'ajax=click',
            cache: false,
            processData: false,        
            beforeSend: function(){
                KTApp.block('.myappliesData', {
                    overlayColor: '#000000',
                    type: 'v2',
                    state: 'primary',
                    message: $('body').data('loader')
                });
            },
            success: function(data){
                setTimeout(function() {
                    //KTApp.unblock();
                    KTApp.unblock('.myappliesData');
                    
                    $( '.myappliesData' ).html( data );
                    $('.myappliesData .dropdown button').dropdown();
                    
                }, 1000);    
            }
        });
    
        return false;
    });
    
    $(document).on('click', 'a[data-alert]', function(e) {
        var _this = $( this );
        var _alert = _this.data('alert').trim();
        
        if( _alert.length > 0 )
        {
            Swal.fire({
                type: 'warning',
                title: _alert,
                showConfirmButton: false,
                timer: 7000
            });
        }
        
        return false;
    });
    
    $(document).on('click', 'a.userInfoRefresh', function(e) {
        var _this = $(this);
        var _href = _this.attr('href');
        
        if( _href != '' )
            $.userInfoRefresher( _href, _this.data('loader'), true );
        
        return false;
    });
});