"""
Menjalankan model YOLO11l (ONNX) pada semua foto di public/sampel/
lalu menyimpan hasilnya ke lib/data/prediksi.json untuk dashboard simulasi.

Pakai:
  pip install onnxruntime pillow numpy
  python scripts/prediksi_sampel.py --model path/ke/yolo11l_best.onnx

Tambah foto baru: taruh di public/sampel/, daftarkan jadwalnya di
data/jadwal_simulasi.json, lalu jalankan ulang script ini.
"""
import argparse, glob, json, os
import numpy as np
import onnxruntime as ort
from PIL import Image

AMBANG_KEYAKINAN = 0.35
AMBANG_NMS = 0.7
# Kode kelas asli IP102 (3 digit di nama berkas IPxxx...) -> id kelas model AgriPest-RAG
IP102_KE_MODEL = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13,
                  22:14,23:15,24:16,18:17,19:18,20:19,14:20,15:21,16:22,54:23}

def letterbox(im, size=640):
    w, h = im.size; r = min(size / w, size / h)
    nw, nh = int(round(w * r)), int(round(h * r))
    kanvas = Image.new("RGB", (size, size), (114, 114, 114))
    px, py = (size - nw) // 2, (size - nh) // 2
    kanvas.paste(im.resize((nw, nh), Image.BILINEAR), (px, py))
    return kanvas, r, px, py

def nms(kotak, skor, ambang):
    urut = skor.argsort()[::-1]; simpan = []
    while len(urut):
        i = urut[0]; simpan.append(i)
        xx1 = np.maximum(kotak[i, 0], kotak[urut[1:], 0]); yy1 = np.maximum(kotak[i, 1], kotak[urut[1:], 1])
        xx2 = np.minimum(kotak[i, 2], kotak[urut[1:], 2]); yy2 = np.minimum(kotak[i, 3], kotak[urut[1:], 3])
        irisan = np.clip(xx2 - xx1, 0, None) * np.clip(yy2 - yy1, 0, None)
        a = (kotak[i, 2] - kotak[i, 0]) * (kotak[i, 3] - kotak[i, 1])
        b = (kotak[urut[1:], 2] - kotak[urut[1:], 0]) * (kotak[urut[1:], 3] - kotak[urut[1:], 1])
        urut = urut[1:][irisan / (a + b - irisan + 1e-9) < ambang]
    return simpan

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--folder", default="public/sampel")
    ap.add_argument("--keluaran", default="lib/data/prediksi.json")
    arg = ap.parse_args()
    sesi = ort.InferenceSession(arg.model)
    hasil = {}
    for berkas in sorted(glob.glob(os.path.join(arg.folder, "*"))):
        nama = os.path.basename(berkas)
        im = Image.open(berkas).convert("RGB"); W, H = im.size
        lb, r, px, py = letterbox(im)
        x = np.asarray(lb, dtype=np.float32).transpose(2, 0, 1)[None] / 255.0
        keluaran = sesi.run(None, {sesi.get_inputs()[0].name: x})[0][0].T
        skor = keluaran[:, 4:]; kelas = skor.argmax(1); yakin = skor.max(1)
        pilih = yakin >= AMBANG_KEYAKINAN
        b = keluaran[pilih, :4]
        xyxy = np.c_[b[:, 0] - b[:, 2] / 2, b[:, 1] - b[:, 3] / 2, b[:, 0] + b[:, 2] / 2, b[:, 1] + b[:, 3] / 2]
        deteksi = []
        for k in np.unique(kelas[pilih]):
            m = kelas[pilih] == k
            for j in nms(xyxy[m], yakin[pilih][m], AMBANG_NMS):
                x1, y1, x2, y2 = xyxy[m][j]
                # balik dari ruang letterbox ke koordinat relatif (0-1) gambar asli
                kotak = [(x1 - px) / r / W, (y1 - py) / r / H, (x2 - px) / r / W, (y2 - py) / r / H]
                kotak = [round(float(min(max(v, 0), 1)), 4) for v in kotak]
                deteksi.append({"kelas": int(k), "keyakinan": round(float(yakin[pilih][m][j]), 3), "kotak": kotak})
        deteksi.sort(key=lambda d: -d["keyakinan"])
        label_asli = None
        if nama.startswith("IP") and nama[2:5].isdigit():
            label_asli = IP102_KE_MODEL.get(int(nama[2:5]))
        hasil[nama] = {"lebar": W, "tinggi": H, "labelAsli": label_asli, "deteksi": deteksi}
        print(nama, [(d["kelas"], d["keyakinan"]) for d in deteksi])
    os.makedirs(os.path.dirname(arg.keluaran), exist_ok=True)
    with open(arg.keluaran, "w", encoding="utf-8") as f:
        json.dump({"model": "YOLO11l (ONNX)", "ambangKeyakinan": AMBANG_KEYAKINAN, "foto": hasil}, f, ensure_ascii=False, indent=1)
    print("Tersimpan:", arg.keluaran)

if __name__ == "__main__":
    main()
