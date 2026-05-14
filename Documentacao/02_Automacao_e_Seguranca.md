# 02. Automação e Segurança Energética (Fase 2)

## Resumo
Instalação do sistema de monitoramento multiparamétrico via sensores Modbus RS485 multiplexados, inversores de frequência para economia de energia e gerador com partida automática. Monitoramento em dois ciclos independentes com manifolds separados: **ciclo rápido** (OD, ~22 min/volta — controle automático dos sopradores) e **ciclo lento** (pH, turbidez, condutividade, NH₄⁺ e temperatura, ~80 min/volta — alertas e histórico). Dados enviados ao ERP em desenvolvimento. Sem Inteligência Artificial. Sem ar comprimido.

---

## Central de Controle

- **Controlador:** CLP industrial (WEG TPW04 ou Altus Nexto Nano) com protocolo Modbus RTU via RS485.
- **Interface:** IHM local (tela touch 7") + alertas remotos via Telegram bot (primário) e modem GSM com chip de operadora (fallback SMS em caso de queda de internet).
- **Barramento RS485:** Todos os sensores BOQU e os inversores WEG compartilham um único cabo de 2 fios — CLP é o mestre, cada dispositivo tem endereço Modbus único. Isoladores galvânicos nos dois extremos do barramento + DPS no painel para proteção contra surtos gerados pelos sopradores 2 CV.
- **Biofiltro (percolador retangular):** aeração por convecção gravitacional — sem sensor de DO dedicado. O CLP monitora indiretamente a saúde do percolador pelo comportamento do TAN (ciclo lento). Alarme se TAN > 1,5 mg/L persistir por > 2 leituras consecutivas → indica queda de eficiência do biofiltro. Ver dimensionamento completo em [Doc 02B — RAS e Recirculação](02b_RAS_e_Recirculacao.md).
- **Inversores de Frequência WEG CFW11 (2CV):** 2 unidades, instalados nos sopradores da Fase 1. Permitem variação de rotação conforme demanda de OD, economizando até 30% de energia. Controlados diretamente pelo CLP via Modbus.
- **UPS 600 VA:** Alimenta CLP, sensores, modem e IHM. Cobre a janela de transição de energia (<15 s) até o gerador assumir, evitando reinicialização do sistema de controle.

---

## Arquitetura de Monitoramento — Dois Manifolds Independentes

O sistema usa **dois manifolds completamente separados**, eliminando o conflito de ciclos simultâneos. Cada manifold tem suas próprias mini-bombas peristálticas e válvulas solenoides. Uma bomba peristáltica reserva é mantida no painel para substituição rápida em caso de falha.

Um **sensor de fluxo binário** na câmara de medição de cada manifold detecta falha silenciosa de bomba ou válvula entupida — leituras congeladas disparam alarme imediato, impedindo que o CLP interprete ausência de variação como estabilidade.

```
┌─────────────────────────────────────────────────────────────────┐
│  MANIFOLD A — CICLO RÁPIDO (OD)                                 │
│  Mini-bomba A + 7 válvulas solenoides NC + sensor de fluxo      │
│                                                                 │
│  Tanque 1 ──┐                                                   │
│  Tanque 2 ──┤                                                   │
│  Tanque 3 ──┤                                                   │
│  Tanque 4 ──┤──► Câmara A ──► 2× BOQU DOF-2000 (OD)            │
│  Tanque 5 ──┤         (~2 min medição + ~0,5 min purga/tanque)  │
│  Tanque 6 ──┤                                                   │
│  Tanque 7 ──┘   (buffer/depuração — incluso no manifold)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MANIFOLD B — CICLO LENTO (qualidade)                           │
│  Mini-bomba B + 7 válvulas solenoides NC + sensor de fluxo      │
│                                                                 │
│  Tanque 1 ──┐                                                   │
│  Tanque 2 ──┤                                                   │
│  Tanque 3 ──┤                                                   │
│  Tanque 4 ──┤──► Câmara B ──► BOQU MS-400 (pH/turb/CE/OD)      │
│  Tanque 5 ──┤              ──► BOQU NH4N-2000 (NH₄⁺)           │
│  Tanque 6 ──┤         (~10 min medição + ~0,5 min purga/tanque) │
│  Tanque 7 ──┘   (buffer/depuração — incluso no manifold)        │
└─────────────────────────────────────────────────────────────────┘

  Temperatura: 7× DS18B20 fixos nos tanques (1-Wire) — contínuo
```

---

### Ciclo Rápido — OD (parâmetro crítico, mata em minutos)

- **Sensores:** 2× BOQU DOF-2000 (fluorescência óptica, RS485 Modbus, sem membrana)
- **Ciclo real:** ~2,5 min/tanque (2 min medição + ~30 s purga) → **~18–22 min para os 7 tanques** (janela cega máxima revisada)
- **Saída:** controla diretamente os inversores WEG e dispara alertas de emergência via Telegram e SMS
- **Precisão:** ±0,1 mg/L
- **Manutenção:** limpeza quinzenal com esponja macia (5 min); sem membrana, sem eletrólito
- **Cross-check:** a leitura OD do MS-400 (ciclo lento) é usada como verificação cruzada das DOF-2000 para detecção de deriva

### Ciclo Lento — Parâmetros de qualidade (escalam em horas a dias)

- **BOQU MS-400** (5-em-1: pH + turbidez + condutividade + OD + temperatura, RS485)
  - Ciclo real: ~10,5 min/tanque → ~75–80 min para os 7 tanques
  - Precisão pH: ±0,1 | Turbidez: ±2 NTU | CE: ±1% FS
  - Eletrodo de pH: vida útil 6–12 meses; manter 1 sobressalente (~R$ 300)

- **BOQU NH4N-2000** (NH₄⁺ colorimétrico, RS485 Modbus)
  - Método: colorimétrico (indofenol azul) — resistente a interferências iônicas de Ca²⁺ e Mg²⁺
  - Precisão: ±0,1 mg/L NH₄⁺-N | Faixa: 0–10 mg/L
  - Ciclo: integrado ao ciclo lento — ~75–80 min/volta completa
  - Reagentes: ~300–400 medições por kit (~R$ 600–800); reposição mensal
  - **NH₃ livre** calculado automaticamente pelo CLP: `NH₃_livre = f(TAN, pH, T)` — sem sensor adicional

- **7× DS18B20** (temperatura digital 1-Wire, fixos em cada tanque)
  - Medição contínua e em tempo real — **não multiplexados**
  - Precisão: ±0,5°C | MTBF: >10 anos | Sem calibração de campo

---

## Integração com ERP

Todos os dados coletados pelo CLP são enviados ao ERP em desenvolvimento via protocolo a definir (REST/MQTT). O ERP assume as responsabilidades de datalogging histórico, dashboards e relatórios. O CLP mantém buffer local mínimo para cobrir eventuais quedas de conectividade.

**Dados enviados ao ERP por tanque:**
- OD (ciclo rápido e cross-check MS-400)
- pH, turbidez, condutividade (ciclo lento)
- NH₄⁺, NH₃ livre calculada
- Temperatura (DS18B20)
- TAN tendência (proxy de saúde do percolador)
- Status das válvulas makeup/overflow (aberta/fechada + duração de cada evento)
- Volume acumulado de makeup water por tanque/dia
- Frequência dos inversores (% potência dos sopradores)
- Eventos de alarme e histórico de acionamentos

---

## Classificação dos Parâmetros por Urgência

| Parâmetro | Tempo para dano | Monitoramento | Ação automática |
| :--- | :---: | :--- | :--- |
| OD (tanques) | 5–30 min | Ciclo rápido (~22 min) | Sim — inversores WEG |
| TAN (tendência percolador) | Horas–dias (nitrificação cai) | Ciclo lento — se TAN > 1,5 por 2 leituras | Alerta + inspeção manual do percolador |
| NH₃ livre | 2–12 h | Calculado (TAN + pH + T) | Alerta + abre makeup water |
| NH₄⁺ (TAN) | Horas | Ciclo lento (~80 min) | Abre makeup water se > 1,0 mg/L |
| pH | Horas | Ciclo lento (~80 min) | Abre makeup water se < 6,5 ou > 8,5 |
| NO₂⁻ | Dias | Manual 2–3×/semana (fotômetro) | — |
| Temperatura | Dias | DS18B20 contínuo por tanque | Bomba de Calor (Fase 3) |
| Turbidez/CE | Dias–semanas | Ciclo lento (~80 min) | Abre makeup water se turbidez > 50 NTU |
| Alcalinidade | Dias (nitrificação) | Manual 2×/semana (titulação) | Adição manual NaHCO₃ |
| Nitrato (NO₃⁻) | Semanas | Manual 2×/semana (fotômetro) | Troca manual se > 300 mg/L |
| KH | Semanas | Manual mensal (kit aquário) | — |

---

## Lógica do Inversor

### Alternância Diária dos Sopradores (Uso Intercalado)

O sistema opera com **1 soprador ativo + 1 soprador em standby**, alternando a cada 24 horas. Isso mantém cada soprador dentro da faixa eficiente da curva característica de canal lateral (~40–50 Hz) — evitando operação abaixo de 30 Hz que causa superaquecimento e vibração.

- **Ciclo padrão:** Soprador A ativo por 24 h → Soprador B ativo por 24 h → repete indefinidamente.
- **Troca:** Executada pelo CLP automaticamente à meia-noite (00:00), fora do pico biológico.
- **Failover automático:** Se corrente do soprador ativo cair a zero (falha), o standby assume em < 2 s + alerta Telegram/SMS.
- **Reforço de emergência:** Se OD < 3,5 mg/L e soprador ativo já em frequência máxima, o standby é ativado em paralelo para dobrar a vazão de ar.
- **Desgaste equalizado:** Cada soprador acumula ~4.380 h/ano (50% do tempo) — vida útil ~2× maior vs. um único soprador contínuo.

Um soprador de 2 CV a 40–50 Hz entrega ~100–110 m³/h, cobrindo a demanda de aeração de todos os 7 tanques (pico calculado: ~100 m³/h com fator de segurança 2×). O segundo soprador é redundância real, não sobredimensionamento.

### Controle de Frequência (soprador ativo)

- **OD > 6 mg/L:** Frequência mínima (~40 Hz — limite inferior eficiente do canal lateral).
- **OD < 4,5 mg/L:** Frequência aumenta progressivamente até 50 Hz.
- **OD < 3,5 mg/L:** Frequência máxima (50 Hz) + standby ativado em paralelo + alerta crítico via Telegram e SMS.
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

## Sanitização Automática dos Manifolds

Biofilme em tubulação PVC inviabiliza leituras em ~3 meses. O CLP executa flush mensal automático com hipoclorito 50 ppm via válvula adicional em cada manifold, controlada por temporização programada (ex: primeiro domingo do mês, 03h00). Após o flush, ciclo de enxágue com água limpa antes de retomar monitoramento.

---

## Protocolo de Calibração Periódica

| Sensor | Frequência | Procedimento | Custo/ano |
| :--- | :---: | :--- | ---: |
| pH (MS-400) | Mensal | Tampões 4 e 7 | ~R$ 80 |
| OD (DOF-2000) | Trimestral | Zero (Na₂SO₃) + ar saturado | ~R$ 30 |
| NH₄⁺ (NH4N-2000) | Trimestral | Padrão 1 mg/L NH₄Cl | ~R$ 60 |

---

## Segurança Energética

O sistema possui uma camada de proteção contra apagões:

- **UPS 600 VA:** Alimenta eletrônica de controle (CLP, sensores, modem, IHM) — cobre a transição até o gerador assumir.
- **Gerador a Gasolina (8–10 kVA):** Com Quadro de Transferência Automática (QTA).
- **Tempo de acionamento:** < 15 segundos após queda de energia.
- **Cargas protegidas (essenciais):** Sopradores + CLP + sensores + UPS.
- **Cargas NÃO protegidas:** Bomba de Calor (a água leva horas para esfriar, mas peixes morrem em minutos sem ar).
- **Combustível:** Manter reserva mínima de 20 litros para ~8 horas de operação. Gasolina armazenada degrada em ~3 meses — usar aditivo estabilizante ou fazer rodízio mensal do estoque.

---

## Riscos e Limitações

- **Janela cega do OD:** O ciclo rápido real é ~18–22 min (incluindo tempo de purga). Mitigação: inversores nunca abaixo de 50% de potência na madrugada; sensor de fluxo dispara alarme em caso de falha de bomba ou válvula.
- **Falha de válvula solenoide travada aberta:** Risco de cross-contamination entre tanques no manifold. Mitigação: válvulas NC (normalmente fechadas) — falha elétrica = fecha automaticamente.
- **Eletrodo pH do MS-400:** Componente de maior desgaste do sistema; troca programada a cada 6–12 meses. Manter 1 eletrodo sobressalente em estoque.
- **Reagente NH4N-2000 esgotado:** O analisador emite alarme com 48h de antecedência. Manter 1 kit reserva (~R$ 700).
- **Bomba peristáltica:** Vida útil de 2.000–5.000 h. Bomba reserva disponível no painel para substituição sem parada prolongada.

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
| :--- | :---: | ---: |
| CLP industrial + IHM 7" + painel elétrico + RS485 | 1 | 7.500 |
| Inversores de Frequência WEG CFW11 2CV | 2 | 4.200 |
| BOQU DOF-2000 (sensor OD óptico, RS485) — tanques | 2 | 2.500 |
| Sensor pressão diferencial (filtro tela — alerta colmatação) | 1 | 400 |
| BOQU MS-400 (pH + turbidez + CE + OD + T, RS485) | 1 | 2.000 |
| BOQU NH4N-2000 (NH₄⁺ colorimétrico, RS485) | 1 | 5.000 |
| DS18B20 (temperatura por tanque, 1-Wire) | 7 | 350 |
| Manifold A (OD) + válvulas NC + mini-bomba + sensor de fluxo | 1 | 3.500 |
| Manifold B (qualidade) + válvulas NC + mini-bomba + sensor de fluxo | 1 | 3.200 |
| Bomba peristáltica reserva | 1 | 200 |
| Gerador 8–10 kVA + QTA | 1 | 12.000 |
| UPS 600 VA | 1 | 500 |
| Isolador galvânico RS485 + DPS | 1 | 800 |
| Modem GSM (fallback SMS) + chip | 1 | 300 |
| Válvula sanitização manifold + kit hipoclorito (1º ano) | 2 | 300 |
| Mão de obra técnica (instalação + programação CLP) | 1 | 4.500 |
| **TOTAL FASE 2** | | **R$ 47.250** |
