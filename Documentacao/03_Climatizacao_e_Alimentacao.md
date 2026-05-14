# 03. Climatização, Fotoperíodo e Alimentação (Fase 3)

## Resumo
Instalação da Bomba de Calor Inverter (48.000 BTU/h, COP ≥ 5) para manter a água a 28°C durante o inverno de BH (mínimas de 11°C), com isolamento de lã de rocha nas paredes, **sistema de cobertura superficial duplo** (sombrite 50% anti-UV fixo durante o dia + painéis EPS 50mm removíveis à noite e em dias frios), e **iluminação LED IP68 nas paredes dos tanques** para fotoperíodo 18L:6D — resultando em +15% de biomassa por ciclo. O **7º tanque** atua como buffer térmico, eliminando picos de carga da água de reposição. Alimentação automatizada com horários por fase de crescimento.

---

## Perfil Climático — Belo Horizonte, MG

| Mês | Máx Média (°C) | Mín Média (°C) | Média (°C) | ΔT (28°C - Média) |
| :---: | :---: | :---: | :---: | :---: |
| Jan | 28 | 19 | 23,5 | 4,5 |
| Fev | 29 | 19 | 24,0 | 4,0 |
| Mar | 28 | 18 | 23,0 | 5,0 |
| Abr | 27 | 16 | 21,5 | 6,5 |
| Mai | 25 | 13 | 19,0 | 9,0 |
| Jun | 24 | 12 | 18,0 | 10,0 |
| **Jul** | **24** | **11** | **17,5** | **10,5** |
| Ago | 26 | 13 | 19,5 | 8,5 |
| Set | 27 | 15 | 21,0 | 7,0 |
| Out | 28 | 17 | 22,5 | 5,5 |
| Nov | 27 | 18 | 22,5 | 5,5 |
| Dez | 27 | 19 | 23,0 | 5,0 |

Sem aquecimento, a produção fica inviável por 3–4 meses/ano (Mai–Ago). A Bomba de Calor é pré-requisito, não luxo.

---

## Sistema de Cobertura Superficial e Fotoperíodo 18L:6D

### Premissa Zootécnica

A tilápia do Nilo é um peixe diurno que regula o hormônio do crescimento (GH) pelo eixo melatonina-fotoperíodo. Coberturas opacas permanentes (ex.: shade balls) criam escuridão contínua (0L:24D), suprimindo o GH e reduzindo a taxa de crescimento em 15–25% vs o controle 12L:12D (Vera Cruz & Brown, 2007; Rad et al., 2006). O sistema adotado **corrige essa perda e adiciona ganho produtivo** implementando 18L:6D (~16,5h no inverno, ~18h no verão).

### Configuração por Período

| Período | Cobertura | LED parede | Finalidade |
| :--- | :---: | :---: | :--- |
| Nascer do sol → pôr do sol (dia claro) | Sombrite 50% | Desligado | Luz natural + anti-predador |
| Pôr do sol (~18h) → 23:00 | Sombrite 50% | **Ligado** | Complemento LED para 18h de luz |
| 23:00 → nascer do sol (~06:00) | EPS 50mm | Desligado | Isolamento térmico + período escuro |
| Dia nublado / frio | EPS 50mm | **Ligado** | Isolamento + luz artificial total |

*EPS colocado ao pôr do sol em todos os dias frios — maximiza o isolamento no período de maior queda de temperatura.*

### Fotoperíodo Resultante

| Estação | Luz natural (sombrite) | LED complemento | Total luz |
| :---: | :---: | :---: | :---: |
| Inverno (julho) | ~11,5h | 5h | **~16,5h** |
| Verão (dezembro) | ~13,0h | 5h | **~18,0h** |

*16,5h no inverno está bem acima do limiar onde o benefício de crescimento se manifesta — estudos mostram ganho significativo a partir de 14L:10D.*

### Impacto Produtivo (18L:6D vs 0L:24D com cobertura opaca)

Com base em literatura (Vera Cruz & Brown 2007; Rad et al. 2006): **+15% de biomassa ao fim do ciclo de 6 meses** (cenário conservador). Aplicado a este projeto:

