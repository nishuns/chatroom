var socket=io();

document.getElementById('remove').onclick=()=>{
    removeMessage();
}

function removeMessage(){
    const request=new XMLHttpRequest();
    request.open('GET', '/pop');
    request.onload=()=>{
        console.log(request.responseText);
        location.reload();
    }
    request.send();
}


function sendIt(){
    var msg=document.getElementById('task');
    socket.emit('chat message', msg.value);
    msg.value='';
    return false;
}

socket.on('chat message', function(msg){
        let task=document.createElement('li');
        task.innerHTML=msg;
        document.getElementById('list').append(task);
});