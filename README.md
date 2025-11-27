# Bank Sampah Kelurahan Pekayon - Frontend Warga

Aplikasi Bank Sampah untuk Warga berbasis Next.js 14 dengan TypeScript strict mode, Tailwind CSS, dan Zustand untuk state management.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: SWR
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

## 🛠️ Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User enters credentials in login form
2. Form validates using Zod schema
3. Axios sends POST request to `/auth/login`
4. JWT token stored in localStorage
5. User redirected to `/home`
6. Middleware protects authenticated routes

## 📡 API Integration

All API calls use typed axios instance:

```typescript
import { get, post } from "@/libs/axios";
import { ApiResponse, User } from "@/types";

// GET request
const user = await get<ApiResponse<User>>("/users/me");

// POST request
const response = await post<ApiResponse<LoginResponse>>("/auth/login", {
  email,
  password,
});
```

## 🎨 UI Components

### Button

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Submit
</Button>
```

### Input

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register("email")}
/>
```

### Card

```tsx
<Card padding="md" shadow="md">
  <CardBody>Content</CardBody>
</Card>
```

## 🔒 TypeScript Strict Mode

This project enforces strict TypeScript rules:

- ✅ No `any` types allowed
- ✅ Explicit return types for all functions
- ✅ All props must be typed
- ✅ Strict null checks enabled

## 📱 Features

### For Warga (Citizens)

1. **Dashboard**: View balance and recent transactions
2. **Setor Online**: Request waste pickup
3. **Jadwal**: View collection and withdrawal schedules
4. **Transaksi**: View transaction history
5. **Saldo**: View wallet balance history
6. **Harga**: View waste price list per RW
7. **Notifikasi**: Receive notifications
8. **Profil**: Manage user profile

## 🔄 State Management

Using Zustand for global state:

```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();
```

## 📋 Form Validation

All forms use React Hook Form + Zod:

```typescript
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type FormData = z.infer<typeof schema>;
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [SWR](https://swr.vercel.app/)

---

**Built with ❤️ using Next.js and TypeScript**
