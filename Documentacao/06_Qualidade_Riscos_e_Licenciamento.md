# 06. Qualidade, Riscos e Licenciamento

## Resumo
Consolidação de todos os requisitos de qualidade do produto final (depuração), manejo hídrico, mapeamento de riscos técnicos e operacionais, e requisitos legais obrigatórios para operar em Minas Gerais.

---

## 1. Qualidade — Depuração (Off-Flavor)
A Geosmina (composto produzido por cianobactérias e actinomicetos) causa o indesejável "gosto de barro" no filé. Em sistemas intensivos, a concentração é inevitavelmente alta.

### Processo Obrigatório
1. A despesca (~2.200 kg vivo) é dividida em **3 lotes/mês** (~733 kg cada) e cada lote é transferido ao **tanque de depuração dedicado (7º tanque, 60m³)**.
2. **Jejum alimentar forçado** em fluxo contínuo de água do poço artesiano por **3 a 5 dias**.
3. O jejum purga compostos organolépticos pelas brânquias e esvazia o trato digestório.
4. **Teste sensorial** antes da liberação: cozinhar uma amostra e avaliar sabor/odor.

### Impacto Financeiro
- Peixes vendidos SEM depuração adequada terão desconto de mercado de 30–50% no preço do kg.
- Peixes COM depuração: R$ 45/kg de filé (preço conservador de atacado).

---

## 2. Manejo Hídrico — Fonte e Protocolo

### Fonte Hídrica: Poço Artesiano Existente
O terreno possui **poço artesiano existente**, eliminando o custo de perfuração e a necessidade de outorga de captação superficial. Providenciar:
- Análise físico-química e microbiológica da água (pH, dureza, alcalinidade, ferro, amônia, coliformes) antes do start-up. Custo ~R$ 200–400 em laboratório credenciado.
- Verificar se o poço possui registro no IGAM. **Este projeto utiliza ~18 m³/dia**, ultrapassando o limiar de uso insignificante (≤ 10 m³/dia). É necessário solicitar **outorga formal** via SOUT — ver seção 4.2. Obter laudo de capacidade do poço antes de iniciar a operação.
- Instalação de bomba submersa com pressostato para reposição automática dos tanques.

### Protocolo de Renovação
- Trocas parciais (5–10% do volume total) quando Amônia > 1,0 mg/L ou Nitrito > 0,5 mg/L.
- Limpeza de sólidos contínua pelo dreno central (Dual Drain).
- **No inverno:** minimizar renovações desnecessárias — água fria do poço (~18°C) gera carga adicional na bomba de calor.

### Bioflocos (BFT) — Incompatível com este Projeto

A tecnologia BFT é **fundamentalmente incompatível** com o design Cornell Dual-Drain adotado neste projeto:

- **Conflito de princípios:** O BFT mantém microrganismos em suspensão como componente produtivo (os próprios flocos são o "filtro biológico"). O Cornell Dual-Drain remove ativamente os sólidos suspensos pelo dreno central — ele descartaria os flocos constantemente, inviabilizando a colonização bacteriana necessária ao BFT.
- **Sensibilidade do OD:** O BFT exige OD ≥ 5 mg/L contínuo — qualquer queda abaixo disso causa colapso da comunidade microbiana e consumo massivo de oxigênio pela matéria orgânica em decomposição.
- **Monitoramento diário:** Requer controle preciso da relação C:N (15:1–20:1) com dosagem de melaço. Dosagem incorreta dispara explosão bacteriana heterotrópica com mortalidade de lote inteiro.
- **Conclusão:** Para adotar BFT seria necessário redesenhar completamente a hidrodinâmica dos tanques, eliminando o Dual-Drain. Dado o custo-benefício favorável da ração própria (Fase 4), não há justificativa técnica ou financeira para essa mudança.

---

## 3. Riscos Técnicos e Operacionais

### Risco Crítico: Falha de Energia
- **Probabilidade:** Média (BH tem rede estável, mas chuvas de verão causam quedas).
- **Impacto:** Mortalidade de 100% em 30–60 minutos sem aeração com biomassa alta.
- **Mitigação:** Gerador 8–10 kVA com QTA (Fase 2). Reserva mínima de 20 L de gasolina (~8h de operação dos sopradores).

### Risco Crítico: Falha da Bomba de Calor no Inverno
- **Probabilidade:** Baixa (equipamentos industriais são confiáveis).
- **Impacto:** Queda de temperatura progressiva (não imediata). Peixes param de comer em < 20°C, mortalidade em < 15°C.
- **Mitigação:** Manter contrato de assistência técnica com prazo de atendimento ≤ 24h. O isolamento (lã de rocha nas paredes) e os painéis EPS 50mm noturnos retardam significativamente a perda térmica (360m³ têm grande inércia), dando tempo para reparo. Sombrite 50% reduz perdas diurnas adicionalmente.

### Risco Moderado: FCA Real > 1,3
- **Causa:** Ração de baixa qualidade, arraçoamento excessivo, estresse térmico, ou óleo oxidado na ração própria.
- **Impacto:** Redução de margem de lucro.
- **Mitigação:** Biometrias quinzenais para ajustar quantidade de ração. Antioxidante obrigatório no óleo da graxaria (ver Doc 04).

