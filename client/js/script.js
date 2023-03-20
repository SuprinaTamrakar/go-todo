const baseEndpoint = "http://localhost:8080/api";
const endpoint = baseEndpoint + "/task";
const taskList = document.getElementById("task-list");
const addForm = document.getElementById("add-form");
const addInput = document.getElementById("add-input");
const addBtn = document.getElementById("add-btn");
const deleteBtn = document.getElementById("delete-all-btn");

window.addEventListener("load", getAllTask);
addBtn.addEventListener("click", addTask);
deleteBtn.addEventListener("click", deleteAllTask);

// Make a GET request to the API endpoint
function getAllTask(event) {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      // Loop through the data and insert it into the table
      data.forEach((task, index) => {
        const row = document.createElement("tr");
        // Add a class based on the status of the task
        row.classList.add(task.status ? "done" : "pending");
        row.innerHTML = `
				<td>${index + 1}</td>
				<td>${task.task}</td>
				<td>
            <span class="task-status ${task.status ? "done" : "pending"}">
              ${task.status ? "DONE" : "PENDING"}
            </span>
            <div class="conversion-buttons">
            ${
              task.status
                ? `<button class="btn btn-success convert-button" data-status="pending" onclick="undoTask('${task._id}')">Convert to Pending</button>`
                : `<button class="btn btn-warning convert-button" data-status="done" onclick="completeTask('${task._id}')">Convert to Done</button>`
            }
            </div>
        </td> 
         <td>
         <button onclick="editTask('${task._id}')">Edit</button>
				 <button onclick="deleteTask('${task._id}')">Delete</button>
         </td>
			`;
        taskList.appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

// Add task to the server
function addTask(event) {
  event.preventDefault();
  const taskText = addInput.value.trim();
  if (taskText) {
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({ task: taskText }),
    })
      .then((response) => {
        if (response.ok) {
          // Reload the window to show the new task
          location.reload();
        } else {
          throw new Error("Failed to add task");
        }
      })
      .catch((error) => console.error(error));
  }
}

function editTask(id) {
  // Find the task with the given id in the data array
  fetch(endpoint + "/" + id)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (!data) {
        console.error(`Task with id ${id} not found`);
        return;
      }

      // Populate the edit modal with the task data
      const editModal = document.getElementById("editModal");
      const editForm = document.getElementById("editForm");
      const editInput = document.getElementById("editInput");
      editInput.value = data.task;

      // Show the edit modal
      editModal.style.display = "block";

      // Handle form submission
      editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskText = editInput.value.trim();
        if (taskText) {
          fetch(baseEndpoint + "/updateTask/" + id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ task: taskText }),
          })
            .then((response) => {
              if (response.ok) {
                // Reload the window to show the updated task
                location.reload();
              } else {
                throw new Error("Failed to update task");
              }
            })
            .catch((error) => console.error(error));
        }
      });
    })
    .catch((error) => console.error(error));
}

function deleteTask(taskId) {
  const confirmation = confirm("Are you sure you want to delete this task?");
  if (confirmation) {
    const deleteEndpoint = baseEndpoint + "/deleteTask/" + taskId;
    fetch(deleteEndpoint, {
      method: "DELETE",
    })
      .then(() => {
        // Reload the window to update the task list
        location.reload();
      })
      .catch((error) => console.error(error));
  }
}

function undoTask(taskId) {
  const undoEndpoint = baseEndpoint + "/undoTask/" + taskId;
  fetch(undoEndpoint, {
    method: "PUT",
  })
    .then(() => {
      // Reload the window to update the task list
      location.reload();
    })
    .catch((error) => console.error(error));
}

function completeTask(taskId) {
  const completeEndpoint = endpoint + "/" + taskId;
  fetch(completeEndpoint, {
    method: "PUT",
  })
    .then(() => {
      // Reload the window to update the task list
      location.reload();
    })
    .catch((error) => console.error(error));
}

function deleteAllTask() {
  const confirmation = confirm(
    "Are you sure you want to delete all your tasks?"
  );
  if (confirmation) {
    const deleteAllEndpoint = baseEndpoint + "/deleteAllTask";
    fetch(deleteAllEndpoint, {
      method: "DELETE",
    })
      .then(() => {
        // Reload the window to update the task list
        location.reload();
      })
      .catch((error) => console.error(error));
  }
}
