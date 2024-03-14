// Función que se ejecuta cuando se hace clic en el botón
document.getElementById("boton").addEventListener("click", function() {
    var imagenDiv = document.getElementById("imagen");
    var imageUrl = "https://www.redescena.net/temfiles/fotos/pq/peque[3].jpg"; // URL de la imagen

    // Comprobar si la imagen ya está establecida
    if (imagenDiv.style.backgroundImage === "none") {
        // Establecer el estilo de fondo con la imagen y configurar para que se ajuste al tamaño y no se repita
        imagenDiv.style.backgroundImage = "url('" + imageUrl + "')";
        imagenDiv.style.backgroundSize = "contain";
        imagenDiv.style.backgroundRepeat = "no-repeat";
    } else {
        // Eliminar la imagen
        clearImage();
    }
});

// Función para eliminar la imagen
function clearImage() {
    var imagenDiv = document.getElementById("imagen");
    imagenDiv.style.backgroundImage = "none";
}

function tablaAuto(){
    for(let renglon=1; renglon<=17; renglon++){
        var tr = document.createElement("tr");
        tr.className = "fila" + renglon;
        document.getElementById("automatico").appendChild(tr)
            for(let columna=1; columna<=10; columna++){
                var fila = document.getElementsByClassName("fila"+renglon)
                // console.log(fila[0]);
                var td = document.createElement("td");
                td.className = "cuadro";
                td.id = "R"+renglon+"C"+columna;
                // td.innerText = "Fila "+ r +" Columna " + h
                fila[0].appendChild(td);
            }
    }
}

tablaAuto();

function pintarHover(){
    var arreglo = [];
    var cuadrosHover = document.querySelectorAll("#R1C1,#R1C2,#R1C3,#R2C3,#R3C3,#R3C2,#R4C2,#R5C2,#R5C3,#R5C4,#R5C5,#R5C6,#R6C6,#R17C10");
    cuadrosHover.forEach(function(value, key){
        arreglo.push(value.id);
        }
    )
    console.log(arreglo);

    cuadrosHover.forEach(function(value, key){
        //console.log(value.id + "  " + key);
        //value.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        value.addEventListener("mouseover", function(element){
            console.log(value.id);
            console.log(element.target.id);
            if(element.target.id==arreglo[key]){
                value.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
            }
        })
    });  
}
 
pintarHover()
