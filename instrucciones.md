# ePortfolio — Arquitectura FAUG UdeC
## Guía completa de implementación (Next.js + CSS)

---

## 1. REQUISITOS PREVIOS

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 18+** → https://nodejs.org
- **Git** → https://git-scm.com
- **VS Code** (recomendado) → https://code.visualstudio.com
- **Cuenta en Vercel** → https://vercel.com (login con GitHub)
- **Cuenta en Neon** → https://neon.tech (PostgreSQL gratis)
- **Cuenta en Cloudinary** → https://cloudinary.com (storage multimedia gratis)

---

## 2. CREAR EL PROYECTO

```bash
npx create-next-app@latest eportfolio --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*"

cd eportfolio
```

---

## 3. INSTALAR DEPENDENCIAS

### 3.1 Base de datos y ORM

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

### 3.2 Autenticación (login admin)

```bash
npm install next-auth@beta
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 3.3 Storage de archivos multimedia

```bash
npm install cloudinary
npm install next-cloudinary
```

### 3.4 Editor de texto enriquecido (para el panel admin)

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-youtube @tiptap/pm
```

### 3.5 Utilidades

```bash
npm install slugify
npm install date-fns
npm install react-icons
npm install framer-motion
npm install react-hot-toast
npm install zod
```

### 3.6 Todo en un solo comando

```bash
npm install @prisma/client next-auth@beta bcryptjs cloudinary next-cloudinary @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-youtube @tiptap/pm slugify date-fns react-icons framer-motion react-hot-toast zod

npm install --save-dev prisma @types/bcryptjs
```

---

## 4. VARIABLES DE ENTORNO

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos (obtener de Neon Dashboard)
DATABASE_URL="postgresql://usuario:password@host/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (obtener de Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Credenciales admin (tú defines estos valores)
ADMIN_EMAIL="tu-correo@udec.cl"
ADMIN_PASSWORD="tu-password-seguro"
```

Para generar el NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

---

## 5. ESQUEMA DE BASE DE DATOS (Prisma)

Reemplazar el contenido de `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// PERFIL DEL AUTOR (Sección "Sobre mí")
// ============================================
model Perfil {
  id                String   @id @default(cuid())
  nombre            String
  nivelFormacion    String   @map("nivel_formacion")
  edad              Int?
  intereses         String?  @db.Text
  gustos            String?  @db.Text
  datosRelevantes   String?  @map("datos_relevantes") @db.Text
  fotoUrl           String?  @map("foto_url")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("perfiles")
}

// ============================================
// INTRODUCCIÓN (Sentido del portfolio)
// ============================================
model Introduccion {
  id                    String   @id @default(cuid())
  sentidoPortfolio      String   @map("sentido_portfolio") @db.Text
  objetivos             String   @db.Text
  experienciasPrevias   String?  @map("experiencias_previas") @db.Text
  expectativas          String?  @db.Text
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  @@map("introducciones")
}

// ============================================
// ASIGNATURA
// ============================================
model Asignatura {
  id              String   @id @default(cuid())
  nombre          String
  programa        String?  @db.Text
  planificacion   String?  @db.Text
  normas          String?  @db.Text
  otros           String?  @db.Text
  archivoUrl      String?  @map("archivo_url")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("asignaturas")
}

// ============================================
// EVIDENCIAS (Entradas semanales — el núcleo)
// ============================================
model Evidencia {
  id              String   @id @default(cuid())
  titulo          String
  slug            String   @unique
  semana          Int
  fecha           DateTime
  contenido       String   @db.Text
  objetivo        String?  @db.Text
  proposito       String?  @db.Text
  reflexion       String?  @db.Text
  otros           String?  @db.Text
  publicada       Boolean  @default(false)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  medios          Medio[]
  comentarios     Comentario[]
  etiquetas       Etiqueta[]

  @@map("evidencias")
}

