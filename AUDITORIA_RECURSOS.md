# AUDITORIA_RECURSOS.md
### Auditoría completa de recursos — Proyecto Bruma Café
Fecha de auditoría: 2026-07-04

---

## 1. RESUMEN GENERAL

| Métrica | Valor |
|---|---|
| Peso del proyecto ANTES | **183 MB** |
| Peso del proyecto DESPUÉS | **93 MB** |
| Ahorro total | **≈ 90 MB (≈ 49%)** |
| Carpetas eliminadas | 2 (`build/`, `Imagenes/` de la raíz) |
| Archivos eliminados | 9 (7 imágenes huérfanas + 1 duplicado exacto + 1 backup de editor) |
| Imágenes recomprimidas sin pérdida | 32 archivos PNG |
| Ahorro solo por recompresión de imágenes | ≈ 12.68 MB |
| Enlaces rotos encontrados | **0** (antes y después) |
| Archivos con dudas → se conservaron | 1 (`Enlaces/Grey Simple Coffee shop Menu.pdf`) |
| Estructura de carpetas | **Idéntica** a la original, salvo las 2 carpetas eliminadas |

Metodología usada para no romper nada: por cada archivo HTML, CSS y JS del proyecto
(carpeta `web/`) extraje **todas** las rutas de imagen referenciadas (`src=`, `href=`,
`url()`, incluyendo hojas de estilo y scripts) y las comparé, ruta por ruta, contra el
inventario real de archivos en disco. Solo se marcó un recurso como "no utilizado"
cuando no apareció en ninguna de esas referencias. Antes y después de cada cambio se
repitió esta comparación para garantizar **0 enlaces rotos**.

---

## 2. CARPETAS DUPLICADAS ENCONTRADAS

### ❌ `build/` (66 MB) — ELIMINADA
Es la carpeta de compilación que genera automáticamente NetBeans/Ant (proyecto Java
Web) a partir de `web/`. Verifiqué con `diff -rq web/ build/web/` y confirmé que:
- Es una **copia desactualizada** de `web/`: le faltan archivos que sí existen en
  `web/` (`css/toast.css`, `js/Toast.js`, `js/PromoDetalle.js`, `css/promo-detalle.css`).
- Varios archivos que sí tiene son **versiones antiguas** (`CATALOGO.html`,
  `Promociones.html`, `Registrarse.html`, `Style_3.css`, `Style_Theme.css`,
  `Scrip_3.js`, `js/FormValidator.js` — todos difieren de la versión actual en `web/`).
- Contiene imágenes que ya no existen en el proyecto actual (versiones viejas de
  fotos de espresso y leche de avena), confirmando que es un snapshot obsoleto.
- Ninguna página HTML del proyecto (`web/*.html`) enlaza nunca hacia `build/...`
  (verificado con `grep`) — el navegador nunca carga nada desde ahí.
- Es 100% regenerable: cualquier build futuro desde NetBeans la vuelve a crear.

**Justificación:** carpeta duplicada, desactualizada y no utilizada por el sitio.

### ❌ `Imagenes/` en la raíz del proyecto (9.5 MB) — ELIMINADA
Carpeta con 10 imágenes que resultaron ser **copias exactas** (mismo hash MD5, byte
a byte) de 10 de las 12 imágenes que ya existen en `web/Imagenes/`. Verifiqué:
- Ningún archivo dentro de `web/` referencia `../Imagenes/...` (búsqueda `grep`
  sin resultados) — es decir, es **inalcanzable** desde cualquier página del sitio,
  ya que todas las páginas HTML viven en `web/` y solo pueden acceder a
  `web/Imagenes/`, nunca a una carpeta un nivel arriba.
- Confirmé, archivo por archivo, que el hash MD5 de cada imagen de la raíz coincide
  exactamente con su homóloga en `web/Imagenes/`.

**Justificación:** duplicado exacto e inaccesible desde el sitio real.

---

