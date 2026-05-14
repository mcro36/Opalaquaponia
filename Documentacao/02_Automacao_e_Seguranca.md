# 02. Automação e Segurança Energética (Fase 2)

## Resumo
Instalação do sistema de monitoramento multiparamétrico via sensores Modbus RS485 multiplexados, inversores de frequência para economia de energia e gerador com partida automática. Monitoramento em dois ciclos: **ciclo rápido** (OD, ~14 min/volta — controle automático dos sopradores) e **ciclo lento** (pH, turbidez, condutividade, NH₄⁺ e temperatura, ~70 min/volta — alertas e histórico). Sem Inteligência Artificial. Sem ar comprimido.

---

## Central de Controle

- **Controlador:** CLP industrial (WEG TPW04 ou Altus Nexto Nano) com protocolo Modbus RTU via RS485.
- **Interface:** IHM local (tela touch 7") + alertas remotos via WiFi/celular (app ou SMS).
- **Barramento RS485:** Todos os sensores BOQU e os inversores WEG compartilham um único cabo de 2 fios — CLP é o mestre, cada dispositivo tem endereço Modbus único.
- **Inversores de Frequência WEG CFW11 (2CV):** 2 unidades, instalados nos sopradores da Fase 1. Permitem variação de rotação conforme demanda de OD, economizando até 30% de energia. Controlados diretamente pelo CLP via Modbus.

---

## Arquitetura de Monitoramento — Dois Ciclos

O sistema de amostragem usa um manifold central: mini-bombas peristálticas puxam água de cada tanque sequencialmente através de válvulas solenoides para a câmara de medição. O CLP coordena qual sensor está ativo em cada ciclo.

```
┌─────────────────────────────────────────────────────────┐
│  MANIFOLD CENTRAL (7 válvulas + 2 mini-bombas)          │
│                                                         │
│  Tanque 1 ──┐                                           │
│  Tanque 2 ──┤                                           │
│  Tanque 3 ──┤──► Câmara A ──► 2× BOQU DOF-2000 (OD)   │
│  Tanque 4 ──┤         (ciclo rápido ~2 min/tanque)      │
│  Tanque 5 ──┤                                           │
│  Tanque 6 ──┤──► Câmara B ──► BOQU MS-400 (pH/turb/CE) │
│  Tanque 7 ──┘              ──► BOQU NH4N-2000 (NH₄⁺)   │
│                         (ciclo lento ~10 min/tanque)    │
│                                                         │
│  Temperatura: 7× DS18B20 fixos nos tanques (1-Wire)     │
└─────────────────────────────────────────────────────────┘
```

### Ciclo Rápido — OD (parâmetro crítico, mata em minutos)

- **Sensores:** 2× BOQU DOF-2000 (fluorescência óptica, RS485 Modbus, sem membrana)
- **Ciclo:** ~2 min/tanque → **14 min para os 7 tanques** (janela cega máxima)
- **Saída:** controla diretamente os inversores WEG e dispara alertas de emergência
- **Precisão:** ±0,1 mg/L
- **Manutenção:** limpeza quinzenal com esponja macia (5 min); sem membrana, sem eletrólito

### Ciclo Lento — Parâmetros de qualidade (escalam em horas a dias)

- **BOQU MS-400** (5-em-1: pH + turbidez + condutividade + OD + temperatura, RS485)
  - Ciclo: ~10 min/tanque → ~70 min para os 7 tanques
  - Precisão pH: ±0,1 | Turbidez: ±2 NTU | CE: ±1% FS
  - Eletrodo de pH: vida útil 6–12 meses; manter 1 sobressalente (~R$ 300)

- **BOQU NH4N-2000** (NH₄⁺ colorimétrico, RS485 Modbus)
  - Método: colorimétrico (indofenol azul) — resistente a interferências iônicas de Ca²⁺ e Mg²⁺
  - Precisão: ±0,1 mg/L NH₄⁺-N | Faixa: 0–10 mg/L
  - Ciclo: integrado ao ciclo lento — ~70 min/volta completa
  - Reagentes: ~300–400 medições por kit (~R$ 600–800); reposição mensal
  - **NH₃ livre** calculado automaticamente pelo CLP: `NH₃_livre = f(TAN, pH, T)` — sem sensor adicional

- **7× DS18B20** (temperatura digital 1-Wire, fixos em cada tanque)
  - Medição contínua e em tempo real — **não multiplexados**
  - Precisão: ±0,5°C | MTBF: >10 anos | Sem calibração de campo

---

## Classificação dos Parâmetros por Urgência

| Parâmetro | Tempo para dano | Monitoramento | Ação automática |
| :--- | :---: | :--- | :--- |
| OD | 5–30 min | Ciclo rápido (14 min) | Sim — inversores WEG |
| NH₃ livre | 2–12 h | Calculado (TAN + pH + T) | Alerta celular |
| pH | Horas | Ciclo lento (70 min) | Alerta celular |
| NO₂⁻ | Dias | Manual 2–3×/semana (fotômetro) | — |
| Temperatura | Dias | DS18B20 contínuo por tanque | Bomba de Calor (Fase 3) |
| Turbidez/CE | Dias–semanas | Ciclo lento (70 min) | Alerta celular |
| NO₃⁻, KH | Semanas | Manual mensal (kit aquário) | — |

---

## Lógica do Inversor

- **OD > 6 mg/L:** Sopradores em frequência mínima (economia).
- **OD < 4,5 mg/L:** Frequência aumenta progressivamente.
- **OD < 3,5 mg/L:** Frequência máxima + alerta crítico no celular.
- **Madrugada (22h–06h):** Frequência elevada preventivamente (pico de consumo biológico).

---

## Lógica de Fotoperíodo e Alimentação (18L:6D)

Controla as faixas LED IP68 instaladas nas paredes dos tanques (Fase 3) e bloqueia os alimentadores durante o período com EPS:

- **Pôr do sol (~18h) → 23:00:** LED ligado (complemento fotoperíodo).
- **Dias nublados/frios (EPS colocado):** LED ligado durante todo o período diurno.
- **23:00 → 06:00:** LED desligado (período escuro + EPS sobre a superfície).
- **Horário < 06:00 ou ≥ 23:00:** Alimentadores bloqueados (período de EPS).
- **OD < 4,0 mg/L:** Alimentadores bloqueados independentemente do horário.
- **06:00:** Alarme sonoro — aviso para retirada dos painéis EPS.
- **22:45:** Alarme sonoro — aviso para colocação dos painéis EPS.

---

## Segurança Energética

O sistema possui uma camada de proteção contra apagões:

- **Gerador a Gasolina (8–10 kVA):** Com Quadro de Transferência Automática (QTA).
- **Tempo de acionamento:** < 15 segundos após queda de energia.
- **Cargas protegidas (essenciais):** Sopradores + CLP + sensores.
- **Cargas NÃO protegidas:** Bomba de Calor (a água leva horas para esfriar, mas peixes morrem em minutos sem ar).
- **Combustível:** Manter reserva mínima de 20 litros para ~8 horas de operação.

---

## Riscos e Limitações

- **Janela cega do OD:** O ciclo rápido de ~14 min é a maior janela sem leitura de OD. Mitigação: inversores nunca abaixo de 50% de potência na madrugada; alarme de ausência de variação de leitura (indica falha de bomba ou válvula).
- **Falha de válvula solenoide travada aberta:** Risco de cross-contamination entre tanques no manifold. Mitigação: válvulas NC (normalmente fechadas) — falha elétrica = fecha automaticamente.
- **Eletrodo pH do MS-400:** Componente de maior desgaste do sistema; troca programada a cada 6–12 meses. Manter 1 eletrodo sobressalente em estoque.
- **Reagente NH4N-2000 esgotado:** O analisador emite alarme com 48h de antecedência. Manter 1 kit reserva (~R$ 700).
- **Gasolina degradada:** Gasolina armazenada degrada em ~3 meses. Usar aditivo estabilizante ou fazer rodízio mensal do estoque.

---

## Referência Futura — Hach Amtax compact sc

Para operações que exijam rastreabilidade regulatória de NH₄⁺ (exportação, certificação SIF, contratos com SLA de qualidade) ou em caso de picos recorrentes de TAN, o **Hach Amtax compact sc** (FIA colorimétrico, RS485, ±0,05 mg/L) é o equipamento de referência industrial:

- Precisão 2× superior ao BOQU NH4N-2000
- Auto-calibração com padrão interno rastreável
- Suporte Hach Brasil com SLA 24–48h e peças em estoque local
- Custo: ~R$ 20.000–26.000 (vs. R$ 5.000 do BOQU)

**Recomendação:** avaliar substituição após 12–18 meses de operação, se o NH₄⁺ se mostrar próximo do limite crítico (>1,5 mg/L TAN com pH > 7,5) de forma recorrente.

---

## Custos Estimados — Fase 2

| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| CLP industrial + IHM 7" + painel elétrico + RS485 | 1 | 7.500 |
| Inversores de Frequência WEG CFW11 2CV | 2 | 4.200 |
| BOQU DOF-2000 (sensor OD óptico, RS485) | 2 | 2.500 |
| BOQU MS-400 (pH + turbidez + CE + T, RS485) | 1 | 2.000 |
| BOQU NH4N-2000 (NH₄⁺ colorimétrico, RS485) | 1 | 5.000 |
| DS18B20 (temperatura por tanque, 1-Wire) | 7 | 350 |
| Manifold + válvulas solenoides NC + mini-bombas | 1 | 3.000 |
| Gerador 8–10 kVA + QTA | 1 | 12.000 |
| Mão de obra técnica (instalação + programação CLP) | 1 | 4.500 |
| **TOTAL FASE 2** | | **R$ 41.050** |
