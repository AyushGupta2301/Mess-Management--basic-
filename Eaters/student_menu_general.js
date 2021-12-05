function opentab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active"; 
  }
document.getElementById('defaultOpen').click();
function add_dish(){
    var base = document.createElement('span');
    base.innerHTML = document.getElementById('baserefer').innerHTML;
    base.className = "basespan";
    document.getElementById('datamain').append(base);
}

// function dish_submit(){
//     var dishes = document.getElementsByName('dishes');
//     var menupara = document.createElement('p');
//     menupara.innerHTML = "<h3>The menu for the next batch is :</h3>"
//     for(i=0;i<dishes.length;i++){
//         if(dishes[i].value==""){
//           console.log("Fields Shouldn't be empty");
//           return;
//         }
//         menupara.innerHTML += "--> " + dishes[i].value + "<br>";
//     }
//     document.getElementById('set_menu').append(menupara);
// }