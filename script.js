var data = JSON.parse(
    '{"competitionName":"default", "fencers":['+
    '], "bouts":['+
    '{"fencer1ID":"0","fencer2ID":"1"}]}'
);

var z = 1; // counter for z-index property of moveable boxes.

function setup() {
    document.getElementById('addFencerForm').addEventListener("submit", addFencer);
    dragElement(document.getElementById("form_container"));
    dragElement(document.getElementById("fencerList_container"));
    dragElement(document.getElementById("boutList_container"));
    dragElement(document.getElementById("fencerDetails_container"));
}

function getWindowObjects(elmnt) {
    let windowName = elmnt.dataset.window;
    let container = document.getElementById(windowName+'_container');
    let header = $(container).children(".header").filter().filter(".body").prevObject[0]; // JQuery to get child element that is the header
    let body = $(container).children().filter().filter(".body").prevObject[0]; // JQuery to get child element that is the body
    let button = document.querySelector(`[class="nav"][data-window='${windowName}']`);
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
    }

    if ((container.style.display == 'none') || (direction==1)) {
        container.style.display = 'block';
        button.innerHTML = 'Hide '+label;
    } else if ((container.style.display != 'none') || (direction==2)) {
        container.style.display = 'none';
        button.innerHTML = 'Show '+label;
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

function updateFencerList() {
    let container = document.getElementById("fencerList_body");
    let fencers = data.fencers;
    let result = '';
    let linkElement = `<a href="#" onclick="toggleWindow('fencerDetails_container','Fencer Details',document.getElementById('fencerDetails_containerButton'),1);`;
    for (let i = 0; i < fencers.length; i++) {
        result += linkElement + 'updateFencerDetails('+ i +`)"`+`title="`+fencers[i].fname + ' ' + fencers[i].lname+`">` + fencers[i].fname + ' ' + fencers[i].lname + '</a><br>';
    }

    if (result=='') {
        result = 'No fencers are in the database.';
    }
    container.innerHTML = result;
}

function updateBoutList() {
    let container = document.getElementById("boutList_body");
    let bouts = data.bouts;
    let fencers = data.fencers;
    let result = '';
    let fencer1;
    let fencer2;
    for (let i = 0; i < bouts.length; i++) {
        fencer1 = fencers[bouts[i].fencer1ID];
        fencer2 = fencers[bouts[i].fencer2ID];
        result += fencer1.fname + ' ' + fencer1.lname + ' v ' + fencer2.fname + ' ' + fencer2.lname + '<br>';
    }

    if (result=='') {
        result = 'No fencers are in the database.';
    }
    container.innerHTML = result;
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

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let windowName = elmnt.dataset.window;
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