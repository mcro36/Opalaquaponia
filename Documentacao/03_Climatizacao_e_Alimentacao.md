# 03. Climatização e Alimentação (Fase 3)

## Resumo
Instalação da Bomba de Calor Industrial dimensionada para manter a água a 28°C durante o inverno de BH (mínimas de 11°C), com isolamento térmico de lã de rocha nas paredes e bolas flutuantes pretas na superfície. Alimentação automatizada por timers.

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

Sem aquecimento, a produção fica inviável por 3-4 meses/ano (Mai-Ago). A Bomba de Calor é um pré-requisito, não um luxo.

## Isolamento Térmico

### Paredes — Lã de Rocha (50mm)
- **Condutividade (λ):** 0,040 W/m·K
- **Coeficiente U (com convecção):** ~0,75 W/m²·K
- **Área lateral por tanque:** 32,6 m²
- **Perda lateral por tanque (ΔT 10,5°C pior caso):** ~257 W
- **Instalação:** Placas envolvendo a lateral externa da geomembrana, protegidas com filme plástico contra umidade.

### Superfície — Bolas Flutuantes Pretas (Shade Balls)
- **Função:** Reduzem evaporação em 80-90% e perda por convecção superficial em ~50%.
- **Área superficial por tanque:** 43,0 m²
- **Perda superficial com bolas (pior caso):** ~2.150 W/tanque
- **Benefício adicional:** Absorvem radiação solar e transferem calor para a água por condução durante o dia.

## Dimensionamento da Bomba de Calor

### Carga Térmica Total (6 tanques, pior caso — Julho)

| Componente | Perda/tanque (W) | Perda 6 tanques (kW) |
| :--- | :---: | :---: |
| Lateral (com Lã de Rocha 50mm) | 257 | 1,5 |
| Superfície (com Bolas Flutuantes) | 2.150 | 12,9 |
| Fundo (contato com solo, ΔT menor) | 300 | 1,8 |
| **TOTAL** | **2.707** | **16,2 kW** |

### Especificação
- **Potência térmica necessária:** ~16 kW (55.000 BTU/h)
- **Com margem de segurança (+25%):** ~20 kW (**68.000 BTU/h**)
- **Equipamento recomendado:** Bomba de Calor Inverter de **80.000 a 100.000 BTU/h** (COP ≥ 5,0)
- **Consumo elétrico médio (COP 5):** 3,2 a 4,0 kW elétrico

### Custo Operacional Mensal (Tarifa CEMIG R$ 0,85/kWh)

| Mês | Custo Bomba de Calor |
| :---: | :---: |
| Jan | R$ 557 |
| Fev | R$ 463 |
| Mar | R$ 639 |
| Abr | R$ 802 |
| Mai | R$ 1.151 |
| Jun | R$ 1.236 |
| **Jul** | **R$ 1.347** |
| Ago | R$ 1.087 |
| Set | R$ 865 |
| Out | R$ 704 |
| Nov | R$ 680 |
| Dez | R$ 639 |
| **Média Mensal** | **R$ 848** |
| **Total Anual** | **R$ 10.170** |

## Alimentação Automatizada
- **Alimentadores vibratórios/rosca:** 6 unidades (1 por tanque), acionados por timer digital.
- **Fracionamento:** 8 a 15 tratos/dia conforme estágio (alevinos mais vezes, engorda menos).
- **Trava de segurança:** CLP bloqueia alimentação se OD < 4,0 mg/L.

## Riscos e Limitações
- **Bomba de Calor como único agente térmico:** Sem estufa ou lonas, a carga térmica recai 100% sobre a bomba. Se ela falhar no inverno, a temperatura cai rapidamente. Recomendação: manter contato com assistência técnica para reparo em 24h.
- **Bolas flutuantes x manejo:** As bolas precisam ser afastadas durante a alimentação e biometrias. Redes ou barreiras flutuantes podem facilitar isso.

## Custos Estimados — Fase 3

| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Bomba de Calor Inverter (80-100k BTU) | 1 | 30.000 |
| Isolamento lã de rocha 50mm (6 tanques) | 6 | 5.400 |
| Bolas flutuantes pretas (6 tanques, ~43m² cada) | 6 | 4.200 |
| Alimentadores automáticos (vibratório/rosca) | 6 | 10.500 |
| Tubulações térmicas (CPVC) e instalação | 1 | 4.000 |
| **TOTAL FASE 3** | | **R$ 54.100** |
