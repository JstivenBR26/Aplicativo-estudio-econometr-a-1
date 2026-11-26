# Propuesta de arquitectura y diseño pedagógico

Documento de las Fases 1 y 2 (revisión de insumos y diseño) y de las decisiones tomadas en el desarrollo.

## 1. Revisión de insumos (Fase 1)

| Insumo | Qué aporta | Cómo se usó |
|---|---|---|
| `Parcial_1_Final___Econometría_I.pdf` | Un examen de 1 h 45 min, sin dispositivos electrónicos, 5 preguntas (0.7 + 0.7 + 0.6 + 1.5 + 1.5) y 3 bonos de demostración (0.2 c/u) | Caracterización de la estructura (§2); el simulador usa un simulacro con la misma estructura y preguntas originales |
| `Programa Econometría PUrdinola2026.pdf` | Evaluación (2 parciales 50 %, talleres 20 %, quices 10 %, trabajo final 20 %), plan por semanas, uso exclusivo de R | Estructura de cortes y evaluación |
| `plan-de-estudio-econometria.md` (adjunto) | Módulos 0–V, cronograma de 15 semanas, matriz de lecturas | Guía de la estructura temática (15 temas) |
| `corte 1/Guia_Consulta_Rapida_MCRL`, `Cuestionario_Modelos_Lineales_Explicado`, `Solucion_Taller_2…` | Definiciones, supuestos, resultados, 40 preguntas resueltas, taller resuelto | **Fuente principal** de contenido y de gran parte del banco |
| `guia_heterocedasticidad_simplificado.md`, scripts `.R` | Flujo ver → detectar → corregir; cifras de simulación | Tema 9 y su laboratorio |
| `laboratorio-regresion.html` (previo) | Ideas de laboratorios (simple/múltiple/diagnóstico) | Inspiración; se rehízo con otro enfoque (simulación, preguntas guía) |
| Gujarati / Wooldridge (PDF con texto) | Verificación cruzada | Verificación cruzada de definiciones y procedimientos |
| Maddala (PDF **escaneado**) | — | No se pudo leer su texto; los capítulos citados provienen del programa y del plan |

**Referentes de diseño.** *NeuroLin* (simulador del curso de Modelos Lineales): navegación lateral modular, mascota, tema claro/oscuro, ruta guiada y desafíos. *Português A1*: progreso global siempre visible, ejercicios con retroalimentación inmediata y micro-celebración. Se adoptaron la navegación modular, el progreso visible y la retroalimentación inmediata; **no** se replicaron ni su estética ni su estructura de contenidos (confeti, flashcards).

## 2. Estilo de evaluación observado en el Parcial 1

Solo lo que el examen muestra:

- **Formatos:** V/F (7 ítems), completar eligiendo entre dos opciones (6 ítems), selección múltiple de 4 opciones (2), interpretación de un modelo estimado con datos numéricos (6 apartados), tabla de identificación de supuestos con matrices de varianzas, una esperanza condicional y dos gráficos de errores, y bonos de demostración (mínimo global de MCO, insesgamiento de $\hat\sigma^2$, Gauss–Markov).
- **Competencias:** álgebra matricial del MCO ($H$, $M$, $MX=0$, idempotencia); qué supuesto garantiza qué (insesgamiento, MELI, eficiencia, normalidad); interpretación de coeficientes con unidades (lin-log, log-log); justificación de signos esperados; $R^2$ vs. $R^2_{adj}$; lectura de matrices de varianza y de gráficos de errores para identificar el supuesto violado; consecuencias de la violación (insesgado pero no MELI).
- **Nivel:** conceptual-aplicado. Los cálculos numéricos son cortos (se hacen sin calculadora). Se exige **justificar**.
- **Adaptación:** los problemas aplicados parecen apoyarse en ejercicios de los libros de texto.

**No se infiere:** estilo del Parcial 2, criterios de calificación, distribución de puntos de otros exámenes ni qué esperan las profesoras más allá de lo visible.

## 3. Arquitectura de información (Fase 2)

