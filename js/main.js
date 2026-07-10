// 1. VARIABLES GLOBALES Y CAPTURA DE ELEMENTOS

const contenedorPosts = document.querySelector('.lista-posts');
const btnRegistro = document.getElementById('registro-emocion');
const btnRedactar = document.getElementById('redactar');
const btnNivelEstres = document.getElementById('nivel-estres');
const btnPerfil = document.getElementById('perfil');
const btnConfig = document.getElementById('config-button');

let posts = [];

// Mapa de estados a emojis
const emojis = {
    'feliz': '😀',
    'triste': '😢',
    'enojado': '😠',
    'tranquilo': '😌',
    'ansioso': '😰'
};


// 2. FUNCIONES DE FECHA Y PERSISTENCIA (igual que antes)

function formatearFecha(fechaInput) {
    if (!fechaInput) return 'Fecha no disponible';
    const partes = fechaInput.split('-');
    const anio = partes[0];
    const mesNum = parseInt(partes[1]) - 1;
    const dia = parseInt(partes[2]);
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${dia} de ${meses[mesNum]}, ${anio}`;
}

function guardarPosts() {
    localStorage.setItem('diarioHumor', JSON.stringify(posts));
}

function cargarPosts() {
    const datos = localStorage.getItem('diarioHumor');
    if (datos) {
        posts = JSON.parse(datos);
    } else {
        // Posts de ejemplo del HTML original
        posts = [
            { id: Date.now() - 4000, emoji: '😡', texto: 'que chinguen a su madre todos, bendecido sea el tab en visual y q no esta tan culero esto.', fecha: '2026-07-09' },
            { id: Date.now() - 3000, emoji: '😀', texto: 'Hoy fue un buen día, terminé mis pendientes y salí a caminar.', fecha: '2026-07-09' },
            { id: Date.now() - 2000, emoji: '😰', texto: 'Me sentí un poco estresado por el trabajo, pero ya está mejor.', fecha: '2026-07-08' },
            { id: Date.now() - 1000, emoji: '😌', texto: 'Día tranquilo, sin muchas sorpresas.', fecha: '2026-07-07' }
        ];
        guardarPosts();
    }
}


// 3. RENDERIZAR POSTS

function renderizarPosts() {
    contenedorPosts.innerHTML = '';
    if (posts.length === 0) {
        contenedorPosts.innerHTML = '<p style="text-align:center; color:#888;">Aún no hay entradas. ¡Publica la primera!</p>';
        return;
    }
    posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post';

        const header = document.createElement('div');
        header.className = 'post-header';

        const spanEmoji = document.createElement('span');
        spanEmoji.className = 'post-emoji';
        spanEmoji.textContent = post.emoji;

        const spanFecha = document.createElement('span');
        spanFecha.className = 'post-fecha';
        spanFecha.textContent = formatearFecha(post.fecha);

        header.appendChild(spanEmoji);
        header.appendChild(spanFecha);

        const parrafo = document.createElement('p');
        parrafo.className = 'post-texto';
        parrafo.textContent = post.texto;

        article.appendChild(header);
        article.appendChild(parrafo);

        contenedorPosts.appendChild(article);
    });
}


/* 4. CREAR Y MOSTRAR EL FORMULARIO MODAL, como lo borraste en el html
   Entendí que se debe de hacer el modal cuando le demos a registrar emoción */

//FUNCIÓN DEL BOTON REISTRAR EMOCION
function crearModalEmocion() {
    // Si ya existe un modal, lo eliminamos para evitar duplicados
    const modalExistente = document.querySelector('.modal-publicacion');
    if (modalExistente) modalExistente.remove();

    // Contenedor del modal (fondo oscuro)
    const modal = document.createElement('div');
    modal.className = 'modal-publicacion';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    `;

    // Tarjeta del formulario
    const card = document.createElement('div');
    card.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
    `;

    // Botón cerrar (X)
    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = '✕';
    btnCerrar.style.cssText = `
        position: absolute;
        top: 10px; right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #888;
    `;
    btnCerrar.addEventListener('click', () => modal.remove());

    // Título
    const titulo = document.createElement('h2');
    titulo.textContent = 'Registrar emoción';
    titulo.style.marginBottom = '1rem';

    // Select de humor
    const labelHumor = document.createElement('label');
    labelHumor.textContent = '¿Cómo te sientes?';
    labelHumor.style.display = 'block';
    labelHumor.style.marginTop = '1rem';

    const selectHumor = document.createElement('select');
    selectHumor.id = 'humor-modal';
    selectHumor.innerHTML = `
        <option value="feliz">😀 Feliz</option>
        <option value="triste">😢 Triste</option>
        <option value="enojado">😠 Enojado</option>
        <option value="tranquilo">😌 Tranquilo</option>
        <option value="ansioso">😰 Ansioso</option>
    `;
    selectHumor.style.cssText = 'width:100%; padding:8px; border-radius:8px; border:1px solid #ccc;';

    // Textarea
    const labelTexto = document.createElement('label');
    labelTexto.textContent = 'Cuéntanos más';
    labelTexto.style.display = 'block';
    labelTexto.style.marginTop = '1rem';

    const textarea = document.createElement('textarea');
    textarea.id = 'texto-modal';
    textarea.rows = 3;
    textarea.placeholder = 'Escribe aquí lo que sientes...';
    textarea.style.cssText = 'width:100%; padding:8px; border-radius:8px; border:1px solid #ccc; resize:vertical;';

    // Fecha
    const labelFecha = document.createElement('label');
    labelFecha.textContent = 'Fecha';
    labelFecha.style.display = 'block';
    labelFecha.style.marginTop = '1rem';

    const inputFecha = document.createElement('input');
    inputFecha.type = 'date';
    inputFecha.id = 'fecha-modal';
    inputFecha.style.cssText = 'width:100%; padding:8px; border-radius:8px; border:1px solid #ccc;';
    // Poner fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.value = hoy;

    // Botón publicar
    const btnPublicar = document.createElement('button');
    btnPublicar.textContent = 'Publicar';
    btnPublicar.style.cssText = `
        width: 100%;
        padding: 12px;
        margin-top: 1.5rem;
        background: #7895ca;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    `;
    btnPublicar.addEventListener('mouseenter', () => btnPublicar.style.background = '#6a84b5');
    btnPublicar.addEventListener('mouseleave', () => btnPublicar.style.background = '#7895ca');

    // Armar la tarjeta
    card.appendChild(btnCerrar);
    card.appendChild(titulo);
    card.appendChild(labelHumor);
    card.appendChild(selectHumor);
    card.appendChild(labelTexto);
    card.appendChild(textarea);
    card.appendChild(labelFecha);
    card.appendChild(inputFecha);
    card.appendChild(btnPublicar);

    modal.appendChild(card);
    document.body.appendChild(modal);

    // --- Lógica de publicación (dentro del modal) ---
    btnPublicar.addEventListener('click', function publicarDesdeModal() {
        const estado = selectHumor.value;
        const texto = textarea.value.trim();
        const fecha = inputFecha.value;

        if (texto === '') {
            alert('Por favor, escribe algo sobre cómo te sientes.');
            return;
        }
        if (fecha === '') {
            alert('Por favor, selecciona una fecha.');
            return;
        }

        const nuevoPost = {
            id: Date.now(),
            emoji: emojis[estado] || '😐',
            texto: texto,
            fecha: fecha
        };

        posts.unshift(nuevoPost);
        guardarPosts();
        renderizarPosts();

        // Cerrar el modal
        modal.remove();
    });

    // Cerrar modal al hacer clic fuera de la tarjeta
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
}


