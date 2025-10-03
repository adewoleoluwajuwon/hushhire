/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  Button,
  Label,
  TextInput,
  ToggleSwitch,
  Alert,
} from "flowbite-react";
import { supabase } from "../api/supabase";
import { ensureProfile } from "../lib/hooks";

export default function AuthCard() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEmployer, setIsEmployer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      if (mode === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        await ensureProfile(isEmployer ? "employer" : "seeker", fullName);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {mode === "signIn" ? "Sign in" : "Create account"}
        </h2>
        <ToggleSwitch
          checked={mode === "signUp"}
          label="New here?"
          onChange={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
        />
      </div>
      {mode === "signUp" && (
        <div>
          <Label>Full name</Label>
          <TextInput
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
          />
          <div className="mt-2">
            <ToggleSwitch
              checked={isEmployer}
              label="I am an employer"
              onChange={setIsEmployer}
            />
          </div>
        </div>
      )}
      <div>
        <Label>Email</Label>
        <TextInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label>Password</Label>
        <TextInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <Alert color="failure">{error}</Alert>}
      <Button onClick={submit} className="w-full">
        {mode === "signIn" ? "Sign in" : "Create account"}
      </Button>
    </Card>
  );
}
