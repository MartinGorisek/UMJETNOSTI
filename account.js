class Ucenik {
  constructor(prezime, ime, godiste){
    this.prezime = prezime;
    this.ime = ime;
    this.godiste = godiste;
  }
  dob() {
    return 2025 - this.godiste;
  }
}

let ucenici = [];
let ucenici_str = localStorage.getItem("ucenici");
if(ucenici_str != null) {
  let parseData = JSON.parse(ucenici_str);
  ucenici = parseData.map(obj => new Ucenik(obj.prezime, obj.ime, obj.godiste));
}
$("#izmjeni").hide();
let indexZaIzmjenu = null;
ispisTablice();


function unesi() {
  let prezime = document.getElementById("prezime").value;
  let ime = document.getElementById("ime").value;
  let godiste = document.getElementById("godiste").value;
  ucenici.push(new Ucenik(prezime, ime, godiste));
  ispisTablice();
  spremi();
}

function ispisTablice() {
  let tablica = document.getElementById("tablica");
  tablica.innerHTML = "<tr><th>RB</th><th>Prezime</th><th>Ime</th><th>Godište</th><th>Dob</th><th>U</th><th>B</th></tr>";
  for(let i = 0; i < ucenici.length; i++) {
    tablica.innerHTML += "<tr><td>"+(i+1)+"</td><td>"+ucenici[i].prezime+"</td><td>"+ucenici[i].ime+"</td><td>"+ucenici[i].godiste+"</td><td>"+ucenici[i].dob()+"</td><td><img onclick='uredi("+ i +")' src='https://assets.onecompiler.app/42t25vc6w/43d5gaadf/edit_icon.png'></td><td><img onclick='brisi("+ i +")' src='https://assets.onecompiler.app/42t25vc6w/43d5gaadf/delete_icon.png'></td></tr>";
  }
}
function spremi(){
  localStorage.setItem("ucenici", JSON.stringify(ucenici));
}

function brisi(index){
  ucenici.splice(index,1)
  ispisTablice();
  spremi();
}
function uvezi() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.responseText,"text/xml");
      
      let ucenikNodes = xmlDoc.getElementsByTagName("ucenik");
      for(let i = 0; i < ucenikNodes.length; i++){
        let prezime = ucenikNodes[i].getElementsByTagName("prezime")[0].textContent;
        let ime = ucenikNodes[i].getElementsByTagName("ime")[0].textContent;
        let godiste = ucenikNodes[i].getElementsByTagName("godiste")[0].textContent;
        
        ucenici.push(new Ucenik(prezime, ime, parseInt(godiste)));
      }
      ispisTablice();
      spremi();
    }
  };
  xhttp.open("GET", "podatci.html", true);
  xhttp.send();
}

function uredi(index){
  $("#unesi").hide();
  $("#izmjeni").show();
  
  $("#prezime").val(ucenici[index].prezime);
  $("#ime").val(ucenici[index].ime);
  $("#godiste").val(ucenici[index].godiste);
  
  indexZaIzmjenu = index;
}
function izmjeni(){
  $("#unesi").show();
  $("#izmjeni").hide();

  if(indexZaIzmjenu != null){
    ucenici[indexZaIzmjenu].prezime = $("#prezime").val();
    ucenici[indexZaIzmjenu].ime = $("#ime").val();
    ucenici[indexZaIzmjenu].godiste = $("#godiste").val();
  } 
  ispisTablice();
  spremi();
}