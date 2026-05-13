# 04. Fábrica de Ração (Fase 4)

## Resumo
Implantação de uma fábrica semi-industrial de ração extrusada flutuante, reduzindo o custo do kg de R$ 4,45 (comercial) para R$ 2,10 (própria). A ração flutuante é obrigatória para evitar acúmulo de ração não consumida no fundo dos tanques.

## Justificativa Financeira
- **Custo mensal com ração comercial:** R$ 12.950/mês (2.910 kg × R$ 4,45)
- **Custo mensal com ração própria:** R$ 6.111/mês (2.910 kg × R$ 2,10)
- **Economia mensal:** R$ 6.839/mês → **R$ 82.068/ano**
- **Payback da fábrica (CAPEX ~R$ 63k):** ~9 meses após operação.

## Equipamentos

### Extrusora
- **Tipo:** Extrusora mono-rosca semi-profissional (motor 15-25 CV).
- **Capacidade:** 100-200 kg/h (cobre a demanda mensal de 2.910 kg em ~20h de operação/mês).
- **Função:** Expandir o pellet por alta pressão e temperatura, garantindo flutuabilidade (pellet afunda = desperdício + poluição do tanque).

### Processamento
- **Moinho de Martelos:** Moer grãos e ingredientes secos.
- **Misturador Horizontal:** Homogeneizar a dieta.
- **Secagem:** Por convecção natural (bandejas ao sol em estufa de secagem simples) ou secador tipo transportador.
- **Armazenamento:** Sacos de ráfia em local seco e ventilado. Validade da ração caseira: ~30 dias.

## Formulação Base (por 100kg de ração)

### Ração de Engorda (28-32% PB)
| Ingrediente | Quantidade (kg) | Custo/kg | Custo (R$) |
| :--- | :---: | :---: | :---: |
| Farelo de Soja (45% PB) | 40 | R$ 2,20 | R$ 88,00 |
| Milho Moído | 35 | R$ 1,00 | R$ 35,00 |
| Silagem de Pescado | 15 | R$ 0,30 | R$ 4,50 |
| Farinha de Peixe ou Carne | 5 | R$ 4,00 | R$ 20,00 |
| Premix vitamínico/mineral | 3 | R$ 8,00 | R$ 24,00 |
| Óleo de soja | 2 | R$ 6,00 | R$ 12,00 |
| **TOTAL** | **100 kg** | | **R$ 183,50** |
| **Custo por kg** | | | **R$ 1,84** |

*Com margem para energia elétrica, mão de obra e perdas → custo final estimado: **R$ 2,10/kg**.*

### Ração Inicial (40-45% PB)
Para alevinos, a formulação exige maior teor proteico (mais farinha de peixe e soja). Custo estimado: ~R$ 3,00/kg. Porém, o volume consumido nesta fase é muito pequeno (~105 kg/mês), não impactando significativamente o OPEX.

## Silagem Ácida de Pescado (Economia Circular)
- **Matéria-prima:** Resíduos brutos da filetagem (cabeças, espinhas, vísceras, pele) — ~1.109 kg/despesca após separação da barriguinha e recortes para linguiça (ver Doc 08).
- **Processo:** Moer os resíduos + acidificar com ácido fórmico (3% v/p). Estabiliza a proteína por hidrólise ácida. Pronto para uso em 3-7 dias.
- **Armazenamento:** Contêineres IBC rígidos de 1.000L (usados, custo de R$ 80-150 cada).
- **Rendimento:** 15-20% da composição da ração.

*Nota: Com a implantação da Graxaria (seção abaixo), a silagem ácida é substituída/complementada por farinha de peixe de maior concentração proteica, otimizando o FCA.*

---

## Graxaria — Farinha e Óleo de Peixe

### Justificativa
O resíduo bruto da filetagem (~1.109 kg/despesca) contém alto teor proteico e lipídico. A graxaria converte esse resíduo em dois insumos que a fazenda atualmente compra de terceiros: **farinha de peixe** e **óleo de peixe**. A autossuficiência nesses ingredientes reduz o custo da ração de R$ 2,10 para ~R$ 1,83/kg.

### Processo da Graxaria

```
Resíduo bruto (1.138 kg/mês)
   │
   ├─► Cozimento a vapor (digestor) ──────────────────► VAPORES ODOROSOS
   │                                                          │
   ├─► Prensagem (prensa de parafuso)                         ▼
   │      │                                    Condensador + Filtro de Carvão Ativado
   │      ├─► SÓLIDO (torta): secagem ─────────────────► (gases do secador)
   │      │        └─► FARINHA DE PEIXE (~60% PB)
   │      │
   │      └─► LÍQUIDO (caldo): centrifugação → ÓLEO DE PEIXE + antioxidante
   │                                          └─► Água de cola → irrigação
   └─► Produção mensal estimada
```

