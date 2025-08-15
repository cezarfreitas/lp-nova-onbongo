/**
 * Utilitário para scroll suave até seções
 */

export const scrollToFormulario = () => {
  const formularioElement = document.getElementById("cadastro-section");
  
  if (formularioElement) {
    formularioElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    
    console.log("🎯 Scroll para formulário executado");
  } else {
    console.error("❌ Elemento #cadastro-section não encontrado");
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
