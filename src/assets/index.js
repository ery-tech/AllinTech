import "../assets/styles.scss";
import axios from "axios";
//import _get lodash
const get = require("lodash.get");

//on page loading show the spinner
document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.querySelector("body").style.visibility = "hidden";
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.display = "none";
    document.querySelector("body").style.visibility = "visible";
    //if DOM is complete call the main function and loadElements function
    fetchUrl();
    loadElements();
  }
};

//function for Typewriter effect

const elementEl = document.getElementById("typeText");

const typewriter = new Typewriter(elementEl, {
  loop: true,
});
typewriter
  .typeString("Latest News")
  .pauseFor(2500)
  .deleteAll()
  .typeString("Get access to the latest news about technology,")
  .pauseFor(2500)
  .deleteChars(11)
  .typeString(" games,")
  .pauseFor(2500)
  .deleteChars(6)
  .typeString(" blogs,")
  .pauseFor(2500)
  .deleteChars(6)
  .typeString(" cloud computing.")
  .pauseFor(2500)
  .deleteAll()
  .start();

//declaring environment variables
const newsStoriesUrl = process.env.NEWS_STORIES;
const idsUrl = process.env.IDS_KEY;

//function to fetch ids array

async function fetchUrl() {
  try {
    let res = await axios.get(newsStoriesUrl);

    let arr = res.data;
    console.log(arr);
    getIds(arr);
  } catch {
    //handle 404
    if (!res.ok) {
      throw new Error(`An error occurred: ${res.status}`);
    }
  }
}
//variables
let idsArr = [];
let startArr = 0;
let endArr = 10;

//function to get the size of the inner array (only ten news)
async function getIds(arr) {
  try {
    for (let i = startArr; i < endArr && i < arr.length; i++) {
      //the final array
      idsArr = arr[i];

      console.log(idsArr);
      getNews(idsArr);
    }
    //conditional statements to get only 10 news each time
    if (endArr > arr.length) {
      startArr = 0;
      endArr = 10;
    } else {
      startArr = endArr;
      endArr += 10;
    }
  } catch {
    //handle error
    err => {
      console.log(err);
    };
  }
}

//function to get specific properties (date,title,link)

async function getNews(idsArr) {
  try {
    let url = `${idsUrl + idsArr + ".json"}`;
    axios.get(url).then(res => {
      let title = get(res, "data.title");
      let date = get(res, "data.time");
      let link = get(res, "data.url");

      console.log(title, date, link);

      displayNews(date, link, title);
    });
  } catch {
    err => {
      console.log(err);
    };
  }
}

//function to post news in cards
async function displayNews(date, link, title) {
  //convert string to date
  const fullDate = new Date(date * 1000);
  const finalDate = fullDate.toLocaleDateString("en-GB");
  console.log(finalDate);
  //get the div container
  const div = document.getElementById("addNews");
  //if there's no link don't show the news card otherwise post it
  if (link != undefined) {
    div.innerHTML += `<div class="card mx-3 my-2" id="card">
<div class="card-body">
<h5 class="card-title">${title}</h5>
<p class="card-text">
<a href="${link}" target="_blank" id="linkTo" class="btn btn-primary ">Learn more</a> </p>

</div>
<div class="card-footer "> Last updated: ${finalDate} </div>
</div> `;
  } else {
    return null;
  }
}

//loadElements function to display three elements (load more button, to the top btn,footer )
// Get the buttons:
const btn = document.getElementById("showMoreBtn");
const topButton = document.getElementById("topBtn");
//loadElements function
async function loadElements() {
  setTimeout(() => {
    btn.style.display = "block";
    topButton.style.opacity = "1";
    document.getElementById("footer").classList.remove("hidden-footer");
  }, 2700);
  //once the elements are displayed, call the functions that make them work
  //1)
  loadMore();
  //2)
  spinnerOnload();
  //3)
  topFunction();
  //4)
  showYear();
}

// 1) function on button click to show spinner and load more news
function loadMore() {
  btn.onclick = function () {
    fetchUrl(), spinnerOnload();
  };
}

// 2) function to add load more button's spinner
function spinnerOnload() {
  let spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");
  setTimeout(() => {
    spinner.classList.add("hidden");
  }, 2000);
}

// 3) function for to the top button to help with page srolling
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  topButton.onclick = function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
}

//4)add the full year to the footer
function showYear() {
  const year = new Date().getFullYear();
  document.getElementById("year").innerHTML = year;
}