// ============================================
// MEDIOS (Archivos multimedia)
// ============================================
model Medio {
  id            String     @id @default(cuid())
  url           String
  tipo          TipoMedio
  descripcion   String?
  evidenciaId   String     @map("evidencia_id")
  evidencia     Evidencia  @relation(fields: [evidenciaId], references: [id], onDelete: Cascade)
  createdAt     DateTime   @default(now()) @map("created_at")

  @@map("medios")
}

enum TipoMedio {
  IMAGEN
  VIDEO
  AUDIO
  DOCUMENTO
  LINK
  OTRO
}

// ============================================
// COMENTARIOS (alumnos/profesores)
// ============================================
model Comentario {
  id            String      @id @default(cuid())
  autor         String
  contenido     String      @db.Text
  esProfesor    Boolean     @default(false) @map("es_profesor")
  evidenciaId   String?     @map("evidencia_id")
  evidencia     Evidencia?  @relation(fields: [evidenciaId], references: [id], onDelete: Cascade)
  evaluacionId  String?     @map("evaluacion_id")
  evaluacion    Evaluacion? @relation(fields: [evaluacionId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now()) @map("created_at")

  @@map("comentarios")
}

// ============================================
// ETIQUETAS
// ============================================
model Etiqueta {
  id            String      @id @default(cuid())
  nombre        String      @unique
  evidencias    Evidencia[]

  @@map("etiquetas")
}

// ============================================
// EVALUACIÓN
// ============================================
model Evaluacion {
  id              String   @id @default(cuid())
  titulo          String
  slug            String   @unique
  antecedentes    String?  @db.Text
  criterios       String?  @db.Text
  escalas         String?  @db.Text
  metodologia     String?  @db.Text
  calificacion    Float?
  reflexion       String?  @db.Text
  otros           String?  @db.Text
  fecha           DateTime
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  comentarios     Comentario[]

  @@map("evaluaciones")
}

// ============================================
// REFLEXIONES
// ============================================
model Reflexion {
  id          String        @id @default(cuid())
  titulo      String
  slug        String        @unique
  contenido   String        @db.Text
  tipo        TipoReflexion
  fecha       DateTime
  publicada   Boolean       @default(false)
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@map("reflexiones")
}

enum TipoReflexion {
  PROYECTO
  EVALUACION
  PORTFOLIO
  FINAL
}
```

### Migrar la base de datos:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 6. ESTRUCTURA DE CARPETAS

```
eportfolio/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx                       # Layout global (nav + footer)
│   │   ├── page.tsx                         # Landing / Home
│   │   ├── globals.css                      # Variables CSS globales
│   │   │
│   │   ├── sobre-mi/
│   │   │   └── page.tsx                     # Perfil del autor
│   │   │
│   │   ├── introduccion/
│   │   │   └── page.tsx                     # Sentido, objetivos, expectativas
│   │   │
│   │   ├── asignatura/
│   │   │   └── page.tsx                     # Programa, planificación, normas
│   │   │
│   │   ├── evidencias/
│   │   │   ├── page.tsx                     # Timeline/grid de evidencias
│   │   │   └── [slug]/
│   │   │       └── page.tsx                 # Detalle de evidencia individual
│   │   │
│   │   ├── evaluacion/
│   │   │   ├── page.tsx                     # Lista de evaluaciones
│   │   │   └── [slug]/
│   │   │       └── page.tsx                 # Detalle evaluación
│   │   │
│   │   ├── reflexiones/
│   │   │   ├── page.tsx                     # Lista de reflexiones
│   │   │   └── [slug]/
│   │   │       └── page.tsx                 # Reflexión individual
│   │   │
│   │   ├── archivo/
│   │   │   └── page.tsx                     # Archivo del blog (por fecha/semana)
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx                   # Layout admin (sidebar + protección)
│   │   │   ├── page.tsx                     # Dashboard admin
│   │   │   ├── login/
│   │   │   │   └── page.tsx                 # Formulario login
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx                 # Editar perfil
│   │   │   ├── introduccion/
│   │   │   │   └── page.tsx                 # Editar introducción
│   │   │   ├── asignatura/
│   │   │   │   └── page.tsx                 # Editar info asignatura
│   │   │   ├── evidencias/
│   │   │   │   ├── page.tsx                 # Lista CRUD evidencias
│   │   │   │   ├── nueva/
│   │   │   │   │   └── page.tsx             # Crear nueva evidencia
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Editar evidencia
│   │   │   ├── evaluaciones/
│   │   │   │   ├── page.tsx                 # Lista CRUD evaluaciones
│   │   │   │   ├── nueva/
│   │   │   │   │   └── page.tsx             # Crear evaluación
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Editar evaluación
│   │   │   └── reflexiones/
│   │   │       ├── page.tsx                 # Lista CRUD reflexiones
│   │   │       ├── nueva/
│   │   │       │   └── page.tsx             # Crear reflexión
│   │   │       └── [id]/
│   │   │           └── page.tsx             # Editar reflexión
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts             # NextAuth handler
│   │       ├── perfil/
│   │       │   └── route.ts                 # GET / PUT
│   │       ├── introduccion/
│   │       │   └── route.ts                 # GET / PUT
│   │       ├── asignatura/
│   │       │   └── route.ts                 # GET / PUT
│   │       ├── evidencias/
│   │       │   ├── route.ts                 # GET (list) / POST
│   │       │   └── [id]/
│   │       │       └── route.ts             # GET / PUT / DELETE
│   │       ├── evaluaciones/
│   │       │   ├── route.ts                 # GET / POST
│   │       │   └── [id]/
│   │       │       └── route.ts             # GET / PUT / DELETE
│   │       ├── reflexiones/
│   │       │   ├── route.ts                 # GET / POST
│   │       │   └── [id]/
│   │       │       └── route.ts             # GET / PUT / DELETE
│   │       ├── comentarios/
│   │       │   ├── route.ts                 # GET / POST
│   │       │   └── [id]/
│   │       │       └── route.ts             # DELETE
│   │       └── upload/
│   │           └── route.ts                 # POST — subir a Cloudinary
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Navbar.module.css
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.module.css
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminSidebar.module.css
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Input.tsx
│   │   │   ├── Input.module.css
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Card.module.css
│   │   │   ├── Badge.tsx
│   │   │   └── Loader.tsx
│   │   │
│   │   ├── editor/
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── RichTextEditor.module.css
│   │   │   ├── Toolbar.tsx
│   │   │   └── MediaUploader.tsx
│   │   │
│   │   ├── evidencias/
│   │   │   ├── EvidenciaCard.tsx
│   │   │   ├── EvidenciaTimeline.tsx
│   │   │   ├── MediaGallery.tsx
│   │   │   └── ComentarioForm.tsx
│   │   │
│   │   └── admin/
│   │       ├── EvidenciaForm.tsx
│   │       ├── EvaluacionForm.tsx
│   │       ├── ReflexionForm.tsx
│   │       ├── PerfilForm.tsx
│   │       └── StatsCard.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts                        # Singleton Prisma Client
│   │   ├── auth.ts                          # Configuración NextAuth
│   │   ├── cloudinary.ts                    # Config Cloudinary
│   │   ├── utils.ts                         # Helpers
│   │   └── validations.ts                   # Esquemas Zod
│   │
│   └── types/
│       └── index.ts                         # TypeScript types
│
├── .env
├── .env.example
├── .gitignore
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 7. ARCHIVOS BASE A IMPLEMENTAR

### 7.1 Prisma Client Singleton

**`src/lib/prisma.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 7.2 Configuración NextAuth

**`src/lib/auth.ts`**

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const isValidEmail = credentials.email === process.env.ADMIN_EMAIL;
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
        const isValidPassword = await bcrypt.compare(credentials.password, hashedPassword);

        if (isValidEmail && isValidPassword) {
          return { id: "1", email: process.env.ADMIN_EMAIL, name: "Admin" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
};
```

### 7.3 API Auth Route

**`src/app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 7.4 Cloudinary Config

**`src/lib/cloudinary.ts`**

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### 7.5 Upload API Route

**`src/app/api/upload/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "eportfolio", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return NextResponse.json(result);
}
```

### 7.6 Utilidades

**`src/lib/utils.ts`**

```typescript
import slugifyLib from "slugify";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: "es" });
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export function getSemanaActual(fechaInicio: Date = new Date("2026-03-09")): number {
  const hoy = new Date();
  const diff = hoy.getTime() - fechaInicio.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}
