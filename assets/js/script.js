// Global Var
let listID;
let previousStart = 0;
let quoteArr = [];
let tasksArr = [];
// current date on load
let now = dayjs().format('YYYY-MM-DD');
// consider localizing divTemp to showTemp() function
var divTemp = document.querySelector("#temp");
// task item id counter
let idCounter = 0;
$(document).foundation();


// Patch for a Bug in v6.3.1 (Foundation)
$(window).on('changed.zf.mediaquery', function () {
  $('.is-dropdown-submenu.invisible').removeClass('invisible');
});


// ALL SERVERSIDE API / FETCH-RELATED FUNCTIONS BELOW 

let currentWeather;
// Hard-coded city for showcase
let cityNameEl = 'nashville'; // either grab input to register user city or figure out how to use GPS data

// Weather Api Fetch. 
getWeatherData = () => {
  // format "open weather map" api url
  let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNameEl + '&appid=882d7b151f3175e892df45d1e68ea9dd' + "&units=imperial";
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Something went wrong.');
      }
    }).then(function (data) {
      let weatherIcon = data.weather[0].icon;
      animatedIcon(weatherIcon);

      // a variable to hold temperature
      let temperatureEl = data.main.temp;
      // pass variable to function
      showTemp(temperatureEl);

    }).catch(function (error) {
      console.log(error);
    });
};

