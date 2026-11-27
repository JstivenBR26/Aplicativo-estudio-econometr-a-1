/* banco-corte2.js — Banco del Corte 2 (temas 8–12). Elaborado a partir del plan en Markdown, el programa y los materiales de monitoría.
   NO existe parcial de referencia para este corte: no se afirma que reproduzca el estilo de evaluación real.                                */
(function (root) {
  'use strict';
  const EL = root.EL, R = String.raw;
  EL.BANCO = EL.BANCO || [];
  const mc = (id, tema, sub, dif, fuente, enun, opts, c, expl, why) => EL.BANCO.push({ id, tipo: 'mc', tema, sub, dif, fuente, enun, opts, c, expl, why: why || null });
  const vf = (id, tema, sub, dif, fuente, enun, c, expl) => EL.BANCO.push({ id, tipo: 'vf', tema, sub, dif, fuente, enun, c, expl });
  const num = (id, tema, sub, dif, fuente, enun, c, tol, expl, unidad) => EL.BANCO.push({ id, tipo: 'num', tema, sub, dif, fuente, enun, c, tol, expl, unidad: unidad || '' });
  const PM = 'Plan de estudio (Markdown)', GM = 'Guía de monitoría (heterocedasticidad)';

  /* t8 */
  vf('c2-001', 't8', 'Consecuencias', 1, PM, R`La multicolinealidad alta (no perfecta) hace que los estimadores MCO sean sesgados.`, false, R`Siguen insesgados y MELI; lo que sube es la varianza (errores estándar grandes, $t$ bajos).`);
  num('c2-002', 't8', 'FIV', 1, PM, R`En la regresión auxiliar de $x_j$ sobre las demás regresoras, $R_j^2=0.90$. Calcula el $FIV_j$.`, 10, 0.01, R`$FIV=1/(1-0.90)=10$: umbral clásico de colinealidad severa.`);
  mc('c2-003', 't8', 'Síntomas', 2, PM, R`Al añadir una segunda regresora muy correlacionada con la primera, el error estándar de la primera se multiplica por 3 y su $t$ pasa de 6 a 2, mientras el $R^2$ casi no cambia. Esto se explica por:`, ['Heterocedasticidad.', 'Autocorrelación.', 'Multicolinealidad: las dos variables comparten información y la varianza de cada coeficiente se infla.', 'Una forma funcional incorrecta.'], 2, R`El coeficiente es el mismo ($6/3=2$ en $t$ por el error estándar triplicado): los datos no pueden separar el efecto de variables que se mueven juntas.`,
    ['No cambia el error estándar de una sola variable de esa manera.', 'Es un problema de series de tiempo.', '', 'No produce este patrón.']);
  mc('c2-004', 't8', 'Remedios', 2, PM, R`Ante colinealidad alta entre dos regresores que son ambos relevantes según la teoría, la mejor primera opción es:`, ['Eliminar uno de ellos sin más.', 'Conseguir más datos / información independiente o imponer una restricción teórica.', 'Aplicar errores de White.', 'Quitar el intercepto.'], 1, R`Eliminar una variable relevante introduce sesgo por omisión (tema 6). White no resuelve colinealidad.`,
    ['Sesgo por variable omitida.', '', 'White corrige heterocedasticidad.', 'Empeora el problema.']);

  /* t9 */
  vf('c2-010', 't9', 'Consecuencias', 1, GM, R`Con heterocedasticidad, los errores estándar de R (usuales) suelen ser demasiado pequeños y los $p$-valores poco confiables, pero los coeficientes siguen siendo insesgados.`, true, R`Correcto (guía de monitoría): R no avisa; por eso se detecta con gráfico y prueba.`);
  mc('c2-011', 't9', 'Detección', 2, GM, R`En la prueba de Breusch–Pagan/White, $H_0$ y la decisión con $p=0.0001$ son:`, ['$H_0$: heterocedasticidad; no se rechaza.', '$H_0$: homocedasticidad; se rechaza ⇒ hay heterocedasticidad.', '$H_0$: homocedasticidad; no se rechaza.', '$H_0$: autocorrelación; se rechaza.'], 1, R`$H_0$ es siempre homocedasticidad. $p<0.05$ ⇒ se rechaza $H_0$.`,
    ['$H_0$ es la homocedasticidad.', '', '$p$ muy pequeño sí rechaza.', 'No es la prueba de autocorrelación.']);
  mc('c2-012', 't9', 'Remedios', 2, GM, R`Tras usar errores estándar de White (HC3), ¿qué cambia respecto al MCO usual?`, ['Los coeficientes y los errores estándar.', 'Solo los errores estándar (y con ellos $t$ y $p$).', 'Solo los coeficientes.', 'Nada.'], 1, R`Mismos $\hat\beta$; nueva matriz de varianzas robusta.`,
    ['Los coeficientes no cambian.', '', 'Es al revés.', 'Cambian los $ee$.']);
  mc('c2-013', 't9', 'MCP', 3, GM, R`Si $\operatorname{Var}(\varepsilon_i)=\sigma^2x_i^2$, los pesos de MCP son:`, [R`$w_i=x_i^2$`, R`$w_i=1/x_i^2$`, R`$w_i=x_i$`, R`$w_i=1/x_i$`], 1, R`Cada observación pesa $1/\operatorname{Var}(\varepsilon_i)\propto1/x_i^2$: las más ruidosas cuentan menos.`,
    ['Daría más peso a las más ruidosas.', '', 'Corresponde a $\\operatorname{Var}\\propto 1/x_i$, no a $x_i^2$.', 'Es el factor por el que se dividen las variables (la transformación $1/\\sigma_i$), no el peso, que es su cuadrado.']);
  num('c2-014', 't9', 'Varianza verdadera', 3, 'Taller 2', R`Café: $\operatorname{Var}(\varepsilon_i|x_i)=\sigma^2x_i$, $x=(2,3,5,6,9)$. Calcula el cociente (varianza verdadera de $\hat\beta_1$ MCO) / (varianza que dice la fórmula usual $\sigma^2/S_{xx}$).`, 6, 0.01, R`Verdadera: $\sigma^2\sum(x_i-\bar x)^2x_i/S_{xx}^2=0.2\sigma^2$; usual: $\sigma^2/30$. Cociente $=0.2\cdot30=6$: la fórmula usual subestima 6 veces.`);

  /* t10 */
  num('c2-020', 't10', 'Durbin–Watson', 2, PM, R`Con $d=1.2$, el $\hat\rho$ aproximado es (usa $d\approx2(1-\hat\rho)$):`, 0.4, 0.01, R`$\hat\rho\approx1-d/2=0.4$: autocorrelación positiva moderada.`);
  mc('c2-021', 't10', 'Consecuencias', 2, PM, R`Con autocorrelación positiva y regresoras exógenas, la varianza usual $\hat\sigma^2(X'X)^{-1}$ de $\hat\beta$ respecto de la varianza verdadera tiende a ser:`, ['Menor: los $t$ se inflan y se rechaza $H_0$ verdadera con demasiada frecuencia.', 'Mayor: los $t$ son conservadores.', 'Igual, porque $\\hat\\beta$ es insesgado.', 'Imposible de comparar.'], 0, R`Cada observación repite parte de la información de la anterior: hay menos información independiente de la que parece y el error estándar usual es optimista. El insesgamiento no garantiza una varianza correcta.`,
    ['', 'Es lo contrario del caso típico.', 'Insesgado dice algo del centro, no de la varianza.', 'Sí se puede comparar con la fórmula sándwich / HAC.']);
  mc('c2-022', 't10', 'Elección de prueba', 3, PM, R`Para contrastar autocorrelación de orden 2 (no solo de primer orden) en un modelo sin rezagos de $y$, la prueba más adecuada es:`, ['Durbin–Watson, que detecta cualquier orden.', 'Breusch–Godfrey (LM), que admite órdenes superiores.', 'White.', 'RESET.'], 1, R`Breusch–Godfrey regresa los residuos sobre las $x$ y varios rezagos de los residuos ($nR^2\sim\chi^2_p$). DW solo mira el primer orden.`,
    ['DW está pensada para el primer orden.', '', 'Es para heterocedasticidad.', 'Es para forma funcional.']);

  /* t11 */
  num('c2-030', 't11', 'Prueba F', 2, PM, R`$n=50$, $k=4$ (no restringido), $m=2$ restricciones, $SCR_R=120$, $SCR_{NR}=100$. Calcula $F$.`, 4.6, 0.05, R`$F=\frac{(120-100)/2}{100/(50-4)}=\frac{10}{2.174}=4.6$. Con $F_{0.05;2,46}\approx3.2$ se rechaza.`);
  mc('c2-031', 't11', 'AIC/BIC', 2, PM, R`Según AIC y BIC (con $\ln(SCR/n)+$ penalización), se prefiere el modelo con:`, ['Mayor valor.', 'Menor valor.', 'Valor más cercano a 1.', 'Mayor número de parámetros.'], 1, R`Menor AIC/BIC: mejor equilibrio entre ajuste (SCR) y parsimonia (penalización por $k$).`, ['Es al revés.', '', 'No son proporciones.', 'Más parámetros penalizan.']);
  vf('c2-032', 't11', 'F y t', 3, PM, R`Con una sola restricción ($m=1$), el estadístico $F$ es igual al cuadrado del estadístico $t$.`, true, R`$F_{1,n-k}=t_{n-k}^2$: ambas pruebas llegan a la misma conclusión.`);

  /* t12 */
  vf('c2-040', 't12', 'Simultaneidad', 2, PM, R`En un sistema simultáneo, aplicar MCO a una ecuación estructural con una regresora endógena produce estimadores sesgados e inconsistentes.`, true, R`La endógena está correlacionada con el error estructural (viola S3).`);
  mc('c2-041', 't12', 'MC2E', 2, PM, R`En MC2E, la <b>Etapa 1</b> consiste en:`, ['Aplicar MCO a la ecuación estructural.', 'Estimar por MCO la forma reducida de la endógena y obtener $\\hat Y$.', 'Eliminar variables exógenas.', 'Calcular el estadístico DW.'], 1, R`Se regresa la endógena sobre las exógenas del sistema; en la Etapa 2 se sustituye por $\hat Y$.`, ['Esa es la Etapa 2 (con $\\hat Y$).', '', 'No se eliminan exógenas.', 'No tiene relación.']);
  mc('c2-042', 't12', 'Identificación', 3, PM, R`En un sistema de $M=4$ ecuaciones endógenas, la condición de orden exige que cada ecuación excluya al menos:`, ['1 variable', '3 variables', '4 variables', '2 variables'], 1, R`Condición de orden (necesaria): excluidas $\ge M-1=3$.`, ['Es $M-3$.', '', 'Es $M$.', 'Es $M-2$.']);
  mc('c2-043', 't12', 'Series de tiempo', 2, PM, R`Una serie es estacionaria en sentido débil si:`, ['Tiene tendencia creciente.', 'Su media y varianza son constantes y su autocovarianza solo depende del rezago.', 'Tiene raíz unitaria.', 'Es normal.'], 1, R`Definición de estacionariedad débil.`, ['Una tendencia viola la media constante.', '', 'La raíz unitaria implica no estacionariedad.', 'La normalidad es otro asunto.']);
})(typeof window !== 'undefined' ? window : globalThis);
