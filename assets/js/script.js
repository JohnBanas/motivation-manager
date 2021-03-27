$(document).foundation();

// Patch for a Bug in v6.3.1
$(window).on('changed.zf.mediaquery', function () {
  $('.is-dropdown-submenu.invisible').removeClass('invisible');
});


// Global Var
let quoteArr = [];
let tasksObj = {};

// load tasks function
const loadTasks = function() {
  // !!! names are editable, key needs to be updated to true value
  // add loaded tasks to tasksObj
  tasksObj = JSON.parse(localStorage.getItem("tasksObj"))

  // if tasksObj is empty/null after loading....
  if (!tasksObj) {
    tasksObj = {
      radar: [],
      daily: [],
      grateful: [],
      meetings: [],
      develop: []
    };
  }
  
}

const saveTasks = function () {
  localStorage.setItems("tasksObj", JSON.stringify(tasksObj));
}

// function for user date using Day.js
const currentDay = function () {
  // declare var now = current time for user
  let now = dayjs();
  // change format for display
  let displayNow = now.format('dddd, MMMM D').toString();
  console.log(displayNow);
}
currentDay();




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

// Call getquote function on load
getQuote();

// create tasks from input
// const createTask = function(modalId, text, date, time) {}

// event listener for buttons on modal
$('#taskModal').on('click', 'button', function (event) {
  // will send target to different modal function 
  let btnId = event.target.getAttribute('id');
  let $taskDateContainer = $('#taskDateContainer');
  let $startTimeContainer = $('#startTimeContainer');
  let $endTimeContainer = $('#endTimeContainer');
  let $taskModal = $('#taskModal');

  // change taskModal data-listtype to send to proper parent upon creation
  switch (btnId) {
    case "modalTaskButton": 
      $taskModal.data('tasktype', 'task');
      break;
      case "modalRadarButton": 
        $taskModal.data('tasktype', 'radar');
        break;
      case "modalGratefulButton": 
        $taskModal.data('tasktype', 'grateful');
        break;
      case "modalDevelopButton": 
        $taskModal.data('tasktype', 'develop');
        break;
      case "modalStudyButton": 
        $taskModal.data('tasktype', 'study');
        break;
      case "modalMeetingButton": 
        $taskModal.data('tasktype', 'meeting');
        break;
    }
  // modal manipulation via target
  // if button's id = task or meeting
  if (btnId === "modalTaskButton" || btnId === "modalMeetingButton" ) {
    // display original or recreate original
    $taskDateContainer.removeClass("modalToggle");
    $startTimeContainer.removeClass("modalToggle");
    $endTimeContainer.removeClass("modalToggle");

    // if button's Id = radar or grateful
  } else if (btnId === "modalGratefulButton" || btnId === "modalRadarButton") {
    // change modal to accept only text input
    $taskDateContainer.addClass("modalToggle");
    $startTimeContainer.addClass("modalToggle");
    $endTimeContainer.addClass("modalToggle");
  
  
  // if button id = study
  } else if (btnId === "modalStudyButton") {
    // change modal to accept text and time value only
    $startTimeContainer.removeClass("modalToggle");
    $endTimeContainer.removeClass("modalToggle");
    $taskDateContainer.addClass("modalToggle");
  
  } else if (btnId === "modalDevelopButton") {
    // change modal to accept only text and date choice
    $startTimeContainer.addClass("modalToggle");
    $endTimeContainer.addClass("modalToggle");
    $taskDateContainer.removeClass("modalToggle");
    

  }
})

// when save btn is clicked in modal...
$('#saveTasksBtn').on('click', function () {
  // capture and cache input-text value
  let inputText = $('#modalTextInput').val();
  // log it for functionality check.
  console.log(inputText);
  // same with date input
  let inputDate = $('#taskDate').val();
  console.log(inputDate);
  
  let startTime = $('#startTime').val();
  let endTime = $('#endTime').val();
  console.log(endTime);
  console.log(startTime);
  let taskType =$('#taskModal').data('tasktype')
  console.log($('#taskModal').data('tasktype'));
  // create task function call
  //createTask($('#taskModal))
})

