console.log('in js');

var cookie;
var count = 0;
var gt,av,pt;
var wait = false;
var seq = 1;
var play = true;
var winterval;
var sinterval;

function addComma() { 


    gt.innerHTML = Number(gt.innerHTML).toLocaleString('en-US');
    av.innerHTML = Number(av.innerHTML).toLocaleString('en-US');
    pt.innerHTML = Number(pt.innerHTML).toLocaleString('en-US');
 

}

function addCookie(name,value,t){
    var exp = "";
    if(t){
        var date = new Date();
        date.setTime(date.getTime() + (t*24*60*60*1000));
        exp = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "")  + exp + "; path=/";
        console.log("added cookie");
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        console.log("found cookie");
      }
    }
    return "";
  }

function pollclick(){
    fetch('/clicks', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      gt.innerHTML = Number(data[0].gt).toLocaleString('en-US');
      av.innerHTML = Number(data[0].av).toLocaleString('en-US');
    })
    .catch(function(error) {
      console.log(error);
    });
    // addComma();
}

function sortByProperty(property){  
  return function(a,b){  
     if(a[property] < b[property])  
        return 1;  
     else if(a[property] > b[property])  
        return -1;  
 
     return 0;  
  }  
}

function addtoChart(data,max){
  var list = document.getElementById("clist");
  var p = document.createElement("p");
  p.setAttribute('id',data.name);
  p.textContent = data.name;
  list.appendChild(p);
  var div1 = document.createElement("div");
  div1.setAttribute('class','chart');
  var div2 = document.createElement('div');
  div2.setAttribute('class','C');
  div2.style.width = (data.val/max * 100) + '%';
  div2.textContent = data.val;
  div1.appendChild(div2);
  list.appendChild(div1);
  
}

function pollreg(){
  fetch('/reg', {method: 'GET'})
  .then(function(response) {
    if(response.ok) return response.json();
    throw new Error('Request failed.');
  })
  .then(function(data) {
    data.sort(sortByProperty("val"));
    var max = data[0].val;
    for(d in data){
          addtoChart(data[d],max);
    }
  })
  .catch(function(error) {
    console.log(error);
  });
}


