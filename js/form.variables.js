var options_login_form = {
    success: function(data, statusText, xhr, $form)
    {
        $form.find('.invalid-feedback').hide().html('');
        var obj = ( typeof(data) != 'object' ) ? $.parseJSON(data) : data ;
        if( typeof(obj.errors) != "undefined" && obj.errors !== null )
        {   
            if( typeof(obj.errors.verifyCode) != "undefined" && obj.errors.verifyCode !== null )
            {
                $.getJSON( "/az/captcha?refresh=1", function( data ) {
        			$('#yw0').attr('src', data.url);
        			$('body').data('captcha.hash', [data.hash1, data.hash2]);
                });
            }
            
            $.each(obj.errors, function(i, val) {
                $form.find('#'+i+'-error.invalid-feedback').html(val).show();
            });
            
            if( obj.attemptsLogin > 3 )
                $('.captcha_row').removeClass('captcha_row hiden');
        }
        else
        {
            window.location.href = obj.redirect;
        }
    }
};

var options_apply_form = {
    beforeSend: function(){        
        KTApp.blockPage({
            overlayColor: '#000000',
            type: 'v2',
            state: 'primary'
        });
    },
    success: function(data, statusText, xhr, $form)
    {
        setTimeout(function() {
            KTApp.unblockPage();
            
            $form.find('.invalid-feedback').hide().html('');
            var obj = ( typeof(data) != 'object' ) ? $.parseJSON(data) : data ;
            if( typeof(obj.errors) != "undefined" && obj.errors !== null )
            {                   
                $.each(obj.errors, function(i, val) {
                    $form.find('#'+i+'-error.invalid-feedback').html(val).show();
                });
                
                grecaptcha.reset();
            }
            else
            {   
                if( typeof(obj.title) != "undefined" && obj.title !== null )
                {
                    Swal.fire({
                        type: 'success',
                        title: obj.title,
                        showConfirmButton: false,
                        timer: 5000,
                        onClose: () => {
                            location.reload();
                        }
                    });
                }
            }
            
        }, 1000);
    }
};