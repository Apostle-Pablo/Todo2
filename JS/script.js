// getting all required elements
const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");
// const deleteTask = document.querySelector(".newLiTag button")

/////////////////////////////////////////Data base block///////////////////////////////////////
const initDB = () => { ///Init db
  const db = openDatabase("ToDo", "1.0", "A list of to do items.", 5*1024*1024);
  if(!db){alert("Failed to connect to database.")}
  db.transaction((tx) => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS todo(id integer primary key autoincrement, value, date DEFAULT CURRENT_TIMESTAMP)'); 
    // DEFAULT CURRENT_TIMESTAMP - добавление текущего времени системы в таблицу.
  })
  return db
}

let dbInstance = initDB(); //get instance db

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


// onkeyup event
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
  await setTask(value);
  showTasks();
}


async function showTasks() {
  const tasks = await getTasks();
  console.log(tasks)
  console.log("Call show all tasks")
  todoList.innerHTML = "";
  if(!tasks.length) { //if array length is greater than 0
    deleteAllBtn.classList.remove("active"); //active the delete button
  }
  else {
    deleteAllBtn.classList.add("active"); //unactive the delete button
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const value = document.createElement("div");
    value.innerHTML = task.value
    li.append(value)
    const icon  = document.createElement("span");
    icon.className = "icon"
    icon.innerHTML = "delete";
    icon.addEventListener("click", async () => {
      await deleteTask(task.id);
      showTasks();
    })
    li.append(icon);
    todoList.append(li);
  });

  inputBox.value = ""; //once task added leave the input field blank
}


// Edit


// delete task function

function deleteTask(index) {
  return new Promise((resolve) => {    
    dbInstance.transaction((tx) => {
      tx.executeSql(`DELETE FROM todo where id=${index}`, [], () => resolve());
    })
  })
}

// delete all tasks functions
deleteAllBtn.onclick = async () =>{
  dbInstance.transaction((tx) => {
    tx.executeSql("DROP TABLE todo", null, () => {
      dbInstance = initDB();
      showTasks()
    }) 
  })
}

const dateFormat = () => {
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
  return  dd + '/' + mm + '/' + yyyy;
}

document.getElementById('data').innerHTML = dateFormat();
