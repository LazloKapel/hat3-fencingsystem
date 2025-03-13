var data = JSON.parse(
    '{"competitionName":"default", "fencers":['+ // format {"fname":"John","lname":"Doe"}
    '], "bouts":['+
    ']}' // format {"fencer1ID":"0","fencer2ID":"1"}
);

var z = 1; // counter for z-index property of moveable boxes.

function setup() {
    document.getElementById('addFencerForm').addEventListener("submit", addFencer);
    dragElement(document.getElementById("form_container"));
    dragElement(document.getElementById("fencerList_container"));
    dragElement(document.getElementById("boutList_container"));
    dragElement(document.getElementById("fencerDetails_container"));
    dragElement(document.getElementById("boutDetails_container"));
}

function getWindowObjects(elmnt) {
    let windowName = elmnt.dataset.window;
    let container = document.getElementById(windowName+'_container');
    let header = $(container).children(".header").filter().filter(".body").prevObject[0]; // JQuery to get child element that is the header
    let body = $(container).children(".body").filter().filter(".body").prevObject[0]; // JQuery to get child element that is the body
    let button = document.querySelector(`[class="nav"][data-window='${windowName}']`);
    if (!(button)) {
        button = document.querySelector(`[class="nav toggled"][data-window='${windowName}']`);
    }
    return {'windowName':windowName, 'container':container, 'header':header, 'body':body, 'button':button};
}

function toggleWindow(elmnt, direction=0) {
    // direction 0  = toggle; direction 1 = turn on; direction 2 = turn off
    let values = getWindowObjects(elmnt);
    let windowName = values['windowName'];
    let container = values['container'];
    let button = values['button'];
    let label = button.dataset.text;

    if (windowName=="fencerList") {
        updateFencerList();
    } else if (windowName=="boutList") {
        updateBoutList();
    }

    if ((container.style.display == 'none') || (direction==1)) {
        container.style.display = 'block';
        button.innerHTML = 'Hide '+label;
        button.classList.add("toggled");
    } else if ((container.style.display != 'none') || (direction==2)) {
        container.style.display = 'none';
        button.innerHTML = 'Show '+label;
        button.classList.remove("toggled");
    } else {
        throw new Error('No condition met for toggle window.')
    }
}

function updateFencerDetails(fencerID) {
    let fencer = data.fencers[fencerID];
    let body = document.getElementById("fencerDetails_body");

    body.innerHTML = '<strong>ID:</strong> ' + fencerID + '<br>' + 
        '<strong>First Name:</strong> ' + fencer.fname + '<br>' +
        '<strong>Last Name:</strong> ' + fencer.lname;
}

function updateBoutDetails(boutID) {
    let bout = data.bouts[boutID];
    let body = document.getElementById("boutDetails_body");
    let fencer1 = data.fencers[bout.fencer1ID];
    let fencer2 = data.fencers[bout.fencer2ID];

    body.innerHTML = '<strong>ID:</strong> ' + boutID + '<br>' + 
        '<strong>Fencer 1:</strong> ' + fencer1.fname + ' ' + fencer1.lname + '<br>' +
        '<strong>Fencer 1:</strong> ' + fencer2.fname + ' ' + fencer2.lname;
}

function updateFencerList() {
    let container = document.getElementById("fencerList_body");
    let fencers = data.fencers;
    let result = '';
    let linkElement = `<a href="#" onclick="toggleWindow(document.getElementById('fencerDetails_container'),1);`;
    for (let i = 0; i < fencers.length; i++) {
        result += linkElement + 'updateFencerDetails('+ i +`)"`+`title="`+fencers[i].fname + ' ' + fencers[i].lname+`">` + fencers[i].fname + ' ' + fencers[i].lname + '</a><br>';
    }

    if (result=='') {
        result = 'No fencers are in the database.';
    }
    container.innerHTML = result;
}

function updateBoutList() {
    let body = document.getElementById("boutList_body");
    let bouts = data.bouts;
    let fencers = data.fencers;
    let result = '';
    let versus;
    let fencer1;
    let fencer2;
    let linkElement = `<a href="#" onclick="toggleWindow(document.getElementById('boutDetails_container'),1);`;
    for (let i = 0; i < bouts.length; i++) {
        fencer1 = fencers[parseInt(bouts[i].fencer1ID)];
        console.log(fencer1);
        fencer2 = fencers[parseInt(bouts[i].fencer2ID)];
        versus = '<strong>' + fencer1.fname + ' ' + fencer1.lname + '</strong> v <strong>' + fencer2.fname + ' ' + fencer2.lname + '</strong>';
        result += linkElement + 'updateBoutDetails('+ i +`)"`+`title="`+fencer1.fname + ' ' + fencer1.lname + ' v ' + fencer2.fname + ' ' + fencer2.lname+`">` + versus +'</a><br>';
    }

    if (result=='') {
        result = 'No bouts are in the database.';
    }
    body.getElementsByTagName("p")[0].innerHTML = result;
}

function addFencer(event) {
    event.preventDefault();
    let errorBox = document.getElementById('errBox');
    try {
        errorBox.style = "display:none"
        errorBox.innerHTML = ""
        
        let fname = document.getElementById('fname').value;
        let lname = document.getElementById('lname').value;
        let entry = JSON.parse('{"fname":"'+fname+'","lname":"'+lname+'"}');
        let index = data.fencers.length;
        
        if ((fname=='')+(lname=='')) {
            throw new Error("Ensure all fields are filled.")
        }

        console.log("New Entry:");
        console.log(entry);
        
        data.fencers[index] = entry;

        console.log("Current List:");
        console.log(data);

        document.getElementById('addFencerForm').reset();
    } catch (err){
        errorBox.style = "display:inline-block";
        errorBox.innerHTML = err;
    }
    updateFencerList();
}

function generateBouts() {
    let fencers = data.fencers;
    for (let key1 in fencers) {
        for (let key2 in fencers) {
            if (parseInt(key1)<parseInt(key2)) {
                let entry = JSON.parse('{"fencer1ID":"'+key1+'","fencer2ID":"'+(key2)+'","fencer1Score:":0,"fencer2Score":0}');
                console.log(entry);
                let index = data.bouts.length;
                data.bouts[index] = entry;
            }
        }
    }
    updateBoutList();
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let windowName = elmnt.dataset.window;
  let body = document.getElementById(windowName + "_body");
  if (document.getElementById(windowName + "_header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(windowName + "_header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // layers element on top of others
    z = z+1
    elmnt.style.zIndex = z;
    // ensure window isn't locked out of screen
    let currentHeight = body.offsetHeight;
    let maximumHeight = parseInt(window.getComputedStyle(body,null).getPropertyValue("max-height")); // parseInt required as getPropertyValue returns "999px" instead of 999.
    if (currentHeight>=maximumHeight) {
        elmnt.style.top = '60px'; // moves the window to the top of the screen
        elmnt.style.height = maximumHeight; // shrinks the window to the maximum height so that it doesn't overflow.
    }
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // ifs ensure the element will stay within the window (60 since header is 60px high)
    if ((elmnt.offsetTop - pos2 >60)*(elmnt.offsetTop - pos2 <= window.innerHeight - elmnt.offsetHeight)) {
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }

    if ((elmnt.offsetLeft - pos1 >0)*(elmnt.offsetLeft - pos1<= window.innerWidth - elmnt.offsetWidth)) {
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function resetSize(bodyID) {
    let body = document.getElementById(bodyID);

    body.style.height = 'auto';
    body.style.width = '300px';
}