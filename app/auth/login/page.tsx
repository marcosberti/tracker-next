"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { login } from "./action";
import { Label } from "@/components/ui/label";
import { Error } from "@/components/ui/error";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-16 w-16 rounded-full ">
              {/* <img src={LOGO} alt="Image" height="100" /> */}
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">TRACKER</h1>
            <p className="text-card-foreground text-xs">track your expenses</p>
          </div>

          <form
            action={formAction}
            className="space-y-4 w-full max-w-md p-8"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                defaultValue={(state?.email as string) ?? ""}
              />
              {state?.error?.email && <Error>{state?.error.email[0]}</Error>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  disabled
                  // onClick={handleForgot}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                defaultValue={(state?.password as string) ?? ""}
              />
              {state?.error?.password && (
                <Error>{state?.error.password[0]}</Error>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              Login{" "}
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
