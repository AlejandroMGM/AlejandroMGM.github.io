var images = [
    'https://cdn-3.motorsport.com/images/amp/0qXxdqB6/s1000/mercedes-amg-w15.jpg',
    'https://i.pinimg.com/736x/13/e7/7f/13e77fe911d2b68302f447347956f59e.jpg',
    'https://es.ramtrucks.com/content/dam/fca-brands/na/ramtrucks/en_us/ram-commercial/businesslink/member-services/Ram-BizLink-Services-LoanerVehicles.jpg.image.1440.jpg',
    'https://previews.123rf.com/images/anyaivanova/anyaivanova2307/anyaivanova230704367/209207313-una-casa-rodante-verde-y-blanca-estacionada-frente-a-una-monta%C3%B1a.jpg',
];

var currentIndex = 0;
var diagramFoto = document.querySelector('.diagram-foto'); // Selecciona el contenedor

// Función para cambiar la imagen de fondo cada 5 segundos
function changeBackgroundImage() {
    diagramFoto.style.backgroundImage = 'url(' + images[currentIndex] + ')';
    currentIndex = (currentIndex + 1) % images.length; // Avanza al siguiente índice circularmente
}

// Llama a la función para cambiar la imagen de fondo cada 5 segundos
setInterval(changeBackgroundImage, 5000);