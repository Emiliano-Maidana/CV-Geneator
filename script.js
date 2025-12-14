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
    console.log('CV Generator iniciado');
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
            
            const sectionElement = document.getElementById(`${section}Section`);
            if (sectionElement) {
                sectionElement.classList.add('active');
            }
            
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
    const addExpBtn = document.getElementById('addExperience');
    if (addExpBtn) {
        addExpBtn.addEventListener('click', addExperienceItem);
    }
    
    // Experiencia por defecto
    addExperienceItem();
}

// ===== GESTIÓN DE EXPERIENCIA =====
function addExperienceItem() {
    const expContainer = document.querySelector('#experienceSection .experience-item:last-child');
    if (!expContainer) return;
    
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
    
    // Añadir listeners
    addExperienceListeners(newItem);
    
    // Insertar antes del botón "Añadir"
    const addBtn = document.getElementById('addExperience');
    if (addBtn) {
        expContainer.parentNode.insertBefore(newItem, addBtn);
    }
    
    updateExperienceData();
}

function addExperienceListeners(item) {
    const inputs = item.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', updateExperienceData);
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                const endInput = item.querySelector('.exp-end');
                if (endInput) {
                    endInput.disabled = this.checked;
                    if (this.checked) endInput.value = '';
                }
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
    
    if (templateBtn) {
        templateBtn.addEventListener('click', function() {
            const panel = document.getElementById('templatesPanel');
            if (panel) panel.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const panel = document.getElementById('templatesPanel');
            if (panel) panel.classList.remove('active');
        });
    }
    
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
            const cvTemplate = document.querySelector('#cvPreview .cv-template');
            if (cvTemplate) {
                cvTemplate.className = `cv-template ${state.currentTemplate}`;
            }
            
            // Cerrar panel
            const panel = document.getElementById('templatesPanel');
            if (panel) panel.classList.remove('active');
            
            saveToStorage();
        });
    });
}

// ===== ACTUALIZAR VISTA PREVIA =====
function updatePreview() {
    const data = state.cvData.personal;
    const preview = document.getElementById('cvPreview');
    if (!preview) return;
    
    // Actualizar información personal
    const nameElement = preview.querySelector('.cv-name');
    const titleElement = preview.querySelector('.cv-title');
    
    if (nameElement && data.name) nameElement.textContent = data.name;
    if (titleElement && data.title) titleElement.textContent = data.title;
    
    // Actualizar contacto
    const contact = preview.querySelector('.cv-contact');
    if (contact) {
        if (data.phone) {
            const phoneSpan = contact.querySelector('span:nth-child(1)');
            if (phoneSpan) {
                phoneSpan.innerHTML = `<i class="fas fa-phone"></i> ${data.phone}`;
            }
        }
        if (data.email) {
            const emailSpan = contact.querySelector('span:nth-child(2)');
            if (emailSpan) {
                emailSpan.innerHTML = `<i class="fas fa-envelope"></i> ${data.email}`;
            }
        }
    }
    
    // Actualizar perfil
    if (data.summary) {
        const summaryElement = preview.querySelector('.cv-section p');
        if (summaryElement) {
            summaryElement.textContent = data.summary;
        }
    }
    
    // Actualizar experiencia
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
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('¿Borrar todos los datos y empezar de nuevo?')) {
                clearAllData();
            }
        });
    }
    
    // Botón "Descargar PDF"
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            alert('La descarga de PDF se implementará en la Fase 2');
        });
    }
    
    // Enlace Premium
    const premiumLink = document.getElementById('premiumLink');
    if (premiumLink) {
        premiumLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPremiumModal();
        });
    }
    
    // Cerrar modal
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            const modal = document.getElementById('premiumModal');
            if (modal) modal.classList.remove('active');
        });
    }
}

// ===== MODAL PREMIUM =====
function showPremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) modal.classList.add('active');
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
