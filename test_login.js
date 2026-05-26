// Script para testar a autenticação de login programaticamente com a API do Supabase
const SUPABASE_URL = "https://vstopjzwoxvjuybyjcto.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdG9wanp3b3h2anV5YnlqY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDM1MzgsImV4cCI6MjA5NTMxOTUzOH0.JsswG4K0R1Q1PUYo3UFa-B9Zd2bduGBLp7-9d-jFsQI";

const email = "test@redballoon.com.br";
const password = "Password123!";

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