```

### 7.7 Validaciones Zod

**`src/lib/validations.ts`**

```typescript
import { z } from "zod";

export const evidenciaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  semana: z.number().int().min(1).max(20),
  fecha: z.string().datetime(),
  contenido: z.string().min(10, "El contenido es muy corto"),
  objetivo: z.string().optional(),
  proposito: z.string().optional(),
  reflexion: z.string().optional(),
  otros: z.string().optional(),
  publicada: z.boolean().default(false),
});

export const evaluacionSchema = z.object({
  titulo: z.string().min(3),
  antecedentes: z.string().optional(),
  criterios: z.string().optional(),
  escalas: z.string().optional(),
  metodologia: z.string().optional(),
  calificacion: z.number().min(1).max(7).optional(),
  reflexion: z.string().optional(),
  otros: z.string().optional(),
  fecha: z.string().datetime(),
});

export const reflexionSchema = z.object({
  titulo: z.string().min(3),
  contenido: z.string().min(10),
  tipo: z.enum(["PROYECTO", "EVALUACION", "PORTFOLIO", "FINAL"]),
  fecha: z.string().datetime(),
  publicada: z.boolean().default(false),
});

export const comentarioSchema = z.object({
  autor: z.string().min(2),
  contenido: z.string().min(5),
  esProfesor: z.boolean().default(false),
  evidenciaId: z.string().optional(),
  evaluacionId: z.string().optional(),
});

