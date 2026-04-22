# Proyecto Integrador: Parcial 1 - Fullstack (FastAPI + React)

Hecho por:
- Jeremías Bontorno
- Luciano Mas
- Valentino Vernier

Este proyecto cumple con todos los requisitos arquitectónicos y funcionales para el **Primer Parcial** para la materia Programación 4 de la Tecnicatura Universitaria en Programación.

## 🚀 Requisitos Funcionales Cumplidos
- **Backend (FastAPI + SQLModel)**: Relaciones N:M implementadas con `Relationship` y `link_model`, "Eager Loading" con `selectinload` para solucionar el problema N+1, y uso de Unit of Work. Reglas de negocio protegidas con Pydantic `Field`, `Annotated`, `Query` y `Path`.
- **Borrado Lógico (Soft Delete)**: Las entidades no se eliminan físicamente de la base de datos, sino que se marcan como inactivas (`is_active = False`) para mantener la integridad del historial en las tablas relacionales.
- **Frontend (React + Vite + TS)**: Interfaces totalmente tipadas. Manejo de estado de servidor profesional usando **TanStack Query** (`useQuery` y `useMutation`). Formularios encapsulados en componentes **Modal** modulares y gestionados mediante un **Custom Hook** (`useForm`).
- **Diseño Responsivo**: Maquetado Utility-First con **Tailwind CSS v4**.

---

## ⚙️ Configuración e Inicialización

### 1. Base de Datos (PostgreSQL)
1. Abre **pgAdmin** o tu consola de PostgreSQL local.
2. Crea una nueva base de datos llamada exactamente **`parcial_db`**.
3. *Nota:* Si tu usuario local no es `postgres` con contraseña `postgres`, actualiza la cadena de conexión en el archivo `backend/database.py`.

### 2. Levantar el Backend (API)
Abre una terminal en la carpeta raíz del proyecto (`Parcial 1`) y ejecuta:

```bash
# Entrar a la carpeta del backend y activar el entorno virtual
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # (En Mac/Linux: source .venv/bin/activate)

# Instalar dependencias
pip install -r requirements.txt

# VOLVER a la carpeta raíz (Parcial 1) para ejecutar la app
cd ..
uvicorn backend.main:app --reload
```
> La API estará disponible en: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Levantar el Frontend (Interfaz)
Abre una **segunda terminal** en la carpeta del frontend y ejecuta:

```bash
cd frontend
npm install
npm run dev
```
> La aplicación web estará disponible en: [http://localhost:5173/](http://localhost:5173/)

---