import "../assets/styles.scss";
import axios from "axios";
//import _get lodash
const get = require('lodash.get');



//on page loading show the spinner
document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector(
        "body").style.visibility = "hidden";
        document.getElementById(
        "loader").style.visibility = "visible";
    } else {
        document.getElementById(
        "loader").style.display = "none";
        document.querySelector(
        "body").style.visibility = "visible";
    }
};



//declaring variables
const newsStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
const idsUrl = 'https://hacker-news.firebaseio.com/v0/item/';

let idsArr = [];
let startArr= 0;
let endArr = 10;

const div = document.getElementById("addNews");

//function to fetch news array and ids

async function getIdsNews (){
try{
    let res= await axios.get(newsStoriesUrl);

let arr= res.data; 
console.log(arr);
for (let i = startArr; i < endArr && i< arr.length; i++) {
    // get the size of the inner array
     idsArr = arr[i];
     getNews()
     console.log(idsArr);
}
if (endArr> arr.length){
    startArr= 0;
    endArr= 10;
} else{
    startArr = endArr;
    endArr += 10 ;
}
 



}
catch{(err)=>{console.log(err)};}


}
//function to get specific properties and post them in cards

async function getNews (){
try{let url = `${idsUrl + idsArr + '.json'}`
axios.get(url)
.then((res)=> {
    let title= get(res, 'data.title');
    let date = get(res, 'data.time');
    let link = get(res, 'data.url');
   if (link == undefined){
    document.getElementById("linkTo").addEventListener('click', function(event)
    {event.preventDefault()})
   }

    console.log(title,date,link)
    
   //convert string to a date object
    const fullDate = new Date(date * 1000);
    const finalDate=  fullDate.toLocaleDateString('en-GB');
    console.log(finalDate);

    
    div.innerHTML += `<div class="card mx-3 my-2" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
     <p class="card-text">
     <a href="${link}" target="_blank" id="linkTo" class="btn btn-primary ">Learn more</a> </p>

    </div>
    <div class="card-footer "> Last updated: ${finalDate} </div>
 </div> `

    


})
 } 
 catch{(err)=>{console.log(err)};}
}


getIdsNews();


 



//load more news (button)
const btn = document.getElementById("showMoreBtn");
window.onscroll= function (){loadMore(), scrollFunction()};
function loadMore () {

if (document.body.scrollTop > 100 || 
    document.documentElement.scrollTop > 100) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }


}
btn.onclick = function (){getIdsNews(), spinnerOnload() };

//add load more button's spinner
let spinner= document.getElementById("spinner");

 function spinnerOnload (){
  spinner.classList.remove("hidden");
  setTimeout(()=> {spinner.classList.add("hidden");}, 2000);
}




//to the top button to help with page srolling 
// Get the button:
let topButton = document.getElementById("topBtn");

// When the user scrolls down 100px from the top of the document, show the button


function scrollFunction() {
  if (document.body.scrollTop > 100 || 
    document.documentElement.scrollTop > 100) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
topButton.onclick = function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
  