## 3. ARCHIVOS DUPLICADOS ENCONTRADOS

### ❌ `web/Imagenes/LOGO2.png` (1.18 MB) — ELIMINADO
Hice un escaneo de hash MD5 de **todas** las imágenes de `web/` y el único par
idéntico encontrado fue `LOGO1.png` y `LOGO2.png` (mismo hash
`de0da4f341065429c67bdc0d03287d4c`). Revisé todo el HTML/CSS/JS: **solo
`LOGO1.png` está referenciado** (en el `<img class="logo">` del header de las 5
páginas). `LOGO2.png` nunca aparece en ningún archivo.

**Justificación:** duplicado exacto; se conservó el que realmente usa el proyecto.

---

## 4. IMÁGENES NO UTILIZADAS (huérfanas) — ELIMINADAS

Estas 7 imágenes no aparecen en ninguna referencia de ningún archivo `.html`, `.css`
o `.js` del proyecto (búsqueda exhaustiva, incluyendo nombres de archivo buscados
literalmente en todo el código por si alguna ruta se construía dinámicamente en
JavaScript — no fue el caso):

| Archivo | Ubicación | Por qué no se usa |
|---|---|---|
| `chocolate.jpeg` | `web/Calientes/` | Sin referencias; probablemente el boceto original de "Chocolate Caliente", reemplazado por `Especiales/chocCaliente.png` (esa sí está en uso) |
| `download.jpg` | `web/Calientes/` | Nombre genérico de descarga de navegador (225×225 px) típico de una imagen de prueba; sin referencias |
| `download.jpg` | `web/Clasicos/` | Igual caso que el anterior, en otra carpeta |
| `download_1.jpg` | `web/Clasicos/` | Igual caso, variante numerada |
| `latte.jpeg` | `web/Clasicos/` | Sin referencias; reemplazado por `Clasicos/latte22.png` (esa sí está en uso) |
| `pngtree-achieving-the-fluffiest-meringue-on-lemon-pie-png-image_13040112.png` | `web/Postres/` | Sin referencias; el postre "Lemon Pie" ya usa `pngtree-sweet-lemon-pie-png-image_14541909.png` |

**Dónde verifiqué que no existe ninguna referencia:** comparé el listado completo de
archivos de imagen presentes en `web/` contra el listado de rutas extraídas de
`src=`, `href=` y `url()` en absolutamente todos los `.html`, `.css` y `.js` del
proyecto (`comm -23` entre ambos listados). Ninguna de estas 7 rutas apareció.

---

## 5. ARCHIVO CONSERVADO A PESAR DE NO ESTAR REFERENCIADO (duda → se mantiene)

