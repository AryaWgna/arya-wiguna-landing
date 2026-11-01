import { redirect } from "next/navigation";

/**
 * URL lama /work → dialihkan ke beranda section Selected Work (#projects).
 * Menjaga tautan lama (bookmark/eksternal) agar tidak 404.
 */
export default function WorkPage() {
  redirect("/#projects");
}
