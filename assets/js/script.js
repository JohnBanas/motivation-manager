$(document).foundation();

// Patch for a Bug in v6.3.1
$(window).on('changed.zf.mediaquery', function () {
  $('.is-dropdown-submenu.invisible').removeClass('invisible');
});

// Casey's JS

// Global Var
let quoteArr = [];


// TODO
// add modal function
  // sort by start time
  // 
// function for time (unsure of desired outcome as of now)
  // if approach time, color changes

// function for quote fetch
// NOT USING QUOTES.rest here....
const getQuote = function() {
  // send fetch request
  fetch("https://type.fit/api/quotes")
    //then if ok parse response
    .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
            return;
          }
    }).then(function(data) {
        // run for loop 
        for (let i = 0; i < 20; i++) {
          // randomQuote equals random value of data[index]
          let randomQuote = data[Math.floor(Math.random() * data.length)];
          // push to quoteArr for cycling through quotes per session
          quoteArr.push(randomQuote);
        }
        quoteRefreshTimer();
    })
}

const displayQuote = function () {
  console.log("started")
  // find <p> by id
  let $quoteEl = $('#quoteElement');

  // Choose a random index from quoteArr
  let randomIndexQuote = quoteArr[Math.floor(Math.random() * quoteArr.length)];

  // change quoteOfDayEl text value to 
  $quoteEl.html(randomIndexQuote.text + "<span> -" + randomIndexQuote.author + "</span>");
}

// quoteTimer
const quoteRefreshTimer =  function() {
  // run displayQuote once
  displayQuote();
  // re-run displayQuote every 30 minutes to cycle through quotes
  setInterval(function() {
    displayQuote();
  }, (1000 * 60) * 30);
}
// Commented out because index in this branch does not have day.js sourced
// function for user date using Day.js
// const currentDay = function () {
// // declare var now = current time for user
// let now = dayjs();
// // change format for display
// let displayNow = now.format('dddd, MMMM D').toString();
// console.log(displayNow);

// for hour... similar syntax for other time measurements: minutes, seconds 
//var x = dayjs().get('hour')
//}

// TODO 
// MAKE MODAL LOGIC
const taskSelection = function(buttonClicked) {
  // get clicked button's id
  let buttonId = buttonClicked.getAttribute('id');
  
  // run switch-case to match id...
  switch (buttonId) {
    case 'modalTaskButton':
      console.log(buttonId);
      break;
    case 'modalMeetingButton':
      console.log(buttonId);
      break;
    case 'modalGratefulButton':
      console.log(buttonId);
      break;
    case 'modalRadarButton':
      console.log(buttonId);
      break;
    case 'modalStudyButton':
      console.log(buttonId);
      break;
    case 'modalDevelopButton':
      console.log(buttonId);
      break;
  }
 
}

getQuote();

$('#taskModal').on('click', 'button', function (event) {
  taskSelection(event.target);
})