### Risco Moderado: Mortalidade por Doença Bacteriana
- **Causa:** Estreptococose (*Streptococcus agalactiae* — principal causa de mortalidade em tilápia intensiva), Columnaris (*Flavobacterium columnare*).
- **Impacto:** Perda de até 30–50% do lote. Mortalidade da Estreptococose aumenta acima de 30°C.
- **Mitigação:** Banhos profiláticos de sal (NaCl 3–5 g/L por 30 min), qualidade de água rigorosa (amônia < 1 mg/L, nitrito < 0,5 mg/L), premix vitamínico na ração (vitaminas C e E), quarentena de alevinos por 5–7 dias em tanque isolado antes de integrar ao sistema.

### Risco Moderado: TiLV — Tilapia Lake Virus
- **Causa:** *Tilapia tilapinevirus* (TiLV), identificado no Brasil a partir de 2018. Presente em criatórios do Nordeste e Sudeste brasileiro.
- **Impacto:** Mortalidade de 20–90% do lote; sem tratamento aprovado. Afeta principalmente tilápias com estresse por má qualidade de água ou superpopulação.
- **Mitigação:** **Comprar alevinos exclusivamente de fornecedores com certificação sanitária MAPA e laudo negativo para TiLV** (GenoMar, Supreme, Aquabel). Quarentena obrigatória de novos lotes por 10–14 dias antes da entrada no sistema principal. Notificar imediatamente o IMA-MG em caso de mortalidade atípica — o TiLV é de notificação compulsória no Brasil.

### Risco Moderado: Saprolegniose (Fungos de Água Fria)
- **Causa:** *Saprolegnia* spp. — fungo oportunista que infecta feridas e peixes debilitados. Prolifera intensamente em temperaturas abaixo de 18°C.
- **Impacto:** Infecção sistêmica com mortalidade elevada em alevinos. Risco concentrado nos meses de inverno (maio–agosto) durante flutuações térmicas.
- **Mitigação:** Manter temperatura acima de 24°C (Fase 3 — Bomba de Calor). Em caso de falha térmica, adicionar sal (NaCl 1–3 g/L) preventivamente. Remover imediatamente peixes mortos do tanque para evitar propagação por esporos.

### Risco Moderado: Concentração de Clientes B2B
- **Causa:** Dependência de poucos restaurantes para 80% do volume vendido.
- **Impacto:** Inadimplência ou cancelamento de 1–2 clientes pode gerar acúmulo de estoque e pressão no fluxo de caixa.
- **Mitigação:** Manter carteira mínima de **8–10 restaurantes ativos** para que nenhum cliente represente mais de 15–20% do faturamento B2B. Diversificar por tamanho (pequeno, médio, grande).

### Risco Operacional: Falta de Alevinos de Qualidade
- **Causa:** Fornecedores sazonais ou problemas genéticos.
- **Mitigação:** Manter ao menos 2 fornecedores homologados (ex: GenoMar, Aquabel, Supreme) com certificação sanitária TiLV.

### Risco Operacional: Ganho de Fotoperíodo Abaixo do Esperado
- **Causa:** Os estudos de referência (Vera Cruz & Brown 2007; Rad et al. 2006) usam linhagens específicas e condições controladas. O ganho de +15% é conservador, mas não garantido sem validação local.
- **Impacto:** Se o ganho real for 5–8% em vez de 15%, o impacto financeiro é moderado (diferença de ~R$ 2.000–4.000/mês no faturamento).
- **Mitigação:** **Recomendado: piloto em 2 tanques por 1 ciclo completo (6 meses) antes de implantar o sistema LED em todos os 6 tanques.** Isso reduz o risco de investir R$ 52.760 (Fase 3) sem validar o ganho produtivo local. O LED IP68 por tanque custa ~R$ 443 — teste barato antes da escala.

---

## 4. Licenciamento Obrigatório — Minas Gerais

