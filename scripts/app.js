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
            this.classList.add('
