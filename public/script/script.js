var socket=io();
window.personName=null;
$(document).ready(function(){
    personName=prompt('Enter your name to start?');
    var request=new XMLHttpRequest();
    request.open('GET', '/todo');
    request.onload=()=>{
        let data=JSON.parse(request.responseText);
        for(let content of data){
            if(content.name==personName){
                getMessage('incomming', content);
            }else{
                getMessage('outgoing', content);
            }
        }
    }
    request.send();
});


document.getElementById('remove').onclick=()=>{
    removeMessage();
}

document.getElementById('task').onkeydown = (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-message').click();
    } 
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

function getMessage(tune, content){
    let message=document.createElement('li');
    message.className=tune;
    // Name of sender
    var OwnerName=document.createElement('span');
    console.log(content.name);
    OwnerName.innerHTML=content.name;
    OwnerName.className='badge badge-primary';
    OwnerName.style.fontSize='.8rem';
    message.append(OwnerName);
    // Message
    var text=document.createElement('p');
    text.innerHTML=content.message;
    text.className='text-secondary';
    message.append(text);
    // text appear
    document.getElementById('list').append(message);
}

function sendIt(){
    var msg=document.getElementById('task');
    if(msg.value.length>1){
        var data={
            message: msg.value,
            name: personName,
            id: 'Mickey123'
        }
        socket.emit('broadcast-sender', data);
        msg.value='';
    }else{
        alert('message is empty');
    }
    window.scrollTo(0,document.body.scrollHeight);
    return false;
}

socket.on('broadcast-reciever', function(chats){
    for( let message of chats.chat.reverse()){
        console.log(message);
        if(message.name==personName){
            getMessage('incomming', message);
        }else{
            getMessage('outgoing', message);
        }
        window.scrollTo(0,document.body.scrollHeight);
        break;
    }
});