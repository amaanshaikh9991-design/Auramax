import { Link } from "react-router-dom";
import Button from "../components/Button";

function ForgotPassword() {
  function handleSubmit(event) {
    event.preventDefault();
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
              NO WORRIES
            </span>

            <h1>
              Let's get you
              <br />
              <span>back in.</span>
            </h1>

            <p>
              Enter your college roll number and follow
              the recovery instructions provided by your
              college's Antarang support team.
            </p>
          </div>

          <div className="auth-note">
            <span>🌱</span>
            <p>
              Your little space is still here.
            </p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-card forgot-card">
            <div className="auth-form-heading">
              <span className="forgot-icon">↻</span>

              <h2>Forgot your password?</h2>

              <p>
                Enter your college roll number to begin
                the recovery process.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="forgot-roll-number">
                  College roll number
                </label>

                <input
                  id="forgot-roll-number"
                  name="rollNumber"
                  type="text"
                  placeholder="e.g. 24CS017"
                  autoComplete="username"
                  required
                />
              </div>

              <Button type="submit" fullWidth>
                Continue
                <span>→</span>
              </Button>
            </form>

            <div className="forgot-help">
              <span>Need more help?</span>

              <p>
                If you cannot recover your account, contact
                your hostel coordinator or the college support
                person responsible for Antarang.
              </p>
            </div>

            <div className="auth-divider">
              <span>remembered it?</span>
            </div>

            <p className="auth-switch">
              <Link to="/login">
                Back to login
              </Link>
            </p>

            <p className="auth-privacy">
              🔒 Account recovery should follow the privacy
              and safeguarding procedures established by
              your college.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;