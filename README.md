# 🚀 ADBA Diseños Web & 3D - Sitio Oficial & Portafolio Interactivo

Sitio web corporativo de **ADBA Diseños Web & 3D**, agencia líder en desarrollo web 100% en **Código a Medida** con efectos 3D WebGL (Three.js), fotografía profesional de alta definición y Agente de Inteligencia Artificial para ventas y cotizaciones directas por WhatsApp.

Optimizado con las mejores prácticas de **SEO On-Page en México/CDMX** y configurado para máximo rendimiento (**100/100 en Google PageSpeed Insights**) listo para desplegar en **Hostinger**.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3 Flexbox/Grid con variables dinámicas, JavaScript ES6+ Puro (Vanilla JS).
- **Efectos 3D:** Three.js (WebGL interactive particle system).
- **IA integradas:** Agente de IA conversacional (`assets/js/ai-agent.js`) pre-entrenado en paquetes y precios de CDMX.
- **Tipografía & Iconos:** Google Fonts (*Inter*, *Plus Jakarta Sans*) y FontAwesome 6.5.
- **Servidor Web:** Optimizado para Apache/Nginx en **Hostinger** (`.htaccess` con compresión Gzip, caché y cabeceras HTTP).

---

## 📂 Estructura del Proyecto

```text
adba-web-design-3d/
├── index.html                   # Página de Inicio (Hero 3D, Servicios, Paquetes, FAQ)
├── paquetes.html                # Precios y planes detallados (Emprendedor, Pyme Pro, Tienda, etc.)
├── portafolio.html              # Galería de proyectos y comparativa de tipos de sitios web
├── contacto.html                # Página de contacto con mapa 3D y ubicación Col. Obrera CDMX
├── codigo-vs-plantilla.html     # Comparativa técnica: Código Puro vs WordPress/Wix
├── terminos.html                # Términos y condiciones del servicio
├── 404.html                     # Página de error 404 personalizada en 3D
├── sitemap.xml                  # Mapa del sitio XML para indexación en Google
├── robots.txt                   # Archivo de directivas para motores de búsqueda
├── .htaccess                    # Configuración de compresión, caché y seguridad para Hostinger
├── .gitignore                   # Archivos excluidos de Git
└── assets/
    ├── css/
    │   └── styles.css           # Hoja de estilos obsidian premium
    ├── js/
    │   ├── 3d-canvas.js         # Motor gráfico 3D Three.js
    │   └── ai-agent.js          # Lógica del bot conversacional de IA
    └── images/                  # Fotografía real HD de los demos (Dental, Arq, Gourmet, Sneakers)
└── demos/                       # Ejemplos en vivo interactivos
    ├── landing-dental.html      # Demo 1: Landing Page Clínica Dental
    ├── multipagina-arquitectura.html # Demo 2: Sitio Multi-Página Estudio de Arquitectura
    ├── webapp-restaurante.html  # Demo 3: Menú Digital / Web App Gastronómica
    └── tienda-calzado.html      # Demo 4: Tienda Online E-Commerce Streetwear
```

---

## 📤 Guía Paso a Paso para Subir a Git & GitHub

### 1. Inicializar Repositorio Git
Abre la terminal en la carpeta raíz del proyecto y ejecuta:

```bash
# Inicializar repositorio local
git init

# Agregar todos los archivos
git add .

# Realizar el primer commit
git commit -m "Initial commit: Sitio Web ADBA Diseños 3D optimizado para SEO y Hostinger"
```

### 2. Conectar con GitHub
Crea un nuevo repositorio vacío en [GitHub](https://github.com/new) (ej. `adba-web-design-3d`) y vincula tu repositorio local:

```bash
# Cambiar nombre de rama a main
git branch -M main

# Enlazar repositorio remoto de GitHub (Reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/adba-web-design-3d.git

# Subir los archivos a GitHub
git push -u origin main
```

---

## ☁️ Guía Paso a Paso para Desplegar en Hostinger

### Opción A: Despliegue Automático mediante Git (Recomendado en Hostinger hPanel)

1. Inicia sesión en el panel de control de **Hostinger (hPanel)**.
2. Ve a la sección **Avanzado** -> **Git**.
3. Selecciona **Crear un nuevo repositorio**:
   - **URL del repositorio:** `https://github.com/TU_USUARIO/adba-web-design-3d.git`
   - **Rama:** `main`
   - **Directorio de destino:** `public_html` (o subdominio).
4. Haz clic en **Crear**.
5. Haz clic en **Desplegar** para publicar tu sitio automáticamente. ¡Cada vez que hagas `git push`, podrás desplegar con un solo clic!

### Opción B: Carga Directa por Gestor de Archivos / FTP

1. En **hPanel**, entra a **Administrador de Archivos** -> `public_html`.
2. Sube todos los archivos y carpetas del proyecto (`index.html`, `paquetes.html`, `sitemap.xml`, `robots.txt`, `.htaccess`, `404.html`, carpetas `assets/` y `demos/`).
3. Asegúrate de incluir el archivo oculto `.htaccess` para activar la compresión Gzip y la caché del navegador.

---

## 🎯 Verificación SEO en Google Search Console

1. Inicia sesión en [Google Search Console](https://search.google.com/search-console).
2. Agrega la propiedad de tu dominio (ej. `https://adbadisenos.com`).
3. Ve a la pestaña **Sitemaps** y envía la URL del sitemap: `https://adbadisenos.com/sitemap.xml`.
4. Verifica la validez de los datos estructurados en la herramienta oficial [Prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results).

---

## 📞 Soporte & Contacto
- **WhatsApp:** [+52 55 7456 2812](https://wa.me/525574562812)
- **Ubicación:** Colonia Obrera, Cuauhtémoc, CDMX, México.
- **Horario:** Lunes a Viernes 11:00 a 18:30 hrs.
