# ⚡ TaskFlow Frontend

Interfaz web moderna para la gestión de proyectos y tareas. Desarrollada como proyecto final del módulo de React, utilizando **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4** y componentes reutilizables.

La aplicación consume directamente la API REST proporcionada para el proyecto y permite gestionar usuarios, proyectos y tareas mediante una interfaz web responsive.

---

## 🚀 Características Principales

### 🔐 Autenticación

* Registro de usuarios.
* Inicio de sesión.
* Autenticación mediante tokens JWT.
* Persistencia de sesión mediante `localStorage`.
* Protección de rutas privadas.
* Cierre de sesión.
* Manejo del usuario autenticado mediante Context API.

### 📁 Gestión de Proyectos

* Crear proyectos.
* Listar proyectos.
* Seleccionar un proyecto.
* Editar proyectos.
* Eliminar proyectos.
* Visualización del proyecto seleccionado.
* Estados de carga y error.

### 📋 Gestión de Tareas

* Crear tareas.
* Listar tareas asociadas al proyecto seleccionado.
* Editar tareas.
* Eliminar tareas.
* Marcar tareas como completadas.
* Marcar tareas como pendientes.
* Actualización dinámica de la interfaz después de cada operación.

### 📊 Dashboard

El dashboard concentra la gestión de proyectos y tareas en una sola interfaz.

Incluye:

* Resumen de tareas.
* Total de tareas.
* Tareas completadas.
* Tareas pendientes.
* Listado de proyectos.
* Listado de tareas.
* Estados vacíos.
* Estados de carga.
* Manejo de errores.
* Opción de actualizar información.

### 🎨 Diseño y experiencia de usuario

* Diseño moderno y responsive.
* Dark Theme.
* Componentes reutilizables.
* Iconos mediante Lucide React.
* Formularios mediante componentes de React.
* Modales para operaciones de creación y edición.
* Notificaciones mediante Sonner.
* Estados visuales para carga, errores y operaciones exitosas.

---

## 🛠️ Stack Tecnológico

| Tecnología              | Uso                                                  |
| :---------------------- | :--------------------------------------------------- |
| **React 19**            | Biblioteca principal para construir la interfaz.     |
| **TypeScript**          | Tipado estático y seguridad durante el desarrollo.   |
| **Vite**                | Entorno de desarrollo y empaquetado para producción. |
| **Tailwind CSS v4**     | Estilos y diseño responsive.                         |
| **React Router DOM**    | Gestión de rutas de la aplicación.                   |
| **Lucide React**        | Iconografía.                                         |
| **Sonner**              | Notificaciones Toast.                                |
| **Context API**         | Gestión global de autenticación.                     |
| **Fetch API**           | Comunicación con el backend REST.                    |
| **shadcn/ui / Base UI** | Componentes de interfaz reutilizables y accesibles.  |

---

## 📁 Estructura del Proyecto

```text
src/
├── assets/
│   └── # Recursos estáticos
│
├── components/
│   ├── common/
│   │   └── # Componentes comunes y protección de rutas
│   │
│   ├── projects/
│   │   ├── ProjectForm.tsx
│   │   └── ProjectItem.tsx
│   │
│   ├── tasks/
│   │   └── # Componentes relacionados con tareas
│   │
│   └── ui/
│       └── # Componentes reutilizables de interfaz
│
├── context/
│   ├── AuthContext.ts
│   └── AuthProvider.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useTasks.ts
│
├── layouts/
│   └── # Layouts de la aplicación
│
├── lib/
│   └── constants.ts
│
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
│
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── project.service.ts
│   └── task.service.ts
│
├── App.tsx
└── main.tsx
```

---

## ⚙️ Configuración del Entorno

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd taskflow-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

La variable `VITE_API_URL` corresponde a la URL base donde se encuentra ejecutándose la API backend.

---

## 💻 Instalación y Ejecución

### Desarrollo

Ejecutar:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

### Compilar para producción

```bash
npm run build
```

El resultado será generado en:

```text
dist/
```

### Previsualizar producción

```bash
npm run preview
```

### Verificar código

Si el proyecto tiene configurado ESLint:

```bash
npm run lint
```

---

## 🔗 Backend

La aplicación utiliza la API proporcionada para el proyecto:

**Project Task Flow API**

```text
https://github.com/javieronishi/project-task-flow-api
```

El backend proporciona los servicios de:

* Autenticación.
* Usuarios.
* Proyectos.
* Tareas.

---

# 🔌 Endpoints Consumidos

La aplicación consume los endpoints bajo la URL definida en:

```env
VITE_API_URL
```

## 🔐 Autenticación

### Registro

```http
POST /auth/register
```

Datos enviados:

```json
{
  "name": "Usuario",
  "email": "usuario@example.com",
  "password": "password"
}
```

### Inicio de sesión

```http
POST /auth/login
```

Datos enviados:

```json
{
  "email": "usuario@example.com",
  "password": "password"
}
```

El backend devuelve un token JWT y los datos básicos del usuario.

> La API utilizada no dispone de un endpoint `/auth/me`; la sesión se recupera mediante el token y los datos del usuario almacenados localmente.

---

# 📁 Proyectos

### Listar proyectos

```http
GET /projects
```

### Crear proyecto

```http
POST /projects
```

Ejemplo:

```json
{
  "name": "Sistema de ventas",
  "description": "Proyecto para administrar ventas"
}
```

### Obtener proyecto

```http
GET /projects/:id
```

### Actualizar proyecto

