/**
 * ZAPPIZ — Quiz de Personalidad: Datos y Configuración
 * Archivo: /quizzes/personalidad/questions.js
 * ============================================================
 * Define window.QUIZ_CONFIG para el quiz "¿Qué tipo de personalidad tienes?"
 *
 * Este archivo es leído automáticamente por /js/quiz-engine.js.
 * Para crear un nuevo quiz, duplica este archivo en otra carpeta,
 * cambia el contenido y cárgalo en el HTML del nuevo quiz.
 *
 * TIPOS DE PERSONALIDAD EVALUADOS:
 * ┌─────────────┬───────┬──────────────────────────────────────────────┐
 * │ Clave       │ Emoji │ Descripción breve                            │
 * ├─────────────┼───────┼──────────────────────────────────────────────┤
 * │ lider       │  🔥   │ Decisivo, ambicioso, dominante               │
 * │ creativo    │  🎨   │ Artístico, soñador, original                 │
 * │ pensador    │  🧠   │ Lógico, metódico, observador                 │
 * │ conector    │  💛   │ Empático, sociable, colaborador              │
 * └─────────────┴───────┴──────────────────────────────────────────────┘
 *
 * SISTEMA DE PUNTUACIÓN:
 * Cada respuesta suma 1 punto al tipo correspondiente.
 * Al finalizar, se muestra el tipo con más puntos.
 * Si hay empate, gana el que aparece primero en el objeto results.
 * ============================================================
 */

