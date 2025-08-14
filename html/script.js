// Variáveis globais
let currentStep = 1;
let formData = {
  nomeCompleto: "",
  whatsapp: "",
  tipoCadastro: "",
  cnpj: "",
};

// Elementos DOM
const formSteps = document.querySelectorAll(".form-step");
const stepDots = document.querySelectorAll(".step-dot");
const progressFill = document.getElementById("progressFill");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const btnStep1 = document.getElementById("btnStep1");
const modal = document.getElementById("successModal");

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  updateProgress();
  updateFormHeader();

  // Auto-focus no primeiro campo
  setTimeout(() => {
    const firstInput = document.getElementById("nomeCompleto");
    if (firstInput) firstInput.focus();
  }, 100);
});

// Event Listeners
function setupEventListeners() {
  // Inputs da etapa 1
  const nomeInput = document.getElementById("nomeCompleto");
  const whatsappInput = document.getElementById("whatsapp");

  nomeInput.addEventListener("input", handleNomeChange);
  whatsappInput.addEventListener("input", handleWhatsAppChange);

  // Botão próximo da etapa 1
  btnStep1.addEventListener("click", nextStep);

  // Radio buttons da etapa 2
  const radioOptions = document.querySelectorAll(".radio-option");
  radioOptions.forEach((option) => {
    option.addEventListener("click", handleTipoChange);
  });

  // Input CNPJ da etapa 3
  const cnpjInput = document.getElementById("cnpj");
  cnpjInput.addEventListener("input", handleCNPJChange);

  // Form submit
  const form = document.getElementById("cadastroForm");
  form.addEventListener("submit", handleSubmit);

  // Enter key navigation
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep === 1 && validateStep1()) {
        nextStep();
      }
    }
  });
}

// Máscaras de input
function formatWhatsApp(value) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return value;
}

function formatCNPJ(value) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 14) {
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }
  return value;
}

// Handlers de input
function handleNomeChange(e) {
  formData.nomeCompleto = e.target.value;
  clearError("nomeError");
  updateStep1Button();
}

function handleWhatsAppChange(e) {
  const formatted = formatWhatsApp(e.target.value);
  e.target.value = formatted;
  formData.whatsapp = formatted;
  clearError("whatsappError");
  updateStep1Button();
}

function handleCNPJChange(e) {
  const formatted = formatCNPJ(e.target.value);
  e.target.value = formatted;
  formData.cnpj = formatted;
  clearError("cnpjError");
}

function handleTipoChange(e) {
  const option = e.currentTarget;
  const value = option.getAttribute("data-value");

  // Remove seleção anterior
  document.querySelectorAll(".radio-option").forEach((opt) => {
    opt.classList.remove("selected");
  });

  // Adiciona seleção atual
  option.classList.add("selected");

  // Marca o radio button
  const radio = option.querySelector('input[type="radio"]');
  radio.checked = true;

  formData.tipoCadastro = value;

  // Avança automaticamente após pequeno delay
  setTimeout(() => {
    currentStep = 3;
    showStep(3);
    updateProgress();
    updateFormHeader();

    // Auto-focus no CNPJ se for lojista
    if (value === "lojista") {
      setTimeout(() => {
        const cnpjInput = document.getElementById("cnpj");
        if (cnpjInput) cnpjInput.focus();
      }, 100);
    }
  }, 300);
}

// Validações
function validateStep1() {
  let isValid = true;

  // Validar nome
  if (!formData.nomeCompleto.trim()) {
    showError("nomeError", "Nome obrigatório");
    isValid = false;
  } else if (formData.nomeCompleto.trim().length < 3) {
    showError("nomeError", "Nome muito curto");
    isValid = false;
  }

  // Validar WhatsApp
  const whatsappNumbers = formData.whatsapp.replace(/\D/g, "");
  if (!whatsappNumbers) {
    showError("whatsappError", "WhatsApp obrigatório");
    isValid = false;
  } else if (whatsappNumbers.length !== 11) {
    showError("whatsappError", "WhatsApp inválido");
    isValid = false;
  }

  return isValid;
}

function validateStep3() {
  if (formData.tipoCadastro === "consumidor") {
    return true; // Não precisa validar para consumidor
  }

  const cnpjNumbers = formData.cnpj.replace(/\D/g, "");
  if (!cnpjNumbers) {
    showError("cnpjError", "CNPJ é obrigatório");
    return false;
  } else if (cnpjNumbers.length !== 14) {
    showError("cnpjError", "CNPJ deve ter 14 dígitos");
    return false;
  }

  return true;
}

// Utilitários de erro
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

// Navegação entre etapas
function nextStep() {
  if (currentStep === 1 && validateStep1()) {
    currentStep = 2;
    showStep(2);
    updateProgress();
    updateFormHeader();
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgress();
    updateFormHeader();
  }
}

