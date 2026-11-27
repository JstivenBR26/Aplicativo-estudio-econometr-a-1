/* banco-parcial1.js — (a) Simulacro con la ESTRUCTURA del Parcial 1 (mismos formatos, puntajes y tiempo) pero con preguntas ORIGINALES, y
   (b) más preguntas originales en el mismo estilo. No reproduce enunciados, datos ni modelos del examen real.
   IMPORTANTE: la solución de todas es elaboración propia a partir de la teoría; no es una clave oficial del curso.
   Tipos:  'grupo' {items:[{t, opts, c, e, fig?}]}  — puntaje fraccionario;  'abierta' {modelo, rubrica[]} — autoevaluación guiada.        */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;
  EL.BANCO = EL.BANCO || [];
  const P1 = 'Simulacro con estructura del Parcial 1 (original)', PO = 'Estilo Parcial 1 (original)';
  const add = q => EL.BANCO.push(q);
  const VFO = ['Verdadero', 'Falso'];

  /* ---------- Figuras de los casos E y F (datos simulados con semilla fija) ---------- */
  EL.FIGS = EL.FIGS || {};
  function caseFig(kind) {
    const r = EL.rng(kind === 'E' ? 41 : 57), xs = [], es = []; let prev = 0;
    for (let i = 0; i < 44; i++) {
      if (kind === 'E') { const x = 0.7 + r() * 9.3; xs.push(x); es.push(EL.gauss(r) * Math.max(0.25, 2.6 - 0.26 * x)); }
      else { prev = 0.88 * prev + 0.9 * EL.gauss(r); xs.push(i + 1); es.push(prev * 1.6); }
    }
    const c = EL.chart({ W: 360, H: 230, x: kind === 'E' ? [0, 10] : [0, 45], y: [-7, 8], xl: kind === 'E' ? 'x_i' : 'tiempo t', yl: 'ε', m: { l: 40, r: 10, t: 8, b: 36 }, label: 'Errores, caso ' + kind }).axes().hline(0, 'ref');
    if (kind === 'F') c.path(xs, es, 'ln');
    return c.points(xs, es, 'pt', 3).toString();
  }
  EL.FIGS.caseE = () => caseFig('E');
  EL.FIGS.caseF = () => caseFig('F');

  /* =============================== SIMULACRO ESTRUCTURADO (ids p1-001 … p1-011; suman 5.0 puntos) =============================== */
  add({ id: 'p1-001', tipo: 'grupo', tema: 't2', sub: 'Verdadero/Falso conceptual', dif: 2, fuente: P1, peso: 0.7, preg: 'Pregunta 1',
    enun: 'Escriba V si la afirmación es verdadera o F si es falsa.',
    items: [
      { t: 'Si $E(\\varepsilon|X)=0$, MCO es insesgado aunque la varianza del error cambie entre observaciones.', opts: VFO, c: 0, e: 'Verdadero: el insesgamiento solo usa linealidad, rango completo y exogeneidad.' },
      { t: R`Si dos columnas de $X$ son idénticas, el sistema $X'Xb=X'y$ no tiene solución.`, opts: VFO, c: 1, e: R`Falso: las ecuaciones normales siempre tienen solución; con columnas idénticas tienen infinitas.` },
      { t: R`La traza de la matriz $H=X(X'X)^{-1}X'$ es igual a $n$.`, opts: VFO, c: 1, e: R`Falso: $\operatorname{tr}(H)=k$ (número de parámetros).` },
      { t: R`El $R^2$ ajustado puede ser negativo, mientras que el $R^2$ de un modelo con constante no.`, opts: VFO, c: 0, e: R`Verdadero: $\bar R^2=1-(1-R^2)\frac{n-1}{n-k}$ cae por debajo de 0 si el ajuste es muy pobre.` },
      { t: R`La fórmula $\operatorname{Var}(\hat\beta|X)=\sigma^2(X'X)^{-1}$ requiere que el error sea normal.`, opts: VFO, c: 1, e: 'Falso: requiere homocedasticidad y no autocorrelación; la normalidad no interviene.' },
      { t: R`En el modelo $\ln y=\beta_0+\beta_1x$, el coeficiente $\beta_1$ es la elasticidad de $y$ respecto a $x$.`, opts: VFO, c: 1, e: R`Falso: es una semielasticidad ($100\beta_1$ % por unidad de $x$). La elasticidad es el coeficiente del log-log.` },
      { t: R`Los residuos MCO son siempre ortogonales a los valores ajustados: $\hat y'\hat\varepsilon=0$.`, opts: VFO, c: 0, e: R`Verdadero: $\hat y=Hy$ y $\hat\varepsilon=My$ con $HM=0$.` }
    ] });

  add({ id: 'p1-002', tipo: 'grupo', tema: 't2', sub: 'Matrices H y M', dif: 2, fuente: P1, peso: 0.7, preg: 'Pregunta 2',
    enun: R`Considere $y=X\beta+\varepsilon$ con $n$ observaciones y $k$ parámetros (incluido el intercepto), $H=X(X'X)^{-1}X'$ y $M=I-H$. En cada afirmación elija la opción correcta (en el examen se tacha la incorrecta).`,
    items: [
      { t: R`a) $HM=$`, opts: ['$H$', '$0$'], c: 1, e: '$HM=H(I-H)=H-H^2=0$ porque $H$ es idempotente.' },
      { t: R`b) El vector de residuos puede escribirse como $\hat\varepsilon=$`, opts: ['$M\\varepsilon$', '$H\\varepsilon$'], c: 0, e: 'Como $MX=0$: $\\hat\\varepsilon=My=M(X\\beta+\\varepsilon)=M\\varepsilon$.' },
      { t: R`c) La traza de $M$ es`, opts: ['$k$', '$n-k$'], c: 1, e: '$\\operatorname{tr}(M)=n-\\operatorname{tr}(H)=n-k$.' },
      { t: R`d) El estimador insesgado de $\sigma^2$ divide $\hat\varepsilon'\hat\varepsilon$ entre`, opts: ['$n$', '$n-k$'], c: 1, e: 'Porque $E(\\hat\\varepsilon\'\\hat\\varepsilon)=\\sigma^2\\operatorname{tr}(M)=\\sigma^2(n-k)$.' },
      { t: R`e) Si aumenta la variación de $x$ en la muestra, $\operatorname{Var}(\hat\beta_1|X)$`, opts: ['aumenta', 'disminuye'], c: 1, e: '$\\operatorname{Var}(\\hat\\beta_1)=\\sigma^2/S_{xx}$: más variación en $x$ da más precisión.' },
      { t: R`f) Bajo exogeneidad, $E(\varepsilon|X)=$`, opts: ['$0$', '$\\sigma^2$'], c: 0, e: 'Exogeneidad: media condicional cero.' },
      { t: R`f) y entonces $\hat\beta$ es un estimador ___ de $\beta$`, opts: ['eficiente', 'insesgado'], c: 1, e: 'Esa condición da insesgamiento; la eficiencia requiere además homocedasticidad y no autocorrelación.' }
    ] });

  add({ id: 'p1-003', tipo: 'grupo', tema: 't7', sub: 'Selección múltiple', dif: 2, fuente: P1, peso: 0.6, preg: 'Pregunta 3',
    enun: 'Encierre la opción correcta en cada caso.',
    items: [
      { t: R`3.1 Se estimó $\widehat{\ln(consumo)}=2.1+0.8\ln(ingreso)$. Si el ingreso aumenta 5 %, el consumo aumenta aproximadamente:`, opts: ['0.8 %', '4 %', '0.04 %', '80 %'], c: 1, e: 'Log-log: elasticidad $0.8$ ⇒ $0.8\\times5\\%=4\\%$.' },
      { t: R`3.2 Sea $\tilde\beta$ otro estimador lineal e insesgado de $\beta$. Bajo S1–S5, el teorema de Gauss–Markov implica que $\operatorname{Var}(\tilde\beta|X)-\operatorname{Var}(\hat\beta|X)$ es:`, opts: ['definida negativa', 'semidefinida positiva', 'igual a cero siempre', 'no se puede comparar sin normalidad'], c: 1, e: 'MCO tiene la menor varianza en la clase de lineales e insesgados: la diferencia es semidefinida positiva.' }
    ] });

  add({ id: 'p1-004', tipo: 'abierta', tema: 't6', sub: 'Signos esperados', dif: 2, fuente: P1, peso: 0.25, preg: 'Pregunta 4a',
    enun: R`Una cafetería modela sus ventas diarias: $ventas=\beta_0+\beta_1temp+\beta_2lluvia+\beta_3dist+\varepsilon$, con $ventas$ en miles de pesos por día, $temp$ en °C, $lluvia$ en mm y $dist$ la distancia (en metros) a la estación de transporte más cercana.<br><b>a)</b> ¿Qué signo esperaría para cada coeficiente? Justifique.`,
    modelo: R`<ul><li><b>$\beta_1>0$:</b> más calor aumenta la demanda de bebidas frías y la afluencia.</li><li><b>$\beta_2<0$ (probable):</b> la lluvia reduce el tráfico peatonal; podría argumentarse algún efecto positivo en bebidas calientes, por eso conviene justificar.</li><li><b>$\beta_3<0$:</b> más distancia a la estación implica menos clientes de paso, ceteris paribus.</li></ul>`,
    rubrica: ['$\\beta_1>0$ con un mecanismo económico.', '$\\beta_2<0$ (o ambiguo bien argumentado).', '$\\beta_3<0$ con justificación.'] });
  add({ id: 'p1-005', tipo: 'abierta', tema: 't6', sub: 'Interpretación de coeficientes', dif: 2, fuente: P1, peso: 0.3, preg: 'Pregunta 4 (interpretación)',
    enun: R`Con $n=240$ días se obtuvo $\widehat{ventas}=150.0+9.5\,temp-2.4\,lluvia-0.06\,dist$, con $R^2=0.31$ y $\bar R^2=0.301$.<br><b>a)</b> Interprete el coeficiente de $dist$ (signo y magnitud). <b>b)</b> Interprete el coeficiente de $temp$.`,
    modelo: R`<ul><li><b>dist:</b> $-0.06$ ⇒ cada metro adicional se asocia con 0.06 miles de pesos (60 pesos) menos de ventas por día, manteniendo $temp$ y $lluvia$ constantes; 100 m más ≈ 6 mil pesos menos. Signo coherente; magnitud pequeña por metro, relevante por cientos de metros.</li><li><b>temp:</b> $+9.5$ ⇒ un grado más se asocia con 9.5 miles de pesos más de ventas diarias, ceteris paribus.</li></ul>`,
    rubrica: ['Interpreta dist en unidades correctas (miles de pesos por metro) y ceteris paribus.', 'Comenta la magnitud (p. ej. 100 m ≈ 6 mil pesos).', 'Interpreta temp: +9.5 miles de pesos por grado, ceteris paribus.'] });
  add({ id: 'p1-006', tipo: 'num', tema: 't7', sub: 'Efecto predicho', dif: 1, fuente: P1, peso: 0.2, preg: 'Pregunta 4c',
    enun: R`Con la ecuación estimada del punto anterior: si llueven 10 mm más, manteniendo $temp$ y $dist$ constantes, ¿cuánto cambia la venta diaria predicha (en miles de pesos)? Incluya el signo.`,
    c: -24, tol: 0.05, unidad: 'miles de pesos', expl: R`$\Delta\widehat{ventas}=-2.4\times10=-24$ miles de pesos por día (24 mil pesos menos).` });
  add({ id: 'p1-007', tipo: 'abierta', tema: 't5', sub: 'R² vs R² ajustado', dif: 2, fuente: P1, peso: 0.25, preg: 'Pregunta 4d',
    enun: R`Interprete los valores de $R^2$ ($0.31$) y de $\bar R^2$ ($0.301$) y justifique por qué son diferentes.`,
    modelo: R`<p>$R^2=0.31$: las tres variables explican ≈ 31 % de la variación muestral de las ventas; ≈ 69 % queda sin explicar. $\bar R^2=0.301$ es el mismo ajuste descontado por el número de parámetros: $\bar R^2=1-(1-R^2)\frac{n-1}{n-k}=1-0.69\cdot\frac{239}{236}$.</p><p>Difieren porque $R^2$ nunca baja al agregar regresores (la $SCR$ no sube), mientras que $\bar R^2$ divide $SCR$ y $SCT$ por sus grados de libertad y penaliza el uso de gl. La diferencia es pequeña porque $n=240$ es grande frente a $k=4$.</p>`,
    rubrica: ['Interpreta $R^2$ como proporción de la variación explicada (≈ 31 %).', 'Explica que $\\bar R^2$ corrige por grados de libertad.', 'Justifica que la diferencia es pequeña por $n$ grande frente a $k$.'] });
  add({ id: 'p1-008', tipo: 'num', tema: 't7', sub: 'Predicción comparada', dif: 2, fuente: P1, peso: 0.3, preg: 'Pregunta 4e',
    enun: R`El local A tiene $temp=25$, $lluvia=0$ y $dist=200$. El local B tiene $temp=20$, $lluvia=5$ y $dist=500$. ¿Cuál es la diferencia <b>B − A</b> en ventas diarias predichas (miles de pesos)? Incluya el signo.`,
    c: -77.5, tol: 0.05, unidad: 'miles de pesos', expl: R`$\Delta temp=-5\Rightarrow9.5(-5)=-47.5$; $\Delta lluvia=+5\Rightarrow-2.4(5)=-12$; $\Delta dist=+300\Rightarrow-0.06(300)=-18$. Total $=-77.5$. <b>La variable que más aporta es $temp$</b> (−47.5), seguida de $dist$ (−18) y $lluvia$ (−12).` });
  add({ id: 'p1-009', tipo: 'abierta', tema: 't5', sub: 'Poder explicativo', dif: 2, fuente: P1, peso: 0.2, preg: 'Pregunta 4f',
    enun: R`¿Diría que $temp$, $lluvia$ y $dist$ explican gran parte de la variación de las ventas, o se necesitan factores adicionales? ¿Tiene que ver con el $R^2$? ¿Podría haber sesgo si alguno de esos factores estuviera correlacionado con $temp$?`,
    modelo: R`<p>Explican una parte moderada (≈ 31 %); casi 69 % depende de otros factores (día de la semana, promociones, eventos, competencia, precios). Eso es lo que indica el $R^2$ no muy alto. Si un factor omitido (p. ej. una promoción de verano) estuviera correlacionado con $temp$ y afectara las ventas, $\hat\beta_1$ tendría sesgo por variable omitida ($\beta_2\delta_1$): estaría captando parte de ese efecto.</p>`,
    rubrica: ['Concluye que explican una parte moderada y cita factores omitidos plausibles.', 'Relaciona con el valor de $R^2$.', 'Menciona sesgo por variable omitida si hay correlación con $temp$.'] });

  add({ id: 'p1-010', tipo: 'grupo', tema: 't1', sub: 'Identificar supuestos violados', dif: 3, fuente: P1, peso: 1.0, preg: 'Pregunta 5a',
    enun: R`Considere $y=X\beta+\varepsilon$ con $n=4$ observaciones (casos A–D) o con los datos graficados (casos E y F). Para cada caso elija qué ocurre con la información dada.
      <br><span class="small">En el examen se pide escribir el supuesto, si se cumple y una justificación breve; aquí se evalúa la identificación y la justificación está en la explicación.</span>`,
    items: [
      { t: R`Caso A: $\operatorname{Var}(\varepsilon|X)=5\,I_4$`, opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Se cumplen homocedasticidad y no autocorrelación'], c: 3, e: 'Diagonal constante (5) y ceros fuera de ella: $\\sigma^2I$. Ambos supuestos se cumplen.' },
      { t: R`Caso B: $\operatorname{Var}(\varepsilon|X)=\begin{pmatrix}3&1.5&0&0\\1.5&3&1.5&0\\0&1.5&3&1.5\\0&0&1.5&3\end{pmatrix}$`, opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Se cumplen homocedasticidad y no autocorrelación'], c: 1, e: 'La diagonal es constante (homocedasticidad se cumple), pero errores contiguos tienen covarianza 1.5: <b>no autocorrelación se viola</b>.' },
      { t: R`Caso C: $\operatorname{Var}(\varepsilon|X)=\operatorname{diag}(2,\,2,\,8,\,8)$`, opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Se cumplen homocedasticidad y no autocorrelación'], c: 0, e: 'Sin covarianzas (no autocorrelación se cumple), pero la varianza cambia entre observaciones: <b>heterocedasticidad</b>.' },
      { t: R`Caso D: con $x=(1,2,3,4)'$, $E(\varepsilon|X)=(-1.5,\,-0.5,\,0.5,\,1.5)'$`, opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Se cumplen homocedasticidad y no autocorrelación'], c: 2, e: 'La media condicional no es cero y depende de $x$ ($E(\\varepsilon|x)=x-2.5$): <b>exogeneidad se viola</b>.' },
      { t: 'Caso E: errores frente a $x_i$ (el abanico se cierra al aumentar $x$)', fig: 'caseE', opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Se cumplen homocedasticidad y no autocorrelación'], c: 0, e: 'Centrados en 0, pero la dispersión cambia con $x$ (mayor a la izquierda): <b>heterocedasticidad</b>.' },
      { t: 'Caso F: errores en orden temporal (rachas largas de un mismo signo)', fig: 'caseF', opts: ['Homocedasticidad', 'No autocorrelación', 'Exogeneidad $E(\\varepsilon|X)=0$', 'Se cumplen homocedasticidad y no autocorrelación'], c: 1, e: 'Cada error se parece al anterior: <b>autocorrelación</b>, es decir, no autocorrelación se viola.' }
    ] });
  add({ id: 'p1-011', tipo: 'abierta', tema: 't3', sub: 'Gauss–Markov y sesgo', dif: 3, fuente: P1, peso: 0.5, preg: 'Pregunta 5b',
    enun: R`<b>b)</b> En el caso D, ¿sigue siendo $\hat\beta$ insesgado? En los casos B y C, ¿sigue siendo insesgado? ¿Sigue siendo MELI? ¿Qué ocurre con los errores estándar usuales? Justifique con base en Gauss–Markov.`,
    modelo: R`<ul><li><b>Caso D: no es insesgado.</b> $E(\hat\beta|X)=\beta+(X'X)^{-1}X'E(\varepsilon|X)\neq\beta$. Con $y=\beta_0+\beta_1x+\varepsilon$ y $E(\varepsilon|x)=x-2.5$ el sesgo es $(-2.5,\,1)'$: el intercepto baja 2.5 y la pendiente sube 1.</li><li><b>Casos B y C: sí es insesgado</b> (solo requiere S1–S3; la varianza no interviene).</li><li><b>No es MELI</b> en B (autocorrelación) ni en C (heterocedasticidad): Gauss–Markov exige $\sigma^2I$. Además la fórmula usual $\sigma^2(X'X)^{-1}$ deja de ser la varianza correcta, así que los errores estándar, $t$ y $F$ usuales no son confiables; se puede corregir la inferencia con errores robustos (White / Newey–West) o ponderar (MCP/MCGF).</li></ul>`,
    rubrica: ['Caso D: NO insesgado, por $E(\\varepsilon|X)\\neq0$.', 'Casos B y C: SÍ insesgado, porque el insesgamiento no depende de la varianza.', 'B y C: NO MELI (G–M exige $\\sigma^2I$) y los $ee$ usuales son incorrectos.'] });

  /* =============================== PREGUNTAS ORIGINALES, ESTILO PARCIAL =============================== */
  add({ id: 'p1-101', tipo: 'grupo', tema: 't3', sub: 'Verdadero/Falso conceptual', dif: 2, fuente: PO, peso: 0.7,
    enun: 'Escriba V si la afirmación es verdadera o F si es falsa.',
    items: [
      { t: 'Una variable proxy elimina por completo el sesgo por variable omitida.', opts: VFO, c: 1, e: 'Falso: lo reduce si aproxima bien a la omitida, pero no lo elimina por completo.' },
      { t: R`$\hat\sigma^2=\hat\varepsilon'\hat\varepsilon/n$ es un estimador insesgado de $\sigma^2$.`, opts: VFO, c: 1, e: R`Falso: $E(\hat\varepsilon'\hat\varepsilon)=\sigma^2(n-k)$; el insesgado divide entre $n-k$.` },
      { t: 'Al agregar un regresor irrelevante, el $R^2$ no disminuye.', opts: VFO, c: 0, e: 'Verdadero: la $SCR$ no puede aumentar.' },
      { t: R`$\operatorname{Var}(\hat\beta|X)=\sigma^2(X'X)^{-1}$ requiere homocedasticidad y no autocorrelación.`, opts: VFO, c: 0, e: R`Verdadero: sale de $(X'X)^{-1}X'[\sigma^2I]X(X'X)^{-1}$.` },
      { t: 'Un coeficiente no significativo implica que la variable no afecta a $y$.', opts: VFO, c: 1, e: 'Falso: no rechazar $H_0$ no prueba $H_0$.' },
      { t: R`$\operatorname{tr}(H)=n-k$.`, opts: VFO, c: 1, e: R`Falso: $\operatorname{tr}(H)=k$; $\operatorname{tr}(M)=n-k$.` },
      { t: 'En $\\ln y=\\beta_0+\\beta_1x$, $\\beta_1$ es la elasticidad de $y$ respecto a $x$.', opts: VFO, c: 1, e: 'Falso: es una semielasticidad (log-lin); $100\\beta_1$ es el % de cambio en $y$ por unidad de $x$.' }
    ] });
  add({ id: 'p1-102', tipo: 'grupo', tema: 't2', sub: 'Matrices H y M', dif: 2, fuente: PO, peso: 0.7,
    enun: R`Considere $y=X\beta+\varepsilon$ ($n$ obs., $k$ parámetros con intercepto) y $H=X(X'X)^{-1}X'$. Elija la opción correcta.`,
    items: [
      { t: R`$HX=$`, opts: ['$X$', '$0$'], c: 0, e: '$HX=X(X\'X)^{-1}X\'X=X$.' },
      { t: R`$\hat y=$`, opts: ['$Hy$', '$My$'], c: 0, e: 'La proyección sobre col($X$).' },
      { t: R`$H$ cumple $H^2=H$; esto se llama`, opts: ['simetría', 'idempotencia'], c: 1, e: 'Proyectar dos veces es igual a proyectar una.' },
      { t: R`$\hat\varepsilon'\hat y=$`, opts: ['$0$', '$SCR$'], c: 0, e: 'Los residuos son ortogonales a los ajustados.' },
      { t: R`$\operatorname{Var}(\hat\varepsilon|X)=$`, opts: ['$\\sigma^2I$', '$\\sigma^2M$'], c: 1, e: 'Los residuos no son los errores: $\\hat\\varepsilon=M\\varepsilon$.' },
      { t: R`La suma $\sum h_{ii}$ de la diagonal de $H$ es`, opts: ['$k$', '$n-k$'], c: 0, e: '$\\operatorname{tr}(H)=k$.' }
    ] });
  add({ id: 'p1-103', tipo: 'abierta', tema: 't7', sub: 'Interpretación de resultados', dif: 2, fuente: PO, peso: 1.0,
    enun: R`Se estimó $\widehat{\ln(salario)}=1.20+0.08\,educ+0.03\,exper-0.0005\,exper^2-0.15\,mujer$ con $n=500$. <b>a)</b> Interprete $0.08$. <b>b)</b> ¿A qué nivel de experiencia se maximiza el salario esperado? <b>c)</b> Interprete $-0.15$ y explique por qué no es exactamente “15 %”. <b>d)</b> ¿Cómo cambiaría la interpretación si se agregara $mujer\times educ$?`,
    modelo: R`<ul><li><b>a)</b> Log-lin: un año más de educación se asocia con ≈ 8 % más de salario, ceteris paribus (exacto $100(e^{0.08}-1)=8.33\%$).</li>
      <li><b>b)</b> Efecto marginal de experiencia: $0.03-0.001\,exper=0$ ⇒ $exper^*=0.03/(2\cdot0.0005)=30$ años (máximo, pues $\beta<0$ en $exper^2$).</li>
      <li><b>c)</b> Las mujeres ganan ≈ 15 % menos que los hombres con igual educación y experiencia; la aproximación es válida solo para coeficientes pequeños: exacto $100(e^{-0.15}-1)=-13.9\%$.</li>
      <li><b>d)</b> Con la interacción, el efecto de educación para mujeres es $0.08+\beta_{interacción}$; $0.08$ pasa a ser el efecto solo para hombres ($mujer=0$) y el coeficiente de $mujer$ solo es la brecha cuando $educ=0$.</li></ul>`,
    rubrica: ['a) Lee 0.08 como ≈ 8 % por año de educación (log-lin, ceteris paribus).', 'b) Obtiene 30 años con la derivada igual a cero.', 'c) Interpreta la brecha y menciona la corrección exacta para cambios grandes.', 'd) Dice que 0.08 pasa a ser el efecto sólo para $mujer=0$ y que el efecto para $mujer=1$ suma el coeficiente de la interacción.'] });
  add({ id: 'p1-104', tipo: 'mc', tema: 't3', sub: 'Identificar errores', dif: 3, fuente: PO,
    enun: R`Un estudiante afirma: “como en mi modelo hay heterocedasticidad, MCO ya no es insesgado, así que debo usar errores robustos de White para <i>corregir el sesgo</i> de los coeficientes”. ¿Cuál es el error principal en su razonamiento?`,
    opts: ['Los errores de White corrigen el sesgo, pero no la ineficiencia.', 'La heterocedasticidad no causa sesgo; los errores de White corrigen los errores estándar, no los coeficientes.', 'La heterocedasticidad sí sesga, pero White no sirve en muestras pequeñas.', 'El razonamiento es correcto.'], c: 1,
    expl: R`El insesgamiento depende de S1–S3. La heterocedasticidad solo afecta la eficiencia y la validez de $\widehat{\operatorname{Var}}$. White deja los $\hat\beta$ idénticos y corrige los $ee$.`,
    why: ['White no toca los coeficientes ni corrige sesgo (no existe).', '', 'La premisa (“sí sesga”) es falsa.', 'Hay dos errores: la causa del problema y la función de White.'] });
  add({ id: 'p1-105', tipo: 'mc', tema: 't5', sub: 'Análisis de escenarios', dif: 3, fuente: PO,
    enun: R`Dos modelos explican el mismo $y$ con $n=40$: el modelo A ($k=3$) tiene $R^2=0.60$; el modelo B ($k=6$) tiene $R^2=0.62$. ¿Qué modelo prefieres según $\bar R^2$ y por qué?`,
    opts: ['B, porque tiene mayor $R^2$.', 'A: $\\bar R^2_A=0.578>\\bar R^2_B=0.564$; el aumento de $R^2$ no compensa tres parámetros más.', 'B: $\\bar R^2_B>\\bar R^2_A$.', 'No se pueden comparar porque difieren en $k$.'], c: 1,
    expl: R`$\bar R^2_A=1-0.40\cdot\frac{39}{37}=0.5784$; $\bar R^2_B=1-0.38\cdot\frac{39}{34}=0.5641$. Con la fórmula $(n-1)/(n-k)$, A gana por poco: el $R^2$ extra de B (+0.02) no paga tres parámetros adicionales.`,
    why: ['$R^2$ nunca baja al agregar regresores; no sirve para comparar tamaños distintos.', '', 'El cálculo no lo respalda (B es menor).', '$\\bar R^2$ está hecho precisamente para comparar modelos con distinto $k$ y la misma $y$.'] });
  add({ id: 'p1-106', tipo: 'abierta', tema: 't3', sub: 'Demostración (estilo bono)', dif: 3, fuente: PO, peso: 0.2,
    enun: R`Demuestre que, bajo S1–S3, $E(\hat\beta|X)=\beta$. Indique explícitamente dónde se usa cada supuesto.`,
    modelo: R`<p>$\hat\beta=(X'X)^{-1}X'y=(X'X)^{-1}X'(X\beta+\varepsilon)=\beta+(X'X)^{-1}X'\varepsilon$ (se usa <b>S1</b>, linealidad, para sustituir $y$; y <b>S2</b>, rango completo, para que $(X'X)^{-1}$ exista). Tomando esperanza condicional (con $X$ fijo): $E(\hat\beta|X)=\beta+(X'X)^{-1}X'E(\varepsilon|X)=\beta$ (se usa <b>S3</b>, $E(\varepsilon|X)=0$).</p>`,
    rubrica: ['Sustituye $y=X\\beta+\\varepsilon$ para llegar a $\\hat\\beta=\\beta+(X\'X)^{-1}X\'\\varepsilon$.', 'Toma esperanza condicional tratando $X$ como fijo.', 'Atribuye cada paso al supuesto correcto (S1, S2, S3).'] });
  add({ id: 'p1-107', tipo: 'abierta', tema: 't3', sub: 'Demostración (estilo bono)', dif: 3, fuente: PO, peso: 0.2,
    enun: R`Muestre que $E(\hat\varepsilon'\hat\varepsilon|X)=\sigma^2(n-k)$ y concluya cuál divisor hace insesgado a $\hat\sigma^2$. (Ayuda: $\hat\varepsilon=M\varepsilon$ y $\operatorname{tr}(AB)=\operatorname{tr}(BA)$.)`,
    modelo: R`<p>$\hat\varepsilon'\hat\varepsilon=\varepsilon'M'M\varepsilon=\varepsilon'M\varepsilon$ (M simétrica e idempotente) es un escalar, igual a su traza: $E(\varepsilon'M\varepsilon|X)=E[\operatorname{tr}(M\varepsilon\varepsilon')|X]=\operatorname{tr}(M\,\sigma^2I)=\sigma^2\operatorname{tr}(M)=\sigma^2(n-k)$. Por tanto $\hat\sigma^2=\hat\varepsilon'\hat\varepsilon/(n-k)$ es insesgado; con divisor $n$ el sesgo es $-\sigma^2k/n$, mayor cuando $n$ es pequeño o $k/n$ es grande.</p>`,
    rubrica: ['Escribe $\\hat\\varepsilon=M\\varepsilon$ y reduce a $\\varepsilon\'M\\varepsilon$.', 'Usa la traza: $E(\\varepsilon\'M\\varepsilon)=\\sigma^2\\operatorname{tr}(M)$.', 'Calcula $\\operatorname{tr}(M)=n-k$ y concluye el divisor.'] });
})(typeof window !== 'undefined' ? window : globalThis);
