/* temas.js — Contenidos del Corte 1 (Módulos 0–7). SOLO CONTENIDO: sin lógica de interfaz.
   Convención del curso usada en toda la plataforma (coincide con el plan en Markdown y con los exámenes del curso):
   y = Xβ + ε ; n observaciones ; k = número de PARÁMETROS incluido el intercepto ; gl = n − k ; H = X(X'X)^{-1}X' ; M = I − H.
   Los textos usan $...$ (fórmula en línea) y $$...$$ (bloque). No escribir el símbolo de peso para moneda.            */
(function (root) {
  'use strict';
  const EL = root.EL;
  const R = String.raw;
  EL.TEMAS = EL.TEMAS || [];
  EL.addTema = t => EL.TEMAS.push(t);

  /* ===================================================================== t0 */
  EL.addTema({
    id: 't0', num: 0, corte: 1, semana: 'Semana 1', titulo: 'Repaso: inferencia estadística y álgebra matricial',
    resumen: 'Lo mínimo de probabilidad, estimadores y matrices que se necesita antes de tocar la regresión.',
    lecturas: 'Maddala Cap. 1–2 · Gujarati Apéndice A',
    subtemas: ['Momentos de una variable aleatoria', 'Propiedades de un estimador', 'Pruebas de hipótesis', 'Matrices: rango, determinante, inversa'],
    objetivo: 'Recordar las herramientas (esperanza, varianza, insesgamiento, consistencia, rango e inversa matricial) sobre las que se construye todo el modelo de regresión.',
    intuicion: R`<p>Un <b>estimador</b> es una receta que convierte datos en un número. Como los datos cambian de muestra en muestra, el estimador es una <i>variable aleatoria</i>: tiene una distribución muestral con un centro (¿acierta en promedio?) y una dispersión (¿qué tan estable es?).</p>
      <p>Las matrices aparecen porque la regresión es un sistema de ecuaciones: ordenar los datos en $X$ y $y$ permite escribir <i>toda</i> la solución en una línea, $\hat\beta=(X'X)^{-1}X'y$. Para que esa línea tenga sentido necesitamos que $X'X$ sea <b>invertible</b>.</p>`,
    formal: R`<h4>Probabilidad</h4>
      <ul><li>$E(X)$ es el promedio ponderado por probabilidades; es lineal: $E(aX+b)=aE(X)+b$.</li>
      <li>$\operatorname{Var}(X)=E[(X-E(X))^2]$ mide dispersión; $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$.</li>
      <li>$\operatorname{Cov}(X,Y)=E[(X-E X)(Y-E Y)]$ y $\operatorname{Var}(aX+bY)=a^2\operatorname{Var}X+b^2\operatorname{Var}Y+2ab\operatorname{Cov}(X,Y)$.</li></ul>
      <h4>Propiedades de un estimador $\hat\theta$</h4>
      <table class="tbl"><tr><th>Propiedad</th><th>Definición</th><th>Tipo</th></tr>
      <tr><td>Insesgamiento</td><td>$E(\hat\theta)=\theta$</td><td>Muestra finita</td></tr>
      <tr><td>Eficiencia</td><td>Varianza mínima dentro de una clase (p. ej. lineales e insesgados)</td><td>Muestra finita</td></tr>
      <tr><td>Consistencia</td><td>$\operatorname{plim}\hat\theta_n=\theta$</td><td>Asintótica</td></tr></table>
      <h4>Álgebra matricial</h4>
      <ul><li>$(AB)'=B'A'$ y $(AB)^{-1}=B^{-1}A^{-1}$ (se invierte el orden).</li>
      <li>$A$ cuadrada es invertible $\iff\det A\neq0\iff$ rango completo. <b>Singular</b> significa $\det A=0$.</li>
      <li>$X$ de $n\times k$ tiene <b>rango completo de columnas</b> si $\operatorname{rango}(X)=k$; entonces $X'X$ ($k\times k$) es simétrica, definida positiva e invertible.</li></ul>`,
    ejemplo: {
      titulo: 'Insesgado no implica consistente',
      pasos: [
        R`Sea $\hat\theta=Y_1$ (usar solo la primera observación para estimar $\mu=E(Y)$).`,
        R`Insesgamiento: $E(Y_1)=\mu$ para cualquier $n$. ✔`,
        R`Pero $\operatorname{Var}(Y_1)=\sigma^2$ no disminuye cuando $n$ crece, así que $Y_1$ no converge a $\mu$: <b>no es consistente</b>.`,
        R`Al revés: $\hat\sigma^2_n=\frac1n\sum(Y_i-\bar Y)^2$ es sesgado en muestras finitas pero consistente.`
      ]
    },
    aplicacion: R`<p>Cada vez que se reporta un coeficiente, se está reportando <i>una realización</i> de un estimador. Preguntas como “¿es creíble este número?” son preguntas sobre su distribución muestral: su sesgo, su varianza y su normalidad (exacta o aproximada).</p>`,
    errores: [
      { mal: 'Insesgado ⇒ consistente.', bien: 'Son propiedades distintas (finita vs. asintótica). Ninguna implica la otra.' },
      { mal: 'Una matriz singular tiene determinante distinto de cero.', bien: 'Singular ⇔ $\\det A=0$ ⇔ no invertible.' },
      { mal: '$(AB)^{-1}=A^{-1}B^{-1}$.', bien: '$(AB)^{-1}=B^{-1}A^{-1}$: el orden se invierte.' }
    ],
    checks: [
      { q: R`Sean $\operatorname{Var}(Y)=4$, $\operatorname{Var}(X)=9$ y $\operatorname{Cov}(X,Y)=3$. ¿Cuánto vale $\operatorname{Var}(2Y-X)$?`, opts: ['25', '37', '13', '8'], c: 2, e: R`$4(4)+1(9)+2(2)(-1)(3)=16+9-12=13$. El término cruzado resta porque los coeficientes tienen signos opuestos.` },
      { q: R`$X$ es $n\times k$ con $n>k$ y columnas linealmente independientes. ¿Qué se puede afirmar de $X'X$?`, opts: ['Es singular', 'Es simétrica, definida positiva e invertible', 'Tiene rango $n$', 'Es diagonal'], c: 1, e: R`$a'X'Xa=\lVert Xa\rVert^2>0$ para todo $a\neq0$ porque las columnas son independientes. Su rango es $k$, no $n$.` }
    ],
    lab: [], fuente: 'Programa del curso (repaso exigido), Maddala Cap. 1–2, Guía de consulta rápida MCRL (Secciones A–B) y Cuestionario de Modelos Lineales (preguntas 1–7, 12, 26).'
  });

  /* ===================================================================== t1 */
  EL.addTema({
    id: 't1', num: 1, corte: 1, semana: 'Semanas 2–3', titulo: 'El modelo de regresión y los supuestos clásicos',
    resumen: 'Qué es el modelo $y=X\\beta+\\varepsilon$, qué significa cada supuesto S1–S6 y qué se rompe cuando falla.',
    lecturas: 'Maddala Cap. 3 · Gujarati Cap. 1–3',
    subtemas: ['Modelo en forma matricial y dimensiones', 'Supuestos S1–S6', 'Qué garantiza cada supuesto', 'Errores vs. residuos'],
    objetivo: 'Identificar cada supuesto del Modelo Clásico, saber exactamente <i>qué resultado</i> habilita y reconocer, a partir de una matriz de varianzas o de un gráfico de errores, cuál se viola.',
    intuicion: R`<p>La regresión modela el <b>valor esperado</b> de $y$ dado $X$ como función lineal de parámetros desconocidos. Lo que no explica $X$ queda en el error $\varepsilon$, que representa todo lo omitido (factores no observados, error de medición, azar).</p>
      <p>Cada supuesto “compra” una propiedad distinta. Una buena forma de estudiarlos es con la pregunta: <b>¿qué se pierde si falla?</b> — identificación, insesgamiento, eficiencia, validez de los errores estándar o inferencia exacta.</p>`,
    formal: R`<p>En forma matricial, con $n$ observaciones y $k$ parámetros (incluido el intercepto):</p>
      $$\underbrace{y}_{n\times1}=\underbrace{X}_{n\times k}\;\underbrace{\beta}_{k\times1}+\underbrace{\varepsilon}_{n\times1},\qquad X=\begin{pmatrix}1&x_{12}&\cdots&x_{1k}\\\vdots&&&\vdots\\1&x_{n2}&\cdots&x_{nk}\end{pmatrix}$$
      <table class="tbl"><tr><th>Supuesto</th><th>Expresión</th><th>Qué garantiza</th><th>Si falla</th></tr>
      <tr><td><b>S1</b> Linealidad en los parámetros</td><td>$y=X\beta+\varepsilon$ ($X$ puede contener $\ln x$, $x^2$…)</td><td>Modelo estimable por MCO</td><td>Mala forma funcional ⇒ sesgo</td></tr>
      <tr><td><b>S2</b> Rango completo</td><td>$\operatorname{rango}(X)=k$</td><td>$X'X$ invertible; $\beta$ identificable</td><td>$\hat\beta$ no es único</td></tr>
      <tr><td><b>S3</b> Exogeneidad</td><td>$E(\varepsilon\mid X)=0$</td><td><b>Insesgamiento</b></td><td>Sesgo e inconsistencia</td></tr>
      <tr><td><b>S4</b> Homocedasticidad</td><td>$\operatorname{Var}(\varepsilon_i\mid X)=\sigma^2$</td><td>$\operatorname{Var}(\hat\beta)=\sigma^2(X'X)^{-1}$; Gauss–Markov</td><td>No MELI; errores estándar inválidos</td></tr>
      <tr><td><b>S5</b> No autocorrelación</td><td>$\operatorname{Cov}(\varepsilon_i,\varepsilon_j\mid X)=0$</td><td>Con S4: $\operatorname{Var}(\varepsilon\mid X)=\sigma^2I$</td><td>No MELI; errores estándar inválidos</td></tr>
      <tr><td><b>S6</b> Normalidad</td><td>$\varepsilon\mid X\sim N(0,\sigma^2I)$</td><td>$t$ y $F$ <b>exactas</b> en muestras finitas</td><td>Sigue insesgado y MELI; inferencia solo aproximada</td></tr></table>
      <div class="callout key"><b>Resumen por efecto.</b> Identificación: S2 · Sesgo/consistencia: S1 y S3 · Eficiencia (MELI): S4–S5 · Validez de los errores estándar usuales: S4–S5 · Inferencia exacta: S6.</div>
      <div class="callout"><b>Numeración.</b> Aquí S1 = linealidad, S2 = rango completo, S3 = exogeneidad, S4 = homocedasticidad, S5 = no autocorrelación, S6 = normalidad (numeración de la Guía de consulta rápida). Otras fuentes numeran distinto: <b>estudia los supuestos por su nombre y por lo que garantizan</b>, no por el número.</div>
      <h4>Errores vs. residuos</h4>
      <p>$\varepsilon$ es el error poblacional (no observable). $\hat\varepsilon=y-X\hat\beta$ es el <b>residuo</b> (observable). No son lo mismo: $\hat\varepsilon=M\varepsilon$ y $\operatorname{Var}(\hat\varepsilon\mid X)=\sigma^2M$, que <i>no</i> es diagonal.</p>`,
    ejemplo: {
      titulo: 'Leer los supuestos en una matriz de varianzas',
      pasos: [
        R`Matriz A: $\operatorname{Var}(\varepsilon\mid X)=\begin{pmatrix}6&3&0\\3&6&3\\0&3&6\end{pmatrix}$. La diagonal es constante (6): <b>S4 se cumple</b>.`,
        R`Pero hay elementos fuera de la diagonal distintos de cero ($\operatorname{Cov}(\varepsilon_1,\varepsilon_2)=3$): <b>S5 (no autocorrelación) falla</b>.`,
        R`Matriz B: $\operatorname{diag}(2,\,2,\,6,\,6)$. Fuera de la diagonal todo es 0 ⇒ S5 se cumple. Pero la diagonal cambia ⇒ <b>S4 falla</b> (heteroscedasticidad).`,
        R`Matriz C: $4I$. Diagonal constante y ceros fuera ⇒ S4 y S5 se cumplen.`,
        R`Caso D: $E(\varepsilon\mid X)=(2,\,1,\,0,\,-1)'$ no es cero (y depende de $x$): <b>S3 (exogeneidad) falla</b>.`
      ]
    },
    aplicacion: R`<p>En el trabajo empírico, S3 es el supuesto que no se puede “probar” con los residuos de MCO (por construcción $X'\hat\varepsilon=0$): se defiende con argumentos económicos (¿qué se omitió? ¿hay simultaneidad?). S4 y S5 sí tienen pruebas formales (temas 10 y 11).</p>`,
    errores: [
      { mal: 'MCO necesita normalidad para calcularse y para ser MELI.', bien: 'Calcularlo solo requiere rango completo; Gauss–Markov no usa normalidad. S6 sirve para la inferencia exacta.' },
      { mal: 'Los residuos son los errores.', bien: 'Los residuos $\\hat\\varepsilon=M\\varepsilon$ son observables y están sujetos a $X\'\\hat\\varepsilon=0$; los errores no se observan.' },
      { mal: 'La heterocedasticidad sesga los coeficientes.', bien: 'No: afecta eficiencia y errores estándar, no el insesgamiento (S3 no interviene la varianza).' }
    ],
    checks: [
      { q: R`Si $\operatorname{Var}(\varepsilon\mid X)=\operatorname{diag}(2,2,6,6)$, ¿qué supuesto falla?`, opts: ['S3 exogeneidad', 'S4 homocedasticidad', 'S5 no autocorrelación', 'S2 rango completo'], c: 1, e: 'La diagonal no es constante ⇒ heterocedasticidad. Los ceros fuera de la diagonal indican que sí hay no autocorrelación.' },
      { q: 'Una gráfica de errores frente a $x$ muestra errores negativos para $x$ pequeño y positivos para $x$ grande, con dispersión pareja. ¿Qué supuesto sugiere violado?', opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Normalidad'], c: 2, e: 'El promedio de los errores cambia con $x$: $E(\\varepsilon\\mid x)\\neq0$. La dispersión pareja descarta heterocedasticidad.' }
    ],
    lab: ['diag'], fuente: 'Guía de consulta rápida MCRL (Sección D), Cuestionario (preguntas 8–10), plan de estudio en Markdown (Módulo I).'
  });

  /* ===================================================================== t2 */
  EL.addTema({
    id: 't2', num: 2, corte: 1, semana: 'Semana 2', titulo: 'Estimación por MCO: álgebra y geometría',
    resumen: 'De minimizar la suma de cuadrados a $\\hat\\beta=(X\'X)^{-1}X\'y$; matrices $H$ y $M$; propiedades de los residuos.',
    lecturas: 'Maddala Cap. 3–4 · Gujarati Cap. 2–3, 7',
    subtemas: ['Criterio de mínimos cuadrados', 'Ecuaciones normales y solución matricial', 'Matrices H (sombrero) y M', 'Propiedades algebraicas de los residuos'],
    objetivo: 'Derivar el estimador MCO, calcularlo en un caso pequeño y justificar las propiedades $X\'\\hat\\varepsilon=0$, $MX=0$, $H^2=H$, $\\operatorname{tr}(M)=n-k$.',
    intuicion: R`<p>Entre todas las rectas posibles, MCO escoge la que hace mínima la suma de los <b>cuadrados</b> de las distancias verticales a los puntos. Geométricamente, $y$ es un vector en $\mathbb R^n$ y MCO lo <b>proyecta ortogonalmente</b> sobre el espacio generado por las columnas de $X$: $\hat y$ es la sombra de $y$ y $\hat\varepsilon$ es lo que sobra, perpendicular a $X$.</p>
      <p>Por eso $H$ se llama matriz “sombrero”: al multiplicarla por $y$ le pone el sombrero, $\hat y=Hy$.</p>`,
    formal: R`<p>Se minimiza $S(b)=(y-Xb)'(y-Xb)=y'y-2b'X'y+b'X'Xb$.</p>
      <ul><li><b>Condición de primer orden:</b> $\partial S/\partial b=-2X'y+2X'Xb=0\Rightarrow X'X\hat\beta=X'y$ (<b>ecuaciones normales</b>; siempre tienen solución).</li>
      <li><b>Solución</b> (si $\operatorname{rango}(X)=k$): $$\hat\beta=(X'X)^{-1}X'y$$</li>
      <li><b>Segundo orden:</b> la Hessiana $2X'X$ es definida positiva ⇒ el mínimo es global y único.</li></ul>
      <table class="tbl"><tr><th>Objeto</th><th>Definición</th><th>Propiedades</th></tr>
      <tr><td>$H$</td><td>$X(X'X)^{-1}X'$ ($n\times n$)</td><td>Simétrica, idempotente ($H^2=H$), $HX=X$, $\hat y=Hy$, $\operatorname{tr}(H)=k$</td></tr>
      <tr><td>$M$</td><td>$I-H$</td><td>Simétrica, idempotente, $MX=0$, $\hat\varepsilon=My=M\varepsilon$, $\operatorname{tr}(M)=n-k$</td></tr>
      <tr><td>Residuos</td><td>$\hat\varepsilon=y-X\hat\beta$</td><td>$X'\hat\varepsilon=0$; con constante: $\sum\hat\varepsilon_i=0$ y $\bar{\hat y}=\bar y$</td></tr></table>
      <div class="callout key"><b>$X'\hat\varepsilon=0$ no es un supuesto</b>: es una consecuencia algebraica de las ecuaciones normales y se cumple <i>siempre</i> en MCO. Que los residuos sean ortogonales a $X$ no prueba que los errores $\varepsilon$ lo sean.</div>
      <h4>Regresión simple</h4>
      $$\hat\beta_1=\frac{S_{xy}}{S_{xx}},\quad\hat\beta_0=\bar y-\hat\beta_1\bar x,\quad S_{xx}=\sum(x_i-\bar x)^2$$
      <p>La recta ajustada pasa siempre por el punto $(\bar x,\bar y)$.</p>`,
    ejemplo: {
      titulo: 'MCO a mano con 5 observaciones',
      pasos: [
        R`Datos: $x=(2,3,5,6,9)$, $y=(8,7,9,12,14)$, $n=5$. Con $X=[1,\,x]$: $X'X=\begin{pmatrix}5&25\\25&155\end{pmatrix}$, $X'y=\begin{pmatrix}50\\280\end{pmatrix}$.`,
        R`$\det(X'X)=5\cdot155-25\cdot25=150$, así que $(X'X)^{-1}=\frac1{150}\begin{pmatrix}155&-25\\-25&5\end{pmatrix}$.`,
        R`$\hat\beta=(X'X)^{-1}X'y=\frac1{150}\begin{pmatrix}155\cdot50-25\cdot280\\-25\cdot50+5\cdot280\end{pmatrix}=\frac1{150}\begin{pmatrix}750\\150\end{pmatrix}=\begin{pmatrix}5\\1\end{pmatrix}$.`,
        R`Ajustados $\hat y=5+x=(7,8,10,11,14)$; residuos $\hat\varepsilon=(1,-1,-1,1,0)$.`,
        R`Verificación de ortogonalidad: $\sum\hat\varepsilon_i=0$ y $\sum x_i\hat\varepsilon_i=2-3-5+6+0=0$ ✔.`,
        R`Elementos diagonales de $H$: $h_{ii}=\frac1n+\frac{(x_i-\bar x)^2}{S_{xx}}=(0.5,\,0.333,\,0.2,\,0.233,\,0.733)$; suman $2=k=\operatorname{tr}(H)$ ✔.`
      ]
    },
    aplicacion: R`<p>La diagonal de $H$ ($h_{ii}$, “apalancamiento”) mide cuánta influencia tiene cada observación sobre su propio ajuste: la observación con $x=9$, lejos del centro, tiene $h_{ii}=0.73$. En diagnóstico se vigilan las observaciones con apalancamiento alto.</p>`,
    errores: [
      { mal: '$\\hat\\beta=(XX\')^{-1}X\'y$.', bien: '$XX\'$ es $n\\times n$ y no es invertible si $n>k$. Lo correcto es $(X\'X)^{-1}X\'y$ ($k\\times k$).' },
      { mal: '$\\operatorname{tr}(M)=k$.', bien: '$\\operatorname{tr}(H)=k$ y $\\operatorname{tr}(M)=n-k$ (los grados de libertad residuales).' },
      { mal: 'Con colinealidad perfecta, MCO “no se puede calcular” de ninguna forma.', bien: 'Falla la fórmula y la identificación de $\\beta$, pero $\\hat y=Hy$ (la proyección) sigue siendo única.' },
      { mal: 'La matriz $H$ es idempotente y diagonal.', bien: '$H$ es idempotente y <b>simétrica</b>; en general no es diagonal.' }
    ],
    checks: [
      { q: 'Sea $M=I-H$. ¿Cuál de las siguientes afirmaciones es FALSA?', opts: ['$M$ es simétrica', '$\\operatorname{tr}(M)=k$', '$MX=0$', '$M$ es idempotente'], c: 1, e: '$\\operatorname{tr}(M)=n-k$. $k$ es la traza de $H$.' },
      { q: 'Con $X=\\begin{pmatrix}1&1&2\\\\1&2&4\\\\1&3&6\\\\1&4&8\\end{pmatrix}$, ¿cuál es el rango de $X$?', opts: ['4', '3', '2', '1'], c: 2, e: 'La tercera columna es el doble de la segunda; solo hay dos columnas independientes. Es colinealidad perfecta y $X\'X$ es singular.' },
      { q: R`En el ejemplo, ¿cuánto vale $\det(X'X)$?`, opts: ['150', '30', '775', '625'], c: 0, e: '$5\\cdot155-25^2=150=n\\,S_{xx}$.' }
    ],
    lab: ['mco', 'matriz'], fuente: 'Guía de consulta rápida MCRL (Secciones B–C), Cuestionario (preguntas 1–6, 15–16), plan en Markdown (MCO).'
  });

  /* ===================================================================== t3 */
  EL.addTema({
    id: 't3', num: 3, corte: 1, semana: 'Semana 3', titulo: 'Propiedades de MCO: insesgamiento, varianza y Gauss–Markov',
    resumen: 'Por qué $E(\\hat\\beta|X)=\\beta$, de dónde sale $\\sigma^2(X\'X)^{-1}$ y qué dice (y qué no) el teorema de Gauss–Markov.',
    lecturas: 'Maddala Cap. 3 · Gujarati Cap. 3–4',
    subtemas: ['Insesgamiento', 'Varianza y covarianza de $\\hat\\beta$', 'Estimador de $\\sigma^2$', 'Teorema de Gauss–Markov', 'Insesgado vs. consistente'],
    objetivo: 'Demostrar el insesgamiento y la varianza de $\\hat\\beta$, justificar el divisor $n-k$ y enunciar con precisión el teorema de Gauss–Markov, incluyendo qué ocurre si fallan S4 o S5.',
    intuicion: R`<p>La clave es descomponer el estimador: $\hat\beta=\beta+(X'X)^{-1}X'\varepsilon$. El error de estimación es una combinación lineal de los errores. Si los errores tienen media cero dado $X$, el error de estimación tiene media cero (insesgamiento). Si además los errores son “bien portados” (misma varianza, no correlacionados), podemos calcular exactamente qué tan dispersa es esa combinación.</p>
      <p>Gauss–Markov dice algo acotado y elegante: entre todos los estimadores que son <i>lineales en $y$</i> e <i>insesgados</i>, ninguno le gana a MCO en varianza.</p>`,
    formal: R`<h4>Insesgamiento (S1, S2, S3)</h4>
      $$\hat\beta=\beta+(X'X)^{-1}X'\varepsilon\;\Rightarrow\;E(\hat\beta\mid X)=\beta+(X'X)^{-1}X'E(\varepsilon\mid X)=\beta$$
      <p>No intervienen la varianza ni la normalidad.</p>
      <h4>Varianza (S1–S5)</h4>
      $$\operatorname{Var}(\hat\beta\mid X)=(X'X)^{-1}X'\,[\sigma^2I]\,X(X'X)^{-1}=\sigma^2(X'X)^{-1}$$
      <p>Es una matriz $k\times k$, simétrica y definida positiva. Para una combinación lineal: $\operatorname{Var}(a'\hat\beta\mid X)=\sigma^2a'(X'X)^{-1}a$. Sin S4–S5, la expresión general (“sándwich”) es $(X'X)^{-1}X'\Sigma X(X'X)^{-1}$ con $\Sigma=\operatorname{Var}(\varepsilon\mid X)$.</p>
      <p>En regresión simple: $\operatorname{Var}(\hat\beta_1)=\sigma^2/S_{xx}$ y $\operatorname{Cov}(\hat\beta_0,\hat\beta_1)=-\sigma^2\bar x/S_{xx}$.</p>
      <h4>Estimador de $\sigma^2$</h4>
      $$\hat\sigma^2=\frac{\hat\varepsilon'\hat\varepsilon}{n-k}\quad\text{es insesgado, porque }E(\hat\varepsilon'\hat\varepsilon)=\sigma^2\operatorname{tr}(M)=\sigma^2(n-k).$$
      <p>Dividir entre $n$ da un estimador sesgado hacia abajo (por $\frac{n-k}{n}$), cuya diferencia pesa más cuando $n$ es pequeño o $k$ es grande respecto a $n$.</p>
      <h4>Teorema de Gauss–Markov</h4>
      <div class="callout key">Bajo S1–S5, para todo estimador lineal e insesgado $\tilde\beta=Cy$ (con $CX=I$): $\operatorname{Var}(\tilde\beta\mid X)-\sigma^2(X'X)^{-1}$ es semidefinida positiva. MCO es el <b>MELI</b> (mejor estimador lineal insesgado, BLUE). <b>No usa normalidad.</b></div>
      <p><i>Esquema de la prueba (demostración típica de bono).</i> Sea $C=(X'X)^{-1}X'+D$. Insesgamiento exige $CX=I$, es decir $DX=0$. Entonces $\operatorname{Var}(\tilde\beta\mid X)=\sigma^2CC'=\sigma^2[(X'X)^{-1}+DD']$ (los cruzados se anulan por $DX=0$). Como $DD'$ es semidefinida positiva, la diferencia lo es.</p>`,
    ejemplo: {
      titulo: 'Un estimador lineal e insesgado que pierde contra MCO (Taller 2, finca de café)',
      pasos: [
        R`Modelo $prod_i=\beta_0+\beta_1fert_i+\varepsilon_i$, con $x=(2,3,5,6,9)$. Propuesta: $\tilde\beta_1=\dfrac{y_5-y_1}{x_5-x_1}$ (solo usa las fincas 1 y 5).`,
        R`<b>Lineal:</b> es $\sum c_iy_i$ con $c_1=-\frac17$, $c_5=\frac17$ y los demás cero (pesos que dependen solo de $x$).`,
        R`<b>Insesgado:</b> $\tilde\beta_1=\beta_1+\dfrac{\varepsilon_5-\varepsilon_1}{7}$ y $E(\varepsilon\mid x)=0\Rightarrow E(\tilde\beta_1)=\beta_1$.`,
        R`<b>Varianzas:</b> $\operatorname{Var}(\tilde\beta_1)=\dfrac{2\sigma^2}{49}=0.0408\sigma^2$; MCO: $\bar x=5$, $S_{xx}=9+4+0+1+16=30$ ⇒ $\operatorname{Var}(\hat\beta_1)=\dfrac{\sigma^2}{30}=0.0333\sigma^2$.`,
        R`Cociente: $\frac{2/49}{1/30}=\frac{60}{49}=1.224$ ⇒ $\tilde\beta_1$ tiene 22.4 % más varianza. No es casualidad: lo garantiza Gauss–Markov.`,
        R`<b>¿Por qué pierde?</b> Ignora las fincas 2, 3 y 4: desperdicia información.`
      ]
    },
    aplicacion: R`<p>Gauss–Markov justifica usar MCO por defecto. Pero su validez depende de S4–S5: con heterocedasticidad o autocorrelación MCO sigue insesgado, <b>deja de ser MELI</b> y los errores estándar usuales son incorrectos (temas 10 y 11). Con normalidad (S6), MCO además es el de menor varianza entre <i>todos</i> los insesgados, lineales o no.</p>`,
    errores: [
      { mal: 'Gauss–Markov dice que MCO es el mejor estimador posible.', bien: 'Es el mejor entre los <b>lineales e insesgados</b>. Sin normalidad pueden existir estimadores no lineales más eficientes.' },
      { mal: 'La heterocedasticidad hace que MCO sea sesgado.', bien: 'El insesgamiento solo usa S1–S3. Se pierde la eficiencia (MELI) y los errores estándar usuales.' },
      { mal: 'Para demostrar la eficiencia de MCO (Gauss–Markov) se necesita que el error sea normal.', bien: 'No: se necesita S4 y S5 (no normalidad). La normalidad solo da inferencia exacta.' },
      { mal: '$\\hat\\sigma^2=\\hat\\varepsilon\'\\hat\\varepsilon/n$ es el estimador insesgado.', bien: 'El insesgado divide entre $n-k$. El divisor $n$ es sesgado (pero consistente).' }
    ],
    checks: [
      { q: 'Con $E(\\varepsilon|X)=0$, rango completo y $\\operatorname{Var}(\\varepsilon_i|X)=\\sigma_i^2$ no constante (errores no correlacionados), $\\hat\\beta_{MCO}$ es:', opts: ['Sesgado e inconsistente', 'Insesgado y MELI, con la varianza usual válida', 'Insesgado pero no MELI; la fórmula $\\sigma^2(X\'X)^{-1}$ ya no es su varianza', 'Insesgado y MELI, solo hay que corregir errores estándar'], c: 2, e: 'Falla S4: se pierde MELI y la varianza usual. El insesgamiento permanece.' },
      { q: R`En el ejemplo, ¿cuánto es $\operatorname{Var}(\tilde\beta_1)/\operatorname{Var}(\hat\beta_1)$?`, opts: ['1', '60/49 ≈ 1.224', '49/60 ≈ 0.817', '2'], c: 1, e: '$(2/49)\\cdot30=60/49$. MCO es más preciso, como asegura Gauss–Markov.' }
    ],
    lab: ['gm'], fuente: 'Guía de consulta rápida (C), Solución Taller 2 (punto 1), Cuestionario (preguntas 8–13, 22–24).'
  });

  /* ===================================================================== t4 */
  EL.addTema({
    id: 't4', num: 4, corte: 1, semana: 'Semanas 3–4', titulo: 'Inferencia: errores estándar, pruebas t y F, intervalos',
    resumen: 'Cómo pasar de $\\hat\\beta$ a una conclusión: error estándar, estadístico $t$, valor crítico, intervalo y prueba conjunta.',
    lecturas: 'Maddala Cap. 3–4 · Gujarati Cap. 5, 8',
    subtemas: ['Error estándar', 'Prueba t e intervalo de confianza', 'Combinaciones lineales', 'Prueba F', 'Predicción'],
    objetivo: 'Calcular e interpretar pruebas $t$, intervalos de confianza y predicciones, y explicar por qué se usa la distribución $t$ y cuándo la inferencia es exacta o aproximada.',
    intuicion: R`<p>Un coeficiente estimado es una foto con ruido. El <b>error estándar</b> dice cuánto ruido; el estadístico $t$ expresa el coeficiente en “unidades de ruido”. Si $\hat\beta$ está a más de ~2 errores estándar de la hipótesis nula, es difícil que sea solo ruido.</p>
      <p>Se usa $t$ y no la normal porque $\sigma^2$ también se estima, y eso añade incertidumbre: la $t$ tiene colas más pesadas, sobre todo con pocos grados de libertad.</p>`,
    formal: R`<table class="tbl"><tr><th>Resultado</th><th>Expresión</th><th>Requiere</th></tr>
      <tr><td>Error estándar</td><td>$ee(\hat\beta_j)=\hat\sigma\sqrt{[(X'X)^{-1}]_{jj}}$</td><td>S1–S5</td></tr>
      <tr><td>Prueba $t$ ($H_0:\beta_j=\beta_{j0}$)</td><td>$t=\dfrac{\hat\beta_j-\beta_{j0}}{ee(\hat\beta_j)}\sim t_{n-k}$; rechazar si $|t|>t_{\alpha/2,\,n-k}$</td><td>S1–S6 (exacta); S1–S5: aprox. normal</td></tr>
      <tr><td>Intervalo de confianza</td><td>$\hat\beta_j\pm t_{\alpha/2,n-k}\,ee(\hat\beta_j)$</td><td>Igual</td></tr>
      <tr><td>Combinación lineal $a'\beta$</td><td>$\operatorname{Var}(a'\hat\beta)=\hat\sigma^2a'(X'X)^{-1}a$ (incluye covarianzas)</td><td>S1–S5</td></tr>
      <tr><td>Prueba $F$ ($q$ restricciones)</td><td>$F=\dfrac{(SCR_R-SCR_{NR})/q}{SCR_{NR}/(n-k)}\sim F_{q,\,n-k}$</td><td>S1–S6 (exacta)</td></tr>
      <tr><td>Significancia global</td><td>$F=\dfrac{R^2/(k-1)}{(1-R^2)/(n-k)}$</td><td>Con constante</td></tr>
      <tr><td>Predicción $E(y|x_0)$</td><td>$\hat y_0=x_0'\hat\beta$; $\widehat{\operatorname{Var}}(\hat y_0)=\hat\sigma^2x_0'(X'X)^{-1}x_0$</td><td>S1–S5</td></tr>
      <tr><td>Error de pronóstico (valor individual)</td><td>$\hat\sigma^2\,[1+x_0'(X'X)^{-1}x_0]$</td><td>S1–S5</td></tr></table>
      <p><b>Bajo S6</b> ($\varepsilon\mid X\sim N(0,\sigma^2I)$): $\hat\beta\mid X\sim N(\beta,\sigma^2(X'X)^{-1})$ y $(n-k)\hat\sigma^2/\sigma^2\sim\chi^2_{n-k}$, independiente de $\hat\beta$. Su cociente da la $t$ exacta. Sin normalidad pero con $n$ grande, el TLC da inferencia asintótica.</p>
      <p>Con $q=1$ restricción, $F=t^2$.</p>`,
    ejemplo: {
      titulo: 'Inferencia completa con los 5 datos del tema 2',
      pasos: [
        R`$\hat\beta=(5,1)'$, $SCR=4$, $n-k=3$ ⇒ $\hat\sigma^2=4/3=1.333$ ($\hat\sigma=1.155$).`,
        R`$\widehat{\operatorname{Var}}(\hat\beta)=\hat\sigma^2(X'X)^{-1}=\frac43\cdot\frac1{150}\begin{pmatrix}155&-25\\-25&5\end{pmatrix}$ ⇒ $\widehat{\operatorname{Var}}(\hat\beta_1)=0.0444$, $ee(\hat\beta_1)=0.2108$; $\widehat{\operatorname{Cov}}(\hat\beta_0,\hat\beta_1)=-0.2222$.`,
        R`$H_0:\beta_1=0$: $t=1/0.2108=4.74$. Con $t_{0.025,3}=3.182$ ⇒ <b>se rechaza</b> $H_0$ al 5 %. (Comparar con 1.96 sería un error con solo 3 gl.)`,
        R`IC 95 %: $1\pm3.182(0.2108)=(0.329,\,1.671)$, no contiene al 0.`,
        R`Predicción en $x_0=4$: $\hat y_0=5+4=9$; $\widehat{\operatorname{Var}}(\hat y_0)=\frac43\cdot\frac{155-200+80}{150}=0.3111$ (para el valor esperado). Para una observación individual se suma $\hat\sigma^2$: $1.333+0.311=1.644$.`
      ]
    },
    aplicacion: R`<p>Taller 2 (domicilios): con $n=120$, $k=4$ se rechazó $H_0:\beta_1=-1$ ($t=-4.98$) y no se rechazó que $\beta_2\le1$ ($t=-3.88$ no cae en la cola correcta). La prueba de $H_0:\beta_1+\beta_2=0$ exige incluir la covarianza: $\operatorname{Var}(\hat\beta_1+\hat\beta_2)=\operatorname{Var}\hat\beta_1+\operatorname{Var}\hat\beta_2+2\operatorname{Cov}(\hat\beta_1,\hat\beta_2)$.</p>`,
    errores: [
      { mal: 'Si un coeficiente no es significativo, entonces $\\beta=0$.', bien: 'No rechazar $H_0$ no la prueba: puede ser falta de potencia. Mira el intervalo de confianza.' },
      { mal: 'Usar 1.96 con muestras muy pequeñas.', bien: 'Con 3 gl, $t_{0.025}=3.182$. Solo con $n$ grande $t\\approx$ normal.' },
      { mal: 'Reportar la varianza como si fuera el error estándar.', bien: '$ee=\\sqrt{\\widehat{\\operatorname{Var}}}$.' },
      { mal: '$\\operatorname{Var}(\\hat\\beta_1+\\hat\\beta_2)=\\operatorname{Var}\\hat\\beta_1+\\operatorname{Var}\\hat\\beta_2$.', bien: 'Falta $2\\operatorname{Cov}(\\hat\\beta_1,\\hat\\beta_2)$; los estimadores comparten datos y no son independientes.' }
    ],
    checks: [
      { q: 'Con $n=40$ y $k=3$, el valor crítico bilateral al 5 % es aproximadamente:', opts: ['1.96', '2.03 ($t_{37}$)', '3.18', '1.65'], c: 1, e: 'gl $=n-k=37$ ⇒ $t_{0.025,37}\\approx2.026$.' },
      { q: R`Con $\hat\sigma^2=4/3$ y $(X'X)^{-1}_{22}=5/150$, el error estándar de $\hat\beta_1$ es:`, opts: ['0.0444', '0.2108', '0.3651', '1.1738'], c: 1, e: '$\\sqrt{(4/3)(5/150)}=\\sqrt{0.0444}=0.2108$. 0.0444 es la varianza.' }
    ],
    lab: ['tf'], fuente: 'Guía de consulta rápida (E), Cuestionario (preguntas 14, 17–21, 24, 27, 34), Solución Taller 2 (puntos 2e–2g, 3a, 3d).'
  });

  /* ===================================================================== t5 */
  EL.addTema({
    id: 't5', num: 5, corte: 1, semana: 'Semanas 4–5', titulo: 'Bondad de ajuste: ANOVA, R² y R² ajustado',
    resumen: 'Descomposición de la variación, qué mide (y qué no) el $R^2$, cómo penaliza el $\\bar R^2$ y cambios de escala.',
    lecturas: 'Maddala Cap. 3–4 · Gujarati Cap. 3, 7',
    subtemas: ['Descomposición SCT = SCE + SCR', 'R²', 'R² ajustado', 'Comparabilidad', 'Cambios de unidades'],
    objetivo: 'Calcular e interpretar $R^2$ y $\\bar R^2$, justificar por qué difieren, y reconocer cuándo no son comparables o cuándo $\\bar R^2$ sube o baja.',
    intuicion: R`<p>$R^2$ responde: “¿qué fracción de la variación de $y$ alrededor de su media logra reproducir el modelo?”. Es una medida <b>descriptiva de ajuste lineal en la muestra</b>: no dice si el modelo es causal, si está bien especificado ni si los coeficientes son confiables.</p>
      <p>Como agregar regresores nunca aumenta la SCR, el $R^2$ nunca baja aunque la variable sea basura. El $R^2$ ajustado cobra un “peaje” por cada parámetro adicional.</p>`,
    formal: R`$$SCT=\sum(y_i-\bar y)^2=\underbrace{\sum(\hat y_i-\bar y)^2}_{SCE}+\underbrace{\sum\hat\varepsilon_i^2}_{SCR}\qquad(\text{requiere intercepto})$$
      $$R^2=\frac{SCE}{SCT}=1-\frac{SCR}{SCT}\in[0,1],\qquad\bar R^2=1-\frac{SCR/(n-k)}{SCT/(n-1)}=1-(1-R^2)\frac{n-1}{n-k}$$
      <ul><li>En regresión simple con intercepto, $R^2=r_{xy}^2$. En múltiple, $R^2=[\operatorname{corr}(y,\hat y)]^2$ (no $r^2$ con una sola $x$).</li>
      <li>$\bar R^2\le R^2$ (si $k>1$), puede bajar al agregar regresores y puede ser negativo.</li>
      <li>$\bar R^2$ <b>sube al agregar una variable si y solo si $|t|>1$</b> para esa variable.</li>
      <li>Sin intercepto la descomposición falla; el $R^2$ que reporta el software (no centrado) no es comparable.</li>
      <li>No son comparables los $R^2$ de modelos con distinta variable dependiente ($y$ vs. $\ln y$): sus $SCT$ difieren.</li></ul>
      <h4>Cambios de unidades</h4>
      <table class="tbl"><tr><th>Cambio</th><th>$\hat\beta$ y $ee$</th><th>$t$ y $R^2$</th></tr>
      <tr><td>$x\to c\,x$</td><td>$\hat\beta_x\to\hat\beta_x/c$ (y su $ee$)</td><td>No cambian</td></tr>
      <tr><td>$y\to c\,y$ (niveles)</td><td>Todos los $\hat\beta$ y $ee$ se multiplican por $c$</td><td>No cambian</td></tr>
      <tr><td>$\ln y$ con $y\to c\,y$</td><td>Solo el intercepto cambia en $\ln c$</td><td>No cambian</td></tr></table>`,
    ejemplo: {
      titulo: 'R² vs. R² ajustado en un modelo de rendimiento académico',
      pasos: [
        R`Modelo $nota=\beta_0+\beta_1horas+\beta_2asist+\beta_3trab+\beta_4estr+\varepsilon$ con $n=150$ estudiantes, $k=5$ parámetros y $R^2=0.42$.`,
        R`$\bar R^2=1-(1-0.42)\dfrac{149}{145}=1-0.58(1.0276)=0.404$.`,
        R`<b>Interpretación $R^2$:</b> las cuatro variables explican ≈ 42 % de la variación muestral de la nota; ≈ 58 % queda sin explicar.`,
        R`<b>Interpretación $\bar R^2$:</b> el mismo ajuste, descontado por usar 4 regresores (pérdida de gl). Es menor porque $\frac{n-1}{n-k}>1$.`,
        R`<b>Diferencia pequeña</b> porque $n$ es grande frente a $k$. Con $n$ pequeño o muchos regresores la brecha crece.`
      ]
    },
    aplicacion: R`<p>Taller 2 (salarios, $n=30$): al añadir <i>experiencia</i>, $R^2$ sube de 0.412 a 0.418, pero $\bar R^2$ baja de 0.391 a 0.375. El $t$ implícito de experiencia es $|t|=0.53<1$, justo lo que la regla $|t|>1$ predice: el ajuste extra no compensa el parámetro adicional.</p>`,
    errores: [
      { mal: 'El $R^2$ siempre está entre 0 y 1, incluso sin constante.', bien: 'Sin intercepto $SCT\\neq SCE+SCR$ y el $R^2$ “centrado” puede ser negativo; el no centrado no es comparable.' },
      { mal: 'Un $R^2$ alto prueba causalidad o buena especificación.', bien: 'Solo mide ajuste lineal muestral. Puede ser alto con regresión espuria u omisión de variables.' },
      { mal: 'Un $R^2$ bajo significa que el modelo es malo.', bien: 'En datos individuales con mucho ruido, $R^2$ bajos (por ejemplo 0.1 o 0.2) son normales; la utilidad depende de los coeficientes y su precisión.' },
      { mal: 'Comparar el $R^2$ del modelo en $y$ con el del modelo en $\\ln y$.', bien: 'Miden la variación de variables distintas; no son comparables.' }
    ],
    checks: [
      { q: 'Con $R^2=0.02$, $n=20$ y $k=6$ parámetros (5 regresores + constante), el $R^2$ ajustado es:', opts: ['0.02', '0.33', '−0.33', '0'], c: 2, e: '$1-0.98\\cdot19/14=-0.33$. El $\\bar R^2$ puede ser negativo.' },
      { q: 'Se añade un regresor con $|t|=0.5$. Entonces:', opts: ['$R^2$ baja y $\\bar R^2$ sube', '$R^2$ sube (o igual) y $\\bar R^2$ baja', 'Ambos suben', 'Ambos bajan'], c: 1, e: '$R^2$ nunca baja; $\\bar R^2$ sube solo si $|t|>1$.' },
      { q: 'Si el salario se mide en pesos en vez de miles (×1000) en el modelo en niveles, ¿qué NO cambia?', opts: ['Los coeficientes', 'Los errores estándar', 'El estadístico $t$ y el $R^2$', 'El intercepto'], c: 2, e: 'Coeficientes y errores estándar se multiplican por 1000; $t$ y $R^2$ no cambian (el factor se cancela).' }
    ],
    lab: ['r2'], fuente: 'Solución Taller 2 (puntos 3b–3c, 4a–4f), Guía de consulta rápida (E), Cuestionario (preguntas 17, 30, 31, 39).'
  });

  /* ===================================================================== t6 */
  EL.addTema({
    id: 't6', num: 6, corte: 1, semana: 'Semanas 4–5', titulo: 'Regresión múltiple: ceteris paribus y variables omitidas',
    resumen: 'Interpretar coeficientes parciales, el sesgo por variable omitida, variables irrelevantes y la intuición de Frisch–Waugh.',
    lecturas: 'Maddala Cap. 4 · Gujarati Cap. 6–8',
    subtemas: ['Interpretación ceteris paribus', 'Sesgo por variable omitida', 'Variables irrelevantes', 'Frisch–Waugh', 'Signos esperados'],
    objetivo: 'Interpretar correctamente un coeficiente parcial, anticipar el signo y la magnitud del sesgo por omitir una variable relevante y justificar signos esperados con teoría económica.',
    intuicion: R`<p>En la regresión múltiple, $\beta_1$ no es “el efecto de $x_1$ sobre $y$” a secas: es el efecto de $x_1$ <b>manteniendo constantes las demás variables incluidas</b>. Por eso cambia al agregar o quitar controles.</p>
      <p>Si omites una variable que (i) afecta a $y$ y (ii) está correlacionada con $x_1$, el coeficiente de $x_1$ “absorbe” una parte del efecto de la omitida. Eso es sesgo, y no se corrige con más datos.</p>`,
    formal: R`<p>$E(y\mid x_1,x_2)=\beta_0+\beta_1x_1+\beta_2x_2$ ⇒ $\beta_1=\partial E(y\mid x)/\partial x_1$ (efecto parcial).</p>
      <h4>Variable omitida</h4>
      <p>Modelo verdadero $y=\beta_0+\beta_1x_1+\beta_2x_2+\varepsilon$; se estima la regresión corta $y$ sobre $x_1$ y se obtiene $\tilde\beta_1$. Sea $\tilde\delta_1$ la pendiente de la regresión auxiliar de $x_2$ sobre $x_1$. Entonces</p>
      $$\tilde\beta_1=\hat\beta_1+\hat\beta_2\,\tilde\delta_1\qquad\Rightarrow\qquad E(\tilde\beta_1)-\beta_1=\beta_2\,\delta_1$$
      <table class="tbl"><tr><th></th><th>$\operatorname{Corr}(x_1,x_2)>0$</th><th>$\operatorname{Corr}(x_1,x_2)<0$</th></tr>
      <tr><td>$\beta_2>0$</td><td>Sesgo <b>positivo</b></td><td>Sesgo negativo</td></tr>
      <tr><td>$\beta_2<0$</td><td>Sesgo negativo</td><td>Sesgo <b>positivo</b></td></tr></table>
      <p>Si $\beta_2=0$ (variable irrelevante) o $\delta_1=0$ (no correlacionadas) el sesgo es cero.</p>
      <h4>Incluir variables irrelevantes</h4>
      <p>No sesga, pero infla la varianza si están correlacionadas con las demás: $\operatorname{Var}(\hat\beta_j)=\dfrac{\sigma^2}{SCT_j(1-R_j^2)}$ (tema 9). Trade-off: <b>prefiere un estimador algo menos preciso pero insesgado a uno preciso y erróneo</b>.</p>
      <h4>Frisch–Waugh (intuición)</h4>
      <p>$\hat\beta_1$ de la regresión múltiple es la pendiente de $y$ sobre la parte de $x_1$ <i>no explicada</i> por las demás regresoras.</p>`,
    ejemplo: {
      titulo: 'Publicidad en YouTube (Taller 2, Bono)',
      pasos: [
        R`Se estima $\ln(reprod)$ sobre $\ln(pub)$ y $\ln(suscript)$: $\hat\beta_1=0.25$ y $\hat\beta_2=0.60$. La regresión auxiliar de $\ln(suscript)$ sobre $\ln(pub)$ da $\tilde\delta_1=0.50$.`,
        R`Modelo corto (sin suscriptores): $\tilde\beta_1=\hat\beta_1+\hat\beta_2\tilde\delta_1=0.25+0.60(0.50)=0.55$.`,
        R`Sesgo $=+0.30$: el modelo simple <b>exagera</b> el efecto de la publicidad (la discográfica invierte más en artistas ya grandes).`,
        R`Interpretación de $\hat\beta_1=0.25$: 1 % más de publicidad ⇒ +0.25 % de reproducciones, <i>a igual número de suscriptores</i>.`,
        R`¿Vale la pena incluir suscriptores aunque inflen la varianza? Con $R_1^2=0.60$, $FIV=2.5$: sí, el sesgo (0.30 sobre un efecto de 0.25) es peor y no se reduce con $n$.`
      ]
    },
    aplicacion: R`<p><b>Justificar el signo esperado</b> es una competencia habitual en los exámenes. Ejemplo: ventas de una cafetería sobre temperatura, lluvia y distancia a una estación. Para la temperatura se espera signo positivo; para la distancia, negativo; para la lluvia el signo es <i>ambiguo</i> y hay que argumentar los mecanismos (menos tráfico peatonal ⇒ negativo; más bebidas calientes ⇒ positivo).</p>`,
    errores: [
      { mal: 'Omitir variables solo aumenta la varianza.', bien: 'Omitir una variable relevante correlacionada con $x_1$ sesga $\\hat\\beta_1$; incluir una irrelevante no sesga pero puede inflar la varianza.' },
      { mal: '$\\beta_1$ de una regresión múltiple es la pendiente de la regresión simple.', bien: 'Es el efecto parcial: cambia $y$ al subir $x_1$ una unidad <i>manteniendo constantes</i> las otras.' },
      { mal: 'En la regresión múltiple, $R^2=r^2(y,x_1)$.', bien: '$R^2=[\\operatorname{corr}(y,\\hat y)]^2$; solo en regresión simple coincide con $r^2(y,x)$.' }
    ],
    checks: [
      { q: 'Modelo verdadero con $\\beta_2>0$; se omite $x_2$ y $\\operatorname{Corr}(x_1,x_2)>0$. El estimador de $\\beta_1$ en la regresión corta tiene:', opts: ['Sesgo positivo', 'Sesgo negativo', 'Sesgo cero', 'Signo indeterminado'], c: 0, e: 'Sesgo $=\\beta_2\\delta_1>0$ cuando ambos son positivos.' },
      { q: 'Si $\\hat\\beta_1=0.70$ en la regresión corta y en la larga, ¿qué se deduce (dado que $\\hat\\beta_2\\neq0$)?', opts: ['$\\delta_1\\approx0$: $x_2$ y $x_1$ están (casi) no correlacionadas en la muestra', '$x_2$ no afecta a $y$', 'El modelo está mal', 'Hay multicolinealidad perfecta'], c: 0, e: '$\\tilde\\beta_1-\\hat\\beta_1=\\hat\\beta_2\\tilde\\delta_1=0$ con $\\hat\\beta_2\\neq0$ ⇒ $\\tilde\\delta_1=0$.' }
    ],
    lab: ['omit'], fuente: 'Solución Taller 2 (Bono a–d, puntos 2b, 3b), Cuestionario (preguntas 11, 25, 29), plan en Markdown (Semana 5: omisión de variables relevantes).'
  });

  /* ===================================================================== t7 */
  EL.addTema({
    id: 't7', num: 7, corte: 1, semana: 'Semana 7 (log: aparece antes)', titulo: 'Formas funcionales, variables dummy e interacciones',
    resumen: 'Cómo leer coeficientes en lin-lin, log-lin, lin-log y log-log; dummies, trampa, interacciones, RESET y Box–Cox.',
    lecturas: 'Maddala Sec. 8.9 y notas propias · Gujarati Cap. 9 y Sec. 13.4',
    subtemas: ['Interpretación de coeficientes según la forma funcional', 'Cuadráticos', 'Variables dummy y trampa', 'Interacciones', 'RESET y Box–Cox'],
    objetivo: 'Interpretar el coeficiente en cada forma funcional (en unidades, % o elasticidad), manejar dummies e interacciones y saber cuándo usar RESET o Box–Cox.',
    intuicion: R`<p>“Lineal” en MCO significa lineal en los <b>parámetros</b>, no en las variables. Tomar logaritmos o añadir $x^2$ no rompe el modelo clásico; solo cambia <i>qué significa</i> el coeficiente. La pregunta clave siempre es: ¿cuál es la unidad de cada lado de la ecuación?</p>
      <p>Una dummy es un interruptor: desplaza el intercepto (y con una interacción, también la pendiente) para el grupo marcado con 1.</p>`,
    formal: R`<table class="tbl"><tr><th>Modelo</th><th>Ecuación</th><th>Interpretación de $\beta_1$</th></tr>
      <tr><td>lin-lin</td><td>$y=\beta_0+\beta_1x$</td><td>$\Delta y=\beta_1\Delta x$ (unidades de $y$ por unidad de $x$)</td></tr>
      <tr><td>log-lin</td><td>$\ln y=\beta_0+\beta_1x$</td><td>$\%\Delta y\approx100\beta_1\Delta x$ (exacto: $100(e^{\beta_1\Delta x}-1)$)</td></tr>
      <tr><td>lin-log</td><td>$y=\beta_0+\beta_1\ln x$</td><td>$\Delta y\approx\beta_1\cdot\%\Delta x/100$ (unidades de $y$)</td></tr>
      <tr><td>log-log</td><td>$\ln y=\beta_0+\beta_1\ln x$</td><td>Elasticidad: $\%\Delta y\approx\beta_1\,\%\Delta x$</td></tr>
      <tr><td>cuadrático</td><td>$y=\beta_0+\beta_1x+\beta_2x^2$</td><td>Efecto marginal $\beta_1+2\beta_2x$; extremo en $x^*=-\beta_1/(2\beta_2)$</td></tr>
      <tr><td>dummy $D$</td><td>$y=\beta_0+\beta_1x+\beta_2D$</td><td>$\beta_2$: diferencia vs. la categoría base, a igual $x$</td></tr>
      <tr><td>interacción</td><td>$+\beta_3(x\cdot D)$</td><td>Efecto de $x$: $\beta_1+\beta_3D$</td></tr></table>
      <ul><li><b>Trampa de la dummy:</b> con intercepto, incluir $m$ dummies para $m$ categorías genera colinealidad perfecta. Omite una (la base) o quita la constante.</li>
      <li><b>RESET de Ramsey:</b> añade $\hat y^2,\hat y^3$ al modelo y prueba su significancia conjunta con una $F$. Rechazar sugiere error de forma funcional u omisión de variables.</li>
      <li><b>Box–Cox:</b> elige paramétricamente entre niveles y logaritmos para la variable dependiente.</li>
      <li>Los $R^2$ de modelos con $y$ distinta ($y$ vs. $\ln y$) no son comparables.</li></ul>`,
    ejemplo: {
      titulo: 'Lin-log: ¿cuánto cambia y si x sube 5 %?',
      pasos: [
        R`$\widehat{y}=7+18\ln(x)$, con $y$ en unidades.`,
        R`Es un modelo <b>lin-log</b>: $\Delta y\approx\beta_1\cdot\dfrac{\%\Delta x}{100}$.`,
        R`Con $\%\Delta x=5$: $\Delta y\approx18\times0.05=0.9$ unidades.`,
        R`Distractores típicos: “18 %” (lo leería como log-lin) y “90 unidades” (multiplica por 5 en vez de dividir entre 100).`
      ]
    },
    aplicacion: R`<p>Cálculo exacto vs. aproximado (Cuestionario 40): en $\ln y=\beta_0+0.08x$, un aumento de 10 unidades en $x$ no da “80 %”, sino $100(e^{0.8}-1)=122.55\,\%$. La aproximación $100\beta_1\Delta x$ solo es buena para cambios pequeños.</p>
      <p>Con una dummy $mujer$ en $\widehat{salario}=12+3\,educ-2\,mujer$: las mujeres ganan 2 dólares por hora menos que los hombres <i>con la misma educación</i> (intercepto 10 vs. 12, misma pendiente 3).</p>`,
    errores: [
      { mal: 'En un log-log, $\\beta_1$ es el cambio en unidades de $y$ cuando $x$ sube 1 %.', bien: 'Eso describe un lin-log. En log-log, $\\beta_1$ es la <b>elasticidad</b> (cambio % en $y$ por cambio % en $x$).' },
      { mal: 'Aplicar las reglas del log-lin al lin-log.', bien: 'En lin-log, $y$ está en niveles: el efecto de 1 % es $\\beta_1/100$ <i>unidades</i> de $y$.' },
      { mal: 'Interpretar $\\beta_1$ como efecto promedio de $x$ cuando hay interacción.', bien: 'Solo es el efecto para $D=0$; para $D=1$ es $\\beta_1+\\beta_3$.' },
      { mal: 'Elegir entre lin-lin y log-lin por el mayor $R^2$.', bien: 'No son comparables; usa teoría, gráficos de residuos, RESET o Box–Cox.' }
    ],
    checks: [
      { q: 'En $\\ln(q)=\\beta_0+\\beta_1\\ln(p)$ con $\\hat\\beta_1=-1.2$, un aumento del 1 % en el precio se asocia con:', opts: ['−1.2 unidades de $q$', '−1.2 % en $q$', '−0.012 % en $q$', '+1.2 % en $q$'], c: 1, e: 'Elasticidad: $-1.2\\%$. Como $|\\beta_1|>1$, demanda elástica.' },
      { q: 'En $y=\\beta_0+\\beta_1x+\\beta_2D+\\beta_3xD$, el efecto marginal de $x$ cuando $D=1$ es:', opts: ['$\\beta_1$', '$\\beta_1+\\beta_3$', '$\\beta_3$', '$\\beta_1+\\beta_2$'], c: 1, e: 'Para $D=1$: pendiente $=\\beta_1+\\beta_3$. $\\beta_2$ solo desplaza el intercepto.' },
      { q: 'En $\\ln(salario)=\\beta_0+0.05\\,educ$, un año más de educación se asocia con ≈', opts: ['0.05 unidades monetarias', '0.05 %', '5 %', '50 %'], c: 2, e: 'Log-lin: $100\\cdot0.05=5\\%$ (exacto 5.13 %).' }
    ],
    lab: ['forma'], fuente: 'Cuestionario (preguntas 32–33, 35–40), Guía de consulta rápida (E, “Interpretación según la forma funcional”), plan en Markdown (Módulo II). <i>Nota:</i> en el programa este tema es de la Semana 7, pero la interpretación de logaritmos se usa desde el Corte 1.'
  });
})(typeof window !== 'undefined' ? window : globalThis);

