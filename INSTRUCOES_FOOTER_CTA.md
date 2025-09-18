# 📱 Footer CTA - Luan Cardoso

## 🚀 Como Incluir no Seu Projeto

### 1. Copie os arquivos para seu projeto:
- `footer-cta.css` - Estilos do rodapé e modal
- `footer-cta.js` - Lógica JavaScript
- `footer-cta.html` - HTML de referência (opcional)

### 2. Inclua no seu `index.html` (antes de `</body>`):

```html
<!-- Footer CTA - Luan Cardoso -->
<link rel="stylesheet" href="footer-cta.css">
<div id="footer-cta-root"></div>
<script src="footer-cta.js" defer></script>
```

### 3. Personalização do E-mail:
No arquivo `footer-cta.js`, linha 180, altere:
```javascript
href="mailto:contato@seu-dominio.com"
```
Para seu e-mail real.

## ✨ Funcionalidades

### 🎯 Rodapé Fixo
- **Posição**: Fixo na parte inferior da tela
- **Design**: Fundo escuro (#0f172a) com texto claro
- **Responsivo**: Adapta-se a mobile e desktop
- **Clicável**: Todo o rodapé abre o modal

### 📱 Botão WhatsApp
- **Texto**: "Fale comigo no WhatsApp"
- **Link**: Abre WhatsApp com mensagem pré-definida
- **Ícone**: SVG do WhatsApp integrado

### 🎪 Modal Interativo
- **Abertura**: Clique em qualquer área do rodapé
- **Conteúdo**: Serviços do Luan Cardoso
- **Botões**: WhatsApp, Telefone e E-mail
- **Fechamento**: ESC, clique no backdrop ou botão X

### ♿ Acessibilidade
- **ARIA**: Labels e roles semânticos
- **Foco**: Trap focus dentro do modal
- **Teclado**: Navegação completa por teclado
- **Contraste**: Suporte a modo de alto contraste

## 🎨 Customização Visual

### 📏 Alturas Responsivas
- **Desktop**: 72-80px
- **Mobile**: ~64px
- **Padding**: Ajustado automaticamente no body

### 🎭 Animações
- **Entrada**: Fade + scale do modal
- **Hover**: Elevação dos botões
- **Transições**: Suaves e performáticas

### 📱 Breakpoints
- **768px**: Layout mobile
- **480px**: Layout compacto

## 🔧 Configurações Técnicas

### 📦 Sem Dependências
- **HTML**: Puro
- **CSS**: Puro
- **JavaScript**: Vanilla JS
- **Ícones**: SVG inline

### 🚀 Performance
- **CSS**: Otimizado para mobile
- **JS**: Event delegation
- **Animações**: Respeitam `prefers-reduced-motion`

### 🔒 Segurança
- **Links**: `rel="noopener noreferrer"`
- **XSS**: Sanitização de conteúdo
- **Focus**: Gerenciamento seguro

## 📋 Checklist de Implementação

- [ ] Copiar arquivos CSS e JS
- [ ] Incluir links no HTML
- [ ] Personalizar e-mail de contato
- [ ] Testar em diferentes dispositivos
- [ ] Verificar acessibilidade
- [ ] Validar links do WhatsApp

## 🎯 Resultado Final

Um rodapé profissional que:
- ✅ Não interfere no conteúdo principal
- ✅ Chama atenção sem ser invasivo
- ✅ Converte visitantes em leads
- ✅ Funciona em todos os dispositivos
- ✅ Segue boas práticas de UX/UI

---

**Desenvolvido por**: Luan Cardoso  
**Contato**: (11) 96099-0726  
**WhatsApp**: [Fale comigo](https://wa.me/5511960990726?text=Ol%C3%A1%20Luan!%20Vim%20pelo%20site.%20Quero%20um%20or%C3%A7amento.)