### 4.1 Licenciamento Ambiental (COPAM/FEAM)
- **Base legal:** DN COPAM nº 217/2017, Código **G-02-12-7** (Aquicultura, exceto tanque-rede).
- **Sistema:** SLA (Sistema de Licenciamento Ambiental) via portal [Eco Sistemas](https://ecossistemas.meioambiente.mg.gov.br).
- **Modalidade:** Depende do porte e potencial poluidor. Provável enquadramento em **LAS (Licenciamento Ambiental Simplificado)** por RAS/Cadastro.
- **Custo estimado:** R$ 2.000 a R$ 8.000 (taxas + responsável técnico).

### 4.2 Outorga de Recursos Hídricos (IGAM)
- **Finalidade:** Autorização para uso do poço artesiano existente e lançamento de efluentes.
- **Sistema:** SOUT via portal Eco Sistemas.
- **Limiar de uso insignificante (IGAM/MG):** captação subterrânea ≤ 10 m³/dia para um único usuário. **Este projeto utiliza ~18 m³/dia** (reposição hídrica estimada para 7 tanques × 60m³, renovação parcial diária com água do poço), portanto **ultrapassa o limiar de uso insignificante** e requer outorga formal junto ao IGAM.
- **Ação obrigatória:** Solicitar outorga via SOUT antes do início da operação. O processo inclui: declaração de uso, análise de disponibilidade hídrica e, possivelmente, perfuração de poço complementar se a vazão do poço existente for insuficiente. Consultar hidrogeólogo para laudo de capacidade do poço.
- **Custo estimado (outorga formal):** R$ 1.500 a R$ 4.000 (taxas IGAM + responsável técnico).

### 4.3 Cadastro no IMA (Instituto Mineiro de Agropecuária)
- **Finalidade:** Registro do estabelecimento aquícola, sanidade animal, biosseguridade.
- **Custo estimado:** Gratuito (isento de taxas).

### 4.4 Inspeção Sanitária (SIE-MG ou SIM)
- **SIM (Serviço de Inspeção Municipal):** Permite venda dentro do município. Mais simples.
- **SIE (Serviço de Inspeção Estadual):** Permite venda em todo o estado de MG. Obrigatório para escalar.
- **SIF (Serviço de Inspeção Federal):** Para venda nacional ou exportação. Complexo e caro — deixar para expansão futura.
- **Custo estimado (SIE):** R$ 1.000 a R$ 5.000.

### 4.5 Registro MAPA — Fábrica de Ração e Graxaria (Fase 4)
A fabricação de ração animal e a comercialização de farinha de peixe excedente requerem registro no **MAPA (Ministério da Agricultura, Pecuária e Abastecimento)**:
- **Fabricante de ração:** Registro no MAPA via SRA (Serviço de Registro e Análise) — obrigatório mesmo para uso próprio em escala semi-industrial.
- **Comércio de farinha excedente:** Registro como ingrediente para alimentação animal (DIPOA/MAPA).
- **Ação:** Consultar o escritório regional do MAPA-MG antes de instalar a Fase 4. O não-cumprimento pode resultar em autuação e embargo da fábrica.
- **Custo estimado:** R$ 1.000 a R$ 3.000 (taxas + responsável técnico).

### 4.6 Homologação CEMIG — Sistema Solar (Fase 5)
Sistemas fotovoltaicos acima de 10 kWp conectados à rede podem exigir **Estudo de Impacto na Rede (EPIN)** pela CEMIG:
- Prazo de aprovação: 3–9 meses após protocolo.
- **Ação:** Iniciar processo de solicitação com antecedência de pelo menos 6 meses antes da instalação prevista.
- Custo já incluído no CAPEX da Fase 5 (projeto de engenharia + ART + homologação: R$ 3.500).

### Custo Total Estimado de Licenciamento
| Item | Valor |
| :--- | :--- |
| Licenciamento Ambiental COPAM | R$ 5.000 |
| Outorga IGAM (formal — uso acima do limiar insignificante) | R$ 2.500 |
| Cadastro IMA | Gratuito |
| SIE-MG | R$ 3.000 |
| Registro MAPA (fábrica ração + graxaria) | R$ 1.500 |
| Responsável técnico (eng. de pesca ou zootecnista, estimativa) | R$ 3.000 |
| **TOTAL** | **~R$ 15.000** |

*Obs: O orçamento original de R$ 10.000 subestimava a outorga IGAM (uso > 10 m³/dia exige outorga formal) e não incluía os honorários do responsável técnico (obrigatório para COPAM e SIE). O CAPEX da Fase 1 em Doc 07 prevê R$ 10.000 para licenciamento — recomenda-se reservar R$ 15.000 ou ajustar a linha de CAPEX.*

---

## 5. Checklist de Conformidade Legal (Pré-Operação)
- [ ] Análise físico-química e microbiológica da água do poço artesiano
- [ ] Contratar responsável técnico (engenheiro de pesca ou zootecnista) — obrigatório para COPAM e SIE
- [ ] Laudo hidrogeológico do poço artesiano (capacidade de vazão para ~18 m³/dia)
- [ ] Cadastro no portal Eco Sistemas (pessoa física ou jurídica)
- [ ] Verificar dominialidade da água via IDE Sisema
- [ ] Solicitar LAS via SLA (COPAM)
- [ ] Solicitar Outorga Formal via SOUT (IGAM) — uso ~18 m³/dia supera limiar de uso insignificante
- [ ] Registrar no IMA (cadastro do estabelecimento aquícola)
- [ ] Solicitar SIM ou SIE para processamento e venda (antes da primeira despesca — mês 7)
- [ ] Verificar certificação sanitária TiLV dos fornecedores de alevinos antes do primeiro lote
- [ ] Fase 4: Consultar MAPA sobre registro de fábrica de ração e comércio de farinha antes de instalar
- [ ] Fase 4: Piloto de fotoperíodo — testar sistema em 2 tanques por 1 ciclo completo (6 meses) antes de escalar para todos os 6 tanques
- [ ] Fase 5: Iniciar processo de homologação CEMIG com 6 meses de antecedência
