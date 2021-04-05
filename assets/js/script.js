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

// Weather Api Fetch. By: Initial: Phil, Major Overhaul/Additions: John Banas
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
// By: John Banas and Third-Party Code (I -Casey Arrington- think). Credit Given At Bottom Of Web Page/index.html 

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

// JOHN!  VVV Unnecessary and I dont even really understand the code.
// $('headerDate').val(now) in loadTasks will do the same but I think more completely b/c
// code below left me with some small bugs that i didnt get with my method yet. we'll see
// with more testing
// Date.prototype.toDateInputValue = (function () {
//   var local = new Date(this);
//   local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
//   return local.toJSON().slice(0, 10);
// });

// document.getElementById('headerDate').value = new Date().toDateInputValue();

// Experiment
//$('#headerDate').val(now);
// Moved to updated currentDay() so all date related displays occur in same function

// function for user date By: John Banas
$('#headerDate').on('change', function (event) {
  // set chosen date 
  now = event.target.value;
  modalOnSavePage();
  // load page with new date
  loadTasks();
  currentDay();
})

// Clear (Loaded)Lists For Current-Displayed Date For New Date Load. By: John Banas
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

// // Current/Chosen Date to Display. By: Casey Arrington and John Banas
// const currentDay = function () {
//   $('#dateDisplay').empty();
//   displayNow = dayjs(now).format("dddd, MMMM D, YYYY");
//   $('#dateDisplay').append(displayNow)
// }

const currentDay = function () {
  // load in new Day
  $('#headerDate').val(now);
  // set top-o-page display format
  displayNow = dayjs(now).format("dddd, MMMM D, YYYY");
  // set .text of display to displayNow
  $('#dateDisplay').text(displayNow);
}

// fetch Function for Quote Api. By: Casey Arrington
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


// Display quote randomly selected from quote Arr function(). By: Casey Arrington 
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

// Function to refresh QuoteDisplay. By: Casey
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

// Load tasks/tasksArr function By: Casey Arrington and John Banas
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





// Save TaskArr function By: Casey Arrington
const saveTasks = function () {
  // save all items in tasks array
  localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
}




// const displayTasks = function (object) {}
// // send only current date data to create Task
// for (let i = 0; i < tasksArr.length; i++) {

//   if (tasksArr[i].date === now) {
//     createTask(tasksArr[i]);
//   }
// }
// //delete old tasks
// dateAudit(tasksArr);


















// create function, object = object with data entries
//(John Banas comment) we need to add delete/edit buttons here later

// Create Task Function By: Casey Arrington and John Banas

// Casey Changes (4/3/21)
// Change in edit/delete id's to match object id for ease in identification and add editBtn.Attr (data-open= "taskModal") to open modal
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

    //$(editBtnEl).attr({ id: 'y' + object.id })
    //$(deleteBtnEl).attr({ id: 'z' + object.id })
    if (object.type !== 'notes') {
    // All !notes type specific code

    editBtnEl.setAttribute('class', 'editBtn');
    // Give editBtn power to open modal
    editBtnEl.setAttribute('data-open', 'taskModal');

    
    deleteBtnEl.setAttribute('class', 'deleteBtn');
    console.log(object.startTime)
    //change starting military time to standard
    //debugger;
    //change hours to string save to variable
    let startHours = object.startTime.slice(0, 2);
    
    // //minutes
    let startMinutes = object.startTime.slice(3);
    // //am or pm
    // let parsedHours = parseInt(startHours);
    //console.log(parsedHours);
    let parsedHour = parseInt(startHours);
    
    if (parsedHour >= 12) {
       startAmOrPm = 'pm'
       startHours = startHours - 12;
     } else {
       startAmOrPm = 'am'
     }
    
    //var AmOrPm = parsedHours >= 12 ? 'pm' : 'am';
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
    // //am or pm is already controlled
    // //change hour to standard time
    // endHours = (endHours % 12) || 12;
    let startString = (startHours + ":" + startMinutes + " " + startAmOrPm).toString();
    let endString = (endHours + ":" + endMinutes + " " + endAmOrPm).toString();
    // update below section to implement note creation in createTask
    //to style the buttons need id or class
    
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
      //listContainer.appendChild(listItem);
    

    // // if type is notes
    // if (object.notes) {
    //   $('#textarea').val(object.notes);
    // }
    // now = object.date;
  
}




