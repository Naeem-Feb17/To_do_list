// Get the container where all todo items will be displayed (usually a <ul> or <div> in your HTML)
let todoItemsContainer = document.getElementById("todoItemsContainer");

// Get the "Add" button so we can run code when it is clicked
let addTodoButton = document.getElementById("addTodoButton");

// Get the "Save" button for saving todos to local storage (if present in your HTML)
let saveTodoButton = document.getElementById("saveTodoButton");

// This is the initial list of todos. Each todo is an object with a text and a unique number.
// This function gets the todo list from the browser's local storage
// If there is no saved todo list, it returns an empty array
function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList"); // Get the string from local storage
  let parsedTodoList = JSON.parse(stringifiedTodoList);        // Convert the string to an array
  if (parsedTodoList === null) {
    return []; // If nothing was saved, return an empty list
  } else {
    return parsedTodoList; // Otherwise, return the saved list
  }
}

// Initialize the todo list from local storage (or as an empty array)
let todoList = getTodoListFromLocalStorage();
// This variable keeps track of how many todos are in the list
// It is used to give each new todo a unique number
let todosCount = todoList.length;

// When the save button is clicked, save the current todo list to local storage
saveTodoButton.onclick = function() {
  localStorage.setItem("todoList", JSON.stringify(todoList)); // Save the list as a string
};

// This function is called when a todo's checkbox is clicked
// It toggles the 'checked' style on the label (for strikethrough effect)
// This function is called when the Add button is clicked
// It reads the user's input, creates a new todo, and adds it to the list
function onAddTodo() {
  // Get the input box where the user types the new todo
  let userInputElement = document.getElementById("todoUserInput");
  // Get the text the user typed
  let userInputValue = userInputElement.value;

  // If the input is empty, show an alert and stop
  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  // Increase the count for the next todo so each one is unique
  todosCount = todosCount + 1;

  // Create a new todo object with the user's text and a unique number
  let newTodo = {
    text: userInputValue,    // The text for the new todo
    uniqueNo: todosCount,    // Give it a unique number
    isChecked: false         // New todos are not checked by default
  };
  todoList.push(newTodo);         // Add the new todo to the array
  createAndAppendTodo(newTodo);   // Add the new todo to the UI
  userInputElement.value = "";   // Clear the input box for the next todo
}

// When the Add button is clicked, call the onAddTodo function
// This connects the button in the HTML to the function above
addTodoButton.onclick = function() {
  onAddTodo();
};

// This function is called when a todo's checkbox is clicked
// It toggles the 'checked' style on the label (for strikethrough effect)
// and updates the todo's isChecked property in the array
// Parameters:
//   checkboxId - the id of the checkbox that was clicked
//   labelId - the id of the label to update
//   todoId - the id of the todo item in the array
function onTodoStatusChange(checkboxId, labelId, todoId) {
  // Get the checkbox element (not used here, but could be for more features)
  let checkboxElement = document.getElementById(checkboxId);
  // Get the label element that shows the todo text
  let labelElement = document.getElementById(labelId);
  // Toggle the 'checked' class, which usually adds a line-through style
  labelElement.classList.toggle("checked");

  // Find the index of the todo object in the array
  let todoObjectIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;
    return eachTodoId === todoId; // true if this is the todo we're looking for
  });

  let todoObject = todoList[todoObjectIndex];

  // Toggle the isChecked property of the todo object
  if(todoObject.isChecked === true){
    todoObject.isChecked = false;
  } else {
    todoObject.isChecked = true;
  }
}

// This function is called when the delete icon (trash can) is clicked
// It removes the todo item from the list in the UI and from the array
// Parameter:
//   todoId - the id of the todo item to remove
function onDeleteTodo(todoId) {
  // Find the todo element in the DOM by its id
  let todoElement = document.getElementById(todoId);
  // Remove the todo element from the container (removes it from the page)
  todoItemsContainer.removeChild(todoElement);

  // Find the index of the todo object in the array
  let deleteElementIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;
    return eachTodoId === todoId;
  });

  // Remove the todo from the todo list array
  todoList.splice(deleteElementIndex, 1);
}

// This function creates a new todo item in the UI and adds it to the list
// Parameter:
//   todo - an object with text, uniqueNo, and isChecked properties
function createAndAppendTodo(todo) {
  // Create unique IDs for the todo, its checkbox, and its label
  let todoId = "todo" + todo.uniqueNo;         // Used for the <li> element
  let checkboxId = "checkbox" + todo.uniqueNo; // Used for the <input> checkbox
  let labelId = "label" + todo.uniqueNo;       // Used for the <label>

  // Create the main <li> element for the todo item
  let todoElement = document.createElement("li");
  // Add Bootstrap and custom classes for styling and layout
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  // Set the id so we can find/delete this todo later
  todoElement.id = todoId;
  // Add the todo element to the container in the UI
  todoItemsContainer.appendChild(todoElement);

  // Create the checkbox for marking the todo as done
  let inputElement = document.createElement("input");
  inputElement.type = "checkbox"; // Make it a checkbox
  inputElement.id = checkboxId;    // Set its id
  inputElement.checked = todo.isChecked; // Set the checkbox state based on the todo's isChecked property

  // When the checkbox is clicked, toggle the checked style on the label and update the array
  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId);
  };

  // Add a class for custom styling
  inputElement.classList.add("checkbox-input");
  // Add the checkbox to the todo item
  todoElement.appendChild(inputElement);

  // Create a container for the label and delete icon
  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  // Create the label that shows the todo text
  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId); // Link label to checkbox for accessibility
  labelElement.id = labelId;                     // Set the label's id
  labelElement.classList.add("checkbox-label"); // Add a class for styling
  labelElement.textContent = todo.text;          // Set the text of the label
  if (todo.isChecked === true) {
    labelElement.classList.add("checked");      // Add 'checked' class if the todo is marked as done
  }
  labelContainer.appendChild(labelElement);

  // Create the delete icon (trash can)
  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  // Add Font Awesome classes for the trash can icon
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

  // When the delete icon is clicked, remove the todo from the UI and the array
  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  // Add the delete icon to its container
  deleteIconContainer.appendChild(deleteIcon);
}

// Loop through the todoList array and add each todo to the UI
// This will show all the todos when the page loads
for (let todo of todoList) {
  createAndAppendTodo(todo);
}

