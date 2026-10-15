import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

function MotionLayer({ children, className = "" }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         HOME INTRO
         ===================================================== */

      const header = container.querySelector(".home-header");
      const checkin = container.querySelector(".home-checkin");
      const panels = container.querySelectorAll(".home-panel");

      if (header) {
        gsap.fromTo(
          header,
          {
            y: 24,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
          }
        );
      }

      if (checkin) {
        gsap.fromTo(
          checkin,
          {
            y: 35,
            opacity: 0,
            scale: 0.98,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.18,
            ease: "power3.out",
          }
        );
      }

      if (panels.length) {
        gsap.fromTo(
          panels,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.35,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      /* =====================================================
         SUN / GREETING
         ===================================================== */

      const greeting = container.querySelector(
        ".home-greeting-mark"
      );

      if (greeting) {
        gsap.fromTo(
          greeting,
          {
            scale: 0.4,
            rotation: -30,
            opacity: 0,
          },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1,
            delay: 0.25,
            ease: "back.out(1.8)",
          }
        );

        gsap.to(greeting, {
          y: -10,
          rotation: 5,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /* =====================================================
         MOOD EMOJI INTRO
         ===================================================== */

      const moodEmojis = container.querySelectorAll(
        ".home-mood-emoji"
      );

      moodEmojis.forEach((emoji, index) => {
        gsap.fromTo(
          emoji,
          {
            y: 35,
            opacity: 0,
            scale: 0.55,
            rotation: -15,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.65,
            delay: 0.45 + index * 0.08,
            ease: "back.out(1.8)",
          }
        );
      });

      /* =====================================================
         ⭐ NEW:
         INTERACTIVE MOOD CONSTELLATION
         ===================================================== */

      const moodPreview = container.querySelector(
        ".home-mood-preview"
      );

      if (moodPreview && moodEmojis.length) {
        const constellationPositions = [
          { x: -35, y: -28, rotation: -8 },
          { x: 8, y: -48, rotation: 5 },
          { x: 45, y: -18, rotation: 10 },
          { x: -48, y: 25, rotation: -10 },
          { x: 5, y: 40, rotation: 4 },
          { x: 48, y: 28, rotation: 9 },
        ];

        const quickValues = Array.from(moodEmojis).map(
          (emoji) => ({
            x: gsap.quickTo(emoji, "x", {
              duration: 0.45,
              ease: "power3.out",
            }),

            y: gsap.quickTo(emoji, "y", {
              duration: 0.45,
              ease: "power3.out",
            }),

            rotation: gsap.quickTo(
              emoji,
              "rotation",
              {
                duration: 0.45,
                ease: "power3.out",
              }
            ),

            scale: gsap.quickTo(
              emoji,
              "scale",
              {
                duration: 0.4,
                ease: "power3.out",
              }
            ),
          })
        );

        let constellationActive = false;

        const enterConstellation = () => {
          constellationActive = true;

          moodEmojis.forEach((emoji, index) => {
            const position =
              constellationPositions[
                index % constellationPositions.length
              ];

            gsap.to(emoji, {
              x: position.x,
              y: position.y,
              rotation: position.rotation,
              scale: 1.08,
              duration: 0.65,
              delay: index * 0.045,
              ease: "back.out(1.5)",
            });
          });

          gsap.to(moodPreview, {
            scale: 1.035,
            duration: 0.5,
            ease: "power3.out",
          });
        };

        const moveConstellation = (event) => {
          if (!constellationActive) return;

          const rect =
            moodPreview.getBoundingClientRect();

          const mouseX =
            (event.clientX - rect.left) / rect.width;

          const mouseY =
            (event.clientY - rect.top) / rect.height;

          const centeredX = mouseX - 0.5;
          const centeredY = mouseY - 0.5;

          moodEmojis.forEach((emoji, index) => {
            const position =
              constellationPositions[
                index % constellationPositions.length
              ];

            /*
             * The emojis subtly chase the cursor.
             * Each one gets a slightly different
             * amount of movement.
             */

            const influence =
              1 - index * 0.08;

            quickValues[index].x(
              position.x + centeredX * 26 * influence
            );

            quickValues[index].y(
              position.y + centeredY * 26 * influence
            );

            quickValues[index].rotation(
              position.rotation +
                centeredX * 12
            );

            quickValues[index].scale(
              1.08 +
                Math.abs(centeredX + centeredY) *
                  0.08
            );
          });
        };

        const leaveConstellation = () => {
          constellationActive = false;

          moodEmojis.forEach((emoji) => {
            gsap.to(emoji, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.75,
              ease: "elastic.out(1, 0.65)",
            });
          });

          gsap.to(moodPreview, {
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          });
        };

        moodPreview.addEventListener(
          "mouseenter",
          enterConstellation
        );

        moodPreview.addEventListener(
          "mousemove",
          moveConstellation
        );

        moodPreview.addEventListener(
          "mouseleave",
          leaveConstellation
        );

        moodPreview._enterConstellation =
          enterConstellation;

        moodPreview._moveConstellation =
          moveConstellation;

        moodPreview._leaveConstellation =
          leaveConstellation;
      }

      /* =====================================================
         CHECK-IN DECORATION
         ===================================================== */

      const shape = container.querySelector(
        ".home-checkin-shape"
      );

      if (shape) {
        gsap.to(shape, {
          rotation: 360,
          duration: 28,
          repeat: -1,
          ease: "none",
        });

        gsap.to(shape, {
          scale: 1.08,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /* =====================================================
         WEEK GRAPH
         ===================================================== */

      const bars = container.querySelectorAll(
        ".home-week-bar"
      );

      if (bars.length) {
        gsap.fromTo(
          bars,
          {
            scaleY: 0,
            transformOrigin: "bottom",
          },
          {
            scaleY: 1,
            duration: 0.85,
            delay: 0.7,
            stagger: 0.09,
            ease: "back.out(1.5)",
          }
        );
      }

      const barEmojis = container.querySelectorAll(
        ".home-week-bar span"
      );

      barEmojis.forEach((emoji, index) => {
        gsap.to(emoji, {
          y: index % 2 === 0 ? -3 : 3,
          rotation: index % 2 === 0 ? 4 : -4,
          duration: 1.7 + index * 0.12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.3 + index * 0.08,
        });
      });

      /* =====================================================
         LIVING WEEK INTERACTION
         ===================================================== */

      if (bars.length) {
        const weekQuickValues = Array.from(bars).map((bar) => ({
          x: gsap.quickTo(bar, "x", {
            duration: 0.35,
            ease: "power3.out",
          }),
          y: gsap.quickTo(bar, "y", {
            duration: 0.35,
            ease: "power3.out",
          }),
          rotation: gsap.quickTo(bar, "rotation", {
            duration: 0.35,
            ease: "power3.out",
          }),
          scaleX: gsap.quickTo(bar, "scaleX", {
            duration: 0.35,
            ease: "power3.out",
          }),
          scaleY: gsap.quickTo(bar, "scaleY", {
            duration: 0.35,
            ease: "power3.out",
          }),
        }));

        let weekActive = false;

        const resetWeek = () => {
          weekActive = false;

          bars.forEach((bar, index) => {
            weekQuickValues[index].x(0);
            weekQuickValues[index].y(0);
            weekQuickValues[index].rotation(0);
            weekQuickValues[index].scaleX(1);
            weekQuickValues[index].scaleY(1);
          });
        };

        const moveWeek = (event) => {
          if (!weekActive) return;

          const activeBar = event.currentTarget;
          const activeIndex = Array.from(bars).indexOf(
            activeBar
          );

          bars.forEach((bar, index) => {
            const distance = Math.abs(index - activeIndex);
            const influence = Math.max(
              0,
              1 - distance * 0.22
            );

            if (index === activeIndex) {
              weekQuickValues[index].x(0);
              weekQuickValues[index].y(-8);
              weekQuickValues[index].rotation(
                index % 2 === 0 ? -2.5 : 2.5
              );
              weekQuickValues[index].scaleX(1.08);
              weekQuickValues[index].scaleY(1.08);
              return;
            }

            weekQuickValues[index].x(
              index < activeIndex
                ? -4 * influence
                : 4 * influence
            );

            weekQuickValues[index].y(-4 * influence);

            weekQuickValues[index].rotation(
              index < activeIndex
                ? -1.5 * influence
                : 1.5 * influence
            );

            weekQuickValues[index].scaleX(
              1 + 0.035 * influence
            );

            weekQuickValues[index].scaleY(
              1 + 0.02 * influence
            );
          });
        };

        const enterBar = (event) => {
          weekActive = true;
          moveWeek(event);

          gsap.to(event.currentTarget, {
            filter: "brightness(1.06)",
            duration: 0.25,
            ease: "power2.out",
          });
        };

        const leaveBar = (event) => {
          gsap.to(event.currentTarget, {
            filter: "brightness(1)",
            duration: 0.3,
            ease: "power2.out",
          });

          resetWeek();
        };

        bars.forEach((bar) => {
          bar.addEventListener(
            "mouseenter",
            enterBar
          );

          bar.addEventListener(
            "mousemove",
            moveWeek
          );

          bar.addEventListener(
            "mouseleave",
            leaveBar
          );

          bar._weekEnter = enterBar;
          bar._weekMove = moveWeek;
          bar._weekLeave = leaveBar;
        });
      }
      

      /* =====================================================
         TOPIC PILLS
         ===================================================== */

      const topics = container.querySelectorAll(
        ".topic-pill"
      );

      if (topics.length) {
        gsap.fromTo(
          topics,
          {
            y: 18,
            opacity: 0,
            scale: 0.85,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            delay: 0.85,
            stagger: 0.08,
            ease: "back.out(1.7)",
          }
        );
      }

      /* =====================================================
         TOPIC ICON FLOATING
         ===================================================== */

      const topicIcons = container.querySelectorAll(
        ".topic-pill > span:first-child"
      );

      topicIcons.forEach((icon, index) => {
        gsap.to(icon, {
          y: index % 2 === 0 ? -4 : 4,
          rotation: index % 2 === 0 ? 3 : -3,
          duration: 2 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });

      /* =====================================================
         SPARKLES
         ===================================================== */

      const sparkles = container.querySelectorAll(
        ".topic-pill-spark"
      );

      sparkles.forEach((spark, index) => {
        gsap.to(spark, {
          rotation: 360,
          scale: 1.25,
          opacity: 0.55,
          duration: 2 + index * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });

      /* =====================================================
         EXISTING MOUSE PARALLAX
         ===================================================== */

      const parallaxSlow = container.querySelectorAll(
        ".motion-parallax-slow"
      );

      const parallax = container.querySelectorAll(
        ".motion-parallax"
      );

      const parallaxFast = container.querySelectorAll(
        ".motion-parallax-fast"
      );

      const handleMouseMove = (event) => {
        const x =
          event.clientX / window.innerWidth - 0.5;

        const y =
          event.clientY / window.innerHeight - 0.5;

        parallaxSlow.forEach((element) => {
          gsap.to(element, {
            x: x * 10,
            y: y * 10,
            duration: 1.2,
            ease: "power3.out",
            overwrite: "auto",
          });
        });

        parallax.forEach((element) => {
          gsap.to(element, {
            x: x * 18,
            y: y * 18,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
          });
        });

        parallaxFast.forEach((element) => {
          gsap.to(element, {
            x: x * 28,
            y: y * 28,
            duration: 0.65,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      window.addEventListener(
        "mousemove",
        handleMouseMove
      );

      /* =====================================================
         CARD HOVER
         ===================================================== */

      const hoverElements = container.querySelectorAll(
        ".motion-hover"
      );

      hoverElements.forEach((element) => {
        const enter = () => {
          gsap.to(element, {
            y: -6,
            scale: 1.012,
            duration: 0.35,
            ease: "power3.out",
          });
        };

        const leave = () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          });
        };

        element.addEventListener(
          "mouseenter",
          enter
        );

        element.addEventListener(
          "mouseleave",
          leave
        );

        element._motionEnter = enter;
        element._motionLeave = leave;
      });

      /* =====================================================
         TOPIC HOVER
         ===================================================== */

      topics.forEach((topic) => {
        const enter = () => {
          gsap.to(topic, {
            y: -7,
            scale: 1.06,
            rotation: gsap.utils.random(-2, 2),
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        };

        const leave = () => {
          gsap.to(topic, {
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.35,
            ease: "power3.out",
          });
        };

        topic.addEventListener(
          "mouseenter",
          enter
        );

        topic.addEventListener(
          "mouseleave",
          leave
        );

        topic._topicEnter = enter;
        topic._topicLeave = leave;
      });

      /* =====================================================
         CLEANUP
         ===================================================== */

      return () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        hoverElements.forEach((element) => {
          element.removeEventListener(
            "mouseenter",
            element._motionEnter
          );

          element.removeEventListener(
            "mouseleave",
            element._motionLeave
          );
        });

        topics.forEach((topic) => {
          topic.removeEventListener(
            "mouseenter",
            topic._topicEnter
          );

          topic.removeEventListener(
            "mouseleave",
            topic._topicLeave
          );
        });

        if (bars.length) {
          bars.forEach((bar) => {
            bar.removeEventListener(
              "mouseenter",
              bar._weekEnter
            );

            bar.removeEventListener(
              "mousemove",
              bar._weekMove
            );

            bar.removeEventListener(
              "mouseleave",
              bar._weekLeave
            );
          });
        }

        const moodPreview =
          container.querySelector(
            ".home-mood-preview"
          );

        if (moodPreview) {
          moodPreview.removeEventListener(
            "mouseenter",
            moodPreview._enterConstellation
          );

          moodPreview.removeEventListener(
            "mousemove",
            moodPreview._moveConstellation
          );

          moodPreview.removeEventListener(
            "mouseleave",
            moodPreview._leaveConstellation
          );
        }
      };
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`motion-layer ${className}`}
    >
      {children}
    </div>
  );
}

export default MotionLayer;