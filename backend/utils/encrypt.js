import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALGORITHM = process.env.ALGORITHM; // 'aes-256-cbc'
const SECRET_KEY = crypto.createHash('sha256') // Garante 32 bytes
  .update(process.env.SECRET_KEY)
  .digest('base64')
  .slice(0, 32); // Ajusta o comprimento da chave para 32 bytes
const IV = crypto.randomBytes(16); // Vetor de inicialização (IV)

// Função para criptografar
const encrypt = (texto) => {
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);
  let encrypted = cipher.update(texto, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: IV.toString('hex'), encryptedData: encrypted };
};

// Função para descriptografar
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY),
    Buffer.from(hash.iv, 'hex')
  );
  let decrypted = decipher.update(hash.encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

// Exemplo de uso
const dados = 'Minha mensagem secreta!';
const hash = criptografar(dados);
console.log('Criptografado:', hash);

const original = descriptografar(hash);
console.log('Descriptografado:', original);