### Controle de Odor

O cozimento e a secagem de resíduos de peixe geram compostos voláteis de aminas e ácidos graxos com odor intenso. O controle é **obrigatório** tanto para o conforto operacional quanto para a conformidade ambiental (COPAM/FEAM — DN 217/2017 contempla emissões atmosféricas de unidades de processamento).

**Duas fontes de odor e suas mitigações:**

| Fonte | Composto Odoroso | Solução |
| :--- | :--- | :--- |
| Vapores do digestor (cozimento) | Aminas, H₂S, mercaptanas | **Condensador de vapores** — resfria e condensa os gases antes do lançamento; recupera água de processo |
| Ar de exaustão do secador | Compostos orgânicos voláteis (COVs) | **Filtro de carvão ativado** — adsorve COVs residuais pós-condensador |

**Sequência de tratamento:**
1. Vapores do digestor e secador → condensador (resfriamento a água, T < 40°C)
2. Condensado retorna ao processo (reaproveitamento de água)
3. Gás não-condensável → filtro de carvão ativado (leito de 100–200 kg de carvão)
4. Troca do carvão: a cada 3–6 meses dependendo da carga operacional

**Dimensionamento mínimo para 1.138 kg/mês de resíduo:**
- Condensador de tubo e carcaça: área de troca ~2–4 m²
- Filtro de carvão ativado: leito de 100 kg (carvão mineral ou de coco)
- Vida útil do carvão: ~4–6 meses → reposição ~R$ 400–600/troca

### Dimensionamento Mensal

| Entrada | Qtd (kg/mês) |
| :--- | :---: |
| Resíduo bruto (58% do peso vivo) | 1.109 |
| Recortes excedentes (77 − 48 da linguiça) | 29 |
| **Total entrada graxaria** | **1.138 kg** |

| Saída | Rendimento | Produção (kg/mês) | Necessidade ração* | Excedente |
| :--- | :---: | :---: | :---: | :---: |
| Farinha de peixe (~60% PB) | 22% | ~250 kg | 146 kg | ~104 kg |
| Óleo de peixe | 6% | ~68 kg | 58 kg | ~10 kg |

*Necessidade da ração: 2.910 kg/mês × 5% farinha + 2% óleo (fórmula base)

### Impacto na Formulação da Ração

A graxaria torna a fazenda autossuficiente nos dois insumos de origem animal da fórmula:

| Ingrediente | Custo anterior | Custo com graxaria | Economia/mês |
| :--- | :---: | :---: | :---: |
| Farinha de peixe (146 kg × R$ 4,00) | R$ 584 | R$ 0 | **−R$ 584** |
| Óleo de peixe subst. óleo de soja (58 kg × R$ 6,00) | R$ 348 | R$ 0 | **−R$ 348** |
| **Total economia** | | | **−R$ 932/mês** |

**Novo custo médio da ração com graxaria:** ~R$ 1,83/kg (antes: R$ 2,10/kg)
**Novo custo mensal de ração:** ~R$ 5.326 (antes: R$ 6.111) → **economia de R$ 785/mês**

*O excedente de farinha de peixe (~104 kg/mês) pode ser vendido a R$ 4,00/kg → receita adicional de R$ 416/mês.*

### Estabilização do Óleo de Peixe — Antioxidante Obrigatório

O óleo de peixe possui alto teor de ácidos graxos poli-insaturados (EPA, DHA) que oxidam rapidamente em contato com o ar. **Sem proteção antioxidante, o óleo ranfia em 2–5 dias** a temperatura ambiente, gerando peróxidos lipídicos que causam hepatotoxicidade e reduzem severamente o FCE dos peixes.

**Protocolo obrigatório:**
- Adicionar antioxidante imediatamente após a extração por centrifugação, antes do armazenamento
- **Opção 1 — BHT (Butil-Hidroxi-Tolueno):** 100–200 ppm do peso do óleo. Sintético, altamente eficaz, baixo custo (~R$ 30/kg). Dose: 0,1–0,2 g/kg de óleo.
- **Opção 2 — Tocoferóis naturais (vitamina E):** 500–1.000 ppm. Aceito em produção orgânica/natural. Custo ~R$ 80/kg.
- **Armazenamento:** Tanques fechados, atmosfera de nitrogênio ou CO₂ se possível; temperatura < 20°C; uso preferencial em até 30 dias.

### Água de Cola — Aproveitamento em Irrigação

