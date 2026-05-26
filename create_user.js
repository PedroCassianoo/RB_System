// Script para criar um usuário de teste no Supabase usando a API GoTrue nativa
const SUPABASE_URL = "https://vstopjzwoxvjuybyjcto.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdG9wanp3b3h2anV5YnlqY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDM1MzgsImV4cCI6MjA5NTMxOTUzOH0.JsswG4K0R1Q1PUYo3UFa-B9Zd2bduGBLp7-9d-jFsQI";

const email = "test@redballoon.com.br";
const password = "Password123!";

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
