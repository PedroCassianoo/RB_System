document.addEventListener("DOMContentLoaded", () => {
    // 1. Verificar configuração do Supabase
    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.anonKey) {
        showError("Configuração do Supabase não encontrada. Verifique o arquivo config.js.");
        return;
    }

    // 2. Inicializar cliente Supabase
    const { createClient } = window.supabase;
    const supabase = createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);

    // 3. Obter elementos da DOM
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submit-btn");
    const submitText = document.getElementById("submit-text");
    const submitIcon = document.getElementById("submit-icon");
    const alertContainer = document.getElementById("alert-container");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const passwordToggleIcon = document.getElementById("password-toggle-icon");

    // 4. Alternar visibilidade da senha
    if (togglePasswordBtn && passwordInput && passwordToggleIcon) {
        togglePasswordBtn.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                passwordToggleIcon.textContent = "visibility";
            } else {
                passwordInput.type = "password";
                passwordToggleIcon.textContent = "visibility_off";
            }
        });
    }

    // 5. Tratar submissão do formulário
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideAlert();
            setLoading(true);

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    throw error;
                }

                // Login com sucesso
                showSuccess("Login realizado com sucesso! Redirecionando...");
                
                // Limpar campos de senha por segurança
                passwordInput.value = "";
                
                console.log("Usuário autenticado com sucesso:", data);
                
                // Redireciona para o dashboard após sucesso
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1500);

            } catch (err) {
                console.error("Erro na autenticação:", err);
                
                // Tradução amigável de erros comuns do Supabase Auth
                let errorMessage = "Ocorreu um erro ao tentar fazer login. Tente novamente.";
                if (err.status === 400 || err.message.includes("Invalid login credentials")) {
                    errorMessage = "E-mail corporativo ou senha incorretos.";
                } else if (err.message.includes("Email not confirmed")) {
                    errorMessage = "Por favor, confirme seu e-mail antes de acessar.";
                } else if (err.message) {
                    errorMessage = err.message;
                }
                
                showError(errorMessage);
                setLoading(false);
            }
        });
    }

    // Funções utilitárias de UI
    function setLoading(isLoading) {
        if (!submitBtn) return;
        
        submitBtn.disabled = isLoading;
        if (isLoading) {
            submitText.textContent = "Carregando...";
            submitIcon.textContent = "sync";
            submitIcon.classList.add("animate-spin");
        } else {
            submitText.textContent = "Entrar";
            submitIcon.textContent = "login";
            submitIcon.classList.remove("animate-spin");
        }
    }

    function showError(message) {
        if (!alertContainer) return;
        alertContainer.className = "mb-6 rounded-lg p-4 text-sm font-medium border bg-error-container text-on-error-container border-error/20 block animate-pulse";
        alertContainer.innerHTML = `
            <div class="flex items-center">
                <span class="material-symbols-outlined mr-2 text-[20px]">error</span>
                <span class="alert-message"></span>
            </div>
        `;
        alertContainer.querySelector(".alert-message").textContent = message;
    }

    function showSuccess(message) {
        if (!alertContainer) return;
        alertContainer.className = "mb-6 rounded-lg p-4 text-sm font-medium border bg-green-50 text-green-800 border-green-200 block";
        alertContainer.innerHTML = `
            <div class="flex items-center">
                <span class="material-symbols-outlined mr-2 text-[20px]">check_circle</span>
                <span class="alert-message"></span>
            </div>
        `;
        alertContainer.querySelector(".alert-message").textContent = message;
    }

    function hideAlert() {
        if (!alertContainer) return;
        alertContainer.className = "hidden";
        alertContainer.innerHTML = "";
    }
});
