// ===== ESTADO DE LA APLICACIÓN =====
const state = {
    currentTemplate: 'classic',
    currentSection: 'personal',
    cvData: {
        personal: {
            name: '',
            title: '',
            email: '',
            phone: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: []
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFormListeners();
    initTemplateSelector();
    initButtons();
    loadFromStorage();
    updatePreview();
});

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Actualizar botones activos
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            document.querySelectorAll('.form-section').forEach(sec => {
                sec.classList.remove('active');
            });
            
            document.getElementById(`${section}Section`).classList.add('active');
            state.currentSection = section;
        });
    });
}

// ===== LISTENERS DEL FORMULARIO =====
function initFormListeners() {
    // Inputs de información personal
    const personalInputs = ['name', 'title', 'email', 'phone', 'summary'];
    
    personalInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                state.cvData.personal[id] = this.value;
                updatePreview();
                saveToStorage();
            });
        }
    });
    
    // Botón para añadir experiencia
    document.getElementById('addExperience').addEventListener('click', addExperienceItem);
    
    // Experiencia por defecto
    addExperienceItem();
}

// ===== GESTIÓN DE EXPERIENCIA =====
function addExperienceItem() {
    const expContainer = document.querySelector('#experienceSection .experience-item:last-child');
    
    // Clonar el último item
    const newItem = expContainer.cloneNode(true);
    
    // Limpiar valores
    newItem.querySelectorAll('input, textarea').forEach(input => {
        if (input.type !== 'checkbox') {
            input.value = '';
        } else {
            input.checked = false;
        }
    });
    
    // Añadir listeners a los nuevos inputs
    addExperienceListeners(newItem);
    
    // Insertar antes del botón "Añadir"
    expContainer.parentNode.insertBefore(newItem, document.getElementById('addExperience'));
    
    // Actualizar estado
    updateExperienceData();
}

function addExperienceListeners(item) {
    const inputs = item.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', updateExperienceData);
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                const endInput = item.querySelector('.exp-end');
                endInput.disabled = this.checked;
                if (this.checked) endInput.value = '';
                updateExperienceData();
            });
        }
    });
}

function updateExperienceData() {
    state.cvData.experience = [];
    
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        const title = item.querySelector('.exp-title')?.value || '';
        const company = item.querySelector('.exp-company')?.value || '';
        const start = item.querySelector('.exp-start')?.value || '';
        const end = item.querySelector('.exp-current')?.checked ? 'Actual' : 
                   (item.querySelector('.exp-end')?.value || '');
        const description = item.querySelector('.exp-description')?.value || '';
        
        if (title || company) {
            state.cvData.experience.push({
                title,
                company,
                start,
                end,
                description
            });
        }
    });
    
    updatePreview();
    saveToStorage();
}

// ===== SELECTOR DE PLANTILLAS =====
function initTemplateSelector() {
    const templateBtn = document.getElementById('templateBtn');
    const closeBtn = document.getElementById('closeTemplates');
    const templateCards = document.querySelectorAll('.template-card');
    
    // Mostrar/ocultar panel de plantillas
    templateBtn.addEventListener('click', function() {
        document.getElementById('templatesPanel').classList.add('active');
    });
    
    closeBtn.addEventListener('click', function() {
        document.getElementById('templatesPanel').classList.remove('active');
    });
    
    // Seleccionar plantilla
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.dataset.template === 'professional') {
                showPremiumModal();
                return;
            }
            
            // Actualizar selección visual
            templateCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Cambiar plantilla
            state.currentTemplate = this.dataset.template;
            document.getElementById('cvPreview').querySelector('.cv-template').className = 
                `cv-template ${state.currentTemplate}`;
            
            // Cerrar panel
            document.getElementById('templatesPanel').classList.remove('active');
            
            saveToStorage();
        });
    });
}

