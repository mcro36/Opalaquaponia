# 2. Automação e Sensores (Aquicultura 4.0)

Este documento detalha o "cérebro" do sistema, focado em elevar a produtividade através do controle fino de oxigênio, pH, amônia e fluxo de água.

## Central de Controle e Inteligência
A automação centralizada permite que o sistema tome decisões em tempo real com base nos dados dos sensores.

- **Controlador Central**: CLP Industrial ou Sistema baseado em ESP32 (com protocolo Modbus/RTU).
- **Interface (IHM)**: Tela touch de 7" para visualização local e monitoramento mobile (Nuvem).
- **Inversores de Frequência**: 04 inversores controlando os sopradores para otimização energética.

## Sensores e Monitoramento
| Parâmetro | Tecnologia | Quantidade | Função |
| :--- | :--- | :--- | :--- |
| **Oxigênio (OD)** | Óptico (RDO) | 06 (1/tanque) | Ativa sopradores extras e valvulas solenoide. |
| **pH** | Eletrodo Industrial | 06 (1/tanque) | Monitora toxicidade da amônia e estabilidade química. |
| **Amônia (NH3/4)** | ISE (Íon Seletivo) | 01 (Central) | Sistema de amostragem sequencial para os 6 tanques. |
| **Temperatura** | PT100 / DS18B20 | 06 (1/tanque) | Controla o acionamento do aquecimento. |

## Lógica de Funcionamento "Smart"
O sistema atua automaticamente nos seguintes cenários:

1. **Gestão de Oxigênio**:
   - Se OD > 6 mg/L: Sopradores em frequência mínima ou desligados.
   - Se OD < 4.5 mg/L: Aumenta frequência do inversor e abre solenóide do tanque crítico.

2. **Renovação Automática de Água**:
   - O sistema cruza os dados de pH e Amônia. 
   - Se a combinação atingir níveis tóxicos, as válvulas solenoide de entrada/saída são abertas.
   - **Trava de Segurança**: A renovação automática não ultrapassa 30% do volume total por dia para evitar choque térmico.

3. **Amostragem de Amônia**:
   - Mini-bombas puxam água de cada tanque por 5 minutos sequencialmente para o sensor central, reduzindo o custo de instrumentação.

## Atuadores por Tanque
- **06 Válvulas Solenoide para Ar**: Controle de fluxo individual.
- **06 Válvulas Solenoide para Água**: Gestão da renovação hídrica.
- **Relés de Alimentação**: Para acionamento dos alimentadores automáticos.

## Infraestrutura de Proteção
- **Painel IP65**: Proteção contra umidade.
- **Nobreak (UPS) de Dupla Conversão**: Garante que os sensores e o CLP continuem monitorando mesmo em quedas de energia.
