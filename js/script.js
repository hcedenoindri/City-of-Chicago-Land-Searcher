$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

document.querySelectorAll(".hidden").forEach( (page) => {
  page.style.display='none';
});

function show(elem) {
  let shown = document.querySelector('.shown');
  let hidden = document.querySelector('#' + elem);
  if (shown == hidden) {
      return;
  }

  shown.classList.remove("shown");
  hidden.classList.remove("hidden");
  shown.classList.add("hidden");
  hidden.classList.add("shown");

  document.querySelector(".shown").style.display='block';

  document.querySelectorAll(".hidden").forEach( (page) => {
    page.style.display='none';
  });
}

function show_helper(cont) {
  let active = document.querySelector('.active');
  active.classList.remove("active");
  cont.classList.add("active");    
}

document.querySelectorAll('.nav-link').forEach( (cont) => {
  let elem = cont.getAttribute("value");
  cont.addEventListener('click', handler = () => {
    let active = document.querySelector('.active');
    active.classList.remove("active");
    cont.classList.add("active");    
    show(elem);
  });
});

// form
fetch("https://data.cityofchicago.org/resource/aksk-kvfp.json")
.then ( (response) => {return response.json() })
.then ( (result) => {
  for (let field of Object.keys(result[0])) {
    if (field[0] == ":") {
      continue;
    }
    if (field == "location") {
      continue;
    }
    let opt = document.createElement("option");
    opt.innerText = field;
    document.querySelector("#fields").append(opt);
    
    let example = document.createElement('a');
    example.innerHTML = field + ": " + result[0][field] + ".<br>";
    document.querySelector("#form").append(example);

  }
  let br = document.createElement("br");
  document.querySelector("#form").append(br);

});

// map
let map;
function initMap() {
    let mapProp = {
        center: new google.maps.LatLng(41.88145468743958, -87.63328143107563),
        zoom: 11,
    };
    map = new google.maps.Map(document.querySelector('#googleMap'), mapProp);
}

// data
let results = document.querySelector('#results');
let row = document.querySelector("#resultsRow");
fetch("https://data.cityofchicago.org/resource/aksk-kvfp.json")
.then ( (response) => {return response.json() })
.then ( (result) => {

  results.querySelector('.row').remove();
  for( let land of result) {
    let new_card = row.cloneNode(true);
    let card_body = new_card.querySelector('.card-body');
    card_body.querySelector(".card-title").innerHTML = land.community_area_name + " - " + land.pin;
    card_body.querySelector(".card-subtitle").innerHTML = land.address + " - " + land.sq_ft; 
    card_body.querySelector(".card-text").innerHTML = land.pin;
    results.append(new_card);

    let marker = new google.maps.Marker({ 
      position: new google.maps.LatLng(land.latitude, land.longitude)
    });
    marker.setMap(map);

  }

});

let map_ref = document.querySelector('#map-ref');
map_ref.addEventListener('click', handler = () => {
  let cont = document.querySelectorAll('.nav-link')[3];
  let elem = cont.getAttribute("value");
  let active = document.querySelector('.active');
  active.classList.remove("active");
  cont.classList.add("active");    
  show(elem);
});



let endpoint = "https://data.cityofchicago.org/resource/aksk-kvfp.json";
document.querySelector("#search").addEventListener ("click", (e) => {
  let inp = document.querySelector('#find');
  let select = document.querySelector('#fields');
  inp.setAttribute("name", select.value);

  let f = document.querySelector("#form-data");
  let fd = new FormData(f);
  let sp = new URLSearchParams(fd);
  let url = endpoint +  "?" + sp.toString();



  fetch(url)
  .then ( (response) => { return response.json() })
  .then ( (result) => {
    results.querySelectorAll('.row').forEach( (row) => {
      row.remove();
    });
    results.append(row);

    map = null;
    initMap();
    
    let flag= false;
    results.querySelector('.row').remove();
    for( let land of result) {
      let new_card = row.cloneNode(true);
      let card_body = new_card.querySelector('.card-body');
      card_body.querySelector(".card-title").innerHTML = land.community_area_name + " - " + land.pin;
      card_body.querySelector(".card-subtitle").innerHTML = land.address + " - " + land.sq_ft; 
      card_body.querySelector(".card-text").innerHTML = land.pin;
      results.append(new_card);
      
      let marker = new google.maps.Marker({ 
        position: new google.maps.LatLng(land.latitude, land.longitude)
      });
      marker.setMap(map);
     
      let info_card = new_card.cloneNode(true);
      let infowindow = new google.maps.InfoWindow({
        content: info_card
      });
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
     
    }
    let cont = document.querySelectorAll('.nav-link')[2];
    let elem = cont.getAttribute("value");
    let active = document.querySelector('.active');
    active.classList.remove("active");
    cont.classList.add("active");    
    show(elem);
  });
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
