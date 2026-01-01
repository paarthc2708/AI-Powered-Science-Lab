let welcomePage = document.getElementById("welcomePage");
let experimentsSection = document.getElementById("experimentsSection");
let guidedExperimentsSection = document.getElementById("guidedExperimentsSection");
let fromScratchSection = document.getElementById("fromScratchSection");
let titrationExperiment = document.getElementById("titrationExperiment");
let precipitationExperiment = document.getElementById("precipitationExperiment");
let pHExperiment = document.getElementById("pHExperiment");
let titrationExperimentVirtualLab = document.getElementById("titrationExperimentVirtualLab");
let precipitationExperimentVirtualLab = document.getElementById("precipitationExperimentVirtualLab");
let pHExperimentVirtualLab = document.getElementById("pHExperimentVirtualLab");

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

function exploreTitrationExperiment(){
    guidedExperimentsSection.style.display = "none";
    titrationExperiment.style.display = "block";
}

function explorePrecipitationExperiment(){
    guidedExperimentsSection.style.display = "none";
    precipitationExperiment.style.display = "block";
}

function explorePHExperiment(){
    guidedExperimentsSection.style.display = "none";
    pHExperiment.style.display = "block";
}

function startTitrationExperiment(){
    titrationExperiment.style.display = "none";
    titrationExperimentVirtualLab.style.display = "block";
}

function startPrecipitationExperiment(){
    precipitationExperiment.style.display = "none";
    precipitationExperimentVirtualLab.style.display = "block";
}

function startPHExperiment(){
    pHExperiment.style.display = "none";
    pHExperimentVirtualLab.style.display = "block";
}

function backToExperiments(){
    titrationExperiment.style.display = "none";
    precipitationExperiment.style.display = "none";
    pHExperiment.style.display = "none";
    titrationExperimentVirtualLab.style.display = "none";
    precipitationExperimentVirtualLab.style.display = "none";
    pHExperimentVirtualLab.style.display = "none";
    guidedExperimentsSection.style.display = "block";
}