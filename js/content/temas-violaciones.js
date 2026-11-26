/* temas-violaciones.js — Corte 2: panorama de violaciones (t13, num 8) y los tres problemas clásicos:
   multicolinealidad (t8, num 9), heteroscedasticidad (t9, num 10) y autocorrelación (t10, num 11).
   Fuentes: plan de estudio (Markdown), programa, guía de monitoría, mapa conceptual de monitoría (usado como insumo, no copiado),
   y verificación cruzada con Gujarati 5.ª ed. (Cap. 10–12, Sec. 10.8, 11.5–11.6, 12.6–12.11) y Wooldridge.
   No existe parcial modelo para este corte.                                                                               */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;
  const FUENTE = 'Plan de estudio (Módulo III), programa del curso, material de monitoría; verificado contra Gujarati (5.ª ed.)';

  /* ===================================================================== t13 · PANORAMA */
  EL.addTema({
    id: 't13', num: 8, corte: 2, semana: 'Semanas 8–11', titulo: 'Panorama: qué le pasa a MCO cuando falla cada supuesto',
    resumen: 'El mapa que ordena todo el corte: qué se rompe (sesgo, eficiencia, errores estándar, inferencia) con cada violación, y en qué orden diagnosticar.',
    lecturas: 'Maddala Cap. 5–7 · Gujarati Cap. 10–13 · Wooldridge Cap. 8–9',
    subtemas: ['Qué protege cada supuesto', 'Fallas que sesgan', 'Fallas que no sesgan', 'Matices y notas al pie', 'Orden de diagnóstico', 'Mapa problema → detección → remedio'],
    objetivo: 'Dado un problema (forma funcional, endogeneidad, colinealidad, heteroscedasticidad, autocorrelación, no normalidad), decir con precisión si MCO sigue siendo insesgado, MELI, con errores estándar correctos y con $t$ y $F$ válidas, y justificar por qué.',
    intuicion: R`<p>Todo el corte 2 se resume en una idea: <b>cada supuesto protege una propiedad distinta</b>. Si aprendes a asociar propiedad con supuesto, no necesitas memorizar tablas; las reconstruyes.</p>
      <ul><li><b>El centro de la distribución</b> (¿acierta en promedio?) depende de $E(\hat\beta)$: se ve afectado por <i>forma funcional</i> y <i>exogeneidad</i> (S1, S3).</li>
      <li><b>La dispersión</b> (¿qué tan preciso?, ¿están bien los errores estándar?) depende de $\operatorname{Var}(\varepsilon|X)$: la afectan <i>heteroscedasticidad</i> y <i>autocorrelación</i> (S4, S5).</li>
      <li><b>La forma de la distribución</b> (¿valen $t$ y $F$ exactas?) depende de la normalidad (S6).</li>
      <li><b>La existencia de la solución</b> depende del rango de $X$ (S2).</li></ul>
      <p>Pregunta de control ante cualquier violación: <i>¿falla el “centro”, la “dispersión” o la “forma”?</i></p>`,
    formal: R`<h4>1. Fallas que sesgan (rompen el centro)</h4>
      <ul><li><b>Forma funcional mal especificada</b> y <b>variables omitidas relevantes</b> correlacionadas con las incluidas: el término omitido queda en $\varepsilon$ y $E(\varepsilon|X)\neq0$ ⇒ $\hat\beta$ <b>sesgado e inconsistente</b>; como consecuencia también no es MELI, los $ee$ no son confiables y $t$, $F$ pierden validez.</li>
      <li><b>Endogeneidad</b> (simultaneidad, error de medición en regresoras, omitidas): $\operatorname{Cov}(x,\varepsilon)\neq0$ ⇒ <b>sesgo e inconsistencia</b> que no desaparecen con $n$ grande. Se resuelve con variables instrumentales/MC2E, no con errores robustos.</li></ul>
      <h4>2. Fallas que no sesgan, pero dañan la varianza</h4>
      <ul><li><b>Multicolinealidad perfecta:</b> $X'X$ singular ⇒ $\hat\beta$ <b>no se puede estimar</b> de forma única (falla S2).</li>
      <li><b>Multicolinealidad imperfecta:</b> <b>no viola ningún supuesto</b>. MCO sigue insesgado, MELI, con $ee$ <i>correctos</i> (pero grandes) y $t$, $F$ válidas. Es un problema de <i>precisión</i>.</li>
      <li><b>Heteroscedasticidad:</b> $\hat\beta$ insesgado y consistente; <b>no MELI</b>; $ee$ usuales <b>incorrectos</b>; $t$, $F$ no válidas.</li>
      <li><b>Autocorrelación:</b> $\hat\beta$ insesgado (siempre que $Y_{t-1}$ no sea regresora); <b>no MELI</b>; $ee$ usuales incorrectos; $t$, $F$ no válidas.</li></ul>
      <h4>3. Falla que solo afecta la distribución</h4>
      <ul><li><b>No normalidad:</b> $\hat\beta$ insesgado y MELI; $ee$ correctos; $t$ y $F$ <b>exactas</b> ya no, pero <b>aproximadamente válidas con $n$ grande</b> (TLC).</li></ul>
      <table class="tbl"><tr><th>Problema</th><th>Supuesto</th><th>¿Insesgado?</th><th>¿MELI?</th><th>¿$ee$ usuales correctos?</th><th>¿$t$ y $F$ válidas?</th></tr>
      <tr><td>Forma funcional / omitida</td><td>S1, S3</td><td>No</td><td>No</td><td>No</td><td>No</td></tr>
      <tr><td>Endogeneidad</td><td>S3</td><td>No</td><td>No</td><td>No</td><td>No</td></tr>
      <tr><td>Colinealidad perfecta</td><td>S2</td><td colspan="4"><i>no se puede estimar</i></td></tr>
      <tr><td>Colinealidad imperfecta</td><td>(ninguno)</td><td>Sí</td><td>Sí</td><td>Sí (pero grandes)</td><td>Sí</td></tr>
      <tr><td>Heteroscedasticidad</td><td>S4</td><td>Sí</td><td>No</td><td>No</td><td>No</td></tr>
      <tr><td>Autocorrelación</td><td>S5</td><td>Sí*</td><td>No</td><td>No</td><td>No</td></tr>
      <tr><td>No normalidad</td><td>S6</td><td>Sí</td><td>Sí</td><td>Sí</td><td>Solo con $n$ grande</td></tr></table>
      <p class="small">* Si $Y_{t-1}$ no está entre las regresoras. Esta tabla es un resumen elaborado por la plataforma a partir de los supuestos del tema 1; la utilidad está en poder <i>justificar cada celda</i>, no en memorizarla.</p>
      <h4>4. Matices que suelen preguntarse</h4>
      <ul><li><b>Errores robustos</b> (White, Newey–West): corrigen los $ee$ (y con ellos $t$, $F$ en muestras grandes), pero <b>no cambian los coeficientes</b> ni vuelven homoscedástico o no autocorrelacionado el error.</li>
      <li>Con autocorrelación y $Y_{t-1}$ entre las regresoras, el estimador además puede volverse <b>inconsistente</b>.</li>
      <li>Una <b>curva</b> en el gráfico de residuos suele indicar forma funcional (RESET), no heteroscedasticidad. Un <b>abanico</b> indica heteroscedasticidad. Rachas del mismo signo en el tiempo indican autocorrelación.</li>
      <li>Colinealidad alta + $R^2$ alto + $t$ individuales bajos es el síntoma clásico.</li></ul>
      <h4>5. Orden sugerido de diagnóstico</h4>
      <ol><li><b>Especificación</b> (forma funcional y variables omitidas): si está mal, las demás pruebas quedan contaminadas.</li><li><b>Multicolinealidad</b> (FIV).</li><li><b>Heteroscedasticidad y autocorrelación</b> (según el tipo de datos: corte transversal vs. series de tiempo).</li><li><b>Normalidad</b> (solo importa para inferencia exacta si $n$ es pequeño).</li></ol>
      <h4>6. Mapa problema → detección → remedio</h4>
      <table class="tbl"><tr><th>Problema</th><th>Cómo se detecta</th><th>Remedios</th></tr>
      <tr><td>Multicolinealidad</td><td>Correlaciones, regresiones auxiliares, FIV, síntomas ($R^2$ alto con $t$ bajos)</td><td>Más datos, información a priori, combinar/transformar variables, primeras diferencias; no eliminar variables relevantes a ciegas; a veces no hacer nada</td></tr>
      <tr><td>Heteroscedasticidad</td><td>Gráfico de residuos; Park, Glejser, Goldfeld–Quandt, Breusch–Pagan, White</td><td>Errores robustos de White; MCP/MCG; transformación (p. ej. logaritmos)</td></tr>
      <tr><td>Autocorrelación</td><td>Gráfico de residuos, Durbin–Watson, Breusch–Godfrey</td><td>Revisar especificación; MCGF (Cochrane–Orcutt, Prais–Winsten); errores Newey–West</td></tr></table>`,
    ejemplo: {
      titulo: 'Un diagnóstico completo, pensado en voz alta',
      pasos: [
        R`Regresión de consumo sobre ingreso con 40 datos trimestrales. Se obtiene $R^2$ alto y todos los $t$ significativos.`,
        R`<b>Especificación:</b> el gráfico de residuos vs. ajustados no muestra curva; RESET no rechaza. Se continúa.`,
        R`<b>Colinealidad:</b> con una sola regresora no aplica; con varias, se miraría el FIV.`,
        R`<b>Series de tiempo ⇒ autocorrelación:</b> los residuos forman rachas del mismo signo y $d=0.7$ (muy por debajo de 2) ⇒ autocorrelación positiva.`,
        R`<b>Consecuencia:</b> los $\hat\beta$ siguen insesgados, pero los $t$ “significativos” están inflados porque los $ee$ usuales subestiman.`,
        R`<b>Remedio:</b> reportar errores Newey–West (o MCGF) y <i>reinterpretar</i> la significancia con los $ee$ corregidos. Los coeficientes no cambian con Newey–West.`
      ]
    },
    aplicacion: R`<p>En el trabajo final, la sección de “diagnóstico” debe seguir este orden y, para cada problema, <b>decir qué consecuencia tendría para sus resultados</b> y qué remedio se aplicó. Un diagnóstico sin consecuencia ni remedio está incompleto.</p>`,
    errores: [
      { mal: 'La heteroscedasticidad y la autocorrelación sesgan los coeficientes.', bien: 'No: afectan eficiencia y errores estándar. El sesgo viene de S1/S3 (forma funcional, omitidas, endogeneidad).' },
      { mal: 'La multicolinealidad imperfecta viola un supuesto.', bien: 'Solo la perfecta viola S2. La imperfecta es un problema de precisión: MCO sigue insesgado y MELI.' },
      { mal: 'Los errores robustos arreglan el sesgo o la heteroscedasticidad.', bien: 'Solo corrigen los errores estándar. Los coeficientes y el patrón de varianza no cambian.' },
      { mal: 'Si los residuos tienen forma de curva, hay heteroscedasticidad.', bien: 'Una curva sugiere mala forma funcional (RESET). Heteroscedasticidad es un cambio en la <i>dispersión</i>.' },
      { mal: 'Si los errores no son normales, MCO deja de ser MELI.', bien: 'MELI no usa normalidad. Solo se pierde la inferencia exacta; con $n$ grande $t$ y $F$ siguen siendo aproximadamente válidas.' }
    ],
    checks: [
      { q: 'Un modelo con regresoras muy correlacionadas (pero no perfectamente). ¿Cuál afirmación es correcta?', opts: ['MCO es sesgado', 'MCO es insesgado y MELI; los errores estándar son correctos pero grandes', 'Los errores estándar usuales son incorrectos', 'Ya no se puede usar la prueba $t$'], c: 1, e: 'La colinealidad imperfecta no viola ningún supuesto: es un problema de precisión.' },
      { q: 'Con heteroscedasticidad, ¿qué propiedades se pierden?', opts: ['Insesgamiento', 'Insesgamiento y consistencia', 'MELI y la validez de los $ee$ usuales (y de $t$, $F$)', 'Solo la normalidad'], c: 2, e: 'Se mantienen insesgamiento y consistencia; se pierden eficiencia (MELI) y la inferencia usual.' },
      { q: 'Los errores no son normales y $n=1000$. ¿Qué se puede decir?', opts: ['MCO es sesgado', '$\\hat\\beta$ sigue siendo insesgado y MELI; $t$ y $F$ son aproximadamente válidas', 'Las pruebas $t$ son inválidas', 'No es MELI'], c: 1, e: 'Normalidad solo da inferencia exacta; con $n$ grande el TLC cubre la inferencia.' }
    ],
    lab: ['panorama'], fuente: FUENTE + '. Mapa conceptual de monitoría usado como insumo.'
  });

  /* ===================================================================== t8 · MULTICOLINEALIDAD */
  EL.addTema({
    id: 't8', num: 9, corte: 2, semana: 'Semana 8', titulo: 'Multicolinealidad',
    resumen: 'Naturaleza y causas, efectos sobre las varianzas, cómo identificarla (FIV y síntomas) y qué remedios hay (y cuáles son peores que la enfermedad).',
    lecturas: 'Maddala Cap. 7 · Gujarati Cap. 10',
    subtemas: ['Naturaleza y causas', 'Efectos', 'Identificación', 'Remedios', 'Cuándo no hacer nada'],
    objetivo: 'Distinguir colinealidad perfecta de imperfecta, derivar por qué infla las varianzas sin sesgar, identificarla con regresiones auxiliares y FIV, y elegir remedios sin introducir sesgo de especificación.',
    intuicion: R`<p>Si dos regresores se mueven casi juntos, los datos no tienen “experimentos naturales” donde uno varíe y el otro no: no pueden separar sus efectos. Sabemos bien el efecto <i>conjunto</i> (la combinación lineal), pero no cómo se reparte.</p>
      <p>Por eso el estimador sigue acertando en promedio pero es muy inestable de una muestra a otra: <b>varianza enorme, no sesgo</b>.</p>`,
    formal: R`<h4>1. Naturaleza y causas</h4>
      <ul><li><b>Perfecta:</b> existe $c\neq0$ con $Xc=0$ ⇒ $\operatorname{rango}(X)<k$ ⇒ $X'X$ singular. Ej.: trampa de la dummy; incluir $x$ y $2x$.</li>
      <li><b>Imperfecta (alta):</b> $Xc\approx0$. No viola supuestos.</li>
      <li><b>Causas típicas:</b> variables económicas que comparten tendencia; regresoras construidas a partir de otras ($x$, $x^2$); muestra pequeña o con poca variación; pocas observaciones frente a muchos regresores; sobreespecificación con variables casi equivalentes.</li></ul>
      <h4>2. Efectos</h4>
      $$\operatorname{Var}(\hat\beta_j\mid X)=\frac{\sigma^2}{SCT_j\,(1-R_j^2)}=\frac{\sigma^2}{SCT_j}\cdot FIV_j,\qquad FIV_j=\frac1{1-R_j^2}$$
      <p>Con dos regresoras: $\operatorname{Var}(\hat\beta_2)=\dfrac{\sigma^2}{S_{22}(1-r_{23}^2)}$. Al crecer $|r_{23}|\to1$ el denominador $\to0$.</p>
      <table class="tbl"><tr><th>Se mantiene</th><th>Se deteriora</th></tr>
      <tr><td>Insesgamiento, consistencia, MELI; $ee$ correctos; validez de $t$ y $F$; el ajuste $\hat y$ y el $R^2$; la predicción <i>dentro</i> del patrón de colinealidad</td><td>Varianzas y $ee$ grandes ⇒ $t$ bajos y no significancia individual; intervalos anchos; estimaciones muy sensibles a pequeños cambios en los datos o en la muestra; signos o magnitudes inesperados; $F$ global significativa con $t$ individuales no significativos</td></tr></table>
      <h4>3. Identificación</h4>
      <ul><li><b>Síntomas:</b> $R^2$ alto, $F$ significativa y $t$ individuales bajos; coeficientes que cambian mucho al añadir o quitar una variable.</li>
      <li><b>Correlaciones de pares:</b> útil, pero <i>insuficiente</i> (la colinealidad puede involucrar a tres o más variables).</li>
      <li><b>Regresiones auxiliares:</b> regresar cada $x_j$ sobre las demás y mirar $R_j^2$. Regla de Klein: preocupa si $R_j^2$ supera al $R^2$ del modelo completo.</li>
      <li><b>FIV:</b> $FIV_j>10$ (⇔ $R_j^2>0.90$) indica colinealidad severa. Tolerancia $=1-R_j^2=1/FIV_j$.</li>
      <li>Otras: valores propios y número de condición de $X'X$ (si hay valores propios cercanos a 0).</li></ul>
      <h4>4. Remedios</h4>
      <table class="tbl"><tr><th>Remedio</th><th>Cómo funciona</th><th>Precaución</th></tr>
      <tr><td>Más datos / más variación</td><td>Aumenta $SCT_j$ y reduce la varianza</td><td>No siempre disponible</td></tr>
      <tr><td>Información a priori</td><td>Imponer una restricción teórica (p. ej. $\beta_2+\beta_3=1$ en Cobb–Douglas) y estimar el modelo restringido</td><td>La restricción debe ser creíble; se puede contrastar con una $F$</td></tr>
      <tr><td>Combinar o transformar variables</td><td>Índice, razón, centrar variables en polinomios, primeras diferencias $y_t-y_{t-1}$</td><td>Las primeras diferencias pueden introducir autocorrelación ($v_t=u_t-u_{t-1}$) y pierden información de nivel</td></tr>
      <tr><td>Eliminar una variable</td><td>Reduce la colinealidad</td><td><b>Puede ser peor que la enfermedad</b>: sesgo de variable omitida $\beta_3\delta_1$ (tema 6)</td></tr>
      <tr><td>No hacer nada</td><td>Si los $t$ son significativos, si el objetivo es predecir en el rango observado, o si solo interesa una combinación lineal estimable</td><td>Explicar la imprecisión al interpretar</td></tr></table>`,
    ejemplo: {
      titulo: 'Cuantificar el daño: ¿cuánto se infla la varianza?',
      pasos: [
        R`Modelo con dos regresoras; $\sigma^2=4$ y $S_{22}=\sum(x_{2}-\bar x_2)^2=100$. Si $x_2$ y $x_3$ fueran no correlacionadas: $\operatorname{Var}(\hat\beta_2)=4/100=0.04$ y $ee=0.20$.`,
        R`Con $r_{23}=0.95$: $R_2^2=r_{23}^2=0.9025$ y $FIV=1/(1-0.9025)=10.26$.`,
        R`$\operatorname{Var}(\hat\beta_2)=0.04\times10.26=0.410$ ⇒ $ee=0.64$: el error estándar se multiplica por $\sqrt{10.26}=3.2$.`,
        R`Si el efecto verdadero fuera $\beta_2=0.5$: $t=0.5/0.64=0.78$ (no significativo) cuando sin colinealidad sería $t=2.5$ (significativo). <b>Misma realidad, conclusión opuesta por falta de precisión.</b>`,
        R`Regla de Klein: si el $R^2$ del modelo completo es 0.80 y $R_2^2=0.9025>0.80$ ⇒ la colinealidad entre regresoras es más fuerte que la relación con $y$: señal de alerta.`
      ]
    },
    aplicacion: R`<p>Taller 2 (YouTube): con $R_1^2=0.60$, $FIV=2.5$. Eliminar “suscriptores” para bajar la varianza sesgaría el efecto de la publicidad de 0.25 a 0.55; con un $FIV$ tan bajo el remedio sería claramente peor que el problema. Para decidir, se compara <i>sesgo</i> (no se corrige con $n$) contra <i>varianza</i> (sí se corrige con $n$).</p>`,
    errores: [
      { mal: 'La multicolinealidad sesga los coeficientes.', bien: 'No sesga ni invalida el modelo; reduce la precisión.' },
      { mal: 'Si no hay correlaciones altas por pares, no hay multicolinealidad.', bien: 'Puede haber dependencia entre tres o más variables: revisa regresiones auxiliares y FIV.' },
      { mal: 'La solución es quitar una de las variables colineales.', bien: 'Si ambas son relevantes, eso introduce sesgo de especificación. Antes considera más datos, restricciones teóricas o transformaciones.' },
      { mal: 'Sin colinealidad perfecta, los regresores no están correlacionados.', bien: 'El rango completo solo descarta dependencia lineal <i>exacta</i>.' },
      { mal: 'Con multicolinealidad, los errores estándar usuales son incorrectos.', bien: 'Son correctos; simplemente son grandes porque reflejan la verdadera incertidumbre.' }
    ],
    checks: [
      { q: 'Con $R_j^2=0.90$, el $FIV_j$ y el factor por el que se multiplica el error estándar son:', opts: ['10 y 10', '10 y ≈3.16', '0.1 y 0.32', '9 y 3'], c: 1, e: '$FIV=1/(1-0.9)=10$; el $ee$ se multiplica por $\\sqrt{10}=3.16$.' },
      { q: 'Síntoma clásico de multicolinealidad alta:', opts: ['$R^2$ bajo y $t$ altos', '$R^2$ alto, $F$ significativa y $t$ individuales no significativos', 'Residuos con forma de abanico', 'Durbin–Watson cercano a 0'], c: 1, e: 'Las regresoras explican mucho juntas, pero no se puede aislar el efecto de cada una.' },
      { q: 'Al aplicar primeras diferencias para reducir la colinealidad de series de tiempo, ¿qué riesgo aparece?', opts: ['Sesgo en los coeficientes', 'Heteroscedasticidad', 'Autocorrelación del error diferenciado ($v_t=u_t-u_{t-1}$)', 'Ninguno'], c: 2, e: 'Si $u_t$ no está autocorrelacionado, $v_t$ lo está (con correlación −0.5 entre rezagos consecutivos).' }
    ],
    lab: ['colin'], fuente: FUENTE + ' (Sec. 10.8: medidas correctivas).'
  });

  /* ===================================================================== t9 · HETEROSCEDASTICIDAD */
  EL.addTema({
    id: 't9', num: 10, corte: 2, semana: 'Semana 9', titulo: 'Heteroscedasticidad',
    resumen: 'Causas, consecuencias sobre MCO, pruebas (Park, Glejser, Goldfeld–Quandt, Breusch–Pagan, White) y remedios (White robusto, MCP/MCG, transformaciones).',
    lecturas: 'Maddala Cap. 5 · Gujarati Cap. 11 · Monitoría 6 (script en R)',
    subtemas: ['Naturaleza y causas', 'Efectos', 'Identificación (pruebas)', 'Remedios'],
    objetivo: 'Explicar por qué MCO sigue insesgado pero deja de ser MELI y sus $ee$ fallan; aplicar e interpretar las pruebas formales; y elegir entre errores robustos y MCP/MCG.',
    intuicion: R`<p>Los hogares ricos varían mucho más su gasto que los pobres: el “tamaño del error” crece con el ingreso. MCO supone un único $\sigma^2$ para todos; los $\hat\beta$ siguen acertando en promedio, pero <b>R calcula los errores estándar con un $\sigma^2$ que no existe</b> y no avisa. Las observaciones muy ruidosas pesan igual que las precisas: de ahí la pérdida de eficiencia.</p>`,
    formal: R`<h4>1. Naturaleza y causas</h4>
      <p>$\operatorname{Var}(\varepsilon_i|X)=\sigma_i^2$ (S4 falla), con $\operatorname{Cov}(\varepsilon_i,\varepsilon_j)=0$. Causas: corte transversal con unidades de distinto tamaño (el error crece con la escala); aprendizaje o mejora de la medición; asimetría (ingresos, salarios); valores atípicos; mala especificación (omitidas, forma funcional).</p>
      <h4>2. Efectos</h4>
      $$\operatorname{Var}(\hat\beta\mid X)=(X'X)^{-1}X'\,\Sigma\,X(X'X)^{-1},\qquad \Sigma=\operatorname{diag}(\sigma_1^2,\dots,\sigma_n^2)$$
      <p>En regresión simple: $\operatorname{Var}(\hat\beta_1)=\dfrac{\sum(x_i-\bar x)^2\sigma_i^2}{S_{xx}^2}$, que solo coincide con $\sigma^2/S_{xx}$ si $\sigma_i^2=\sigma^2$.</p>
      <ul><li>$\hat\beta$ <b>insesgado y consistente</b> (no interviene la varianza).</li><li>$\hat\beta$ <b>no es MELI</b>: MCP/MCG lo supera.</li><li>$\widehat{\operatorname{Var}}$ usual $\hat\sigma^2(X'X)^{-1}$ es <b>incorrecta</b>: en el caso típico (varianza creciente con $x$) <i>subestima</i> la varianza ⇒ $t$ inflados, intervalos angostos, se rechaza $H_0$ verdadera mucho más de $\alpha$. Esto no se arregla con $n$ grande.</li></ul>
      <h4>3. Identificación</h4>
      <p><b>Informal:</b> gráfico de $\hat\varepsilon_i$ (o $\hat\varepsilon_i^2$) contra $\hat y_i$ o contra la $x$ sospechosa; un abanico sugiere heteroscedasticidad. Todas las pruebas siguientes tienen $H_0$: homoscedasticidad.</p>
      <table class="tbl"><tr><th>Prueba</th><th>Procedimiento</th><th>Estadístico / decisión</th></tr>
      <tr><td><b>Park</b></td><td>Regresar $\ln\hat\varepsilon_i^2$ sobre $\ln x_i$</td><td>$t$ del pendiente; rechazar $H_0$ si es significativo. Pendiente ≈ 2 sugiere $\sigma_i^2\propto x_i^2$</td></tr>
      <tr><td><b>Glejser</b></td><td>Regresar $|\hat\varepsilon_i|$ sobre $x_i$, $\sqrt{x_i}$, $1/x_i$…</td><td>$t$ del pendiente</td></tr>
      <tr><td><b>Goldfeld–Quandt</b></td><td>Ordenar por $x$ sospechosa, omitir $c$ observaciones centrales, estimar dos regresiones y comparar</td><td>$F=\dfrac{SCR_2/gl_2}{SCR_1/gl_1}\sim F_{gl_2,\,gl_1}$; $F$ grande ⇒ heteroscedasticidad</td></tr>
      <tr><td><b>Breusch–Pagan</b></td><td>Regresar $\hat\varepsilon^2$ sobre las $x$ (forma lineal)</td><td>$nR^2_{aux}\sim\chi^2_q$ ($q$ = nº de regresoras auxiliares)</td></tr>
      <tr><td><b>White</b></td><td>Regresar $\hat\varepsilon^2$ sobre $x$, $x^2$ y productos cruzados (no supone forma)</td><td>$nR^2_{aux}\sim\chi^2_q$; pierde potencia con muchas $x$</td></tr></table>
      <h4>4. Remedios</h4>
      <table class="tbl"><tr><th>Remedio</th><th>Qué hace</th><th>Cuándo</th></tr>
      <tr><td><b>Errores robustos de White</b> (HC0–HC3)</td><td>Mantiene $\hat\beta$ y estima el sándwich $(X'X)^{-1}X'\operatorname{diag}(\hat\varepsilon_i^2)X(X'X)^{-1}$</td><td>Opción por defecto en corte transversal: no exige conocer la forma. Corrige la <i>inferencia</i>, no la eficiencia. HC3 es más conservadora en muestras pequeñas</td></tr>
      <tr><td><b>MCP / MCG</b></td><td>Divide cada observación por $\sigma_i$ (pesos $1/\sigma_i^2$) ⇒ error homoscedástico; los $\hat\beta$ cambian</td><td>Si la forma de $\sigma_i^2$ es conocida o razonablemente estimable (MCGF). Con una forma mal especificada puede quedar peor que White</td></tr>
      <tr><td><b>Transformación</b></td><td>Pasar $y$ (o $x$) a logaritmos</td><td>Variables positivas y asimétricas (salarios, ingresos): suele atenuar el problema</td></tr></table>`,
    ejemplo: {
      titulo: 'Corregir con MCP: de $\\operatorname{Var}(\\varepsilon_i)=\\sigma^2x_i^2$ a un error homoscedástico',
      pasos: [
        R`Modelo $y_i=\beta_0+\beta_1x_i+\varepsilon_i$ con $\operatorname{Var}(\varepsilon_i)=\sigma^2x_i^2$ (la desviación crece con $x$).`,
        R`Se divide todo por $x_i$: $\dfrac{y_i}{x_i}=\beta_0\dfrac1{x_i}+\beta_1+\dfrac{\varepsilon_i}{x_i}$.`,
        R`El nuevo error $\varepsilon_i^*=\varepsilon_i/x_i$ tiene $\operatorname{Var}(\varepsilon_i^*)=\sigma^2x_i^2/x_i^2=\sigma^2$: <b>homoscedástico</b>.`,
        R`MCO en el modelo transformado = MCP con pesos $w_i=1/x_i^2$. Nótese que <b>el intercepto original pasa a ser la pendiente</b> de $1/x_i$ y viceversa.`,
        R`Si en cambio $\operatorname{Var}(\varepsilon_i)=\sigma^2x_i$, se divide por $\sqrt{x_i}$ (pesos $1/x_i$).`
      ]
    },
    aplicacion: R`<p><b>Cálculo de una prueba (Breusch–Pagan):</b> $n=100$ y $R^2_{aux}=0.12$ en la regresión de $\hat\varepsilon^2$ sobre una $x$: $nR^2=12>\chi^2_{1;0.05}=3.84$ ⇒ se rechaza $H_0$: hay heteroscedasticidad. Para White con 2 regresoras ($x_1,x_2,x_1^2,x_2^2,x_1x_2$; $q=5$) el crítico es $\chi^2_{5;0.05}=11.07$.</p>
      <p><b>Goldfeld–Quandt:</b> $n=30$, se omiten $c=4$ centrales ⇒ dos grupos de 13, $gl=13-2=11$ cada uno; $F_{0.05;11,11}=2.82$. Si $SCR_2/SCR_1=5$, se rechaza.</p>
      <p><b>Guía de monitoría</b> (simulación $n=200$): con White (HC3) el $ee$ de $\hat\beta_1$ pasa de 0.058 a ≈ 0.117 con los mismos coeficientes; con MCP (pesos $1/ingreso^2$) el $\hat\beta_1$ cambia a ≈ 0.577 y $ee\approx0.060$. <i>White da honestidad; MCP da precisión si acierta la forma.</i> (Cifras citadas de la guía.)</p>`,
    errores: [
      { mal: 'La heteroscedasticidad sesga los $\\hat\\beta$.', bien: 'Sigue insesgado y consistente; pierde eficiencia y la validez de $ee$, $t$ y $F$.' },
      { mal: 'White “arregla” la heteroscedasticidad.', bien: 'Solo corrige el error estándar. El error sigue siendo heteroscedástico y los $\\hat\\beta$ no cambian.' },
      { mal: 'MCP siempre es mejor que White.', bien: 'Solo si la forma de $\\sigma_i^2$ es correcta; si no, puede ser peor. Por eso White es la opción por defecto.' },
      { mal: 'Una curva en los residuos es heteroscedasticidad.', bien: 'Eso indica mala forma funcional; heteroscedasticidad es cambio en la dispersión (abanico).' },
      { mal: 'Con $n$ grande no importa.', bien: 'Los $ee$ usuales siguen siendo inválidos aunque $n$ crezca.' }
    ],
    checks: [
      { q: 'Si $\\operatorname{Var}(\\varepsilon_i)=\\sigma^2x_i^2$, para aplicar MCP se transforma el modelo dividiendo por:', opts: ['$x_i^2$', '$x_i$', '$\\sqrt{x_i}$', '$\\sigma^2$'], c: 1, e: 'Dividir por $\\sigma_i\\propto x_i$ vuelve homoscedástico el error (pesos $1/x_i^2$).' },
      { q: 'En una prueba de White, $nR^2_{aux}=14$ con $q=5$ regresoras auxiliares ($\\chi^2_{5;0.05}=11.07$):', opts: ['No se rechaza $H_0$', 'Se rechaza $H_0$: hay heteroscedasticidad', 'Hay autocorrelación', 'Se rechaza la normalidad'], c: 1, e: '$14>11.07$ ⇒ rechazar homoscedasticidad.' },
      { q: 'Tras estimar con errores de White, los $\\hat\\beta$:', opts: ['Cambian', 'Son idénticos a los de MCO', 'Se vuelven más eficientes', 'Se vuelven insesgados'], c: 1, e: 'White solo cambia la matriz de varianzas.' }
    ],
    lab: ['hetero'], fuente: FUENTE + ' (Sec. 11.5–11.6); guía y script de heteroscedasticidad (monitoría); Solución Taller 2 (1d).'
  });

  /* ===================================================================== t10 · AUTOCORRELACIÓN */
  EL.addTema({
    id: 't10', num: 11, corte: 2, semana: 'Semanas 10–11', titulo: 'Autocorrelación',
    resumen: 'Errores correlacionados en el tiempo: causas, efectos sobre MCO, identificación (gráficos, Durbin–Watson, Breusch–Godfrey) y remedios (MCGF, Newey–West).',
    lecturas: 'Maddala Cap. 6 · Gujarati Cap. 12 · Monitoría 6',
    subtemas: ['Naturaleza y esquema AR(1)', 'Causas', 'Efectos', 'Identificación', 'Remedios'],
    objetivo: 'Reconocer autocorrelación, derivar sus efectos sobre MCO, aplicar e interpretar Durbin–Watson y Breusch–Godfrey, y escoger entre MCGF y errores HAC.',
    intuicion: R`<p>En series de tiempo, un choque de hoy suele “arrastrarse” a mañana: el error de este periodo se parece al del anterior. Los datos contienen menos información independiente de la que aparentan (cada observación repite parte de la anterior), y por eso los errores estándar usuales resultan <b>optimistas</b> y aparecen relaciones “significativas” que no existen.</p>`,
    formal: R`<h4>1. Naturaleza</h4>
      <p>$\operatorname{Cov}(\varepsilon_t,\varepsilon_s|X)\neq0$ para $t\neq s$ (S5 falla). Esquema más usado, AR(1): $\varepsilon_t=\rho\,\varepsilon_{t-1}+\nu_t$, $|\rho|<1$, $\nu_t$ ruido blanco. Entonces
      $$\operatorname{Var}(\varepsilon_t)=\frac{\sigma_\nu^2}{1-\rho^2},\qquad\operatorname{Cov}(\varepsilon_t,\varepsilon_{t-s})=\rho^s\operatorname{Var}(\varepsilon_t)$$
      (la correlación decae geométricamente con el rezago).</p>
      <h4>2. Causas</h4>
      <p>Inercia de las series económicas; <b>mala especificación</b> (variable omitida con comportamiento persistente, forma funcional incorrecta, omitir rezagos): produce autocorrelación “aparente”; fenómenos de telaraña; suavizado o interpolación de datos; transformaciones como primeras diferencias de errores no correlacionados.</p>
      <h4>3. Efectos</h4>
      <ul><li>$\hat\beta$ <b>insesgado</b> (con regresoras no estocásticas / exógenas estrictas) y consistente. Si $Y_{t-1}$ es regresora, además puede ser <b>inconsistente</b>.</li>
      <li><b>No MELI</b>: MCGF tiene menor varianza.</li>
      <li>Con $\rho>0$ (y regresoras positivamente autocorrelacionadas) la varianza usual <b>subestima</b> la verdadera, y $\hat\sigma^2$ subestima $\sigma^2$ ⇒ $t$ inflados, $R^2$ inflado, intervalos angostos, predicciones ineficientes.</li></ul>
      <h4>4. Identificación</h4>
      <ul><li><b>Gráfico</b> de $\hat\varepsilon_t$ en el tiempo (rachas del mismo signo) y de $\hat\varepsilon_t$ vs. $\hat\varepsilon_{t-1}$.</li>
      <li><b>Durbin–Watson:</b> $d=\dfrac{\sum_{t=2}^n(\hat\varepsilon_t-\hat\varepsilon_{t-1})^2}{\sum\hat\varepsilon_t^2}\approx2(1-\hat\rho)$, con $0\le d\le4$.
        <table class="tbl"><tr><th>$d$</th><th>Decisión ($H_0:\rho=0$)</th></tr><tr><td>$0<d<d_L$</td><td>Rechazar: autocorrelación positiva</td></tr><tr><td>$d_L\le d\le d_U$</td><td>Zona de indecisión</td></tr><tr><td>$d_U<d<4-d_U$</td><td>No rechazar</td></tr><tr><td>$4-d_U\le d\le4-d_L$</td><td>Zona de indecisión</td></tr><tr><td>$4-d_L<d<4$</td><td>Rechazar: autocorrelación negativa</td></tr></table>
        Supuestos: modelo con intercepto, regresoras no estocásticas, error AR(1), <b>sin $Y_{t-1}$ entre las regresoras</b>. $d_L,d_U$ están tabulados según $n$ y número de regresoras.</li>
      <li><b>Breusch–Godfrey (LM):</b> regresar $\hat\varepsilon_t$ sobre las $x$ y $\hat\varepsilon_{t-1},\dots,\hat\varepsilon_{t-p}$; estadístico $nR^2_{aux}\sim\chi^2_p$. Válida con $Y_{t-1}$ y para órdenes $p>1$.</li></ul>
      <h4>5. Remedios</h4>
      <ol><li><b>Revisar la especificación primero</b> (omitidas, forma funcional, rezagos): puede desaparecer.</li>
      <li><b>MCGF</b> (estimar $\rho$): se transforma $y_t-\rho y_{t-1}=\beta_0(1-\rho)+\beta_1(x_t-\rho x_{t-1})+\nu_t$, error ya no autocorrelacionado. Con $\rho$ desconocido: aproximar $\hat\rho\approx1-d/2$ o por regresión de $\hat\varepsilon_t$ sobre $\hat\varepsilon_{t-1}$; <b>Cochrane–Orcutt</b> (iterativo, pierde la 1.ª observación) y <b>Prais–Winsten</b> (conserva la 1.ª multiplicándola por $\sqrt{1-\rho^2}$).</li>
      <li><b>Errores HAC de Newey–West:</b> mantienen $\hat\beta$ y corrigen los $ee$ ante autocorrelación (y heteroscedasticidad) sin especificar su forma; válidos en muestras grandes.</li>
      <li>Si $\rho\approx1$: primeras diferencias.</li></ol>`,
    ejemplo: {
      titulo: 'Calcular un Durbin–Watson a mano',
      pasos: [
        R`Residuos de un modelo con $T=6$: $\hat\varepsilon=(1,\,2,\,1,\,-1,\,-2,\,-1)$.`,
        R`Numerador $\sum_{t=2}^6(\hat\varepsilon_t-\hat\varepsilon_{t-1})^2=(1)^2+(-1)^2+(-2)^2+(-1)^2+(1)^2=1+1+4+1+1=8$.`,
        R`Denominador $\sum\hat\varepsilon_t^2=1+4+1+1+4+1=12$ ⇒ $d=8/12=0.667$.`,
        R`$\hat\rho$ por regresión: $\sum\hat\varepsilon_t\hat\varepsilon_{t-1}/\sum\hat\varepsilon_t^2=(2+2-1+2+2)/12=0.583$; $2(1-\hat\rho)=0.83$ (cercano a $d=0.667$; la aproximación mejora con $T$ grande).`,
        R`Lectura: $d$ muy por debajo de 2 ⇒ autocorrelación positiva fuerte. Con $T=6$ la prueba no es informativa; en un caso real se compara con $d_L$ y $d_U$.`
      ]
    },
    aplicacion: R`<p>Con $n=30$ y una regresora, los límites al 5 % son $d_L=1.352$ y $d_U=1.489$. Si $d=1.10<d_L$ ⇒ se rechaza $H_0$ (autocorrelación positiva); si $d=1.42$ ⇒ zona de indecisión; si $d=1.80$ ⇒ no se rechaza. Si el modelo incluye $Y_{t-1}$, <b>no se usa DW</b>: se usa Breusch–Godfrey.</p>
      <p>Secuencia de trabajo: MCO → gráfico de residuos → DW / Breusch–Godfrey → si rechaza: revisar especificación → reportar Newey–West (o MCGF) → reinterpretar significancia con los $ee$ corregidos.</p>`,
    errores: [
      { mal: 'Con autocorrelación, MCO es sesgado.', bien: 'Es insesgado (sin $Y_{t-1}$ como regresora); se pierde eficiencia y la validez de los $ee$.' },
      { mal: 'Durbin–Watson sirve siempre.', bien: 'Con $Y_{t-1}$ entre las regresoras está sesgado hacia 2: usa Breusch–Godfrey.' },
      { mal: '$d$ cerca de 0 indica autocorrelación negativa.', bien: '$d\\approx2(1-\\hat\\rho)$: $d$ cerca de 0 ⇒ $\\hat\\rho\\approx1$ (positiva); $d$ cerca de 4 ⇒ negativa.' },
      { mal: 'Newey–West cambia los coeficientes.', bien: 'No: solo corrige los errores estándar.' },
      { mal: 'La autocorrelación siempre es un problema del error.', bien: 'A menudo es síntoma de omitir variables, rezagos o una forma funcional correcta.' }
    ],
    checks: [
      { q: 'Si $d=0.8$, el $\\hat\\rho$ aproximado y la lectura son:', opts: ['$\\hat\\rho\\approx0.6$; autocorrelación positiva', '$\\hat\\rho\\approx-0.6$; negativa', '$\\hat\\rho\\approx0.8$; positiva', '$\\hat\\rho\\approx0$; no hay'], c: 0, e: '$\\hat\\rho\\approx1-d/2=0.6$.' },
      { q: 'El modelo incluye $Y_{t-1}$. La prueba adecuada para autocorrelación es:', opts: ['Durbin–Watson', 'Breusch–Godfrey', 'White', 'Goldfeld–Quandt'], c: 1, e: 'DW no es válida con rezago de la dependiente; Breusch–Godfrey sí.' },
      { q: 'En Cochrane–Orcutt, la transformación aplicada es:', opts: ['$y_t/x_t$', '$y_t-\\hat\\rho y_{t-1}$ y $x_t-\\hat\\rho x_{t-1}$', '$\\ln y_t$', 'Restar la media'], c: 1, e: 'Diferencia cuasi-generalizada; el error transformado es $\\nu_t$, sin autocorrelación.' }
    ],
    lab: ['auto'], fuente: FUENTE + ' (Cap. 12: 12.6 detección, 12.9–12.11 remedios).'
  });
})(typeof window !== 'undefined' ? window : globalThis);