A centrifugação gera **água de cola** (stick water): líquido rico em proteínas solúveis, peptídeos, aminoácidos livres e sais minerais (~1–3% de PB), com DBO elevada (5.000–15.000 mg/L). Descarte direto em efluentes viola COPAM.

**Uso em irrigação:** A água de cola pode ser diluída e utilizada como **biofertilizante líquido** para irrigação de hortas, pastagens ou culturas anuais no próprio terreno:
- Diluição recomendada: 1:10 a 1:20 (agua de cola : água limpa) para evitar fitotoxicidade
- Volume gerado: estimado ~50–80 L/despesca (~600–960 L/ano)
- Benefício: fornece nitrogênio orgânico e fósforo para as plantas
- **Restrição:** Não aplicar em áreas próximas à captação do poço artesiano. Verificar com agrônomo as culturas compatíveis.

### Equipamentos — Graxaria

| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Digestor/cozinhador a vapor (200–500 kg/h) | 1 | 12.000 |
| Prensa de parafuso (expeller) | 1 | 8.000 |
| Secador rotativo ou de bandeja | 1 | 10.000 |
| Tanques de armazenamento de óleo | 2 | 2.000 |
| Instalações hidráulicas e elétricas | 1 | 3.000 |
| **Subtotal Processo** | | **R$ 35.000** |
| Condensador de vapores (tubo e carcaça, 2–4 m²) | 1 | 4.500 |
| Filtro de carvão ativado (leito 100 kg) | 1 | 3.500 |
| Tubulação e conexões do sistema de exaustão | 1 | 2.000 |
| **Subtotal Controle de Odor** | | **R$ 10.000** |
| **TOTAL GRAXARIA** | | **R$ 45.000** |

## Riscos e Limitações
- **Formulação nutricional:** Erros na proporção de aminoácidos essenciais (lisina, metionina) podem degradar o FCA. Recomenda-se consultar um zootecnista para validar a fórmula antes de escalar.
- **Controle de umidade:** Ração com umidade > 10% mofa rapidamente. A secagem deve atingir < 10%.
- **Extrusora:** Equipamento de alto custo unitário. Uma falha mecânica pode forçar compra emergencial de ração comercial.
- **Óleo sem antioxidante:** Risco crítico de lote de ração rançosa causando hepatotoxicidade nos peixes. Manter estoque de antioxidante sempre disponível.

### Protocolo de Contingência — Falha da Extrusora

Para evitar interrupção da alimentação durante falha mecânica da extrusora:
1. **Estoque mínimo de segurança:** Manter sempre 1 semana de ração comercial em depósito (~730 kg × R$ 4,45 ≈ R$ 3.250 de capital imobilizado).
2. **Fornecedores homologados:** Cadastrar ao menos 2 fornecedores de ração comercial 32% PB com capacidade de entrega em 24–48h.
3. **Peças de reposição críticas:** Manter estoque mínimo de rosca de extrusão reserva e vedações do cabeçote — peças mais sujeitas a desgaste.

## Custos Estimados — Fase 4 (Fábrica de Ração + Graxaria + Processamento)

### Fábrica de Ração
| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Extrusora mono-rosca semi-profissional | 1 | 45.000 |
| Moinho de Martelos | 1 | 5.000 |
| Misturador Horizontal | 1 | 5.000 |
| Secador / Estrutura de secagem | 1 | 3.000 |
| Contêineres IBC (silagem) | 4 | 600 |
| Insumos iniciais (farelo, premix, etc.) | 1 | 4.000 |
| **Subtotal Ração** | | **R$ 62.600** |

### Graxaria
| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Digestor/cozinhador a vapor | 1 | 12.000 |
| Prensa de parafuso (expeller) | 1 | 8.000 |
| Secador rotativo ou de bandeja | 1 | 10.000 |
| Tanques de armazenamento de óleo | 2 | 2.000 |
| Instalações hidráulicas e elétricas | 1 | 3.000 |
| Condensador de vapores (tubo e carcaça, 2–4 m²) | 1 | 4.500 |
| Filtro de carvão ativado (leito 100 kg) | 1 | 3.500 |
| Tubulação e conexões do sistema de exaustão | 1 | 2.000 |
| **Subtotal Graxaria** | | **R$ 45.000** |

### Resumo Fase 4
| Módulo | Valor (R$) |
| :--- | :---: |
| Fábrica de Ração | 62.600 |
| Graxaria (processo + controle de odor) | 45.000 |
| **TOTAL FASE 4** | **R$ 107.600** |

*Equipamentos de processamento de linguiça (moedor, embutideira, seladora, freezer) estão na Fase 1, pois a produção começa na primeira despesca (mês 7). Ver [Doc 01](01_Infraestrutura_e_Aeracao.md).*
