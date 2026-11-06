import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — Secret Desire" }] }),
  component: Register,
});

function Register() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    setServerError("");
    const { error } = await registerAuth(values.name, values.email, values.password);
    if (error) {
      setServerError(error.includes("already") ? "Este e-mail já está cadastrado" : error);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate({ to: "/conta" }), 2000);
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon glow mb-4">
            <span className="text-2xl text-primary-foreground">✓</span>
          </div>
          <h2 className="font-display text-2xl font-bold">Conta criada!</h2>
          <p className="mt-2 text-sm text-muted-foreground">Redirecionando para sua conta…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block h-3 w-3 rounded-full bg-neon glow animate-pulse-glow mb-4" />
          <h1 className="font-display text-3xl font-bold">Criar conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Rápido, fácil e gratuito</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <Field label="Nome completo" error={errors.name?.message}>
            <input {...register("name")} placeholder="Seu nome" className={inputCls} />
          </Field>

          <Field label="E-mail" error={errors.email?.message}>
            <input {...register("email")} type="email" placeholder="seu@email.com" className={inputCls} />
          </Field>

          <Field label="Senha" error={errors.password?.message}>
            <div className="relative">
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                className={inputCls + " pr-10"}
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field label="Confirmar senha" error={errors.confirmPassword?.message}>
            <input
              {...register("confirmPassword")}
              type={showPwd ? "text" : "password"}
              placeholder="Repita sua senha"
              className={inputCls}
            />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-neon py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-70 glow"
          >
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Criando…</> : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-neon hover:underline font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm placeholder:text-muted-foreground focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
