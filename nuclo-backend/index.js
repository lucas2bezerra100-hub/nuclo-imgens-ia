require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rota de teste
app.get('/', (req, res) => res.send('Nuclo Imgens IA Backend funcionando!'));

// Rota para melhorar imagem
app.post('/api/enhance', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('Nenhuma imagem enviada.');

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/tiiuae/fb-ultimate-superres', // exemplo de modelo ESRGAN
      req.file.buffer,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/octet-stream'
        },
        responseType: 'arraybuffer'
      }
    );

    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(response.data));
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Erro ao processar a imagem com IA.');
  }
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
