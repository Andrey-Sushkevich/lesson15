import { Local } from "./localStorage.js";
import { input } from "./components/input.js";
import { Button } from "./components/buttons.js";
import { Paragraph } from "./components/paragraph.js";

let container = document.createElement("div");
let header = document.createElement("h1");
document.body.classList.add("container");

let todos = Local.todos || [];

header.append("TODO LIST/tms edition");
container.append(header);

const inputContainer = document.createElement("div");

let inputButton = new Button("Add");

let inputButtonOnClick = function () {
  if (input.value.trim().length > 2) {
    addToList(input.value);
    input.value = "";
    inputButton.addClass("button-active");

    setTimeout(() => {
      inputButton.removeClass("button-active");
    }, 1000);
  } else {
    alert("Введите больше чем 2 символа");
  }
};

inputButton.onClick(inputButtonOnClick);

let ol = document.createElement("ol");

function addToList(text) {
  let id = "_" + Math.random().toString(36).substr(2, 9);
  let obj = { text, id, done: false };
  todos.push(obj);

  Local.todos = todos;

  renderListItem(obj);
}

inputContainer.append(input, inputButton.getElement());
header.after(inputContainer);
inputContainer.after(ol);
document.body.append(container);

todos.forEach((elem) => {
  renderListItem(elem);
});

function renderListItem(listItemObj) {
  let { id, text, done } = listItemObj;

  let li = document.createElement("li");
  //создать класс Paragraph
  let p = document.createElement("p");
  p.append(text);
  p.className = "todo-text";
  //использовать класс Button
  let removeButton = document.createElement("button");
  removeButton.append("Remove");

  removeButton.onclick = function () {
    let filteredTodos = todos.filter((elem) => {
      if (elem.id === id) {
        return false;
      }

      return true;
    });

    todos = [...filteredTodos];
    li.remove();
    Local.todos = todos;
  };
  //использовать класс Button
  let doneButton = document.createElement("button");

  if (done) {
    doneButton.append("To Do");
    p.classList.add("text-done");
  } else {
    doneButton.append("Done");
  }

  doneButton.onclick = (event) => {
    event.stopPropagation();

    if (p.matches(".text-done")) {
      p.classList.remove("text-done");
      doneButton.innerHTML = "Done";

      todos.forEach((elem, index, arr) => {
        if (elem.id === id) {
          arr[index].done = false;
        }
      });
    } else {
      p.classList.add("text-done");
      doneButton.innerHTML = "To Do";

      todos.forEach((elem, index, arr) => {
        if (elem.id === id) {
          arr[index].done = true;
        }
      });
    }

    Local.todos = todos;
    console.log(todos);
  };

  let liContainer = document.createElement("div");
  liContainer.classList.add("wrapper");

  liContainer.append(doneButton, p, removeButton);
  li.append(liContainer);
  li.id = id;
  ol.append(li);
}

ol.addEventListener("click", (event) => {
  let path = event.path;

  let li = [...path].find((item) => item.localName === "li");

  if (li) {
    li.classList.toggle("li-active");
  }
});
//переписать используя класс Button
let doneAllButton = document.createElement("button");
doneAllButton.append("Done All");

doneAllButton.addEventListener("click", () => {
  let allSelectedItems = document.querySelectorAll(".li-active");
  let selectedItemsArr = [...allSelectedItems];

  selectedItemsArr.forEach((item) => {
    let currentIndex = todos.findIndex((todo) => todo.id === item.id);
    todos[currentIndex].done = !todos[currentIndex].done;

    item.classList.remove("li-active");

    let p = item.querySelector("p");
    p.classList.toggle("text-done");

    let buttons = item.querySelectorAll("button");
    let buttonsArr = [...buttons];

    let doneButton = buttonsArr.find(
      (item) => item.innerText === "Done" || item.innerText === "To Do"
    );

    if (doneButton.innerHTML === "Done") {
      doneButton.innerHTML = "To Do";
    } else {
      doneButton.innerHTML = "Done";
    }
  });

  Local.todos = todos;
});
//переписать используя класс Button
let removeAllButton = document.createElement("button");
removeAllButton.append("Remove All");

removeAllButton.addEventListener("click", () => {
  let allSelectedItems = document.querySelectorAll(".li-active");
  let selectedItemsArr = [...allSelectedItems];

  selectedItemsArr.forEach((item) => {
    let filteredTodos = todos.filter((todo) => todo.id !== item.id);
    todos = filteredTodos;
    item.remove();
  });

  Local.todos = todos;
});

container.append(doneAllButton);
container.append(removeAllButton);