export const perfilSchema = z.object({
  nombre: z.string().min(2),
  nivelFormacion: z.string().min(2),
  edad: z.number().int().optional(),
  intereses: z.string().optional(),
  gustos: z.string().optional(),
  datosRelevantes: z.string().optional(),
  fotoUrl: z.string().url().optional(),
});
```

---

## 8. CSS GLOBAL — ESTÉTICA ARQUITECTÓNICA

**`src/app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

:root {
  /* Tipografía */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;

  /* Paleta arquitectónica: concreto, acero, papel */
  --color-bg: #F5F2ED;
  --color-bg-alt: #EDEAE4;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-secondary: #6B6560;
  --color-text-muted: #9E9891;
  --color-accent: #2D2D2D;
  --color-accent-hover: #1A1A1A;
  --color-border: #D4CFC7;
  --color-border-light: #E8E4DD;
  --color-highlight: #C5A880;          /* Bronce/latón — acento cálido */
  --color-error: #B44D4D;
  --color-success: #4D7C5F;

  /* Espaciado */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 8rem;

  /* Layout */
  --max-width: 1200px;
  --nav-height: 72px;
  --sidebar-width: 280px;

  /* Transiciones */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.08);
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg: #141414;
  --color-bg-alt: #1C1C1C;
  --color-surface: #222222;
  --color-text: #E8E4DD;
  --color-text-secondary: #A09B94;
  --color-text-muted: #6B6560;
  --color-border: #333333;
  --color-border-light: #2A2A2A;
  --color-highlight: #D4A960;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

