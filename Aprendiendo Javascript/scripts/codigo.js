
function cambiar(){
    console.log("Hola mundo!")
}

function colorBG(){
    color = document.getElementById("cambiocolor")
    color.classList.remove("bg-secondary-subtle")
    color.classList.add("bg-primary-subtle")

}

function colorBack(){
    colorB = document.getElementById("cambiocolor")
    colorB.classList.remove("bg-primary-subtle")
    colorB.classList.add("bg-secondary-subtle")

}

function colorClick(){
    colorC = document.getElementById("cambiocolor")
    colorC.classList.remove("bg-primary-subtle")
    colorC.classList.add("bg-warning")
}