/**
 * ARCHIVO DE LÓGICA CENTRAL - script.js (VANILLA)
 * Versión 100% nativa sin React, Tailwind ni librerías externas.
 */

const DATOS_QUIZ = {
    java: {
        titulo: 'Desafío Java',
        niveles: [
            {
                codigo: `public class Principal {\n    public static void main(String[] args) {\n        System.out.println("Hola Mundo")\n    }\n}`,
                lineaError: 3,
                explicacion: 'En Java, todas las sentencias deben terminar con un punto y coma (;).',
                pista: 'Falta un terminador de sentencia en la línea donde imprimes el mensaje.'
            }
        ]
    },
    python: {
        titulo: 'Desafío Python',
        niveles: [
            {
                codigo: `def saludo():\nprint("Hola")`,
                lineaError: 2,
                explicacion: 'En Python, la identación es obligatoria para definir bloques de código.',
                pista: 'Revisa el espacio antes de la función print.'
            }
        ]
    },
    cpp: {
        titulo: 'Desafío C++',
        niveles: [
            {
                codigo: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = nullptr;\n    *p = 10;\n    return 0;\n}`,
                lineaError: 6,
                explicacion: 'Estás intentando desreferenciar un puntero nulo (nullptr).',
                pista: '¿Hacia dónde apunta "p" antes de asignar un valor?'
            }
        ]
    },
    javascript: {
        titulo: 'Desafío JavaScript',
        niveles: [
            {
                codigo: `const usuario = { nombre: "Alex" };\nusuario = { nombre: "Maria" };`,
                lineaError: 2,
                explicacion: 'Las variables declaradas con "const" no pueden ser reasignadas.',
                pista: '¿Qué tipo de declaración impide la reasignación total?'
            }
        ]
    }
};

// --- MOTOR DEL JUEGO (Vanilla JS) ---

class MotorQuiz {
    constructor(lenguaje) {
        this.lenguaje = lenguaje;
        this.nivelActual = 0;
        this.puntuacion = 0;
        this.datos = DATOS_QUIZ[lenguaje] || DATOS_QUIZ.java;
        this.estado = 'jugando';
        this.contenedor = document.getElementById('raiz');
        this.dibujarCuerpo();
    }

    dibujarCuerpo() {
        if (!this.contenedor) return;
        this.contenedor.innerHTML = '';

        if (this.estado === 'finalizado') {
            this.mostrarPantallaFinal();
            return;
        }

        const nivel = this.datos.niveles[this.nivelActual];

        // Estructura principal
        const html = `
            <div class="contenedor-quiz">
                <button class="boton-volver" onclick="window.location.href='quiz.html'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Volver al menú
                </button>

                <div class="barra-superior flex entre centro">
                    <div>
                        <h2 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; border-bottom: 4px solid var(--color-azul); display: inline-block;">${this.datos.titulo}</h2>
                        <p style="color: var(--color-slate-500); font-weight: 500;">Nivel ${this.nivelActual + 1} de ${this.datos.niveles.length}</p>
                    </div>
                    <div class="puntuacion-caja flex centro gap-4">
                        <span style="font-size: 0.7rem; font-weight: 800; color: var(--color-slate-500); letter-spacing: 0.1rem;">PUNTOS</span>
                        <span style="font-size: 2rem; font-weight: 900; color: var(--color-azul-brillante);">${this.puntuacion}</span>
                    </div>
                </div>

                <div class="editor-ventana">
                    <div class="editor-barra flex entre centro">
                        <div class="flex centro gap-2" style="color: var(--color-slate-500); font-weight: bold; font-size: 0.8rem;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                            editor_codigo.${this.lenguaje}
                        </div>
                        <div class="flex gap-2">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-slate-700);"></div>
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-slate-700);"></div>
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-slate-700);"></div>
                        </div>
                    </div>
                    <div class="editor-codigo" id="area-codigo"></div>
                </div>

                <div class="flex centro gap-2" style="margin-top: 2rem; color: var(--color-azul); font-weight: bold; font-size: 0.8rem; opacity: 0.8;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    ENCUENTRA EL ERROR Y HAZ CLIC EN LA LÍNEA
                </div>
            </div>
        `;
        this.contenedor.innerHTML = html;
        this.renderizarLineas(nivel.codigo);
    }

    renderizarLineas(codigo) {
        const area = document.getElementById('area-codigo');
        const lineas = codigo.split('\n');

        lineas.forEach((texto, i) => {
            const div = document.createElement('div');
            div.className = 'linea-codigo';
            div.onclick = () => this.verificarLinea(i + 1);
            div.innerHTML = `
                <span class="numero-linea">${i + 1}</span>
                <span style="white-space: pre;">${texto || ' '}</span>
            `;
            area.appendChild(div);
        });
    }

    verificarLinea(numero) {
        const nivel = this.datos.niveles[this.nivelActual];
        if (numero === nivel.lineaError) {
            this.puntuacion += 100;
            this.lanzarMensaje('¡Correcto!', nivel.explicacion, 'success');
        } else {
            this.lanzarMensaje('¡Vuelve a intentarlo!', 'Esa línea es correcta. Busca bien el error.', 'error', true);
        }
    }

    lanzarMensaje(titulo, mensaje, tipo, conPista = false) {
        const modal = document.createElement('div');
        modal.className = 'capa-modal';

        const nivel = this.datos.niveles[this.nivelActual];
        const esUltimo = this.nivelActual === this.datos.niveles.length - 1;

        modal.innerHTML = `
            <div class="caja-modal">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: ${tipo === 'success' ? 'var(--color-esmeralda)' : 'white'}">${titulo}</h2>
                <p style="color: var(--color-slate-500); line-height: 1.6;">${mensaje}</p>
                ${conPista ? `<button class="boton-secundario" id="btn-pista">Pedir Pista</button>` : ''}
                <button class="boton-principal" id="btn-sig">${tipo === 'success' ? (esUltimo ? 'Ver Resultado' : 'Siguiente Nivel') : 'Intentar de nuevo'}</button>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('btn-sig').onclick = () => {
            document.body.removeChild(modal);
            if (tipo === 'success') {
                if (esUltimo) {
                    this.estado = 'finalizado';
                } else {
                    this.nivelActual++;
                }
                this.dibujarCuerpo();
            }
        };

        if (conPista) {
            document.getElementById('btn-pista').onclick = () => {
                this.lanzarMensaje('Pista', nivel.pista, 'info');
            };
        }
    }

    mostrarPantallaFinal() {
        this.contenedor.innerHTML = `
            <div class="contenedor-quiz" style="text-align: center; padding: 4rem 2rem;">
                <div style="font-size: 5rem; color: var(--color-esmeralda); margin-bottom: 2rem;">🏆</div>
                <h2 style="font-size: 3rem; font-weight: 900; margin-bottom: 1rem;">¡Desafío Completado!</h2>
                <p style="color: var(--color-slate-500); font-size: 1.1rem; margin-bottom: 3rem;">Has demostrado tus habilidades en ${this.datos.titulo}.</p>
                <div style="font-size: 5rem; font-weight: 900; color: var(--color-azul-brillante); margin-bottom: 4rem;">
                    ${this.puntuacion} <span style="font-size: 1.5rem; color: var(--color-slate-500);">PTS</span>
                </div>
                <button class="boton-principal" onclick="window.location.href='quiz.html'">Volver al menú</button>
            </div>
        `;
    }
}

// Inicializador global
window.iniciarJuego = (lenguaje) => {
    new MotorQuiz(lenguaje);
};