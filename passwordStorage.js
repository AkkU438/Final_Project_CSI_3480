let todos = [];

function renderTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    if (todo.editing) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = todo.text;
      input.onkeydown = (e) => {
        if (e.key === 'Enter') updateTodo(index, input.value);
      };
      li.appendChild(input);
    } else {
      const span = document.createElement('span');
      span.textContent = todo.text;
      li.appendChild(span);
    }

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = todo.completed ? 'Undo' : 'Done';
    toggleBtn.onclick = () => toggleCompleted(index);
    actions.appendChild(toggleBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = todo.editing ? 'Save' : 'Edit';
    editBtn.onclick = () => {
      if (todo.editing) {
        const input = li.querySelector('input');
        updateTodo(index, input.value);
      } else {
        toggleEdit(index);
      }
    };
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(index);
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    list.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text) {
    todos.push({ text, completed: false, editing: false });
    input.value = '';
    renderTodos();
  }
}

function toggleCompleted(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}

function toggleEdit(index) {
  todos[index].editing = !todos[index].editing;
  renderTodos();
}

function updateTodo(index, newText) {
  todos[index].text = newText;
  todos[index].editing = false;
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
}

renderTodos();