var xhr = new XMLHttpRequest();
xhr.addEventListener('load', loaded);

xhr.open('GET', 'test_data.json');
xhr.send();

var current = 0;

const description_container = document.createElement("div");
const job_container = document.createElement("div");

const accept = document.createElement("h1");
const reject = document.createElement("h1");
const done = document.createElement("h1");

var data;

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '188') { // left, up, comma (,)
        incrementJob(false, false, false);
        e.preventDefault();
    } else if (e.keyCode == '39' || e.keyCode == '40' || e.keyCode == '191') { // down, right, forward slash (/)
        incrementJob(true, false, false);
        e.preventDefault();
    } else if (e.keyCode == '13' || e.keyCode == '32') { // enter, space
        var row = job_container.children[current];
        var checkbox = row.getElementsByClassName("custom-control-input")[0];
        checkbox.checked = !checkbox.checked;
        e.preventDefault();
    } else if (e.keyCode == '190') { // period (.)
        var row = job_container.children[current];
        incrementJob(true, true, !row.getElementsByClassName("custom-control-input")[0].checked);
        e.preventDefault();
    }
}

function loaded() {
    data = JSON.parse(this.response);
    
    const container = document.createElement("div");
    container.className = "container-fluid";
    
    const r = document.createElement("row");
    r.className = "row";
    container.appendChild(r);

    job_container.classList = "col scroll";
    r.appendChild(job_container);
    
    description_container.classList = "col-9 scroll p-3";
    r.appendChild(description_container);

    var bottom_buttons = document.createElement("div");
    bottom_buttons.className = "bottom-buttons";

    accept.classList = "btn btn-lg btn-success mr-2";
    accept.innerHTML = "✓";
    accept.onclick = () => incrementJob(true, true, true);

    reject.classList = "btn btn-lg btn-danger mr-2";
    reject.innerHTML = "×";
    reject.onclick = () => incrementJob(true, true, false);

    done.classList = "btn btn-lg btn-info mr-2";
    done.innerHTML = "Done";
    done.onclick = () => openLinks();

    bottom_buttons.appendChild(accept);
    bottom_buttons.appendChild(reject);
    bottom_buttons.appendChild(done);

    const body = document.body;
    body.appendChild(container);
    body.appendChild(bottom_buttons);


    for (var i = 0; i < data.length; i++) {
        const job = data[i];
        const index = i;

        const div = document.createElement("div");
        div.classList = "col card card-body";
        div.onclick = () => selectDescription(index);

        var form = document.createElement("label");
        var checkbox = document.createElement("input");
        var indicator = document.createElement("span");
        var header = document.createElement("span");
        
        form.classList = "custom-control custom-checkbox";
        form.appendChild(checkbox);
        form.appendChild(indicator);
        
        checkbox.type = "checkbox";
        checkbox.className = "custom-control-input";
        
        indicator.classList = "custom-control-indicator";
        
        header.innerHTML = job.company + " - " + job.title;
        header.className = "custom-control-description";
        
        var innerRow = document.createElement("div");
        innerRow.appendChild(form);
        innerRow.appendChild(header);

        div.appendChild(innerRow);

        row = document.createElement("div");
        row.className = "row";
        row.appendChild(div);
        job_container.appendChild(row);
    }

    selectDescription(0);
}

function incrementJob(forward, checkPrev, value) {
    var row = job_container.children[current];
    if (checkPrev) row.getElementsByClassName("custom-control-input")[0].checked = value;

    // Increment within bounds
    current = current + (forward ? 1 : -1);
    if (current < 0) current = 0;
    if (current > (data.length - 1)) current = data.length - 1;

    // Scroll to see selected row
    var elem = job_container.children[current];
    var rectElem = elem.getBoundingClientRect();
    var rectContainer = job_container.getBoundingClientRect();
    if (rectElem.bottom > rectContainer.bottom) elem.scrollIntoView(false);
    if (rectElem.top < rectContainer.top) elem.scrollIntoView();

    selectDescription(current);
}

function selectDescription(index) {
    var job = data[index];

    job.description = job.description.replace("Job Description", "");
    job.description = job.description.replace("Job description", "");
    job.description = job.description.replace("Description", "");

    description_container.innerHTML = "<h2>" + job.company + " - " + job.title + "</h2><h4>" +
    ((job.level === "Not Applicable") ? job.type : job.level + ", " + job.type) + "</h4><hr>" + job.description;
    description_container.scrollTo(0,0);
    current = index;

    for (var i = 0; i < job_container.children.length; i++) {
        var card = job_container.children[i].getElementsByClassName("card")[0];
        card.classList = "card card-body" + (i === index ? " active" : "");
    }
}

function openLinks() {
    if (confirm("Are you sure you would like to open all selected jobs as tabs?")) {
        for (var i = 0; i < job_container.children.length; i++) {
            var row = job_container.children[i];
            if (row.getElementsByClassName("custom-control-input")[0].checked) {
                window.open(data[i].url);
            }
        }
    }
}