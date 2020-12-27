// function to 'ON' menu
function MenuBar(command){
    var menu=document.querySelector('.menubar-content');
    if(command==='open'){
        menu.style.display='flex';
        menu.style.animation='linedown .5s 1 forwards';
        menu.addEventListener('animationend', ()=>{
            document.querySelector('.menubar-options').style.animation='menu-fade-in .5s 1 forwards';
        })

    }else if(command==='close'){
        menu.style.display='none';
    }
}

// function exec(){
//     document.querySelector('.bar2').style.animation="linedown 1s 1 forwards";
// }


var checkMenu=true;
document.querySelector('.menubar-icon').onclick=()=>{
    if(checkMenu){
        MenuBar('open');
        checkMenu=false;
    }else{
        MenuBar('close');
        checkMenu=true;
    }

}