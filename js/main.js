//  variables
var searchTaskInput = document.getElementById('searchTaskInput')
var filterTaskInput = document.getElementById('filterTaskInput')
var taskNameInput = document.getElementById('taskNameInput')
var addTaskBtn = document.getElementById('addTaskBtn')
var updateTaskBtn = document.getElementById('updateTaskBtn')
var tasksContainer = document.getElementById('tasksContainer')
var deleteAllBtn = document.getElementById('deleteAllBtn')
var currentTaskIndex 
var tasks = []

// Events
addTaskBtn.addEventListener('click', function() {
    addTask()
})
searchTaskInput.addEventListener('input', function() {
    searchTask()
})

updateTaskBtn.addEventListener('click', function() {
    updateTask()
})

filterTaskInput.addEventListener('change', filterTasks )

deleteAllBtn.addEventListener('click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete all!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('tasks')
            tasks = []
            displayTask(tasks)
            penddingNum()
            completedNum()
            allNum()
            Swal.fire(
                'Deleted!',
                'Your tasks have been deleted.',
                'success'
            )
        }
    })

}
)
// Functions

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
}
else {
    tasks = []
}

function addTask() {
    var taskNameValue = taskNameInput.value.trim()
    var task = {
        id: Date.now(),
        name: taskNameValue,
        completed: false
    }
    if (taskNameValue === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a task name!',
            confirmButtonText: 'OK'
        })
        return
    }
    
    for (var i = 0; i < tasks.length; i++) {
        if (taskNameValue === tasks[i].name) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'This task already exists!',
                confirmButtonText: 'OK'
            })
            taskNameInput.value = ''
            return
        }
    }

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    displayTask (tasks)
    penddingNum()
    completedNum()
    allNum()
    
    
    taskNameInput.value = ''
}

function displayTask (arr) {
    taskHolder = ''
    for (var i = 0; i < arr.length; i++) {
        taskHolder += 
        `
        <div class="task-item ${arr[i].completed ? 'completed' : ''}">
       <div class="d-flex align-items-center gap-3">
         <label class="custom-checkbox">
           <input type="checkbox" ${arr[i].completed ? 'checked' : ''} onclick="completedTask(${i})" />
        <p class="checkmark"><i class="fa fa-check"></i></p>
      </label>
      <span>${arr[i].name}</span>
    </div>
    <div class="task-actions">
      <button onclick ="setFormForUpdate(${i})" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></button>
      <button onclick ="deleteTask(${i})" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>
    </div>
  </div>
  `
    }
    tasksContainer.innerHTML = taskHolder
}

displayTask (tasks)

function deleteTask(index) {
    tasks.splice(index, 1)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    displayTask(tasks)
    penddingNum()
    completedNum()
    allNum()
}

function completedTask(index) {
    tasks[index].completed = !tasks[index].completed
    localStorage.setItem('tasks', JSON.stringify(tasks))
    displayTask(tasks)
    penddingNum()
    completedNum()
    allNum()
}

function searchTask() {
    var searchTaskInputValue = searchTaskInput.value.toLowerCase()
    var searchedTask = []
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].name.toLowerCase().includes(searchTaskInputValue)) {
            searchedTask.push(tasks[i])
        }        
    }
    displayTask(searchedTask)
}

function setFormForUpdate(index){
    currentTaskIndex = index
    taskNameInput.value = tasks[index].name
    addTaskBtn.classList.add('d-none')
    updateTaskBtn.classList.remove('d-none')    
}

function updateTask() {
    tasks[currentTaskIndex].name = taskNameInput.value
    localStorage.setItem('tasks', JSON.stringify(tasks))
    addTaskBtn.classList.remove('d-none')
    updateTaskBtn.classList.add('d-none')
    displayTask(tasks)
    penddingNum()
    completedNum()
    allNum()
    taskNameInput.value = ''
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Task updated successfully!',
        confirmButtonText: 'OK'
    })
}

function filterTasks(){
    var filterTaskInputValue = filterTaskInput.value
    var filteredTasks = []
    for (var i = 0; i < tasks.length; i++) {
        if (filterTaskInputValue === 'all') {
            filteredTasks.push(tasks[i])   
        } else if (filterTaskInputValue === 'completed' && tasks[i].completed == true) {
            filteredTasks.push(tasks[i])
        } else if (filterTaskInputValue === 'pending' && tasks[i].completed == false) {
            filteredTasks.push(tasks[i])
        }
    }   
    displayTask(filteredTasks) 
}

function penddingNum() {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            count++;
        }
    }
    document.getElementById('penddingNum').innerText = count;
}
penddingNum()

function completedNum() {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            count++;
        }
    }
    document.getElementById('completedNum').innerText = count;
}
completedNum()

function allNum() {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed || !tasks[i].completed) {
            count++;
        }
    }
    document.getElementById('allNum').innerText = count;
}
allNum()