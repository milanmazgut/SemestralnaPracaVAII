import React, { useState, FormEvent } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Check if the email is valid
    if (!validateEmail(email)) {
      setEmailError("Prosím, zadajte platný email.");
      return;
    } else {
      setEmailError(null);
    }

    // Proceed with login logic
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember me:", rememberMe);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Prihlásenie</h2>

        <label htmlFor="email">Email alebo používateľské meno</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <label htmlFor="password">Heslo</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Zapamätať si ma
          </label>
          <a href="/forgot-password">Zabudnuté heslo?</a>
        </div>

        <button type="submit">Prihlásiť sa</button>

        <p>
          Nemáte účet? <a href="/register">Registrovať sa</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
