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

// ========== VALIDACIJA UNOSA ========== //
function unesi() {
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Sva polja moraju biti popunjena!");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Unesite ispravan email.");
    return;
  }

  users.push(new User(username, email, password));
  ispisTablice();
  spremi();
  clearForm();
}

function clearForm() {
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

// ========== ISPIŠI TABLICU ========== //
function ispisTablice(podaci = users) {
  let tablica = document.getElementById("tablica");
  tablica.innerHTML = `<tr>
    <th>RB</th>
    <th onclick="sortirajPoImenu()" style="cursor:pointer">Username ⬍</th>
    <th>Email</th>
    <th>Password</th>
    <th>Edit</th>
    <th>Delete</th>
  </tr>`;

  for (let i = 0; i < podaci.length; i++) {
    tablica.innerHTML += `<tr>
      <td>${i+1}</td>
      <td>${podaci[i].username}</td>
      <td>${podaci[i].email}</td>
      <td>${podaci[i].password}</td>
      <td><button onclick='uredi(${i})'>✏️</button></td>
      <td><button onclick='brisi(${i})'>🗑️</button></td>
    </tr>`;
  }
}

function spremi(){
  localStorage.setItem("users", JSON.stringify(users));
}

function brisi(index){
  users.splice(index, 1);
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
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Sva polja moraju biti popunjena!");
    return;
  }

  users[indexZaIzmjenu].username = username;
  users[indexZaIzmjenu].email = email;
  users[indexZaIzmjenu].password = password;

  ispisTablice();
  spremi();
  document.getElementById("unesi").innerText = "Sign in";
  document.getElementById("unesi").setAttribute("onclick", "unesi()");
  clearForm();
  indexZaIzmjenu = null;
}

// ========== TOGGLE LOZINKE ========== //
function togglePassword() {
  let pw = document.getElementById("password");
  pw.type = pw.type === "password" ? "text" : "password";
}

// ========== SORTIRANJE PO USERNAMEU ========== //
function sortirajPoImenu() {
  users.sort((a, b) => a.username.localeCompare(b.username));
  ispisTablice();
}

// ========== UVOZ PODATAKA ========== //
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
  xhttp.open("GET", "accountData.xml", true);
  xhttp.send();
}

// ========== IZVOZ U JSON ========== //
function exportJSON() {
  const blob = new Blob([JSON.stringify(users, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.json";
  a.click();
  URL.revokeObjectURL(url);
}

function prikaziPodatke() {
  document.getElementById("dataSection").style.display = "block";
}