// ===== ACTUALIZAR VISTA PREVIA =====
function updatePreview() {
    const data = state.cvData.personal;
    const preview = document.getElementById('cvPreview');
    
    // Actualizar información personal
    if (data.name) preview.querySelector('.cv-name').textContent = data.name;
    if (data.title) preview.querySelector('.cv-title').textContent = data.title;
    
    // Actualizar contacto
    const contact = preview.querySelector('.cv-contact');
    if (data.phone) {
        contact.querySelector('span:nth-child(1)').innerHTML = 
            `<i class="fas fa-phone"></i> ${data.phone}`;
    }
    if (data.email) {
        contact.querySelector('span:nth-child(2)').innerHTML = 
            `<i class="fas fa-envelope"></i> ${data.email}`;
    }
    
    // Actualizar perfil
    if (data.summary) {
        preview.querySelector('.cv-section p').textContent = data.summary;
    }
    
    // Actualizar experiencia (simplificado por ahora)
    updateExperiencePreview();
}

function updateExperiencePreview() {
    const expSection = document.querySelector('#cvPreview .cv-section:nth-child(3)');
    if (!expSection) return;
    
    let html = '<h3><i class="fas fa-briefcase"></i> Experiencia</h3>';
    
    state.cvData.experience.forEach(exp => {
        if (exp.title || exp.company) {
            html += `
                <div class="cv-item">
                    <h4>${exp.title || ''}</h4>
                    <p class="cv-subtitle">${exp.company || ''} | ${exp.start || ''} ${exp.end ? ' - ' + exp.end : ''}</p>
                    ${exp.description ? `<p>${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
            `;
        }
    });
    
    expSection.innerHTML = html;
}

// ===== BOTONES PRINCIPALES =====
function initButtons() {
    // Botón "Nuevo"
    document.getElementById('clearBtn').addEventListener('click', function() {
        if (confirm('¿Borrar todos los datos y empezar de nuevo?')) {
            clearAllData();
        }
    });
    
    // Botón "Descargar PDF" (placeholder por ahora)
    document.getElementById('downloadBtn').addEventListener('click', function() {
        alert('La descarga de PDF se implementará en la Fase 2');
        // En la Fase 2: generarPDF();
    });
    
    // Enlace Premium
    document.getElementById('premiumLink').addEventListener('click', function(e) {
        e.preventDefault();
        showPremiumModal();
    });
    
    // Cerrar modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('premiumModal').classList.remove('active');
    });
}

// ===== MODAL PREMIUM =====
function showPremiumModal() {
    document.getElementById('premiumModal').classList.add('active');
}

// ===== GUARDADO EN LOCALSTORAGE =====
function saveToStorage() {
    try {
        localStorage.setItem('cvProData', JSON.stringify({
            cvData: state.cvData,
            template: state.currentTemplate
        }));
    } catch (e) {
        console.log('Error guardando datos:', e);
    }
}

function loadFromStorage() {
    try {
        const saved = JSON.parse(localStorage.getItem('cvProData'));
        if (saved) {
            state.cvData = saved.cvData || state.cvData;
            state.currentTemplate = saved.template || 'classic';
            
            // Rellenar formularios
            Object.keys(state.cvData.personal).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = state.cvData.personal[key];
            });
            
            // Aplicar plantilla
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.toggle('active', card.dataset.template === state.currentTemplate);
            });
            
            const cvTemplate = document.querySelector('#cvPreview .cv-template');
            if (cvTemplate) {
                cvTemplate.className = `cv-template ${state.currentTemplate}`;
            }
        }
    } catch (e) {
        console.log('Error cargando datos:', e);
    }
}

function clearAllData() {
    if (confirm('¿Estás seguro? Se perderán todos los datos no guardados.')) {
        localStorage.removeItem('cvProData');
        
        // Resetear estado
        state.cvData = {
            personal: { name: '', title: '', email: '', phone: '', summary: '' },
            experience: [],
            education: [],
            skills: []
        };
        
        // Limpiar formularios
        document.querySelectorAll('input, textarea').forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });
        
        // Eliminar items de experiencia extra
        const expItems = document.querySelectorAll('.experience-item');
        expItems.forEach((item, index) => {
            if (index > 0) item.remove();
        });
        
        updatePreview();
        alert('Datos borrados correctamente.');
    }
}

// ===== DETECCIÓN DE DISPOSITIVO =====
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar interfaz en tiempo real
window.addEventListener('resize', function() {
    if (isMobile()) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
});

// Inicializar detección
if (isMobile()) {
    document.body.classList.add('mobile');
}
