
const $ = document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)
const audio = $('.audio-song')
const addSongone = $('.add-song')   

const scrollAudio = $('.input-audio')
const getTimeNow = $('.time__now')
const getTimeEnd = $('.time__end')
var index = 0;
var lengthList
var istestReplace = false
var listSong = document.querySelector('.list__song')
const backgroundAudio = document.querySelector('.audio-img')
let istest = false
let app = $('.app')
function getListSong(){
    ListSong(function(taget){
        const lists = taget.map(function(item){
            return `
            <li class="list__item">
                <img class="item-img" src="${item.background}" alt="">
                <div class="item-tilte">
                    <div class="song-title">
                        ${item.title}
                    </div>
                    <h4 class="describe">
                        ${item.description}
                    </h4>
                </div>
            </li>
            `
        })
        listSong.innerHTML = lists.join('')
        lengthList = taget.length;
        
    }) 
}

function ListSong(callback)
{
     const fetchApi = 'http://localhost:3000/song';
    fetch(fetchApi)
        .then(function(content){
            return content.json();
        })
        .then(callback)
}
function supportPlay(song,type=false) {
    const title = document.querySelector('.title') 
    if (title && backgroundAudio) {
        title.textContent = song.title;
        backgroundAudio.src= song.background
        audio.src = song.audio;      
        audio.autoplay = type;      
    }
}
// đỏ màu chi chọn bài cần phát
function itemList(index){
    let list = $$('.list__item')
    list.forEach(function(item){
        if (item.classList.contains('opacity')) {
            item.classList.remove('opacity')
        }
    })
    list[index].classList.add('opacity')
}
function playSong(index=0,type)
{  
    ListSong(function(song) {
        supportPlay(song[index],type)
        itemList(index)        
    })
}

// code bật tắt 
function play(){
    
    let test = false;
    const playPause = $('.play-pause')
    const play = $('.play')
    const pause = $('.pause')
    playPause.onclick = function(){
        if(!test)
        {
            test = true
            audio.play();
            play.classList.remove('add')
            pause.classList.add('add')
        }
        else {
            audio.pause();
            play.classList.add('add')
            pause.classList.remove('add')
            test= false
        }
    }
}
function spPlay()
{
    const pause = $('.pause')
    const play = $('.play')
    audio.onplaying = function() {
        play.classList.remove('add')
        pause.classList.add('add')
    }
}
// code xoay đĩa
function turn(){
    let arrayImg = [
        {transform: 'rotate(0)'},
        {transform: 'rotate(360deg)'}
    ]; 
    let objectImg = {
        duration: 10000,
        iterations: Infinity
    }
    let CD =backgroundAudio.animate(arrayImg,objectImg)
    CD.pause()
    return CD
}
// code chạy thời gian
function scroll(){
    
    
    audio.ontimeupdate = function(){
        let timeNow = audio.currentTime;
        let timeEnd = audio.duration;      
        let heightPercent
        let seconds
        let minutes
        if (timeEnd) {
            heightPercent = Math.floor((timeNow*100)/timeEnd*10000)/10000
            scrollAudio.value = heightPercent
            minutes = Math.floor(timeNow/60)
            seconds = Math.floor(timeNow%60)
            getTimeNow.innerHTML = `${minutes}:${seconds}`
            getTimeEnd.textContent = `${Math.floor(timeEnd/60)}:${Math.floor(timeEnd%60)}`
        }
        if (timeNow === timeEnd) {
            
            autonext()
        }
        
    }
}



function rotate(){
    let CD = turn()
    audio.onplay = function(){
        CD.play()
        // console.log()
    }
    audio.onpause = function(){
        CD.pause()
    }
}
function tua()
{  
    scrollAudio.onchange = function(){
        let timeEnd = audio.duration
        let getTime = Math.floor(timeEnd*scrollAudio.value/100)
        audio.currentTime = getTime;
        
    }   
}
let nextSong = $('.next');
function next(){
    
    nextSong.onclick = function(){        
        if (!istest) {
            
                if (lengthList -1 === index) {
                    index = 0;
                }
                else index++
            
        }
        else index = playRandom()
        playSong(index,true)
    }
}

