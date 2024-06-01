var selectedRow = null;
var theme = 'blue';

document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    displayUpcomingTasks();
    displayTasksDueToday();
    displayPreviousTasks();
    applyRowColors();
    updateDateTime();
  });

function addtask() {
    var task = document.getElementById("taskinput").value.trim();
    var due = document.getElementById("due").value.trim();
    const theme = getStoredTheme();
    if (task) {
        var todolist = document.getElementById("todo").getElementsByTagName("tbody")[0];
        var rows = todolist.getElementsByTagName("tr");
        var newRow = null;       
        for (var i = 0; i < rows.length; i++) {
            var rowDue = rows[i].cells[1].textContent.trim();
            if (!rowDue || new Date(due) < new Date(rowDue)) {
                newRow = todolist.insertRow(i);
                break;
            }
        }        
        if (!newRow) {
            newRow = todolist.insertRow(todolist.rows.length);
        }        
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        cell1.innerHTML = `<span class="tasktext">${task}</span> <span class="icons"><span class="edit" onclick="edittask(this)">&#9988;</span> | <span class="del" onclick="del(this)">&times;</span></span>`;
        cell2.textContent = due;        
        newRow.addEventListener('dblclick', function() {
            var selectedRows = document.querySelectorAll('.selected');
            selectedRows.forEach(function(row) {
                row.classList.remove('selected');
            });
            newRow.classList.add('selected');
            openmarkmodal();
        });
        closemodal();
    } else {
        alert("Please enter a valid task!");
    }
    displayUpcomingTasks();
    displayTasksDueToday();
    displayPreviousTasks();
    applyRowColors();
}

function openmodal() {
    var modal = document.getElementById("taskmodal");
    var body = document.querySelectorAll("body > *:not(#taskmodal)");
    document.getElementById("taskinput").value = '';
    document.getElementById("due").value = '';
    modal.style.display = "flex";
    body.forEach(function(element) {
        element.style.filter = "blur(3.5px)";
    });
}

function closemodal() {
    var modal = document.getElementById("taskmodal");
    var body = document.querySelectorAll("body > *:not(#taskmodal)");
    modal.style.display = "none";
    body.forEach(function(element) {
        element.style.filter = "none";
    });
}

function edittask(element) {
    var taskrow = element.closest('tr');
    selectedRow = $(taskrow); 
    var task = taskrow.querySelector('.tasktext').textContent;
    var due = taskrow.cells[1].textContent;
    document.getElementById("editinput").value = task;
    document.getElementById("editdue").value = due;
    openeditmodal();
}

function sortTasks() {
    var todoTable = document.getElementById("todo").getElementsByTagName("tbody")[0];
    var rows = Array.from(todoTable.getElementsByTagName("tr"));
    rows.sort(function(a, b) {
        var aDue = a.cells[1].textContent.trim();
        var bDue = b.cells[1].textContent.trim();
        if (!aDue || !bDue) {
            return 0; 
        }
        return new Date(aDue) - new Date(bDue);
    });
    while (todoTable.firstChild) {
        todoTable.removeChild(todoTable.firstChild);
    }
    rows.forEach(function(row) {
        todoTable.appendChild(row);
    });
}

function edit() {
    var newtask = $('#editinput').val().trim();
    var newdue = $('#editdue').val().trim();
    if (selectedRow && newtask) {
        selectedRow.find('.tasktext').text(newtask);
        selectedRow.find('td:nth-child(2)').text(newdue);
        closeeditmodal();
        selectedRow = null; 
        sortTasks();
        displayUpcomingTasks();
        displayTasksDueToday();
        displayPreviousTasks();
        applyRowColors();
    } else {
        alert("Please enter a valid task!");
    }
}

function del(element) {
    var taskrow = $(element).closest('tr');
    taskrow.remove();
    displayUpcomingTasks();
    displayTasksDueToday();
    displayPreviousTasks();
    applyRowColors();   
}

function openeditmodal() {
    var editmodal = document.getElementById("edittaskmodal");
    editmodal.style.display = "flex";
    var body = document.querySelectorAll("body > *:not(#edittaskmodal)");
    body.forEach(function(element) {
        element.style.filter = "blur(3.5px)";
    });
}

function closeeditmodal() {
    var modal = document.getElementById("edittaskmodal");
    var body = document.querySelectorAll("body > *:not(#edittaskmodal)");
    modal.style.display = "none";
    body.forEach(function(element) {
        element.style.filter = "none";
    });
}

