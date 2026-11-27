# EconoLab · Econometría I (UNAL)

Plataforma web de estudio para Econometría I: **contenidos**, **laboratorio interactivo**, **banco de preguntas**, **simulador de parciales** y **seguimiento del aprendizaje**. Es una página estática (HTML + CSS + JavaScript sin compilación), sin servidor y sin dependencias externas en tiempo de ejecución (KaTeX está incluido en `vendor/`).

## Cómo ejecutarla

**Opción 1 — doble clic.** Abre `index.html` en el navegador. Funciona sin servidor (los scripts son clásicos, no módulos).

**Opción 2 — servidor local** (recomendado si el navegador bloquea `localStorage` en `file://`):

```powershell
python -m http.server 8765
```

y abre <http://localhost:8765/index.html>.

**Pruebas automáticas** (requiere Node 18+; no instala nada):

```powershell
node tests/verificar.js
```

Valida el esquema del banco, recalcula con álgebra matricial las cifras clave del contenido (β̂, SCR, R², errores estándar, apalancamiento, sesgo del caso D, valores críticos…) y comprueba que la calificación funcione para cada pregunta.

## Despliegue en GitHub Pages

1. Sube **el contenido de esta carpeta** a un repositorio (el archivo `.nojekyll` ya está incluido).
2. *Settings → Pages → Deploy from a branch → main / (root)*.
3. La plataforma queda en `https://<usuario>.github.io/<repositorio>/`.

## Estructura del proyecto

```
econometria-app/
├─ index.html                 Carcasa y orden de carga de scripts
├─ css/styles.css             Estilos, tokens de color (claro/oscuro), responsive
├─ assets/nachito.jpeg        Mascota (insumo del curso)
├─ vendor/katex/              KaTeX 0.16.9 local (fórmulas, sin internet)
├─ js/
│  ├─ app.js                  Arranque, enrutador por hash, tema, menú móvil
│  ├─ core/
│  │  ├─ util.js              Utilidades, álgebra matricial, MCO (EL.ols), distribuciones t/F/χ², render de $fórmulas$
│  │  ├─ store.js             Persistencia local (localStorage con respaldo en memoria), exportar/importar
│  │  ├─ charts.js            Gráficos SVG propios (ejes, dispersión, histogramas)`n│  │  ├─ stats.js             Regresión con salida tipo Stata y pruebas (White, BP, RESET, Goldfeld–Quandt, DW, Cochrane–Orcutt, Newey–West, FIV)
│  │  ├─ quiz.js              Motor de preguntas: calificación pura y renderizado de todos los tipos
│  │  └─ views.js             Vistas: inicio, contenidos, tema, laboratorio, banco, simulador, seguimiento, fuentes
│  ├─ content/                SOLO CONTENIDO ACADÉMICO (sin lógica de interfaz)
│  │  ├─ temas.js             Temas 0–7 (Corte 1)
│  │  ├─ temas-violaciones.js Corte 2: panorama (T8), multicolinealidad (T9), heterocedasticidad (T10), autocorrelación (T11)`n│  │  ├─ temas-corte2.js      Contrastes (T12) y ecuaciones simultáneas (T13)`n│  │  ├─ temas-clase.js       Ajustes de todos los temas al enfoque de las notas de clase (vocabulario, ejemplos, prioridades)`n│  │  ├─ casos.js             Casos de lectura de salidas tipo Stata con datos simulados (motor + configuraciones)`n│  │  ├─ temas-asintotica.js  T14 Teoría asintótica (🚩 grupo profe Sofía; campo sofia:true)
│  │  ├─ banco-corte1.js      Preguntas del Corte 1
│  │  ├─ banco-parcial1.js    Simulacro de 5.0 puntos con la estructura del Parcial 1 + más preguntas originales
│  │  ├─ banco-corte2.js      Preguntas complementarias del Corte 2`n│  │  ├─ banco-violaciones.js Preguntas de panorama y de los tres problemas clásicos`n│  │  ├─ banco-asintotica.js  Preguntas de teoría asintótica (grupo profe Sofía)`n│  │  └─ banco-clase.js       Casos con tablas para el simulacro del Corte 2, definiciones, V/F y regresión simple como en clase
│  └─ labs/labs.js, labs2.js  14 laboratorios interactivos
├─ tests/verificar.js         Pruebas automáticas
└─ docs/ARQUITECTURA.md       Diseño pedagógico y de información
```

