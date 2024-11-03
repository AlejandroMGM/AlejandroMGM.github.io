function scheduleAppointment(button) {
    // Selecciona la celda del calendario correspondiente
    const cell = button.closest('.calendar-day');
    
    // Solicita la hora para la cita
    let hour = prompt("Ingrese la hora de la cita (8:00 AM - 5:00 PM):", "8:00 AM");
    
    // Verifica que la hora esté en el rango permitido
    const allowedHours = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    if (allowedHours.includes(hour)) {
        // Muestra la hora en la celda y cambia el color
        cell.classList.add('scheduled');
        cell.querySelector('span').textContent += ` (${hour})`;
        
        // Oculta el botón de agendar y muestra el botón de cancelar
        button.style.display = 'none';
        cell.querySelector('.cancel-btn').style.display = 'inline-block';
    } else {
        alert("Hora no válida. Ingrese una hora entre 8:00 AM y 5:00 PM.");
    }
}

function cancelAppointment(button) {
    // Solicita confirmación para cancelar la cita
    if (confirm("¿Está seguro de que desea cancelar la cita?")) {
        // Selecciona la celda del calendario correspondiente
        const cell = button.closest('.calendar-day');
        
        // Quita la clase de cita programada y restaura el texto original
        cell.classList.remove('scheduled');
        const day = cell.querySelector('span').textContent.split(" ")[0];
        cell.querySelector('span').textContent = day;
        
        // Oculta el botón de cancelar y muestra el botón de agendar
        button.style.display = 'none';
        cell.querySelector('.schedule-btn').style.display = 'inline-block';
    }
}