```http
PUT /projects/:id
```

### Eliminar proyecto

```http
DELETE /projects/:id
```

---

# 📋 Tareas

Las tareas pertenecen a un proyecto, por lo que las operaciones utilizan el identificador del proyecto.

### Listar tareas

```http
GET /tasks/:projectId
```

### Crear tarea

```http
POST /tasks/:projectId
```

Ejemplo:

```json
{
  "title": "Crear formulario",
  "description": "Desarrollar formulario de registro"
}
```

### Actualizar tarea

```http
PATCH /tasks/:projectId
```

El identificador de la tarea se envía en el cuerpo:

```json
{
  "id": "task-id",
  "title": "Formulario actualizado",
  "description": "Nueva descripción"
}
```

### Marcar como completada

```http
PATCH /tasks/:projectId/complete
```

Body:

```json
{
  "id": "task-id"
}
```

### Marcar como pendiente

```http
PATCH /tasks/:projectId/pending
```

Body:

```json
{
  "id": "task-id"
}
```

### Eliminar tarea

```http
DELETE /tasks/:projectId
```

Body:

```json
{
  "id": "task-id"
}
```

---

# 🧠 Conceptos de React Aplicados

El proyecto implementa los conceptos solicitados en la evaluación.

## Componentes funcionales

La interfaz está construida utilizando componentes funcionales de React.

Ejemplos:

```text
DashboardPage
ProjectForm
ProjectItem
AuthProvider
```

## Props

Los componentes reciben información y funciones mediante props.

Por ejemplo:

```tsx
<ProjectItem
  project={project}
  selected={selected}
  onSelect={handleSelectProject}
  onEdit={handleEditProject}
  onDelete={handleDeleteProject}
/>
```

## useState

Se utiliza para controlar estados como:

* Usuario.
* Token.
* Proyectos.
* Tareas.
* Proyecto seleccionado.
* Formularios.
* Loading.
* Errores.

## useEffect

Se utiliza principalmente para:

* Recuperar la sesión.
* Cargar proyectos.
* Cargar tareas cuando cambia el proyecto seleccionado.

## Context API

La autenticación global se implementa mediante:

```text
AuthContext
AuthProvider
useAuth
```

Esto permite compartir el estado de autenticación entre diferentes componentes.

## Formularios

Se implementaron formularios para:

* Registro.
* Login.
* Creación de proyectos.
* Edición de proyectos.
* Creación de tareas.
* Edición de tareas.

## Consumo de APIs

La comunicación con el backend se centraliza mediante:

```text
src/services/api.ts
```

Los servicios específicos son:

```text
auth.service.ts
project.service.ts
task.service.ts
```

El token JWT se agrega automáticamente a las solicitudes protegidas.

## Renderizado condicional

La aplicación muestra diferentes contenidos dependiendo del estado:

* Cargando.
* Error.
* Sin proyectos.
* Sin tareas.
* Proyecto seleccionado.
* Tarea completada.
* Tarea pendiente.

## Manejo de errores

Las operaciones contra la API cuentan con manejo de errores y mensajes visuales para el usuario.

---

# ✅ Requisitos de la Evaluación

| Requisito                | Implementado |
| :----------------------- | :----------: |
| Registro de usuarios     |       ✅      |
| Inicio de sesión         |       ✅      |
| Autenticación JWT        |       ✅      |
| Dashboard                |       ✅      |
| Crear proyectos          |       ✅      |
| Listar proyectos         |       ✅      |
| Editar proyectos         |       ✅      |
| Eliminar proyectos       |       ✅      |
| Crear tareas             |       ✅      |
| Listar tareas            |       ✅      |
| Editar tareas            |       ✅      |
| Eliminar tareas          |       ✅      |
| Cambiar estado de tareas |       ✅      |
| Consumo directo de API   |       ✅      |
| Componentes funcionales  |       ✅      |
| Props                    |       ✅      |
| useState                 |       ✅      |
| useEffect                |       ✅      |
| Context API              |       ✅      |
| Formularios              |       ✅      |
| Renderizado condicional  |       ✅      |
| Loading states           |       ✅      |
| Error states             |       ✅      |

---

# 🔄 Flujo de la Aplicación

```text
                    ┌──────────────────┐
                    │      Usuario     │
                    └────────┬─────────┘
                             │
                    Registro / Login
                             │
                             ▼
                    ┌──────────────────┐
                    │    API Backend   │
                    └────────┬─────────┘
                             │
                          JWT Token
                             │
                             ▼
                    ┌──────────────────┐
                    │    Dashboard     │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌───────────────┐
        │   Proyectos   │         │     Tareas    │
        └───────┬───────┘         └───────┬───────┘
                │                         │
        ┌───────┼───────┐         ┌───────┼───────┐
        ▼       ▼       ▼         ▼       ▼       ▼
      Crear   Editar  Eliminar   Crear   Editar  Eliminar
                                      │
                                      ▼
                              Cambiar estado
```

---

# 🧪 Validación

Antes de realizar la entrega se recomienda verificar:

```bash
npm run build
```

El proyecto debe compilar correctamente sin errores.

También se debe comprobar:

* Registro de usuario.
* Inicio de sesión.
* Persistencia de sesión.
* Creación de proyectos.
* Edición de proyectos.
* Eliminación de proyectos.
* Creación de tareas.
* Edición de tareas.
* Eliminación de tareas.
* Cambio entre pendiente y completada.
* Manejo de errores.
* Cierre de sesión.

---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos como evaluación final del módulo de React.