// John Banas's edit and Delete Functionality Below

// Causes Bug on Closing Modal with My code?

//picks up click event from created edit button
//create variable to open modal without click event

// var modalPopUp = new Foundation.Reveal($('#taskModal'));
// //edit button clicked
// $(document).on('click', '.editBtn', function (event) {
//   //clear any input
//   clearModalInputs();
//   //pull current array
//   let editTaskArr = JSON.parse(localStorage.getItem("tasksArr"));
//   //loop through array
//   for (let i = 0; i < editTaskArr.length; i++) {
//     //if the array id equals the button id 
//     if ('y' + editTaskArr[i].id === event.target.id) {
//       //open modal
//       modalPopUp.open();
//       //populate modal inputs with the matching array values
//         $("#modalTextInput").val(editTaskArr[i].text);
//         $('#taskDate').val(editTaskArr[i].date);
//         $('#startTime').val(editTaskArr[i].startTime);
//         $('#endTime').val(editTaskArr[i].endTime);
//         // reset toggle value to false
//         uncheck = () => {
//           document.getElementById("mainTaskCheckbox").checked = false;
//         }
//         uncheck();
//       //remove the task from the array because it will be added with the save button
//       //trying to do that with map() to dynamically make a new array, not working yet.
//       //var $newArray = $.makeArray(editTaskArr[i]);
//       // $.map($newArray, function (value, key) {
//       //   value.text = '';
//       //   value.date = '';
//       //   value.startTime = '';
//       //   value.endTime = '';
//       // })
//     }
//   }
// });

// //picks up click event for delete button 
// $(document).on('click', '.deleteBtn', function (event) {
//   //pull from local storage
//   let editTaskArr = JSON.parse(localStorage.getItem("tasksArr"));
//   for (let i = 0; i < editTaskArr.length; i++) {
//     //if the id of the array equals the button id
//     if ('z' + editTaskArr[i].id === event.target.id) {
//       //pull it from the array
//       tasksArr.splice(i, 1);
//       //save the new array
//       saveTasks();
//       //clear the page of the old list items just deleted
//       $(`x` + event.target.id).remove();
//     }
//   }
// });


