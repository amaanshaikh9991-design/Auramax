import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const characterRef = useRef(null);
  const headRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const mouthRef = useRef(null);
  const browLeftRef = useRef(null);
  const browRightRef = useRef(null);

  useEffect(() => {
    const character = characterRef.current;
    const head = headRef.current;
    const pupils = [
      leftPupilRef.current,
      rightPupilRef.current,
    ];
    const mouth = mouthRef.current;
    const brows = [
      browLeftRef.current,
      browRightRef.current,
    ];

    if (
      !character ||
      !head ||
      !pupils[0] ||
      !pupils[1] ||
      !mouth
    ) {
      return;
    }

    const pupilX = gsap.quickTo(pupils, "x", {
      duration: 0.2,
      ease: "power3.out",
    });

    const pupilY = gsap.quickTo(pupils, "y", {
      duration: 0.2,
      ease: "power3.out",
    });

    const headX = gsap.quickTo(head, "x", {
      duration: 0.45,
      ease: "power3.out",
    });

    const headY = gsap.quickTo(head, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const headRotate = gsap.quickTo(head, "rotation", {
      duration: 0.45,
      ease: "power3.out",
    });

    const onMove = (event) => {
      const rect = character.getBoundingClientRect();

      const nx = Math.max(
        -1,
        Math.min(
          1,
          (event.clientX -
            (rect.left + rect.width * 0.5)) /
            500
        )
      );

      const ny = Math.max(
        -1,
        Math.min(
          1,
          (event.clientY -
            (rect.top + rect.height * 0.35)) /
            350
        )
      );

      if (focusedField === "password") {
        pupilX(-22);
        pupilY(-4);

        headX(-15);
        headY(3);
        headRotate(-4);

        gsap.to(mouth, {
          width: 28,
          height: 22,
          borderRadius: "50%",
          duration: 0.35,
          ease: "power2.out",
        });

        gsap.to(brows, {
          y: -6,
          duration: 0.3,
          ease: "power2.out",
        });

        return;
      }

      pupilX(nx * 18);
      pupilY(ny * 12);

      headX(nx * 5);
      headY(ny * 3);
      headRotate(nx * 2.5);

      gsap.to(mouth, {
        width: 52,
        height: 20,
        borderRadius: "0 0 50% 50%",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(brows, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("pointermove", onMove, {
      passive: true,
    });

    const float = gsap.to(character, {
      y: -10,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const breathe = gsap.to(character, {
      scale: 1.015,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const blinkTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 3.5,
    });

    blinkTimeline
      .to(".eyelid", {
        scaleY: 1,
        duration: 0.08,
        ease: "power2.in",
      })
      .to(".eyelid", {
        scaleY: 0,
        duration: 0.08,
        ease: "power2.out",
        delay: 0.1,
      });

    return () => {
      window.removeEventListener("pointermove", onMove);
      float.kill();
      breathe.kill();
      blinkTimeline.kill();
    };
  }, [focusedField]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      setFocusedField("roll");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setFocusedField("password");
      return;
    }

    try {
      setLoading(true);

      if (characterRef.current) {
        gsap.to(characterRef.current, {
          scale: 1.06,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        });
      }

      if (mouthRef.current) {
        gsap.to(mouthRef.current, {
          width: 60,
          height: 26,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      const response = await fetch(
  "http://localhost:5000/auth/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name.trim(),
      password: password,
    }),
  }
);
      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid name or password."
        );
        return;
      }

      console.log("Login successful:", data);

      navigate("/app/home");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const passwordMode = focusedField === "password";

  return (
    <main className="auth-page antarang-cartoon-login">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body,
        #root {
          height: 100%;
          overflow: hidden;
        }

        .antarang-cartoon-login {
          position: relative;
          height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 12% 20%,
              rgba(181, 218, 194, 0.35),
              transparent 28%
            ),
            radial-gradient(
              circle at 82% 78%,
              rgba(245, 211, 178, 0.28),
              transparent 30%
            ),
            #f8f5ed;
        }

        .cartoon-login-layout {
          position: relative;
          z-index: 2;
          width: min(1420px, 94vw);
          height: 100vh;
          margin: 0 auto;
          display: grid;
          grid-template-columns:
            minmax(500px, 1.1fr)
            minmax(380px, 460px);
          align-items: center;
          gap: clamp(30px, 5vw, 80px);
          padding: 20px 0;
        }

        .cartoon-character-stage {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cartoon-character-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(174, 214, 186, 0.5),
              rgba(174, 214, 186, 0.12) 48%,
              transparent 72%
            );
          filter: blur(5px);
        }

        .cartoon-ground {
          position: absolute;
          bottom: 60px;
          width: 400px;
          height: 45px;
          border-radius: 50%;
          background: rgba(48, 75, 60, 0.12);
          filter: blur(13px);
        }

        .student-character {
          position: relative;
          width: 420px;
          height: 580px;
          z-index: 3;
          transform-origin: center bottom;
        }

        .student-legs {
          position: absolute;
          left: 50%;
          bottom: 20px;
          width: 200px;
          height: 120px;
          transform: translateX(-50%);
          z-index: 2;
        }

        .student-leg {
          position: absolute;
          bottom: 0;
          width: 75px;
          height: 110px;
          border-radius: 28px 28px 20px 20px;
          background: linear-gradient(
            180deg,
            #7894aa,
            #617d95
          );
        }

        .student-leg.left {
          left: 15px;
          transform: rotate(5deg);
        }

        .student-leg.right {
          right: 15px;
          transform: rotate(-5deg);
        }

        .student-shoe {
          position: absolute;
          bottom: -3px;
          width: 105px;
          height: 38px;
          border-radius: 26px 30px 14px 14px;
          background: #33463d;
        }

        .student-shoe.left {
          left: -3px;
          transform: rotate(3deg);
        }

        .student-shoe.right {
          right: -3px;
          transform: rotate(-3deg);
        }

        .student-torso {
          position: absolute;
          left: 50%;
          bottom: 100px;
          width: 270px;
          height: 260px;
          transform: translateX(-50%);
          border-radius: 46% 46% 26% 26%;
          background: linear-gradient(
            145deg,
            #719f80,
            #466f58
          );
          box-shadow:
            inset -20px -18px 0 rgba(36, 76, 53, 0.1),
            0 22px 45px rgba(46, 77, 59, 0.18);
          z-index: 4;
        }

        .student-hood {
          position: absolute;
          left: 50%;
          top: -12px;
          width: 190px;
          height: 130px;
          transform: translateX(-50%);
          border: 20px solid #355744;
          border-bottom: 0;
          border-radius: 50% 50% 0 0;
          opacity: 0.78;
        }

        .student-pocket {
          position: absolute;
          left: 50%;
          bottom: 25px;
          width: 130px;
          height: 55px;
          transform: translateX(-50%);
          border: 2px solid rgba(237, 246, 235, 0.18);
          border-radius: 0 0 28px 28px;
        }

        .student-cord {
          position: absolute;
          top: 65px;
          width: 3px;
          height: 70px;
          background: #d8e5d7;
          opacity: 0.72;
        }

        .student-cord.left {
          left: 105px;
        }

        .student-cord.right {
          right: 105px;
        }

        .student-badge {
          position: absolute;
          right: 45px;
          bottom: 80px;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e8f0df;
          color: #426b52;
          font-weight: 900;
          font-size: 18px;
          z-index: 10;
        }

        .student-neck {
          position: absolute;
          left: 50%;
          top: 290px;
          width: 65px;
          height: 70px;
          transform: translateX(-50%);
          border-radius: 0 0 24px 24px;
          background: #efc092;
          z-index: 5;
        }

        .student-head {
          position: absolute;
          left: 50%;
          top: 50px;
          width: 280px;
          height: 280px;
          transform: translateX(-50%);
          border-radius: 48% 48% 45% 45%;
          background: linear-gradient(
            145deg,
            #ffe7c5,
            #efbf91
          );
          box-shadow:
            inset -13px -14px 0 rgba(171, 105, 65, 0.08),
            0 18px 38px rgba(69, 65, 52, 0.15);
          z-index: 7;
          will-change: transform;
        }

        .student-hair {
          position: absolute;
          left: -12px;
          top: -40px;
          width: 304px;
          height: 150px;
          border-radius: 56% 50% 42% 40%;
          background: #263b31;
          box-shadow: inset -18px -10px 0 rgba(10, 30, 21, 0.2);
          transform: rotate(-2deg);
          z-index: 2;
        }

        .student-hair:before,
        .student-hair:after {
          content: "";
          position: absolute;
          background: #304b3c;
          border-radius: 50%;
        }

        .student-hair:before {
          left: -16px;
          top: 58px;
          width: 68px;
          height: 140px;
          transform: rotate(22deg);
        }

        .student-hair:after {
          right: -16px;
          top: 45px;
          width: 75px;
          height: 150px;
          transform: rotate(-22deg);
        }

        .student-hair-strand {
          position: absolute;
          top: -18px;
          left: 50%;
          width: 50px;
          height: 65px;
          background: #263b31;
          border-radius: 50% 50% 30% 30%;
          transform: translateX(-50%) rotate(8deg);
          z-index: 3;
        }

        .student-ear {
          position: absolute;
          top: 130px;
          width: 34px;
          height: 60px;
          border-radius: 50%;
          background: #efc092;
          z-index: 1;
        }

        .student-ear.left {
          left: -16px;
        }

        .student-ear.right {
          right: -16px;
        }

        .student-eye {
          position: absolute;
          top: 115px;
          width: 75px;
          height: 85px;
          border-radius: 50%;
          background: #fffdf8;
          overflow: hidden;
          box-shadow: inset 0 -4px 0 rgba(88, 69, 54, 0.06);
          z-index: 6;
        }

        .student-eye.left {
          left: 45px;
        }

        .student-eye.right {
          right: 45px;
        }

        .eyelid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            145deg,
            #ffe7c5,
            #efbf91
          );
          transform-origin: top center;
          transform: scaleY(0);
          z-index: 8;
          border-radius: 50%;
        }

        .student-pupil {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 40px;
          height: 48px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 34% 28%,
              #fff 0 10%,
              #273e32 11% 100%
            );
          will-change: transform;
        }

        .student-pupil:after {
          content: "";
          position: absolute;
          top: 18%;
          left: 22%;
          width: 32%;
          height: 32%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
        }

        .student-brow {
          position: absolute;
          top: 98px;
          width: 58px;
          height: 10px;
          border-top: 6px solid #2c4235;
          border-radius: 50%;
          z-index: 7;
        }

        .student-brow.left {
          left: 50px;
          transform: rotate(-6deg);
        }

        .student-brow.right {
          right: 50px;
          transform: rotate(6deg);
        }

        .student-nose {
          position: absolute;
          left: 50%;
          top: 175px;
          width: 17px;
          height: 24px;
          transform: translateX(-50%);
          border-right: 3px solid rgba(173, 111, 71, 0.45);
          border-bottom: 3px solid rgba(173, 111, 71, 0.45);
          border-radius: 0 0 12px 0;
          z-index: 7;
        }

        .student-mouth {
          position: absolute;
          left: 50%;
          top: 215px;
          width: 44px;
          height: 17px;
          transform: translateX(-50%);
          border-bottom: 4px solid #704a3c;
          border-radius: 0 0 50% 50%;
          z-index: 7;
          transition: all 0.3s ease;
        }

        .student-blush {
          position: absolute;
          top: 185px;
          width: 42px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 150, 150, 0.35);
          filter: blur(4px);
          z-index: 6;
        }

        .student-blush.left {
          left: 32px;
        }

        .student-blush.right {
          right: 32px;
        }

        .student-arm {
          position: absolute;
          top: 270px;
          width: 72px;
          height: 200px;
          border-radius: 40px;
          background: #5e8d70;
          z-index: 8;
        }

        .student-arm.left {
          left: 22px;
          transform: rotate(14deg);
        }

        .student-arm.right {
          right: 22px;
          transform: rotate(-14deg);
        }

        .student-hand {
          position: absolute;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #efbf91;
          z-index: 9;
        }

        .student-hand.left {
          left: 10px;
          top: 250px;
        }

        .student-hand.right {
          right: 10px;
          top: 250px;
        }

        .student-message {
          position: absolute;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          padding: 12px 20px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(73, 107, 87, 0.14);
          color: #54705f;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 15px 35px rgba(53, 82, 65, 0.1);
          z-index: 20;
          transition: all 0.3s ease;
        }

        .cartoon-brand {
          position: absolute;
          top: 20px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 10;
        }

        .cartoon-brand .brand-mark {
          width: 42px;
          height: 42px;
          background: #719f80;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 900;
          font-size: 20px;
        }

        .cartoon-brand strong {
          display: block;
          color: #25382e;
          font-size: 16px;
        }

        .cartoon-brand span {
          display: block;
          margin-top: 2px;
          color: #758177;
          font-size: 10px;
        }

        .cartoon-login-card {
          width: 100%;
          max-width: 440px;
          justify-self: center;
          padding: 36px 38px 32px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(70, 92, 77, 0.09);
          box-shadow: 0 25px 60px rgba(51, 69, 57, 0.13);
          backdrop-filter: blur(18px);
          z-index: 5;
        }

        .cartoon-login-card .auth-heading h1 {
          font-size: clamp(36px, 3.5vw, 48px);
          line-height: 0.98;
        }

        .cartoon-login-card .auth-submit {
          width: 100%;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          text-decoration: none;
        }

        .auth-brand .brand-mark {
          width: 36px;
          height: 36px;
          background: #719f80;
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 900;
          font-size: 18px;
        }

        .auth-brand strong {
          display: block;
          color: #25382e;
          font-size: 15px;
        }

        .auth-brand span {
          display: block;
          margin-top: 2px;
          color: #758177;
          font-size: 10px;
        }

        .auth-heading {
          margin-bottom: 24px;
        }

        .auth-eyebrow {
          display: block;
          color: #758177;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .auth-heading h1 {
          color: #25382e;
          margin: 0 0 10px;
        }

        .auth-heading p {
          color: #758177;
          font-size: 13px;
          margin: 0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-field label {
          color: #25382e;
          font-size: 12px;
          font-weight: 600;
        }

        .auth-field input {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid rgba(70, 92, 77, 0.15);
          border-radius: 10px;
          font-size: 13px;
          transition: all 0.2s ease;
          background: #fff;
        }

        .auth-field input:focus {
          outline: none;
          border-color: #719f80;
          box-shadow:
            0 0 0 3px rgba(113, 159, 128, 0.15);
        }

        .auth-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auth-label-row a {
          color: #719f80;
          font-size: 11px;
          text-decoration: none;
        }

        .auth-password-wrap {
          position: relative;
        }

        .auth-password-wrap input {
          padding-right: 65px;
        }

        .auth-password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #719f80;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .auth-error {
          color: #e74c3c;
          font-size: 12px;
          padding: 9px 12px;
          background: rgba(231, 76, 60, 0.08);
          border-radius: 8px;
        }

        .auth-submit {
          padding: 13px 22px;
          background: #719f80;
          color: #fff;
          border: none;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .auth-submit:hover:not(:disabled) {
          background: #5e8d70;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(113, 159, 128, 0.3);
        }

        .auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          color: #758177;
          font-size: 11px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(70, 92, 77, 0.15);
        }

        .auth-divider span {
          padding: 0 10px;
        }

        .auth-secondary-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          color: #719f80;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          border: 1px solid rgba(113, 159, 128, 0.2);
          border-radius: 11px;
          transition: all 0.2s ease;
        }

        .auth-secondary-action:hover {
          color: #5e8d70;
          background: rgba(113, 159, 128, 0.05);
        }

        .auth-privacy {
          margin-top: 16px;
          color: #758177;
          font-size: 10px;
          text-align: center;
        }

        @media (max-width: 1050px) {
          .cartoon-login-layout {
            grid-template-columns:
              minmax(420px, 1fr)
              minmax(340px, 420px);
            gap: 20px;
          }

          .student-character {
            transform: scale(0.85);
          }
        }

        @media (max-width: 900px) {
          .cartoon-login-layout {
            grid-template-columns: 1fr;
            padding: 15px 0;
          }

          .cartoon-character-stage {
            height: 50vh;
          }

          .cartoon-login-card {
            width: min(440px, 92vw);
            padding: 28px 24px 24px;
          }

          .cartoon-brand {
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 8px;
          }

          .student-character {
            transform: scale(0.75);
          }
        }

        @media (max-width: 560px) {
          .cartoon-character-stage {
            height: 45vh;
          }

          .student-character {
            transform: scale(0.6);
          }

          .cartoon-login-card {
            padding: 24px 20px 20px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="cartoon-login-layout">

        <section className="cartoon-character-stage">

          <div className="cartoon-brand">
            <div className="brand-mark">A</div>

            <div>
              <strong>Antarang</strong>
              <span>a little space for you</span>
            </div>
          </div>

          <div className="cartoon-character-glow"></div>
          <div className="cartoon-ground"></div>

          <div
            ref={characterRef}
            className="student-character"
          >
            <div className="student-legs">
              <div className="student-leg left"></div>
              <div className="student-leg right"></div>
              <div className="student-shoe left"></div>
              <div className="student-shoe right"></div>
            </div>

            <div className="student-torso">
              <div className="student-hood"></div>

              <div className="student-cord left"></div>
              <div className="student-cord right"></div>

              <div className="student-pocket"></div>

              <div className="student-badge">A</div>
            </div>

            <div className="student-neck"></div>

            <div
              ref={headRef}
              className="student-head"
            >
              <div className="student-hair">
                <div className="student-hair-strand"></div>
              </div>

              <div className="student-ear left"></div>
              <div className="student-ear right"></div>

              <div
                className="student-brow left"
                ref={browLeftRef}
              ></div>

              <div
                className="student-brow right"
                ref={browRightRef}
              ></div>

              <div className="student-eye left">
                <div className="eyelid"></div>

                <div
                  ref={leftPupilRef}
                  className="student-pupil"
                ></div>
              </div>

              <div className="student-eye right">
                <div className="eyelid"></div>

                <div
                  ref={rightPupilRef}
                  className="student-pupil"
                ></div>
              </div>

              <div className="student-blush left"></div>
              <div className="student-blush right"></div>

              <div className="student-nose"></div>

              <div
                ref={mouthRef}
                className="student-mouth"
              ></div>
            </div>

            <div className="student-arm left"></div>
            <div className="student-arm right"></div>

            <div className="student-hand left"></div>
            <div className="student-hand right"></div>
          </div>

          <div className="student-message">
            {passwordMode
              ? "Okay, I'll look away for a second 👀"
              : error
              ? "No worries — try again 🌱"
              : "Hey! I'm here with you 👋"}
          </div>
        </section>

        <section className="cartoon-login-card auth-card">

          <Link to="/" className="auth-brand">
            <div className="brand-mark">A</div>

            <div>
              <strong>Antarang</strong>
              <span>a little space for you</span>
            </div>
          </Link>

          <div className="auth-heading">
            <span className="auth-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Good to see
              <br />
              <span>you again.</span>
            </h1>

            <p>
              Sign in to continue your Antarang journey.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="student-name">
                Student name
              </label>

              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                onFocus={() => {
                  setFocusedField("roll");
                  setError("");
                }}
                onBlur={() => setFocusedField("")}
                placeholder="Enter your name"
                autoComplete="username"
                autoCapitalize="characters"
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <div className="auth-password-wrap">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setFocusedField("password");
                    setError("");
                  }}
                  onBlur={() => setFocusedField("")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Log in"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider">
            <span>new to Antarang?</span>
          </div>

          <Link
            to="/signup"
            className="auth-secondary-action"
          >
            Create your account
            <span>→</span>
          </Link>

          <p className="auth-privacy">
            🔒 Your account is accessed using your
            college roll number.
          </p>

        </section>
      </div>
    </main>
  );
}

export default Login;
