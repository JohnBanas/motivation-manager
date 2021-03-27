$(document).foundation();

// Patch for a Bug in v6.3.1
$(window).on('changed.zf.mediaquery', function () {
  $('.is-dropdown-submenu.invisible').removeClass('invisible');
});

// Global Var
let quoteArr = [];



// !!!important!!! NOT USING QUOTES.rest here....
// fetch to get quotes
const getQuote = function() {
  // send fetch request
  fetch("https://type.fit/api/quotes")
    //then ....
    .then(function(response) {
      // if response is ok  
      if (response.ok) {
        // return .json()-ified response
        return response.json();
    } else {
        // Currently stop function...maybe add error display?
        return;
      }
    }).then(function(data) {
        // run for loop  
        for (let i = 0; i < 20; i++) {
          // randomQuote equals random value of data[index]
          let randomQuote = data[Math.floor(Math.random() * data.length)];
          // push to quoteArr for cycling through random quotes per session
          quoteArr.push(randomQuote);
        }
        quoteRefreshTimer();
    })
}

// Display quote randomly selected from quote Arr function()
const displayQuote = function () {
  // for functionality check
  console.log("started");
  
  // find <p> by id
  let $quoteEl = $('#quoteElement');

  // Choose a random index from quoteArr
  let randomIndexQuote = quoteArr[Math.floor(Math.random() * quoteArr.length)];

  // change quoteOfDayEl text value to value of quoteArr[randNum].properties 
  $quoteEl.html(randomIndexQuote.text + "<span> -" + randomIndexQuote.author + "</span>");
}

// quoteTimer
const quoteRefreshTimer =  function() {
  // run displayQuote once
  displayQuote();
  // re-run displayQuote every 30 minutes to cycle through quotes
  setInterval(function() {
    // call displayQuote
    displayQuote();
    // every 30 minutes
  }, (1000 * 60) * 30);
}