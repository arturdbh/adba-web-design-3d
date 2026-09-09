/**
 * ADBA DESIGN 3D - INTELLIGENT AI AGENT WIDGET
 * Provides concise, intelligent responses for ADBA Diseños web services in Custom Code.
 * Opening greeting: "¿Hola, en que le puedo ayudar?"
 * Includes extensible teaching/learning module (`window.adbaAIAgent.teach(...)`).
 */

class ADBAAIAgent {
  constructor() {
    this.isOpen = false;
    this.customKnowledge = [];
    this.init();
  }

  init() {
    this.renderWidget();
    this.bindEvents();
    this.loadLearnedRules();
  }

  renderWidget() {
    if (document.getElementById('ai-agent-container')) return;

    const html = `
      <div id="ai-agent-container" class="ai-agent-container">
        <!-- Floating FAB Button (Bottom-Left) -->
        <button type="button" id="ai-agent-fab" class="ai-agent-fab" title="Asistente de IA ADBA">
          <div class="ai-fab-icon">
            <i class="fas fa-robot"></i>
            <span class="ai-pulse-dot"></span>
          </div>
          <span class="ai-fab-label">Agente IA</span>
        </button>

        <!-- Chat Window -->
        <div id="ai-agent-window" class="ai-agent-window hidden">
          <div class="ai-chat-header">
            <div class="ai-chat-title">
              <div class="ai-avatar"><i class="fas fa-brain"></i></div>
              <div>
                <h4>Agente ADBA IA</h4>
                <span class="ai-status-online"><span class="pulse-dot"></span> En línea</span>
              </div>
            </div>
            <button type="button" id="ai-chat-close" class="ai-chat-close"><i class="fas fa-times"></i></button>
          </div>

          <div id="ai-chat-messages" class="ai-chat-messages">
            <!-- Initial Greeting Message -->
            <div class="ai-msg ai-msg-agent">
              <div class="ai-msg-content">
                ¿Hola, en que le puedo ayudar?
              </div>
            </div>
          </div>

          <form id="ai-chat-form" class="ai-chat-form">
            <input type="text" id="ai-chat-input" placeholder="Escribe tu duda aquí..." autocomplete="off" required />
            <button type="submit" class="ai-chat-send"><i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  bindEvents() {
    const fab = document.getElementById('ai-agent-fab');
    const closeBtn = document.getElementById('ai-chat-close');
    const form = document.getElementById('ai-chat-form');

    if (fab) fab.addEventListener('click', () => this.toggleWindow());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeWindow());

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });
    }
  }

  toggleWindow() {
    this.isOpen = !this.isOpen;
    const chatWin = document.getElementById('ai-agent-window');
    if (chatWin) {
      chatWin.classList.toggle('hidden', !this.isOpen);
      if (this.isOpen) {
        const input = document.getElementById('ai-chat-input');
        if (input) setTimeout(() => input.focus(), 150);
      }
    }
  }

  closeWindow() {
    this.isOpen = false;
    const chatWin = document.getElementById('ai-agent-window');
    if (chatWin) chatWin.classList.add('hidden');
  }

  handleUserSubmit() {
    const input = document.getElementById('ai-chat-input');
    const userText = input ? input.value.trim() : '';
    if (!userText) return;

    // Add User Message
    this.appendMessage(userText, 'user');
    input.value = '';

    // Show Typing Indicator
    const typingId = this.showTyping();

    // Process intelligent response
    setTimeout(() => {
      this.removeTyping(typingId);
      const response = this.generateIntelligentResponse(userText);
      this.appendMessage(response.text, 'agent', response.actionBtn);
    }, 450);
  }

  showTyping() {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const id = 'typing_' + Date.now();
    const typingHtml = `
      <div id="${id}" class="ai-msg ai-msg-agent">
        <div class="ai-msg-content ai-typing">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    `;
    if (messagesContainer) {
      messagesContainer.insertAdjacentHTML('beforeend', typingHtml);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    return id;
  }

  removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  appendMessage(text, sender, actionBtn = null) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;

    let html = `<div class="ai-msg-content">${text}</div>`;
    if (actionBtn) {
      html += `<div class="ai-msg-action">${actionBtn}</div>`;
    }

    msgDiv.innerHTML = html;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Teach module: allows adding custom knowledge dynamically!
   * Example: window.adbaAIAgent.teach(["promocion", "descuento"], "¡Tenemos 10% en código a medida este mes!");
   */
  teach(keywordsArray, responseText, actionBtnHtml = null) {
    if (!Array.isArray(keywordsArray)) keywordsArray = [keywordsArray];
    const rule = {
      keywords: keywordsArray.map(k => k.toLowerCase()),
      text: responseText,
      actionBtn: actionBtnHtml
    };
    this.customKnowledge.push(rule);
    try {
      localStorage.setItem('adba_ai_agent_custom_rules', JSON.stringify(this.customKnowledge));
    } catch (e) {}
    console.log('🤖 Agente IA ADBA ha aprendido una nueva regla:', rule);
  }

  loadLearnedRules() {
    try {
      const saved = localStorage.getItem('adba_ai_agent_custom_rules');
      if (saved) {
        this.customKnowledge = JSON.parse(saved);
      }
    } catch (e) {}
  }

  generateIntelligentResponse(query) {
    const q = query.toLowerCase();

    // 0. Check custom learned rules first!
    for (const rule of this.customKnowledge) {
      if (rule.keywords.some(k => q.includes(k))) {
        return {
          text: rule.text,
          actionBtn: rule.actionBtn
        };
      }
    }

    // 1. Precios / Paquetes / Cotizaciones (100% CÓDIGO A MEDIDA - SIN WORDPRESS)
    if (q.includes('precio') || q.includes('costo') || q.includes('paquete') || q.includes('cuanto') || q.includes('cuánto') || q.includes('promocion') || q.includes('cotiza')) {
      if (q.includes('mantenimiento') || q.includes('1800') || q.includes('1,800')) {
        return {
          text: "El **Plan de Mantenimiento Web** cuesta **$1,800 MXN/mes**. Incluye actualización de contenidos, respaldos semanales, monitoreo de seguridad y optimización continua de velocidad.",
          actionBtn: `<a href="https://wa.me/525574562812?text=Hola%20ADBA%20Dise%C3%B1os,%20deseo%20contratar%20el%20Plan%20de%20Mantenimiento%20($1,800%20MXN/mes)" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Contratar Mantenimiento ($1,800)</a>`
        };
      }
      if (q.includes('emprendedor') || q.includes('6800') || q.includes('6,800') || q.includes('landing')) {
        return {
          text: "El **Paquete Emprendedor** cuesta **$6,800 MXN**. Es una Landing Page en Código a Medida ideal para ventas rápidas con botón directo a WhatsApp, Dominio .com, Hosting SSD y SSL gratis por 1 año.",
          actionBtn: `<a href="https://wa.me/525574562812?text=Hola%20ADBA%20Dise%C3%B1os,%20quiero%20el%20Paquete%20Emprendedor%20($6,800%20MXN)" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Cotizar Emprendedor ($6,800)</a>`
        };
      }
      if (q.includes('pyme') || q.includes('14500') || q.includes('14,500') || q.includes('popular')) {
        return {
          text: "El **Paquete Pyme Pro** cuesta **$14,500 MXN** (nuestro más vendido). Incluye sitio multipágina completo en Código a Medida, Agente de IA para atención, galería de trabajos, SEO en Google CDMX y Dominio + Hosting + SSL por 1 año.",
          actionBtn: `<a href="https://wa.me/525574562812?text=Hola%20ADBA%20Dise%C3%B1os,%20deseo%20el%20Paquete%20Pyme%20Pro%20($14,500%20MXN)" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Contratar Pyme Pro ($14,500)</a>`
        };
      }
      if (q.includes('tienda') || q.includes('e-commerce') || q.includes('ecommerce') || q.includes('19800') || q.includes('28500')) {
        return {
          text: "Contamos con dos paquetes de tiendas en Código a Medida: **Tienda Online Pyme ($19,800 MXN)** para hasta 40 productos y **E-Commerce Pro ($28,500 MXN)** con catálogo ilimitado, pagos automatizados y carrito inteligente.",
          actionBtn: `<a href="paquetes.html" class="ai-btn-link"><i class="fas fa-tags"></i> Ver Paquetes de Tienda</a>`
        };
      }
      return {
        text: "Manejamos paquetes 100% en Código a Medida: **Emprendedor ($6,800)**, **Pyme Pro ($14,500)**, **Tienda Pyme ($19,800)**, **E-Commerce Pro ($28,500)** y **Mantenimiento ($1,800/mes)**. Todos incluyen Dominio, Hosting SSD y SSL por 1 año.",
        actionBtn: `<a href="paquetes.html" class="ai-btn-link"><i class="fas fa-external-link-alt"></i> Ver Tabla de Paquetes</a>`
      };
    }

    // 2. Código vs Plantilla / WordPress
    if (q.includes('codigo') || q.includes('código') || q.includes('plantilla') || q.includes('wordpress') || q.includes('ventaja') || q.includes('beneficio') || q.includes('velocidad')) {
      return {
        text: "Nos dedicamos **exclusivamente al Desarrollo en Código a Medida** (no usamos plantillas lentas de WordPress ni Wix). Esto nos permite garantizar **100/100 de velocidad en Google Lighthouse**, carga instantánea en móviles 4G/5G, **0% riesgo de hackeo** y animaciones 3D espectaculares.",
        actionBtn: `<a href="codigo-vs-plantilla.html" class="ai-btn-link"><i class="fas fa-bolt"></i> Ver Beneficios del Código</a>`
      };
    }

    // 3. Términos / Pagos / Tiempos de Entrega / Anticipo
    if (q.includes('pago') || q.includes('anticipo') || q.includes('garantia') || q.includes('garantía') || q.includes('tiempo') || q.includes('entrega')) {
      return {
        text: "Trabajamos con un **50% de anticipo** para ingresar desarrollo a producción y el **50% restante a la entrega y prueba del sitio**. Entregamos en **3 a 5 días hábiles** sitios informativos y de **7 a 12 días hábiles** tiendas en línea.",
        actionBtn: `<a href="https://wa.me/525574562812" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Hablar con un Asesor</a>`
      };
    }

    // 4. Contacto / Horario / Ubicación / Teléfono / WhatsApp
    if (q.includes('contacto') || q.includes('telefono') || q.includes('teléfono') || q.includes('whatsapp') || q.includes('direccion') || q.includes('dirección') || q.includes('horario') || q.includes('donde') || q.includes('dónde') || q.includes('ubicacion')) {
      return {
        text: "Estamos ubicados en **José T. Cuellar 79A Local H, Col. Obrera, CDMX**. Horario: **Lunes a Viernes de 11:00 a 18:30 hrs**. WhatsApp: **5574562812**. Correo: **adbadiseno@gmail.com**.",
        actionBtn: `<a href="https://wa.me/525574562812" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Abrir WhatsApp (5574562812)</a>`
      };
    }

    // 5. Saludos
    if (q.includes('hola') || q.includes('buenas') || q.includes('saludos') || q.includes('dia') || q.includes('tardes')) {
      return {
        text: "¡Hola! Con gusto te ayudo a cotizar o resolver tus dudas sobre tu proyecto web en Código a Medida. ¿Qué servicio te interesa?",
        actionBtn: `<a href="https://wa.me/525574562812" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Hablar con un Diseñador</a>`
      };
    }

    // Default intelligent fallback
    return {
      text: "Con gusto te ayudo. Desarrollamos sitios web exclusivamente en Código a Medida desde $6,800 MXN con velocidad 100/100 en Google y efectos 3D. ¿Te gustaría cotizar un proyecto?",
      actionBtn: `<a href="https://wa.me/525574562812?text=Hola%20ADBA%20Dise%C3%B1os,%20quiero%20cotizar%20un%20proyecto%20web" target="_blank" class="ai-btn-wa"><i class="fab fa-whatsapp"></i> Cotización Directa por WhatsApp</a>`
    };
  }
}

// Auto-initialize AI Agent
document.addEventListener('DOMContentLoaded', () => {
  window.adbaAIAgent = new ADBAAIAgent();
});
