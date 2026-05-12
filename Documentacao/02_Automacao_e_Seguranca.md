# 02. Automação e Segurança Energética (Fase 2)

## Resumo
Instalação do sistema de monitoramento de oxigênio (OD) via sensores multiplexados, inversores de frequência para economia de energia e gerador com partida automática. Sem Inteligência Artificial. Sem ar comprimido.

## Central de Controle
- **Controlador:** CLP industrial ou ESP32 com protocolo Modbus.
- **Interface:** Tela de monitoramento local + alertas remotos via WiFi/celular.
- **Inversores de Frequência (WEG):** 2 unidades, instalados nos sopradores da Fase 1. Permitem variação de rotação conforme demanda de OD, economizando até 30% de energia.

## Monitoramento de Oxigênio (Sensores Multiplexados)
Em vez de 6 sensores individuais (custo proibitivo), o projeto usa engenharia de amostragem:

- **Quantidade:** 02 sensores ópticos de OD de nível industrial.
- **Lógica:** O CLP controla um circuito de válvulas solenoides e mini-bombas que trazem amostras sequenciais de cada tanque para uma câmara central de medição.
- **Ciclo:** Cada tanque é amostrado a cada ~10 minutos.
- **Economia:** ~R$ 30.000 comparado com sensores fixos em todos os tanques.

## Lógica do Inversor
- **OD > 6 mg/L:** Sopradores em frequência mínima (economia).
- **OD < 4,5 mg/L:** Frequência aumenta. Se OD < 3,5 mg/L: alerta crítico no celular.
- **Madrugada (22h-06h):** Frequência elevada preventivamente (pico de consumo biológico).

## Segurança Energética
O sistema possui uma camada de proteção contra apagões:

- **Gerador a Gasolina (8-10 kVA):** Com Quadro de Transferência Automática (QTA).
- **Tempo de acionamento:** < 15 segundos após queda de energia.
- **Cargas protegidas (essenciais):** Sopradores + CLP + sensores.
- **Cargas NÃO protegidas:** Bomba de Calor (a água leva horas para esfriar, mas peixes morrem em minutos sem ar).
- **Combustível:** Manter reserva mínima de 20 litros para ~8 horas de operação.

## Riscos e Limitações
- **Tempo de amostragem multiplexada:** O intervalo de ~10 min entre leituras cria uma "janela cega" onde uma queda brusca de OD pode não ser detectada imediatamente. Mitigação: os inversores devem operar com margem de segurança (nunca abaixo de 50% de potência na madrugada).
- **Gasolina degradada:** Gasolina armazenada degrada em ~3 meses. Usar aditivo estabilizante ou fazer rodízio mensal do estoque.

## Custos Estimados — Fase 2

| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Painel CLP + IHM + componentes | 1 | 10.000 |
| Sensores ópticos OD (industriais) | 2 | 12.000 |
| Sistema multiplexação (válvulas, bombas, câmara) | 1 | 4.000 |
| Inversores de Frequência WEG | 2 | 4.800 |
| Gerador 8-10 kVA + QTA | 1 | 12.000 |
| Mão de obra técnica (instalação + programação CLP) | 1 | 5.000 |
| **TOTAL FASE 2** | | **R$ 47.800** |
