const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Untuk memanggil Flask model


const app = express();
const PORT = process.env.PORT || 5001; // Port untuk server Node.js

// Data in-memory untuk melacak modul edukasi yang dibuka
// PENTING: Data ini akan hilang setiap kali server di-restart
const openedModulesByUser = {}; // Contoh: { "userId1": ["1", "3", "5"], "userId2": ["2"] }

// Data in-memory untuk menyimpan hasil deteksi risiko
// PENTING: Data ini akan hilang setiap kali server di-restart
const userRiskAssessments = {}; // Contoh: { "userId1": { quizCount: 1, riskStatus: "Rendah", lastQuizDate: "...", riskLevel: "rendah" } }

// Data in-memory untuk menyimpan topik dan postingan forum
// PENTING: Data ini akan hilang setiap kali server di-restart
let forumTopics = [
  {
    id: "1",
    title: "Berbagi Pengalaman Kista Ovarium",
    description: "Forum untuk berbagi pengalaman dan saling mendukung",
    posts: [], // Akan diisi dengan objek postingan
    lastActivity: new Date().toISOString(),
    category: "Pengalaman",
    creator: "Admin"
  },
  {
    id: "2",
    title: "Pertanyaan Seputar Gejala",
    description: "Diskusi tentang gejala dan tanda-tanda kista ovarium",
    posts: [],
    lastActivity: new Date().toISOString(),
    category: "Tanya Jawab",
    creator: "Admin"
  },
  {
    id: "3",
    title: "Tips Pencegahan dan Pola Hidup Sehat",
    description: "Berbagi tips untuk menjaga kesehatan reproduksi",
    posts: [],
    lastActivity: new Date().toISOString(),
    category: "Tips",
    creator: "Admin"
  }
];

// Data tips kesehatan
const healthTips = [
  "Hidrasi: Minum minimal 8 gelas air per hari untuk menjaga kesehatan reproduksi.",
  "Olahraga: 30 menit aktivitas fisik dapat mengurangi risiko kista ovarium.",
  "Nutrisi: Konsumsi sayuran hijau dan buah-buahan kaya antioksidan.",
  "Istirahat Cukup: Pastikan tidur 7-8 jam setiap malam untuk keseimbangan hormon.",
  "Manajemen Stres: Lakukan meditasi atau yoga untuk mengurangi tingkat stres.",
  "Pemeriksaan Rutin: Jangan lewatkan jadwal pemeriksaan kesehatan tahunan Anda.",
  "Hindari Rokok & Alkohol: Batasi atau hindari konsumsi zat-zat berbahaya ini."
];

// Helper function to update lastActivity for a topic
const updateTopicLastActivity = (topicId) => {
  const topic = forumTopics.find(t => t.id === topicId);
  if (topic) {
    topic.lastActivity = new Date().toISOString();
  }
};


// Middleware
app.use(cors()); // Mengizinkan semua origin untuk pengembangan. Di produksi, batasi ke origin frontend Anda.
app.use(express.json()); // Mengizinkan parsing body permintaan sebagai JSON

// --- Endpoint untuk tips kesehatan random ---
app.get('/api/health-tip-of-the-day', (req, res) => {
  // Pilih tips secara acak setiap kali dipanggil
  const randomIndex = Math.floor(Math.random() * healthTips.length);
  const tipOfTheDay = healthTips[randomIndex];
  res.status(200).json({ tip: tipOfTheDay });
});

// --- Endpoint Proxy untuk Prediksi Kista (Memanggil Flask) ---
// Perhatian: Endpoint ini sekarang digunakan oleh Quiz.tsx untuk mengirim jawaban dan mendapatkan hasil



// --- Endpoint API untuk Melacak Modul Edukasi yang sudah dibuka ---
app.post('/api/education/track-module', (req, res) => {
  const { userId, moduleId } = req.body;

  if (!userId || !moduleId) {
    return res.status(400).json({ message: 'UserId and ModuleId are required.' });
  }

  if (!openedModulesByUser[userId]) {
    openedModulesByUser[userId] = [];
  }

  // Tambahkan moduleId jika belum ada untuk userId ini
  if (!openedModulesByUser[userId].includes(moduleId)) {
    openedModulesByUser[userId].push(moduleId);
  }

  console.log('Opened Modules (in-memory):', openedModulesByUser);
  res.status(200).json({ message: 'Module tracked successfully.' });
});

// --- Endpoint API untuk Mendapatkan Jumlah Modul yang Dibuka ---
app.get('/api/education/opened-count/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required.' });
  }

  const openedModuleIds = openedModulesByUser[userId] || [];
  res.status(200).json({
    openedCount: openedModuleIds.length,
    openedModuleIds: openedModuleIds // Mengirimkan ID juga untuk sinkronisasi UI
  });
});

