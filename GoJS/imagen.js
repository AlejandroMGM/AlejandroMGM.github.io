var images = [
    'https://services.meteored.com/img/article/cuales-han-sido-las-3-erupciones-volcanicas-mas-mortales-de-la-historia-1689864923882_768.jpg',
    'https://i0.wp.com/nayaritnoticias.com/wp-content/uploads/2023/07/incendio-al-fondo-bosque-al-fondo.jpg?fit=1200%2C686&ssl=1',
    'https://img.freepik.com/fotos-premium/hombre-mirando-concepto-desastre-natural-catastrofe-tornado-ia-generativa_159242-30328.jpg',
    'https://img.freepik.com/premium-photo/illustration-3d-tsunami-scene-with-light_948935-3063.jpg?size=626&ext=jpg&ga=GA1.1.1687694167.1711843200&semt=sph',
];

var currentIndex = 0;
var body = document.querySelector('.body');

// Función para cambiar la imagen de fondo cada 5 segundos
function changeBackgroundImage() {
    body.style.backgroundImage = 'url(' + images[currentIndex] + ')';
    currentIndex = (currentIndex + 1) % images.length; // Avanza al siguiente índice circularmente
}

// Llama a la función para cambiar la imagen de fondo cada 5 segundos
setInterval(changeBackgroundImage, 5000);
