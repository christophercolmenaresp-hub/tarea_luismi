// Lógica de la App DevPulse
document.addEventListener('DOMContentLoaded', () => {
    console.log('DevPulse inicializado 🚀');

    const contenedorPublicaciones = document.getElementById('contenedor-publicaciones');
    const itemsNav = document.querySelectorAll('.item-nav');
    const areaTextoPublicacion = document.querySelector('textarea');
    const botonPublicar = document.querySelector('button[style*="var(--color-primary)"]');

    // Datos de Muestra
    const publicaciones = [
        {
            id: 1,
            autor: 'Juan Reis',
            arroba: '@jreis',
            tiempo: '2h',
            contenido: 'Acabo de terminar la lógica de los hilos de respuesta para DevPulse. ¡La interacción va a ser súper fluida! 🚀 #DevPulse #WebDev',
            tipo: 'social',
            estadisticas: { comentarios: 12, compartidos: 5, me_gusta: 42 }
        },
        {
            id: 2,
            autor: 'Christopher',
            arroba: '@chris_master',
            tiempo: '4h',
            contenido: '¿Cómo optimizar el renderizado de listas en Vanilla JS? He encontrado que usando un fragmento de documento (DocumentFragment) antes de añadir al DOM mejora el rendimiento un 40%.',
            tipo: 'qa',
            titulo: '¿Cómo optimizar el renderizado de listas en Vanilla JS?',
            estado: 'Pregunta Resuelta',
            estadisticas: { comentarios: 28, me_gusta: 156, guardados: 4 }
        },
        {
            id: 3,
            autor: 'Iván Rodriguez',
            arroba: '@ivan_ui',
            tiempo: '6h',
            contenido: 'Integrando el sistema de diseño glassmorphism en el feed principal. El desenfoque de fondo dinámico le da un toque premium brutal. ✨',
            tipo: 'social',
            estadisticas: { comentarios: 8, compartidos: 2, me_gusta: 31 }
        }
    ];

    // Mostrar Publicaciones
    function mostrarPublicaciones() {
        if (!contenedorPublicaciones) return;
        contenedorPublicaciones.innerHTML = '';
        
        // Ordenar por ID descendente (más nuevos primero)
        [...publicaciones].sort((a, b) => b.id - a.id).forEach(publicacion => {
            const articulo = document.createElement('article');
            articulo.className = 'publicacion';

            let cuerpoPublicacion = '';
            if (publicacion.tipo === 'qa') {
                cuerpoPublicacion = `
                    <div class="insignia-resuelto">✓ ${publicacion.estado}</div>
                    <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${publicacion.titulo}</h3>
                    <p>${publicacion.contenido}</p>
                `;
            } else {
                cuerpoPublicacion = `<div class="contenido-publicacion">${publicacion.contenido}</div>`;
            }

            articulo.innerHTML = `
                <div class="cabecera-publicacion">
                    <div class="avatar"></div>
                    <div>
                        <span class="autor-publicacion">${publicacion.autor}</span>
                        <span class="arroba-publicacion">${publicacion.arroba} · ${publicacion.tiempo}</span>
                    </div>
                </div>
                ${cuerpoPublicacion}
                <div class="acciones-publicacion">
                    <span class="boton-accion" onclick="this.style.color='var(--color-primary)'">💬 ${publicacion.estadisticas.comentarios}</span>
                    <span class="boton-accion" onclick="this.style.color='var(--color-secondary)'">
                        ${publicacion.tipo === 'qa' ? (publicacion.estadisticas.me_gusta) : ('🔁 ' + (publicacion.estadisticas.compartidos || 0))}
                    </span>
                    <span class="boton-accion" onclick="this.classList.toggle('gustado')">
                        ${publicacion.tipo === 'qa' ? ('📚 ' + publicacion.estadisticas.guardados) : ('❤️ ' + publicacion.estadisticas.me_gusta)}
                    </span>
                </div>
            `;
            contenedorPublicaciones.appendChild(articulo);
        });
    }

    // Lógica de publicación
    if (botonPublicar) {
        botonPublicar.onclick = () => {
            const contenido = areaTextoPublicacion.value.trim();
            if (!contenido) return;

            const nuevaPublicacion = {
                id: Date.now(),
                autor: 'Invitado',
                arroba: '@invitado',
                tiempo: 'ahora',
                contenido: contenido,
                tipo: 'social',
                estadisticas: { comentarios: 0, compartidos: 0, me_gusta: 0 }
            };

            publicaciones.push(nuevaPublicacion);
            areaTextoPublicacion.value = '';
            mostrarPublicaciones();
            
            // Feedback sutil de animación
            botonPublicar.style.transform = 'scale(0.9)';
            setTimeout(() => botonPublicar.style.transform = 'scale(1)', 100);
        };
    }

    // Lógica de navegación
    itemsNav.forEach(item => {
        item.addEventListener('click', (e) => {
            const destino = item.getAttribute('href');
            if (destino && destino !== '#') return;
            
            e.preventDefault();
            itemsNav.forEach(i => i.classList.remove('activo'));
            item.classList.add('activo', 'brillo-activo');

            // Simulación de filtrado
            const comunidad = item.innerText.toLowerCase().trim();
            console.log(`Filtrando por: ${comunidad}`);
        });
    });

    // Renderizado inicial
    mostrarPublicaciones();

    // Efecto de pulso en elementos activos
    const estilo = document.createElement('style');
    estilo.innerHTML = `
        .brillo-activo {
            box-shadow: 0 0 15px var(--color-primary-glow);
            transition: box-shadow 0.3s ease;
        }
        .boton-accion { cursor: pointer; transition: 0.2s; padding: 4px 8px; border-radius: 4px; }
        .boton-accion:hover { background: rgba(255,255,255,0.05); }
        .gustado { color: #f91880 !important; font-weight: bold; text-shadow: 0 0 10px rgba(249, 24, 128, 0.3); }
    `;
    document.head.appendChild(estilo);
});