// --- Endpoint API untuk Forum ---
app.get('/api/forum/topics', (req, res) => {
  // Mengirimkan salinan topik untuk menghindari modifikasi langsung dari luar
  res.status(200).json(forumTopics.map(topic => ({
    ...topic,
    postsCount: topic.posts.length // Menambahkan jumlah postingan
  })));
});

// Endpoint: GET /api/forum/topics/:topicId
// Mengembalikan detail topik tertentu beserta postingannya
app.get('/api/forum/topics/:topicId', (req, res) => {
  const { topicId } = req.params;
  const topic = forumTopics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ message: 'Topic not found.' });
  }
  res.status(200).json(topic);
});

// Endpoint: POST /api/forum/topics
// Membuat topik forum baru
// Menerima: { title: string, description: string, category: string, creator: string }
app.post('/api/forum/topics', (req, res) => {
  const { title, description, category, creator } = req.body;

  if (!title || !description || !category || !creator) {
    return res.status(400).json({ message: 'Title, description, category, and creator are required.' });
  }

  const newTopic = {
    id: (forumTopics.length + 1).toString(), // ID sederhana
    title,
    description,
    category,
    creator,
    posts: [],
    lastActivity: new Date().toISOString()
  };
  forumTopics.push(newTopic);
  res.status(201).json(newTopic);
});

// Endpoint: POST /api/forum/topics/:topicId/posts
// Menambahkan postingan baru ke topik tertentu
// Menerima: { author: string, content: string }
app.post('/api/forum/topics/:topicId/posts', (req, res) => {
  const { topicId } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ message: 'Author and content are required.' });
  }

  const topic = forumTopics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ message: 'Topic not found.' });
  }

  const newPost = {
    id: `${topic.id}-${topic.posts.length + 1}`, // ID postingan sederhana
    author,
    content,
    timestamp: new Date().toISOString()
  };
  topic.posts.push(newPost);
  updateTopicLastActivity(topicId); // Perbarui aktivitas terakhir topik
  res.status(201).json(newPost);
});

// Endpoint untuk menerima jawaban dari frontend dan meneruskannya ke server Flask
app.post('/api/predict', async (req, res) => {
    try {
        const answers = req.body;
        console.log('Menerima jawaban dari frontend:', answers);

        // Kirim data jawaban ke server Flask
        const flaskResponse = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers),
        });

        // Periksa jika respons dari Flask tidak OK
        if (!flaskResponse.ok) {
            const errorText = await flaskResponse.text();
            throw new Error(`Flask server error: ${errorText}`);
        }

        const flaskData = await flaskResponse.json();
        console.log('Menerima prediksi dari Flask:', flaskData);

        // Kirim respons dari Flask kembali ke frontend
        res.json(flaskData);
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).json({ error: 'Gagal memproses permintaan.' });
    }
});

// --- Endpoint API untuk Menyimpan Hasil Deteksi Risiko ---
// Endpoint ini sekarang tidak lagi digunakan karena logika penyimpanan sudah dipindahkan ke /api/quiz/submit
// Namun, saya tetap menyimpannya agar tidak ada perubahan pada alur lain.
app.post('/api/risk-assessment', (req, res) => {
  const { userId, riskStatus, lastQuizDate, riskLevel } = req.body; // quizCount tidak lagi diterima dari frontend

  if (!userId || !riskStatus || !lastQuizDate || !riskLevel) {
    return res.status(400).json({ message: 'Missing required fields for risk assessment.' });
  }

  // Dapatkan quizCount saat ini atau inisialisasi ke 0, lalu tambahkan 1
  const currentQuizCount = (userRiskAssessments[userId]?.quizCount || 0);
  const newQuizCount = currentQuizCount + 1;

  userRiskAssessments[userId] = {
    quizCount: newQuizCount, // Gunakan quizCount yang baru dihitung
    riskStatus,
    lastQuizDate,
    riskLevel
  };

  console.log('User Risk Assessments (in-memory):', userRiskAssessments);
  res.status(200).json({ message: 'Risk assessment saved successfully.', newQuizCount }); // Opsional: kirim kembali jumlah baru
});

// --- Endpoint API untuk Mendapatkan Hasil Deteksi Risiko ---
// Endpoint: GET /api/risk-assessment/:userId
// Mengembalikan: { quizCount: number, riskStatus: string, lastQuizDate: string, riskLevel: string }
app.get('/api/risk-assessment/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required.' });
  }

  const assessment = userRiskAssessments[userId] || {
    quizCount: 0,
    riskStatus: "Tidak diketahui",
    lastQuizDate: null,
    riskLevel: null
  };
  res.status(200).json(assessment);
});


// Jalankan server
app.listen(PORT, () => {
  console.log(`Node.js Backend berjalan di http://localhost:${PORT}`);
  console.log(`Pastikan Flask backend berjalan di http://localhost:5000 untuk prediksi model.`);
});