window.QUIZ_CONFIG = {

  /* ── Metadatos del quiz ──────────────────────────────────────────────── */
  title:             '¿Qué tipo de personalidad tienes?',
  subtitle:          'Descúbrete en 12 preguntas situacionales',
  category:          'Personalidad',
  questionCount:     12,
  estimatedMinutes:  5,

  /* Texto para compartir en redes sociales.
   * Placeholders: {result} = nombre del tipo, {emoji} = emoji, {url} = URL */
  shareText: '¡Acabo de descubrir que soy {emoji} {result}! ¿Cuál es tu tipo de personalidad? Descúbrelo gratis en {url} 🧠 #Zappiz #Quiz #Personalidad',
  shareUrl:  'https://zappiz.io/quizzes/personalidad/',

  /* ── Preguntas ───────────────────────────────────────────────────────── */
  questions: [
    {
      id: 1,
      text: 'Estás en una fiesta donde no conoces a nadie. ¿Qué haces primero?',
      options: [
        { text: 'Busco al anfitrión, me presento y le pregunto quién es quién para orientarme', type: 'lider' },
        { text: 'Observo el ambiente tranquilamente desde algún rincón interesante', type: 'pensador' },
        { text: 'Me acerco a alguien que esté solo y empiezo a charlar para que no se sienta incómodo', type: 'conector' },
        { text: 'Propongo un juego o actividad para romper el hielo y animar el ambiente', type: 'creativo' }
      ]
    },
    {
      id: 2,
      text: 'Tienes un día libre sin ningún plan. ¿Cómo lo aprovechas?',
      options: [
        { text: 'Organizo mis objetivos de la semana, reviso mi agenda y actualizo mis listas', type: 'lider' },
        { text: 'Me pongo a crear: dibujar, escribir, cocinar algo nuevo o explorar música', type: 'creativo' },
        { text: 'Leo un libro, veo un documental o investigo algo que lleva tiempo generándome curiosidad', type: 'pensador' },
        { text: 'Llamo a amigos o familia y organizamos un plan improvisado juntos', type: 'conector' }
      ]
    },
    {
      id: 3,
      text: 'Tu jefe te asigna un proyecto importante con total libertad. ¿Qué haces primero?',
      options: [
        { text: 'Defino la meta final, divido el trabajo en fases y asigno responsabilidades claras', type: 'lider' },
        { text: 'Busco la forma más innovadora y original de abordarlo, algo que nadie haya hecho antes', type: 'creativo' },
        { text: 'Investigo cómo se ha hecho antes y analizo qué se puede mejorar con datos', type: 'pensador' },
        { text: 'Me reúno con todos los involucrados para entender qué esperan del proyecto', type: 'conector' }
      ]
    },
    {
      id: 4,
      text: '¿Cuál es tu rol habitual cuando trabajas en equipo?',
      options: [
        { text: 'El que toma las decisiones finales, mantiene el rumbo y asume la responsabilidad', type: 'lider' },
        { text: 'El que propone ideas originales y piensa fuera de los esquemas establecidos', type: 'creativo' },
        { text: 'El que analiza los pros y contras de cada opción antes de que el equipo actúe', type: 'pensador' },
        { text: 'El que mantiene la armonía del grupo, escucha a todos y media en conflictos', type: 'conector' }
      ]
    },
    {
      id: 5,
      text: 'Ves una situación injusta en la calle. ¿Cómo reaccionas?',
      options: [
        { text: 'Actúo de inmediato: intervengo, tomo las riendas y busco solucionar el problema', type: 'lider' },
        { text: 'Me quedo pensando en cómo documentarlo o narrarlo de forma que impacte a otros', type: 'creativo' },
        { text: 'Evalúo la situación con calma, analizo los riesgos y luego decido cómo actuar', type: 'pensador' },
        { text: 'Busco el apoyo de otros testigos para actuar juntos de forma coordinada', type: 'conector' }
      ]
    },
    {
      id: 6,
      text: '¿Qué tipo de contenido suele atraparte más?',
      options: [
        { text: 'Biografías de líderes, estrategias de negocios, podcasts de productividad y casos de éxito', type: 'lider' },
        { text: 'Arte, diseño, ciencia ficción, música alternativa o cine de autor', type: 'creativo' },
        { text: 'Thrillers psicológicos, documentales de ciencia, tecnología o misterios sin resolver', type: 'pensador' },
        { text: 'Historias de amistad, comedias y contenido que me conecta emocionalmente con otros', type: 'conector' }
      ]
    },
    {
      id: 7,
      text: 'Un amigo te pide consejo sobre un problema personal complicado. ¿Cómo respondes?',
      options: [
        { text: 'Le digo directamente qué creo que debería hacer y por qué, sin rodeos', type: 'lider' },
        { text: 'Le cuento una metáfora o historia que lo ayude a ver el problema desde otro ángulo', type: 'creativo' },
        { text: 'Le hago preguntas para ayudarle a analizar el problema desde distintas perspectivas', type: 'pensador' },
        { text: 'Lo escucho sin interrumpir todo el tiempo que necesite y le hago sentir acompañado', type: 'conector' }
      ]
    },
    {
      id: 8,
      text: 'Te llegan 10.000€ inesperados. ¿Qué haces con ese dinero?',
      options: [
        { text: 'Los invierto en emprender mi propio negocio o en hacer crecer un proyecto que ya tengo', type: 'lider' },
        { text: 'Financio un viaje largo, un curso creativo o un proyecto artístico que llevo tiempo posponiendo', type: 'creativo' },
        { text: 'Los invierto en algo que haya investigado y analizado a fondo para maximizar el rendimiento', type: 'pensador' },
        { text: 'La mitad para seguridad futura, la otra mitad en experiencias increíbles con la gente que quiero', type: 'conector' }
      ]
    },
    {
      id: 9,
      text: 'Te enfrentas a un problema muy complejo sin solución obvia. ¿Qué haces?',
      options: [
        { text: 'Lo divido en partes más pequeñas y voy resolviendo una a una hasta llegar al resultado', type: 'lider' },
        { text: 'Busco una solución radicalmente diferente, algo que nadie haya intentado aún', type: 'creativo' },
        { text: 'Lo analizo en profundidad, investigando datos y referencias hasta encontrar la causa raíz', type: 'pensador' },
        { text: 'Consulto con alguien de confianza que haya pasado por algo similar y pido perspectivas', type: 'conector' }
      ]
    },
    {
      id: 10,
      text: '¿Cómo defines tu relación con las redes sociales?',
      options: [
        { text: 'Las uso para proyectar mi marca personal, mostrar logros y expandir mi red de contactos clave', type: 'lider' },
        { text: 'Comparto contenido que me inspira profundamente o que creo yo mismo con mucho cuidado', type: 'creativo' },
        { text: 'Observo más de lo que publico; me interesa analizar tendencias y entender el comportamiento colectivo', type: 'pensador' },
        { text: 'Las uso principalmente para mantenerme en contacto con las personas que me importan', type: 'conector' }
      ]
    },
    {
      id: 11,
      text: '¿Qué revelaría tu historial de búsquedas del navegador esta semana?',
      options: [
        { text: 'Estrategias de negocio, productividad, finanzas personales, liderazgo o noticias económicas', type: 'lider' },
        { text: 'Arte, diseño, música, películas, recetas elaboradas o destinos de viaje únicos', type: 'creativo' },
        { text: 'Wikipedia, datos curiosos, ciencia, tecnología, tutoriales técnicos o investigaciones académicas', type: 'pensador' },
        { text: 'Planes de grupo, restaurantes para ir con amigos, eventos locales o cómo organizar reuniones', type: 'conector' }
      ]
    },
    {
      id: 12,
      text: 'Si pudieras elegir un superpoder, ¿cuál sería?',
      options: [
        { text: 'Persuasión absoluta: convencer a cualquier persona de cualquier cosa en cuestión de segundos', type: 'lider' },
        { text: 'Materialización: hacer realidad cualquier idea o imagen que pueda imaginar', type: 'creativo' },
        { text: 'Omnisciencia: acceso instantáneo a todo el conocimiento que existe en el universo', type: 'pensador' },
        { text: 'Empatía total: sentir exactamente lo que sienten los demás y comprenderlos en profundidad', type: 'conector' }
      ]
    }
  ],

  /* ── Resultados ──────────────────────────────────────────────────────── */
  results: {
    lider: {
      title:       'El Líder Nato',
      emoji:       '🔥',
      color:       '#FF6B35',
      description: 'Eres una persona decidida, ambiciosa y con una capacidad innata para tomar las riendas en cualquier situación. Cuando otros dudan, tú actúas. Tu don es ver el panorama general, establecer objetivos claros y mover a quienes te rodean hacia ellos con determinación. Transmites seguridad de forma natural y la gente tiende a seguirte, no porque lo impongas, sino porque inspiras confianza. Tu mayor fortaleza es la decisión; tu área de crecimiento, aprender a escuchar más antes de actuar.'
    },
    creativo: {
      title:       'El Alma Creativa',
      emoji:       '🎨',
      color:       '#A259FF',
      description: 'Tu mente es un caleidoscopio en constante movimiento. Donde la mayoría ve problemas, tú ves posibilidades; donde otros siguen el camino marcado, tú inventas uno nuevo. La originalidad, la expresión artística y la imaginación son tu motor. Puedes pasar horas absolutamente absorto en un proyecto que te apasione, perdido en un flujo creativo que el mundo exterior apenas puede interrumpir. Tu mayor fortaleza es la creatividad sin límites; tu reto, aterrizar esas ideas brillantes en resultados concretos.'
    },
    pensador: {
      title:       'El Pensador Analítico',
      emoji:       '🧠',
      color:       '#4ECDC4',
      description: 'Eres metódico, preciso y profundamente curioso. Antes de actuar, analizas; antes de hablar, reflexionas con calma. Tu mente funciona como un motor de búsqueda que no se detiene hasta encontrar la respuesta correcta. Los datos, la lógica y la evidencia son tu lenguaje natural. Eres la persona que el grupo agradece cuando hay que tomar una decisión importante, porque detectas lo que todos los demás pasan por alto. Tu mayor fortaleza es el pensamiento crítico; tu área de crecimiento, confiar también en la intuición.'
    },
    conector: {
      title:       'El Conector Social',
      emoji:       '💛',
      color:       '#F7DC6F',
      description: 'Eres el pegamento invisible que mantiene unidas a las personas. Tu inteligencia emocional es extraordinaria: captas los estados de ánimo antes de que nadie los exprese, anticipas las necesidades ajenas y tienes un talento especial para hacer que cualquiera se sienta visto y valorado. Para ti, las relaciones son lo más importante. Eres el primero en celebrar los logros de los demás y el hombro en el que todos quieren apoyarse. Tu mayor fortaleza es la empatía; tu área de crecimiento, aprender a establecer límites saludables.'
    }
  }

};
