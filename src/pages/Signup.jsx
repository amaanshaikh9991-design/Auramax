import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Signup() {
  const navigate = useNavigate();

  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // Check password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          institution: institution.trim(),
          rollNumber: rollNumber.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      // Signup successful
      navigate("/login");

    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <section className="auth-layout">
        <div className="auth-intro">
          <Link to="/" className="auth-brand">
            <div className="brand-mark">A</div>

            <div>
              <strong>Antarang</strong>
              <span>a little space for you</span>
            </div>
          </Link>

          <div className="auth-intro-copy">
            <span className="auth-eyebrow">
              A LITTLE SPACE FOR YOU
            </span>

            <h1>
              Make some
              <br />
              <span>space for you.</span>
            </h1>

            <p>
              Create your Antarang space to check in,
              notice your patterns, and find things that
              might help along the way.
            </p>
          </div>

          <div className="auth-note">
            <span>✨</span>
            <p>
              There is no right or wrong way to feel.
            </p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-card signup-card">
            <div className="auth-form-heading">
              <h2>Create your space</h2>

              <p>
                Tell us who you are so your space can feel like yours.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="signup-name">Student name</label>
                <input id="signup-name" name="name" type="text" placeholder="Your full name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="auth-field">
                <label htmlFor="signup-institution">School or college name</label>
                <input id="signup-institution" name="institution" type="text" placeholder="Where do you study?" value={institution} onChange={(event) => setInstitution(event.target.value)} required />
              </div>
              <div className="auth-field">
                <label htmlFor="signup-roll-number">
                  College roll number
                </label>

                <input
                  id="signup-roll-number"
                  name="rollNumber"
                  type="text"
                  placeholder="e.g. 24CS017"
                  autoComplete="username"
                  value={rollNumber}
                  onChange={(event) =>
                    setRollNumber(event.target.value)
                  }
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-password">
                  Create a password
                </label>

                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-confirm-password">
                  Confirm password
                </label>

                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </div>

              <label className="auth-check-row">
                <input
                  type="checkbox"
                  required
                />

                <span>
                  I understand that Antarang is a wellbeing
                  space, not a medical or diagnostic service.
                </span>
              </label>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating..." : "Create my space"}
                {!loading && <span>→</span>}
              </Button>
            </form>

            <div className="auth-divider">
              <span>already have a space?</span>
            </div>

            <p className="auth-switch">
              <Link to="/login">
                Log in instead
              </Link>
            </p>

            <p className="auth-privacy">
              🔒 Your wellbeing information should be handled
              according to the privacy and safeguarding rules
              established by your college.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Signup;