function openmarkmodal() {
    var markmodal = document.getElementById("markmodal");
    markmodal.style.display = "flex";
    var body = document.querySelectorAll("body > *:not(#markmodal)");
    body.forEach(function(element) {
        element.style.filter = "blur(3.5px)";
    });
}

function closemarkmodal() {
    var markmodal = document.getElementById("markmodal");
    markmodal.style.display = "none";
    var body = document.querySelectorAll("body > *:not(#markmodal)");
    body.forEach(function(element) {
        element.style.filter = "none";
    });
}

function marktask() {
    var selectedRow = document.querySelector('.selected');
    if (selectedRow) {
        var taskName = selectedRow.querySelector('.tasktext').textContent;
        var markOption = document.querySelector('input[name="markoption"]:checked');
        if (markOption) {
            var value = markOption.value;
            if (value === "progress") {
                addToProgress(taskName);
            } else if (value === "completed") {
                addToCompleted(taskName);
            }
            closemarkmodal();
        } else {
            alert("Please select an option");
        }
    } else {
        alert("Please select a task");
    }
}

function addToProgress(taskName) {
    var progressTable = document.getElementById('progress').getElementsByTagName('tbody')[0];
    var newRow = progressTable.insertRow();
    var cellTask = newRow.insertCell(0);
    var cellDate = newRow.insertCell(1);
    cellTask.innerHTML = `<span class="tasktext">${taskName}</span>`;
    cellDate.textContent = getCurrentDate();
    var originalTable = document.getElementById('todo').getElementsByTagName('tbody')[0];
    var rows = originalTable.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].querySelector('.tasktext').textContent === taskName) {
            originalTable.deleteRow(i);
            displayUpcomingTasks();
            displayTasksDueToday();
            displayPreviousTasks();
            applyRowColors();
            break;
        }
    }
    newRow.addEventListener('dblclick', function() {
        moveItemToCompleted(taskName);
    });
}

// Function to handle adding a task to the completed table
function addToCompleted(taskName) {
    var completedTable = document.getElementById('completed').getElementsByTagName('tbody')[0];
    var newRow = completedTable.insertRow();
    var cellTask = newRow.insertCell(0);
    var cellDate = newRow.insertCell(1);
    cellTask.innerHTML = `<span class="tasktext">${taskName}</span>`;
    cellDate.textContent = getCurrentDate();
    var originalTable = document.getElementById('todo').getElementsByTagName('tbody')[0];
    var rows = originalTable.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].querySelector('.tasktext').textContent === taskName) {
            originalTable.deleteRow(i);
            displayUpcomingTasks();
            displayTasksDueToday();
            displayPreviousTasks();
            applyRowColors();
            break;
        }
    }
}

// Function to move an item from progress table to completed table on double click
function moveItemToCompleted(taskName) {
    var progressTable = document.getElementById('progress').getElementsByTagName('tbody')[0];
    var completedTable = document.getElementById('completed').getElementsByTagName('tbody')[0];
    var rows = progressTable.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var taskText = rows[i].querySelector('.tasktext');
        if (taskText && taskText.textContent === taskName) {
            var newRow = completedTable.insertRow();
            var cellTask = newRow.insertCell(0);
            var cellDate = newRow.insertCell(1);
            cellTask.innerHTML = `<span class="tasktext">${taskName}</span>`;
            cellDate.textContent = getCurrentDate();
            progressTable.deleteRow(i);
            displayUpcomingTasks();
            displayTasksDueToday();
            displayPreviousTasks();
            applyRowColors();
            break;
        }
    }
}

// Add double-click event listener to rows in the progress table
document.querySelectorAll('#progress tbody tr').forEach(row => {
    row.addEventListener('dblclick', function() {
        var taskName = row.querySelector('.tasktext').textContent;
        moveItemToCompleted(taskName);
    });
});

function getCurrentDate() {
    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    var monthString = month < 10 ? '0' + month : month.toString();
    var dayString = day < 10 ? '0' + day : day.toString();    
    var currentDate = year + '-' + monthString + '-' + dayString;
    return currentDate;
}

