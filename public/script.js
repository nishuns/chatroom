window.onload=()=>{
    render();
}

function render(){
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{
        'size': 'invisible',
        'callback':function(response){
            console.log('callback');
        }
    });
    recaptchaVerifier.render();
}

function codeAuth(){
    var number=document.getElementById('mobilenumber').value;
    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier).then(function(confirmationResult){
        window.confirmationResult=confirmationResult;
        coderesult=confirmationResult;
        console.log(coderesult);
        alert('message sent');
    }).catch(function (error){
        console.log(error.message);
        alert(error.message);
    });
}

function codeVerify(){
    var code=document.getElementById('getotp').value;
    coderesult.confirm(code).then(function (result){
        console.log(result.user);
        alert('verified');
        load_data();
    }).catch(function (error){
        console.log(error.message);
        alert(error.message);
    });
}