const sebis_rotation = {
    1: "Push",
    2: "Pull",
    3: "Rest1/Legs",
    4: "Rest2"
}

var rotation = {
}

function setRotation(newRotation) {
    rotation = newRotation
}

function onLoad() {
    rotation = sebis_rotation
    displayOptions(rotation)
}

function getElement(elementId) {
    return document.getElementById(elementId)
}

function getElementValue(elementId) {
    return document.getElementById(elementId).value
}

function filterText(text) {
    var splitTextArea = text.replace(/(\r\n|\n|\r)/gm, " ").split(" ")
    return splitTextArea.filter(value => {
        return value != ""
    })
}

async function handleSubmit() {
    const inputType = document.getElementById("input-type").value
    if (inputType == 1)
    {
        const value = getElementValue("typed-rotation")
        if (value!="")
            displayOptions(createOptionsObject(value))
    }
        
    else if (inputType == 2)
        readInputFile(getElement("file-upload"))
}


function createOptionsObject(listOfOptions) {
    const newRotation = {}
    filterText(listOfOptions).forEach((element, index) => {
        newRotation[index + 1] = element
    })
    return newRotation
}

function readInputFile(input) {

    var file = input.files[0];
    if (file!=undefined)
    {
        var reader = new FileReader();
        reader.onload = async function () {
            displayOptions(createOptionsObject(this.result))
        };
    
        reader.readAsText(file)
    }
    
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function addOptions(selectElement, options) {
    Object.keys(options).forEach((option) => {
        var newOption = document.createElement("option");
        newOption.text = options[option];
        newOption.value = option
        selectElement.options.add(newOption, null)
    })
}

function displayOptions(options) {
    var select = document.getElementById("select");
    removeOptions(select)
    addOptions(select, options)
    setRotation(options)
}

function getSelectedOption(elementId) {
    return Number(document.getElementById(elementId).value);
}

function calculate() {

    try {

        const today = new Date();
        const inputDay = document.getElementById("input-day").valueAsDate
        const differenceInMs = inputDay.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInMs / (1000 * 3600 * 24));
        const dayTypeSelected = getSelectedOption("select")

        var theDay = dayTypeSelected

        for (var i = 0; i < differenceInDays; i++) {
            if (theDay === Object.keys(rotation).length)
                theDay = 0
            theDay = theDay + 1
        }

        document.getElementById("result").innerHTML = formatDate(inputDay) + " will be a " + rotation[theDay] + " day.";

    }
    catch (err) {
        if (err instanceof TypeError)
            document.getElementById("result").innerHTML = "You must specify a date to be calculated."
    }
}

function checkMode() {
    const mode = getSelectedOption("mode")
    var fileInput = document.getElementById("custom")
    if (mode === 2)
        fileInput.style.display = "block";
    else if (mode === 1) {
        fileInput.style.display = "none";
        displayOptions(sebis_rotation)
    }
}

function checkInputType() {

    const mode = getSelectedOption("input-type")
    const manual = getElement("typed-rotation")
    const file = getElement("file-upload")

    if (mode === 1) {
        manual.style.display = "block";
        file.style.display = "none";
    }
    else if (mode === 2) {
        file.style.display = "block";
        manual.style.display = "none";
    }
}


function formatDate(date) {
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}