// // John Banas's Edit and Delete Functionality Above
const modalTypeEdit = function (taskType) {
    // declare vars for inputs that may or may not be required
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

  //modalTypeEdit(btnId);
  // // declare vars for inputs that may or may not be required
  // let $startTimeContainer = $('#startTimeContainer');
  // let $endTimeContainer = $('#endTimeContainer');
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

  // moved code below to own function to be useable by edit modal open DRY

  // console.log(type);
  // // if button's id = task
  // if (type === "task") {
    
  //   // display original or recreate original
  //   // Show All Input Fields
  //   $startTimeContainer.removeClass("modalToggle");
  //   $endTimeContainer.removeClass("modalToggle");

  //   // if button's Id = radar or grateful or develop
  // } else if (type === "grateful" || type === "radar" || type === "develop") {
    
  //   // change modal to accept only text input
  //   // Hide startTime and endTime
  //   $startTimeContainer.addClass("modalToggle");
  //   $endTimeContainer.addClass("modalToggle");


  //   // if button id = study or meeting
  // } else if (type === "study" || type === "meeting") {
  //   // change modal to accept text and time value only
  //   // shows startTime and hides endTime
  //   $startTimeContainer.removeClass("modalToggle");
  //   $endTimeContainer.addClass("modalToggle");

  // }
  
// Remove because updated date requirements make develop required fields match radar and grateful
// else if (btnId === "modalDevelopButton") {
//     // change modal to accept only text and date choice

//     $startTimeContainer.addClass("modalToggle");
//     $endTimeContainer.addClass("modalToggle");

//   }
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

// Clear Modal Inputs Function. By Casey Arrington  initially, heavily refactored by John Banas

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







// Modal Save Event Handler. By: John Banas and Casey Arrington
$('#saveTasksBtn').on('click', function () {
  //let localObject = JSON.parse(localStorage.getItem("tasksArr"));
  //console.log(localObject)
  //if (localObject) {
    //listID++;
  //} else {
    //listID = 0;
  //}
  //console.log(listID);

  // Current Id Generator above
  // Testing New Below
  
  // if idCounter = 0
  // if (idCounter === 0) {
  //   listId = 0;
  //   idCounter++
  // } else {
  //   listId = idCounter;
  //   idCounter++
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

// close modal function. By: Casey Arrington
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
  //closeBtn.click;
  //console.log("blah");
  
}

// Function to auto-delete if object.date is before yesterday. By: Casey Arrington and John Banas 
const dateAudit = function (tasksArr) {
  let past = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  for (let i = 0; i < tasksArr.length; i++) {
    if (dayjs(tasksArr[i].date).isBefore(past)) {
      tasksArr.splice(i, 1);
      saveTasks();
    }
  }
}

//working on saving notes in a seperate array and 
//dynamically adding them to a list with edit and 
//delete buttons

// let notesArr = [];
// const iteration = notesArr.keys();
// let idNumber;
// saveNotesFunction = () => {
//   if (notesArr) {
//     for (let i = 0; i < notesArr.length; i++) {
//       localStorage.setItem(notesArr[i].id, notesArr[i].text);
//     }
//   } else
//   {
//     localStorage.setItem( 0, notesArr);
//   }
// }

// create Notes
// const createNotes = function (noteObj) {
//   let $notesContainer = $('#notesList');
//   let $noteListItem = $('<li>')
//   let 
// }

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

  //   //get text from notes
//   let notes = $('#textarea').val()
//   //create list item
//   let noteListItem = document.createElement('li');
//   //notes <ul>
//   let notesEl = document.querySelector('#notesList');
  
//   noteListItem.textContent = notes;

//   // for (const key of iteration) {
//   //   idNumber = key;
//   //   console.log(idNumber);}
  
  
//     let notesObj = { id: idNumber, date: now, text: notes };
//     notesArr.push(notesObj);
//     saveNotesFunction();
  
  

//   let buttonContainer = document.createElement("div");
//   $(buttonContainer).attr({ class: 'editDeleteContainers' });

//   let notesEditBtnEl = document.createElement("button");
//   let notesDeleteBtnEl = document.createElement("button");


//   notesEditBtnEl.textContent = "EDIT";
//   notesEditBtnEl.setAttribute('class', 'notesEditBtn');

//   notesDeleteBtnEl.textContent = "DELETE";
//   notesDeleteBtnEl.setAttribute('class', 'notesDeleteBtn');

//   buttonContainer.appendChild(notesEditBtnEl);
//   buttonContainer.appendChild(notesDeleteBtnEl);
//   noteListItem.appendChild(buttonContainer);
//   notesEl.appendChild(noteListItem);
// })

// Current Note Event Handler Below

// $('#textarea').on('blur', function (event) {
//   let notes = event.target.value;
//   let noteType = "notes"
//   // check if there in at least ONE object that fits conditions in some() method
//   //John Banas updated via Casey Arrington text message
//   if (tasksArr.some(object => object.type === "notes" && object.date === now)) {
//     // loop the task Arr 
//     for (let i = 0; i < tasksArr.length; i++) {
//       // find the object that matches...
//       if (tasksArr[i].type === "notes" && tasksArr[i].date === now) {
//         // change property value to new value
//         tasksArr[i].notes = notes;
//         console.log(notes);
//         //put in <li> in <ul>
//         noteListItem.textContent = notes;
//         notesEl.appendChild(noteListItem);
//       }
//     }

//   } else {
//     // if conditionals are false
//     // push values as property to new object
//     let notesObj = { type: noteType, notes: notes, date: now };
//     // push new object to tasks Array
//     tasksArr.push(notesObj);
//   }
//   saveTasks();
// })

/* 1.) Add Edit and Delete buttons to Modal
  2.) Copy Modal and create a new event handler 
  3.) Hold data from Modal in an object array
  4.) Add information in

Copy Modal and create a new button for Edit and Delete Tasks 

*/

// EVENT HANDLER FOR DYNAMIC-GENERATED EDIT/DELETE By: Casey Arrington 

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
