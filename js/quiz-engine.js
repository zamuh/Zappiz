/**
 * ZAPPIZ — Motor de Quiz Genérico
 * Archivo: /js/quiz-engine.js
 * ============================================================
 * Motor reutilizable para todos los quizzes de Zappiz.
 *
 * CÓMO CREAR UN NUEVO QUIZ:
 * 1. Crea /quizzes/tu-quiz/questions.js con el objeto window.QUIZ_CONFIG
 * 2. Crea /quizzes/tu-quiz/index.html con la estructura HTML requerida
 * 3. Carga questions.js ANTES que quiz-engine.js en el HTML
 * 4. El motor se inicializa automáticamente al cargar la página
 *
 * ESTRUCTURA DE window.QUIZ_CONFIG:
 * {
 *   title:           string  — Título del quiz (para <title>)
 *   subtitle:        string  — Subtítulo descriptivo
 *   category:        string  — Categoría (ej. "Personalidad")
 *   shareText:       string  — Texto para compartir. Usa {result}, {emoji}, {url}
 *   shareUrl:        string  — URL canónica del quiz
 *   questions: [            — Array de preguntas (orden aleatorio opcional)
 *     {
 *       id:      number,
 *       text:    string,    — Texto de la pregunta
 *       options: [
 *         { text: string, type: string }  — type debe coincidir con una clave de results
 *       ]
 *     }
 *   ],
 *   results: {              — Objeto indexado por tipo
 *     [tipo]: {
 *       title:       string,  — Nombre del tipo de resultado
 *       emoji:       string,  — Emoji representativo
 *       color:       string,  — Color hex del tipo (para futuros usos)
 *       description: string   — Descripción del tipo (3-4 líneas)
 *     }
 *   }
 * }
 *
 * ESTRUCTURA HTML REQUERIDA (IDs que el motor busca):
 * #quiz-question-section  — Contenedor de la sección de preguntas
 * #quiz-results-section   — Contenedor de la sección de resultados
 * #question-card          — Tarjeta animada de la pregunta
 * #question-number        — Texto "Pregunta X de Y"
 * #question-text          — Texto de la pregunta actual
 * #answers-grid           — Contenedor de los botones de respuesta
 * #progress-fill          — Elemento de la barra de progreso (width%)
 * #progress-step          — Número de pregunta actual
 * #progress-total         — Total de preguntas
 * #progress-aria          — Elemento con aria-valuenow/max para accesibilidad
 * #result-emoji           — Emoji del resultado
 * #result-type-label      — Etiqueta "Tu tipo de personalidad es"
 * #result-title           — Nombre del tipo ganador
 * #result-description     — Descripción del tipo ganador
 * #result-compat          — Contenedor de barras de compatibilidad
 * #btn-share              — Botón de compartir resultado
 * #btn-retry              — Botón de reiniciar quiz
 * #ad-banner-middle       — Zona de anuncio intermedio (opcional)
 * #more-quizzes-section   — Sección "Más quizzes" (opcional)
 * ============================================================
 */

'use strict';