const showTemp = (temperatureEl) => {
  // create an H4 element for temp
  var tempEl = document.createElement("h4");
  // add text content
  tempEl.textContent = "The current temperature is " + temperatureEl + "˚F";
  // add class to align content to center
  tempEl.className = "text-center";
  // append child
  divTemp.append(tempEl);
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


// function for user date
$('#headerDate').on('change', function (event) {
  // set chosen date 
  now = event.target.value;
  modalOnSavePage();
  // load page with new date
  loadTasks();
  currentDay();
})

// Clear (Loaded)Lists For Current-Displayed Date For New Date Load.
modalOnSavePage = () => {
  $('#taskList').empty();
  $('#meetingList').empty();
  $('#gratefulList').empty();
  $('#studyList').empty();
  $('#radarList').empty();
  $('#developList').empty();
  $('#mainTasksList').empty();
  $('#textarea').val('');
  $('#notesList').empty();
}

const currentDay = function () {
  // load in new Day
  $('#headerDate').val(now);
  // set top-o-page display format
  displayNow = dayjs(now).format("dddd, MMMM D, YYYY");
  // set .text of display to displayNow
  $('#dateDisplay').text(displayNow);
}

// fetch Function for Quote Api.
const getQuote = function () {
  // send fetch request
  fetch("https://type.fit/api/quotes")
    //then ....
    .then(function (response) {
      // if response is ok  
      if (response.ok) {
        // return .json()-ified response
        return response.json();
      } else {
        // display error 
        throw new Error('Something went wrong.');
      }
    }).then(function (data) {
      // run for loop to push 20 randomly selected from fetched data  
      for (let i = 0; i < 20; i++) {
        // randomQuote equals random value of data[index]
        let randomQuote = data[Math.floor(Math.random() * data.length)];
        // push to quoteArr for cycling through random quotes per session
        quoteArr.push(randomQuote);
      }
      quoteRefreshTimer();
    }) //catch error
    .catch(function (error) {
      console.log(error);
    })
}


// Display quote randomly selected from quote Arr function(). 
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

// Function to refresh QuoteDisplay. 
const quoteRefreshTimer = function () {
  // run displayQuote once
  displayQuote();
  // re-run displayQuote every 30 minutes to cycle through quotes
  setInterval(function () {
    // call displayQuote
    displayQuote();
    // every 30 minutes
  }, (1000 * 60) * 30);
}

// FETCH/SERVER API FUNCTIONS ABOVE


// LIST CREATION WITH SAVE AND LOAD BELOW

// Load tasks/tasksArr function 
const loadTasks = function () {
  //$('#headerDate').val(now);
  // add loaded tasks to tasksObj
  newTasksObj = JSON.parse(localStorage.getItem("tasksArr"));
  //.sort() funtion to put them in order
  if (newTasksObj) {
    tasksArr = newTasksObj;
    tasksArr.sort(function (x, y) {
      return x.data - y.data;
    });
  } else {
    return;
  }

  // reset and adjust idCounter BEFORE task is created
  initialIdCount();

  // send only current date data to create Task
  for (let i = 0; i < tasksArr.length; i++) {

    if (tasksArr[i].date === now) {
      createTask(tasksArr[i]);
    }
  }
  //delete old tasks
dateAudit(tasksArr);
}





// Save TaskArr function 
const saveTasks = function () {
  // save all items in tasks array
  localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
}


const createTask = function (object) {
  console.log(object);
  
    let listItem = document.createElement("li");
    //$(listItem).attr({ id: 'x' + object.id, data: object.data });
    // changed it to equal pure value
    listItem.setAttribute('id', object.id);
    // for your (john) data attr
    listItem.setAttribute('data', object.data)

    let listContainer = document.querySelector("#" + object.type + "List");

    let buttonContainer = document.createElement("div");
    $(buttonContainer).attr({ class: 'editDeleteContainers' });
    
    let editBtnEl = document.createElement("button");
    let deleteBtnEl = document.createElement("button");

    // changed to equal pure value of object
    editBtnEl.setAttribute('id', object.id);
    deleteBtnEl.setAttribute('id', object.id);

    editBtnEl.textContent = "edit";
    deleteBtnEl.textContent = "delete";

    editBtnEl.setAttribute('class', 'editBtn');
    deleteBtnEl.setAttribute('class', 'deleteBtn');

    if (object.type !== 'notes') {
    // All !notes type specific code

    editBtnEl.setAttribute('class', 'editBtn');
    // Give editBtn power to open modal
    editBtnEl.setAttribute('data-open', 'taskModal');

    
    deleteBtnEl.setAttribute('class', 'deleteBtn');
    console.log(object.startTime)
    //change starting military time to standard
    //change hours to string save to variable
    let startHours = object.startTime.slice(0, 2);
    
    // //minutes
    let startMinutes = object.startTime.slice(3);
  
   
    let parsedHour = parseInt(startHours);
    
    if (parsedHour >= 12) {
       startAmOrPm = 'pm'
       startHours = startHours - 12;
     } else {
       startAmOrPm = 'am'
     }
    
    //changing to standard time
    startHours = (startHours % 12) || 12;

    //same for end time hours
    
    let endHours = object.endTime.slice(0,2);
    let parsedEndHour = parseInt(endHours);
    if (parsedEndHour >= 12) {
      endHours = endHours - 12;
      endAmOrPm = 'pm'
    } else {
      endAmOrPm = 'am'
    }
    // //minutes
    let endMinutes = object.endTime.slice(3);

    let startString = (startHours + ":" + startMinutes + " " + startAmOrPm).toString();
    let endString = (endHours + ":" + endMinutes + " " + endAmOrPm).toString();

    
      switch (object.type) {
        case "task":
          listItem.textContent = "[" + startString + " - " + endString + "] - " + object.text;
          break;
        case "meeting":
          listItem.textContent = "[ " + startString + "] - " + object.text;
          break;
        case "grateful":
          listItem.textContent = object.text;
          break;
        case "study":
          listItem.textContent = listItem.textContent = "[ " + startString + "] - " + object.text;
          break;
        case "radar":
          listItem.textContent = object.text;
          break;
        case "develop":
          listItem.textContent = object.text + " To be completed by : " + object.date;
          break;
      }
      if (object.mainTask === 'true') {
        // clones tasks WITHOUT edit and delete btns. I like it but can change
        $(listItem).clone().appendTo('#mainTasksList');
      }
    
    } else {
      listItem.textContent = object.text;

    }
      listContainer.appendChild(listItem);
      buttonContainer.appendChild(editBtnEl);
      buttonContainer.appendChild(deleteBtnEl);
      listItem.appendChild(buttonContainer);
    
}

const modalTypeEdit = function (taskType) {
    
    let $startTimeContainer = $('#startTimeContainer');
    let $endTimeContainer = $('#endTimeContainer');
    // Remove required class if task-type is changed after initial attempt
    $('#modalTextInput').removeClass('required');
    $('#startTime').removeClass('required');
    $('#endTime').removeClass('required');
    $('#taskDate').removeClass('required');
    // modal task data type manipulation via event.target
    
    // if button's id = task
    if (taskType === "task") {
      
      // display original or recreate original
      // Show All Input Fields
      $startTimeContainer.removeClass("modalToggle");
      $endTimeContainer.removeClass("modalToggle");
  
      // if button's Id = radar or grateful or develop
    } else if (taskType === "grateful" || taskType === "radar" || taskType === "develop") {
      
      // change modal to accept only text input
      // Hide startTime and endTime
      $startTimeContainer.addClass("modalToggle");
      $endTimeContainer.addClass("modalToggle");
  
  
      // if button id = study or meeting
    } else if (taskType === "study" || taskType === "meeting") {
      // change modal to accept text and time value only
      // shows startTime and hides endTime
      $startTimeContainer.removeClass("modalToggle");
      $endTimeContainer.addClass("modalToggle");
  
    }
}


// event listener for buttons on modal
$('#taskModal').on('click', 'button.modalButton', function (event) {
  // will send target to different modal function 
  let btnId = event.target.getAttribute('id');
  console.log(btnId);


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
  let type = $taskModal.data('tasktype');
  modalTypeEdit(type);

})


// Edit Notes!

const editNotes = function (noteObj) {
  $('#textarea').val(noteObj.text);
}











// EVENT HANDLER TO RESET INPUTS ON MODAL OPEN->REVEAL. 
// When Modal opens via #openBtn
$('#openBtn').on("click", function () {
  // clear all inputs
  clearModalInputs();
})

// Clear Modal Inputs Function.

clearModalInputs = () => {  
$("#modalTextInput").val("");
  $('#taskDate').val(now);
  $('#startTime').val("");
  $('#endTime').val("");
  modalTypeEdit('task')
  console.log($('#taskModal').data('tasktype'));
  // reset toggle value to false
  uncheck = () => {
    document.getElementById("mainTaskCheckbox").checked = false;
  }
  uncheck();
  // remove data type from save button
  $('#saveTasksBtn').removeAttr("data-close");
  
}







// Modal Save Event Handler. 
$('#saveTasksBtn').on('click', function () {

  let listId = idCounter;
  idCounter++;


  // capture and cache input-text value
  let inputText = $('#modalTextInput').val();
  // same with date input
  let inputDate = $('#taskDate').val();
  // start time data input
  let startTime = $('#startTime').val();
  // end time data input
  
  let endTime = $('#endTime').val();

  // task type input
  let taskType = $('#taskModal').data('tasktype')
  let mainTask = document.getElementById("mainTaskCheckbox").checked.toString();
  let x = $('#startTime').val().toString().replace(':', '');
  let dataType = parseInt(x);

  // data check below!
  // consolidate all data into object
  // removing id: listId in object for test
  let listObj = { type: taskType, text: inputText, startTime: startTime, endTime: endTime, date: inputDate, mainTask: mainTask, data: dataType, id: listId};
  // check all task types
  if (taskType === 'task') {
    // check for necessary data inputs
    if (!inputText || !startTime || !endTime || !inputDate) {
      $('#modalTextInput').addClass('required');
      $('#startTime').addClass('required');
      $('#endTime').addClass('required');
      $('#taskDate').addClass('required');
      console.log("No sir, we need that data");

      return;
    } else {
      // if so send obj to new function below
      clickCloseBtn(listObj);
    }
  } else if (taskType === 'radar' || taskType === "grateful" || taskType === "develop") {
    if (!inputText || !inputDate) {
      $('#modalTextInput').addClass('required');
      $('#taskDate').addClass('required');
      console.log("Seriously, its two inputs");

      return;
    } else {
      clickCloseBtn(listObj);
    }
  } else if (taskType === 'meeting' || taskType === "study")
    if (!inputText || !inputDate || !startTime) {
      $('#modalTextInput').addClass('required');
      $('#startTime').addClass('required');
      $('#taskDate').addClass('required');
      console.log("FILL IT OUT!!!!")

      return;
    } else {
      clickCloseBtn(listObj);
    }
});

// close modal function. 
const clickCloseBtn = function (listObj) {
  // add the data-close to saveTasksBtn
  $('#saveTasksBtn').attr("data-close", "");
  // remove required class for inputs
  $('#modalTextInput').removeClass('required');
  $('#startTime').removeClass('required');
  $('#endTime').removeClass('required');
  $('#taskDate').removeClass('required');
  // push obj to array
  tasksArr.push(listObj);
  // save updated taskArr
  saveTasks();

  // update date to chosen date
  now = listObj.date;
  currentDay();
  modalOnSavePage();
  loadTasks();

  
}

// Function to auto-delete if object.date is before yesterday. 
const dateAudit = function (tasksArr) {
  let past = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  for (let i = 0; i < tasksArr.length; i++) {
    if (dayjs(tasksArr[i].date).isBefore(past)) {
      tasksArr.splice(i, 1);
      saveTasks();
    }
  }
}


// save notes event handler
$('#saveNotes').on('click', function (event) {
  let noteType = "notes";
  let notes = $('#textarea').val();
  if (!notes) {
    console.log("Nothing to save here");
    return;
  }
  // create the note object 
  let notesObj = {type: noteType, text: notes, id: idCounter, date: now};
  tasksArr.push(notesObj);
  // push it to tasksArr
  saveTasks();
  idCounter++
  modalOnSavePage();
  loadTasks();
})

// EVENT HANDLER FOR DYNAMIC-GENERATED EDIT/DELETE 

const editModalOpen = function (task) {
  //modalTypeEdit(task.type);
  //console.log(task.type);
  //$('#taskModal').data("tasktype");
  modalTypeEdit(task.type);
  $("#modalTextInput").val(task.text);
  $('#taskDate').val(task.date);
  $('#startTime').val(task.startTime);
  $('#endTime').val(task.endTime);
  // set value of mainTask to task.mainTask value
  uncheckOrCheck = () => {
    if (task.mainTask === 'true') {
    document.getElementById("mainTaskCheckbox").checked = true;
    } else {
      document.getElementById("mainTaskCheckbox").checked = false;
    }
  }

  uncheckOrCheck();

  // remove data type from save button to prevent close on save with missing data
  $('#saveTasksBtn').removeAttr("data-close");
}

// event handler for dynamically created edit and delete buttons
$('.tasklistContainer').on('click', 'button', function(event) {
  // to edit or to delete? that is the question
  let btnClicked = event.target;
  console.log(btnClicked);
  // get class of btnClicked (edit or delete)
  let btnClickedType = btnClicked.getAttribute('class');
  let btnClickedId = btnClicked.getAttribute('id').toString();
  //debugger;
  if (btnClickedType === "deleteBtn") {
    for (let i = 0; i < tasksArr.length; i++) {
      console.log(btnClickedId);
      console.log(tasksArr[i].id);
      console.log(btnClickedId === tasksArr[i].id.toString());
      // if ID of button and task match
      if (btnClickedId === tasksArr[i].id.toString()) {
        // Delete Task from array with splice
        console.log('delete?')
        tasksArr.splice(i, 1);
        saveTasks()
        // loadTasks again
        modalOnSavePage();
        loadTasks()
      }
    }
  } else if (btnClickedType === "editBtn") {
    for (let i = 0; i < tasksArr.length; i++) {
      if (btnClickedId === tasksArr[i].id.toString()) {
        //debugger;
        //tasksArr.splice(i, 1);
        console.log("edit this?");
        if (tasksArr[i].type === 'notes') {
          editNotes(tasksArr[i]);
        } else {  
          editModalOpen(tasksArr[i]);
        }
        tasksArr.splice(i, 1);
        //console.log(taskArr);
        
        
      }

    }
  } 
})






//sticky nav bar 
$('.title-bar').on('sticky.zf.stuckto:top', function () {
  $(this).addClass('shrink');
}).on('sticky.zf.unstuckfrom:top', function () {
  $(this).removeClass('shrink');
})

// Get up counter synced to loaded tasks
const initialIdCount = function () {
  if (tasksArr) {
    let currentMax = 0;
    for (let i = 0; i < tasksArr.length; i++) {
      //if (tasksArr[i].id > currentMax) {
        //currentMax = tasksArr[i].id;
      //}
      //idCounter = currentMax + 1;
      
      // reset all ids on load, 
      tasksArr[i].id = currentMax;
      currentMax++;
      
    }
    
    idCounter = currentMax;
    
  }
}


getQuote();
loadTasks();
currentDay();
getWeatherData();
