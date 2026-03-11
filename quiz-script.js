/**
 * ARCHIVO DE LÓGICA CENTRAL - script.js (VANILLA)
 * Versión 100% nativa sin React, Tailwind ni librerías externas.
 */

const DATOS_QUIZ = {
    cpp: {
        titulo: 'Desafío C++',
        niveles: [
            {
                codigo: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = nullptr;\n    *p = 10;\n    return 0;\n}`,
                lineaError: 6,
                explicacion: 'Estás intentando desreferenciar un puntero nulo (nullptr).',
                pista: '¿Hacia dónde apunta "p" antes de asignar un valor?'
            },
            {
                codigo: `int main() {\n    int arr[5];\n    arr[5] = 100;\n    return 0;\n}`,
                lineaError: 3,
                explicacion: 'Acceso fuera de los límites del array (Index out of bounds).',
                pista: 'Si el tamaño es 5, ¿cuál es el último índice válido?'
            },
            {
                codigo: `#include <iostream>\n\nint main() {\n    std::cout << "Hola" << std::endl\n    return 0;\n}`,
                lineaError: 4,
                explicacion: 'Falta el punto y coma (;) al final de la instrucción de salida.',
                pista: 'Revisa el final de la línea del cout.'
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
            },
            {
                codigo: `function test() {\n    console.log(valor);\n    let valor = 10;\n}`,
                lineaError: 2,
                explicacion: 'No puedes acceder a una variable "let" antes de su declaración (Temporal Dead Zone).',
                pista: 'El orden de ejecución importa con let.'
            },
            {
                codigo: `const suma = (a, b) => a + b\nconsole.log(suma(5))`,
                lineaError: 2,
                explicacion: 'Llamaste a la función con menos argumentos de los requeridos (b será undefined).',
                pista: 'La función espera dos números, pero solo pasaste uno.'
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
        this.datos = DATOS_QUIZ[lenguaje] || DATOS_QUIZ.javascript;
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
        const porcentaje = Math.round((this.puntuacion / (this.datos.niveles.length * 100)) * 100);
        let mensaje = '';
        let emoji = '';
        
        if (porcentaje === 100) {
            mensaje = '¡Eres un auténtico Master! Dominio total.';
            emoji = '👑';
        } else if (porcentaje >= 70) {
            mensaje = '¡Muy buen trabajo! Tienes bases sólidas.';
            emoji = '⭐';
        } else {
            mensaje = '¡Sigue practicando! El código se domina con tiempo.';
            emoji = '📚';
        }

        this.contenedor.innerHTML = `
            <div class="contenedor-quiz" style="text-align: center; padding: 3rem 2rem; animation: fadeIn 0.8s ease-out;">
                <div style="font-size: 6rem; margin-bottom: 2rem; filter: drop-shadow(0 0 20px rgba(255,255,255,0.2));">${emoji}</div>
                <h2 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; color: white;">${this.datos.titulo} Completado</h2>
                <p style="color: var(--color-slate-400); font-size: 1.25rem; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">${mensaje}</p>
                
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 2rem; padding: 2.5rem; display: inline-block; margin-bottom: 3rem; min-width: 300px;">
                    <div style="font-size: 1rem; color: var(--color-slate-500); font-weight: 800; letter-spacing: 0.2rem; margin-bottom: 0.5rem; text-transform: uppercase;">Puntuación Final</div>
                    <div style="font-size: 4.5rem; font-weight: 900; color: var(--color-azul-brillante); line-height: 1;">
                        ${this.puntuacion}
                    </div>
                    <div style="margin-top: 1rem; color: var(--color-slate-400); font-weight: 600;">Precisión: ${porcentaje}%</div>
                </div>

                <div style="display: flex; gap: 1.5rem; justify-content: center;">
                    <button class="boton-principal" onclick="window.location.reload()" style="padding: 1rem 2.5rem;">Reintentar</button>
                    <button class="boton-secundario" onclick="window.location.href='quiz.html'" style="padding: 1rem 2.5rem;">Volver al menú</button>
                </div>
            </div>
        `;
    }
}

// Inicializador global
window.iniciarJuego = (lenguaje) => {
    new MotorQuiz(lenguaje);
};