function cupd(){
    console.log('button clicked');
    count = count + 1;
    addCookie("wtdmts2020",count.toString(),365)
    pt.innerHTML = Number(count).toLocaleString('en-US');
    fetch('/clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
}

function addUser(){
    fetch('/addUser', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('user added');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
}

function insertImg(src,parent,animation,width,height,message){
  wait = true;
  var img = document.createElement("img");
  img.setAttribute('class',animation)
  img.setAttribute('id','tempImg');
  img.width = width;
  img.height = height;
  img.src = src;
  img.addEventListener('click',cupd)
  var pt = document.getElementById(parent);
  var chat = document.getElementById("chat");
  chat.textContent = message;
  // var x = pt.offsetTop - pt.height;
  // var y = pt.offsetLeft + pt.width;
  // img.style.left = '' + x + 'px' ;
  // // img.style.top = '' + y + 'px' ;
  // img.offsetTop = x;
  // img.offsetLeft = y;
   document.getElementById(parent).appendChild(img);
  setTimeout(function(){
    document.getElementById("tempImg").remove();
    seq++;
    wait = false;
  },5000);
}

function story(){
  if(!wait){

    if(seq == 1){
      wait = true;
      setTimeout(function(){
        insertImg("./res/N3.png","rtxt","fade",100,150,"NAMASTE!");
    },2000);
     }

     if(seq == 2){
       wait = true;
      setTimeout(function(){
        insertImg("./res/T1.png","rtxt","fade",100,150,"Howdy Modi! Good to see ya''");
    },2000);
     }

    if(seq == 3){
      wait = true;
     setTimeout(function(){
       insertImg("./res/N4.png","rtxt","fade",100,150,"Who is this joker! Did you wash your hands?");
   },2000);
    }

    if(seq == 4){
      wait = true;
     setTimeout(function(){
       insertImg("./res/T2.png","rtxt","fade",100,150,"No, no, I never wash my hands");
   },2000);
    }

    if(seq == 5){
      wait = true;
     setTimeout(function(){
       insertImg("./res/N21.png","bparent","popup",150,250,"Irresponsible!");
   },2000);
    }

    if(seq == 6){
      wait = true;
     setTimeout(function(){
       insertImg("./res/T4.png","rtxt","fade",100,150,"Waaow! Thats scary.");
   },2000);
    }

    if(seq == 7){
      wait = false;
      var chat = document.getElementById("chat");
      chat.textContent = "Drama is over. Now Waste this Moment!";
    }
  }
}

function createsplash(){

}

function removedrop(){

  createsplash();
}

function movedrop(id){
  var drop = document.getElementById(id);
  if(id == 'tempw'){wtran = wtran+30;drop.style.transform = "translateY(-"+wtran+"px)";}
  else if(id =='temps'){stran = stran+30;drop.style.transform = "translateY(-"+stran+"px)";}
   //"translate(x,y)"
  console.log(drop.getBoundingClientRect().top);
  if(drop.getBoundingClientRect().top < 100) {
    id == 'tempw'? clearInterval(winterval):clearInterval(sinterval);
    removedrop();

  }
}

var wtran;
var stran;

function createwaterdrop(){
  var element = document.getElementById('water');
  var topPos = element.getBoundingClientRect().top + window.scrollY - 30;
  var leftPos = element.getBoundingClientRect().left + window.scrollX + element.width;

  var wdrop = document.createElement('img');
  wdrop.setAttribute('class','waterclass');
  wdrop.setAttribute('id','tempw');
  wdrop.style.left = leftPos +'px';
  wdrop.style.top = topPos +'px';
  wtran = 0;
  wdrop.width = 40;
  wdrop.height = 60;
  wdrop.src = "./res/wd.png";
  document.body.appendChild(wdrop);
  winterval = setInterval(movedrop,100,'tempw');
}

function createsoapdrop(){
  var element = document.getElementById('soap');
  var topPos = element.getBoundingClientRect().top + window.scrollY - 30;
  var leftPos = element.getBoundingClientRect().left + window.scrollX;

  var sdrop = document.createElement('img');
  sdrop.setAttribute('class','soapclass');
  sdrop.setAttribute('id','temps');
  sdrop.style.left = leftPos +'px';
  sdrop.style.top = topPos +'px';
  stran = 0;
  sdrop.width = 60;
  sdrop.height = 60;
  sdrop.src = "./res/sd.png";
  document.body.appendChild(sdrop);
  sinterval = setInterval(movedrop,100,'temps');
}

$(document).ready(function(){
  var waterd = document.getElementById("water");
  var soapd = document.getElementById("soap");
    waterd.addEventListener('click',cupd);
    soapd.addEventListener('click',cupd);
    waterd.addEventListener('click',createwaterdrop);
    soapd.addEventListener('click',createsoapdrop);
    gt = document.getElementById("gt");
    av = document.getElementById("av");
    pt = document.getElementById("pt");
    var listen = document.getElementById("listen");
    cookie = getCookie("wtdmts2020")
    if(cookie != ""){
       listen.textContent = "You have already listened to the leaders. Now Waste This Moment! Consume cookie to watch again"
        play = false;
        console.log("cookie:" + cookie);
        count = Number(cookie);        
    }
    else{
      listen.textContent = "Listen to the leaders:"
        console.log("calling to add cookie");
        addCookie("wtdmts2020","0",365);
        addUser();
        count = 0;
    }
    pt.innerHTML = count;
    setInterval(pollclick,500);
    //setInterval(pollreg,500);
    pollreg();
    if(play){
    setInterval(story,500);
    }
  });