var info = {
    year: "2025",
    date: "October 13 to 19",
    city: "Vitória - Espirito Santo",
    chair: "Fagner de Assis Moura Pimentel &ltfagnerpimentel@gmail.com&gt",
    oc: "<ul>\
            <li>Ana Patricia Magalhães (UNEB/UNIFACS)</li>\
            <li>Pedro Edom Nunes (FURG)</li>\
            <li>Gabriela Bassegio (FEI)</li>\
            <li>Gustavo Fardo Armênio (UTFPR)</li>\
            <li>Alexandre Costa (UFG)</li>\
            <li>Rhayna Christiani Vasconcelos Marques Casado (USP)</li>\
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