| Parâmetro | Sem fotoperíodo | Com 18L:6D (+15%) |
| :--- | :---: | :---: |
| Biomassa despesca (kg vivo) | 1.913 | **2.200** |
| Densidade final (kg/m³) | 31,9 | **36,7** |
| Filé total (33%) | 631 kg | **726 kg** |
| Filé para venda | 535 kg | **616 kg** |
| Linguiça produzida | 216 kg | **248 kg** |

*Densidade máxima recomendada para tilápia intensiva: 40–50 kg/m³. O valor de 36,7 kg/m³ está dentro do limite seguro.*

### LED — Especificação Técnica

- **Tipo:** Faixa LED IP68 24V, 14 W/m, fixada na parede interna do tanque (aro metálico), orientação horizontal — ilumina a coluna d'água independentemente da posição do EPS.
- **Por tanque:** 1,8 m de faixa + 1 driver impermeável 24V.
- **Intensidade resultante:** > 50 lux no centro do tanque — suficiente para supressão da melatonina.
- **Acionamento:** Relé digital integrado ao CLP da Fase 2 (sem hardware adicional).
- **Lógica CLP:**
  ```
  SE hora ≥ pôr_do_sol E hora < 23:00 → LED LIGADO
  SE hora ≥ 23:00 OU hora < nascer_do_sol → LED DESLIGADO
  SE dia_nublado E EPS_colocado → LED LIGADO durante todo o dia
  ```

### Sombrite 50% — Especificação

- **Malha anti-UV, sombreamento 50%:** transmite metade da luz solar, bloqueia UV excessivo e garante ventilação.
- **Estrutura:** Armação tubular galvanizada tensionada sobre cada tanque (Ø ~8m para folga de manuseio).
- **Função anti-predador:** Impede acesso de garças (*Ardea alba*, *Egretta thula*) — principal causa de perda não planejada em piscicultura ao ar livre no Brasil.
- **Instalação:** Permanente, não removida na rotina. Afastável lateralmente para acesso eventual (biometrias, manutenção).

### Painéis EPS 50mm — Especificação

- **Material:** Poliestireno expandido (EPS) 50mm, painéis modulares de ~1 m², flutuantes.
- **Redução de perda superficial:** 85–90% vs superfície aberta.
- **Remoção diária:** Painéis empurrados para guias laterais ao nascer do sol (operação ~20 min, 7 tanques). Recolocados ao pôr do sol.
- **Dias nublados/frios:** EPS permanece no lugar durante todo o dia.
- **Manuseio para alimentação:** Alimentadores de rosca/vibratório lançam a ração de forma direcionada. EPS pode ser mantido durante os tratos — a ração cai nos espaços entre painéis.

### 7º Tanque — Cobertura

O 7º tanque (depuração + buffer térmico) recebe o mesmo pacote de cobertura dos tanques de produção:

- **Sombrite 50% anti-UV:** Instalação obrigatória — função primária é **anti-predador** (garças). Na maior parte do mês o tanque está em modo buffer (não há peixes em despesca), mas quando há lote em depuração (3–5 dias/mês) a proteção é essencial. A exposição ao sol também ajuda na manutenção da temperatura durante o pré-aquecimento da água de reposição.
- **EPS 50mm removíveis:** Mesma rotina dos tanques de produção. No modo buffer, o EPS noturno reduz a carga térmica sobre a bomba de calor — cada kWh economizado no 7º tanque é diretamente aproveitado pelos tanques de produção. Custo: ~R$ 1.170 adicionais (área ~43 m²).
- **LED IP68:** Desnecessário no 7º tanque — não há objetivo de fotoperíodo produtivo. Omitido.

*O CAPEX de sombrite + EPS do 7º tanque não está explicitado na tabela de custos da Fase 3 (que cobre 6 tanques). Acrescentar ~R$ 2.170 ao orçamento: R$ 1.000 sombrite + estrutura + R$ 1.170 EPS. Total Fase 3 ajustado: ~R$ 54.930. Para simplificação do modelo financeiro, esse delta de R$ 2.170 é absorvido na reserva de contingência.*

---

## Isolamento Térmico das Paredes — Lã de Rocha (50mm)

