class User {
  constructor(username, email, password){
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

let users = [];
let users_str = localStorage.getItem("users");
if(users_str != null) {
  let parseData = JSON.parse(users_str);
  users = parseData.map(obj => new User(obj.username, obj.email, obj.password));
}
let indexZaIzmjenu = null;
ispisTablice();

function unesi() {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  users.push(new User(username, email, password));
  ispisTablice();
  spremi();
}

function ispisTablice() {
  let tablica = document.getElementById("tablica");
  tablica.innerHTML = "<tr><th>RB</th><th>Username</th><th>Email</th><th>Password</th><th>Edit</th><th>Delete</th></tr>";
  for(let i = 0; i < users.length; i++) {
    tablica.innerHTML += `<tr>
      <td>${i+1}</td>
      <td>${users[i].username}</td>
      <td>${users[i].email}</td>
      <td>${users[i].password}</td>
      <td><button onclick='uredi(${i})'>✏️</button></td>
      <td><button onclick='brisi(${i})'>🗑️</button></td>
    </tr>`;
  }
}

function spremi(){
  localStorage.setItem("users", JSON.stringify(users));
}

function brisi(index){
  users.splice(index,1)
  ispisTablice();
  spremi();
}

function uredi(index){
  document.getElementById("username").value = users[index].username;
  document.getElementById("email").value = users[index].email;
  document.getElementById("password").value = users[index].password;
  indexZaIzmjenu = index;
  document.getElementById("unesi").innerText = "Izmjeni";
  document.getElementById("unesi").setAttribute("onclick", "izmjeni()");
}

function izmjeni(){
  if(indexZaIzmjenu != null){
    users[indexZaIzmjenu].username = document.getElementById("username").value;
    users[indexZaIzmjenu].email = document.getElementById("email").value;
    users[indexZaIzmjenu].password = document.getElementById("password").value;
  }
  ispisTablice();
  spremi();
  document.getElementById("unesi").innerText = "Sign in";
  document.getElementById("unesi").setAttribute("onclick", "unesi()");
  indexZaIzmjenu = null;
}

function uvezi() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.responseText,"text/xml");
      
      let userNodes = xmlDoc.getElementsByTagName("user");
      for(let i = 0; i < userNodes.length; i++){
        let username = userNodes[i].getElementsByTagName("username")[0].textContent;
        let email = userNodes[i].getElementsByTagName("email")[0].textContent;
        let password = userNodes[i].getElementsByTagName("password")[0].textContent;
        
        users.push(new User(username, email, password));
      }
      ispisTablice();
      spremi();
    }
  };
  xhttp.open("GET", "accountData.xml", true); // You need to create this XML
  xhttp.send();
}