//FUNCIÓN DEL BOTÓN REDACTAR
function crearModalRedactar() {
    // Si ya existe un modal, lo eliminamos
    const modalExistente = document.querySelector('.modal-publicacion');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-publicacion';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    `;

    const card = document.createElement('div');
    card.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
    `;

    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = '✕';
    btnCerrar.style.cssText = `
        position: absolute;
        top: 10px; right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #888;
    `;
    btnCerrar.addEventListener('click', () => modal.remove());

    const titulo = document.createElement('h2');
    titulo.textContent = 'Redactar entrada';
    titulo.style.marginBottom = '1rem';

    const textarea = document.createElement('textarea');
    textarea.id = 'texto-redactar';
    textarea.rows = 5;
    textarea.placeholder = 'Escribe aquí tu reflexión...';
    textarea.style.cssText = 'width:100%; padding:8px; border-radius:8px; border:1px solid #ccc; resize:vertical;';

    // Fecha: la ponemos automática (no se muestra, se usará al guardar)
    const fechaActual = new Date().toISOString().split('T')[0];

    const btnPublicar = document.createElement('button');
    btnPublicar.textContent = 'Publicar';
    btnPublicar.style.cssText = `
        width: 100%;
        padding: 12px;
        margin-top: 1.5rem;
        background: #7895ca;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    `;
    btnPublicar.addEventListener('mouseenter', () => btnPublicar.style.background = '#6a84b5');
    btnPublicar.addEventListener('mouseleave', () => btnPublicar.style.background = '#7895ca');

    card.appendChild(btnCerrar);
    card.appendChild(titulo);
    card.appendChild(textarea);
    card.appendChild(btnPublicar);

    modal.appendChild(card);
    document.body.appendChild(modal);

    // Lógica de publicación
    btnPublicar.addEventListener('click', function publicarRedactar() {
        const texto = textarea.value.trim();
        if (texto === '') {
            alert('Por favor, escribe algo.');
            return;
        }

        const nuevoPost = {
            id: Date.now(),
            emoji: '📝',   // emoji genérico para textos
            texto: texto,
            fecha: fechaActual
        };

        posts.unshift(nuevoPost);
        guardarPosts();
        renderizarPosts();

        modal.remove(); // cerrar modal
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
}

//FUNCIÓN DEL BOTÓN NIVEL DE ESTRÉS
function crearModalEstres() {
    const modalExistente = document.querySelector('.modal-publicacion');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-publicacion';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    `;

    const card = document.createElement('div');
    card.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
    `;

    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = '✕';
    btnCerrar.style.cssText = `
        position: absolute;
        top: 10px; right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #888;
    `;
    btnCerrar.addEventListener('click', () => modal.remove());

    const titulo = document.createElement('h2');
    titulo.textContent = 'Nivel de estrés';
    titulo.style.marginBottom = '1rem';

    const labelNivel = document.createElement('label');
    labelNivel.textContent = 'Selecciona tu nivel de estrés (1 = Mínimo y 10 = máximo):';
    labelNivel.style.display = 'block';
    labelNivel.style.marginTop = '1rem';
    labelNivel.style.fontSize = '0.85rem';

    const selectNivel = document.createElement('select');
    selectNivel.id = 'nivel-estres-select';
    selectNivel.style.cssText = 'width:100%; padding:8px; border-radius:8px; border:1px solid #ccc;';
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectNivel.appendChild(option);
    }

    const labelMotivo = document.createElement('label');
    labelMotivo.textContent = 'Motivo (opcional):';
    labelMotivo.style.display = 'block';
    labelMotivo.style.marginTop = '1rem';
    labelMotivo.style.fontSize = '0.85rem';

    const textareaMotivo = document.createElement('textarea');
    textareaMotivo.id = 'motivo-estres';
    textareaMotivo.rows = 3;
    textareaMotivo.placeholder = '¿Qué está causando tu estrés? (opcional)';
    textareaMotivo.style.cssText = 'width:100%; padding:8px; border-radius:8px; border:1px solid #ccc; resize:vertical;';

    const btnPublicar = document.createElement('button');
    btnPublicar.textContent = 'Publicar';
    btnPublicar.style.cssText = `
        width: 100%;
        padding: 12px;
        margin-top: 1.5rem;
        background: #7895ca;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    `;
    btnPublicar.addEventListener('mouseenter', () => btnPublicar.style.background = '#6a84b5');
    btnPublicar.addEventListener('mouseleave', () => btnPublicar.style.background = '#7895ca');

    card.appendChild(btnCerrar);
    card.appendChild(titulo);
    card.appendChild(labelNivel);
    card.appendChild(selectNivel);
    card.appendChild(labelMotivo);
    card.appendChild(textareaMotivo);
    card.appendChild(btnPublicar);

    modal.appendChild(card);
    document.body.appendChild(modal);

    // Lógica de publicación (solo mensaje)
    btnPublicar.addEventListener('click', function() {
    const nivel = selectNivel.value;
    const motivo = textareaMotivo.value.trim();

    // 1. Primero cerramos el modal (eliminamos del DOM)
    modal.remove();

    // 2. Luego mostramos el mensaje con un pequeño retraso
    //    para que el navegador alcance a repintar y el modal desaparezca.
    setTimeout(() => {
    alert(`Nivel de estrés: ${nivel}/10\n${motivo ? 'Motivo: ' + motivo : 'Sin motivo especificado'}\n\n ¡Registro guardado! Estos datos se usarán para tu seguimiento.`);
    }, 50); //50 milisengundos
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
}

// 5. ASIGNAR EVENTOS A LOS BOTONES DEL NAV

// Botón "Registrar emoción"
if (btnRegistro) {
    btnRegistro.addEventListener('click', crearModalEmocion);
}

// Botón "Redactar"
if (btnRedactar) {
    btnRedactar.addEventListener('click', crearModalRedactar);
}

// Botón "Nivel de estrés"
if (btnNivelEstres) {
    btnNivelEstres.addEventListener('click', crearModalEstres);
}

/* Los demás botones como Perfil y Configuración podrían tener su propia lógica,
   pero por ahora solo se mostrará un mensaje.*/
if (btnPerfil) {
    btnPerfil.addEventListener('click', () => alert('Perfil - próximamente'));
}
if (btnConfig) {
    btnConfig.addEventListener('click', () => alert('Configuración - próximamente'));
}


// 6. INICIALIZACIÓN AL CARGAR LA PÁGINA

cargarPosts();
renderizarPosts();