function displayUpcomingTasks() {
    var currentDate = new Date();
    var nextWeekDate = new Date();
    nextWeekDate.setDate(currentDate.getDate() + 7); 
    var upcomingTasks = [];
    $('#todo tbody tr').each(function() {
        var dueDate = new Date($(this).find('td:nth-child(2)').text());
        if (dueDate >= currentDate && dueDate <= nextWeekDate) {
            var task = {
                name: $(this).find('.tasktext').text(),
                dueDate: $(this).find('td:nth-child(2)').text()
            };
            upcomingTasks.push(task);
        }
    });
    if (upcomingTasks.length > 0) {
        var tasksHtml = '';
        var tasksToShow = upcomingTasks.slice(0, 3);
        tasksToShow.forEach(function(task) {
            tasksHtml += '<p class="displaydue"><b>Task:</b> ' + task.name + '</p>';
            tasksHtml += '<p><b>Due:</b> ' + task.dueDate + '</p>';
        });
        $('#upcomingTasks').html(tasksHtml);
    } else {
        $('#upcomingTasks').html('<p>No tasks due within the next week</p>');
    }
    applyThemeToDisplayDue();
}

function displayPreviousTasks() {
    var currentDate = new Date();
    var nextWeekDate = new Date();
    var previousTasks = [];
    $('#todo tbody tr').each(function() {
        var dueDate = new Date($(this).find('td:nth-child(2)').text());
        var dueDateNoTime = new Date(dueDate.setHours(0, 0, 0, 0));
        var currentDateNoTime = new Date(currentDate.setHours(0, 0, 0, 0));
        if (dueDateNoTime < currentDateNoTime) {
            var task = {
                name: $(this).find('.tasktext').text(),
                dueDate: $(this).find('td:nth-child(2)').text()
            };
            previousTasks.push(task);
        }
    });
    if (previousTasks.length > 0) {
        var tasksHtml = '';
        previousTasks.forEach(function(task) {
            tasksHtml += '<p class="displaydue"><b>Task:</b> ' + task.name + '</p>';
            tasksHtml += '<p><b>Due:</b> ' + task.dueDate + '</p>';
        });
        $('#previousTasks').html(tasksHtml);
    } else {
        $('#previousTasks').html('<p>Up to date with tasks</p>');
    }
    applyThemeToDisplayDue();
}

function displayTasksDueToday() {
    var currentDate = getCurrentDate().trim();
    var tasksDueToday = [];
    $('#todo tbody tr').each(function() {
        var dueDate = $(this).find('td:nth-child(2)').text().trim();
        if (dueDate === currentDate) {
            var task = {
                name: $(this).find('.tasktext').text(),
                dueDate: dueDate
            };
            tasksDueToday.push(task);
        }
    });
    if (tasksDueToday.length > 0) {
        var tasksHtml = '';
        tasksDueToday.forEach(function(task) {
            tasksHtml += '<p class="displaydue"><b>Task:</b> ' + task.name + '</p>';
        });
        $('#tasksDueToday').html(tasksHtml);
    } else {
        $('#tasksDueToday').html('<p>No tasks due today</p>');
    }
    applyThemeToDisplayDue();
}

//Functions for changing theme
// Function to open the theme modal
function openThemeModal() {
    document.getElementById('themeModal').style.display = 'block';
    var body = document.querySelectorAll("body > *:not(#themeModal)");
    body.forEach(function(element) {
        element.style.filter = "blur(3.5px)";
    });
}

// Function to close the theme modal
function closeThemeModal() {
    document.getElementById('themeModal').style.display = 'none';
    var body = document.querySelectorAll("body > *:not(#themeModal)");
    body.forEach(function(element) {
        element.style.filter = "none";
    });
}

//Themes
var themes = {
    'red': {
        'background-image': 'url(Images/red.jpg)',
        'background-color': 'rgb(255, 228, 230)',
        'header-background-color': 'rgb(255, 200, 200)',
        'button-color': 'rgb(255, 150, 150)',
        'text-color': 'rgb(200, 0, 0)',
        'border-color': 'rgb(200, 0, 0)'
    },
    'green': {
        'background-image': 'url(Images/green.jpg)',
        'background-color': 'rgb(228, 255, 230)',
        'header-background-color': 'rgb(200, 255, 200)',
        'button-color': 'rgb(150, 255, 150)',
        'text-color': 'rgb(0, 200, 0)',
        'border-color': 'rgb(0, 200, 0)'
    },
    'blue': {
        'background-image': 'url(Images/blue.jpg)',
        'background-color': 'rgb(230, 240, 255)',
        'header-background-color': 'rgb(200, 220, 255)',
        'button-color': 'rgb(150, 200, 255)',
        'text-color': 'rgb(0, 0, 200)',
        'border-color': 'rgb(0, 0, 200)'
    },
    'orange': {
        'background-image': 'url(Images/orange.jpg)',
        'background-color': 'rgb(255, 238, 230)',
        'header-background-color': 'rgb(255, 220, 200)',
        'button-color': 'rgb(255, 200, 150)',
        'text-color': 'rgb(200, 100, 0)',
        'border-color': 'rgb(200, 100, 0)'
    },
    'purple': {
        'background-image': 'url(Images/purple.jpg)',
        'background-color': 'rgb(235, 222, 247)',
        'header-background-color': 'rgb(226, 201, 249)',
        'button-color': 'rgb(228, 137, 242)',
        'text-color': 'rgb(134, 113, 154)',
        'border-color': 'rgb(134, 113, 154)'
    }
};