### ⚠️ `web/Enlaces/Grey Simple Coffee shop Menu.pdf` (2.1 MB)
Este PDF **no está enlazado desde ninguna página** actualmente, pero a diferencia de
los casos anteriores:
- No tiene un nombre genérico de prueba/descarga.
- Es contenido real y coherente con el proyecto (un menú de cafetería).
- Existe una carpeta dedicada `Enlaces/` que sugiere que fue preparado
  intencionalmente para usarse como descarga (posiblemente un botón "Descargar
  menú" que quedó pendiente de agregar al HTML).

Siguiendo tu instrucción de "si tienes duda, conserva", **no lo eliminé**. Si
confirmas que no lo necesitas, puedo quitarlo en una siguiente pasada.

---

## 6. ARCHIVO TEMPORAL DE EDITOR — ELIMINADO

### ❌ `nbproject/build-impl.xml~` (53 KB)
Es un backup automático que crean algunos editores/IDEs (sufijo `~`) del archivo
`nbproject/build-impl.xml`. Confirmé con `diff` que es una versión anterior de ese
mismo archivo (le faltan líneas sobre compilación/ejecución de tests). No es
utilizado por Ant/NetBeans para compilar nada — es pura sobra de edición.

---

## 7. CARPETAS VACÍAS

Se encontró una sola carpeta vacía en todo el proyecto:
`build/web/WEB-INF/classes`. No requirió acción separada porque está **dentro** de
`build/`, carpeta que ya se eliminó completa en el punto 2.

Las carpetas `web/WEB-INF/` y `web/META-INF/` (con `web.xml` y `context.xml`) **se
conservaron intactas**: son parte de la estructura de un proyecto Java Web y sí
contienen archivos de configuración reales, no están vacías ni son basura.

---

## 8. REVISIÓN DE CSS Y JAVASCRIPT

- **CSS:** revisé todos los `background-image` y `url(...)` de las hojas de estilo.
  El único hallazgo fue un ícono de flecha (dropdown) codificado como SVG en línea
  (`data:image/svg+xml,...` dentro de `Style_3.css`) — no es un archivo, no ocupa
  espacio en disco, no requiere acción.
- **JavaScript:** revisé `Scrip_3.js`, `Scrip_catalogo.js` y todos los archivos en
  `js/`. Ningún script contiene rutas hacia imágenes que ya no existan. El único
  script que asigna una imagen dinámicamente (`js/PromoDetalle.js`, línea
  `this.imagen.src = datos.imagenSrc`) la toma directamente del atributo `src` que
  ya tiene la tarjeta en el HTML — es decir, usa las mismas imágenes que ya estaban
  contempladas en el análisis de HTML, no rutas nuevas ni ocultas.
- **Favicon / manifest / preload:** no existe ninguna declaración de favicon,
  manifest ni `rel="preload"` en ninguna página. No es un recurso "roto"; el proyecto
  simplemente nunca definió uno. No se tocó nada al respecto (no forma parte del
  alcance de esta auditoría, que es limpieza, no agregar funcionalidades nuevas).

**Resultado de la verificación cruzada (antes y después de los cambios):
0 rutas rotas, 0 imágenes referenciadas que no existan en disco.**

---

## 9. OPTIMIZACIÓN DE IMÁGENES (recompresión SIN pérdida de calidad)

Recomprimí **todas** las imágenes PNG del proyecto usando compresión sin pérdida
(`png:compression-level=9`, eliminando metadatos innecesarios). Antes de aceptar
cada resultado, comparé **píxel por píxel** el archivo optimizado contra el
original (métrica AE — "Absolute Error" — de ImageMagick) y solo se conservó la
versión optimizada cuando el resultado fue **exactamente idéntico** (AE = 0) y
además más liviano. Si algún archivo no cumplía ambas condiciones, se dejó el
original sin tocar. Ningún píxel cambió en ninguna imagen del proyecto.

**32 imágenes se redujeron de tamaño sin ninguna pérdida visual.** Los ahorros más
grandes:

| Imagen | Antes | Después | Ahorro |
|---|---|---|---|
| `Clasicos/pngtree-espresso-coffee-cutout...png` | 3.81 MB | 1.54 MB | 2.27 MB |
| `Postres/pngtree-tiramisu-cake...png` | 4.83 MB | 2.17 MB | 2.66 MB |
| `Calientes/mocachino.png` | 2.29 MB | 1.00 MB | 1.28 MB |
| `Postres/pngtree-chocolate-brownie...png` | 2.81 MB | 1.26 MB | 1.55 MB |
| `Postres/pngtree-slice-of-strawberry-cheesecake...png` | 2.20 MB | 1.04 MB | 1.16 MB |
| `Postres/pngtree-sweet-lemon-pie...png` | 1.91 MB | 0.82 MB | 1.09 MB |
| `Clasicos/pngtree-delicious-cappuccino...png` | 2.03 MB | 0.97 MB | 1.05 MB |
| `Clasicos/cafepasado.png` | 8.08 MB | 7.44 MB | 0.64 MB |
| `Imagenes/LOGO1.png` | 1.18 MB | 0.89 MB | 0.29 MB |
| ...y 23 imágenes más con ahorros menores | | | |

**Ahorro total por recompresión: ≈ 12.68 MB.**

Las **12 imágenes restantes** ya estaban comprimidas de forma óptima (el proceso
no logró reducir su tamaño manteniendo los píxeles idénticos), así que se dejaron
exactamente como estaban.

### Sobre archivos JPEG y conversión a WebP — decisión: NO se tocaron
- **JPEG:** probé recomprimir los `.jpeg`/`.jpg` del proyecto. El resultado NO fue
  perceptualmente idéntico al 100% a nivel de píxel (a diferencia del PNG, JPEG no
  admite una recompresión "sin pérdida" con las herramientas disponibles en este
  entorno) y en una prueba incluso aumentó de tamaño. Siguiendo la instrucción de no
  sacrificar calidad, **decidí no tocar ningún JPEG**.
- **WebP:** no se realizó la conversión. Aunque ahorraría espacio adicional,
  requeriría actualizar la extensión en decenas de referencias `src=`/`url()` en
  varios archivos HTML/CSS/JS a la vez, y solo debía hacerse "si se verifica que
  todo sigue funcionando" — preferí no introducir ese riesgo sin tu confirmación
  explícita. Puedo hacerlo en una siguiente pasada si lo autorizas.
- **Redimensionar imágenes muy grandes:** varias fotos de producto se guardaron a
  una resolución mucho mayor de la que realmente se muestra en pantalla (por
  ejemplo, `cafepasado.png` mide 4096×4096 px para una tarjeta que se ve a unos
  300 px). Reducir su resolución real ahorraría varios MB adicionales, pero al ser
  un cambio irreversible sobre "imágenes principales" del catálogo, y habiendo
  pedido explícitamente no reducir su calidad, **no lo hice sin tu autorización**.
  Si quieres, puedo preparar ese ahorro adicional (varias decenas de MB) por
  separado.

---

## 10. VERIFICACIÓN FINAL

✔ Se repitió la comparación completa de referencias vs. archivos en disco sobre el
  proyecto ya optimizado: **0 rutas rotas, 0 imágenes referenciadas inexistentes**.
✔ La única imagen/archivo sin referencia que queda es el PDF de la sección 5,
  conservado a propósito.
✔ La estructura de carpetas es idéntica a la original, salvo las 2 carpetas
  eliminadas (`build/`, `Imagenes/` de la raíz) y los archivos puntuales listados.
✔ Ningún archivo HTML, CSS o JS fue modificado en su contenido — el modo claro/oscuro,
  las animaciones, los formularios y toda la funcionalidad existente permanecen
  exactamente igual, porque la auditoría trabajó únicamente sobre recursos
  binarios (imágenes) y archivos sobrantes, nunca sobre el código.
✔ Todas las imágenes optimizadas son **pixel-idénticas** a las originales (AE = 0).

---

## 11. RESUMEN DE CAMBIOS

| # | Elemento | Acción | Ahorro |
|---|---|---|---|
| 1 | `build/` | Eliminada (duplicado desactualizado) | 66 MB |
| 2 | `Imagenes/` (raíz) | Eliminada (duplicado exacto, inalcanzable) | 9.5 MB |
| 3 | `web/Imagenes/LOGO2.png` | Eliminado (duplicado exacto de LOGO1.png) | 1.18 MB |
| 4–9 | 6 imágenes huérfanas en `Calientes/`, `Clasicos/`, `Postres/` | Eliminadas (sin ninguna referencia) | ≈ 0.47 MB |
| 10 | `nbproject/build-impl.xml~` | Eliminado (backup de editor) | 53 KB |
| 11 | 32 imágenes PNG en todo `web/` | Recomprimidas sin pérdida (AE=0) | ≈ 12.68 MB |
| — | `Enlaces/...Menu.pdf` | **Conservado** (duda razonable) | — |
| **TOTAL** | | | **≈ 90 MB (49%)** |
