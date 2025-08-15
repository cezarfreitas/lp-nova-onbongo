/**
 * Utilitário para scroll suave até seções
 */

export const scrollToFormulario = () => {
  const formularioElement = document.getElementById("cadastro-section");

  if (formularioElement) {
    // Aguardar um tick para garantir que o DOM está pronto
    setTimeout(() => {
      formularioElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }, 100);

    console.log("🎯 Scroll para formulário executado");
  } else {
    console.error("❌ Elemento #cadastro-section não encontrado");
    // Fallback: tentar encontrar o formulário
    const formElement = document.querySelector('section.bg-accent');
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
      console.log("🎯 Fallback: Scroll para seção do formulário");
    }
  }
};

export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    
    console.log(`🎯 Scroll para #${elementId} executado`);
  } else {
    console.error(`❌ Elemento #${elementId} não encontrado`);
  }
};
