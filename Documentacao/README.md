# Projeto RJ Piscicultura — Piscicultura Intensiva

Sistema de produção intensiva de tilápia em 6 tanques de 60m³ + 1 tanque de depuração 15m³ (geomembrana) com ciclo escalonado de 6 meses, despesca mensal de ~1.913 kg vivo em 3 lotes. Localizado em Belo Horizonte, MG. Poço artesiano existente no terreno.

## Números-Chave
| Métrica | Valor |
| :--- | :--- |
| Capacidade total | 360m³ (6 × 60m³ produção) + 60m³ buffer/depuração |
| Despesca mensal (com 18L:6D) | ~2.200 kg vivo / ~726 kg filé |
| Faturamento mensal (filé + linguiça + graxaria) | R$ 37.474 |
| CAPEX Base (Fases 1-3 + 2B) | R$ 288.610 |
| CAPEX Completo (Fases 1-5 + 2B) | R$ 523.410 |
| Lucro operacional mensal (completo + linguiça + graxaria) | R$ 23.745 |
| Lucro econômico mensal (ajustado depreciação + FUNRURAL) | R$ 18.594 |
| Margem operacional | 63,2% |
| Payback (cenário completo) | 2,2 anos |
| Mix de venda | 80% B2B (restaurantes) / 20% B2C (feiras) |

## Documentação Técnica

| # | Documento | Fase | Conteúdo |
| :---: | :--- | :---: | :--- |
| 01 | [Infraestrutura e Aeração](01_Infraestrutura_e_Aeracao.md) | 1 | Tanques, dreno híbrido, bombas centrífugas individuais |
| 02 | [Automação e Segurança](02_Automacao_e_Seguranca.md) | 2 | Sensores OD multiplexados, inversores, gerador |
| 02B | [RAS — Recirculação Individual por Tanque](02b_RAS_e_Recirculacao.md) | 2B | Decantador cônico, percolador retangular, filtro tela, UV, troca de água por parâmetro |
| 03 | [Climatização e Alimentação](03_Climatizacao_e_Alimentacao.md) | 3 | Bomba de Calor, lã de rocha, EPS 50mm, sombrite |
| 04 | [Fábrica de Ração + Graxaria + Linguiça](04_Fabrica_de_Racao.md) | 4 | Extrusora, formulação, graxaria (farinha+óleo), linguiça de tilápia |
| 05 | [Energia Solar](05_Energia_Solar.md) | 5 | Sistema 26 kWp bifacial, Fio B, avaliação off-grid |
| 06 | [Qualidade, Riscos e Licenciamento](06_Qualidade_Riscos_e_Licenciamento.md) | — | Depuração, riscos, licenças MG (COPAM/IGAM/IMA) |
| 07 | [Plano Financeiro](07_Plano_Financeiro.md) | — | CAPEX, OPEX, capital de giro, fluxo de caixa |
| 08 | [Canais de Venda e Produtos](08_Canais_de_Venda_e_Produtos.md) | — | Mix B2B/B2C, linguiça de tilápia, faturamento revisado |

## Software
- [Plano de Evolução do Simulador](PLANO_EVOLUCAO_SIMULADOR.md) — Regras de negócio para a aplicação React/Next.js.

## Princípios de Engenharia
1. **Verticalização Total:** Produzir a própria ração (Fase 4) e energia (Fase 5) dobra a margem de lucro.
2. **Dreno Híbrido + Bombas Individuais:** fundo cônico (5–10% do fluxo) captura sólidos concentrados; coleta lateral superior (90–95%) vai direto ao biofiltro. Bombas centrífugas individuais (uma por tanque) mantêm o vórtice — sem motores dentro dos tanques.
3. **RAS Unificado + Renovação Individual:** tratamento centralizado (decantador cônico → percolador retangular → filtro tela → UV). Troca de água fresca por tanque só ocorre quando sensores detectam parâmetro fora do limite — reduz consumo de 500 m³/dia para 3–6 m³/dia por tanque. Isolamento biológico total entre tanques.
4. **Isolamento > Potência:** EPS noturno + sombrite diurno reduzem pico de carga da bomba de calor de 21,2 kW para 10,9 kW — viabilizando bomba 48k BTU/h vs 80k BTU/h.
5. **Fotoperíodo 18L:6D:** Sombrite + LED parede + EPS garantem ~16,5–18h de luz/dia, adicionando +15% de biomassa por ciclo (payback do investimento em LED < 2 meses).
6. **Modularidade:** Crescimento em 5 fases, permitindo que a operação inicial financie as expansões tecnológicas.
