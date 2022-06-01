/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function () {
    const __url = $('#base_url').val();
    const token = localStorage.getItem("token");
    const userToken = localStorage.getItem("userToken");

    $('.loginBtn').click(function () {
        $('.modal').modal('hide');
        $('#loginModal').modal('show');
    });
    $('.registerBtn').click(function () {
        $('.modal').modal('hide');
        $('#registerModal').modal('show');
    });


    // *****************
    // Login
    // *****************

    let otpTiming = 60;
    let tempToken;
    let interval;

    $("#loginForm").validate({
        rules: {
            email_mobile: "required",
            password: "required",
        },
        messages: {
            email_mobile: "Please enter Mobile Number or Email id",
            password: "Please enter Password",
        },

        submitHandler: function (form) {
            let post_data = {
                email_mobile: $('#loginForm [name=email_mobile]').val(),
                password: $('#loginForm [name=password]').val(),
            }
            $("#signInBtn").attr('disabled', true);
            $.ajax({
                url: `${base_url}/user/auth/login.php`,
                type: 'POST',
                dataType: 'JSON',
                data: JSON.stringify(post_data),
                success: function (result) {
                    $("#signInBtn").removeAttr('disabled');
                    toastr.success("Sign in successfully");
                    localStorage.setItem("userToken", result.token);
                    $('.loginBtn span').text(username);
                    $('.modal').modal('hide');
                    // window.location.replace('user/dashboard');
                },
                error: function (error) {
                    $("#signInBtn").removeAttr('disabled');
                    toastr.error(error.responseJSON.message);
                }
            });
        }
    });

    $("#user-signin-with-otp-btn").click(function () {
        sendOTPForLogin();
    });

    function sendOTPForLogin() {
        $('#otp-mobile').text($('[name=email_mobile]').val());
        $('#loginStepTwo input[name=otp]').val("")
        let post_data = {
            mobile_no: $("#loginForm [name=email_mobile]").val(),
        }
        if (!!post_data.mobile_no) {
            $("#user-signin-with-otp-btn").attr('disabled', true);
            $.ajax({
                url: base_url + '/user/auth/login-with-otp.php',
                type: 'POST',
                dataType: 'JSON',
                data: JSON.stringify(post_data),
                success: function (result) {
                    $("#user-signin-with-otp-btn").removeAttr('disabled');
                    $("#loginStepTwo").show();
                    $("#loginForm").hide();
                    toastr.success(result.message);
                    tempToken = result.token;
                    signInResendSetInterval();
                },
                error: function (error) {
                    $("#user-signin-with-otp-btn").removeAttr('disabled');
                    toastr.error(error.responseJSON.message);
                }
            });
        } else {
            toastr.error("Please enter Mobile Number");
        }
    }

    function signInResendSetInterval() {
        $('.user-login-resend-btn').hide();
        $('.resend-seconds').show();
        $("#user-signin-with-otp-btn").hide();
        $("#timer-btn").show();
        let resend_seconds = otpTiming;
        $('.resend-seconds span').text(resend_seconds);
        $('#timer-btn span').text(resend_seconds);
        interval = setInterval(function () {
            resend_seconds--;
            if (resend_seconds > 1) {
                $('.resend-seconds span').text(resend_seconds);
                $('#timer-btn span').text(resend_seconds);
            } else {
                $('.resend-seconds').hide();
                $('.user-login-resend-btn').show();
                $("#user-signin-with-otp-btn").show();
                $("#timer-btn").hide();
                clearInterval(interval);
                return;
            }
        }, 1000);
    }

    $('.user-login-resend-btn').click(function () {
        sendOTPForLogin();
    });

    $("#loginStepTwo .user-go-back-btn").click(function () {
        $("#loginStepTwo").hide();
        $("#loginForm").show();
        $("#user-signin-with-otp-btn").show();
    });

    $("#loginStepTwo").validate({
        rules: {
            otp: {
                required: true,
                number: true,
                minlength: 4
            }
        },
        messages: {
            otp: {
                required: "Please enter OTP",
                number: "Please enter a valid OTP",
                minlength: "Please enter 4 digit OTP"
            }
        },
        submitHandler: function (form) {
            let post_data = {
                otp: $('#loginStepTwo input[name=otp]').val(),
                token: tempToken
            }
            $("#verifyOTP").attr('disabled', true);
            $.ajax({
                url: base_url + 'user/auth/verify-otp.php',
                type: 'POST',
                dataType: 'JSON',
                data: JSON.stringify(post_data),
                success: function (result) {
                    clearInterval(interval);
                    toastr.success('OTP successfully verified');
                    $("#verifyOTP").removeAttr('disabled');
                    localStorage.setItem("userToken", result.token);
                    localStorage.setItem("username", result.name);
                    $('.modal').modal('hide');
                    $('.dropdown-before-login').hide();
                    $('.dropdown-after-login').show();
                    username = localStorage.getItem("username");
                    $('.username span').text(username);
                    common.cartCount();
                    // window.location.replace('user/dashboard');
                },
                error: function (error) {
                    $("#verifyOTP").removeAttr('disabled');
                    toastr.error(error.responseJSON.message);
                }
            });
        }
    });

    // *****************
    // registerStepOne
    // *****************

    $("#registerStepOne").validate({
        rules: {
            name: "required",
            mobile_no: "required",
            email_id: "required",
            gender: "required",
        },
        messages: {
            name: "Please enter Full Name",
            mobile_no: "Please enter Mobile Number",
            email_id: "Please enter Email Id",
            gender: "Please select Gender",
        },

        submitHandler: function (form) {
            let post_data = {
                name: $('#registerStepOne [name=name]').val(),
                mobile_no: $('#registerStepOne [name=mobile_no]').val(),
                email_id: $('#registerStepOne [name=email_id]').val(),
                gender: $('#registerStepOne [name=gender]').val(),
            }
            $("#registerBtn").attr('disabled', true);
            $.ajax({
                url: `${base_url}user/auth/signup.php`,
                type: 'POST',
                dataType: 'JSON',
                data: JSON.stringify(post_data),
                success: function (result) {

                    $("#registerStepOne #registerBtn").removeAttr('disabled')
                    $('#registerStepOne').hide();
                    $('#registerStepTwo').show();
                    tempToken = result.token;
                    resendSetInterval();
                },
                error: function (error) {
                    $("#registerBtn").removeAttr('disabled');
                    toastr.error(error.responseJSON.message);
                }
            });
        }
    });

    // *****************
    // registerStepTwo
    // *****************
    function resendSetInterval() {
        $('.user-register-resend-btn').hide();
        $('.register-resend-seconds').show();
        $("#registerBtn").hide();
        $("#timer-btn").show();
        let resend_seconds = otpTiming;
        $('.register-resend-seconds span').text(resend_seconds);
        $('#timer-btn span').text(resend_seconds);
        let interval = setInterval(function () {
            resend_seconds--;
            if (resend_seconds > 1) {
                $('.register-resend-seconds span').text(resend_seconds);
                $('#timer-btn span').text(resend_seconds);
            } else {
                $('.register-resend-seconds').hide();
                $('.user-register-resend-btn').show();
                $("#registerBtn").show();
                $("#timer-btn").hide();
                clearInterval(interval);
                return;
            }
        }, 1000);
    }

    $('.user-register-resend-btn').click(function () {
        let post_data = {
            token: tempToken
        }
        $.ajax({
            url: base_url + 'user/auth/resend-otp.php',
            type: 'POST',
            dataType: 'JSON',
            data: JSON.stringify(post_data),
            success: function () {
                resendSetInterval();
            }
        });
    });

    $("#registerStepTwo").validate({
        rules: {
            otp: {
                required: true,
                number: true,
                minlength: 4
            }
        },
        messages: {
            otp: {
                required: "Please enter OTP",
                number: "Please enter a valid OTP",
                minlength: "Please enter 4 digit OTP"
            }
        },
        submitHandler: function (form) {
            let post_data = {
                otp: $('#registerStepTwo input[name=otp]').val(),
                token: tempToken
            }
            $("#verifyOTP").attr('disabled', true);
            $.ajax({
                url: base_url + 'user/auth/verify-otp.php',
                type: 'POST',
                dataType: 'JSON',
                data: JSON.stringify(post_data),
                success: function (res) {
                    // $('#registerStepTwo').hide();                            
                    toastr.success('You have successfully Registered');
                    localStorage.setItem("userToken", res.token);
                    localStorage.setItem("username", res.name);
                    $('#registerModal').modal('hide');
                    $("#verifyOTP").removeAttr('disabled');
                    username = localStorage.getItem("username");
                    $('.username span').text(username);
                    window.location.replace(__url + 'user/profile');


                },
                error: function (error) {
                    $("#verifyOTP").removeAttr('disabled');
                    toastr.error(error.responseJSON.message);
                }
            });
        }
    });

    $("#registerStepTwo .user-go-back-btn").click(function () {
        $('#registerStepTwo').hide();
        $('#registerStepOne').show();
        $('#registerBtn').show();
    })

    // *****************
    // advancedAutoComplete
    // *****************

    $('.advancedAutoComplete').autoComplete({
        minLength: 1,
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.name,
                text: item.name,
                html: [
                    `${item.name} ${item.genderType ? '[' + item.genderType + ']' : '' }<br/><span>${item.category}</span>`,
                ]
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax(
                        `${base_url}user/search/get-search-list.php`, {
                            data: {
                                'q': qry
                            }
                        }
                ).done(function (res) {
                    let responseData = [];
                    categoryObj = {
                        "services": "Services",
                        "makeup_artist": "Makeup Artist",
                        "salon": "Salon",
                    }
                    for (let key in res.result) {
                        res.result[key].forEach(val => {
                            let obj = {
                                id: val.id,
                                category: categoryObj[key],
                                genderType: val.category,
                                name: val.name
                            }
                            responseData.push(obj);
                        })
                    }
                    callback(responseData)
                });
            }
        }
    });

    $('.advancedAutoComplete').on('autocomplete.select', function (evt, item) {
        // debugger;
        // console.log(item);
        if (item.category == 'Services') {
            window.location.replace(`${__url}service-list/${item.id}`);
        } else if (item.category == 'Salon') {
            window.location.replace(`${__url}salon-details/${item.id}`);
        } else if (item.category == 'Makeup Artist') {
            window.location.replace(`${__url}makeup-artist/${item.id}`);
            console.log(item);
        }
    });

    $('.advancedAutoComplete').on('autocomplete.freevalue', function (evt, value) {
        window.location.replace(`${__url}service-list/n/${value}`);
    });

    // *****************
    // getAllServices
    // *****************
    var getAllServices = function () {
        $(".loading-wrapper").show();
        var selectedServices = [];
        var intoSlug = function (str) {
            return str.toLowerCase().split(' ').join('-').replace('&', '');
        }
        const url = `${base_url}user/services/get-services.php`;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            success: function (result) {
                // console.log(result)

                for (let key in result) {
                    if (key == 'ladies') {
                        $("#salonServices").append(`
                                  <div class="">
                                <div id="${key + '-card-body-wrapper'}">
                                    <div class="row"></div>
                                </div>
                                  </div>`);
                        for (let category in result[key]) {
                            $(`#salonServices #${key}-card-body-wrapper .row`).append(
                                    `<div class="col-lg mb-4">
                                    <div class="menu-common-list">
                                        <div class="nav-submenu-title" data="${category}">${category}</div>
                                        <ul class="checkbox-wrapper ${intoSlug(category)}"></ul>
                                        </div>
                                    </div>
                                    `
                                    );
                            result[key][category].forEach(val => {
                                var x = `#salonServices #${key}-card-body-wrapper .${intoSlug(category)}`;
                                $(x).append(`
                                      <li><a href="${__url}service-list/${val.id}/1">${val.name}</a></li>
                                    `);
                            })
                        }
                        $(".loading-wrapper").hide();
                        $("#salonServices").fadeIn(1000);
                    }

                    if (key == 'gents') {
                        $("#gentsServices").append(`
                                  <div class="">
                                <div id="${key + '-card-body-wrapper'}">
                                    <div class="row"></div>
                                </div>
                                  </div>`);
                        for (let category in result[key]) {
                            $(`#gentsServices #${key}-card-body-wrapper .row`).append(
                                    `<div class="col-lg mb-4">
                                    <div class="menu-common-list">
                                        <div class="nav-submenu-title" data="${category}">${category}</div>
                                        <ul class="checkbox-wrapper ${intoSlug(category)}"></ul>
                                        </div>
                                    </div>
                                    `
                                    );
                            result[key][category].forEach(val => {
                                var x = `#gentsServices #${key}-card-body-wrapper .${intoSlug(category)}`;
                                $(x).append(`
                                      <li><a href="${__url}service-list/${val.id}">${val.name}</a></li>
                                    `);
                            })
                        }
                        $(".loading-wrapper").hide();
                        $("#gentsServices").fadeIn(1000);
                    }

                }


                $(".services-page .button-wrapper button").fadeIn(1000);

            }
        });
    }
    getAllServices();

    //if user already logged in 
    if (userToken) {
        $('.dropdown-before-login').hide();
        $('.dropdown-after-login').show();
        username = localStorage.getItem("username");
        $('.username span').text(username);
        common.cartCount();
    }

    if (token) {
        $.ajax({
            url: base_url + 'get-info?token= ' + token + ' &q=info,services,amenities,timings',
            type: 'GET',
            dataType: 'JSON',
            success: function (result) {
                // $('#login_email').text(result.result.info.email_id.slice(0, 7) + '..');
                var loginEmail = `<div class="custom-dropdown-btn">
                                        <a class="sign-up">
                                        <i class="far fa-user-circle float-left mr-2"></i> <span> ${result.result.info.email_id.slice(0, 7) + '..'} </span>
                                    </a>
                                </div>`
                $('#loginBtn').prepend(loginEmail);
            },
            error: function () {
                var loginEmail = `<div class="custom-dropdown-common-btn">
                    <a href="login">
                    <i class="far fa-user-circle float-left mr-2"></i> <span>Sign In</span>
                    </a>
                    </div>
                    `
                $('#loginBtn').prepend(loginEmail);
            }
        });
    }
});

function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    $('.dropdown-after-login').hide();
    $('.dropdown-before-login').show();
    toastr.success('You have successfully Logout');
    $('.cart-count-circle').text(0);
    location.href = __url+'home';
}


var common = new function () {
    this.__url = $('#base_url').val();

    this.cartCount = function () {
        $.ajax({
            url: `${base_url}user/cart/get-cart-count.php`,
            type: 'GET',
            dataType: 'JSON',
            data: {
                token: localStorage.getItem("userToken")
            },
            success: function (result) {
                $('.cart-count-circle').text(result.count);
            }
        });
    };

    this.cartRedirect = function () {
        if (localStorage.getItem("userToken")) {
            location.href = common.__url + 'cart';
        } else {
            $('.modal').modal('hide');
            $('#loginModal').modal('show');
        }
    };
}; 