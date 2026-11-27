/* temas-corte2.js — Corte 2, complementos: contrastes y selección de modelos (t11, num 12) y ecuaciones simultáneas / series de tiempo (t12, num 13).
   Los temas de violaciones de supuestos están en temas-violaciones.js. Fuente: plan en Markdown y programa; sin parcial modelo.               */
(function (root) {
  'use strict';
  const EL = root.EL;
  const R = String.raw;
  const aviso = R`<div class="callout warn"><b>Alcance de las fuentes.</b> Para este tema no hay un parcial de referencia: el contenido sigue el plan de estudio (Markdown) y el programa oficial. Úsalo como estudio conceptual.</div>`;

  /* ===================================================================== t11 */
  EL.addTema({
    id: 't11', num: 12, corte: 2, semana: 'Semana 13', titulo: 'Contrastes de hipótesis y selección de modelos',
    resumen: 'Prueba F de restricciones, significancia conjunta y criterios AIC/BIC.',
    lecturas: 'Maddala Cap. 4 y 8 · Gujarati Cap. 8 y 13',
    subtemas: ['F de restricciones', 'Significancia global', 'AIC y BIC'],
    objetivo: 'Contrastar $m$ restricciones lineales y elegir entre especificaciones con AIC/BIC.',
    intuicion: R`${aviso}<p>La prueba $F$ pregunta si <b>imponer restricciones</b> empeora significativamente el ajuste. Si la SCR sube mucho al restringir, los datos “protestan”: se rechaza la restricción.</p>`,
    formal: R`$$F=\frac{(SCR_R-SCR_{NR})/m}{SCR_{NR}/(n-k)}\sim F_{m,\,n-k}$$
      <p>Rechazar $H_0$ si $F>F_{crit}$. Significancia global ($H_0:\beta_2=\dots=\beta_k=0$): $F=\frac{R^2/(k-1)}{(1-R^2)/(n-k)}$. Con $m=1$, $F=t^2$.</p>
      $$AIC=\ln\!\Big(\frac{SCR}{n}\Big)+\frac{2k}{n},\qquad BIC=\ln\!\Big(\frac{SCR}{n}\Big)+\frac{k\ln n}{n}$$
      <p>Se prefiere el modelo con menor AIC/BIC; BIC penaliza más el número de parámetros. (Según el plan en Markdown; existen otras normalizaciones, pero comparar siempre con la misma.)</p>`,
    ejemplo: { titulo: 'Prueba F', pasos: [R`$n=50$, $k=4$ (no restringido), $m=2$ restricciones. $SCR_{NR}=100$, $SCR_R=120$.`, R`$F=\dfrac{(120-100)/2}{100/46}=\dfrac{10}{2.174}=4.6$.`, R`$F_{0.05;2,46}\approx3.2$ ⇒ <b>se rechaza</b> $H_0$: las restricciones empeoran significativamente el ajuste.`] },
    aplicacion: R`<p>Probar $H_0:\beta_1+\beta_2=1$ (rendimientos constantes en Cobb–Douglas) puede hacerse con $t$ (usando la covarianza) o con $F$ imponiendo la restricción; ambos coinciden ($F=t^2$).</p>`,
    errores: [{ mal: 'Un $F$ global significativo implica que cada $t$ lo es.', bien: 'Con multicolinealidad el $F$ puede ser significativo y ningún $t$ individual lo es.' }],
    checks: [{ q: 'Con $n=50$, $k=4$, $m=2$, $SCR_R=120$, $SCR_{NR}=100$, el estadístico $F$ es ≈', opts: ['4.6', '2.0', '0.2', '10'], c: 0, e: '$(20/2)/(100/46)=4.6$.' }],
    lab: ['tf'], fuente: 'Plan de estudio (Módulo IV), programa del curso (Semana 13), Guía de consulta rápida (E).'
  });

  /* ===================================================================== t12 */
  EL.addTema({
    id: 't12', num: 13, corte: 2, semana: 'Semana 14', titulo: 'Ecuaciones simultáneas e introducción a series de tiempo',
    resumen: 'Sesgo de simultaneidad, identificación y MC2E; estacionariedad, raíz unitaria y cointegración (opcional en el programa).',
    lecturas: 'Maddala Cap. 9 y 13 · Gujarati Cap. 18–22',
    subtemas: ['Simultaneidad', 'Identificación', 'MC2E', 'Estacionariedad y DFA', 'Cointegración'],
    objetivo: 'Explicar por qué MCO falla con regresoras endógenas, verificar la condición de orden y describir las dos etapas de MC2E.',
    intuicion: R`${aviso}<p>En un mercado, precio y cantidad se determinan a la vez: el precio está correlacionado con los choques de oferta y demanda. Regresar cantidad sobre precio con MCO mezcla ambas curvas.</p>`,
    formal: R`<ul><li><b>Sesgo de simultaneidad:</b> una regresora endógena está correlacionada con el error ⇒ viola S3 ⇒ MCO sesgado e inconsistente.</li>
      <li><b>Condición de orden</b> (necesaria): en un sistema de $M$ ecuaciones, las variables excluidas de la ecuación deben ser al menos $M-1$. <b>Rango</b> (suficiente): el rango de la matriz de coeficientes de las excluidas debe ser $M-1$.</li>
      <li><b>MC2E:</b> (1) regresar la endógena sobre todas las exógenas (forma reducida) y obtener $\hat Y$; (2) reemplazar la endógena por $\hat Y$ y aplicar MCO.</li>
      <li><b>Series de tiempo:</b> estacionariedad débil (media y varianza constantes; autocovarianza depende solo del rezago), prueba DFA de raíz unitaria, cointegración (combinación lineal $I(0)$ de series $I(1)$).</li></ul>
      <p>El programa marca la introducción a series de tiempo como <i>opcional si el tiempo lo permite</i>.</p>`,
    ejemplo: { titulo: 'Condición de orden', pasos: [R`Sistema con $M=3$ ecuaciones. Una ecuación excluye 2 variables del sistema.`, R`Se requiere $\ge M-1=2$ excluidas: se cumple con igualdad ⇒ exactamente identificada (condición necesaria).`] },
    aplicacion: R`<p>El MC2E reemplaza la variación “contaminada” de la endógena por la variación explicada por los instrumentos (variables exógenas excluidas de esa ecuación).</p>`,
    errores: [{ mal: 'MCO aplicado a una ecuación estructural de un sistema simultáneo es insesgado.', bien: 'Es sesgado e inconsistente por la correlación entre la endógena y el error.' }],
    checks: [{ q: 'La Etapa 1 de MC2E consiste en:', opts: ['Estimar la forma reducida por MCO para obtener $\\hat Y$', 'Aplicar MCO a la ecuación estructural', 'Eliminar variables exógenas', 'Calcular el Durbin–Watson'], c: 0, e: 'Se regresa la endógena sobre las exógenas del sistema y se guarda el ajuste.' }],
    lab: [], fuente: 'Plan de estudio (Módulo V), programa del curso (Semana 14).'
  });
})(typeof window !== 'undefined' ? window : globalThis);
