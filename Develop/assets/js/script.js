// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskTitle = $('#task-title');
const taskDate = $('#task-date');
const taskDescription = $('#task-desc');
const taskForm = $('#task-form');
const taskDisplay = $('#task-display');
const dialogForm = $('#dialog-form')

// Todo: create a function to generate a unique task id
function generateTaskId(nextId = []) {
let id = '';
id = date.now().toString(36) + Math.random().toString(36).substring(2,7);
while (nextId.includes(id)) {
  id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

nextId.push(id);
localStorage.setItem('id', JSON.stringify(nextId));
return id;
}
// Todo: create a function to create a task card
function createTaskCard(task) {
const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id);

const cardHeaderEl = $('<div>').addClass('card-header h4').text(task.name);

const cardBodyEl = $('<div>').addClass('card-body');

const cardDescriptionEl = $('<p>').addClass('card-text').text(task.description);

const cardDateEl = $('<p>').addClass('card-text.text').text(task.dueDate);

const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id',task.id);

if (task.dueDate && task.status !== 'complete') {
  const now = dayjs();
  const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
  const isDueToday = now.isSame(taskDueDate, 'day');
  const isOverdue = now.isAfter(taskDueDate);
  if (isDueToday) {
    taskCard.addClass('bg-warning text-white');
  } else if (isOverdue) {
    taskCard.addClass('bg-danger text-white');
    cardDeleteBtn.addClass('border-light');
  }
}

cardDescriptionEl.appendTo(cardBodyEl);
cardDateEl.appendTo(cardBodyEl);
cardDeleteBtn.appendTo(cardBodyEl);

cardHeaderEl.appendTo(taskCard);
cardBodyEl.appendTo(taskCard);

return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  if (!taskList) {
    taskList = [];
  }
  const todoList = $('#nys-cards');
  todoList.empty();
  
  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#complete-cards');
  doneList.empty();

  taskList.forEach(function(task) {
    switch (task.status) {
      case 'not-yet-started':
        todoList.append(createTaskCard(task));
        break;
        case 'in-progress':
        inProgressList.append(createTaskCard(task));
        break;
        case 'complete':
          doneList.append(createTaskCard(task));
          break;
          default:
            console.error('invalid task status:', task.status);
    }
  });

  $('.draggable').draggable({
    opacity: 0.5,
    zIndex: 1,
    helper: function (e) {
      const original = $(e.target).hasClass('ui-draggable')
      ? $(e.target)
      : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

  event.preventDefault();
  const fieldCheck = $({}).add(taskTitle).add(taskDate).add(taskDescription), tips = $('.validateTips');

  function checkInput(input) {
    if(input.val() === '') {
      input.addClass('ui-state-error');
      tips
      .text('Please ensure all inputs are filled.')
      .addClass('ui-state-highlight');
      setTimeout(function() {
        tips.removeClass('ui-state-highlight', 1500 );
      }, 500);
      return false;
    } else {
      return true;
    }
  }

  let valid = true;
  fieldCheck.removeClass("ui-state-error");
  valid = valid && checkInput(taskTitle);
  valid = valid && checkInput(taskDate);
  valid = valid && checkInput(taskDescription);

  if (valid) {
    const newTask = {
      id: generateTaskId(),
      name: taskTitle.val(),
      dueDate: taskDate.val(),
      description: taskDescription.val(),
      status: 'not-yet-started',
    }

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    taskTitle.val('');
    taskDate.val('');
    taskDescription.val('');
    dialogForm.dialog('close');

    renderTaskList();
  }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
const taskId = $(this).data('task-id');

taskList = taskList.filter(task => task.id !== taskId);

nextId = nextId.filter(id => id !== taskId);

localStorage.setItem('tasks', JSON.stringify(taskList));
localStorage.setItem('id', JSON.stringify(nextId));

renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
