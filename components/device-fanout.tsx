"use client";

export type DeviceFrame = "phone" | "laptop";

export type FanOutDevice = {
  src: string;
  frame: DeviceFrame;
  alt?: string;
};

export type FanOutDevices = {
  left: FanOutDevice;
  center: FanOutDevice;
  right: FanOutDevice;
};

function DeviceShell({
  device,
  widthClass,
  className,
}: {
  device: FanOutDevice;
  widthClass: string;
  className?: string;
}) {
  const isPhone = device.frame === "phone";
  return (
    <div
      className={`overflow-hidden bg-black ${
        isPhone ? "aspect-[9/19] rounded-2xl border-4 border-foreground/80 shadow-xl" : "aspect-[16/10] rounded-xl border-4 border-foreground/90 shadow-2xl"
      } ${widthClass} ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={device.src}
        alt={device.alt ?? ""}
        loading="lazy"
        className={`h-full w-full object-cover ${isPhone ? "object-top" : "object-center"}`}
      />
    </div>
  );
}

/**
 * Pattern 3 — 3D Device Mockup Fan-Out ("Mekar") carousel.
 * Pure Tailwind CSS — verbatim dari skill tech-portfolio-patterns:
 * - Kiri: miring -12°, sedikit di belakang.
 * - Tengah: laptop/HP hero flat 0°, z-index lebih tinggi.
 * - Kanan: miring +12°, sedikit di belakang.
 * - Hover: perangkat meluruskan & menyebar (straighten/spread outward).
 */
export function DeviceFanOutMockup({ devices }: { devices: FanOutDevices }) {
  const { left, center, right } = devices;

  return (
    <div className="group relative flex items-center justify-center overflow-hidden py-8 [perspective:1000px]">
      {/* Kiri — phone/laptop, miring -12° */}
      <DeviceShell
        device={left}
        widthClass={
          left.frame === "phone"
            ? "w-28 sm:w-36 -rotate-12 translate-x-4 translate-y-3 transition-all duration-500 group-hover:-rotate-6 group-hover:-translate-x-2"
            : "w-40 sm:w-48 -rotate-12 translate-x-4 translate-y-3 transition-all duration-500 group-hover:-rotate-6 group-hover:-translate-x-2"
        }
      />

      {/* Tengah — hero device, flat 0°, z-index tinggi */}
      <DeviceShell
        device={center}
        widthClass={
          center.frame === "phone"
            ? "relative z-10 w-36 sm:w-44 md:w-52 transition-all duration-500 group-hover:scale-105"
            : "relative z-10 w-64 sm:w-80 md:w-96 transition-all duration-500 group-hover:scale-105"
        }
      />

      {/* Kanan — miring +12° */}
      <DeviceShell
        device={right}
        widthClass={
          right.frame === "phone"
            ? "w-28 sm:w-36 rotate-12 -translate-x-4 translate-y-3 transition-all duration-500 group-hover:rotate-6 group-hover:translate-x-2"
            : "w-40 sm:w-48 rotate-12 -translate-x-4 translate-y-3 transition-all duration-500 group-hover:rotate-6 group-hover:translate-x-2"
        }
      />
    </div>
  );
}
