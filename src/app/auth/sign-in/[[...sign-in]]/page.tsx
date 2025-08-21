// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-900 via-black to-slate-900 flex items-center justify-center">
      <SignIn />
    </div>
  );
}