a:hover {
  color: var(--color-highlight);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

::selection {
  background-color: var(--color-highlight);
  color: var(--color-surface);
}
```

---

## 9. PÁGINAS PÚBLICAS — QUÉ DEBE CONTENER CADA UNA

### 9.1 HOME (`/`)

Landing page. Transmite identidad arquitectónica.

- Hero con nombre del estudiante y subtítulo (carrera, universidad)
- Foto de fondo o composición visual
- Navegación a las secciones principales
- Últimas 3 evidencias (preview cards)
- Contador de semana actual del semestre

### 9.2 SOBRE MÍ (`/sobre-mi`)

Mapea a: **"Identificación del autor"**

Campos visibles (editables desde admin):
- Nombre completo
- Nivel de formación (año, carrera)
- Edad
- Intereses y gustos
- Otros datos relevantes
- Foto del autor

### 9.3 INTRODUCCIÓN (`/introduccion`)

Mapea a: **"Introducción (sentido otorgado al portfolio)"**

Campos:
- Sentido otorgado al portfolio (texto extenso)
- Objetivos del eportfolio para el autor
- Experiencias previas de aprendizaje
- Expectativas (objetivos de aprendizaje con el eportfolio)

### 9.4 ASIGNATURA (`/asignatura`)

Mapea a: **"Información asignatura(s) involucrada(s)"**

Campos:
- Nombre de la asignatura
- Programa (texto o PDF descargable)
- Planificación
- Normas para su desarrollo
- Otros

### 9.5 EVIDENCIAS (`/evidencias` y `/evidencias/[slug]`)

Mapea a: **"Mis evidencias"** — Es la sección más importante.

**Vista lista** (`/evidencias`):
- Timeline vertical cronológico (semana 1 → 17+)
- Cada card muestra: título, fecha, semana, preview imagen, extracto
- Filtro por semana, etiqueta, fecha
- Indicador visual de semana actual

**Vista detalle** (`/evidencias/[slug]`):
- Título + fecha + número de semana
- Contenido rich text (HTML renderizado)
- Galería multimedia (imágenes, videos, audio)
- Sección "Objetivo de esta evidencia"
- Sección "Propósito"
- Sección "Reflexión"
- Comentarios (abiertos — alumnos y profesores)
- Navegación anterior/siguiente evidencia

### 9.6 EVALUACIÓN (`/evaluacion` y `/evaluacion/[slug]`)

Mapea a: **"Evaluación"**

**Vista lista**: Cards con cada evaluación + calificación visible

**Vista detalle**:
- Antecedentes de la evaluación
- Criterios utilizados
- Escalas
- Metodología
- Calificación obtenida
- Comentarios de profesores/alumnos
- Reflexión sobre la evaluación recibida
- Otros

### 9.7 REFLEXIONES (`/reflexiones` y `/reflexiones/[slug]`)

Mapea a: **"Reflexiones sobre mi proceso de aprendizaje"**

Tipos filtrables:
- Sobre mis proyectos (`PROYECTO`)
- Sobre mis evaluaciones (`EVALUACION`)
- Sobre mi portfolio (`PORTFOLIO`)
- Reflexión final de semestre (`FINAL`)

Cada una tiene: título, fecha, contenido extenso, tipo

### 9.8 ARCHIVO (`/archivo`)

Requisito del documento: *"el blog deberá disponer visible el archivo del blog y las fechas para cada entrada"*

- Vista calendario o listado por mes/semana
- Muestra TODAS las entradas ordenadas cronológicamente
- Agrupadas por semana con fechas visibles

---

## 10. PANEL DE ADMINISTRACIÓN

### 10.1 Login (`/admin/login`)

- Formulario email + password
- NextAuth credentials provider
- Redirige a `/admin` al autenticar
- Manejo de errores

### 10.2 Dashboard (`/admin`)

- Total evidencias creadas vs. esperadas (17)
- Evidencias por semana (indicador visual)
- Comentarios recientes
- Reflexiones pendientes
- Semana actual del semestre
- Accesos directos a crear contenido

### 10.3 Protección de rutas admin

**`src/app/admin/layout.tsx`**:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
    </div>
  );
}
```

### 10.4 Navegación Sidebar Admin

```
📊  Dashboard
👤  Mi Perfil (editar sobre mí)
📝  Introducción (editar)
📚  Asignatura (editar)
📸  Evidencias
    ├── Listado
    └── + Nueva evidencia
📊  Evaluaciones
    ├── Listado
    └── + Nueva evaluación
💭  Reflexiones
    ├── Listado
    └── + Nueva reflexión
💬  Comentarios (moderar)
─────────────────────────
🔗  Ver sitio público
🚪  Cerrar sesión
```

### 10.5 Formularios Admin

Cada sección editable del panel debe tener:
- Formulario con todos los campos del modelo Prisma
- Editor TipTap para campos de texto extenso
- MediaUploader (drag & drop → Cloudinary) para imágenes/archivos
- Validación con Zod antes de enviar
- Toast de confirmación al guardar
- Estado de carga (loading/spinner)

---

## 11. API ROUTES — PATRÓN GENERAL

Ejemplo completo para evidencias (replicar para las demás secciones):

**`src/app/api/evidencias/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evidenciaSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET — listar evidencias (público)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const semana = searchParams.get("semana");

  const evidencias = await prisma.evidencia.findMany({
    where: {
      publicada: true,
      ...(semana ? { semana: parseInt(semana) } : {}),
    },
    include: { medios: true, etiquetas: true },
    orderBy: { fecha: "desc" },
  });

  return NextResponse.json(evidencias);
}

// POST — crear evidencia (protegido)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const validation = evidenciaSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const data = validation.data;
  const evidencia = await prisma.evidencia.create({
    data: { ...data, slug: slugify(data.titulo), fecha: new Date(data.fecha) },
  });

  return NextResponse.json(evidencia, { status: 201 });
}
```

**`src/app/api/evidencias/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const evidencia = await prisma.evidencia.findUnique({
    where: { id: params.id },
    include: { medios: true, comentarios: true, etiquetas: true },
  });
  if (!evidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(evidencia);
}

// PUT — actualizar (protegido)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const evidencia = await prisma.evidencia.update({ where: { id: params.id }, data: body });
  return NextResponse.json(evidencia);
}

// DELETE (protegido)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.evidencia.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Eliminada" });
}
```

**Replicar este mismo patrón** para: `/api/evaluaciones`, `/api/reflexiones`, `/api/perfil`, `/api/introduccion`, `/api/asignatura`, `/api/comentarios`.

---

## 12. EDITOR RICH TEXT (TipTap)

**`src/components/editor/RichTextEditor.tsx`**

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Toolbar from "./Toolbar";
import styles from "./RichTextEditor.module.css";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360 }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className={styles.editor}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className={styles.content} />
    </div>
  );
}
```

---

## 13. SISTEMA DE COMENTARIOS

**`src/components/evidencias/ComentarioForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  evidenciaId?: string;
  evaluacionId?: string;
  onSuccess: () => void;
}

