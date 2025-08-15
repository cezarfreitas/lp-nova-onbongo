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
        inline: "nearest",
      });
    }, 100);
  } else {
    // Fallback: tentar encontrar o formulário
    const formElement = document.querySelector("section.bg-accent");
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
};

export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
};
