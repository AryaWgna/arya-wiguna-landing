#!/usr/bin/env python3
"""Pindai sertifikat PDF (halaman 1) untuk verifikasi penerbit/tanggal."""
import glob
import os
import sys

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf tidak tersedia — jalankan: pip install pypdf")
    sys.exit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDER = os.path.join(ROOT, "public", "assets", "sertifikat")

for f in sorted(glob.glob(os.path.join(FOLDER, "*.pdf"))):
    name = os.path.basename(f)
    try:
        reader = PdfReader(f)
        page = reader.pages[0]
        text = (page.extract_text() or "").replace("\n", " | ")
        text = " ".join(text.split())
        text = text.encode("ascii", "replace").decode("ascii")
        print(f"## {name} ({len(reader.pages)} pages)")
        print(text[:550])
        print()
    except Exception as exc:  # noqa: BLE001
        print(f"## {name} -> ERROR: {exc}".encode("ascii", "replace").decode("ascii"))
        print()
