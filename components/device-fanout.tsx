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
      className={`overflow-hidden bg-foreground/90 shadow-xl ${
        isPhone ? "rounded-[1.25rem] border-4 border-foreground/80" : "rounded-xl border-4 border-foreground/90"
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
 * Murni Tailwind: perspektif CSS, rotasi ±8°, hover meluruskan.
 * Mobile fallback: hanya perangkat tengah yang terlihat.
 */
export function DeviceFanOutMockup({ devices }: { devices: FanOutDevices }) {
  const { left, center, right } = devices;

  return (
    <div className="group relative flex h-48 items-center justify-center gap-2 overflow-hidden bg-surface px-4 py-4 [perspective:1000px] sm:h-64">
      {/* Kiri — phone/laptop kecil, miring */}
      <DeviceShell
        device={left}
        widthClass={
          left.frame === "phone"
            ? "hidden w-20 aspect-[9/19] -rotate-[8deg] translate-x-3 translate-y-2 opacity-90 transition-all duration-500 group-hover:-rotate-3 group-hover:-translate-x-1 sm:block md:w-24"
            : "hidden w-32 aspect-[16/10] -rotate-[8deg] translate-x-3 translate-y-2 opacity-90 transition-all duration-500 group-hover:-rotate-3 group-hover:-translate-x-1 sm:block md:w-40"
        }
      />

      {/* Tengah — hero device, lebih tinggi z-index */}
      <DeviceShell
        device={center}
        widthClass={
          center.frame === "phone"
            ? "relative z-10 w-32 aspect-[9/19] transition-all duration-500 group-hover:scale-[1.04] md:w-40"
            : "relative z-10 w-48 aspect-[16/10] transition-all duration-500 group-hover:scale-[1.04] md:w-64"
        }
      />

      {/* Kanan — miring berlawanan */}
      <DeviceShell
        device={right}
        widthClass={
          right.frame === "phone"
            ? "hidden w-20 aspect-[9/19] rotate-[8deg] -translate-x-3 translate-y-2 opacity-90 transition-all duration-500 group-hover:rotate-3 group-hover:translate-x-1 sm:block md:w-24"
            : "hidden w-32 aspect-[16/10] rotate-[8deg] -translate-x-3 translate-y-2 opacity-90 transition-all duration-500 group-hover:rotate-3 group-hover:translate-x-1 sm:block md:w-40"
        }
      />
    </div>
  );
}
