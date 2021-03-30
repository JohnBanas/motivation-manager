$(document).foundation();


// Patch for a Bug in v6.3.1
$(window).on('changed.zf.mediaquery', function () {
  $('.is-dropdown-submenu.invisible').removeClass('invisible');
});


let currentWeather;
let cityNameEl = 'nashville'; // either grab input to register user city or figure out how to use GPS data

getWeatherData = () => {
  // format "open weather map" api url
  let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNameEl + '&appid=882d7b151f3175e892df45d1e68ea9dd';

  
  // make a request to the url
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data.weather[0].icon)
      let weatherIcon = data.weather[0].icon;
      animatedIcon(weatherIcon);
    });
  });
};


//show animated icon with positive statement based on OpenWeather API icon

animatedIcon = (weatherIcon) => {
  /* hide html elements */
  $('#weatherContainer').hide();
  $('#sunShower').hide();
  $('.sunShowerStatement').hide();
  $('#thunderStorm').hide();
  $('.thunderStormStatement').hide();
  $('#cloudy').hide();
  $('.cloudyStatement').hide();
  $('#snow').hide();
  $('.snowStatement').hide();
  $('#sunny').hide();
  $('.sunnyStatement').hide();
  $('#rainy').hide();
  $('.rainyStatement').hide();
  /*  */
  if (weatherIcon === '10n' || weatherIcon === '10d' ||
    // !!! JOHN, is 2nd icon supposed to be 09 or 90?
    weatherIcon === '09d' || weatherIcon === '09n') {
    $('#weatherContainer').show();
    $('#rainy').show();
    $('.rainyStatement').show();
    return;
  } if (weatherIcon === '50d' || weatherIcon === '50n' ||
    weatherIcon === '02n' || weatherIcon === '02d' || weatherIcon === '03n' ||
    weatherIcon === '03d' || weatherIcon === '04n' || weatherIcon === '04d') {
    $('#weatherContainer').show();
    $('#cloudy').show();
    $('.cloudyStatement').show();
    return;
  } if (weatherIcon === '01d' || weatherIcon === '01n') {
    $('#weatherContainer').show();
    $('#sunny').show();
    $('.sunnyStatement').show();
    return;
  } if (weatherIcon === '13d' || weatherIcon === '13n') {
    $('#weatherContainer').show();
    $('#snow').show();
    $('.snowStatement').show();
    return;
  } if (weatherIcon === '11d' || weatherIcon === '11n') {
    $('#weatherContainer').show();
    $('#thunderStorm').show();
    $('.thunderStormStatement').show();
    return;
  }
  
}

// Casey Code below. needs a lot of TLC
// function for user date using Day.js
$('#headerDate').on('change', function (event) {
  let newNow = event.target.value;
  $('#taskList').empty();
  $('#meetingList').empty();
  $('#gratefulList').empty();
  $('#studyList').empty();
  $('#radarList').empty();
  $('#developList').empty();
  $('#mainTasksList').empty();
  loadTasks(newNow);
})

const currentDay = function () {
  // declare var now = current time for user
  let now = dayjs();
  // change format for display
  displayNow = now.format('MM/DD/YYYY').toString();
  
    $('#dateDisplay').append(displayNow);
    console.log(displayNow)   
}

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

// LIST CREATION WITH SAVE AND LOAD BELOW
// TODO FIGURE OUT HOW TO SAVE!

// Global Var
let quoteArr = [];
let tasksArr = [];
let now = dayjs();

// load tasks function
const loadTasks = function(newNow) {
//   // !!! names are editable, key needs to be updated to true value
//   // add loaded tasks to tasksObj
  newTasksObj = JSON.parse(localStorage.getItem("tasksArr"));
  
  if (newTasksObj) {
    tasksArr = newTasksObj;
  } else {
    return;
  }
  console.log(newNow)
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].date === newNow) {
      createTask(tasksArr[i].type, tasksArr[i].text, tasksArr[i].date, tasksArr[i].startTime, tasksArr[i].endTime,tasksArr[i].mainTask, newNow);
    } 
  }
  
}

const saveTasks = function () {
  localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
}

// create tasks from input
const createTask = function(type, text, date, timeStart, timeEnd, mainOnOrOff, newNow) {
  console.log(type, text, date, timeEnd, timeStart, mainOnOrOff);
  if (date === now.format("YYYY-MM-DD") || date === newNow) {
    let listItem = document.createElement("li");
  
    let listContainer = document.querySelector("#" + type + "List")

 

    switch (type) {
      case "task":
        listItem.textContent = "[" + timeStart + "-" + timeEnd + "] " + text;
        break;
      case "meeting":
        listItem.textContent = "[" + timeStart + "] " + text;
        break;
      case "grateful":
        listItem.textContent = text;
        break;
      case "study":
        listItem.textContent = "[" + timeStart + "] " + text;
        break;
      case "radar":
        listItem.textContent = text;
        break;
      case "develop":
        listItem.textContent = text + " To be completed by : " + date;
        break;
    }
    if (mainOnOrOff === 'true') {
      listContainer = document.querySelector("#mainTasksList")
    }
  
    // append child list item to parent ul container
    listContainer.appendChild(listItem);
  } else {
    return;
  }

  
}

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
  
    $startTimeContainer.removeClass("modalToggle");
    $endTimeContainer.removeClass("modalToggle");

    // if button's Id = radar or grateful
  } else if (btnId === "modalGratefulButton" || btnId === "modalRadarButton") {
    // change modal to accept only text input
    $startTimeContainer.addClass("modalToggle");
    $endTimeContainer.addClass("modalToggle");
  
  
  // if button id = study
  } else if (btnId === "modalStudyButton") {
    // change modal to accept text and time value only
    $startTimeContainer.removeClass("modalToggle");
    $endTimeContainer.removeClass("modalToggle");
  
  } else if (btnId === "modalDevelopButton") {
    // change modal to accept only text and date choice
    $startTimeContainer.addClass("modalToggle");
    $endTimeContainer.addClass("modalToggle");
    
  }
})

// EVENT HANDLER TO RESET INPUTS ON MODAL OPEN->REVEAL. DOESNT QUITE WORK.
$('#openBtn').on("click", function() {
  $("#modalTextInput").val("");
  $('#taskDate').val("");
  $('#startTime').val("");
  $('#endTime').val("");
  // reset toggle value to false
  uncheck = () => {
    document.getElementById("mainTaskCheckbox").checked = false;
  }
  uncheck();
})

// when save btn is clicked in modal...
$('#saveTasksBtn').on('click', function () {
  console.log('click');
  // capture and cache input-text value
  let inputText = $('#modalTextInput').val();
  // same with date input
  let inputDate = $('#taskDate').val();
  console.log(inputDate);
  // start time data input
  let startTime = $('#startTime').val();
  // end time data input
  let endTime = $('#endTime').val();
  // task type input
  let taskType = $('#taskModal').data('tasktype')
  let mainTask = document.getElementById("mainTaskCheckbox").checked.toString();
 

  // push taskObj to correct list arr in tasksObj
  
  let listObj = {type: taskType, text: inputText, startTime: startTime, endTime: endTime, date: inputDate, mainTask: mainTask}
  tasksArr.push(listObj);

  saveTasks();
  // create task function call
  createTask(taskType, inputText, inputDate, startTime, endTime, mainTask);
})

//notes save on blur next(John)



getQuote();
loadTasks();
currentDay();
getWeatherData();
