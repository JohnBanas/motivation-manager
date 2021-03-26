// TODO

// function for time (unsure of desired outcome as of now)

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
          displayQuote(data);
      })
}

const displayQuote = function (dataArr) {
    // find <p> by id
    let $quoteOfDayEl = $('#quoteOfTheDay');

    // Choose a random index from data Arr
    let randomIndexQuote = dataArr[Math.floor(Math.random() * dataArr.length)];

    // change quoteOfDayEl text value to 
    $($quoteOfDayEl).html(randomIndexQuote.text + "<span> -" + randomIndexQuote.author + "</span>");
}

// function for user date using Day.js
const currentDay = function () {
  // declare var now = current time for user
  let now = dayjs();
  // change format for display
  let displayNow = now.format('dddd, MMMM D').toString();
  console.log(displayNow);

  // for hour... similar syntax for other time measurements: minutes, seconds 
  //var x = dayjs().get('hour')
}

getQuote();
currentDay();