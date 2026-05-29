# Clear UNAB

Portal web universitario de la Universidad Autónoma de Bucaramanga (UNAB) que centraliza información institucional, eventos académicos y acceso a servicios digitales para estudiantes y egresados.

---

## Descripción

Clear UNAB es un sitio web estático desarrollado con HTML, CSS y JavaScript vanilla. Actúa como hub digital institucional con páginas dedicadas a eventos universitarios, sección de egresados destacados, formulario de contacto y sistema de autenticación de usuarios con persistencia en base de datos SQLite.

---

## Qué hace el proyecto

- Presenta la página principal de la universidad con carrusel de contenido y enlaces a redes sociales.
- Muestra páginas dedicadas a eventos institucionales: UNAB Fest, Ulibro, Semana de Ingeniería, Ingeniotic y Vacaciones.
- Lista egresados destacados de la institución.
- Permite a los usuarios iniciar sesión y acceder a su perfil personal.
- Gestiona usuarios registrados mediante una base de datos SQLite local.

---

## Páginas del sitio

| Archivo | Descripción |
|---|---|
| `index.html` | Página de inicio con carrusel y navegación principal |
| `egresados.html` | Sección de egresados destacados |
| `unabfest.html` | Información del evento UNAB Fest |
| `ulibro.html` | Información del evento Ulibro |
| `semanaingenieria.html` | Semana de Ingeniería |
| `ingeniotic.html` | Evento Ingeniotic |
| `vacaciones.html` | Programas de vacaciones |
| `contacto.html` | Formulario de contacto |
| `login.html` | Inicio de sesión |
| `userpage.html` | Página de perfil del usuario autenticado |

---

## Tecnologías utilizadas

| Tecnología | Porcentaje | Uso |
|---|---|---|
| HTML5 | 38.7% | Estructura y contenido de las páginas |
| CSS3 | 31.6% | Estilos, diseño responsive y temas visuales |
| JavaScript | 29.7% | Interactividad, carrusel y validaciones |
| SQLite | — | Persistencia de datos de usuarios (`users.db`) |
| Google Fonts | — | Tipografía (Open Sans) |

No utiliza frameworks externos. Todo el frontend está desarrollado con tecnologías web nativas.

---

## Requisitos previos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor local para servir los archivos (requerido para funcionalidades con base de datos)

Opciones recomendadas para servidor local:
- **Python** (incluido en la mayoría de sistemas)
- **Live Server** (extensión de VS Code)

---

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/andresgommz/disenoux-clearunab.git
cd disenoux-clearunab
```

---

## Cómo ejecutar

**Con Python:**

```bash
# Python 3
python -m http.server 8000
```

Luego abre tu navegador en:

```
http://localhost:8000/templates/index.html
```

**Con Live Server (VS Code):**

1. Instala la extensión **Live Server** en VS Code.
2. Haz clic derecho sobre `templates/index.html`.
3. Selecciona **Open with Live Server**.

---

## Estructura de archivos

```
disenoux-clearunab/
├── templates/
│   ├── index.html              # Página de inicio
│   ├── egresados.html          # Egresados destacados
│   ├── login.html              # Inicio de sesión
│   ├── userpage.html           # Perfil del usuario
│   ├── contacto.html           # Contacto
│   ├── unabfest.html           # Evento UNAB Fest
│   ├── ulibro.html             # Evento Ulibro
│   ├── semanaingenieria.html   # Semana de Ingeniería
│   ├── ingeniotic.html         # Evento Ingeniotic
│   └── vacaciones.html         # Vacaciones
├── static/
│   ├── css/                    # Hojas de estilo por página
│   ├── js/                     # Scripts de interactividad
│   └── img/                    # Imágenes y recursos visuales
└── data/
    └── users.db                # Base de datos SQLite de usuarios
```

---

## Posibles errores comunes

| Error | Causa | Solución |
|---|---|---|
| Página en blanco o sin estilos | Rutas relativas rotas al abrir el HTML directamente | Usar un servidor local en lugar de abrir el archivo directamente en el navegador |
| La base de datos no responde | `users.db` requiere un backend para operar | Verificar que el servidor esté activo y tenga permisos de lectura sobre la carpeta `data/` |
| Imágenes no cargan | Rutas incorrectas hacia `static/img/` | Asegurarse de lanzar el servidor desde la raíz del proyecto |

---

<div align="center">

Proyecto de <strong>Diseño UX</strong> · Universidad Autónoma de Bucaramanga

</div>
```
