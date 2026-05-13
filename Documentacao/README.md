# Projeto RJ Piscicultura — Piscicultura Intensiva

Sistema de produção intensiva de tilápia em 6 tanques de 60m³ + 1 tanque de depuração 15m³ (geomembrana) com ciclo escalonado de 6 meses, despesca mensal de ~1.913 kg vivo em 3 lotes. Localizado em Belo Horizonte, MG. Poço artesiano existente no terreno.

## Números-Chave
| Métrica | Valor |
| :--- | :--- |
| Capacidade total | 360m³ (6 × 60m³ produção) + 60m³ buffer/depuração |
| Faturamento mensal (filé + linguiça + graxaria) | R$ 32.557 |
| CAPEX Base (Fases 1-3) | R$ 216.900 |
| CAPEX Completo (Fases 1-5) | R$ 446.700 |
| Lucro operacional mensal (completo + linguiça + graxaria) | R$ 19.510 |
| Lucro econômico mensal (ajustado depreciação + FUNRURAL) | R$ 15.104 |
| Margem operacional | 59,9% |
| Payback (cenário completo) | 2,3 anos |
| Mix de venda | 80% B2B (restaurantes) / 20% B2C (feiras) |

## Documentação Técnica

| # | Documento | Fase | Conteúdo |
| :---: | :--- | :---: | :--- |
| 01 | [Infraestrutura e Aeração](01_Infraestrutura_e_Aeracao.md) | 1 | Tanques, Airlifts, Dual Drain Cornell |
| 02 | [Automação e Segurança](02_Automacao_e_Seguranca.md) | 2 | Sensores OD multiplexados, inversores, gerador |
| 03 | [Climatização e Alimentação](03_Climatizacao_e_Alimentacao.md) | 3 | Bomba de Calor, lã de rocha, bolas flutuantes |
| 04 | [Fábrica de Ração + Graxaria + Linguiça](04_Fabrica_de_Racao.md) | 4 | Extrusora, formulação, graxaria (farinha+óleo), linguiça de tilápia |
| 05 | [Energia Solar](05_Energia_Solar.md) | 5 | Sistema 26 kWp bifacial, Fio B, avaliação off-grid |
| 06 | [Qualidade, Riscos e Licenciamento](06_Qualidade_Riscos_e_Licenciamento.md) | — | Depuração, riscos, licenças MG (COPAM/IGAM/IMA) |
| 07 | [Plano Financeiro](07_Plano_Financeiro.md) | — | CAPEX, OPEX, capital de giro, fluxo de caixa |
| 08 | [Canais de Venda e Produtos](08_Canais_de_Venda_e_Produtos.md) | — | Mix B2B/B2C, linguiça de tilápia, faturamento revisado |

## Software
- [Plano de Evolução do Simulador](PLANO_EVOLUCAO_SIMULADOR.md) — Regras de negócio para a aplicação React/Next.js.

## Princípios de Engenharia
1. **Verticalização Total:** Produzir a própria ração (Fase 4) e energia (Fase 5) dobra a margem de lucro.
2. **Airlifts > Bombas elétricas:** Circulação de água sem motores submersos.
3. **Isolamento > Potência:** Retenção térmica é mais barata que aquecimento mecânico.
4. **Modularidade:** Crescimento em 5 fases, permitindo que a operação inicial financie as expansões tecnológicas.
