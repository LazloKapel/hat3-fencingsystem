var data = JSON.parse(
    '{"competitionName":"default", "fencers":['+
    '], "bouts":['+
    '{"fencer1ID":"0","fencer2ID":"1"}]}'
);

var z = 1; // counter for z-index property of moveable boxes.

function setup() {
    document.getElementById('addFencerForm').addEventListener("submit", addFencer);
    dragElement(document.getElementById("form_container"));
    dragElement(document.getElementById("fencersList_container"));
    dragElement(document.getElementById("boutsList_container"));
    dragElement(document.getElementById("fencerDetails_container"));
}

function toggleWindow(targetID,label,button, direction=0) {
    // direction 0  = toggle; direction 1 = turn on; direction 2 = turn off
    let container = document.getElementById(targetID);

    if (targetID=="fencersList_container") {
        updateFencerList();
    }

    if ((container.style.display == 'none') || (direction==1)) {
        container.style.display = 'block';
        button.innerHTML = 'Hide '+label;
    } else if ((container.style.display == 'none') || (direction==0)) {
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
    let container = document.getElementById("fencersList_body");
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
    let container = document.getElementById("boutsList_body");
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
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
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
    // ifs ensure the element will stay within the window
    if ((elmnt.offsetTop - pos2 >0)*(elmnt.offsetTop - pos2 <= window.innerHeight - elmnt.offsetHeight)) {
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
