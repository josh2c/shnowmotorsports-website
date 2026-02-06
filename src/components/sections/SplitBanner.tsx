"use client";


interface PopupWindow {
  title: string;
  platform: string;
  handle: string;
  href: string;
  icon: string;
  buttonLabel: string;
  top: string;
  left: string;
  rotate: string;
  zIndex: number;
  width: string;
}

const popups: PopupWindow[] = [
  {
    title: "Instagram.exe",
    platform: "INSTAGRAM",
    handle: "@shnowmotorsports",
    href: "https://instagram.com/shnowmotorsports",
    icon: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z",
    buttonLabel: "Follow",
    top: "18%",
    left: "5%",
    rotate: "-3deg",
    zIndex: 3,
    width: "280px",
  },
  {
    title: "YouTube.exe",
    platform: "YOUTUBE",
    handle: "Shnow Motorsports",
    href: "https://youtube.com/@shnowmotorsports",
    icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z",
    buttonLabel: "Subscribe",
    top: "25%",
    left: "38%",
    rotate: "2deg",
    zIndex: 5,
    width: "260px",
  },
  {
    title: "TikTok.exe",
    platform: "TIKTOK",
    handle: "@shnowmotorsports",
    href: "https://tiktok.com/@shnowmotorsports",
    icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.18 8.18 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z",
    buttonLabel: "Follow",
    top: "15%",
    left: "68%",
    rotate: "-1.5deg",
    zIndex: 4,
    width: "280px",
  },
  {
    title: "Shop.exe — SHNOW MERCH",
    platform: "SHOP",
    handle: "shnowmotorsports.com",
    href: "#shop",
    icon: "M17 18c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20.01 4H5.21l-.94-2H1zm6 16c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2z",
    buttonLabel: "Shop Now",
    top: "55%",
    left: "20%",
    rotate: "3deg",
    zIndex: 2,
    width: "280px",
  },
];

function XPCloseButton() {
  return (
    <div className="w-[18px] h-[18px] bg-[#E04343] border border-white/40 rounded-sm flex items-center justify-center text-white text-[10px] font-bold leading-none">
      x
    </div>
  );
}

function XPMinimize() {
  return (
    <div className="w-[18px] h-[18px] bg-[#991515] border border-white/30 rounded-sm flex items-end justify-center pb-[2px]">
      <div className="w-[8px] h-[2px] bg-white" />
    </div>
  );
}

function XPMaximize() {
  return (
    <div className="w-[18px] h-[18px] bg-[#991515] border border-white/30 rounded-sm flex items-center justify-center">
      <div className="w-[9px] h-[7px] border border-white rounded-[1px]" />
    </div>
  );
}

export default function SplitBanner() {
  return (
    <section className="min-h-screen bg-[var(--accent-red)] relative overflow-hidden pt-24 md:pt-32">
      {/* Empty bento grid outlines as background */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-px bg-[#ff2d2d]/20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-[var(--accent-red)]" />
        ))}
      </div>

      {/* Subtle scanline effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Newsletter signup popup */}
      <div
        className="absolute select-none"
        style={{
          top: "55%",
          left: "55%",
          rotate: "-2deg",
          zIndex: 6,
          width: "300px",
        }}
      >
        <div className="rounded-t-lg overflow-hidden shadow-[4px_4px_20px_rgba(0,0,0,0.6)]">
          <div
            className="flex items-center justify-between px-2 py-1"
            style={{
              background:
                "linear-gradient(180deg, #cc1a1a 0%, #a01515 40%, #b01818 60%, #e63636 100%)",
            }}
          >
            <span className="text-white text-xs font-bold truncate pr-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Newsletter.exe — SUBSCRIBE
            </span>
            <div className="flex items-center gap-[2px] shrink-0">
              <XPMinimize />
              <XPMaximize />
              <XPCloseButton />
            </div>
          </div>
          <div className="bg-[#ECE9D8] p-4 border-x-2 border-b-2 border-[#cc1a1a]/30">
            <p className="text-[#000] text-xs mb-3">
              Sign up with your email address to receive news and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-2 py-1.5 text-xs text-black bg-white border border-[#7f9db9] rounded-sm outline-none focus:border-[#cc1a1a]"
              />
              <button
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black cursor-pointer rounded-sm border border-[#7a1010] active:translate-y-px shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg, #fff 0%, #ECE9D8 50%, #D6D0BC 100%)",
                  boxShadow:
                    "inset 0 1px 0 #fff, inset 0 -1px 0 #ACA899, 1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup windows */}
      {popups.map((popup, i) => (
        <div
          key={i}
          className="absolute select-none"
          style={{
            top: popup.top,
            left: popup.left,
            rotate: popup.rotate,
            zIndex: popup.zIndex,
            width: popup.width,
          }}
        >
          {/* Window chrome */}
          <div className="rounded-t-lg overflow-hidden shadow-[4px_4px_20px_rgba(0,0,0,0.6)]">
            {/* Title bar — XP blue gradient */}
            <div
              className="flex items-center justify-between px-2 py-1"
              style={{
                background:
                  "linear-gradient(180deg, #cc1a1a 0%, #a01515 40%, #b01818 60%, #e63636 100%)",
              }}
            >
              <span className="text-white text-xs font-bold truncate pr-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {popup.title}
              </span>
              <div className="flex items-center gap-[2px] shrink-0">
                <XPMinimize />
                <XPMaximize />
                <XPCloseButton />
              </div>
            </div>

            {/* Window body */}
            <div className="bg-[#ECE9D8] p-4 border-x-2 border-b-2 border-[#cc1a1a]/30">
              {/* Platform icon */}
              <div className="flex items-center gap-3 mb-3">
                <svg
                  className="w-10 h-10 text-black shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={popup.icon} />
                </svg>
                <div>
                  <p className="text-[#000] text-sm font-bold uppercase tracking-wide">
                    {popup.platform}
                  </p>
                  <p className="text-[#555] text-xs">
                    {popup.handle}
                  </p>
                </div>
              </div>

              {/* XP-style button */}
              <a
                href={popup.href}
                target={popup.href.startsWith("http") ? "_blank" : undefined}
                rel={popup.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block w-full py-1.5 text-xs font-bold uppercase tracking-wider text-black text-center rounded-sm border border-[#7a1010] active:translate-y-px"
                style={{
                  background:
                    "linear-gradient(180deg, #fff 0%, #ECE9D8 50%, #D6D0BC 100%)",
                  boxShadow:
                    "inset 0 1px 0 #fff, inset 0 -1px 0 #ACA899, 1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {popup.buttonLabel}
              </a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
