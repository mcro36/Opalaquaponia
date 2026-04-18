# 8. Riscos, Desafios e Auditoria de Dados

Este documento apresenta uma revisão crítica da documentação anterior (fidelidade aos dados) e identifica problemas operacionais e biológicos que não foram detalhados no escopo inicial, especialmente para sistemas de pequena escala.

## Auditoria de Fidelidade (Data Fidelity)
Os dados consolidados nos documentos 1 a 6 foram extraídos diretamente do escopo técnico fornecido.
- **Sopradores**: O dimensionamento final de 4 unidades de 2.0 CV está correto para a biomassa de 6.2 toneladas (6x60m³).
- **Métricas Financeiras**: Os cálculos de CAPEX (R$ 400 mil) e ROI (Payback < 2 anos) são fidedignos às estimativas industriais de 2024/2025 para sistemas super-intensivos.
- **Escalonamento**: A biomassa dinâmica calculada (120kg a 2100kg por tanque) reflete corretamente o ciclo de 6 meses para Tilápia.

## Problemas Não Mapeados e Riscos Críticos

### 1. Instabilidade em Médas Escalas (Tanques de 5.000L)
Embora os tanques de 5m³ (Diâmetro 2.5m, Altura 1.2m) sejam mais estáveis que os de 1000L, eles ainda apresentam desafios significativos comparados aos de 60m³.
- **Thermal Inertia**: A oscilação térmica em 5m³ é mais rápida. Frentes frias podem derrubar a temperatura da água rapidamente se não houver isolamento térmico nas paredes de lona.
- **Acúmulo de Sólidos**: Em sistemas super-intensivos de 35kg/m³, a carga orgânica em 5m³ atinge o pico rapidamente. A circulação de água deve ser precisamente calibrada para evitar zonas mortas no fundo do tanque.

### 2. Viabilidade Tecnológica x Escala Piloto
- **Custo dos Sensores**: Implementar instrumentação industrial (Sensores RDO, ISE e CLP) em um sistema de 30m³ totais ainda representa um peso alto no CAPEX inicial (cerca de 50% do investimento total).
- **Sugestão**: Focar no controle de Oxigênio (OD) como prioridade absoluta, podendo simplificar os sensores de pH e temperatura nas fases iniciais.

### 3. Saturação de Oxigênio na Madrugada (Alevinos)
A renovação de 10% de água na madrugada ajuda, mas se os tanques T1 a T3 estiverem integrados na mesma linha de aeração dos tanques T4 a T6, há risco de **super-oxigenação** ou estresse por turbulência nos alevinos. 
- **Solução**: Uso de reguladores de pressão manuais extras nos ramais dos tanques iniciais.

### 4. Gestão de Bioflocos (BFT) em Pequena Escala
Manter a proporção C:N em apenas 1000L exige precisão laboratorial. Pequenos erros nas dosagens de melaço podem causar uma explosão bacteriana que consome todo o oxigênio antes que o soprador de emergência atue.

### 5. Logística de Processamento (Filetagem)
Obter rendimento de 33% (filet) exige habilidade técnica. Em pequena escala (apenas 35kg vivos por mês), o custo da mão de obra para filetagem pode corroer a margem se não for feito pelo próprio proprietário.

## Conclusão da Auditoria
O projeto é tecnicamente robusto, mas a transição da teoria (60m³) para a prática experimental (1000L) exige cautela com a **frequência de monitoramento**, que deve ser muito mais constante no sistema piloto.