- **Condutividade (λ):** 0,040 W/m·K
- **Coeficiente U (com convecção):** ~0,75 W/m²·K
- **Área lateral por tanque:** 32,6 m²
- **Perda lateral por tanque (ΔT 10,5°C pior caso — julho):** ~257 W
- **Instalação:** Placas envolvendo a lateral externa da geomembrana, protegidas com filme plástico contra umidade.

---

## Dimensionamento da Bomba de Calor

### Dois Modos de Operação Térmica

O sistema alterna entre dois perfis de carga conforme cobertura e irradiação solar:

#### Modo 1 — Dia Ensolarado (Sombrite Aberto)

O ganho solar através do sombrite 50% (~3.000 W/tanque médio) compensa as perdas superficiais. A bomba atende principalmente a carga estrutural:

| Componente | Carga (kW) |
| :--- | :---: |
| Lateral T1–T6 (lã de rocha, julho) | 1,5 |
| Fundo T1–T6 | 1,8 |
| 7º tanque estrutural | 1,5 |
| Reposição hídrica (gradual, reduzida de dia) | 1,5 |
| **Total dia ensolarado** | **~6,3 kW** |

*Ganho solar líquido através do sombrite compensa as perdas superficiais — a bomba roda em baixa carga ou intermitente durante o dia.*

#### Modo 2 — Noite e Dias Nublados/Frios (EPS sobre a superfície)

| Componente | Perda/tanque (W) | Perda 6 tanques (kW) |
| :--- | :---: | :---: |
| Superfície (EPS 50mm, 87% redução) | 430 | 2,6 |
| Lateral (Lã de Rocha 50mm) | 257 | 1,5 |
| Fundo (contato com solo) | 300 | 1,8 |
| **Subtotal T1–T6** | **987** | **5,9 kW** |

| Componente | Carga (kW) |
| :--- | :---: |
| Estrutural T1–T6 | 5,9 |
| 7º tanque estrutural (ΔT ~5°C) | 1,5 |
| Reposição hídrica (18 m³/dia, ΔT 4°C, gradual) | 3,5 |
| **TOTAL MODO 2 (PIOR CASO)** | **10,9 kW** |

*Redução de 21,2 kW (design anterior com shade balls 24/7) para 10,9 kW de pico — possibilitando bomba significativamente menor.*

### Especificação

- **Potência térmica pior caso:** ~10,9 kW (37.200 BTU/h)
- **Com margem de segurança (+15%):** ~12,5 kW (**42.700 BTU/h**)
- **Equipamento recomendado:** Bomba de Calor Inverter **48.000 BTU/h** (COP ≥ 5,0)
- **Consumo elétrico (COP 5, carga máxima):** ~2,18 kW elétrico

### Custo Operacional Mensal (Tarifa CEMIG R$ 0,85/kWh)

A bomba opera principalmente à noite (~7h/dia) e em dias nublados/frios. Nos dias ensolarados roda em carga parcial ou intermitente:

| Mês | Custo Bomba de Calor |
| :---: | :---: |
| Jan | R$ 200 |
| Fev | R$ 175 |
| Mar | R$ 240 |
| Abr | R$ 360 |
| Mai | R$ 530 |
| Jun | R$ 640 |
| **Jul** | **R$ 780** |
| Ago | R$ 580 |
| Set | R$ 410 |
| Out | R$ 290 |
| Nov | R$ 245 |
| Dez | R$ 210 |
| **Média Mensal** | **~R$ 388** |
| **Total Anual** | **~R$ 4.660** |

*Redução de ~54% no custo anual vs o design anterior (R$ 10.170 → R$ 4.660), pela combinação de bomba menor + operação noturna predominante + ganho solar diurno.*

---

## Alimentação Automatizada — Horários por Fase

**Janela de alimentação:** 06:15 às 22:30 — respeitando o período de escuridão (23:00–nascer do sol) e o comportamento diurno da tilápia.

O EPS é colocado ao **pôr do sol (~18h)**, mas os alimentadores continuam operando durante o período LED (18h–23h): a ração de rosca é lançada de forma pontual e passa pelos espaços entre os painéis. Após 23:00 (LED desligado), os peixes estão inativos e a alimentação é interrompida.

*06:15 (e não 06:00): 15 min após retirada do EPS ao nascer do sol, para os peixes se acalmarem antes do primeiro trato.*

