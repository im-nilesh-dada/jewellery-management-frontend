import { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Backend authentication will be connected here.
    console.log("Login form submitted", {
      email: formData.email,
    });

    setError("Authentication API is not connected yet.");
  };

  return (
    <AuthLayout>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#9B7847]">
          Welcome back
        </p>

        <h1 className="font-serif text-3xl font-medium tracking-tight text-[#29251F] sm:text-4xl xl:text-5xl">
          Admin Sign in
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#827B71]">
          Welcome back! Enter your details to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        {/* <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm font-medium text-[#9B7847] transition hover:text-[#72542E]"
          >
            Forgot password?
          </a>
        </div> */}

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <Button type="submit" fullWidth className="py-4">
          Sign In
          <span aria-hidden="true">→</span>
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#EAE4DA]" />
        <span className="text-xs text-[#A7A096]"></span>
        <div className="h-px flex-1 bg-[#EAE4DA]" />
      </div>

      {/* <p className="mt-7 text-center text-xs leading-5 text-[#A7A096]">
        By continuing, you agree to our{" "}
        <a href="/terms" className="text-[#6F604A] underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-[#6F604A] underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p> */}
    </AuthLayout>
  );
};

export default Login;
