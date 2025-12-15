// Generador de CV Simple - JavaScript

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Generador de CV cargado correctamente');
    
    // Elementos del formulario
    const nombreInput = document.getElementById('nombre');
    const profesionInput = document.getElementById('profesion');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const experienciaInput = document.getElementById('experiencia');
    const generarBtn = document.getElementById('generarBtn');
    const descargarBtn = document.getElementById('descargarBtn');
    
    // Elementos de vista previa
    const cvNombre = document.getElementById('cvNombre');
    const cvProfesion = document.getElementById('cvProfesion');
    const cvEmail = document.getElementById('cvEmail');
    const cvTelefono = document.getElementById('cvTelefono');
    const cvExperiencia = document.getElementById('cvExperiencia');
    
    // Función para actualizar la vista previa
    function actualizarVistaPrevia() {
        // Obtener valores del formulario
        const nombre = nombreInput.value.trim() || 'Tu nombre aparecerá aquí';
        const profesion = profesionInput.value.trim() || 'Tu profesión';
        const email = emailInput.value.trim() || 'email@ejemplo.com';
        const telefono = telefonoInput.value.trim() || '+34 000 000 000';
        const experiencia = experienciaInput.value.trim() || 'Tu experiencia aparecerá aquí...';
        
        // Actualizar elementos de vista previa
        cvNombre.textContent = nombre;
        cvProfesion.textContent = profesion;
        cvEmail.textContent = email;
        cvTelefono.textContent = telefono;
        cvExperiencia.textContent = experiencia;
        
        console.log('Vista previa actualizada');
    }
    
    // Actualizar vista previa en tiempo real mientras se escribe
    nombreInput.addEventListener('input', actualizarVistaPrevia);
    profesionInput.addEventListener('input', actualizarVistaPrevia);
    emailInput.addEventListener('input', actualizarVistaPrevia);
    telefonoInput.addEventListener('input', actualizarVistaPrevia);
    experienciaInput.addEventListener('input', actualizarVistaPrevia);
    
    // También actualizar al hacer clic en el botón
    generarBtn.addEventListener('click', function() {
        actualizarVistaPrevia();
        
        // Efecto visual de confirmación
        generarBtn.textContent = '✓ Vista Previa Actualizada';
        generarBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            generarBtn.textContent = 'Ver Vista Previa';
            generarBtn.style.backgroundColor = '#2ecc71';
        }, 1500);
    });
    
    // Función para el botón de descargar (placeholder por ahora)
    descargarBtn.addEventListener('click', function() {
        alert('La función de descargar PDF estará disponible en la próxima versión.\n\nPróximas características:\n✅ Descargar en PDF\n✅ Más plantillas\n✅ Guardar progreso');
        
        // Efecto visual
        const originalText = descargarBtn.textContent;
        descargarBtn.textContent = 'Función en desarrollo...';
        
        setTimeout(() => {
            descargarBtn.textContent = originalText;
        }, 1000);
    });
    
    // Inicializar con datos de ejemplo
    function inicializarDatosEjemplo() {
        // Solo establecer datos de ejemplo si los campos están vacíos
        if (!nombreInput.value) {
            nombreInput.value = 'Ana García López';
            profesionInput.value = 'Desarrolladora Web Frontend';
            emailInput.value = 'ana.garcia@email.com';
            telefonoInput.value = '+34 612 345 678';
            experienciaInput.value = '5 años de experiencia desarrollando aplicaciones web modernas con React, Vue.js y JavaScript ES6+. Especializada en crear interfaces de usuario responsivas y accesibles.';
            
            // Actualizar vista previa con los datos de ejemplo
            actualizarVistaPrevia();
            console.log('Datos de ejemplo cargados');
        }
    }
    
    // Cargar datos guardados del localStorage si existen
    function cargarDatosGuardados() {
        try {
            const datosGuardados = localStorage.getItem('cvData');
            if (datosGuardados) {
                const datos = JSON.parse(datosGuardados);
                
                if (datos.nombre) nombreInput.value = datos.nombre;
                if (datos.profesion) profesionInput.value = datos.profesion;
                if (datos.email) emailInput.value = datos.email;
                if (datos.telefono) telefonoInput.value = datos.telefono;
                if (datos.experiencia) experienciaInput.value = datos.experiencia;
                
                actualizarVistaPrevia();
                console.log('Datos guardados cargados desde localStorage');
                return true;
            }
        } catch (error) {
            console.log('Error cargando datos guardados:', error);
        }
        return false;
    }
    
    // Guardar datos en localStorage mientras se escriben
    function guardarDatos() {
        const datos = {
            nombre: nombreInput.value,
            profesion: profesionInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            experiencia: experienciaInput.value,
            fechaGuardado: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('cvData', JSON.stringify(datos));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.log('Error guardando datos:', error);
        }
    }
    
    // Escuchar cambios para guardar automáticamente
    nombreInput.addEventListener('input', guardarDatos);
    profesionInput.addEventListener('input', guardarDatos);
    emailInput.addEventListener('input', guardarDatos);
    telefonoInput.addEventListener('input', guardarDatos);
    experienciaInput.addEventListener('input', guardarDatos);
    
    // Inicializar la aplicación
    const hayDatosGuardados = cargarDatosGuardados();
    
    // Si no hay datos guardados, cargar datos de ejemplo
    if (!hayDatosGuardados) {
        inicializarDatosEjemplo();
    }
    
    console.log('Aplicación inicializada correctamente');
});