function showStep(step) {
  // Esconder todas as etapas
  formSteps.forEach((stepElement) => {
    stepElement.classList.remove("active");
  });

  // Mostrar etapa atual
  const currentStepElement = document.getElementById(`formStep${step}`);
  if (currentStepElement) {
    currentStepElement.classList.add("active");
  }

  // Mostrar conteúdo específico da etapa 3
  if (step === 3) {
    const lojistaContent = document.getElementById("lojistaContent");
    const consumidorContent = document.getElementById("consumidorContent");

    if (formData.tipoCadastro === "lojista") {
      lojistaContent.style.display = "block";
      consumidorContent.style.display = "none";
    } else {
      lojistaContent.style.display = "none";
      consumidorContent.style.display = "block";
    }
  }
}

function updateProgress() {
  const progressPercent = (currentStep / 3) * 100;
  progressFill.style.width = `${progressPercent}%`;

  // Atualizar indicadores
  stepDots.forEach((dot, index) => {
    if (index < currentStep) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function updateFormHeader() {
  const titles = {
    1: "Cadastre-se Agora",
    2: "Tipo de Cadastro",
    3:
      formData.tipoCadastro === "lojista"
        ? "Finalizar Cadastro"
        : "Cadastro Exclusivo",
  };

  const subtitles = {
    1: "Comece sua jornada como lojista oficial",
    2: "Escolha o tipo de cadastro desejado",
    3:
      formData.tipoCadastro === "lojista"
        ? "Dados da sua empresa"
        : "Para lojistas com CNPJ",
  };

  formTitle.textContent = titles[currentStep];
  formSubtitle.textContent = subtitles[currentStep];
}

function updateStep1Button() {
  const isValid =
    formData.nomeCompleto.trim().length > 0 &&
    formData.whatsapp.trim().length > 0;
  btnStep1.disabled = !isValid;
}

// Submit do formulário
async function handleSubmit(e) {
  e.preventDefault();

  // Validar tipo de cadastro
  if (
    !formData.tipoCadastro ||
    (formData.tipoCadastro !== "lojista" &&
      formData.tipoCadastro !== "consumidor")
  ) {
    alert("Por favor, selecione o tipo de cadastro");
    return;
  }

  // Validar etapa 3 se for lojista
  if (formData.tipoCadastro === "lojista" && !validateStep3()) {
    return;
  }

  const submitButton = document.getElementById("btnSubmit") || e.submitter;
  if (submitButton) {
    // Mostrar loading
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner"></span> Enviando...';
    submitButton.disabled = true;
    document.body.classList.add("loading");

    try {
      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ Dados do formulário:", {
        nome: formData.nomeCompleto,
        whatsapp: formData.whatsapp,
        tipo: formData.tipoCadastro,
        cnpj: formData.cnpj || "N/A",
      });

      // Mostrar modal de sucesso
      showSuccessModal();
    } catch (error) {
      console.error("❌ Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    } finally {
      // Restaurar botão
      if (submitButton) {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
      document.body.classList.remove("loading");
    }
  }
}

function showSuccessModal() {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalInfo = document.getElementById("modalInfo");

  if (formData.tipoCadastro === "lojista") {
    modalTitle.textContent = "Cadastro Realizado!";
    modalMessage.textContent =
      "Nossa equipe entrará em contato via WhatsApp em breve para finalizar sua parceria.";
    modalInfo.textContent = "⏱️ Resposta em até 2 horas úteis";
  } else {
    modalTitle.textContent = "Cupom Gerado!";
    modalMessage.textContent = "Seu cupom de desconto foi gerado com sucesso!";
    modalInfo.textContent = "🎁 Use o código: ONBONGO10";
  }

  modal.classList.add("active");

  // Auto-fechar e resetar após 4 segundos
  setTimeout(() => {
    closeModal();
    resetForm();
  }, 4000);
}

function closeModal() {
  modal.classList.remove("active");
}

function resetForm() {
  // Reset form data
  formData = {
    nomeCompleto: "",
    whatsapp: "",
    tipoCadastro: "",
    cnpj: "",
  };

  // Reset form fields
  document.getElementById("cadastroForm").reset();

  // Reset radio selections
  document.querySelectorAll(".radio-option").forEach((opt) => {
    opt.classList.remove("selected");
  });

  // Reset errors
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });

  // Reset to step 1
  currentStep = 1;
  showStep(1);
  updateProgress();
  updateFormHeader();
  updateStep1Button();

  // Auto-focus no primeiro campo
  setTimeout(() => {
    const firstInput = document.getElementById("nomeCompleto");
    if (firstInput) firstInput.focus();
  }, 100);
}

// Função para abrir site e submeter (consumidores)
function openSiteAndSubmit() {
  window.open("https://www.onbongo.com.br", "_blank");
  handleSubmit(new Event("submit"));
}

// Função para scroll suave até o cadastro
function scrollToCadastro() {
  const cadastroSection = document.getElementById("cadastro-section");
  if (cadastroSection) {
    cadastroSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Smooth scroll para hero button
document.addEventListener("DOMContentLoaded", function () {
  const heroButton = document.querySelector(".hero-button");
  if (heroButton) {
    heroButton.addEventListener("click", scrollToCadastro);
  }
});