export default function ComentarioForm({ evidenciaId, evaluacionId, onSuccess }: Props) {
  const [autor, setAutor] = useState("");
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autor, contenido, evidenciaId, evaluacionId }),
    });

    if (res.ok) {
      toast.success("Comentario publicado");
      setAutor("");
      setContenido("");
      onSuccess();
    } else {
      toast.error("Error al publicar");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tu nombre"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
        required
      />
      <textarea
        placeholder="Escribe un comentario o retroalimentación..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        required
        rows={4}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Publicando..." : "Comentar"}
      </button>
    </form>
  );
}
```

---

## 14. DEPLOY EN VERCEL

### 14.1 Preparar proyecto

```bash
echo ".env" >> .gitignore

git init
git add .
git commit -m "eportfolio: init"
git remote add origin https://github.com/TU_USUARIO/eportfolio.git
git push -u origin main
```

### 14.2 Configurar Prisma para Vercel

En `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start"
  }
}
```

### 14.3 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

module.exports = nextConfig;
```

### 14.4 Desplegar

1. Ir a vercel.com → New Project → Importar repo de GitHub
2. En "Environment Variables", agregar TODAS las variables del `.env`
3. Deploy automático

---

## 15. COMANDOS DE DESARROLLO

```bash
# Desarrollo local
npm run dev                      # http://localhost:3000

# Base de datos
npx prisma studio                # GUI visual para ver/editar datos
npx prisma migrate dev           # Aplicar migraciones
npx prisma db push               # Push sin migración (prototipar rápido)
npx prisma generate              # Regenerar cliente

# Producción
npm run build                    # Build de producción
npm run start                    # Servir build local
```

