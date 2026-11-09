// ======================================
// 1. VARIABLES
// ======================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");


// ======================================
// 2. ADD TASK FUNCTION
// ======================================

function addTask() {

    // Get input values
    const taskName = taskInput.value.trim();
    const priority = priorityInput.value;

    // Conditional statement
    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    // Create an object
    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: priority,
        completed: false
    };

    // Add object to array
    tasks.push(newTask);

    // Save tasks
    saveTasks();

    // Clear input
    taskInput.value = "";

    // Display tasks
    displayTasks();
}


// ======================================
// 3. DISPLAY TASKS FUNCTION
// ======================================

function displayTasks() {

    // Get search and filter values
    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterInput.value;

    // Filter tasks
    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch = task.name
            .toLowerCase()
            .includes(searchValue);

        const matchesFilter =
            filterValue === "All" ||
            (filterValue === "Completed" && task.completed) ||
            (filterValue === "Pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    // Clear previous HTML
    taskList.innerHTML = "";

    // Check if there are tasks
    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            '<p class="empty-message">No tasks found!</p>';

    }

    // Loop through the array
    filteredTasks.forEach(function(task) {

        // Create task element
        const taskElement = document.createElement("div");

        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        // Create task content
        const taskContent = document.createElement("div");

        const taskTitle = document.createElement("h3");
        taskTitle.textContent = task.name;

        const taskPriority = document.createElement("p");
        taskPriority.textContent = "Priority: " + task.priority;

        taskContent.appendChild(taskTitle);
        taskContent.appendChild(taskPriority);

        // Create buttons
        const buttons = document.createElement("div");
        buttons.className = "task-actions";

        const completeButton = document.createElement("button");

        completeButton.className = "complete-btn";

        completeButton.textContent =
            task.completed ? "Undo" : "Complete";

        completeButton.onclick = function() {
            toggleTask(task.id);
        };

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.onclick = function() {
            deleteTask(task.id);
        };

        // Add buttons to container
        buttons.appendChild(completeButton);
        buttons.appendChild(deleteButton);

        // Add everything to task element
        taskElement.appendChild(taskContent);
        taskElement.appendChild(buttons);

        // Display on webpage
        taskList.appendChild(taskElement);

    });

    // Update statistics
    updateStatistics();
}


// ======================================
// 4. COMPLETE TASK FUNCTION
// ======================================

function toggleTask(id) {

    // Find the selected task
    const selectedTask = tasks.find(function(task) {
        return task.id === id;
    });

    // Change completion status
    if (selectedTask) {
        selectedTask.completed = !selectedTask.completed;
    }

    saveTasks();

    displayTasks();
}


// ======================================
// 5. DELETE TASK FUNCTION
// ======================================

function deleteTask(id) {

    // Remove selected task
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();

    displayTasks();
}


// ======================================
// 6. UPDATE STATISTICS
// ======================================

function updateStatistics() {

    // Get total number of tasks
    const total = tasks.length;

    // Count completed tasks
    const completed = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    // Calculate remaining tasks
    const remaining = total - completed;

    // Display results
    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    remainingTasks.textContent = remaining;
}


// ======================================
// 7. LOCAL STORAGE
// ======================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ======================================
// 8. EVENT LISTENERS
// ======================================

// Add task when button is clicked
addButton.addEventListener("click", addTask);

// Search tasks while typing
searchInput.addEventListener("input", displayTasks);

// Filter tasks
filterInput.addEventListener("change", displayTasks);

// Add task when Enter is pressed
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// ======================================
// 9. INITIAL DISPLAY
// ======================================

// Display saved tasks when page opens
displayTasks();