## Cómo agregar o modificar contenido

### Un tema nuevo
En `js/content/temas*.js` llama a `EL.addTema({...})`. Campos: `id`, `num`, `corte`, `semana`, `titulo`, `resumen`, `lecturas`, `subtemas[]`, `objetivo`, `intuicion`, `formal`, `ejemplo{titulo,pasos[]}`, `aplicacion`, `errores[{mal,bien}]`, `checks[{q,opts,c,e}]`, `lab[]` (ids de laboratorios), `fuente`. El menú, la lista de contenidos y el seguimiento lo detectan solos. Fórmulas: `$...$` en línea y `$$...$$` en bloque. Para texto con muchas barras invertidas usa `String.raw` (`R` en los archivos existentes). **No escribas el símbolo `$` como moneda** (rompe el render); usa “pesos”.

### Una pregunta nueva
En un `banco-*.js`, con los ayudantes `mc`, `vf`, `num` o con un objeto:

| Tipo | Campos específicos | Calificación |
|---|---|---|
| `mc` | `opts[4]`, `c` (índice), `why[]` (por qué cada opción incorrecta lo es) | 0/1 |
| `vf` | `c` (true/false) | 0/1 |
| `num` | `c`, `tol`, `unidad` | 0/1 (acepta coma decimal y “−”) |
| `grupo` | `items[{t,opts,c,e,fig?}]`, `peso` | fraccionaria |
| `abierta` | `modelo`, `rubrica[]`, `peso` | autoevaluación contra rúbrica |

Comunes: `id` único, `tema` (id de un tema), `sub`, `dif` (1–3), `fuente`, `enun`, `expl`. Después de editar, ejecuta `node tests/verificar.js`.

### Un laboratorio nuevo
En `js/labs/labs.js`: `reg(id, titulo, temaId, objetivo, el => lab(el, {controls, buttons, render}))`. `render(valores, estado)` devuelve HTML; usa `EL.chart` para gráficos y `stat`, `box`, `read` para el formato. Luego añade el `id` al campo `lab[]` del tema correspondiente.

### Simulador
El “Simulacro con la estructura del Parcial 1” usa las preguntas con id `p1-0xx` (sus `peso` suman 5.0). Para cambiar el tiempo o la composición edita `V.simulador` en `js/core/views.js`.

## Persistencia

Se guarda en `localStorage` bajo la clave `econolab-v1`: respuestas de práctica, simulacros (con resultados por pregunta), temas marcados, laboratorios visitados, marcas ★ y tema visual. En **Seguimiento → Tus datos** se puede exportar/importar un JSON (útil para cambiar de equipo) o borrar todo.

## Limitaciones conocidas

Ver `docs/ARQUITECTURA.md` §6 y la sección **Fuentes y alcance** dentro de la plataforma. Lo esencial: hay un solo parcial de referencia; la solución del Parcial 1 es propia (no oficial); los temas 8–12 no tienen examen modelo; el PDF de Maddala es una imagen y no pudo leerse.

## Bandera para el grupo de la profesora Sofía

Un tema con `sofia: true` (ver `temas-asintotica.js`) muestra 🚩 *Grupo profe Sofía* en el menú, la lista de contenidos, el encabezado del tema y cada pregunta asociada, y tiene su propio simulacro. Para marcar otro tema basta añadir ese campo.


## Casos con tablas simuladas

EL.caseKit` (en `js/content/casos.js`) genera, con semilla fija, salidas tipo Stata y todas sus pruebas para cuatro problemas (heterocedasticidad, autocorrelación, prueba F, multicolinealidad). Se usan en los temas (`EL.CASOS`) y en el banco (preguntas con `dyn` y `cat`). Para un caso nuevo basta añadir una configuración en `EL.CASE_CFG` (contexto, semilla, parámetros) y **ejecutar `node tests/verificar.js`**, que comprueba que las conclusiones escritas coinciden con los números (por ejemplo, que White rechaza en niveles y no en logaritmos).
