# TwitBet — Frontend

Aplicación web frontend de **TwitBet**, la plataforma de ligas privadas de apuestas deportivas (predicciones). Permite crear ligas entre amigos, definir mercados y cuotas en tiempo real, apostar con saldo virtual en soles (S/.), participar en el ranking y administrar la liga. Este repositorio contiene únicamente el frontend; el backend es un servicio separado.

## Stack

- **React 19** + **TypeScript** (React Compiler habilitado)
- **Vite 8** como bundler y dev server
- **Tailwind CSS 4** + **shadcn/ui** (Radix UI)
- **React Router 7** (enrutamiento)
- **TanStack React Query 5** (estado del servidor / caché)
- **Zustand** (estado global: autenticación, tema)
- **Axios** (cliente HTTP)
- **React Hook Form + Zod** (formularios y validación)
- **date-fns** (manejo de fechas)
- **sonner** (notificaciones / toasts)
- **lucide-react** (iconos)

## Requisitos

- Node.js 20+ (proyecto tipado con TypeScript 6)
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_API_URL=https://tu-backend.com/api
```

| Variable         | Descripción                        |
| ---------------- | ---------------------------------- |
| `VITE_API_URL`   | URL base de la API del backend.    |

La autenticación se maneja con un token JWT guardado en la cookie `twitbet_token`, enviado automáticamente como `Authorization: Bearer <token>` por el interceptor de Axios (`src/lib/axios.ts`).

## Scripts

| Comando             | Descripción                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Levanta el servidor de desarrollo (Vite).               |
| `npm run build`     | Type-check (`tsc -b`) y build de producción (`vite build`). |
| `npm run preview`   | Previsualiza el build de producción localmente.         |
| `npm run lint`      | Ejecuta ESLint sobre el proyecto.                       |

## Rutas

| Ruta                 | Descripción                                   | Acceso      |
| -------------------- | --------------------------------------------- | ----------- |
| `/`                  | Landing page.                                 | Público     |
| `/auth`              | Login / registro / verificación / recuperar contraseña. | Público |
| `/profile`           | Perfil y ligas del usuario.                   | Autenticado |
| `/leagues/create`    | Crear una liga privada.                       | Autenticado |
| `/leagues/:slug`     | Detalle de la liga (ranking, partidos, mercados, apuestas). | Autenticado |
| `/leagues/:slug/live`| Consola en vivo (edición de cuotas y mercados). | Owner o **admin** de la liga |
| `/matches/:slug`     | Detalle de un partido y sus mercados.         | Autenticado |

## Estructura

```
src/
├─ components/
│  ├─ layout/          # Navbar, rutas protegidas
│  ├─ shared/          # Componentes reutilizables (UserAvatar)
│  └─ ui/              # shadcn/ui (button, dialog, card, tabs, …)
├─ features/
│  ├─ auth/            # Login, registro, tipos y API de autenticación
│  ├─ league/          # Ligas: API, tipos, esquemas y componentes
│  │  ├─ api/          # league.api.ts
│  │  ├─ components/   # Modales, cards, secciones, bet ticket, …
│  │  ├─ schemas/      # Validación Zod
│  │  ├─ types/        # Tipos de dominio
│  │  └─ utils/        # mappers de estado/cuotas
│  └─ profile/         # Edición de perfil, avatar, contraseña
├─ hooks/              # useLiveMarkets (WebSocket)
├─ lib/                # axios, date (formato dd/mm/yyyy), cn
├─ pages/              # Rutas de primer nivel
├─ routes/             # AppRouter
└─ store/              # Zustand: useAuthStore, useThemeStore
```

## Funcionalidades principales

- **Autenticación completa**: registro con código OTP, inicio de sesión, recuperación de contraseña y edición de perfil.
- **Ligas privadas**: creación con código de invitación, saldo inicial y configuraciones (ocultar ranking, mín. de apuestas para clasificar).
- **Roles**: `OWNER`, `ADMIN` y `MEMBER`. Los admins gestionan mercados, cuotas, partidos y bonos, y acceden a la **Consola en Vivo**.
- **Apuestas**: apostar con saldo virtual (S/.), cashout, historial con filtros por fecha/estado, y bonos.
- **Cuotas en vivo**: actualización de cuotas en tiempo real vía WebSocket (`useLiveMarkets`).
- **Ranking**: posiciones, elegibilidad según mín. de apuestas y ocultamiento opcional.

## Notas

- El formato de moneda es **soles peruanos (S/.)** y las fechas mostradas se formatean en `dd/mm/yyyy` de forma determinista y sin depender del idioma del navegador (`src/lib/date.ts`).
- Para producción en Vercel, `vercel.json` reescribe todas las rutas a `/index.html` (SPA).