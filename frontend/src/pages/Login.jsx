import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
  const navigate = useNavigate();

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

    // Temporary navigation until backend authentication is implemented.
    navigate("/");
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#9B7847] sm:text-xs">
          Welcome back
        </p>

        <h1 className="font-serif text-3xl font-medium tracking-tight text-[#29251F] sm:text-4xl xl:text-5xl">
          Admin Sign in
        </h1>

        <p className="mt-2 text-xs leading-5 text-[#827B71] sm:mt-3 sm:text-sm sm:leading-6">
          Welcome back! Enter your details to access your account.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-7 sm:space-y-5">
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

        {/* Validation Error */}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 sm:px-4 sm:py-3 sm:text-sm"
          >
            {error}
          </p>
        )}

        {/* Sign In */}
        <Button type="submit" fullWidth className="py-3">
          Sign In
          <span aria-hidden="true">→</span>
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;