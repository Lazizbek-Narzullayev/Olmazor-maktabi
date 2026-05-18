import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const Stumenu = () => {
  const images = [
    {
      src: "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
      blur: 6,
      depth: 0.7,
    },
  ];

  const intensity = 1;
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateMouse(e) {
      const rect = container.getBoundingClientRect();
      let clientX, clientY;

      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouse.current = {
        x: clientX / rect.width - 0.5,
        y: clientY / rect.height - 0.5,
      };
    }

    container.addEventListener("mousemove", updateMouse);
    container.addEventListener("touchmove", updateMouse, { passive: true });

    const elements = Array.from(container.querySelectorAll(".floating-blur"));
    const state = elements.map(() => ({ tx: 0, ty: 0 }));

    function animate() {
      const { x, y } = mouse.current;

      elements.forEach((el, i) => {
        const depth = parseFloat(el.dataset.depth) || 0.5;
        const targetX = -x * intensity * 20 * depth;
        const targetY = -y * intensity * 20 * depth;

        state[i].tx += (targetX - state[i].tx) * 0.08;
        state[i].ty += (targetY - state[i].ty) * 0.08;

        el.style.transform = `translate3d(${state[i].tx}px, ${state[i].ty}px, 0)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", updateMouse);
      container.removeEventListener("touchmove", updateMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-blue-900"
    >
      {/* 🔥 130% KATTA QILINGAN FLOATING BACKGROUND */}
      {images.map((it, idx) => (
        <div
          key={idx}
          className="floating-blur pointer-events-none absolute"
          data-depth={it.depth}
          style={{
            width: "130%",
            height: "130%",
            top: "-15%",
            left: "-15%",
            filter: `blur(${it.blur}px)`,
            backgroundImage: `url(${it.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.9,
            willChange: "transform",
            zIndex: 1,
            transform: "translate3d(0,0,0)",
          }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white/20 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-center text-blue-900">
            👨‍🎓 Sinfni tanlang
          </h1>
          <div className="mt-9 flex justify-between gap-5">
            <NavLink to={"/s5"}>
              <button className="border-blue-900 border bg-blue-900 rounded-lg w-32">
                <p className="text-white text-xl p-1">5-7 sinflar</p>
              </button>
            </NavLink>
            <NavLink to={"/s8"}>
              <button className="border-blue-900 border bg-blue-900 rounded-lg w-32">
                <p className="text-white text-xl p-1">8-10 sinflar</p>
              </button>
            </NavLink>
            <NavLink to={"/s11"}>
              <button className="border-blue-900 border bg-blue-900 rounded-lg w-32">
                <p className="text-white text-xl p-1">11 sinf</p>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stumenu;
