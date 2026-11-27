/* temas-clase.js — Ajustes de los temas a la forma en que se explican en las notas de clase (guía de estudio de la profesora) y a los
   materiales extra (autocorrelación, prueba F, heterocedasticidad). Se carga DESPUÉS de los temas y los enriquece: vocabulario de clase
   (α, β, Sxx, Sxy, SCE, “error vs residuo”, los cinco supuestos sobre el error), ejemplos con tablas, prioridades y enlaces a los casos.
   Los ejemplos y datos son propios; las notas se usaron como guía de enfoque, no se reproducen.                                          */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;
  const T = id => EL.TEMAS.find(t => t.id === id);
  function plus(id, o) {
    const t = T(id); if (!t) throw new Error('tema inexistente ' + id);
    if (o.formal) t.formal += o.formal;
    if (o.aplicacion) t.aplicacion += o.aplicacion;
    if (o.errores) t.errores = t.errores.concat(o.errores);
    if (o.checks) t.checks = t.checks.concat(o.checks);
    if (o.ejemplo2) t.ejemplo2 = [].concat(t.ejemplo2 || [], o.ejemplo2);
    if (o.prioridad) t.prioridad = o.prioridad;
    if (o.fuente) t.fuente += ' ' + o.fuente;
    if (o.lab) t.lab = (t.lab || []).concat(o.lab);
  }
  const NC = 'Notas de clase (guía de estudio).';

  /* ---- t0 ---- */
  plus('t0', { prioridad: 'complemento', fuente: NC,
    formal: R`<h4>Cómo se ve en clase: estimador, error estándar y muestras grandes</h4>
      <ul><li><b>Estimador vs. estimación:</b> el estimador es una variable aleatoria (cambia de muestra en muestra); la estimación es el valor que resulta con una muestra concreta.</li>
      <li><b>Desviación estándar vs. error estándar:</b> la primera mide cuánto varían los individuos; el segundo, cuánto varían las medias muestrales, $\sigma/\sqrt n$. Para reducirlo a la mitad hay que <b>cuadruplicar</b> $n$.</li>
      <li><b>Sesgo</b> $=E(\hat\theta)-\theta$ (negativo ⇒ el estimador subestima). La varianza dividida por $N$ tiene sesgo $-\sigma^2/N$: por eso se divide por $N-1$.</li>
      <li><b>Eficiencia y ECM:</b> entre insesgados es más eficiente el de menor varianza. El error cuadrático medio, $ECM=\text{sesgo}^2+\text{varianza}$, combina ambos criterios: un estimador algo sesgado con varianza muy baja puede ser preferible.</li>
      <li><b>Consistencia:</b> una condición suficiente es que el sesgo y la varianza tiendan a cero cuando $n$ crece. La varianza con divisor $N$ es sesgada pero consistente.</li>
      <li><b>Muestras grandes:</b> por la ley de los grandes números y el TLC, la media muestral es aproximadamente normal con media $\mu$ y varianza $\sigma^2/n$, sin importar la distribución original. Los resultados válidos para $n$ grande se llaman <i>propiedades asintóticas</i>.</li></ul>`,
    errores: [{ mal: 'La desviación estándar y el error estándar son lo mismo.', bien: 'La desviación estándar describe a los individuos; el error estándar describe la variabilidad de un estimador (σ/√n para la media) y se encoge al crecer $n$.' }],
    checks: [{ q: R`Una población tiene $\sigma=24$. ¿Cuál es el error estándar de la media con $n=16$, y qué tamaño de muestra lo reduce a la mitad?`, opts: ['6; $n=64$', '1.5; $n=32$', '6; $n=32$', '24; $n=64$'], c: 0, e: R`$24/\sqrt{16}=6$. Para $3$ hay que multiplicar $n$ por 4 (la raíz cuadrada): $n=64$.` }] });

  /* ---- t1 ---- */
  plus('t1', { fuente: NC,
    formal: R`<h4>Los cinco supuestos tal como se enuncian en clase</h4>
      <p>En regresión simple, $y=\alpha+\beta x+\varepsilon$, la estimación supone cinco cosas <b>sobre el error</b>:</p>
      <table class="tbl"><tr><th>#</th><th>En clase</th><th>Expresión</th><th>En la guía matricial (S1–S6)</th></tr>
      <tr><td>1</td><td>Media del error cero</td><td>$E(\varepsilon_i)=0$</td><td>parte de S3</td></tr>
      <tr><td>2</td><td>Homogeneidad de varianza (homocedasticidad)</td><td>$\operatorname{Var}(\varepsilon_i)=\sigma^2$</td><td>S4</td></tr>
      <tr><td>3</td><td>Independencia entre errores</td><td>$\operatorname{Cov}(\varepsilon_i,\varepsilon_j)=0$</td><td>S5</td></tr>
      <tr><td>4</td><td>Independencia entre el error y la variable independiente</td><td>$\operatorname{Cov}(\varepsilon_i,x_i)=0$</td><td>S3 (exogeneidad)</td></tr>
      <tr><td>5</td><td>Normalidad</td><td>$\varepsilon_i\sim N(0,\sigma^2)$</td><td>S6</td></tr></table>
      <p>Por el supuesto 1: $E(y_i)=\alpha+\beta x_i$, es decir, la recta da el valor esperado de $y$ para cada $x$. Cuando la varianza del error depende de $x$ (heterocedasticidad) se violan <b>a la vez los supuestos 2 y 4</b>. El término de error es imprescindible porque recoge la aleatoriedad de la conducta, las variables omitidas y los errores de medición.</p>
      <h4>Verificar los supuestos con los residuos (antes de hacer inferencia)</h4>
      <ul><li>Se revisan sus <b>medias, varianzas y covarianzas</b>, y gráficamente la nube de residuos contra $x$ (no debe haber patrón) y su correlación con $x$.</li>
      <li><b>Normalidad:</b> histograma o boxplot de los residuos; <b>gráfica QQ</b> (puntos sobre la diagonal ⇒ normal; una S o una curva indican colas cortas/pesadas o asimetría); y pruebas formales (Jarque–Bera, Kolmogorov–Smirnov, Anderson–Darling).</li>
      <li><b>Jarque–Bera:</b> $JB=n\Big[\dfrac{s^2}{6}+\dfrac{(k-3)^2}{24}\Big]\sim\chi^2_2$ con $s$ la asimetría y $k$ la curtosis; $H_0$: normalidad. La normal tiene $s=0$ y $k=3$. Si $JB$ supera 5.99 (5 %), se rechaza la normalidad.</li>
      <li><b>Efectos y soluciones:</b> con $n$ grande, desviaciones pequeñas de la normalidad no importan (propiedades asintóticas); con $n$ pequeño o fuerte no normalidad las pruebas pierden poder. Soluciones: aumentar $n$, transformar variables (logaritmos), revisar los otros supuestos y los valores extremos.</li></ul>`,
    errores: [{ mal: 'Los supuestos se verifican directamente sobre los errores $\\varepsilon$.', bien: 'Los errores no se observan: los supuestos son sobre $\\varepsilon$, pero se verifican con los <b>residuos</b> $\\hat\\varepsilon$.' }],
    checks: [{ q: R`Una prueba de Jarque–Bera sobre los residuos da $JB=2.9$ con $n=50$ (crítico $\chi^2_2$ al 5 % $=5.99$). ¿Qué se concluye?`, opts: ['No se rechaza la normalidad', 'Se rechaza la normalidad', 'Hay heterocedasticidad', 'Hay autocorrelación'], c: 0, e: '$2.9<5.99$: no se rechaza $H_0$ de normalidad.' }] });

  /* ---- t2 ---- */
  plus('t2', { fuente: NC,
    formal: R`<h4>La derivación de clase en regresión simple ($\alpha$, $\beta$, $S_{xx}$, $S_{xy}$)</h4>
      <p>Se minimiza $Q=\sum(y_i-\hat\alpha-\hat\beta x_i)^2$ (al cuadrado porque la suma simple de errores se cancela, castiga más los errores grandes y permite derivar). Igualando a cero las derivadas: $\bar y=\hat\alpha+\hat\beta\bar x$ y $\sum y_ix_i=\hat\alpha\sum x_i+\hat\beta\sum x_i^2$. Con
      $S_{xx}=\sum x^2-n\bar x^2$, $S_{xy}=\sum xy-n\bar x\bar y$, $S_{yy}=\sum y^2-n\bar y^2$:</p>
      $$\hat\beta=\frac{S_{xy}}{S_{xx}},\qquad\hat\alpha=\bar y-\hat\beta\bar x,\qquad SCE=S_{yy}-\hat\beta S_{xy}$$
      <p><b>Seis propiedades de la recta de MCO:</b> (1) $\sum\hat\varepsilon_i=0$; (2) la $SCE$ es un mínimo; (3) $\sum y_i=\sum\hat y_i$; (4) $\sum x_i\hat\varepsilon_i=0$; (5) $\sum\hat y_i\hat\varepsilon_i=0$; (6) la recta pasa por $(\bar x,\bar y)$. Además, $\hat\beta$ y la correlación $r$ tienen el mismo numerador, así que siempre el mismo signo.</p>
      <p><b>Partición fundamental:</b> $SCTotal=S_{yy}=\underbrace{\hat\beta S_{xy}}_{SCExplicado}+SCE$.</p>`,
    ejemplo2: { titulo: 'Una panadería (como se resuelve una tabla a mano)',
      pasos: [
        R`Una panadería registra las horas diarias de horno ($x$) y las docenas de pan producidas ($y$) en 8 días: $x=(4,5,5,6,7,8,8,9)$ y $y=(7,8,10,9,12,12,14,15)$.`,
        R`Sumas: $\sum x=52$, $\sum y=87$, $\sum x^2=360$, $\sum y^2=1003$, $\sum xy=599$. Medias: $\bar x=6.5$, $\bar y=10.875$.`,
        R`$S_{xx}=360-8(6.5)^2=22$; $S_{xy}=599-8(6.5)(10.875)=33.5$; $S_{yy}=1003-8(10.875)^2=56.875$.`,
        R`$\hat\beta=33.5/22=1.523$; $\hat\alpha=10.875-1.523(6.5)=0.977$. Recta: $\hat y=0.977+1.523\,x$.`,
        R`<b>Interpretación:</b> cada hora adicional de horno se asocia, en promedio, con 1.52 docenas más. El intercepto (0.98 docenas con 0 horas) no se interpreta: 0 está fuera del rango observado (4 a 9 horas).`,
        R`Comprobación: la recta pasa por $(6.5;\,10.875)$ y los residuos suman 0. Un error típico es usar $(\sum x)^2=2704$ en vez de $\sum x^2=360$: ¡son cosas distintas!`
      ] },
    errores: [{ mal: 'Usar $(\\sum x_i)^2$ donde va $\\sum x_i^2$ al llenar la tabla a mano.', bien: 'Son distintos: $5^2+7^2=74$, pero $(5+7)^2=144$. Es el error más común al calcular $S_{xx}$.' }, { mal: 'Interpretar el intercepto y predecir fuera del rango de $x$.', bien: 'La recta solo describe bien dentro del rango observado; el intercepto suele no tener interpretación.' }],
    checks: [{ q: R`Con $n=4$: $\sum x=12$, $\sum y=20$, $\sum x^2=44$, $\sum xy=70$. ¿Cuánto vale $\hat\beta$?`, opts: ['0.8', '1.25', '2.5', '0.4'], c: 1, e: R`$\bar x=3$, $\bar y=5$; $S_{xx}=44-4(9)=8$; $S_{xy}=70-4(3)(5)=10$; $\hat\beta=10/8=1.25$ (y $\hat\alpha=5-1.25(3)=1.25$).` }] });

  /* ---- t3 ---- */
  plus('t3', { fuente: NC,
    formal: R`<h4>Varianza de los estimadores en regresión simple (con intuición)</h4>
      $$\operatorname{Var}(\hat\beta)=\frac{\sigma^2}{S_{xx}},\quad\operatorname{Var}(\hat\alpha)=\sigma^2\Big(\frac1n+\frac{\bar x^2}{S_{xx}}\Big),\quad\operatorname{Cov}(\hat\alpha,\hat\beta)=-\frac{\sigma^2\bar x}{S_{xx}}$$
      <p>La pendiente se estima mejor cuando los puntos están poco dispersos alrededor de la recta ($\sigma^2$ pequeño) y cuando $x$ varía mucho ($S_{xx}$ grande): si todos los empleados trabajaran 8 horas, sería imposible saber qué pasa al trabajar más o menos. Como $\sigma^2$ es desconocida se estima con $\hat\sigma^2=SCE/(n-2)$: se pierden dos grados de libertad porque se estimaron dos parámetros (con dos puntos la recta pasa por ambos y no queda información sobre la dispersión). Además $SCE/\sigma^2\sim\chi^2_{n-2}$.</p>` });

  /* ---- t4 ---- */
  plus('t4', { fuente: NC,
    aplicacion: R`<h4>Inferencia completa con la panadería ($n=8$, tabla del tema 2)</h4>
      <ul><li>$SCE=S_{yy}-\hat\beta S_{xy}=56.875-1.523(33.5)=5.864$; $\hat\sigma^2=5.864/6=0.977$.</li>
      <li>$ee(\hat\beta)=\sqrt{0.977/22}=0.211$; $ee(\hat\alpha)=\sqrt{0.977\,(1/8+6.5^2/22)}=1.414$.</li>
      <li>$t(\hat\beta)=1.523/0.211=7.22$ vs. $t_{0.025,6}=2.447$ ⇒ <b>significativa</b>; IC 95 %: $1.523\pm2.447(0.211)=(1.01;\,2.04)$. Para $\hat\alpha$: $t=0.69$ ⇒ no significativa (IC $(-2.48;\,4.44)$ incluye el 0).</li>
      <li><b>Predicción</b> en $x_0=7.5$ (dentro del rango): $\hat y_0=12.40$. Para <i>un día</i> cualquiera: error estándar $\hat\sigma\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}=1.07$, intervalo $(9.78;\,15.01)$. Para el <i>promedio</i> de los días con 7.5 horas se quita el 1: $(11.40;\,13.40)$, más angosto. El error crece al alejarse de $\bar x$: por eso no se predice fuera del rango.</li>
      <li><b>Probar otros valores:</b> cualquier $\beta_0$ dentro de $(1.01;\,2.04)$ no se rechaza al 5 %. Los asteriscos (*, **, ***: 90, 95, 99 %) solo tienen sentido si $\beta=0$ es una hipótesis interesante; casi siempre importa más <i>cuánto</i> efecto hay: para eso sirve el intervalo.</li></ul>`,
    errores: [{ mal: 'Predecir con un valor de $x$ muy fuera de los datos “porque la recta lo permite”.', bien: 'El error de predicción crece con $(x_0-\\bar x)^2$ y la relación fuera del rango no se observó: es extrapolar.' }] });

  /* ---- t5 ---- */
  plus('t5', { prioridad: 'nucleo', fuente: NC, lab: ['salida'],
    formal: R`<h4>El ANOVA y la lectura de una salida (como en clase)</h4>
      <table class="tbl"><tr><th>En clase</th><th>Símbolo</th><th>Equivale a</th></tr>
      <tr><td>SCTotal</td><td>$S_{yy}$, TSS</td><td>variación total de $y$</td></tr><tr><td>SCExplicado</td><td>$\hat\beta S_{xy}$, ESS</td><td>lo que explica la recta (<i>Model</i> en Stata)</td></tr><tr><td>SCError (SCE)</td><td>$S_{yy}-\hat\beta S_{xy}$, RSS</td><td>lo que no explica (<i>Residual</i>); en la plataforma también se escribe SCR</td></tr></table>
      <table class="tbl"><tr><th>Fuente</th><th>SS</th><th>gl</th><th>MS</th></tr><tr><td>Explicada (X)</td><td>ESS</td><td>1 (o $k-1$)</td><td>ESS/gl</td></tr><tr><td>Residuos</td><td>RSS</td><td>$n-2$ (o $n-k$)</td><td>$\hat\sigma^2$</td></tr><tr><td>Total</td><td>TSS</td><td>$n-1$</td><td></td></tr></table>
      $$F=\frac{ESS/1}{RSS/(n-2)}\sim F_{1,\,n-2},\qquad R^2=\frac{ESS}{TSS}=\frac{\hat\beta S_{xy}}{S_{yy}}$$
      <ul><li>En regresión simple la $F$ prueba solo la pendiente ($H_0:\beta=0$; el intercepto no entra) y $F=t^2$. En regresión múltiple la $F$ prueba todas las pendientes a la vez.</li>
      <li><b>Regla empírica de clase:</b> un $R^2$ por encima de ≈ 0.8 se considera buen ajuste; es una guía, no una ley. En datos de personas (ingresos, salud) los $R^2$ bajos son normales aunque la relación sea real: <i>significativo pero con $R^2$ bajo</i> no es contradictorio.</li>
      <li><b>Leer una salida tipo Stata:</b> arriba <i>Source / SS / df / MS</i>, <i>Number of obs</i>, <i>F(k-1, n-k)</i>, <i>Prob &gt; F</i>, <i>R-squared</i>, <i>Adj R-squared</i> y <i>Root MSE</i> ($=\hat\sigma$); abajo, por variable, <i>Coef.</i>, <i>Std. Err.</i>, <i>t</i> $=$ Coef/Std. Err., <i>P&gt;|t|</i> y el intervalo. Las piezas deben cuadrar: $t=\text{Coef}/ee$, $F=t^2$, $R^2=SS_{Model}/SS_{Total}$. Revisa también el <i>Number of obs</i> (los casos con datos faltantes se descartan) y las unidades.</li></ul>`,
    aplicacion: R`<p>Panadería: $R^2=51.01/56.875=0.897$; $F=\dfrac{51.01}{5.864/6}=52.2=7.22^2$ ✔. Root MSE $=\sqrt{0.977}=0.99$ docenas: lo que se equivoca típicamente la recta.</p>`,
    errores: [{ mal: 'Un $R^2$ de 0.04 con un $t$ muy significativo es una contradicción.', bien: 'No lo es: la significancia dice que la relación existe; el $R^2$, cuánto de la variación explica.' }] });

  /* ---- t6 ---- */
  plus('t6', { fuente: NC,
    formal: R`<h4>Solución al sesgo por omitidas: incluir la variable o una proxy</h4>
      <p>La solución es <b>incluir</b> la variable omitida. Si no se puede (no se puede medir, es costosa o no existe métrica), se usa una <b>proxy</b>: una variable que no es exactamente lo que se quiere medir pero lo aproxima (p. ej. el puntaje de una prueba de aptitud como proxy de habilidad). El sesgo es el producto de dos cosas, y basta que una sea cero para que desaparezca: $\beta_2$ (cuánto afecta la omitida a $y$) y $\delta$ (cuánto se relaciona con la incluida).</p>
      <p><b>Ejemplo clásico:</b> si la cantidad demandada se explica solo con el precio y se omite el ingreso, puede salir una pendiente <i>positiva</i> para el precio: como el ingreso aumenta la demanda ($\beta_2>0$) y en la serie precio e ingreso suben juntos ($\delta>0$), el sesgo positivo disfraza el signo negativo esperado.</p>` });

  /* ---- t7 ---- */
  plus('t7', { prioridad: 'nucleo', fuente: NC,
    formal: R`<h4>Valores extremos y forma funcional: el precio de transformar</h4>
      <ul><li><b>Valores extremos:</b> se identifican con nubes de puntos, boxplots y gráficos de residuos; jalan la recta y cambian la pendiente. Se reestima sin ellos y se compara (con $n$ grande el $R^2$ ayuda a decidir). Un resumen numérico no basta: <b>siempre se grafican los datos</b> (cuarteto de Anscombe: cuatro conjuntos con la misma recta y el mismo $r^2$ pero muy distintos).</li>
      <li><b>Cualquier transformación monótona</b> (cuadrado, raíz, inverso, exponencial, logaritmo…) se estima igual por MCO creando la nueva variable; <b>lo que cambia es la interpretación</b> de $\beta$. Si se define “súper $x$” $=\ln x$, $\beta$ ya no es “cuánto cambia $y$ al subir $x$ una unidad”.</li>
      <li>El logaritmo es la transformación que mejor suele funcionar contra la heterocedasticidad.</li></ul>` });

  /* ---- t13 (panorama) ---- */
  plus('t13', { fuente: 'Notas de clase (supuestos, normalidad, heterocedasticidad) y materiales extra de autocorrelación, prueba F y heterocedasticidad.',
    formal: R`<h4>Cómo se trabaja en clase: leer salidas y decidir</h4>
      <p>En clase cada problema se estudia sobre <b>una salida de regresión (tipo Stata)</b> con gráficos y pruebas, y se pide <i>justificar un veredicto</i>. La rutina es: (1) gráficos (dispersión, residuos); (2) pruebas formales ($H_0$, estadístico, decisión); (3) consecuencia para $\hat\beta$, $ee$, $t$, $F$; (4) remedio y comprobación de que funcionó. Los casos resueltos de los temas 9 a 12 siguen esa rutina con datos simulados.</p>
      <p><b>Normalidad:</b> histograma/boxplot de residuos, gráfica QQ y Jarque–Bera (tema 1). Con $n$ grande las propiedades asintóticas “nos salvan”; con $n$ pequeño las pruebas pierden poder.</p>` });

  /* ---- t8 / t9 / t10 / t11 ---- */
  plus('t8', { prioridad: 'nucleo', fuente: 'Material de clase: casos con salidas.',
    aplicacion: R`<p><b>En una salida:</b> las regresiones simples muestran cada variable muy significativa, pero la múltiple muestra $t$ pequeños, errores estándar mucho mayores y una $F$ global alta; el $R^2$ casi no cambia. Se confirma con la regresión auxiliar de una regresora sobre la otra ($R^2_{aux}$ alto ⇒ $FIV$ alto). Ver el caso resuelto de este tema.</p>` });
  plus('t9', { prioridad: 'nucleo', fuente: 'Notas de clase (Sec. de heterocedasticidad) y material extra de heterocedasticidad.',
    formal: R`<h4>La versión de clase de las pruebas</h4>
      <ul><li><b>Gráfica:</b> la dispersión de $y$ alrededor de la recta crece con $x$ (“trompeta”); residuos contra $x$ no deben mostrar patrón.</li>
      <li><b>White (clase):</b> $\hat\varepsilon^2=\alpha+\beta_1x+\beta_2x^2+u$; si $x$ o $x^2$ explican significativamente los residuos al cuadrado (miran $F$ y $t$, o $nR^2\sim\chi^2_2$), hay heterocedasticidad.</li>
      <li><b>Ramsey (RESET):</b> se añade $\hat y^2$ al modelo; si es significativo, hay mala forma funcional (curvatura), no solo varianza no constante.</li>
      <li><b>Goldfeld–Quandt:</b> ordenar por $x$, omitir las centrales y comparar $F=RSS_2/RSS_1$ (con gl de cada grupo).</li>
      <li><b>Valores extremos:</b> pueden crear o esconder heterocedasticidad; se repite el análisis sin ellos y se comparan los veredictos.</li>
      <li><b>Remedios (en este orden de uso):</b> transformaciones (logaritmos suelen funcionar mejor), errores estándar robustos y mínimos cuadrados ponderados.</li></ul>` });
  plus('t10', { prioridad: 'nucleo', fuente: 'Material extra de autocorrelación (elegir la mejor especificación).',
    formal: R`<h4>Elegir la especificación: tres lecciones de clase</h4>
      <ul><li><b>Un $d$ bajo no siempre es AR(1):</b> una relación curva ajustada con una recta deja rachas de residuos positivos, negativos y otra vez positivos; eso baja $d$. Si el problema no es AR(1), la solución <i>no</i> puede ser corregir AR(1): se arregla la forma funcional (p. ej. logaritmos).</li>
      <li><b>Corregir un AR(1) que no existe</b> da un modelo algo menos eficiente (errores estándar mayores) porque se estima un parámetro innecesario.</li>
      <li><b>Añadir rezagos</b> ($Y_{t-1}$, $X_{t-1}$) puede producir <b>multicolinealidad</b> (el error estándar de $x$ se dispara) y pérdida de eficiencia.</li></ul>
      <p>Para elegir, se comparan las columnas: coeficiente y error estándar de $x$, $\rho$, $R^2$, RSS y $d$ de cada especificación; se prefiere la más simple que resuelve el problema.</p>` });
  plus('t11', { prioridad: 'nucleo', fuente: 'Material extra de la prueba F (bondad de ajuste con la tabla ANOVA).',
    formal: R`<h4>La prueba F de relevancia conjunta, paso a paso</h4>
      <p>Se estima el modelo restringido y el completo y se anota la <b>suma de cuadrados de los residuos</b> de cada tabla ANOVA. La mejora de añadir $q$ variables es la <b>reducción del RSS</b>; el costo son <b>$q$ grados de libertad</b>. $F(q,\,n-k)=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}$ con $k$ los parámetros del completo. Una $F$ alta (por encima del crítico) rechaza $H_0$: las variables añadidas aportan poder explicativo <i>en conjunto</i>. Con $q=1$, $F=t^2$.</p>` });
  plus('t12', { prioridad: 'complemento' });

  /* ---- t14 (grupo de la profesora Sofía) ---- */
  plus('t14', { prioridad: 'nucleo', fuente: 'Enfoque de clase de la profesora Urdinola (LGN, TLC, propiedades asintóticas) como complemento.',
    formal: R`<h4>Versión intuitiva (la que se usa en clase de estadística)</h4>
      <p>Con muestras grandes y aleatorias, la media muestral es aproximadamente normal con media $\mu$ y varianza $\sigma^2/n$ sin importar la distribución original; el error estándar $\sigma/\sqrt n$ se encoge y la distribución colapsa sobre $\mu$. Un estimador es consistente si se acerca tanto como se quiera al valor verdadero al crecer $n$; condición suficiente: sesgo y varianza tienden a cero. Estas son las <b>propiedades asintóticas</b>: se conocen mucho mejor las de las muestras grandes, y por eso se prefieren.</p>` });
})(typeof window !== 'undefined' ? window : globalThis);
