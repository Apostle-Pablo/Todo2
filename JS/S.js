// getting all required elements
const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

/////////////////////////////////////////Data base block///////////////////////////////////////
const initDB = () => { ///Init db
  const db = openDatabase("ToDo", "1.0", "A list of to do items.", 5*1024*1024);
  if(!db){alert("Failed to connect to database.")}
  db.transaction((tx) => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS todo(id integer primary key autoincrement, value, date)');
  })
  return db
}

const dbInstance = initDB(); //get instance db

function getTasks() { //propmise function get tasks
  return new Promise((resolve) => {
    dbInstance.transaction((tx) => {
      tx.executeSql("SELECT * FROM todo", [], (tx, result) => {
          const tasks = [];
          for(task of result.rows) tasks.push(task)
          return resolve(tasks)
      })
    })
  })
}

function setTask(value) { //promise function set task
  return new Promise((resolve, reject) => {
    dbInstance.transaction((tx) => {
      tx.executeSql("INSERT INTO todo(value) VALUES(?)", [value], () => resolve())
    })
  })
}
////////////////////////////////////////////////////////////////////////////


// onkeyup event          функция кторая делает кнопку добавть(плюс) активной.
inputBox.onkeyup = ()=>{
  let userEnteredValue = inputBox.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  }else{
    addBtn.classList.remove("active"); //unactive the add button
  }
}

showTasks(); //calling showTask function

addBtn.onclick = async ()=>{ //when user click on plus icon button
  const value = inputBox.value; //getting input field value
    console.log(value)
  await setTask(value);
  showTasks();
}



async function showTasks() {
  const tasks = await getTasks();
  if(!tasks.length) { //if array length is greater than 0
    deleteAllBtn.classList.add("active"); //active the delete button
  }
  else {
    deleteAllBtn.classList.remove("active"); //unactive the delete button
  }

  let newLiTag = "";
  tasks.forEach((task, index) => {
    newLiTag += `<li>${task.value}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;  // add li

  });
  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
  inputBox.value = ""; //once task added leave the input field blank
}

// Edit


// delete task function
function deleteTask(index){
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1); //delete or remove the li
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks(); //call the showTasks function
}

// delete all tasks function
deleteAllBtn.onclick = ()=>{
  listArray = []; //empty the array
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //set the item in localstorage
  showTasks(); //call the showTasks function
}

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1 ;
let yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd
}
if (mm < 10) {
  mm = '0' + mm
}
today = dd + '/' + mm + '/' + yyyy;
document.getElementById('data').innerHTML=today;


