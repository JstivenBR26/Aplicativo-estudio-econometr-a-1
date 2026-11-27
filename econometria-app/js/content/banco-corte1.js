/* banco-corte1.js — Banco de preguntas del Corte 1 (temas 0–7).
   Origen: preguntas adaptadas del "Cuestionario de Modelos Lineales (explicado)", del Taller 2 y de la guía MCRL (todo del material del curso),
   reescritas con la convención del Parcial 1 (k = parámetros incluido el intercepto; gl = n − k).
   Esquema:  {id, tipo:'mc'|'vf'|'num', tema, sub, dif:1-3, fuente, enun, opts?, c, tol?, expl, why?[]}                                       */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;
  EL.BANCO = EL.BANCO || [];
  const mc = (id, tema, sub, dif, fuente, enun, opts, c, expl, why) => EL.BANCO.push({ id, tipo: 'mc', tema, sub, dif, fuente, enun, opts, c, expl, why: why || null });
  const vf = (id, tema, sub, dif, fuente, enun, c, expl) => EL.BANCO.push({ id, tipo: 'vf', tema, sub, dif, fuente, enun, c, expl });
  const num = (id, tema, sub, dif, fuente, enun, c, tol, expl, unidad) => EL.BANCO.push({ id, tipo: 'num', tema, sub, dif, fuente, enun, c, tol, expl, unidad: unidad || '' });
  const CQ = 'Cuestionario Modelos Lineales', T2 = 'Taller 2', GC = 'Guía MCRL';
  const DATOS = R`<br><span class="small">Datos: $x=(2,3,5,6,9)$, $y=(8,7,9,12,14)$, $n=5$; $X'X=\begin{pmatrix}5&25\\25&155\end{pmatrix}$, $X'y=\begin{pmatrix}50\\280\end{pmatrix}$, $\sum(y_i-\bar y)^2=34$. Se cumplen S1–S5.</span>`;

  /* ---------------------------------------------------------------- t0 */
  vf('c1-001', 't0', 'Matrices', 1, CQ, R`$(AB)^{-1}=A^{-1}B^{-1}$ para dos matrices cuadradas invertibles del mismo tamaño.`, false, R`Se invierte el orden: $(AB)^{-1}=B^{-1}A^{-1}$. Comprobación: $(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}=I$. El producto matricial no es conmutativo.`);
  vf('c1-002', 't0', 'Estimadores', 2, CQ, R`Si un estimador es insesgado, entonces necesariamente es consistente.`, false, R`Insesgamiento (muestra finita) y consistencia (asintótica) son propiedades distintas. Contraejemplo: usar solo la primera observación para estimar la media es insesgado pero su varianza no cae con $n$. Al revés, $\hat\varepsilon'\hat\varepsilon/n$ es sesgado pero consistente.`);
  mc('c1-003', 't0', 'Varianza', 2, CQ, R`Sean $\operatorname{Var}(Y)=4$, $\operatorname{Var}(X)=9$ y $\operatorname{Cov}(X,Y)=3$. ¿Cuánto vale $\operatorname{Var}(2Y-X+5)$?`, ['25', '37', '8', '13'], 3,
    R`$\operatorname{Var}(2Y-X)=4(4)+1(9)+2(2)(-1)(3)=16+9-12=13$; la constante no afecta.`,
    ['Ignora la covarianza (16+9).', 'Usa mal el signo de la covarianza (16+9+12).', 'Resta varianzas: la varianza de una resta no se resta.', '']);
  mc('c1-004', 't0', 'Rango', 1, CQ, R`Con $X=\begin{pmatrix}1&1&2\\1&2&4\\1&3&6\\1&4&8\end{pmatrix}$ (constante, $x$, $2x$), el rango de $X$ es:`, ['1', '2', '3', '4'], 1,
    R`La tercera columna es $2\times$ la segunda: solo hay 2 columnas independientes. Rango 2 $<3$ columnas ⇒ $X'X$ singular (colinealidad perfecta).`,
    ['Ignora que la constante y $x$ son independientes.', '', 'Sería 3 solo si las tres columnas fueran independientes.', 'El rango no puede superar $\\min(n,k)=3$; 4 es el número de filas.']);
  vf('c1-005', 't0', 'Matrices', 2, CQ, R`Sea $X$ de $n\times k$ con $n>k$ y columnas linealmente independientes. Entonces $X'X$ es simétrica y definida positiva (por tanto, invertible).`, true,
    R`$(X'X)'=X'X$, y para $a\neq0$: $a'X'Xa=\lVert Xa\rVert^2>0$ porque $Xa\neq0$ (columnas independientes). Definida positiva ⇒ todos sus valores propios son positivos ⇒ $\det>0$ ⇒ invertible.`);

  /* ---------------------------------------------------------------- t1 */
  vf('c1-010', 't1', 'Normalidad', 1, CQ, R`La normalidad condicional de los errores es necesaria para poder <i>calcular</i> el estimador MCO $\hat\beta=(X'X)^{-1}X'y$.`, false,
    R`El cálculo es puramente algebraico: basta $\operatorname{rango}(X)=k$. La normalidad solo sirve para la distribución exacta de $t$ y $F$ en muestras finitas. Tampoco se necesita para que MCO sea MELI.`);
  vf('c1-011', 't1', 'Qué garantiza cada supuesto', 2, CQ, R`Para que $\hat\beta$ sea insesgado basta con linealidad en los parámetros, rango completo y $E(\varepsilon|X)=0$; no se requieren homocedasticidad ni normalidad.`, true,
    R`$\hat\beta=\beta+(X'X)^{-1}X'\varepsilon\Rightarrow E(\hat\beta|X)=\beta+(X'X)^{-1}X'E(\varepsilon|X)=\beta$. La varianza de $\varepsilon$ no interviene.`);
  vf('c1-012', 't1', 'Residuos vs errores', 2, CQ, R`Si $\operatorname{Var}(\varepsilon|X)=\sigma^2I$, los residuos MCO $\hat\varepsilon_i$ y $\hat\varepsilon_j$ ($i\neq j$) son no correlacionados porque los errores lo son.`, false,
    R`$\hat\varepsilon=M\varepsilon$, de modo que $\operatorname{Var}(\hat\varepsilon|X)=\sigma^2M$, y $M=I-H$ no es diagonal: $\operatorname{Cov}(\hat\varepsilon_i,\hat\varepsilon_j)=-\sigma^2h_{ij}$. Además los residuos cumplen $k$ restricciones $X'\hat\varepsilon=0$.`);
  mc('c1-013', 't1', 'Heterocedasticidad', 2, CQ, R`Suponga $E(\varepsilon|X)=0$, rango completo y $\operatorname{Var}(\varepsilon_i|X)=\sigma_i^2$ no constante (errores no correlacionados). ¿Qué es correcto sobre $\hat\beta_{MCO}$?`,
    ['Es sesgado e inconsistente.', R`Es insesgado y MELI, y la varianza usual $\sigma^2(X'X)^{-1}$ es válida.`, 'Es insesgado y MELI, pero hay que corregir los errores estándar.', R`Es insesgado, pero no es MELI y la fórmula usual $\sigma^2(X'X)^{-1}$ ya no es su varianza.`], 3,
    R`La heterocedasticidad (S4) no afecta el insesgamiento, pero Gauss–Markov deja de aplicar: MCP/MCG tiene menor varianza. La varianza correcta es la forma sándwich $(X'X)^{-1}X'\Sigma X(X'X)^{-1}$.`,
    ['La varianza no entra en el sesgo.', 'Sin S4 no hay MELI ni validez de la varianza usual.', 'Engañosa: es cierto que hay que corregir los $ee$, pero MCO deja de ser MELI.', '']);
  mc('c1-014', 't1', 'Qué garantiza cada supuesto', 1, GC, R`¿Qué supuesto es el que garantiza que $\hat\beta$ sea <b>insesgado</b>?`, ['Homocedasticidad', 'Exogeneidad $E(\\varepsilon|X)=0$ (con linealidad y rango completo)', 'Normalidad', 'No autocorrelación'], 1,
    R`El insesgamiento se deriva de $E(\varepsilon|X)=0$. Homocedasticidad y no autocorrelación dan la varianza usual y MELI; normalidad da la inferencia exacta.`,
    ['Afecta la varianza, no el sesgo.', '', 'Solo da la distribución exacta de $t$ y $F$.', 'Afecta la varianza y la eficiencia, no el sesgo.']);
  mc('c1-015', 't1', 'Supuestos y forma funcional', 3, GC, R`El modelo verdadero es cuadrático en $x$, pero se estima una recta. Los residuos muestran forma de “U”. ¿Qué consecuencia es más grave?`,
    ['Solo se pierde eficiencia.', R`Se viola $E(\varepsilon|X)=0$ en la práctica (el término omitido $x^2$ queda en el error y está correlacionado con $x$): sesgo.`, 'Se invalida únicamente la normalidad.', 'Ninguna: MCO es robusto a la forma funcional.'], 1,
    R`Una forma funcional errónea deja en el error una función de $x$; así $E(\varepsilon|X)\neq0$ y se pierde el insesgamiento. Herramientas: gráficos de residuos, RESET, añadir $x^2$.`,
    ['El problema es sesgo, no solo eficiencia.', '', 'La normalidad no es el problema central.', 'MCO no es robusto a una mala forma funcional.']);
  vf('c1-016', 't1', 'Residuos vs errores', 1, GC, R`Los residuos $\hat\varepsilon$ son observables, pero los errores $\varepsilon$ no.`, true, R`$\hat\varepsilon=y-X\hat\beta$ se calcula con los datos; $\varepsilon=y-X\beta$ requiere el $\beta$ verdadero, desconocido.`);

  /* ---------------------------------------------------------------- t2 */
  mc('c1-020', 't2', 'Matrices H y M', 1, CQ, R`Sea $H=X(X'X)^{-1}X'$ y $M=I-H$ con $X$ de rango completo. ¿Cuál afirmación es FALSA?`, ['$M$ es simétrica', R`$\operatorname{tr}(M)=k$`, '$M$ es idempotente', '$MX=0$'], 1,
    R`$\operatorname{tr}(M)=n-\operatorname{tr}(H)=n-k$. $k$ es la traza de $H$. Regla: $\operatorname{tr}(H)$ = parámetros; $\operatorname{tr}(M)$ = gl residuales.`,
    ["Verdadera: $M'=I-H'=I-H=M$.", '', 'Verdadera: $MM=I-2H+HH=I-H=M$.', 'Verdadera: $MX=X-X(X\'X)^{-1}X\'X=0$.']);
  mc('c1-021', 't2', 'Solución matricial', 2, CQ, R`${'Con los datos del enunciado'}, ¿cuál es el vector MCO $(\hat\beta_0,\hat\beta_1)$?${DATOS}`, ['$(7,\\;1)$', '$(5,\\;1.2)$', '$(5,\\;1)$', '$(10,\\;0.5)$'], 2,
    R`$S_{xx}=155-5\cdot25=30$; $S_{xy}=280-5(5)(10)=30$. $\hat\beta_1=1$, $\hat\beta_0=10-1\cdot5=5$. Verificación: $5\cdot5+25\cdot1=50$ y $25\cdot5+155\cdot1=280$.`,
    ['7 es el valor ajustado en $x=2$, no el intercepto.', 'No satisface la segunda ecuación normal.', '', 'Ningún valor cumple $X\'X\\hat\\beta=X\'y$.']);
  num('c1-022', 't2', 'Residuos', 2, CQ, R`Con $\hat y=5+x$ para los datos del tema 2 ($y=(8,7,9,12,14)$, $x=(2,3,5,6,9)$), calcula la suma de cuadrados de los residuos $SCR$.${DATOS}`, 4, 0.01,
    R`$\hat y=(7,8,10,11,14)$; $\hat\varepsilon=(1,-1,-1,1,0)$; $SCR=1+1+1+1+0=4$. Control: $\sum\hat\varepsilon_i=0$ y $\sum x_i\hat\varepsilon_i=0$.`);
  vf('c1-023', 't2', 'Rango y unicidad', 2, CQ, R`Si dos columnas de $X$ son idénticas, $X'X$ es singular, las ecuaciones normales tienen infinitas soluciones y todas generan el mismo vector de ajustados $\hat y$.`, true,
    R`El rango de $X$ es menor que $k$ ⇒ $\det(X'X)=0$. Si $b_1,b_2$ resuelven las normales, $\lVert X(b_1-b_2)\rVert^2=0\Rightarrow Xb_1=Xb_2$: $\hat y=Hy$ es único aunque $\hat\beta$ no.`);
  mc('c1-024', 't2', 'Determinante', 1, CQ, R`Con $X'X=\begin{pmatrix}5&25\\25&155\end{pmatrix}$, $\det(X'X)$ es:`, ['150', '30', '775', '625'], 0,
    R`$5\cdot155-25\cdot25=775-625=150=n\,S_{xx}=5\cdot30$.`,
    ['', 'Es $S_{xx}$ (olvida el factor $n$).', 'Solo $n\\sum x_i^2$.', 'Solo $(\\sum x_i)^2$.']);
  vf('c1-025', 't2', 'Ortogonalidad', 2, GC, R`La condición $X'\hat\varepsilon=0$ es un supuesto del modelo clásico sobre los errores.`, false,
    R`Es un resultado algebraico de las ecuaciones normales: se cumple siempre en MCO, aunque los supuestos fallen. No prueba que $E(\varepsilon|X)=0$.`);
  vf('c1-026', 't2', 'Matriz H', 1, GC, R`$\hat y=Hy$: por eso $H$ se llama matriz “sombrero”.`, true, R`$\hat y=X\hat\beta=X(X'X)^{-1}X'y=Hy$. $H$ proyecta $y$ ortogonalmente sobre el espacio columna de $X$.`);
  num('c1-027', 't2', 'Apalancamiento', 3, GC, R`En la regresión simple con $x=(2,3,5,6,9)$, calcula $h_{55}=\frac1n+\frac{(x_5-\bar x)^2}{S_{xx}}$ (la observación con $x=9$).`, 0.7333, 0.005,
    R`$\bar x=5$, $S_{xx}=30$: $h_{55}=0.2+16/30=0.7333$. Los $h_{ii}$ suman $k=2$.`);
  mc('c1-028', 't2', 'Matriz H', 2, GC, R`Con $X$ de rango completo, ¿cuánto vale $\operatorname{tr}(H)$?`, ['$n$', '$n-k$', '$k$', '1'], 2, R`$\operatorname{tr}(X(X'X)^{-1}X')=\operatorname{tr}((X'X)^{-1}X'X)=\operatorname{tr}(I_k)=k$.`,
    ['Es la traza de $I_n$.', 'Es la traza de $M$.', '', 'Solo para un proyector de rango 1.']);

  /* ---------------------------------------------------------------- t3 */
  vf('c1-030', 't3', 'Gauss–Markov', 2, CQ, R`El teorema de Gauss–Markov establece que, bajo sus supuestos, MCO tiene la menor varianza entre <b>todos</b> los estimadores insesgados posibles (lineales o no).`, false,
    R`Solo garantiza mínima varianza en la clase de los estimadores <b>lineales e insesgados</b> (MELI). Con normalidad adicional, MCO es el mejor entre todos los insesgados.`);
  mc('c1-031', 't3', 'Gauss–Markov', 1, 'Estilo Parcial 1 (original)', R`Sea $\tilde\beta=Cy$ otro estimador lineal de $\beta$ con $CX=I$ (insesgado). Bajo S1–S5, el teorema de Gauss–Markov afirma que, respecto de $\hat\beta_{MCO}$:`,
    ['$\\tilde\\beta$ nunca puede tener menor varianza (en sentido matricial semidefinido).', '$\\tilde\\beta$ siempre tiene menor sesgo.', 'ambos tienen la misma varianza solo si hay normalidad.', '$\\hat\\beta$ es el único estimador consistente.'], 0,
    R`MELI/BLUE: $\operatorname{Var}(\tilde\beta|X)-\operatorname{Var}(\hat\beta|X)$ es semidefinida positiva. No hay sesgo que comparar (ambos son insesgados) ni se usa normalidad.`,
    ['', 'Ambos son insesgados: no hay diferencia de sesgo.', 'La comparación de varianzas no requiere normalidad.', 'Existen otros estimadores consistentes (p. ej. $\\tilde\\beta$).']);
  vf('c1-032', 't3', 'Eficiencia y normalidad', 2, 'Estilo Parcial 1 (original)', R`Para demostrar que MCO es MELI se usan homocedasticidad y no autocorrelación; la normalidad del error no se necesita.`, true, R`La prueba de Gauss–Markov usa S1–S5; S6 solo sirve para la inferencia exacta con $t$ y $F$.`);
  mc('c1-033', 't3', 'Varianza de $\\hat\\beta$', 2, CQ, R`Sea $a$ un vector de constantes. Bajo los supuestos clásicos, $\operatorname{Var}(a'\hat\beta\,|X)$ es:`, [R`$\sigma^2(X'X)^{-1}$`, R`$\sigma^2\,a'(X'X)^{-1}a$`, R`$\sigma^2a'a$`, R`$\sigma^2\,a'X'Xa$`], 1,
    R`$\operatorname{Var}(a'Z)=a'\operatorname{Var}(Z)a$ con $Z=\hat\beta$. Es un escalar e incluye las covarianzas.`,
    ['Es una matriz, no un escalar.', '', 'Ignora la estructura de $(X\'X)^{-1}$.', 'Usa $X\'X$ en vez de su inversa; la varianza disminuiría con más información.']);
  vf('c1-034', 't3', 'Covarianza de coeficientes', 2, CQ, R`En la regresión simple con intercepto, si $\bar x>0$ entonces $\operatorname{Cov}(\hat\beta_0,\hat\beta_1|X)<0$.`, true,
    R`$\operatorname{Cov}(\hat\beta_0,\hat\beta_1)=-\sigma^2\bar x/S_{xx}<0$ si $\bar x>0$. Intuición: si se sobreestima la pendiente, el intercepto baja para que la recta pase por $(\bar x,\bar y)$. Centrar $x$ elimina la covarianza.`);
  mc('c1-035', 't3', 'Estimador de $\\sigma^2$', 2, CQ, R`Para los datos del tema 2 ($SCR=4$, $n=5$, $k=2$), el estimador insesgado de $\sigma^2$ es:${DATOS}`, ['0.800', '1.000', '1.333', '4.000'], 2,
    R`$\hat\sigma^2=SCR/(n-k)=4/3=1.333$.`,
    ['$4/5$: divide entre $n$ (sesgado).', '$4/4$: resta solo un parámetro.', '', 'Es la $SCR$ sin dividir.']);
  num('c1-036', 't3', 'Gauss–Markov', 3, T2, R`En el Taller 2 (café), $\tilde\beta_1=(y_5-y_1)/(x_5-x_1)$ con $x=(2,3,5,6,9)$ es lineal e insesgado. Calcula el cociente $\operatorname{Var}(\tilde\beta_1)/\operatorname{Var}(\hat\beta_1)$.`, 1.2245, 0.005,
    R`$\operatorname{Var}(\tilde\beta_1)=2\sigma^2/49$; $\operatorname{Var}(\hat\beta_1)=\sigma^2/30$. Cociente $=60/49=1.2245$.`);
  vf('c1-037', 't3', 'Insesgado vs consistente', 2, GC, R`$\hat\sigma^2=\hat\varepsilon'\hat\varepsilon/n$ es sesgado pero consistente.`, true, R`$E(\hat\varepsilon'\hat\varepsilon/n)=\sigma^2(n-k)/n<\sigma^2$, pero $(n-k)/n\to1$ cuando $n\to\infty$.`);
  vf('c1-038', 't3', 'Heterocedasticidad', 1, 'Estilo Parcial 1 (original)', R`Con heterocedasticidad, la expresión $\sigma^2(X'X)^{-1}$ sigue siendo la varianza correcta de $\hat\beta$.`, false, R`Falso: con $\operatorname{Var}(\varepsilon_i)=\sigma_i^2$ la varianza correcta es el sándwich $(X'X)^{-1}X'\Sigma X(X'X)^{-1}$; $\hat\beta$ sigue insesgado pero deja de ser MELI.`);

  /* ---------------------------------------------------------------- t4 */
  mc('c1-040', 't4', 'Distribución t', 2, CQ, R`Además de los supuestos de Gauss–Markov, ¿qué se requiere para que $t=(\hat\beta_j-\beta_j)/ee(\hat\beta_j)$ tenga distribución $t_{n-k}$ <b>exacta</b> en muestras finitas?`,
    ['Un $R^2$ alto.', 'Que $n$ sea grande.', 'Que $\\sigma^2$ sea conocida.', R`Normalidad condicional: $\varepsilon|X\sim N(0,\sigma^2I)$.`], 3,
    R`Bajo normalidad, $\hat\beta|X$ es normal y $(n-k)\hat\sigma^2/\sigma^2\sim\chi^2_{n-k}$ independiente; su cociente es $t$ exacta.`,
    ['El $R^2$ no afecta la distribución.', 'Da inferencia aproximada (TLC), no exacta.', 'Si $\\sigma^2$ fuera conocida se usaría la normal.', '']);
  num('c1-041', 't4', 'Error estándar', 2, CQ, R`Con los datos del tema 2, calcula $ee(\hat\beta_1)=\sqrt{\hat\sigma^2/S_{xx}}$.${DATOS}`, 0.2108, 0.002, R`$\hat\sigma^2=4/3$, $S_{xx}=30$: $\widehat{\operatorname{Var}}=0.0444$; $ee=0.2108$.`);
  vf('c1-042', 't4', 'Prueba t', 2, CQ, R`Para $H_0:\beta_1=0$ con $\hat\beta_1=1$, $ee=0.2108$ y 3 gl, se rechaza $H_0$ al 5 % (valor crítico $t_{0.025,3}=3.182$).`, true, R`$t=1/0.2108=4.74>3.182$. IC 95 %: $(0.329,1.671)$ no contiene a 0. Con 3 gl no se debe comparar con 1.96.`);
  num('c1-043', 't4', 'Predicción', 3, CQ, R`Con los datos del tema 2, calcula $\widehat{\operatorname{Var}}(\hat y_0)$ para $E(y|x_0=4)$ (varianza de la media condicional, no del valor individual).${DATOS}`, 0.3111, 0.003,
    R`$a=(1,4)'$: $\widehat{\operatorname{Var}}=\hat\sigma^2a'(X'X)^{-1}a=\frac43\cdot\frac{155-200+80}{150}=\frac43(0.2333)=0.3111$. Para un valor individual se suma $\hat\sigma^2$: 1.644.`);
  mc('c1-044', 't4', 'Combinaciones lineales', 3, T2, R`Para contrastar $H_0:\beta_1+\beta_2=0$ el error estándar de $\hat\beta_1+\hat\beta_2$ debe calcularse como:`, [R`$\sqrt{\operatorname{Var}\hat\beta_1+\operatorname{Var}\hat\beta_2}$`, R`$\sqrt{\operatorname{Var}\hat\beta_1+\operatorname{Var}\hat\beta_2+2\operatorname{Cov}(\hat\beta_1,\hat\beta_2)}$`, R`$\sqrt{\operatorname{Var}\hat\beta_1-\operatorname{Var}\hat\beta_2}$`, R`$ee(\hat\beta_1)+ee(\hat\beta_2)$`], 1,
    R`Los estimadores usan los mismos datos y no son independientes. Aquí: $0.009097+0.002792+2(-0.000371)=0.011147\Rightarrow ee=0.1056$ y $t=-0.6799/0.1056=-6.44$.`,
    ['Supone covarianza cero.', '', 'Las varianzas se suman, no se restan.', 'Los errores estándar no se suman.']);
  vf('c1-045', 't4', 'Interpretación', 1, CQ, R`Si el coeficiente de una variable no es estadísticamente significativo, se concluye que su efecto es cero.`, false, R`No rechazar $H_0$ no prueba $H_0$: puede ser falta de potencia (muestra pequeña, multicolinealidad). Revisa el intervalo de confianza.`);
  mc('c1-046', 't4', 'Valor crítico', 2, T2, R`En una regresión con $n=5$ y $k=2$, el valor crítico bilateral al 5 % es:`, ['1.96', '3.182', '2.571', '2.776'], 1, R`gl $=n-k=3$ ⇒ $t_{0.025,3}=3.182$, un 62 % mayor que 1.96.`,
    ['Es de la normal: ignoraría la incertidumbre de estimar $\\sigma$.', '', 'Corresponde a 5 gl.', 'Corresponde a 4 gl.']);
  mc('c1-047', 't4', 'Prueba unilateral', 3, T2, R`$\hat\beta_2=0.795$, $ee=0.0528$, $n-k=116$. Para $H_0:\beta_2=1$ vs. $H_1:\beta_2>1$ (bien de lujo) al 5 % ($t_{0.05,116}=1.658$):`, ['Se rechaza $H_0$: es un bien de lujo.', 'No se rechaza $H_0$ ($t=-3.88$ no cae en la cola derecha).', 'Se rechaza porque $|t|>1.658$.', 'No se puede contrastar.'], 1,
    R`$t=(0.795-1)/0.0528=-3.88$. Con $H_1:\beta_2>1$ solo se rechaza si $t>1.658$ (cola derecha). El signo importa en pruebas unilaterales.`,
    ['No hay evidencia de lujo.', '', 'En una prueba unilateral no se usa $|t|$.', 'Sí se puede.']);

  /* ---------------------------------------------------------------- t5 */
  num('c1-050', 't5', 'R²', 1, CQ, R`Con los datos del tema 2 ($SCR=4$, $SCT=34$), calcula $R^2$.${DATOS}`, 0.8824, 0.001, R`$R^2=1-4/34=30/34=0.8824$. Equivale a $r_{xy}^2=900/(30\cdot34)$ en regresión simple con intercepto.`);
  num('c1-051', 't5', 'R² ajustado', 2, 'Estilo Parcial 1 (original)', R`Con $n=150$, $k=5$ parámetros y $R^2=0.42$, calcula $\bar R^2$.`, 0.404, 0.001, R`Con $\bar R^2=1-(1-R^2)\frac{n-1}{n-k}=1-0.58\cdot\frac{149}{145}=0.404$.`);
  vf('c1-052', 't5', 'R² ajustado', 1, CQ, R`El $R^2$ nunca disminuye al agregar un regresor, mientras que el $R^2$ ajustado puede disminuir e incluso ser negativo.`, true,
    R`Al agregar regresores la $SCR$ no sube ⇒ $R^2$ no baja. $\bar R^2$ penaliza por gl: ej. $R^2=0.02$, $n=20$, $k=6$ ⇒ $\bar R^2=-0.33$.`);
  vf('c1-053', 't5', 'R² sin constante', 2, 'Estilo Parcial 1 (original)', R`En un modelo sin intercepto, la igualdad $SCT=SCE+SCR$ se sigue cumpliendo siempre.`, false, R`Esa descomposición requiere intercepto (para que $\sum\hat\varepsilon_i=0$ y $\bar{\hat y}=\bar y$); sin él falla y el $R^2$ no es comparable.`);
  vf('c1-054', 't5', 'Comparabilidad', 2, CQ, R`Los $R^2$ de un modelo con $y$ y otro con $\ln y$ como dependiente son directamente comparables.`, false, R`Cada uno mide la variación de su propia variable; las $SCT$ difieren.`);
  mc('c1-055', 't5', 'R² vs R² ajustado', 2, T2, R`Se añade una variable con $|t|=0.53$. Entonces:`, ['$R^2$ y $\\bar R^2$ suben.', '$R^2$ sube (o iguala) y $\\bar R^2$ baja.', '$R^2$ baja y $\\bar R^2$ sube.', 'Ninguno cambia.'], 1,
    R`$R^2$ nunca baja. $\bar R^2$ sube si y solo si $|t|>1$; aquí $|t|<1$.`,
    ['$\\bar R^2$ solo sube si $|t|>1$.', '', '$R^2$ no puede bajar.', 'El $R^2$ cambia (aunque sea poco).']);
  mc('c1-056', 't5', 'Cambio de unidades', 2, T2, R`Si la educación se mide en semestres en lugar de años (semestres $=2\times$ años), ¿qué ocurre?`, ['$\\hat\\beta$ se duplica y $t$ cambia.', '$\\hat\\beta$ y su $ee$ se reducen a la mitad; $t$ y $R^2$ no cambian.', 'Cambian $R^2$ y $t$.', 'No cambia nada.'], 1,
    R`$x^*=2x\Rightarrow\hat\beta^*=\hat\beta/2$ y $ee^*=ee/2$; el cociente $t$ y el $R^2$ no cambian (es el mismo modelo reparametrizado).`,
    ['Se divide, no se duplica; y $t$ no cambia.', '', '$t$ y $R^2$ son invariantes.', 'Sí cambian el coeficiente y su $ee$.']);
  vf('c1-057', 't5', 'R² y causalidad', 1, CQ, R`Un $R^2$ elevado demuestra que el modelo está bien especificado y que los regresores causan a $y$.`, false, R`$R^2$ solo mide ajuste lineal muestral. Puede ser alto con regresiones espurias u omitidas, y bajo en modelos correctos con mucho ruido.`);

  /* ---------------------------------------------------------------- t6 */
  mc('c1-060', 't6', 'Variable omitida', 2, CQ, R`El modelo verdadero es $y=\beta_0+\beta_1x_1+\beta_2z+\varepsilon$ con $\beta_2>0$, pero se omite $z$. Si $\operatorname{Corr}(x_1,z)>0$, el estimador de $\beta_1$ de la regresión corta tiene:`, ['Sesgo positivo.', 'Sesgo negativo.', 'Sesgo cero.', 'Signo indeterminado.'], 0,
    R`$E(\tilde\beta_1)-\beta_1=\beta_2\delta_1>0$ (ambos positivos).`,
    ['', 'Requeriría signos opuestos de $\\beta_2$ y $\\delta_1$.', 'Solo si $\\beta_2=0$ o $\\delta_1=0$.', 'Los dos signos están dados.']);
  num('c1-061', 't6', 'Variable omitida', 2, T2, R`Se estima $\ln(reprod)$ sobre $\ln(pub)$ y $\ln(suscript)$: $\hat\beta_1=0.25$, $\hat\beta_2=0.60$. Regresando $\ln(suscript)$ sobre $\ln(pub)$, $\tilde\delta_1=0.50$. ¿Cuánto vale el coeficiente de $\ln(pub)$ en la regresión simple?`, 0.55, 0.005,
    R`$\tilde\beta_1=\hat\beta_1+\hat\beta_2\tilde\delta_1=0.25+0.60(0.50)=0.55$. Sesgo $=0.30$ (el modelo simple exagera el efecto de la publicidad).`);
  mc('c1-062', 't6', 'Interpretación', 1, CQ, R`En $y=\beta_0+\beta_1x_1+\beta_2x_2+\varepsilon$ con $x_1,x_2$ continuas, $\beta_1$ es:`, ['El cambio de $y$ cuando $x_1$ y $x_2$ suben una unidad.', 'El cambio esperado de $y$ cuando $x_1$ sube una unidad, manteniendo $x_2$ constante.', 'La correlación entre $x_1$ y $y$.', 'El cambio de $y$ cuando $x_1$ sube, sin importar $x_2$.'], 1,
    R`$\beta_1=\partial E(y|x)/\partial x_1$: efecto parcial (ceteris paribus).`,
    ['Sería $\\beta_1+\\beta_2$.', '', 'No es una correlación ni está acotado.', 'Describe la regresión simple (efecto total).']);
  mc('c1-063', 't6', 'Variables irrelevantes', 3, GC, R`Incluir una variable irrelevante (con $\beta=0$) correlacionada con otros regresores:`, ['Sesga los demás coeficientes.', 'No sesga, pero puede inflar la varianza.', 'Reduce la varianza.', 'Invalida $S1$.'], 1,
    R`No viola ningún supuesto (el verdadero coeficiente es 0). Pero aumenta $R_j^2$ y por tanto $\operatorname{Var}(\hat\beta_j)=\sigma^2/[SCT_j(1-R_j^2)]$.`,
    ['No hay sesgo.', '', 'Puede aumentarla, no reducirla.', 'Linealidad sigue cumpliéndose.']);
  vf('c1-064', 't6', 'R² múltiple', 3, T2, R`En una regresión múltiple, $R^2=r^2(y,x_1)$ (cuadrado de la correlación entre $y$ y una regresora).`, false, R`Lo correcto es $R^2=[\operatorname{corr}(y,\hat y)]^2$. Solo en regresión simple coincide con $r^2(y,x)$. Ejemplo del Taller: $r^2=0.9245<R^2=0.9387$.`);
  vf('c1-065', 't6', 'Variable omitida', 3, T2, R`Si $\hat\beta_1=0.70$ tanto en la regresión corta como en la larga y $\hat\beta_2\neq0$, entonces $x_1$ y $x_2$ tienen correlación muestral aproximadamente cero.`, true, R`$\tilde\beta_1-\hat\beta_1=\hat\beta_2\tilde\delta_1=0$ con $\hat\beta_2\neq0$ ⇒ $\tilde\delta_1=0$.`);

  /* ---------------------------------------------------------------- t7 */
  mc('c1-070', 't7', 'Log-log', 1, CQ, R`En $\ln(q)=\beta_0+\beta_1\ln(p)$, $\hat\beta_1=-1.2$. Un aumento del 1 % en $p$ se asocia con:`, ['−1.2 unidades de $q$.', '−0.012 % en $q$.', '−1.2 % en $q$.', '+1.2 % en $q$.'], 2, R`Log-log: $\beta_1$ es la elasticidad. Demanda elástica ($|\beta_1|>1$).`,
    ['Ignora que ambas variables están en logaritmos.', 'Divide entre 100 sin necesidad.', '', 'Signo contrario.']);
  mc('c1-071', 't7', 'Lin-log', 2, 'Estilo Parcial 1 (original)', R`Se estimó $\widehat{rendimiento}=4+12\ln(inversion)$, con rendimiento en unidades. Si la inversión sube 20 %, el rendimiento aumenta aproximadamente:`, ['12 %', '2.4 unidades', '0.24 unidades', '24 unidades'], 1, R`Lin-log: $\Delta y\approx\beta_1\cdot\frac{\%\Delta x}{100}=12(0.20)=2.4$ unidades.`,
    ['Lo leería como log-lin.', '', 'Divide entre 100 dos veces.', 'Multiplica por 20 en lugar de dividir entre 100.']);
  vf('c1-072', 't7', 'Log-lin vs log-log', 1, 'Estilo Parcial 1 (original)', R`En un modelo lin-log, $\beta_1$ es la elasticidad de $y$ respecto a $x$.`, false, R`Falso: en lin-log $\beta_1/100$ es el cambio en unidades de $y$ ante 1 % de $x$. La elasticidad es el coeficiente del log-log.`);
  mc('c1-073', 't7', 'Log-lin', 1, CQ, R`En $\ln(salario)=\beta_0+\beta_1educ$ con $\hat\beta_1=0.05$, un año más de educación se asocia con:`, ['0.05 unidades monetarias', '0.05 %', '5 % aprox.', '50 %'], 2, R`Log-lin: $\%\Delta y\approx100\beta_1\Delta x=5\%$ (exacto $100(e^{0.05}-1)=5.13\%$).`,
    ['Eso sería lin-lin.', 'Olvida multiplicar por 100.', '', 'Multiplica por 1000.']);
  num('c1-074', 't7', 'Log-lin exacto', 3, CQ, R`En $\ln(y)=\beta_0+0.08x$, calcula el cambio porcentual <b>exacto</b> esperado de $y$ cuando $x$ aumenta 10 unidades (en %).`, 122.55, 0.1, R`$100(e^{0.08\cdot10}-1)=100(e^{0.8}-1)=122.55\%$. La aproximación $100\beta_1\Delta x=80\%$ subestima porque es válida solo para cambios pequeños.`, '%');
  mc('c1-075', 't7', 'Dummies', 2, CQ, R`En $\widehat{salario}=12+3\,educ-2\,mujer$ (dólares por hora; $mujer=1$ si es mujer), el coeficiente $-2$ significa:`, ['Las mujeres ganan 2 % menos.', 'Cada año de educación reduce 2 dólares el salario de las mujeres.', 'Las mujeres ganan en promedio 2 dólares/hora menos que los hombres con la misma educación.', 'Los hombres ganan 2 dólares menos.'], 2,
    R`Intercepto hombres 12, mujeres 10; misma pendiente 3 ($\beta$ de dummy = diferencia vs. la base).`,
    ['Modelo en niveles, no porcentajes.', 'No hay interacción: la pendiente es común.', '', 'Invierte el signo y la base.']);
  mc('c1-076', 't7', 'Interacciones', 2, CQ, R`En $y=\beta_0+\beta_1x+\beta_2D+\beta_3(xD)$, el efecto marginal de $x$ cuando $D=1$ es:`, [R`$\beta_1+\beta_3$`, R`$\beta_1$`, R`$\beta_3$`, R`$\beta_1+\beta_2$`], 0, R`$E(y|D=1)=(\beta_0+\beta_2)+(\beta_1+\beta_3)x$.`,
    ['', 'Es el efecto con $D=0$.', 'Es la diferencia de pendientes.', '$\\beta_2$ desplaza el intercepto, no multiplica a $x$.']);
  vf('c1-077', 't7', 'Cuadráticos', 2, CQ, R`El modelo $y=\beta_0+\beta_1x+\beta_2x^2+\varepsilon$ es lineal en los parámetros, se estima por MCO y el efecto marginal de $x$ es $\beta_1+2\beta_2x$.`, true, R`Linealidad se refiere a los parámetros: con $z=x^2$ el modelo es lineal. El efecto depende del nivel de $x$; el extremo está en $x^*=-\beta_1/(2\beta_2)$.`);
  mc('c1-078', 't7', 'Trampa de la dummy', 2, GC, R`Un modelo con constante y dos dummies (Hombre, Mujer) que suman 1 para todos genera:`, ['Heterocedasticidad.', 'Colinealidad perfecta: $X\'X$ singular.', 'Autocorrelación.', 'Ningún problema.'], 1, R`Hombre $+$ Mujer $=$ constante: rango $<k$. Se omite una categoría base.`,
    ['No tiene relación con la varianza.', '', 'No tiene relación con el orden temporal.', 'Viola S2.']);
})(typeof window !== 'undefined' ? window : globalThis);
