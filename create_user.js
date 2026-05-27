// Script para criar um usuário de teste no Supabase usando a API GoTrue nativa
const fs = require('fs');
const path = require('path');

// Carregar variáveis do arquivo .env local de forma nativa
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        if (key) process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn("Aviso: Falha ao carregar o arquivo .env:", e.message);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

async function createTestUser() {
  console.log(`Tentando cadastrar o usuário: ${email}...`);
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": ANON_KEY,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || data.error_description || JSON.stringify(data));
    }

    console.log("\n==========================================");
    console.log("SUCESSO: Usuário cadastrado com sucesso!");
    console.log("ID do Usuário:", data.id);
    console.log("E-mail:", data.email);
    console.log("Confirmado:", data.email_confirmed_at ? "Sim" : "Aguardando confirmação de e-mail (caso a opção de auto-confirmação esteja desativada no Supabase)");
    console.log("==========================================");
    console.log("\nVocê já pode tentar fazer o login na tela com as seguintes credenciais:");
    console.log("E-mail:", email);
    console.log("Senha:", password);
  } catch (error) {
    console.error("\n==========================================");
    console.error("ERRO ao cadastrar usuário:");
    console.error(error.message);
    console.error("==========================================");
  }
}

createTestUser();
