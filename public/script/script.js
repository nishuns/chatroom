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

function getMessage(tune, message){
    let task=document.createElement('li');
    task.className=tune;
    task.innerHTML=message;
    document.getElementById('list').append(task);
}

function sendIt(){
    var msg=document.getElementById('task');
    getMessage('outgoing', msg.value);
    console.log('Nishu: '+msg.value);
    socket.emit('chat message', msg.value);
    msg.value='';
    return false;
}

socket.on('chat message', function(msg){
        getMessage('incomming', msg);
        console.log('child: '+msg);
});