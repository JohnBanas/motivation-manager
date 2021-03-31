// Global Var
let quoteArr = [];
let tasksArr = [];
// current date on load
let now = dayjs().format('YYYY-MM-DD');


$(document).foundation();


// Patch for a Bug in v6.3.1 (Foundation)
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
  /* Display correct icon for current weather */
  if (weatherIcon === '10n' || weatherIcon === '10d' ||
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
// function for user date
$('#headerDate').on('change', function (event) {
  // set chosen date = newNow
  now = event.target.value;
  // clear all list containers
  $('#taskList').empty();
  $('#meetingList').empty();
  $('#gratefulList').empty();
  $('#studyList').empty();
  $('#radarList').empty();
  $('#developList').empty();
  $('#mainTasksList').empty();
  $('#textarea').val('');
  // load page with new date
  // no need to pass parameter newNow as we make global var now equal to what was newNow
  loadTasks();
  currentDay();
})

modalOnSavePage = () => {
  $('#taskList').empty();
  $('#meetingList').empty();
  $('#gratefulList').empty();
  $('#studyList').empty();
  $('#radarList').empty();
  $('#developList').empty();
  $('#mainTasksList').empty();
  $('#textarea').val('');
}

// (Casey Comment) I think we can take most of this out of this 
// function. we only need the value reset, and formatted now.
// we can make now.withFormat global and update its value from calendar event
// if we dont update now global, we can add a parameter "date" to replace 

const currentDay = function () {
  $('#dateDisplay').empty();
  displayNow = dayjs().format("dddd, MMMM D, YYYY"); //... no format required, now is formatted and all new dates will be formatted as well
  $('#dateDisplay').append(displayNow)
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
  console.log("displayquote() started");
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


// load tasks function
const loadTasks = function() {
//   // !!! names are editable, key needs to be updated to true value
//   // add loaded tasks to tasksObj
  newTasksObj = JSON.parse(localStorage.getItem("tasksArr"));
  
  if (newTasksObj) {
    tasksArr = newTasksObj;
  } else {
    return;
  }

  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].date === now) {
      //createTask(tasksArr[i].type, tasksArr[i].text, tasksArr[i].date, tasksArr[i].startTime, tasksArr[i].endTime, tasksArr[i].mainTask, tasksArr[i].notes)
      // or send entire obj to createTask if date is correct;
      createTask(tasksArr[i]);
    }
  }
}
const saveTasks = function () {
  // save all items in tasks array
  localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
}

// create function, object = object with data entries
//(john comment) we need to add delete/edit buttons here later
const createTask = function(object) {
  console.log(object);
  // if date = now
  //if (object.date === now) {
    let listItem = document.createElement("li");
    let listContainer = document.querySelector("#" + object.type + "List");
    
    if (object.type !== "notes") {
      switch (object.type) {
        case "task":
          listItem.textContent = "[" + object.startTime + "-" + object.endTime + "] " + object.text;
          break;
        case "meeting":
          listItem.textContent = "[" + object.startTime + "] " + object.text;
          break;
        case "grateful":
          listItem.textContent = object.text;
          break;
        case "study":
          listItem.textContent = "[" + object.startTime + "] " + object.text;
          break;
        case "radar":
          listItem.textContent = object.text;
          break;
        case "develop":
          listItem.textContent = object.text + " To be completed by : " + object.date;
          break;
      }
      if (object.mainTask === 'true') {
        listContainer = document.querySelector("#mainTasksList");
      }
      
      listContainer.appendChild(listItem);
    }
  
  // if type is notes
    if (object.notes) {
      $('#textarea').val(object.notes);
    }
  //}
  console.log(object.date)
  now = object.date;
}
  

// event listener for buttons on modal
$('#taskModal').on('click', 'button', function (event) {
  // will send target to different modal function 
  let btnId = event.target.getAttribute('id');
  // no longer used as date is required
  // let $taskDateContainer = $('#taskDateContainer');
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
  // modal task data type manipulation via event.target
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

// EVENT HANDLER TO RESET INPUTS ON MODAL OPEN->REVEAL. 
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

//(john comment) we need to make sure we don't allow saving empty tasks
// (Casey comment) agreed but we have to list conditionals per task type as they require some different inputs 
// when save btn is clicked in modal...
$('#saveTasksBtn').on('click', function () {

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
  // we can keep savedNotes here or check comment on textarea handler below
  // let savedNotes = $('textarea').val();

  // check for text and date...
  if (!inputText || !inputDate) {
    // alert user on needing this info
    console.log("Need some kind of alert here");
    
  } else {
    // Only save and create tasks if inputText and inputDate has values
    // consolidate all data into object
    let listObj = { type: taskType, text: inputText, startTime: startTime, endTime: endTime, date: inputDate, mainTask: mainTask};
    // push listObj to tasksArr
    tasksArr.push(listObj);

    // save updated taskArr
    saveTasks();
    // create task function call
    createTask(listObj);
    // consider pushing entire object.
    //createTask(listObj)
    now = inputDate;
    modalOnSavePage();
    loadTasks();
  }
})



// notes event handler
// SAMPLE CHANGE for text area
$('#textarea').on('blur', function (event) {
  let notes = event.target.value;
  let noteType = "notes"
  
  // check if there in at least ONE object that fits conditions in some() method
  if(tasksArr.some(object => object.type === "notes" && object.date === now)) {
    // loop the task Arr 
    console.log('if you see this then there is an object in local storage with notes')
    for (let i = 0; i < tasksArr.length; i++) {
      // find the object that matches...
      if (tasksArr[i].type === "notes" && tasksArr[i].date === now) {
        // change property value to new value
        tasksArr[i].notes = notes;
      }
    }

  } else {
    console.log('there is not a notes object.type, is it saving?')
     // if conditionals are false
     // push values as property to new object
     let notesObj = {type: noteType, notes: notes, date: now};
     // push new object to tasks Array
     tasksArr.push(notesObj);
   }

 
  saveTasks();
}) 



//meeting location directions if there is time



getQuote();
loadTasks();
currentDay();
getWeatherData();
