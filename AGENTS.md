<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Product and authentication boundaries

- Cannie Gift harus mendukung dua jenis pelanggan: guest dan user yang memiliki akun.
- User tidak boleh dipaksa login hanya untuk melihat produk, melihat detail produk, menambahkan produk ke cart, atau memulai checkout.
- Cart guest disimpan di browser, sedangkan cart user yang sudah login disimpan di Supabase dan terhubung ke profil customer.
- Login dan register bersifat opsional. Login memberikan manfaat tambahan seperti menyimpan cart secara permanen dan melihat riwayat pesanan.
- Saat guest login atau register, jangan menghapus cart guest. Cart guest harus digabungkan ke cart user setelah user menyetujui atau setelah aturan merge ditentukan dengan jelas.
- Checkout guest tetap diperbolehkan dengan data minimum: nama, email, nomor telepon, dan alamat pengiriman.
- Jangan membuat redirect global yang mengharuskan login. Proteksi hanya boleh diterapkan pada fitur yang memang membutuhkan akun, seperti profil dan riwayat pesanan.
- Jangan mengubah aturan guest/account, struktur data transaksi, atau perilaku merge cart tanpa menjelaskan dampaknya terlebih dahulu.
