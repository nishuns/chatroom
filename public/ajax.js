function load_data(){
    const request=new XMLHttpRequest();
    request.open('GET', '/takedata');
    request.onload=()=>{
        const response=request.responseText;
        console.log(response);
    };
    request.send();
}

function send_data(){

    var verify="verified successfully";
    const request=new XMLHttpRequest();
    request.open('POST', '/verification', true);
    request.onload=()=>{
        console.log(request.responseText);
    }

    // request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    var data=new FormData();
    data.append('ver', verify);
    request.send(data);
    
}