const ZappizEngine = (() => {

  /* ────────────────────────────────────────────────────
   * ESTADO DEL QUIZ
   * ──────────────────────────────────────────────────── */
  let state = {
    config:          null,   // Configuración del quiz (window.QUIZ_CONFIG)
    currentIndex:    0,      // Índice de la pregunta actual
    scores:          {},     // Puntuaciones acumuladas por tipo { tipo: puntos }
    isTransitioning: false,  // Bloquea clicks durante animaciones
    totalQuestions:  0,      // Caché del total de preguntas
  };

  /* ────────────────────────────────────────────────────
   * REFERENCIAS A ELEMENTOS DEL DOM
   * ──────────────────────────────────────────────────── */
  let el = {};

  /* ────────────────────────────────────────────────────
   * INICIALIZACIÓN
   * ──────────────────────────────────────────────────── */

  /**
   * Punto de entrada principal del motor.
   * Lee window.QUIZ_CONFIG y arranca el quiz.
   */
  function init() {
    // Verificar que existe la configuración del quiz
    if (!window.QUIZ_CONFIG) {
      console.error('[ZappizEngine] Error: window.QUIZ_CONFIG no encontrado.');
      console.error('[ZappizEngine] Asegúrate de cargar questions.js ANTES que quiz-engine.js');
      return;
    }

    state.config = window.QUIZ_CONFIG;
    state.totalQuestions = state.config.questions.length;

    // Inicializar puntuaciones a 0 para cada tipo de resultado
    Object.keys(state.config.results).forEach(type => {
      state.scores[type] = 0;
    });

    // Cachear referencias a los elementos del DOM
    _cacheElements();

    // Configurar título de la página
    if (state.config.title) {
      document.title = `${state.config.title} | Zappiz`;
    }

    // Configurar botón de reinicio (puede estar visible desde el principio)
    if (el.retryBtn) {
      el.retryBtn.addEventListener('click', resetQuiz);
    }

    // Configurar navegación por teclado (teclas 1-4)
    _setupKeyboardNav();

    // Renderizar la primera pregunta
    _renderQuestion(0, false);
  }

  /**
   * Cachea todos los elementos del DOM que el motor necesita.
   * Se llama una sola vez en init().
   */
  function _cacheElements() {
    el = {
      questionSection:  document.getElementById('quiz-question-section'),
      resultsSection:   document.getElementById('quiz-results-section'),
      questionCard:     document.getElementById('question-card'),
      questionNumber:   document.getElementById('question-number'),
      questionText:     document.getElementById('question-text'),
      answersGrid:      document.getElementById('answers-grid'),
      progressFill:     document.getElementById('progress-fill'),
      progressStep:     document.getElementById('progress-step'),
      progressTotal:    document.getElementById('progress-total'),
      progressAria:     document.getElementById('progress-aria'),
      resultEmoji:      document.getElementById('result-emoji'),
      resultTypeLabel:  document.getElementById('result-type-label'),
      resultTitle:      document.getElementById('result-title'),
      resultDesc:       document.getElementById('result-description'),
      resultCompat:     document.getElementById('result-compat'),
      shareBtn:         document.getElementById('btn-share'),
      retryBtn:         document.getElementById('btn-retry'),
      adMiddle:         document.getElementById('ad-banner-middle'),
      moreQuizzes:      document.getElementById('more-quizzes-section'),
    };
  }

  /* ────────────────────────────────────────────────────
   * RENDERIZADO DE PREGUNTAS
   * ──────────────────────────────────────────────────── */

  /**
   * Renderiza la pregunta correspondiente al índice dado.
   * @param {number} index   - Índice de la pregunta (0-based)
   * @param {boolean} animate - Si debe animar la entrada (por defecto true)
   */
  function _renderQuestion(index, animate = true) {
    const question = state.config.questions[index];
    const total    = state.totalQuestions;

    if (!question) {
      // No hay más preguntas → mostrar resultados
      _showResults();
      return;
    }

    // Actualizar barra de progreso
    _updateProgress(index, total);

    // Actualizar textos de la pregunta
    el.questionNumber.textContent = `Pregunta ${index + 1} de ${total}`;
    el.questionText.textContent   = question.text;

    // Construir botones de respuesta
    const letters = ['A', 'B', 'C', 'D', 'E'];
    el.answersGrid.innerHTML = '';
    question.options.forEach((option, i) => {
      el.answersGrid.appendChild(
        _createAnswerButton(option, letters[i], i)
      );
    });

    // Animar entrada de la tarjeta
    if (animate) {
      el.questionCard.classList.remove('exiting');
      el.questionCard.classList.add('entering');
      setTimeout(() => el.questionCard.classList.remove('entering'), 420);
    }

    // Mover foco al primer botón (accesibilidad)
    setTimeout(() => {
      const firstBtn = el.answersGrid.querySelector('.answer-btn');
      if (firstBtn) firstBtn.focus({ preventScroll: true });
    }, 380);

    // Mostrar banner de anuncio intermedio cada 4 preguntas
    if (el.adMiddle) {
      el.adMiddle.style.display = (index > 0 && index % 4 === 0) ? 'flex' : 'none';
    }
  }

  /**
   * Crea un botón de respuesta HTML.
   * @param {Object} option  - { text, type }
   * @param {string} letter  - Letra de la opción (A, B, C, D)
   * @param {number} index   - Índice dentro de la pregunta
   * @returns {HTMLButtonElement}
   */
  function _createAnswerButton(option, letter, index) {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.setAttribute('data-type', option.type);
    btn.setAttribute('data-index', index);
    btn.setAttribute('aria-label', `Opción ${letter}: ${option.text}`);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');

    btn.innerHTML = `
      <span class="answer-btn-letter" aria-hidden="true">${letter}</span>
      <span class="answer-btn-text">${option.text}</span>
    `;

    btn.addEventListener('click', () => _handleAnswer(btn, option.type));
    return btn;
  }

  /* ────────────────────────────────────────────────────
   * MANEJO DE RESPUESTAS
   * ──────────────────────────────────────────────────── */

  /**
   * Procesa la selección de una respuesta:
   * 1. Resalta el botón seleccionado
   * 2. Deshabilita todos los botones
   * 3. Suma punto al tipo correspondiente
   * 4. Después de 500ms, transiciona a la siguiente pregunta
   *
   * @param {HTMLElement} btn  - Botón clickeado
   * @param {string}      type - Tipo de personalidad de esta opción
   */
  function _handleAnswer(btn, type) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    // Feedback visual: resaltar selección
    btn.classList.add('selected');
    btn.setAttribute('aria-checked', 'true');

    // Deshabilitar todos los botones de esta pregunta
    const allBtns = el.answersGrid.querySelectorAll('.answer-btn');
    allBtns.forEach(b => {
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
    });

    // Acumular puntuación
    state.scores[type] = (state.scores[type] || 0) + 1;

    // Delay de 500ms antes de pasar a la siguiente pregunta
    setTimeout(_transitionNext, 500);
  }

  /**
   * Ejecuta la transición animada a la siguiente pregunta.
   */
  function _transitionNext() {
    // Animar salida de la tarjeta actual
    el.questionCard.classList.add('exiting');

    setTimeout(() => {
      el.questionCard.classList.remove('exiting');
      state.currentIndex++;
      state.isTransitioning = false;

      if (state.currentIndex >= state.totalQuestions) {
        _showResults();
      } else {
        _renderQuestion(state.currentIndex);
      }
    }, 320);
  }

  /* ────────────────────────────────────────────────────
   * PROGRESO
   * ──────────────────────────────────────────────────── */

  /**
   * Actualiza la barra de progreso visual y los atributos ARIA.
   * @param {number} current - Índice actual (0-based)
   * @param {number} total   - Total de preguntas
   */
  function _updateProgress(current, total) {
    const pct = (current / total) * 100;

    if (el.progressFill)  el.progressFill.style.width = `${pct}%`;
    if (el.progressStep)  el.progressStep.textContent = current + 1;
    if (el.progressTotal) el.progressTotal.textContent = total;

    // Accesibilidad: actualizar atributos del progressbar
    if (el.progressAria) {
      el.progressAria.setAttribute('aria-valuenow', current + 1);
      el.progressAria.setAttribute('aria-valuemin', '1');
      el.progressAria.setAttribute('aria-valuemax', total);
    }
  }

  /* ────────────────────────────────────────────────────
   * RESULTADOS
   * ──────────────────────────────────────────────────── */

  /**
   * Calcula el tipo ganador, oculta las preguntas y muestra la pantalla de resultados.
   */
  function _showResults() {
    // Calcular el tipo con más puntos
    const winnerType = Object.entries(state.scores)
      .reduce((best, curr) => curr[1] > best[1] ? curr : best)[0];

    const result     = state.config.results[winnerType];
    const totalPts   = Object.values(state.scores).reduce((a, b) => a + b, 0);

    // Ocultar sección de preguntas
    if (el.questionSection) el.questionSection.style.display = 'none';

    // Mostrar sección de resultados
    if (el.resultsSection) el.resultsSection.classList.add('visible');

    // Progreso al 100%
    if (el.progressFill) el.progressFill.style.width = '100%';
    if (el.progressStep) el.progressStep.textContent = state.totalQuestions;

    // Rellenar contenido del resultado
    if (el.resultEmoji)     el.resultEmoji.textContent = result.emoji;
    if (el.resultTypeLabel) el.resultTypeLabel.textContent = 'Tu tipo de personalidad es';
    if (el.resultTitle)     el.resultTitle.textContent     = result.title;
    if (el.resultDesc)      el.resultDesc.textContent      = result.description;

    // Barras de compatibilidad
    if (el.resultCompat) {
      _renderCompatBars(state.scores, totalPts, winnerType);
    }

    // Configurar botón de compartir
    _setupShareButton(result);

    // Mostrar sección "Más quizzes"
    if (el.moreQuizzes) el.moreQuizzes.style.display = 'block';

    // Scroll suave al inicio de los resultados
    setTimeout(() => {
      if (el.resultsSection) {
        el.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);

    // Animar barras de compatibilidad con delay
    setTimeout(_animateCompatBars, 700);
  }

  /**
   * Renderiza las barras de compatibilidad en el DOM.
   * Ordena los tipos de mayor a menor puntuación.
   *
   * @param {Object} scores    - { tipo: puntos }
   * @param {number} total     - Total de puntos sumados
   * @param {string} winner    - Tipo ganador
   */
  function _renderCompatBars(scores, total, winner) {
    el.resultCompat.innerHTML = `<p class="compat-title">Compatibilidad con cada perfil</p>`;

    // Ordenar tipos por puntuación descendente
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    sorted.forEach(([type, score]) => {
      const result  = state.config.results[type];
      const percent = total > 0 ? Math.round((score / total) * 100) : 0;
      const isWinner = type === winner;

      const row = document.createElement('div');
      row.className = 'compat-bar';
      row.innerHTML = `
        <span class="compat-bar-label" title="${result.title}">
          ${result.emoji} ${result.title}${isWinner ? ' ✦' : ''}
        </span>
        <div class="compat-bar-track"
             role="progressbar"
             aria-label="${result.title}: ${percent}%"
             aria-valuenow="${percent}"
             aria-valuemin="0"
             aria-valuemax="100">
          <div class="compat-bar-fill type-${type}"
               data-percent="${percent}"
               style="width: 0%"></div>
        </div>
        <span class="compat-bar-percent">${percent}%</span>
      `;
      el.resultCompat.appendChild(row);
    });
  }

  /**
   * Anima las barras de compatibilidad de 0% a su valor real, con stagger.
   */
  function _animateCompatBars() {
    const bars = document.querySelectorAll('.compat-bar-fill');
    bars.forEach((bar, i) => {
      const pct = bar.getAttribute('data-percent');
      setTimeout(() => { bar.style.width = `${pct}%`; }, i * 120);
    });
  }

  /* ────────────────────────────────────────────────────
   * COMPARTIR
   * ──────────────────────────────────────────────────── */

  /**
   * Configura el listener del botón de compartir.
   * @param {Object} result - El resultado ganador
   */
  function _setupShareButton(result) {
    if (!el.shareBtn) return;

    // Eliminar listeners anteriores clonando el botón
    const newShareBtn = el.shareBtn.cloneNode(true);
    el.shareBtn.parentNode.replaceChild(newShareBtn, el.shareBtn);
    el.shareBtn = newShareBtn;

    el.shareBtn.addEventListener('click', () => {
      const url = state.config.shareUrl || window.location.href;
      const text = (state.config.shareText || 'Mi personalidad es {emoji} {result}! Descúbrela en {url} 🧠 #Zappiz')
        .replace('{result}', result.title)
        .replace('{emoji}',  result.emoji)
        .replace('{url}',    url);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => _showCopyFeedback(el.shareBtn))
          .catch(() => _fallbackCopy(text));
      } else {
        _fallbackCopy(text);
      }
    });
  }

  /**
   * Cambia temporalmente el texto del botón para confirmar la copia.
   * @param {HTMLElement} btn - Botón de compartir
   */
  function _showCopyFeedback(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ ¡Copiado al portapapeles!';
    btn.style.background = 'var(--brand-accent)';
    btn.style.color      = 'var(--brand-dark)';

    setTimeout(() => {
      btn.innerHTML       = orig;
      btn.style.background = '';
      btn.style.color      = '';
    }, 2600);
  }

  /**
   * Fallback de copia para navegadores sin Clipboard API.
   * @param {string} text - Texto a copiar
   */
  function _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); _showCopyFeedback(el.shareBtn); }
    catch (e) { console.warn('[ZappizEngine] No se pudo copiar al portapapeles:', e); }
    document.body.removeChild(ta);
  }

  /* ────────────────────────────────────────────────────
   * REINICIAR
   * ──────────────────────────────────────────────────── */

  /**
   * Reinicia el quiz completamente al estado inicial.
   * Se puede llamar desde el botón "Repetir quiz" o externamente.
   */
  function resetQuiz() {
    // Reiniciar estado
    state.currentIndex    = 0;
    state.isTransitioning = false;
    Object.keys(state.scores).forEach(t => { state.scores[t] = 0; });

    // Mostrar preguntas, ocultar resultados
    if (el.questionSection) el.questionSection.style.display = 'block';
    if (el.resultsSection)  el.resultsSection.classList.remove('visible');
    if (el.moreQuizzes)     el.moreQuizzes.style.display = 'none';

    // Renderizar primera pregunta sin animación
    _renderQuestion(0, false);

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ────────────────────────────────────────────────────
   * NAVEGACIÓN POR TECLADO
   * ──────────────────────────────────────────────────── */

  /**
   * Permite seleccionar respuestas con las teclas 1, 2, 3, 4.
   * Solo actúa cuando la pantalla de preguntas está activa.
   */
  function _setupKeyboardNav() {
    const keyToIndex = { '1': 0, '2': 1, '3': 2, '4': 3 };

    document.addEventListener('keydown', e => {
      // No actuar si estamos en resultados o transicionando
      if (state.isTransitioning) return;
      if (el.resultsSection && el.resultsSection.classList.contains('visible')) return;

      const idx = keyToIndex[e.key];
      if (idx !== undefined) {
        const btns = el.answersGrid.querySelectorAll('.answer-btn:not(:disabled)');
        if (btns[idx]) btns[idx].click();
      }
    });
  }

  /* ────────────────────────────────────────────────────
   * API PÚBLICA
   * ──────────────────────────────────────────────────── */
  return {
    init,
    reset: resetQuiz,
    /**
     * Devuelve las puntuaciones actuales (útil para analytics externos).
     * @returns {Object} { tipo: puntos }
     */
    getScores: () => ({ ...state.scores }),
    /**
     * Devuelve el índice de la pregunta actual.
     * @returns {number}
     */
    getCurrentIndex: () => state.currentIndex,
  };

})();

/* ────────────────────────────────────────────────────
 * AUTO-INICIALIZACIÓN
 * Espera a que el DOM esté completamente cargado.
 * ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ZappizEngine.init();
});
