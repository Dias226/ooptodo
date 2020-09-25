'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.todoContainer = document.querySelector(todoContainer);
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = item.key;
    li.insertAdjacentHTML('beforeend', `
        <span class = "text-todo" > ${item.value} </span> 
        <div class = "todo-buttons" >
            <button class = "todo-edit" > </button>
            <button class = "todo-remove" > </button> 
            <button class = "todo-complete" > </button> 
        </div>
    `);

    if (item.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(event) {
    event.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else {
      alert('Пустое дело добавлять нельзя!');
    }
    this.input.value = '';
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.handler();
    this.render();
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(target) {
    this.todoData.forEach(item => {
      if (target.closest('.todo-item').key === item.key) {
        this.todoData.delete(item.key);
      }
    });
    this.render();
  }

  completedItem(target) {
    this.todoData.forEach(item => {
      if (target.closest('.todo-item').key === item.key) {
        item.completed = !item.completed;
      }
    });
    this.render();
  }

  handler() {
    this.todoContainer.addEventListener('click', event => {
      if (event.target.matches('.todo-remove')) {
        this.deleteItem(event.target);
      } else if (event.target.matches('.todo-complete')) {
        this.completedItem(event.target);
      }
    });
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();