// Function to apply the selected theme
function applyTheme(theme) {
    var selectedTheme = themes[theme];
    document.body.style.backgroundImage = selectedTheme['background-image'];
    document.querySelector('header nav').style.backgroundColor = selectedTheme['header-background-color'];
    document.querySelector('#pombtn').style.backgroundColor = selectedTheme['header-background-color'];
    document.querySelector('.sidebar').style.backgroundColor = selectedTheme['background-color'];
    document.querySelectorAll('.divheader, .h1style').forEach(function(element) {
        element.style.backgroundColor = selectedTheme['header-background-color'];
    });
    document.querySelectorAll('#addtask').forEach(function(element) {
        element.style.backgroundColor = selectedTheme['button-color'];
        element.style.borderColor = selectedTheme['button-color'];
    });
    document.querySelectorAll('.modal .contentmodal').forEach(function(element) {
        element.style.backgroundColor = selectedTheme['background-color'];
        element.style.borderColor = selectedTheme['button-color'];
    });
    document.querySelectorAll('table').forEach(function(element) {
        element.style.borderColor = selectedTheme['border-color'];
    });
    document.querySelectorAll('th').forEach(function(element) {
        element.style.backgroundColor = selectedTheme['background-color'];
    });
    document.querySelectorAll('table tbody').forEach(function(tbody) {
        Array.from(tbody.children).forEach(function(row, index) {
            if (index % 2 === 0) {
                row.style.backgroundColor = selectedTheme['background-color'];
            } else {
                row.style.backgroundColor = 'rgb(255, 255, 255)'; 
            }
        });
    });
    document.querySelectorAll('.displaydue').forEach(function(element) {
        element.style.backgroundColor = selectedTheme['header-background-color'];
    });
    closeThemeModal();
    localStorage.setItem('selectedTheme', theme);
}

// Function to load the selected theme from localStorage on page load
window.onload = function() {
    var savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}

function loadStoredTheme() {
    var storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
        applyTheme(storedTheme);
    }
}

document.querySelectorAll('.theme-btn').forEach(button => {
    button.addEventListener('click', function() {
        var theme = this.dataset.theme;
        applyTheme(theme);
        closeThemeModal();
    });
});

function applyRowColors() {
    var storedTheme = localStorage.getItem('selectedTheme') || 'blue';
    var selectedTheme = themes[storedTheme];
    var todoTable = document.getElementById("todo");
    var proTable = document.getElementById("progress");
    var comTable = document.getElementById("completed");
    var rows = todoTable.querySelectorAll('tbody tr');
    rows.forEach(function(row, index) {
        if (index % 2 === 0) {
            row.style.backgroundColor = selectedTheme['background-color'];
        } else {
            row.style.backgroundColor = 'rgb(255, 255, 255)';
        }
    });
    var rows = proTable.querySelectorAll('tbody tr');
    rows.forEach(function(row, index) {
        if (index % 2 === 0) {
            row.style.backgroundColor = selectedTheme['background-color'];
        } else {
            row.style.backgroundColor = 'rgb(255, 255, 255)';
        }
    });
    var rows = comTable.querySelectorAll('tbody tr');
    rows.forEach(function(row, index) {
        if (index % 2 === 0) {
            row.style.backgroundColor = selectedTheme['background-color'];
        } else {
            row.style.backgroundColor = 'rgb(255, 255, 255)';
        }
    });
}

// Function to set the theme
function setTheme(theme) {
    document.documentElement.className = theme; // Assume themes are defined as classes on the root element
    localStorage.setItem('theme', theme);
}

// Function to get the stored theme
function getStoredTheme() {
    return localStorage.getItem('theme') || 'default-theme'; // default to some theme if none is stored
}

function applyThemeToDisplayDue() {
    const theme = getStoredTheme();
    var storedTheme = localStorage.getItem('selectedTheme') || 'blue';
    var selectedTheme = themes[storedTheme];
    document.querySelectorAll('.displaydue').forEach(function(element) {
        element.style.backgroundColor = selectedTheme['header-background-color'];
    });
}

function updateDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
    const ordinalDay = day + getOrdinalSuffix(day);
    const formattedDate = `${ordinalDay} ${month}, ${year}`;
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    const dateTimeString = `<h3 style="text-align: right;">${formattedDate}<br>${formattedTime}</h3>`;
    document.getElementById('datetime').innerHTML = dateTimeString;
}

// Update the date and time every minute
setInterval(updateDateTime, 60000);

//POMODORO
// Function to open modal
function openModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    var body = document.querySelectorAll("body > *:not(#modal, #countdown-modal)");
    body.forEach(function(element) {
        element.style.filter = "blur(3.5px)";
    });
}

// Function to close modal
function closeModal() {
    var modal = document.getElementById("modal");
    var countdownModal = document.getElementById("countdown-modal");
    modal.style.display = "none";
    countdownModal.style.display = "none";
    var body = document.querySelectorAll("body > *:not(#modal, #countdown-modal)");
    body.forEach(function(element) {
        element.style.filter = "none";
    });
}  

function setPomodoro() {
    var modal = document.getElementById("modal");
    var countdownModal = document.getElementById("countdown-modal");
    var workMinutes = document.getElementById("work-minutes").value;
    var breakMinutes = document.getElementById("break-minutes").value;

    modal.style.display = "none";
    countdownModal.style.display = "block";
}

//Countdown
function startCountdown(minutes, elementId) {
    var display = document.getElementById(elementId);
    var seconds = 60;
    var mins = minutes-1;

    function updateTimer() {
        seconds--;
        if (seconds === 0) {
            mins--;
            seconds = 59;
        }
        display.textContent = (elementId.includes('work') ? 'Work' : 'Break') + " Timer: " + mins + "m " + seconds + "s ";
        if (mins === 0 && seconds === 0) {
            clearInterval(interval);
            display.textContent = "Time's up!";
        }
    }

    var interval = setInterval(updateTimer, 1000);
    return interval; // Return the interval ID
}

var workInterval = null;
var breakInterval = null;
var workTimeLeft = 0;
var breakTimeLeft = 0;

function startWorkTimer() {
    var workMinutes = parseInt(document.getElementById("work-minutes").value);
    var remainingSeconds = workTimeLeft || (workMinutes * 60); // Check if there's remaining time, else start from initial time
    workTimeLeft = remainingSeconds;

    if (workInterval) {
        clearInterval(workInterval);
    }

    workInterval = setInterval(function() {
        if (workTimeLeft <= 0) {
            clearInterval(workInterval);
            document.getElementById("work-timer").textContent = "Work Timer: 0m 0s";
            return;
        }
        
        var minutes = Math.floor(workTimeLeft / 60);
        var seconds = workTimeLeft % 60;
        document.getElementById("work-timer").textContent = "Work Timer: " + minutes + "m " + seconds + "s ";
        workTimeLeft--;
    }, 1000);
}

function startBreakTimer() {
    var breakMinutes = parseInt(document.getElementById("break-minutes").value);
    var remainingSeconds = breakTimeLeft || (breakMinutes * 60); // Check if there's remaining time, else start from initial time
    breakTimeLeft = remainingSeconds;

    if (breakInterval) {
        clearInterval(breakInterval);
    }

    breakInterval = setInterval(function() {
        if (breakTimeLeft <= 0) {
            clearInterval(breakInterval);
            document.getElementById("break-timer").textContent = "Break Timer: 0m 0s";
            return;
        }
        
        var minutes = Math.floor(breakTimeLeft / 60);
        var seconds = breakTimeLeft % 60;
        document.getElementById("break-timer").textContent = "Break Timer: " + minutes + "m " + seconds + "s ";
        breakTimeLeft--;
    }, 1000);
}


function pauseTimer() {
    clearInterval(workInterval);
}

function resetTimer() {
    clearInterval(workInterval);
    var workMinutes = parseInt(document.getElementById("work-minutes").value);
    document.getElementById("work-timer").textContent = "Work Timer: " + workMinutes + "m 00s";
    workTimeLeft = workMinutes * 60;
}

function pauseBreakTimer() {
    clearInterval(breakInterval);
}

function resetBreakTimer() {
    clearInterval(breakInterval);
    var breakMinutes = parseInt(document.getElementById("break-minutes").value);
    document.getElementById("break-timer").textContent = "Break Timer: " + breakMinutes +"m 00s";
    breakTimeLeft = breakMinutes * 60;
}