```
Inicio ── ruta sugerida, progreso, advertencia de alcance
├─ 1 Contenidos ──── Corte 1 (T0–T7)  ·  Corte 2 (T8 panorama, T9–T11 violaciones, T12–T13)  ·  🚩 T14 asintótica (grupo profe Sofía)
│     └─ Tema: Objetivo → 1 Intuición → 2 Formalización → 3 Ejemplo paso a paso
│              → 4 Aplicación → 5 Errores frecuentes → 6 Compruébalo
│              ↳ enlaces a Laboratorio y a Banco (filtrado por tema)
├─ 2 Laboratorio (13 experimentos, cada uno ligado a un tema)
├─ 3 Banco de preguntas (filtros: tema, tipo, dificultad, estado, origen; ★ marcar)
├─ 4 Simulador (A: simulacro con la estructura del Parcial 1 · B: simulacro estilo parcial · C: personalizado)
├─ 5 Seguimiento (por tema, evolución, falladas, recomendaciones, exportar/importar)
└─ Fuentes y alcance
```

**Conexión entre módulos.** El tema es la unidad central: su página enlaza al laboratorio que visualiza el concepto y a las preguntas del banco que lo evalúan. Cada pregunta lleva `tema` y `sub`; el seguimiento agrega por `tema` y desde allí recomienda *releer tema → experimentar → practicar*. Los resultados del simulador alimentan el mismo seguimiento.

**Del texto a la práctica.** Cada tema sigue la progresión intuición → formalización → ejemplo numérico → aplicación, y cierra con verificación inmediata. Los ejemplos se revelan paso a paso (aprendizaje activo).

## 4. Estrategia del banco de preguntas

1. **Base:** preguntas del cuestionario resuelto y del taller (material del curso), reescritas con la convención del parcial ($k$ con intercepto, $gl=n-k$) y con la justificación de **cada opción incorrecta** (campo `why`).
2. **Simulacro con la estructura del parcial:** 11 secciones originales (mismos formatos, pesos y tiempo); la plataforma no reproduce enunciados ni datos del examen real. Solución propia, no oficial.
3. **Preguntas originales “estilo parcial”:** mismos formatos (grupo V/F, completar, identificar errores de razonamiento, demostraciones tipo bono, escenarios con cifras).
4. **Corte 2:** preguntas conceptuales basadas en el plan, sin atribuirles estilo de examen.
5. **Criterios:** evitar memorización pura; privilegiar interpretación, identificación de supuestos y consecuencias; dificultad 1–3; todo dato numérico se verifica en `tests/verificar.js`.

Composición actual: ver la salida de `node tests/verificar.js` (158 preguntas; 79 del Corte 1, 64 del Corte 2 y 15 de asintótica).

## 5. Decisiones técnicas y su justificación

| Decisión | Razón |
|---|---|
| HTML + JS clásico sin *build* ni frameworks | Despliegue directo en GitHub Pages y apertura con doble clic; mantenimiento simple |
| `js/content/` separado de `js/core/` | Agregar temas y preguntas sin tocar la interfaz |
| KaTeX **local** | Funciona sin internet y sin CDN |
| Gráficos SVG propios (~100 líneas) | Evita cargar Plotly (3 MB); suficiente para dispersión, líneas e histogramas |
| Calificación como función pura (`Quiz.score`) | Se puede probar sin navegador (`tests/verificar.js`) |
| Preguntas abiertas con autoevaluación guiada por rúbrica | No se puede calificar texto libre de forma confiable en el navegador; se evita simularlo |
| `localStorage` + exportar/importar JSON | Persistencia sin servidor; copia de seguridad explícita |
| Hash routing (`#/tema/t3`) | Compatible con alojamiento estático |

## 6. Limitaciones y puntos que requieren decisión del curso

- La **clave oficial** del Parcial 1 no está en los insumos; las soluciones de la plataforma son propias.
- Los temas 8–12 se basan en el plan y el programa, sin examen modelo.
- El Maddala no pudo leerse (PDF escaneado); convendría confirmar las equivalencias de capítulos.
- Los laboratorios usan simulaciones propias; las cifras de la guía de monitoría de heterocedasticidad se citan sin recalcular (la guía misma indica que no se ejecutó R).
- Diferencia entre el cuestionario (permitía calculadora) y el parcial real (no).
- Posibles ampliaciones: más preguntas del Corte 2 cuando exista el Parcial 2; un “formulario” imprimible generado desde los temas; ejercicios de R ejecutables (hoy el curso exige R pero la plataforma no ejecuta código R).

