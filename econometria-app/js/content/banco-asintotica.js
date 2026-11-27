/* banco-asintotica.js — Preguntas de teoría asintótica (t14) para el grupo de la profesora Sofía.
   Elaboración propia a partir del desarrollo estándar (Wooldridge Cap. 5 y Apéndice C). Sin examen modelo ni material de clase de ese grupo. */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;
  EL.BANCO = EL.BANCO || [];
  const F = 'Teoría asintótica (Wooldridge Cap. 5)';
  const mc = (id, sub, dif, enun, opts, c, expl, why) => EL.BANCO.push({ id, tipo: 'mc', tema: 't14', sub, dif, fuente: F, enun, opts, c, expl, why: why || null });
  const vf = (id, sub, dif, enun, c, expl) => EL.BANCO.push({ id, tipo: 'vf', tema: 't14', sub, dif, fuente: F, enun, c, expl });
  const num = (id, sub, dif, enun, c, tol, expl) => EL.BANCO.push({ id, tipo: 'num', tema: 't14', sub, dif, fuente: F, enun, c, tol, expl });

  vf('c3-001', 'Consistencia vs insesgamiento', 1, R`Un estimador consistente es necesariamente insesgado.`, false, R`Falso: $\hat\sigma^2=\hat\varepsilon'\hat\varepsilon/n$ es sesgado en muestras finitas y consistente.`);
  vf('c3-002', 'Consistencia vs insesgamiento', 2, R`Usar solo la primera observación $Y_1$ para estimar $\mu$ da un estimador insesgado pero inconsistente.`, true, R`$E(Y_1)=\mu$ pero $\operatorname{Var}(Y_1)=\sigma^2$ no cae con $n$.`);
  num('c3-003', 'Inconsistencia', 2, R`En $y=1+3x+\varepsilon$ con $\operatorname{Cov}(x,\varepsilon)=2$ y $\operatorname{Var}(x)=4$, ¿a qué valor converge en probabilidad $\hat\beta_1$?`, 3.5, 0.005, R`$\operatorname{plim}\hat\beta_1=\beta_1+\operatorname{Cov}(x,\varepsilon)/\operatorname{Var}(x)=3+0.5=3.5$.`);
  mc('c3-004', 'Condición de consistencia', 2, R`¿Qué condición garantiza la consistencia de MCO (además de que $\operatorname{plim}X'X/n$ sea invertible)?`, [R`$E(\varepsilon|X)=0$ y normalidad`, R`$\operatorname{plim}X'\varepsilon/n=0$ (error no correlacionado con las regresoras)`, 'Homocedasticidad', 'Que $R^2$ tienda a 1'], 1,
    R`$\hat\beta=\beta+(X'X/n)^{-1}X'\varepsilon/n$: si $X'\varepsilon/n\to0$ y $Q$ es invertible, $\hat\beta\to\beta$. Es más débil que $E(\varepsilon|X)=0$.`,
    ['Es más fuerte de lo necesario; la normalidad no interviene.', '', 'Afecta la varianza, no la consistencia.', 'No tiene relación.']);
  num('c3-005', 'TLC', 2, R`$Y\sim\operatorname{Exp}(1)$ ($\mu=1$, $\sigma^2=1$). Con $n=100$, aproxima $P(\bar Y>1.2)$ usando el TLC.`, 0.0228, 0.001, R`$z=(1.2-1)/(1/\sqrt{100})=2$ ⇒ $P(Z>2)=0.0228$.`);
  mc('c3-006', 'Slutsky', 2, R`Si $\bar Y\xrightarrow{p}\mu\neq0$, entonces $1/\bar Y$:`, [R`converge en probabilidad a $1/\mu$`, R`tiene esperanza $1/\mu$ para todo $n$`, 'no converge', R`converge a $\mu$`], 0,
    R`Slutsky/continuidad: $\operatorname{plim}g(\bar Y)=g(\operatorname{plim}\bar Y)$. La esperanza no pasa por funciones no lineales ($E(1/\bar Y)\neq1/\mu$).`,
    ['', 'Jensen: $E(1/\\bar Y)\\neq1/E(\\bar Y)$.', 'Sí converge por continuidad.', 'Convergería a $1/\\mu$.']);
  num('c3-007', 'Error estándar asintótico', 3, R`Bajo S1–S5, $\operatorname{Avar}(\hat\beta_1)=\sigma^2/\operatorname{Var}(x)$. Con $\sigma^2=9$, $\operatorname{Var}(x)=2$ y $n=450$, ¿cuánto vale el error estándar aproximado $\sqrt{\operatorname{Avar}/n}$?`, 0.1, 0.002, R`$\sqrt{9/(2\cdot450)}=\sqrt{0.01}=0.1$.`);
  num('c3-008', 'Variable omitida asintótica', 2, R`El modelo verdadero tiene $\beta_2=-1$ y la regresión auxiliar de $x_2$ sobre $x_1$ da $\delta_1=0.4$. ¿Cuál es el sesgo asintótico $\operatorname{plim}\tilde\beta_1-\beta_1$ al omitir $x_2$?`, -0.4, 0.005, R`$\beta_2\delta_1=(-1)(0.4)=-0.4$ (sesgo negativo: signos opuestos).`);
  vf('c3-009', 'Normalidad asintótica', 2, R`Con errores no normales y $n$ grande, bajo S1–S5, el estadístico $t$ es aproximadamente $N(0,1)$.`, true, R`Por el TLC: normalidad asintótica de $\hat\beta$ y consistencia de $\hat\sigma^2$.`);
  num('c3-010', 'Método delta', 3, R`$\sqrt n(\bar Y-\mu)\to N(0,\sigma^2)$ con $\mu=4$, $\sigma^2=8$, $n=200$. Usa el método delta con $g(\mu)=\ln\mu$ para obtener $\operatorname{Avar}/n=g'(\mu)^2\sigma^2/n$.`, 0.0025, 0.0001, R`$g'(\mu)=1/\mu=0.25$; $g'^2\sigma^2=0.0625\times8=0.5$; $0.5/200=0.0025$ (desviación ≈ 0.05).`);
  mc('c3-011', 'Heterocedasticidad asintótica', 3, R`Con heterocedasticidad, la varianza asintótica de $\sqrt n(\hat\beta-\beta)$ es:`, [R`$\sigma^2Q^{-1}$`, R`$Q^{-1}\Omega Q^{-1}$ con $\Omega=\operatorname{plim}X'\Sigma X/n$`, '0', R`$\sigma^2I$`], 1, 'La forma sándwich; el estimador de White es consistente para ella.', ['Solo con homocedasticidad.', '', 'No converge a cero.', 'Es la matriz de errores, no del estimador.']);
  mc('c3-012', 'LGN vs TLC', 1, R`La diferencia entre LGN y TLC es:`, ['La LGN da la distribución límite; el TLC da el valor límite', 'La LGN dice que $\\bar Y_n\\to\\mu$; el TLC describe la distribución de $\\sqrt n(\\bar Y_n-\\mu)$', 'Son equivalentes', 'El TLC requiere normalidad de $Y$'], 1, 'LGN: consistencia. TLC: normalidad asintótica, sin exigir que $Y$ sea normal.', ['Es al revés.', '', 'Dicen cosas distintas.', 'No exige normalidad de $Y$.']);
  vf('c3-013', 'Consistencia', 3, R`Si $x$ está correlacionada con el error, la inconsistencia de $\hat\beta_1$ se vuelve despreciable al aumentar $n$.`, false, R`El límite $\beta_1+\operatorname{Cov}(x,\varepsilon)/\operatorname{Var}(x)$ no depende de $n$.`);
  EL.BANCO.push({ id: 'c3-014', tipo: 'grupo', tema: 't14', sub: 'Verdadero/Falso asintótico', dif: 2, fuente: F, peso: 1,
    enun: 'Indica si cada afirmación es verdadera o falsa.',
    items: [
      { t: R`$\operatorname{plim}(a_nb_n)=\operatorname{plim}a_n\cdot\operatorname{plim}b_n$ cuando ambos límites existen.`, opts: ['Verdadero', 'Falso'], c: 0, e: 'Propiedad del plim.' },
      { t: R`$E(g(X))=g(E(X))$ para toda $g$ continua.`, opts: ['Verdadero', 'Falso'], c: 1, e: 'Solo vale para $g$ lineal; en general Jensen.' },
      { t: R`$\hat\beta_{MCO}$ puede ser consistente sin ser insesgado.`, opts: ['Verdadero', 'Falso'], c: 0, e: R`Si $\operatorname{Cov}(x,\varepsilon)=0$ pero $E(\varepsilon|X)\neq0$.` },
      { t: 'Con $n$ grande, hace falta S6 (normalidad) para usar $t$.', opts: ['Verdadero', 'Falso'], c: 1, e: 'El TLC la reemplaza.' },
      { t: R`$\hat\sigma^2\xrightarrow{p}\sigma^2$ bajo S1–S5.`, opts: ['Verdadero', 'Falso'], c: 0, e: 'Consistencia del estimador de la varianza.' },
      { t: 'Con endogeneidad, aumentar $n$ elimina el sesgo.', opts: ['Verdadero', 'Falso'], c: 1, e: 'La inconsistencia es asintótica.' }
    ] });
  EL.BANCO.push({ id: 'c3-015', tipo: 'abierta', tema: 't14', sub: 'Demostración', dif: 3, fuente: F, peso: 1,
    enun: R`En el modelo simple $y_i=\beta_0+\beta_1x_i+\varepsilon_i$, demuestra que $\hat\beta_1=\beta_1+\dfrac{\sum(x_i-\bar x)\varepsilon_i}{\sum(x_i-\bar x)^2}$ y, usando la LGN, que $\operatorname{plim}\hat\beta_1=\beta_1+\dfrac{\operatorname{Cov}(x,\varepsilon)}{\operatorname{Var}(x)}$. ¿Cuándo es consistente?`,
    modelo: R`<p>$\hat\beta_1=\dfrac{\sum(x_i-\bar x)y_i}{\sum(x_i-\bar x)^2}$; sustituyendo $y_i$ y usando $\sum(x_i-\bar x)=0$ y $\sum(x_i-\bar x)x_i=\sum(x_i-\bar x)^2$ se obtiene la descomposición. Dividiendo numerador y denominador por $n$: $\hat\beta_1=\beta_1+\dfrac{n^{-1}\sum(x_i-\bar x)\varepsilon_i}{n^{-1}\sum(x_i-\bar x)^2}$. Por la LGN el numerador $\xrightarrow{p}\operatorname{Cov}(x,\varepsilon)$ y el denominador $\xrightarrow{p}\operatorname{Var}(x)>0$; por Slutsky el cociente converge al cociente de límites. Es consistente si y solo si $\operatorname{Cov}(x,\varepsilon)=0$.</p>`,
    rubrica: ['Obtiene $\\hat\\beta_1=\\beta_1+\\sum(x_i-\\bar x)\\varepsilon_i/\\sum(x_i-\\bar x)^2$.', 'Divide entre $n$ y aplica LGN a numerador y denominador.', 'Usa Slutsky para el cociente y concluye que es consistente sii $\\operatorname{Cov}(x,\\varepsilon)=0$.'] });
})(typeof window !== 'undefined' ? window : globalThis);
