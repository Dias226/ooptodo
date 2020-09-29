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
      if (target.closest(".todo-item").key === item.key) {
        let animateId;
        let count = 0;
        target.closest(".todo-item").style.position = "relative";
        const animate = () => {
          animateId = requestAnimationFrame(animate);
          count++;
          if (count <= 30) {
            target.closest(".todo-item").style.left = count * 20 + "px";
          } else {
            cancelAnimationFrame(animateId);
            this.todoData.delete(item.key);
            this.render();
          }
        };
        animateId = requestAnimationFrame(animate);
      }
    });
  }

  completedItem(target) {
    this.todoData.forEach(item => {
      if (target.closest(".todo-item").key === item.key) {
        let animateId;
        let count = 0;
        target.closest(".todo-item").style.position = "relative";
        const animate = () => {
          animateId = requestAnimationFrame(animate);
          count++;
          if (count <= target.closest(".todo-item").offsetTop && item.completed) {
            target.closest(".todo-item").style.bottom = count * 12 + "px";
          } else if (count <= 12 && !item.completed) {
            target.closest(".todo-item").style.top = count * 12 + "px";
          } else {
            cancelAnimationFrame(animateId);
            item.completed = !item.completed;
            this.render();
          }
        };
        animateId = requestAnimationFrame(animate);
      }
    });
  }

  editItem(target) {
    this.todoData.forEach(item => {
      if (target.closest(".todo-item").key === item.key) {
        target.closest(".todo-item").querySelector("span").setAttribute("contenteditable", true);
        const menu = document.createElement("button");
        menu.style.cssText = `background-color: black;
                opacity: 0;
                position: relative;
                color: #fff;
                border:none;
                cursor:pointer;
                height:40px;
                border-radius: 5px;`;
        menu.textContent = "Применить";
        target.closest(".todo-item").before(menu);
        target.style.pointerEvents = "none";
        target.closest(".todo-item").style.cssText = `position: relative;`;
        let count = 0;
        let animateEditId;

        const animateEdit = () => {
          animateEditId = requestAnimationFrame(animateEdit);
          count += 0.05;
          console.log();
          if (count <= 1) {
            menu.style.opacity = count;
            target.closest(".todo-item").style.opacity = count * 20 + "px";
          } else {
            cancelAnimationFrame(animateEditId);
          }
        };
        animateEditId = requestAnimationFrame(animateEdit);

        menu.addEventListener("click", () => {
          item.value = target.closest(".todo-item").querySelector("span").textContent.trim();
          if (item.value === "") {
            alert("Введите что-нибудь!");
            target.closest(".todo-item").querySelector("span").setAttribute("contenteditable", true);
            return;
          }
          target.closest(".todo-item").setAttribute("contenteditable", false);
          menu.parentNode.removeChild(menu);
          target.style.pointerEvents = !"none";
          this.render();
        });
      }
    });
  }

  handler() {
    this.todoContainer.addEventListener('click', event => {
      if (event.target.matches('.todo-remove')) {
        this.deleteItem(event.target);
      } else if (event.target.matches('.todo-complete')) {
        this.completedItem(event.target);
      } else if (event.target.matches(".todo-edit")) {
        this.editItem(event.target);
      }
    });
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();