---

## 16. ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
FASE 1 — Fundación (Día 1-2)
├── Inicializar proyecto Next.js
├── Configurar Prisma + Neon (schema + migración)
├── Configurar NextAuth (login admin)
├── Configurar Cloudinary (upload)
├── Crear layout global (Navbar + Footer)
└── Crear globals.css con variables

FASE 2 — Panel Admin (Día 3-5)
├── Página login admin
├── Layout admin con sidebar protegido
├── Dashboard con estadísticas
├── CRUD Perfil (formulario + API)
├── CRUD Introducción (formulario + API)
├── CRUD Asignatura (formulario + API)
├── CRUD Evidencias (editor TipTap + upload + API)
├── CRUD Evaluaciones (formulario + API)
└── CRUD Reflexiones (formulario + API)

FASE 3 — Sitio Público (Día 6-8)
├── Home / Landing
├── Página Sobre Mí
├── Página Introducción
├── Página Asignatura
├── Timeline de Evidencias + detalle con comentarios
├── Evaluaciones + detalle
├── Reflexiones + detalle
└── Archivo del blog (vista cronológica con fechas)

FASE 4 — Pulido (Día 9-10)
├── Animaciones con framer-motion
├── Responsive design (mobile-first)
├── Dark mode toggle
├── SEO (metadata en cada página)
├── Loading states y error boundaries
├── Deploy en Vercel
└── Testing final contra checklist
```

---

## 17. CHECKLIST DE CUMPLIMIENTO

Verificar que el ePortfolio cumple TODOS los requisitos:

```
CREACIÓN
[ ] Web creada en la primera semana (9-13 marzo 2026)
[ ] Dirección enviada a mroco@udec.cl

ESTRUCTURA VISIBLE
[ ] Archivo del blog visible con fechas para cada entrada
[ ] Identificación del autor completa
[ ] Introducción con objetivos personales
[ ] Información de la asignatura

ENTRADAS SEMANALES
[ ] Mínimo 17 entradas (una por semana)
[ ] Cada entrada con fecha visible
[ ] Evidencias multimedia (imágenes, video, audio, links)
[ ] Reflexiones y comentarios personales por entrada

REFLEXIONES
[ ] Reflexión integral al final de cada ejercicio
[ ] Reflexión final del semestre
[ ] Verifican cumplimiento de propósitos de aprendizaje

RETROALIMENTACIÓN
[ ] Sistema de comentarios funcional y abierto
[ ] Al menos 10 retroalimentaciones por etapa en otros ePortfolios

EVALUACIÓN
[ ] Sección evaluación con criterios, escalas, metodología
[ ] Calificaciones obtenidas registradas
[ ] Reflexión sobre evaluaciones recibidas

OBJETIVOS
[ ] Propósitos de aprendizaje del semestre definidos
[ ] Planificación y gestión del tiempo documentadas
[ ] Estrategias de estudio documentadas

PANEL ADMIN
[ ] Login funcional y seguro
[ ] CRUD completo para todas las secciones
[ ] Editor rich text para contenido extenso
[ ] Upload de multimedia a Cloudinary
[ ] Dashboard con métricas de avance
```