### Fase 1 — Alevinagem / Recria (Mês 1–2, 10–300 g) — 12 tratos/dia

| Trato | Horário |
| :---: | :---: |
| 1 | 06:15 |
| 2 | 07:45 |
| 3 | 09:15 |
| 4 | 10:45 |
| 5 | 12:15 |
| 6 | 13:30 |
| 7 | 14:45 |
| 8 | 16:00 |
| 9 | 17:15 |
| 10 | 18:30 |
| 11 | 19:45 |
| 12 | 21:00 |

### Fase 2 — Crescimento / Engorda Inicial (Mês 3–4, 300–700 g) — 10 tratos/dia

| Trato | Horário |
| :---: | :---: |
| 1 | 06:15 |
| 2 | 08:00 |
| 3 | 09:45 |
| 4 | 11:30 |
| 5 | 13:15 |
| 6 | 15:00 |
| 7 | 16:30 |
| 8 | 18:00 |
| 9 | 19:30 |
| 10 | 21:00 |

### Fase 3 — Engorda Final (Mês 5–6, 700–950 g) — 8 tratos/dia

| Trato | Horário |
| :---: | :---: |
| 1 | 06:30 |
| 2 | 08:30 |
| 3 | 10:30 |
| 4 | 12:30 |
| 5 | 14:30 |
| 6 | 16:30 |
| 7 | 18:30 |
| 8 | 21:00 |

**Travas de segurança (CLP Fase 2):**
- `SE hora < nascer_do_sol + 15min OU hora ≥ 23:00 → bloquear alimentadores` (período escuro)
- `SE OD < 4,0 mg/L → bloquear alimentadores` (já existente)
- `SE hora = pôr_do_sol → alarme sonoro` (aviso colocação EPS + ligar LED)
- `SE hora = nascer_do_sol → alarme sonoro` (aviso retirada EPS)
- `SE hora = 22:45 → alarme sonoro leve` (aviso último trato em ~30 min)

---

## Riscos e Limitações

- **Bomba de Calor como único agente térmico:** Se falhar no inverno, a temperatura cai progressivamente (não imediatamente — 360m³ têm grande inércia). O EPS noturno ganha tempo adicional para o reparo. Manter contrato de assistência técnica com prazo ≤ 24h.
- **Carga de reposição hídrica:** Gerenciada pelo 7º tanque buffer. Minimizar renovações durante ondas de frio reduz adicionalmente o consumo da bomba.
- **Disciplina na rotina do EPS:** A operação diária de cobrir/descobrir (7 tanques, ~20 min/turno) precisa de responsável definido com substituto para fins de semana e imprevistos. Sem EPS à noite no inverno, a bomba 48k BTU/h pode ser insuficiente para compensar toda a perda superficial.
- **EPS e alimentação:** Os alimentadores de rosca lançam ração de forma pontual, passando pelos espaços entre os painéis. No caso de entupimento ou má posição dos painéis, a ração pode ficar sobre o EPS sem atingir a água — verificação visual periódica necessária.
- **Sombrite e dias muito quentes:** Em veranicos de outubro/novembro com temperaturas acima de 32°C, o sombrite 50% pode ser insuficiente para evitar aquecimento excessivo (> 32°C na água). Monitorar temperatura via CLP e, se necessário, aumentar a vazão do 7º tanque (água mais fria do poço) como resfriamento pontual.

---

## Custos Estimados — Fase 3

| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Bomba de Calor Inverter (48k BTU, COP ≥ 5,0) | 1 | 15.000 |
| Isolamento lã de rocha 50mm (6 tanques) | 6 | 5.400 |
| Painéis EPS 50mm removíveis (6 tanques, ~43 m²) | 6 | 8.200 |
| Sombrite 50% anti-UV + estrutura metálica (6 tanques) | 1 | 7.000 |
| Alimentadores automáticos (vibratório/rosca) | 6 | 10.500 |
| Tubulações térmicas (CPVC) e instalação | 1 | 4.000 |
| Faixas LED IP68 24V + drivers + cabeamento (6 tanques) | 1 | 2.660 |
| **TOTAL FASE 3** | | **R$ 52.760** |
