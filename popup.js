document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(task => {
      tasks.push({
        text: task.querySelector('.task-text').textContent,
        completed: task.classList.contains('completed')
      });
    });
    chrome.storage.local.set({ tasks });
  }

  function addTask(text, completed = false) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (completed) {
      li.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function() {
      li.classList.toggle('completed');
      if (li.classList.contains('completed')) {
        setTimeout(() => {
          li.remove();
          saveTasks();
        }, 2000);
      }
      saveTasks();
    });

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = text;

    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.appendChild(li);
  }

  addTaskButton.addEventListener('click', function() {
    if (taskInput.value.trim()) {
      addTask(taskInput.value.trim());
      saveTasks();
      taskInput.value = '';
    }
  });

  chrome.storage.local.get('tasks', function(data) {
    if (data.tasks) {
      data.tasks.forEach(task => addTask(task.text, task.completed));
    }
  });
});
