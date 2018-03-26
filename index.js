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

    if (e.keyCode == '37' || e.keyCode == '38') {
        incrementJob(false, false, false);
    } else if (e.keyCode == '39' || e.keyCode == '40') {
        incrementJob(true, false, false);
    } else if (e.keyCode == '32') {
        var row = job_container.children[current];
        incrementJob(true, true, !row.getElementsByClassName("form-check-input")[0].checked);
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
    
    description_container.classList = "col-9 scroll";
    r.appendChild(description_container);

    var bottom_buttons = document.createElement("div");
    bottom_buttons.className = "bottom-buttons";

    accept.classList = "btn btn-lg btn-success";
    accept.innerHTML = "✓";
    accept.onclick = () => incrementJob(true, true, true);

    reject.classList = "btn btn-lg btn-danger";
    reject.innerHTML = "×";
    reject.onclick = () => incrementJob(true, true, false);

    done.classList = "btn btn-lg btn-secondary";
    done.innerHTML = "Done";
    done.onclick = () => openLinks();

    bottom_buttons.appendChild(accept);
    bottom_buttons.appendChild(reject);
    bottom_buttons.appendChild(done);

    const body = document.body;
    body.appendChild(container);
    body.appendChild(bottom_buttons);

    console.log(data[0]);


    for (var i = 0; i < data.length; i++) {
        const job = data[i];
        const index = i;

        const div = document.createElement("div");
        div.classList = "col card card-body";

        var form = document.createElement("div");
        var checkbox = document.createElement("input");
        var header = document.createElement("label");
        var br = document.createElement("br");
        
        form.className = "form-check";
        form.appendChild(checkbox);
        form.appendChild(header);

        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
        
        header.innerHTML = job.company + " - " + job.title;
        header.className = "form-check-label";

        div.onclick = () => selectDescription(index);
        div.appendChild(form);

        row = document.createElement("div");
        row.className = "row";
        row.appendChild(div);
        job_container.appendChild(row);
    }

    selectDescription(0);
}

function incrementJob(forward, checkPrev, value) {
    var row = job_container.children[current];
    if (checkPrev) row.getElementsByClassName("form-check-input")[0].checked = value;

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

    description_container.scrollTo(0,0);
    description_container.innerHTML = "<h2>" + job.company + " - " + job.title + "</h2><h4>" +
        ((job.level === "Not Applicable") ? job.type : job.level + ", " + job.type) + "</h4><hr>" + job.description;
    current = index;

    for (var i = 0; i < job_container.children.length; i++) {
        var row = job_container.children[i];
        row.classList = "row" + (i === index ? " active" : "");
    }
}

function openLinks() {
    if (confirm("Are you sure you would like to open all selected jobs as tabs?")) {
        for (var i = 0; i < job_container.children.length; i++) {
            var row = job_container.children[i];
            if (row.getElementsByClassName("form-check-input")[0].checked) {
                window.open(data[i].url);
            }
        }
    }
}