function back(){
    let backSong = $('.back');
    backSong.onclick = function(){
       
        if (!istest) {
            
            if (0 === index) {
                index = lengthList-1;
            }
            else index--
                
            
        }
        else index = playRandom()
        playSong(index,true)
    }
}
function autonext () {
    if (!istestReplace) {
        if (!istest) {
        
            if (lengthList-1 === index) {
                index = 0;
            }
            else {
                    
                index++;
                
            }               
        }
        else index = playRandom()
        playSong(index,true)
    }
    else {
        playSong(index,true)
    }
    
}
function clickList(){
    setTimeout(function() {
        let list = $$('.list__item')
        list.forEach(function(item,indexchild){
        item.onclick = function(){
        index = indexchild
        playSong(indexchild,true);
        }
    })
    },400)
}
function favourite(){
    let favourite = $('.favourise')
    favourite.onclick = function(){
        favourite.classList.toggle('favourised')
    }
} 
function playRandom(){
    let random
    do{
        random = Math.floor(Math.random()*lengthList);
        if (!random) {
            random = lengthList-index-1;
            // console.log(random,lengthList,index);
        }
    }while(random === index)
    // console.log(random,lengthList,index);
    let tunOnRandom=$('.play-random');    
    tunOnRandom.onclick= function(){
        istest = !istest
        tunOnRandom.classList.toggle('favourised')
    }
    return random
}
// thiếu chức năng tắt random khi bat rêpact
function replace(){
    
    let replace =$('.repeat')
    replace.onclick= function(){
        istestReplace=!istestReplace
        replace.classList.toggle('favourised')
    }
    
}
function add(){
    let add =$('.plus')
    let isTestAdd =false
    add.onclick= function(){
        
        if (!isTestAdd) {
           app.style.display = 'none' 
            addSongone.style.display = 'block'
        }
    }
}
function start() {
    getListSong(); 
    playSong(); 
    play()
    spPlay()
    scroll()
    rotate()
    tua()
    next()
    back()
    favourite()
    playRandom()
    replace()
    add()
    clickList()
}

start();



// thêm bài hát

function error(message) {
    message.style.borderColor = 'red'
}
function success(message) {
    message.style.borderColor = 'green'
}
function testBlur () {
    let input = $$('.input-name')
    input.forEach(function(item){
        item.onblur = function(){
            item.value.trim() ? success(item) :error(item) ;
        }
        
    })
}
function blur(item){
    
}
function inputSong(){
    let song = $('.input-name-song')
    return song.value
}
function inputBackground(){
    let background = $('.input-background')
    return background.value
}
function inputDescription(){
    let description =$('.input-description')
    return description.value
}
function inputLink(){
    let link = $('.input-link')
    return link.value
}

function push(callback){
    let object= {
        title:inputSong(),
        description:inputDescription(),
        audio:inputLink(),
        background:inputBackground(),
    }
    
    fetch('http://localhost:3000/song',{
        method: 'POST',
        // mode:'cors',
        // cache:'no-cache',
        // credentials:'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // redirect:'follow',
        // referrerPolicy:'no-referrer',
        body:JSON.stringify(object)
    })
        .then(function(response) {
            return response.json();
        })
        .then(callback)
}
function supporSub(item){
    // listSong.innerHTML
    let div = document.createElement('div');
    div.innerHTML= `
    <li class="list__item">
        <img class="item-img" src="${item.background}" alt="">
        <div class="item-tilte">
            <div class="song-title">
                ${item.title}
            </div>
            <h4 class="describe">
                ${item.description}
            </h4>
        </div>
    </li>
    `
    listSong.appendChild(div) 
}
function sub(){
    let add =$('.plus')
    let submited = $('.submit')
    submited.onclick = function(){
        lengthList++;
        clickList()
        app.style.display = 'block' 
        addSongone.style.display = 'none'
        push(function (item){
            console.log(item)
            supporSub(item)
        });
    }
}
function addSong() {
    testBlur()
    inputSong()
    // push()
    inputBackground()
    inputDescription()
    inputLink()
    sub()
    
}
addSong()