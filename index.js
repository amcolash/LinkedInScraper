var xhr = new XMLHttpRequest();
xhr.addEventListener('load', loaded);

xhr.open('GET', 'test_data.json');
xhr.send();

var current = 0;

const description_container = document.createElement("div");
const job_container = document.createElement("div");

function loaded() {
    const data = JSON.parse(this.response);
    
    const container = document.createElement("div");
    container.className = "container-fluid";
    
    const r = document.createElement("row");
    r.className = "row";
    container.appendChild(r);

    job_container.classList = "col scroll";
    r.appendChild(job_container);
    
    description_container.classList = "col-9 scroll";
    r.appendChild(description_container);

    const body = document.body;
    body.appendChild(container);

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

        div.onclick = () => selectDescription(job, index);
        div.appendChild(form);

        row = document.createElement("div");
        row.className = "row";
        row.appendChild(div);
        job_container.appendChild(row);
    }

    selectDescription(data[0], 0);
}

function selectDescription(job, index) {
    job.description = job.description.replace("Job Description", "");
    job.description = job.description.replace("Job description", "");
    job.description = job.description.replace("Description", "");

    description_container.innerHTML = "<h2>" + job.company + " - " + job.title + "</h2><h4>" +
        ((job.level === "Not Applicable") ? job.type : job.level + ", " + job.type) + "</h4><hr>" + job.description;
    current = index;

    for (var i = 0; i < job_container.children.length; i++) {
        var row = job_container.children[i];
        row.classList = "row" + (i === index ? " active" : "");
    }
}