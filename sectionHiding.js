let welcomePage = document.getElementById("welcomePage");
let experimentsSection = document.getElementById("experimentsSection");
let guidedExperimentsSection = document.getElementById("guidedExperimentsSection");
let fromScratchSection = document.getElementById("fromScratchSection");

function enterLab(){
    welcomePage.style.display = "none";
    experimentsSection.style.display = "block";
}

function startGuidedExperiments(){
    experimentsSection.style.display = "none";
    guidedExperimentsSection.style.display = "block";
}

function startFromScratch(){
    experimentsSection.style.display = "none";
    fromScratchSection.style.display = "block";
}