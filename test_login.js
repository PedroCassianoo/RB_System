// Script para testar a autenticação de login programaticamente com a API do Supabase
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

async function testLogin() {
  console.log(`Tentando autenticar o usuário: ${email}...`);
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
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
    console.log("SUCESSO: Autenticação realizada com sucesso!");
    console.log("Access Token gerado:", data.access_token.substring(0, 20) + "...");
    console.log("Usuário Confirmado em:", data.user.email_confirmed_at);
    console.log("==========================================");
  } catch (error) {
    console.error("\n==========================================");
    console.error("ERRO na autenticação:");
    console.error(error.message);
    console.error("==========================================");
  }
}

testLogin();
