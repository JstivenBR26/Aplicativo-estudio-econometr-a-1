/* temas-asintotica.js — Teoría asintótica (t14, corte 3). Tema para el GRUPO DE LA PROFESORA SOFÍA (sofia:true → bandera en la interfaz).
   FUENTES: contenido estándar de teoría asintótica de MCO (Wooldridge, Cap. 5 y Apéndice C; Gujarati, Apéndice A). NO se dispone del temario ni del
   material de clase de este grupo: el tema debe contrastarse con sus notas. Tampoco hay examen modelo.                                              */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;

  EL.addTema({
    id: 't14', num: 14, corte: 3, sofia: true, semana: 'Grupo de la profesora Sofía', titulo: 'Teoría asintótica de MCO',
    resumen: 'Qué le ocurre a $\\hat\\beta$ cuando $n\\to\\infty$: convergencia en probabilidad, LGN y TLC, consistencia, inconsistencia, normalidad asintótica y eficiencia asintótica.',
    lecturas: 'Wooldridge Cap. 5 y Apéndice C · Gujarati Apéndice A',
    subtemas: ['Convergencia en probabilidad y plim', 'LGN y TLC', 'Consistencia de MCO', 'Inconsistencia', 'Normalidad asintótica e inferencia', 'Eficiencia asintótica y método delta'],
    videos: [{ titulo: 'El secreto de las muestras gigantes en econometría', archivo: 'assets/video/secreto-muestras-gigantes.mp4', nota: 'Empieza por aquí si el Cap. 5 de Wooldridge te resulta pesado: es la versión intuitiva de por qué las muestras grandes cambian la inferencia. Después pasa a la Intuición y a la Formalización.' }],
    objetivo: 'Demostrar y usar la consistencia de MCO, calcular el límite en probabilidad cuando falla la exogeneidad, justificar por qué $t$ y $F$ son válidas con $n$ grande sin normalidad y distinguir insesgamiento de consistencia.',
    intuicion: R`<p>Las propiedades de muestra finita (insesgamiento, varianza exacta, $t$ exacta) a veces no se pueden garantizar. La teoría asintótica pregunta algo más modesto: <b>si tuviera infinitos datos, ¿acertaría el estimador? y ¿cómo se vería su distribución en muestras grandes?</b></p>
      <ul><li><b>Consistencia:</b> con más datos, la distribución de $\hat\beta$ se concentra en $\beta$.</li><li><b>Normalidad asintótica:</b> con $n$ grande, $\hat\beta$ es aproximadamente normal <i>aunque el error no lo sea</i> (por el Teorema del Límite Central). Por eso $t$ y $F$ siguen siendo útiles sin S6.</li></ul>
      <div class="callout warn"><b>Alcance de las fuentes.</b> Tema incorporado para el grupo de la profesora Sofía. Se basa en el desarrollo estándar de la teoría asintótica de MCO; no hay material de clase de ese grupo ni examen modelo entre los insumos. Contrasta notación y supuestos con tus notas de clase.</div>`,
    formal: R`<h4>1. Convergencia en probabilidad y límite en probabilidad</h4>
      <p>$\theta_n\xrightarrow{p}\theta$ (o $\operatorname{plim}\theta_n=\theta$) si para todo $\epsilon>0$: $P(|\theta_n-\theta|>\epsilon)\to0$. Un estimador es <b>consistente</b> si $\operatorname{plim}\hat\theta_n=\theta$.</p>
      <ul><li><b>Propiedades:</b> $\operatorname{plim}(a_n+b_n)=\operatorname{plim}a_n+\operatorname{plim}b_n$, $\operatorname{plim}(a_nb_n)=\operatorname{plim}a_n\operatorname{plim}b_n$, $\operatorname{plim}(a_n/b_n)=\operatorname{plim}a_n/\operatorname{plim}b_n$ si $\operatorname{plim}b_n\neq0$.</li>
      <li><b>Slutsky / continuidad:</b> $\operatorname{plim}g(\theta_n)=g(\operatorname{plim}\theta_n)$ para $g$ continua. (A diferencia de la esperanza, que no “pasa” por funciones no lineales: $E(1/x)\neq1/E(x)$.) Matricial: $\operatorname{plim}A_n^{-1}=(\operatorname{plim}A_n)^{-1}$.</li></ul>
      <h4>2. Ley de los Grandes Números y Teorema del Límite Central</h4>
      <ul><li><b>LGN:</b> para $Y_i$ i.i.d. con media $\mu$: $\bar Y_n\xrightarrow{p}\mu$.</li>
      <li><b>TLC:</b> con varianza finita $\sigma^2$: $\sqrt n\,(\bar Y_n-\mu)\xrightarrow{d}N(0,\sigma^2)$, es decir $\bar Y_n\overset{a}{\sim}N(\mu,\sigma^2/n)$, sea cual sea la distribución de $Y$.</li>
      <li><b>Convergencia en distribución</b> $\xrightarrow{d}$: la función de distribución converge. Convergencia en probabilidad a una constante implica en distribución.</li></ul>
      <h4>3. Consistencia de MCO</h4>
      $$\hat\beta=\beta+\Big(\frac{X'X}{n}\Big)^{-1}\frac{X'\varepsilon}{n}\;\xrightarrow{p}\;\beta+Q^{-1}\cdot\operatorname{plim}\frac{X'\varepsilon}{n},\qquad Q=\operatorname{plim}\frac{X'X}{n}\ \text{(finita e invertible)}$$
      <p>Condición clave: $\operatorname{plim}\frac{X'\varepsilon}{n}=0$, es decir, $E(\varepsilon)=0$ y $\operatorname{Cov}(x_j,\varepsilon)=0$ para todo $j$. Es <b>más débil</b> que $E(\varepsilon|X)=0$: basta que el error esté <i>no correlacionado</i> con las regresoras para tener consistencia (no necesariamente insesgamiento). La LGN justifica que $X'\varepsilon/n\to0$.</p>
      <h4>4. Inconsistencia</h4>
      <p>Si $\operatorname{Cov}(x,\varepsilon)\neq0$, en regresión simple:</p>
      $$\operatorname{plim}\hat\beta_1=\beta_1+\frac{\operatorname{Cov}(x,\varepsilon)}{\operatorname{Var}(x)}$$
      <p>El sesgo <b>no desaparece</b> con $n$. Si se omite $x_2$ ($y=\beta_0+\beta_1x_1+\beta_2x_2+u$): $\operatorname{plim}\tilde\beta_1=\beta_1+\beta_2\,\delta_1$, con $\delta_1=\operatorname{Cov}(x_1,x_2)/\operatorname{Var}(x_1)$ (el análogo asintótico del sesgo del tema 6). Signos: igual que antes (positivo si $\beta_2$ y $\delta_1$ tienen el mismo signo).</p>
      <h4>5. Normalidad asintótica e inferencia</h4>
      <p>Bajo S1–S5 (con homoscedasticidad) y condiciones de regularidad, sin suponer normalidad:</p>
      $$\sqrt n(\hat\beta-\beta)\xrightarrow{d}N\big(0,\;\sigma^2Q^{-1}\big),\qquad\hat\sigma^2\xrightarrow{p}\sigma^2$$
      <ul><li>Luego $\hat\beta\overset{a}{\sim}N\big(\beta,\hat\sigma^2(X'X)^{-1}\big)$ y el estadístico $t=\dfrac{\hat\beta_j-\beta_j}{ee(\hat\beta_j)}\overset{a}{\sim}N(0,1)$; para $q$ restricciones, $q\cdot F\xrightarrow{d}\chi^2_q$. Con $n$ grande los valores críticos de $t_{n-k}$ y de $N(0,1)$ coinciden en la práctica.</li>
      <li>Si hay heteroscedasticidad: $\sqrt n(\hat\beta-\beta)\xrightarrow{d}N(0,Q^{-1}\Omega Q^{-1})$ con $\Omega=\operatorname{plim}X'\Sigma X/n$; el estimador robusto de White es consistente para esa varianza.</li></ul>
      <h4>6. Eficiencia asintótica y método delta</h4>
      <ul><li><b>Eficiencia asintótica:</b> bajo los supuestos de Gauss–Markov (con $E(\varepsilon|X)=0$), MCO tiene la menor varianza asintótica entre una amplia clase de estimadores consistentes.</li>
      <li><b>Método delta:</b> si $\sqrt n(\hat\theta-\theta)\xrightarrow{d}N(0,\sigma^2)$ y $g$ es derivable con $g'(\theta)\neq0$: $\sqrt n\,[g(\hat\theta)-g(\theta)]\xrightarrow{d}N\big(0,\;g'(\theta)^2\sigma^2\big)$.</li></ul>
      <table class="tbl"><tr><th>Propiedad</th><th>Se garantiza con…</th><th>Tipo</th></tr>
      <tr><td>Insesgamiento</td><td>S1, S2, $E(\varepsilon|X)=0$</td><td>Muestra finita</td></tr>
      <tr><td>Consistencia</td><td>S1, S2, $\operatorname{plim}X'\varepsilon/n=0$ (más débil)</td><td>Asintótica</td></tr>
      <tr><td>$t$ y $F$ exactas</td><td>S1–S6 (normalidad)</td><td>Muestra finita</td></tr>
      <tr><td>$t\overset{a}{\sim}N(0,1)$, $qF\to\chi^2_q$</td><td>S1–S5 y $n$ grande (sin normalidad)</td><td>Asintótica</td></tr></table>`,
    ejemplo: {
      titulo: 'Calcular un plim cuando el error está correlacionado con la regresora',
      pasos: [
        R`Modelo $y=1+2x+\varepsilon$, con $x=z+\varepsilon$, donde $z\sim(0,1)$ y $\varepsilon\sim(0,1)$ son independientes. Así $x$ está correlacionada con el error (endogeneidad).`,
        R`$\operatorname{Cov}(x,\varepsilon)=\operatorname{Cov}(z+\varepsilon,\varepsilon)=\operatorname{Var}(\varepsilon)=1$.`,
        R`$\operatorname{Var}(x)=\operatorname{Var}(z)+\operatorname{Var}(\varepsilon)=2$.`,
        R`$\operatorname{plim}\hat\beta_1=2+\dfrac{1}{2}=2.5\neq2$: <b>MCO es inconsistente</b>; con $n=10^6$ seguirá aproximándose a 2.5, no a 2.`,
        R`Diagnóstico: el sesgo asintótico es $\operatorname{Cov}(x,\varepsilon)/\operatorname{Var}(x)=0.5$, positivo porque la correlación es positiva. (El laboratorio “Consistencia” lo muestra.)`
      ]
    },
    aplicacion: R`<p><b>TLC en la práctica.</b> $Y\sim\operatorname{Exp}(1)$ ($\mu=1$, $\sigma^2=1$, muy asimétrica) y $n=100$: $\bar Y\overset{a}{\sim}N(1,\,1/100)$. $P(\bar Y>1.2)\approx P\!\big(Z>\tfrac{0.2}{0.1}\big)=P(Z>2)=0.0228$.</p>
      <p><b>Error estándar asintótico.</b> Con $\sigma^2=4$, $\operatorname{Var}(x)=1$ y $n=400$: $\operatorname{Avar}(\hat\beta_1)/n=\dfrac{4}{400\cdot1}=0.01$ ⇒ $ee=0.1$; IC 95 % asintótico $\hat\beta_1\pm1.96(0.1)$.</p>
      <p><b>Método delta.</b> $\bar Y$ con $\mu=2$, $\sigma^2=4$, $n=100$ y $g(\mu)=1/\mu$: $g'(\mu)=-1/\mu^2=-1/4$ ⇒ $\operatorname{Avar}(1/\bar Y)=\tfrac1{16}\cdot\tfrac4{100}=0.0025$ ⇒ desviación ≈ 0.05.</p>
      <p><b>Por qué importa:</b> sin normalidad del error (S6), las pruebas $t$ y $F$ siguen siendo válidas aproximadamente con muestras grandes; con heteroscedasticidad, los errores robustos son válidos asintóticamente.</p>`,
    errores: [
      { mal: 'Insesgado implica consistente (y viceversa).', bien: 'Son propiedades distintas: usar solo la primera observación es insesgado e inconsistente; $\\hat\\sigma^2=\\hat\\varepsilon\'\\hat\\varepsilon/n$ es sesgado pero consistente.' },
      { mal: 'La consistencia exige $E(\\varepsilon|X)=0$.', bien: 'Basta $\\operatorname{plim}X\'\\varepsilon/n=0$ (error no correlacionado con las regresoras): condición más débil.' },
      { mal: 'Con $n$ grande el sesgo por endogeneidad se vuelve despreciable.', bien: 'No: $\\operatorname{plim}\\hat\\beta_1=\\beta_1+\\operatorname{Cov}(x,\\varepsilon)/\\operatorname{Var}(x)$ no depende de $n$.' },
      { mal: 'Para usar $t$ con muestras grandes el error debe ser normal.', bien: 'No: por el TLC, $t\\overset{a}{\\sim}N(0,1)$ bajo S1–S5.' },
      { mal: '$\\operatorname{plim}$ conmuta con la esperanza: $E(1/\\bar Y)=1/E(\\bar Y)$.', bien: 'Slutsky vale para plim ($\\operatorname{plim}1/\\bar Y=1/\\mu$), no para $E$ (desigualdad de Jensen).' }
    ],
    checks: [
      { q: 'Si $\\operatorname{Cov}(x,\\varepsilon)=0.5$ y $\\operatorname{Var}(x)=2$, el sesgo asintótico de $\\hat\\beta_1$ es:', opts: ['0', '0.25', '1', '4'], c: 1, e: '$\\operatorname{Cov}(x,\\varepsilon)/\\operatorname{Var}(x)=0.5/2=0.25$.' },
      { q: '¿Cuál es la condición mínima para que $\\hat\\beta$ sea consistente?', opts: ['$E(\\varepsilon|X)=0$ y normalidad', '$\\operatorname{plim}X\'\\varepsilon/n=0$ y $\\operatorname{plim}X\'X/n$ invertible', 'Homoscedasticidad', 'Muestra aleatoria simple'], c: 1, e: 'Error no correlacionado con las regresoras y matriz de momentos invertible.' },
      { q: 'Con errores no normales y $n=500$, el estadístico $t$:', opts: ['No tiene distribución conocida', 'Es aproximadamente $N(0,1)$ bajo S1–S5', 'Sigue exactamente una $t$', 'Es inválido'], c: 1, e: 'Normalidad asintótica por el TLC.' }
    ],
    lab: ['asint'], fuente: 'Desarrollo estándar: Wooldridge Cap. 5 (Teoremas 5.1–5.3) y Apéndice C; Gujarati Apéndice A. Sin material de clase del grupo: contrastar con las notas.'
  });
})(typeof window !== 'undefined' ? window : globalThis);
