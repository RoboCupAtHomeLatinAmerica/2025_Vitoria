var info = {
    year: "2024",
    date: "November 11 to 17",
    city: "Goiânia - Goiás",
    chair: "Fagner de Assis Moura Pimentel &ltfagnerpimentel@gmail.com&gt",
    oc: "<ul>\
            <li>OC 1</li>\
            <li>OC 2</li>\
        </ul>"
};

for(var key in info) {
    var value = info[key];
    var elements = document.getElementsByClassName(key);
    for (let i = 0; i < elements.length; i++) {elements[i].innerHTML = value;}            
}



function openSection(evt, sectionName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(sectionName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();