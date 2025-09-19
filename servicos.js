// Mapa de dados para o modal
const SERVICOS = {
  "construcao-geral": {
    titulo: "Construção em Geral 🏗️",
    descricao: "Na DS Engenharia, a Construção em Geral é conduzida com excelência do início ao fim. Executamos obras residenciais e comerciais completas, sempre com foco em qualidade, segurança e cumprimento rigoroso de prazos.\n\nCuidamos de todas as etapas: fundação, estrutura, alvenaria, cobertura, instalações elétricas e hidráulicas, acabamentos e entregas técnicas. Cada detalhe é planejado com acompanhamento profissional, materiais certificados e mão de obra qualificada, garantindo durabilidade e eficiência.\n\nNosso compromisso é transformar projetos em realidade com total transparência, respeitando o orçamento, cronograma e padrões técnicos exigidos pela legislação.\n\n👉 Construir com a gente é ter a certeza de um resultado sólido, valorizado e pronto para atender às necessidades do cliente.",
    img: "img/nossos-servicos/construcao-geral.png"
  },
  "reformas": {
    titulo: "Reformas Residenciais e Comerciais 🏡🏢",
    descricao: "Reformar um espaço é transformar realidades. Nossas reformas residenciais e comerciais vão muito além da estética: trabalhamos desde o projeto detalhado até o acabamento final, cuidando de cada etapa com precisão e qualidade.\n\nRealizamos demolições controladas, ampliações, instalações elétricas e hidráulicas, gesso, pintura e marcenaria sob medida, sempre com materiais de alto padrão e equipe especializada.\n\nNosso objetivo é proporcionar uma modernização completa e funcional, planejada para causar o mínimo de interferência no seu dia a dia, sem abrir mão da agilidade e da segurança.\n\n👉 Uma reforma bem executada valoriza o imóvel, aumenta o conforto e traduz a identidade do cliente em cada detalhe.",
    img: "img/nossos-servicos/reformas.png"
  },
  "instalacoes-eletricas": {
    titulo: "Instalações Elétricas ⚡",
    descricao: "As instalações elétricas representam o coração de qualquer empreendimento moderno, seja ele residencial, comercial ou industrial. Um sistema bem projetado garante segurança, eficiência energética e confiabilidade para todos os usuários.\n\nNosso trabalho abrange desde a geração de energia solar fotovoltaica, passando pela montagem de quadros e painéis de distribuição, até a instalação de luminárias inteligentes em ambientes residenciais. Cada etapa é executada com planejamento técnico, materiais de alta qualidade e mão de obra especializada, assegurando que a energia chegue de forma segura e estável a todos os pontos necessários.\n\nProjetar e instalar uma rede elétrica envolve muito mais do que fios e disjuntores: exige cálculos de carga, dimensionamento correto, proteção contra surtos e curtos-circuitos, além de adequação às normas da ABNT e NBR. É um processo complexo, mas essencial para que o sistema funcione sem falhas, com máxima durabilidade e segurança.\n\nCom isso, proporcionamos soluções completas — desde a sustentabilidade da energia solar até a automação e iluminação de ambientes, entregando eficiência, economia e conforto ao seu dia a dia.\n\n👉 Uma instalação elétrica bem-feita é sinônimo de tranquilidade, valorização do imóvel e prevenção de riscos.",
    img: "img/nossos-servicos/instalacoes-eletricas.png"
  },
  "combate-incendio": {
    titulo: "Instalação e Combate a Incêndio 🔥",
    descricao: "A instalação de sistemas de prevenção e combate a incêndio é obrigatória em todo estabelecimento que deseja operar de forma legal e segura. Muito além de uma exigência normativa para obtenção do AVCB/CLCB junto ao Corpo de Bombeiros, trata-se de um investimento direto na proteção de vidas, patrimônio e continuidade das operações.\n\nAlém da parte hidráulica — como hidrantes, sprinklers e extintores —, a infraestrutura elétrica tem papel crucial nesses sistemas. São os quadros de comando, sensores, sirenes, iluminação e sinalização de emergência que garantem que todo o sistema entre em funcionamento no momento certo.\n\nCada detalhe, desde o dimensionamento da tubulação até o projeto elétrico de acionamento e monitoramento, exige conhecimento técnico, materiais certificados e testes constantes para assegurar a máxima eficiência.\n\n👉 Um estabelecimento preparado contra incêndios transmite credibilidade, responsabilidade e segurança, mostrando comprometimento não só com a lei, mas principalmente com a vida e a confiança de colaboradores e clientes.",
    img: "img/nossos-servicos/combate-incendio.png"
  }
};

const modal = document.getElementById("servicoModal");
const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescricao = document.getElementById("modalDescricao");
const modalFechar = document.getElementById("modalFechar");

let lastFocus = null;

// Delegação: abre modal
document.querySelector(".svc-grid").addEventListener("click", e => {
  const card = e.target.closest(".svc-card");
  if (!card) return;
  const slug = card.dataset.slug;
  const data = SERVICOS[slug];
  if (!data) return;

  lastFocus = card;
  modalImg.src = data.img;
  modalImg.alt = data.titulo;
  modalTitulo.textContent = data.titulo;
  modalDescricao.textContent = data.descricao;
  
  // Debug: verificar se a imagem está sendo carregada
  modalImg.onload = () => console.log('Imagem carregada:', data.img);
  modalImg.onerror = () => console.error('Erro ao carregar imagem:', data.img);

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".svc-modal-content").focus();
});

// Acessibilidade: abrir com Enter/Espaço
document.querySelectorAll(".svc-card").forEach(card => {
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

// Fechar modal
function fecharModal(){
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

modalFechar.addEventListener("click", fecharModal);
modal.addEventListener("click", e => { if (e.target.hasAttribute("data-close")) fecharModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharModal(); });