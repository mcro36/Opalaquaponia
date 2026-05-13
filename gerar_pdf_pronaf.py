"""
Gerador do Projeto Técnico PRONAF — RJ Piscicultura
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate
from reportlab.lib.units import inch
import os

OUTPUT = r"C:\Code\RJ_piscicultura\.claude\worktrees\admiring-lewin-890216\Documentacao\Projeto_Tecnico_PRONAF_RJ_Piscicultura.pdf"

# ── Cores ──────────────────────────────────────────────────────────────────────
VERDE_ESCURO   = colors.HexColor("#1B5E20")
VERDE_MEDIO    = colors.HexColor("#2E7D32")
VERDE_CLARO    = colors.HexColor("#4CAF50")
VERDE_BG       = colors.HexColor("#E8F5E9")
VERDE_BG2      = colors.HexColor("#F1F8F1")
CINZA_ESCURO   = colors.HexColor("#263238")
CINZA_LINHA    = colors.HexColor("#CFD8DC")
AMARELO_DEST   = colors.HexColor("#FFF9C4")
AZUL_LINK      = colors.HexColor("#1565C0")
BRANCO         = colors.white

W, H = A4  # 595.28 x 841.89 pts

# ── Estilos ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def estilo(name, parent="Normal", **kwargs):
    s = ParagraphStyle(name, parent=styles[parent], **kwargs)
    return s

S_TITULO_CAPA   = estilo("TituloCapa",   fontSize=26, textColor=BRANCO,
                          alignment=TA_CENTER, spaceAfter=8, leading=32,
                          fontName="Helvetica-Bold")
S_SUB_CAPA      = estilo("SubCapa",      fontSize=14, textColor=BRANCO,
                          alignment=TA_CENTER, spaceAfter=6, leading=20,
                          fontName="Helvetica")
S_INFO_CAPA     = estilo("InfoCapa",     fontSize=11, textColor=BRANCO,
                          alignment=TA_CENTER, spaceAfter=4, leading=16,
                          fontName="Helvetica")
S_H1            = estilo("H1",           fontSize=14, textColor=VERDE_ESCURO,
                          spaceAfter=6, spaceBefore=14, leading=18,
                          fontName="Helvetica-Bold", borderPad=4)
S_H2            = estilo("H2",           fontSize=11, textColor=VERDE_MEDIO,
                          spaceAfter=4, spaceBefore=10, leading=15,
                          fontName="Helvetica-Bold")
S_H3            = estilo("H3",           fontSize=10, textColor=CINZA_ESCURO,
                          spaceAfter=3, spaceBefore=8, leading=14,
                          fontName="Helvetica-Bold")
S_BODY          = estilo("Body",         fontSize=9.5, textColor=CINZA_ESCURO,
                          spaceAfter=4, leading=14, alignment=TA_JUSTIFY,
                          fontName="Helvetica")
S_BULLET        = estilo("Bullet",       fontSize=9.5, textColor=CINZA_ESCURO,
                          spaceAfter=3, leading=14, leftIndent=14,
                          bulletIndent=4, fontName="Helvetica",
                          bulletText="•")
S_NOTA          = estilo("Nota",         fontSize=8.5, textColor=colors.HexColor("#546E7A"),
                          spaceAfter=4, leading=12, fontName="Helvetica-Oblique")
S_DESTAQUE      = estilo("Destaque",     fontSize=9.5, textColor=VERDE_ESCURO,
                          spaceAfter=4, leading=14, fontName="Helvetica-Bold",
                          backColor=VERDE_BG2)
S_RODAPE        = estilo("Rodape",       fontSize=7.5, textColor=colors.HexColor("#90A4AE"),
                          alignment=TA_CENTER, fontName="Helvetica")

# ── Helpers ────────────────────────────────────────────────────────────────────
def linha_verde(width=None):
    return HRFlowable(width=width or "100%", thickness=2, color=VERDE_MEDIO,
                      spaceAfter=6, spaceBefore=2)

def linha_cinza():
    return HRFlowable(width="100%", thickness=0.5, color=CINZA_LINHA,
                      spaceAfter=4, spaceBefore=2)

def sp(n=6):
    return Spacer(1, n)

def h1(txt):
    return Paragraph(txt, S_H1)

def h2(txt):
    return Paragraph(txt, S_H2)

def h3(txt):
    return Paragraph(txt, S_H3)

def p(txt):
    return Paragraph(txt, S_BODY)

def nota(txt):
    return Paragraph(f"<i>{txt}</i>", S_NOTA)

def bullet(txt):
    return Paragraph(f"• {txt}", S_BODY)

def destaque(txt):
    return Paragraph(txt, S_DESTAQUE)

# ── Estilo base de tabela ───────────────────────────────────────────────────────
def tabela_base_style(header_bg=VERDE_ESCURO, alt_bg=VERDE_BG2,
                      header_color=BRANCO, fontsize=8.5):
    return TableStyle([
        # Cabeçalho
        ("BACKGROUND",  (0,0), (-1,0),  header_bg),
        ("TEXTCOLOR",   (0,0), (-1,0),  header_color),
        ("FONTNAME",    (0,0), (-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",    (0,0), (-1,0),  fontsize),
        ("TOPPADDING",  (0,0), (-1,0),  5),
        ("BOTTOMPADDING",(0,0),(-1,0),  5),
        # Corpo
        ("FONTNAME",    (0,1), (-1,-1), "Helvetica"),
        ("FONTSIZE",    (0,1), (-1,-1), fontsize),
        ("TOPPADDING",  (0,1), (-1,-1), 4),
        ("BOTTOMPADDING",(0,1),(-1,-1), 4),
        # Linhas alternadas
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [BRANCO, alt_bg]),
        # Grid
        ("GRID",        (0,0), (-1,-1), 0.4, CINZA_LINHA),
        ("LINEBELOW",   (0,0), (-1,0),  1.5, VERDE_MEDIO),
        # Alinhamento geral
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN",       (0,0), (-1,-1), "LEFT"),
    ])

def tabela_total_style(base_style):
    s = list(base_style._cmds)
    s += [
        ("BACKGROUND",  (0,-1), (-1,-1), VERDE_BG),
        ("FONTNAME",    (0,-1), (-1,-1), "Helvetica-Bold"),
        ("LINEABOVE",   (0,-1), (-1,-1), 1.0, VERDE_MEDIO),
        ("TEXTCOLOR",   (0,-1), (-1,-1), VERDE_ESCURO),
    ]
    return TableStyle(s)

# ── Header / Footer ────────────────────────────────────────────────────────────
_page_num = [0]

def on_page(canvas, doc):
    _page_num[0] = doc.page
    canvas.saveState()
    page = doc.page

    if page == 1:
        # Capa — fundo verde escuro
        canvas.setFillColor(VERDE_ESCURO)
        canvas.rect(0, 0, W, H, fill=1, stroke=0)

        # Faixa decorativa inferior
        canvas.setFillColor(VERDE_MEDIO)
        canvas.rect(0, 0, W, 80, fill=1, stroke=0)

        # Linha dourada
        canvas.setStrokeColor(colors.HexColor("#FFD600"))
        canvas.setLineWidth(3)
        canvas.line(40, 85, W-40, 85)

        # Rodapé da capa
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(BRANCO)
        canvas.drawCentredString(W/2, 30, "mcro36@outlook.com  |  Belo Horizonte, MG  |  Maio de 2026")

    else:
        # Header
        canvas.setFillColor(VERDE_ESCURO)
        canvas.rect(0, H-30, W, 30, fill=1, stroke=0)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(BRANCO)
        canvas.drawString(40, H-19, "PROJETO TÉCNICO — PISCICULTURA INTENSIVA DE TILÁPIA")
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(W-40, H-19, "RJ Piscicultura | PRONAF 2026")

        # Footer
        canvas.setFillColor(VERDE_ESCURO)
        canvas.rect(0, 0, W, 22, fill=1, stroke=0)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(BRANCO)
        canvas.drawCentredString(W/2, 7, f"Página {page}")
        canvas.drawString(40, 7, "Confidencial — Uso exclusivo PRONAF")
        canvas.drawRightString(W-40, 7, "Belo Horizonte, MG — Maio 2026")

    canvas.restoreState()

# ── Capa ────────────────────────────────────────────────────────────────────────
def capa_elements():
    story = []
    story.append(Spacer(1, 4.5*cm))

    # Ícone / símbolo decorativo (linha horizontal dourada)
    story.append(HRFlowable(width="60%", thickness=3, color=colors.HexColor("#FFD600"),
                             spaceAfter=20, hAlign="CENTER"))

    story.append(Paragraph(
        "PROJETO TÉCNICO DE<br/>PISCICULTURA INTENSIVA DE TILÁPIA",
        S_TITULO_CAPA
    ))
    story.append(sp(10))
    story.append(HRFlowable(width="40%", thickness=1.5, color=VERDE_CLARO,
                             spaceAfter=16, hAlign="CENTER"))

    story.append(Paragraph(
        "Solicitação de Financiamento PRONAF",
        S_SUB_CAPA
    ))
    story.append(sp(30))

    dados_capa = [
        ["Projeto",    "RJ Piscicultura"],
        ["Localização","Belo Horizonte — Minas Gerais"],
        ["Espécie",    "Tilápia do Nilo (Oreochromis niloticus)"],
        ["Capacidade", "360 m³ — 6 Tanques de 60 m³"],
        ["Data",       "Maio de 2026"],
        ["Contato",    "mcro36@outlook.com"],
    ]
    t = Table(dados_capa, colWidths=[5*cm, 9*cm])
    t.setStyle(TableStyle([
        ("FONTNAME",  (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME",  (1,0), (1,-1), "Helvetica"),
        ("FONTSIZE",  (0,0), (-1,-1), 11),
        ("TEXTCOLOR", (0,0), (-1,-1), BRANCO),
        ("TOPPADDING",(0,0),(-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[
            colors.HexColor("#2E7D32AA") if i%2==0 else colors.HexColor("#1B5E2044")
            for i in range(len(dados_capa))
        ]),
        ("LINEBELOW", (0,0),(-1,-1), 0.3, colors.HexColor("#4CAF5066")),
    ]))
    story.append(t)

    story.append(Spacer(1, 2*cm))
    story.append(HRFlowable(width="60%", thickness=3, color=colors.HexColor("#FFD600"),
                             spaceAfter=10, hAlign="CENTER"))

    # Números-chave na capa
    kpis = [
        ["Faturamento Mensal", "Lucro Mensal", "Payback", "Margem"],
        ["R$ 28.395",          "R$ 15.834",    "2,3 anos", "55,7%"],
    ]
    tk = Table(kpis, colWidths=[3.5*cm]*4)
    tk.setStyle(TableStyle([
        ("FONTNAME",  (0,0), (-1,0), "Helvetica"),
        ("FONTSIZE",  (0,0), (-1,0), 8),
        ("TEXTCOLOR", (0,0), (-1,0), VERDE_CLARO),
        ("ALIGN",     (0,0), (-1,-1), "CENTER"),
        ("FONTNAME",  (0,1), (-1,1), "Helvetica-Bold"),
        ("FONTSIZE",  (0,1), (-1,1), 13),
        ("TEXTCOLOR", (0,1), (-1,1), BRANCO),
        ("TOPPADDING",(0,0),(-1,-1), 3),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
    ]))
    story.append(tk)

    story.append(PageBreak())
    return story

# ── Seção 1 — Resumo Executivo ─────────────────────────────────────────────────
def secao_resumo():
    story = []
    story.append(h1("1. RESUMO EXECUTIVO"))
    story.append(linha_verde())
    story.append(p(
        "Sistema de produção intensiva de tilápia em regime de ciclo escalonado de 6 meses com despesca "
        "mensal contínua a partir do 7º mês. O modelo de <b>verticalização</b> — produção própria de ração "
        "(Fase 4) e energia solar fotovoltaica (Fase 5) — eleva a margem operacional para <b>55,7%</b> e "
        "reduz o payback de 3,3 para <b>2,3 anos</b>. O projeto é estruturado em 5 fases modulares, "
        "permitindo que a geração de caixa das primeiras fases financie as expansões tecnológicas subsequentes."
    ))
    story.append(sp(8))

    dados = [
        ["Indicador", "Valor"],
        ["Capacidade Total", "360 m³ (6 tanques × 60 m³)"],
        ["Espécie", "Tilápia do Nilo (Oreochromis niloticus)"],
        ["Despesca Mensal (regime estável)", "~1.913 kg vivo / ~631 kg filé"],
        ["Faturamento Mensal", "R$ 28.395"],
        ["Lucro Mensal (operação completa)", "R$ 15.834"],
        ["Faturamento Anual", "R$ 340.740"],
        ["Lucro Anual", "R$ 190.008"],
        ["Margem Operacional", "55,7%"],
        ["CAPEX Total (Fases 1–5)", "R$ 349.700"],
        ["Capital de Giro Necessário", "R$ 90.000"],
        ["Investimento Total", "R$ 439.700"],
        ["Payback (operação completa)", "2,3 anos"],
        ["Projeção R$ 1.000.000 lucro acumulado", "~5,2 anos após início das despescas"],
    ]
    t = Table(dados, colWidths=[9*cm, 7*cm])
    bs = tabela_base_style()
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(6))
    story.append(nota("Fonte: Plano Financeiro Consolidado — RJ Piscicultura, 2026."))
    return story

# ── Seção 2 — Caracterização ───────────────────────────────────────────────────
def secao_caracterizacao():
    story = []
    story.append(PageBreak())
    story.append(h1("2. CARACTERIZAÇÃO DO EMPREENDIMENTO"))
    story.append(linha_verde())

    story.append(h2("2.1 Localização e Estrutura Física"))
    infos = [
        ("<b>Localização:</b>", "Belo Horizonte, Minas Gerais"),
        ("<b>Terreno:</b>", "Dois patamares com desnível de 2,5 m (aproveitado para escoamento gravitacional)"),
        ("<b>Estrutura produtiva:</b>", "6 tanques circulares de geomembrana, 60 m³ cada (Ø 7,40 m × 1,40 m lâmina d'água útil)"),
        ("<b>Área total de produção:</b>", "360 m³"),
    ]
    for k, v in infos:
        story.append(Paragraph(f"{k} {v}", S_BODY))
    story.append(sp(8))

    story.append(h2("2.2 Modelo de Produção — Ciclo Escalonado"))
    story.append(p(
        "Um tanque é ativado por mês, de forma sequencial. Os peixes <b>permanecem no mesmo tanque</b> "
        "durante todo o ciclo de 6 meses, eliminando o estresse de transferências e reduzindo a "
        "mortalidade operacional."
    ))
    story.append(sp(6))

    ciclo = [
        ["Mês", "Evento"],
        ["1", "Tanque 1 recebe alevinos"],
        ["2", "Tanque 2 recebe alevinos; T1 continua crescendo"],
        ["3–6", "Demais tanques ativados sequencialmente (um por mês)"],
        ["7", "T1 atinge peso de despesca (~800 g); transferência ao tanque de depuração por 3–5 dias; T1 limpo e repovoado"],
        ["8 em diante", "Uma despesca por mês, indefinidamente — regime de produção estável"],
    ]
    t = Table(ciclo, colWidths=[3*cm, 13*cm])
    t.setStyle(tabela_base_style())
    story.append(t)
    story.append(sp(10))

    story.append(h2("2.3 Biomassa em Regime Estável (a partir do Mês 7)"))
    biomassa = [
        ["Tanque", "Mês do Ciclo", "Peso Médio (g)", "Nº Peixes", "Biomassa (kg)"],
        ["T1", "1", "10–50",    "2.900", "87"],
        ["T2", "2", "50–150",   "2.750", "275"],
        ["T3", "3", "150–300",  "2.650", "596"],
        ["T4", "4", "300–500",  "2.600", "1.040"],
        ["T5", "5", "500–700",  "2.570", "1.542"],
        ["T6", "6", "700–850",  "2.550", "1.913"],
        ["TOTAL", "", "", "", "5.453 kg"],
    ]
    t = Table(biomassa, colWidths=[2.5*cm, 3*cm, 3.5*cm, 3*cm, 4*cm])
    bs = tabela_base_style()
    ts = tabela_total_style(bs)
    for cmd in ts._cmds:
        pass
    ts2 = TableStyle(list(ts._cmds) + [
        ("ALIGN", (1,1), (-1,-1), "CENTER"),
        ("ALIGN", (0,0), (-1,0), "CENTER"),
    ])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(4))
    story.append(nota("Mortalidade acumulada considerada: ~10% alevinagem, ~3% recria, ~1–2% engorda."))
    return story

# ── Seção 3 — Memorial Técnico ─────────────────────────────────────────────────
def secao_memorial():
    story = []
    story.append(PageBreak())
    story.append(h1("3. MEMORIAL TÉCNICO DAS FASES"))
    story.append(linha_verde())

    # Fase 1
    story.append(KeepTogether([
        h2("3.1 Fase 1 — Infraestrutura e Aeração  |  R$ 85.000"),
        linha_cinza(),
        p("Sistema de aeração composto por <b>2 sopradores de canal lateral 2,0 CV</b> operando em "
          "rede mestra de PVC (75–100 mm) com distribuição em anel (Ring Main) e difusores de "
          "mangueira microperfurada (Aero-Tube) no fundo de cada tanque."),
        sp(6),
        h3("Hidrodinâmica Cornell Dual-Drain"),
        p("O projeto adota o design comprovado pela Cornell University para autolimpeza eficiente "
          "em tanques circulares de grande volume:"),
    ]))
    bullets_cd = [
        "<b>Entrada tangencial:</b> bocais ajustáveis na parede criam rotação constante (vórtice).",
        "<b>Dreno central de fundo</b> (5–20% do fluxo): remove água concentrada em sólidos; fundo com inclinação cônica mínima de 5%.",
        "<b>Dreno lateral elevado</b> (80–95% do fluxo): remove água limpa da coluna superior para recirculação.",
        "<b>Airlifts:</b> ar dos sopradores injetado em tubos verticais arrasta coluna líquida para cima, alimentando os bocais tangenciais sem custo elétrico adicional.",
        "<b>Limpeza por gravidade:</b> desnível de 2,5 m permite escoamento gravitacional para decantador no nível inferior.",
    ]
    for b in bullets_cd:
        story.append(bullet(b))
    story.append(sp(8))

    capex1 = [
        ["Item", "Qtd", "Valor (R$)"],
        ["Tanques geomembrana (60 m³) c/ estrutura metálica", "6", "48.000"],
        ["Sopradores Canal Lateral 2,0 CV", "2", "10.000"],
        ["Material hidráulico (tubulações, drenos, bocais tangenciais)", "1", "8.000"],
        ["Material de aeração (mangueiras microperfuradas, conexões)", "1", "4.500"],
        ["Terraplenagem e preparação do terreno (2 patamares)", "1", "7.000"],
        ["Elétrica básica (quadro, cabos, disjuntores)", "1", "3.500"],
        ["Primeiro lote de alevinos (genética GenoMar/Supreme)", "1", "2.500"],
        ["Ferramentas de manejo (redes, balanças, kits teste)", "1", "1.500"],
        ["TOTAL FASE 1", "", "R$ 85.000"],
    ]
    t = Table(capex1, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(14))

    # Fase 2
    story.append(PageBreak())
    story.append(KeepTogether([
        h2("3.2 Fase 2 — Automação e Segurança Energética  |  R$ 47.800"),
        linha_cinza(),
        p("<b>Central de controle:</b> CLP industrial ou ESP32 com protocolo Modbus, interface de "
          "monitoramento local e alertas remotos via WiFi/celular. Inversores de frequência WEG "
          "instalados nos sopradores da Fase 1 permitem variação de rotação conforme demanda de OD, "
          "economizando até 30% de energia."),
        sp(6),
        h3("Monitoramento de Oxigênio Dissolvido Multiplexado"),
        p("Em vez de 6 sensores individuais (custo proibitivo de ~R$ 48.000), o projeto usa engenharia "
          "de amostragem: <b>2 sensores ópticos industriais</b> + circuito de válvulas solenoides e "
          "mini-bombas que amostram sequencialmente cada tanque em câmara central a cada ~10 min. "
          "<b>Economia: ~R$ 30.000</b> vs. sensores fixos."),
        sp(6),
        h3("Lógica do Inversor"),
    ]))
    bullets_od = [
        "OD > 6,0 mg/L → frequência mínima (modo economia)",
        "OD < 4,5 mg/L → frequência aumenta proporcionalmente",
        "OD < 3,5 mg/L → alerta crítico no celular do responsável",
        "22h–06h → frequência elevada preventivamente (pico de consumo biológico noturno)",
    ]
    for b in bullets_od:
        story.append(bullet(b))
    story.append(sp(6))
    story.append(h3("Segurança Energética"))
    story.append(p(
        "Gerador a gasolina <b>8–10 kVA</b> com Quadro de Transferência Automática (QTA). "
        "Tempo de acionamento: &lt;15 segundos após queda de energia. "
        "Cargas protegidas: sopradores + CLP + sensores. "
        "Reserva mínima: 20 L de combustível (~8 horas de operação)."
    ))
    story.append(sp(8))

    capex2 = [
        ["Item", "Qtd", "Valor (R$)"],
        ["Painel CLP + IHM + componentes", "1", "10.000"],
        ["Sensores ópticos de OD (industriais)", "2", "12.000"],
        ["Sistema de multiplexação (válvulas solenoides, bombas, câmara)", "1", "4.000"],
        ["Inversores de Frequência WEG", "2", "4.800"],
        ["Gerador 8–10 kVA + Quadro de Transferência Automática", "1", "12.000"],
        ["Mão de obra técnica (instalação + programação CLP)", "1", "5.000"],
        ["TOTAL FASE 2", "", "R$ 47.800"],
    ]
    t = Table(capex2, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(14))

    # Fase 3
    story.append(PageBreak())
    story.append(h2("3.3 Fase 3 — Climatização e Alimentação Automatizada  |  R$ 54.100"))
    story.append(linha_cinza())
    story.append(destaque(
        "Justificativa: Sem aquecimento, a produção fica inviável por 3–4 meses/ano (maio a agosto) "
        "em BH, onde as mínimas chegam a 11°C. A tilápia cessa a alimentação abaixo de 20°C e "
        "entra em risco de mortalidade abaixo de 15°C."
    ))
    story.append(sp(8))

    story.append(h3("Perfil Climático — Belo Horizonte, MG"))
    clima = [
        ["Mês", "Média (°C)", "ΔT até 28°C"],
        ["Janeiro",   "23,5", "4,5"],
        ["Fevereiro", "24,0", "4,0"],
        ["Março",     "23,0", "5,0"],
        ["Abril",     "21,5", "6,5"],
        ["Maio",      "19,0", "9,0"],
        ["Junho",     "18,0", "10,0"],
        ["Julho*",    "17,5", "10,5"],
        ["Agosto",    "19,5", "8,5"],
        ["Setembro",  "21,0", "7,0"],
        ["Outubro",   "22,5", "5,5"],
        ["Novembro",  "22,5", "5,5"],
        ["Dezembro",  "23,0", "5,0"],
    ]
    t = Table(clima, colWidths=[5*cm, 4*cm, 4.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    cmds2 = list(bs._cmds) + [
        ("BACKGROUND", (0,7),(- 1,7), colors.HexColor("#FFECB3")),
        ("TEXTCOLOR",  (0,7),(-1,7),  colors.HexColor("#E65100")),
        ("FONTNAME",   (0,7),(-1,7),  "Helvetica-Bold"),
        ("ALIGN", (1,0), (-1,-1), "CENTER"),
    ]
    t.setStyle(TableStyle(cmds2))
    story.append(t)
    story.append(nota("* Julho: pior cenário para dimensionamento térmico."))
    story.append(sp(10))

    story.append(h3("Isolamento Térmico"))
    story.append(bullet(
        "<b>Paredes — lã de rocha 50 mm</b> (λ = 0,040 W/m·K; U ~0,75 W/m²·K). "
        "Perda lateral por tanque no pior caso (julho): ~257 W."
    ))
    story.append(bullet(
        "<b>Superfície — bolas flutuantes pretas</b> (shade balls): reduzem evaporação 80–90% e "
        "perda por convecção superficial ~50%. Perda superficial com bolas: ~2.150 W/tanque."
    ))
    story.append(sp(8))

    story.append(h3("Dimensionamento da Bomba de Calor — Pior Caso (Julho, 6 Tanques)"))
    carga = [
        ["Componente", "Perda/tanque (W)", "Perda 6 tanques (kW)"],
        ["Lateral (lã de rocha 50 mm)", "257", "1,5"],
        ["Superfície (bolas flutuantes)", "2.150", "12,9"],
        ["Fundo (contato com solo)", "300", "1,8"],
        ["TOTAL", "2.707", "16,2 kW"],
    ]
    t = Table(carga, colWidths=[8*cm, 4*cm, 4.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(6))
    story.append(p(
        "<b>Especificação:</b> Bomba de Calor Inverter <b>80.000–100.000 BTU/h</b> (COP ≥ 5,0). "
        "Consumo elétrico médio: 3,2–4,0 kW. Custo operacional médio: <b>R$ 848/mês</b>. "
        "Custo total anual: R$ 10.170."
    ))
    story.append(sp(6))
    story.append(p(
        "<b>Alimentação automatizada:</b> 6 alimentadores vibratórios/rosca (1/tanque), acionados "
        "por timer digital, 8–15 tratos/dia conforme estágio de desenvolvimento. "
        "O CLP bloqueia automaticamente a alimentação se OD &lt; 4,0 mg/L."
    ))
    story.append(sp(8))

    capex3 = [
        ["Item", "Qtd", "Valor (R$)"],
        ["Bomba de Calor Inverter (80.000–100.000 BTU/h, COP ≥ 5,0)", "1", "30.000"],
        ["Isolamento lã de rocha 50 mm (6 tanques)", "6", "5.400"],
        ["Bolas flutuantes pretas — shade balls (6 tanques)", "6", "4.200"],
        ["Alimentadores automáticos vibratório/rosca", "6", "10.500"],
        ["Tubulações térmicas (CPVC) e instalação", "1", "4.000"],
        ["TOTAL FASE 3", "", "R$ 54.100"],
    ]
    t = Table(capex3, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)

    # Fase 4
    story.append(PageBreak())
    story.append(h2("3.4 Fase 4 — Fábrica de Ração Extrusada  |  R$ 62.600"))
    story.append(linha_cinza())
    story.append(destaque(
        "Justificativa financeira: economia de R$ 6.839/mês (R$ 82.068/ano). "
        "Payback da fábrica: ~9 meses. A ração flutuante é obrigatória — ração afundada "
        "degrada a qualidade da água e não é monitorada visualmente."
    ))
    story.append(sp(6))

    jus_rac = [
        ["Item", "Valor"],
        ["Custo com ração comercial (2.910 kg/mês × R$ 4,45)", "R$ 12.950/mês"],
        ["Custo com ração própria (2.910 kg/mês × R$ 2,10)", "R$ 6.111/mês"],
        ["Economia mensal", "R$ 6.839"],
        ["Economia anual", "R$ 82.068"],
        ["Payback da fábrica (CAPEX ~R$ 63k)", "~9 meses"],
    ]
    t = Table(jus_rac, colWidths=[11*cm, 5*cm])
    bs = tabela_base_style(header_bg=VERDE_MEDIO, fontsize=8.5)
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(8))

    story.append(h3("Formulação Base — Ração de Engorda (28–32% PB, por 100 kg)"))
    form = [
        ["Ingrediente", "Qtd (kg)", "Custo/kg (R$)", "Custo (R$)"],
        ["Farelo de Soja (45% PB)", "40", "2,20", "88,00"],
        ["Milho Moído", "35", "1,00", "35,00"],
        ["Silagem de Pescado (produção própria)", "15", "0,30", "4,50"],
        ["Farinha de Peixe / Carne", "5", "4,00", "20,00"],
        ["Premix vitamínico/mineral", "3", "8,00", "24,00"],
        ["Óleo de Soja", "2", "6,00", "12,00"],
        ["TOTAL (ingredientes)", "100 kg", "", "R$ 183,50"],
        ["Custo por kg (c/ energia e mão de obra)", "", "", "R$ 2,10"],
    ]
    t = Table(form, colWidths=[7.5*cm, 2.5*cm, 3*cm, 3.5*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(8))

    story.append(h3("Silagem Ácida de Pescado — Economia Circular"))
    story.append(p(
        "Resíduos da filetagem (~1.280 kg/despesca de ~1.913 kg vivo) são moídos e acidificados "
        "com ácido fórmico (3% v/p), estabilizando a proteína por hidrólise ácida. "
        "Prontos para uso em 3–7 dias. Armazenados em contêineres IBC de 1.000 L "
        "(custo unitário: R$ 80–150). Correspondem a <b>15–20% da composição da ração</b>, "
        "transformando resíduo de custo zero em insumo produtivo."
    ))
    story.append(sp(8))

    capex4 = [
        ["Item", "Qtd", "Valor (R$)"],
        ["Extrusora mono-rosca semi-profissional (15–25 CV, 100–200 kg/h)", "1", "45.000"],
        ["Moinho de Martelos", "1", "5.000"],
        ["Misturador Horizontal", "1", "5.000"],
        ["Secador / Estrutura de secagem por convecção", "1", "3.000"],
        ["Contêineres IBC 1.000 L (silagem ácida)", "4", "600"],
        ["Insumos iniciais (farelo, premix, milho)", "1", "4.000"],
        ["TOTAL FASE 4", "", "R$ 62.600"],
    ]
    t = Table(capex4, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)

    # Fase 5
    story.append(PageBreak())
    story.append(h2("3.5 Fase 5 — Usina Solar Fotovoltaica 21 kWp  |  R$ 91.200"))
    story.append(linha_cinza())

    demanda = [
        ["Equipamento", "Potência Média (kW)", "kWh/mês"],
        ["Sopradores (2 × 2 CV, com inversor)", "1,80", "1.296"],
        ["Bomba de Calor (média anual)", "1,40", "997"],
        ["CLP, sensores, alimentadores", "0,28", "200"],
        ["TOTAL", "3,48 kW", "2.493 kWh/mês"],
    ]
    t = Table(demanda, colWidths=[8*cm, 4*cm, 4.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(8))

    story.append(h3("Dimensionamento"))
    story.append(p(
        "Belo Horizonte possui excelente irradiação solar: <b>5,0 HSP</b> (Horas de Sol Pico) médias/dia. "
        "Fator de perdas do sistema: 20% (rendimento 80%). "
        "Potência calculada: 2.493 ÷ (5,0 × 30 × 0,80) = <b>20,8 kWp → sistema de 21 kWp</b>."
    ))
    story.append(p(
        "<b>Especificação:</b> ~38 módulos monocristalinos TOPCon de 550 W; "
        "1 inversor string de 20–25 kW; ~111 m² de área instalada."
    ))
    story.append(sp(8))

    story.append(h3("Impacto da Lei 14.300 — Marco Legal da Geração Distribuída"))
    story.append(p(
        "45% do consumo simultâneo à geração (sem taxas de rede); 55% injetado na rede e "
        "compensado com desconto de 60% do Fio B. A economia efetiva supera <b>85%</b> do custo "
        "de energia — conta reduzida de R$ 2.120 para ~<b>R$ 290/mês</b> (taxa mínima rural trifásica)."
    ))
    story.append(sp(8))

    ben_solar = [
        ["Indicador", "Valor"],
        ["Economia mensal", "R$ 1.830"],
        ["Economia anual", "R$ 21.960"],
        ["Payback da usina solar", "~4,2 anos"],
        ["Vida útil dos painéis", "25 anos"],
    ]
    t = Table(ben_solar, colWidths=[9*cm, 7*cm])
    t.setStyle(tabela_base_style(header_bg=VERDE_MEDIO, fontsize=8.5))
    story.append(t)
    story.append(sp(6))
    story.append(destaque(
        "PRONAF Eco: O sistema solar enquadra-se no PRONAF Eco (Energias Renováveis) com taxas "
        "subsidiadas. A parcela mensal de financiamento equipara-se à economia gerada na conta "
        "de luz — investimento de custo líquido zero para o produtor."
    ))
    story.append(sp(8))

    capex5 = [
        ["Item", "Qtd", "Valor (R$)"],
        ["Sistema Fotovoltaico 21 kWp (painéis TOPCon + inversor + estruturas)", "1", "85.000"],
        ["Projeto de engenharia, ART e homologação CEMIG", "1", "3.500"],
        ["Mão de obra de instalação e elétrica", "1", "2.700"],
        ["TOTAL FASE 5", "", "R$ 91.200"],
    ]
    t = Table(capex5, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)

    return story

# ── Seção 4 — Qualidade ─────────────────────────────────────────────────────────
def secao_qualidade():
    story = []
    story.append(PageBreak())
    story.append(h1("4. QUALIDADE DO PRODUTO E CADEIA DE VALOR"))
    story.append(linha_verde())

    story.append(h2("4.1 Depuração — Controle de Off-Flavor"))
    story.append(p(
        "A <b>geosmina</b> (composto produzido por cianobactérias e actinomicetos em sistemas "
        "intensivos) causa o indesejável 'gosto de barro' no filé. O processo de depuração é "
        "<b>obrigatório</b> antes de qualquer comercialização."
    ))
    story.append(sp(6))

    proc_dep = [
        ["Etapa", "Descrição"],
        ["1", "Lote de despesca (~1.913 kg vivo) transferido ao tanque de depuração"],
        ["2", "Jejum alimentar forçado em fluxo contínuo de água limpa por 3–5 dias"],
        ["3", "Purga de compostos organolépticos pelas brânquias + esvaziamento do trato digestório"],
        ["4", "Teste sensorial: cozinhar amostra e avaliar sabor/odor antes da liberação para venda"],
    ]
    t = Table(proc_dep, colWidths=[1.5*cm, 14.5*cm])
    t.setStyle(tabela_base_style(fontsize=8.5))
    story.append(t)
    story.append(sp(6))
    story.append(destaque(
        "Impacto financeiro: peixes sem depuração adequada sofrem desconto de 30–50% no preço de "
        "mercado. Com depuração: R$ 45/kg de filé — preço conservador de atacado para produto premium."
    ))
    story.append(sp(10))

    story.append(h2("4.2 Rastreabilidade e Inspeção Sanitária"))
    ins = [
        ("SIM — Serviço de Inspeção Municipal", "Permite venda dentro do município. Mais simples e rápido para iniciar."),
        ("SIE — Serviço de Inspeção Estadual (MG)", "Permite venda em todo o estado de MG. <b>Previsto no projeto.</b>"),
        ("SIF — Serviço de Inspeção Federal", "Para venda nacional ou exportação. Previsto para fase de expansão futura."),
    ]
    for titulo, desc in ins:
        story.append(bullet(f"<b>{titulo}:</b> {desc}"))
    story.append(sp(6))
    story.append(nota(
        "Rendimento de filé: 33% do peso vivo. Despesca de 1.913 kg vivo → 631 kg de filé depurado/mês."
    ))
    return story

# ── Seção 5 — Licenciamento ────────────────────────────────────────────────────
def secao_licenciamento():
    story = []
    story.append(PageBreak())
    story.append(h1("5. LICENCIAMENTO E CONFORMIDADE LEGAL — MINAS GERAIS"))
    story.append(linha_verde())

    lic = [
        ["Licença / Cadastro", "Órgão", "Base Legal", "Custo Estimado"],
        ["Licenciamento Ambiental (LAS)", "COPAM/FEAM", "DN COPAM nº 217/2017\nCódigo G-02-12-7", "R$ 5.000"],
        ["Outorga de Recursos Hídricos", "IGAM", "Lei Estadual MG\n(Sistema SOUT)", "R$ 1.000"],
        ["Cadastro Aquícola", "IMA", "Legislação sanitária\naquícola MG", "Gratuito"],
        ["Inspeção Sanitária Estadual", "SIE-MG", "Legislação de\ninspeção animal", "R$ 3.000"],
        ["TOTAL LICENCIAMENTO", "", "", "R$ 9.000"],
    ]
    t = Table(lic, colWidths=[4.5*cm, 2.8*cm, 4.2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(6))
    story.append(nota(
        "Para captações < 0,5 L/s (superficial) ou < 10 m³/dia (subterrânea), a outorga IGAM pode "
        "ser dispensada por enquadramento como 'uso insignificante'."
    ))
    story.append(sp(10))

    story.append(h2("Checklist de Conformidade Legal — Pré-Operação"))
    checks = [
        "Cadastro no portal Eco Sistemas (pessoa física ou jurídica)",
        "Verificar dominialidade da água via IDE Sisema",
        "Contratar responsável técnico (engenheiro de pesca ou zootecnista)",
        "Solicitar LAS via SLA (COPAM/FEAM)",
        "Solicitar Outorga via SOUT (IGAM)",
        "Registrar no IMA — Instituto Mineiro de Agropecuária",
        "Solicitar SIM ou SIE para processamento e venda de filé",
        "Providenciar ART do projeto elétrico e do sistema fotovoltaico",
        "Homologar sistema solar junto à CEMIG",
    ]
    for c in checks:
        story.append(Paragraph(f"☐ {c}", S_BODY))
    return story

# ── Seção 6 — Plano Financeiro ─────────────────────────────────────────────────
def secao_financeiro():
    story = []
    story.append(PageBreak())
    story.append(h1("6. PLANO FINANCEIRO CONSOLIDADO"))
    story.append(linha_verde())

    story.append(h2("6.1 CAPEX — Investimento por Fase"))
    capex_total = [
        ["Fase", "Descrição", "Valor (R$)"],
        ["1", "Infraestrutura e Aeração (tanques, Airlifts, Dual Drain)", "85.000"],
        ["2", "Automação e Segurança (CLP, sensores OD, inversores, gerador)", "47.800"],
        ["3", "Climatização e Alimentação (Bomba de Calor, isolamento)", "54.100"],
        ["4", "Fábrica de Ração (extrusora, moinho, silagem)", "62.600"],
        ["5", "Energia Solar (sistema 21 kWp completo)", "91.200"],
        ["—", "Licenciamento (COPAM, IGAM, SIE)", "9.000"],
        ["TOTAL CAPEX", "", "R$ 349.700"],
    ]
    t = Table(capex_total, colWidths=[1.5*cm, 12*cm, 3*cm])
    bs = tabela_base_style(fontsize=9)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [("ALIGN",(0,0),(0,-1),"CENTER"), ("ALIGN",(2,0),(-1,-1),"RIGHT")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.2 OPEX Mensal — Cenário Base (Fases 1–3)"))
    story.append(nota("Sem fábrica de ração própria e sem energia solar."))
    story.append(sp(4))
    opex = [
        ["Item", "Valor Mensal (R$)"],
        ["Ração Comercial (2.910 kg × R$ 4,45)", "12.950"],
        ["Energia — Sopradores (2 × 2 CV, inversor)", "1.050"],
        ["Energia — CLP, alimentadores, iluminação", "170"],
        ["Energia — Bomba de Calor (média anual sazonal)", "848"],
        ["Alevinos (~2.900/mês, reversão sexual)", "1.160"],
        ["Mão de obra (1 técnico/proprietário)", "3.000"],
        ["Manutenção e insumos", "800"],
        ["Processamento (abate/filetagem terceirizado)", "1.200"],
        ["OPEX TOTAL", "21.178"],
        ["Faturamento (631 kg filé × R$ 45,00/kg)", "28.395"],
        ["LUCRO LÍQUIDO MENSAL", "R$ 7.217"],
    ]
    t = Table(opex, colWidths=[11*cm, 5.5*cm])
    bs = tabela_base_style(fontsize=9)
    cmds = list(bs._cmds) + [
        ("BACKGROUND", (0,10), (-1,10), colors.HexColor("#E3F2FD")),
        ("FONTNAME",   (0,10), (-1,10), "Helvetica-Bold"),
        ("BACKGROUND", (0,11), (-1,11), VERDE_BG),
        ("FONTNAME",   (0,11), (-1,11), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,11), (-1,11), VERDE_ESCURO),
        ("LINEABOVE",  (0,9),  (-1,9),  1.0, CINZA_LINHA),
        ("LINEABOVE",  (0,11), (-1,11), 1.5, VERDE_MEDIO),
        ("ALIGN",      (1,0),  (-1,-1), "RIGHT"),
    ]
    t.setStyle(TableStyle(cmds))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.3 Impacto da Verticalização (Fases 4 e 5)"))
    impacto = [
        ["Fase", "Ação", "Economia Mensal", "Lucro Mensal Acumulado"],
        ["Fases 1–3", "Operação básica (sem ração própria, sem solar)", "—", "R$ 7.217"],
        ["+ Fase 4", "Fábrica de Ração: ração cai de R$ 12.950 → R$ 6.111", "R$ 6.839", "R$ 14.056"],
        ["+ Fase 5", "Solar: energia cai de R$ 2.068 → R$ 290/mês", "R$ 1.778", "R$ 15.834"],
    ]
    t = Table(impacto, colWidths=[2.5*cm, 7.5*cm, 3.5*cm, 3*cm])
    bs = tabela_base_style(fontsize=8.5)
    cmds2 = list(bs._cmds) + [
        ("BACKGROUND", (0,3), (-1,3), VERDE_BG),
        ("FONTNAME",   (0,3), (-1,3), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,3), (-1,3), VERDE_ESCURO),
        ("ALIGN",      (2,0), (-1,-1), "CENTER"),
    ]
    t.setStyle(TableStyle(cmds2))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.4 Capital de Giro"))
    story.append(p(
        "Nos primeiros 6 meses, os tanques estão sendo ativados progressivamente e nenhum lote "
        "atingiu o peso de despesca. O OPEX roda com carga crescente. "
        "<b>Capital de giro necessário: R$ 90.000</b> — deve estar reservado antes do início das operações."
    ))
    story.append(sp(12))

    story.append(h2("6.5 Payback e Projeção de Retorno"))
    payback = [
        ["Cenário", "CAPEX Total", "Capital de Giro", "Investimento Total", "Lucro Mensal", "Payback"],
        ["Operação Básica\n(Fases 1–3)", "R$ 195.900", "R$ 90.000", "R$ 285.900", "R$ 7.217", "40 meses\n(3,3 anos)"],
        ["Operação Completa\n(Fases 1–5)", "R$ 349.700", "R$ 90.000", "R$ 439.700", "R$ 15.834", "28 meses\n(2,3 anos)"],
    ]
    t = Table(payback, colWidths=[3.5*cm, 2.5*cm, 2.5*cm, 3*cm, 2.5*cm, 2.5*cm])
    bs = tabela_base_style(fontsize=7.5)
    cmds3 = list(bs._cmds) + [
        ("BACKGROUND", (0,2), (-1,2), VERDE_BG),
        ("FONTNAME",   (0,2), (-1,2), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,2), (-1,2), VERDE_ESCURO),
        ("ALIGN",      (1,0), (-1,-1), "CENTER"),
    ]
    t.setStyle(TableStyle(cmds3))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.6 Resumo Executivo — Operação Completa"))
    resumo = [
        ["Métrica", "Valor"],
        ["Investimento Total (Fases 1–5 + Capital de Giro)", "R$ 439.700"],
        ["Faturamento Anual", "R$ 340.740"],
        ["OPEX Anual (ração própria + solar)", "R$ 150.732"],
        ["Lucro Anual", "R$ 190.008"],
        ["Margem Operacional", "55,7%"],
        ["Payback", "2,3 anos"],
        ["R$ 1.000.000 em lucros acumulados", "~5,2 anos após início das despescas"],
    ]
    t = Table(resumo, colWidths=[10*cm, 6.5*cm])
    bs = tabela_base_style(header_bg=VERDE_ESCURO, fontsize=9)
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(6))
    story.append(p(
        "Com lucro anual de ~R$ 190.000, a marca de <b>R$ 1.000.000 em lucros acumulados</b> é "
        "atingida em ~5,2 anos após o início das despescas. Reinvestindo os lucros iniciais para "
        "dobrar a capacidade dos tanques, esse tempo cai para menos de 4 anos."
    ))
    return story

# ── Seção 7 — Riscos ───────────────────────────────────────────────────────────
def secao_riscos():
    story = []
    story.append(PageBreak())
    story.append(h1("7. MATRIZ DE RISCOS"))
    story.append(linha_verde())

    riscos = [
        ["Risco", "Prob.", "Impacto", "Mitigação"],
        [
            "Falha de energia (apagão)",
            "Média",
            "Crítico\n(mortalidade 100% em 30–60 min)",
            "Gerador 8–10 kVA com QTA automático (Fase 2)"
        ],
        [
            "Falha da Bomba de Calor no inverno",
            "Baixa",
            "Alto\n(peixes param de comer <20°C)",
            "Contrato de assistência técnica 24h; isolamento retarda queda térmica"
        ],
        [
            "FCA real > 1,3",
            "Média",
            "Moderado\n(redução de margem)",
            "Biometrias quinzenais; ajuste da taxa de arraçoamento"
        ],
        [
            "Doença (Estreptococose, Columnaris)",
            "Média",
            "Alto\n(perda de 30–50% do lote)",
            "Manejo sanitário; banhos de sal 3–5 g/L; premix vitamínico; quarentena"
        ],
        [
            "Falta de alevinos de qualidade",
            "Baixa",
            "Moderado\n(atraso de produção)",
            "Manter >= 2 fornecedores homologados (GenoMar, Aquabel, Supreme)"
        ],
        [
            "Falha mecânica da extrusora",
            "Baixa",
            "Moderado\n(compra emergencial de ração)",
            "Estoque de peças críticas; contrato de manutenção preventiva"
        ],
    ]
    t = Table(riscos, colWidths=[4.5*cm, 1.8*cm, 3.7*cm, 6.5*cm])

    def prob_color(row_idx):
        prob_map = {"Média": colors.HexColor("#FFF9C4"), "Baixa": colors.HexColor("#E8F5E9"),
                    "Alta": colors.HexColor("#FFEBEE")}
        return prob_map.get(riscos[row_idx][1], BRANCO)

    bs = tabela_base_style(fontsize=8)
    cmds_r = list(bs._cmds) + [
        ("BACKGROUND", (1,1),(1,1), colors.HexColor("#FFF9C4")),
        ("BACKGROUND", (1,2),(1,2), colors.HexColor("#E8F5E9")),
        ("BACKGROUND", (1,3),(1,3), colors.HexColor("#FFF9C4")),
        ("BACKGROUND", (1,4),(1,4), colors.HexColor("#FFF9C4")),
        ("BACKGROUND", (1,5),(1,5), colors.HexColor("#E8F5E9")),
        ("BACKGROUND", (1,6),(1,6), colors.HexColor("#E8F5E9")),
        ("VALIGN", (0,0),(-1,-1), "TOP"),
    ]
    t.setStyle(TableStyle(cmds_r))
    story.append(t)
    return story

# ── Seção 8 — PRONAF ───────────────────────────────────────────────────────────
def secao_pronaf():
    story = []
    story.append(PageBreak())
    story.append(h1("8. ENQUADRAMENTO PRONAF E LINHAS DE FINANCIAMENTO"))
    story.append(linha_verde())
    story.append(p(
        "O projeto enquadra-se em três modalidades complementares do PRONAF, "
        "cobrindo a integralidade das 5 fases de implantação:"
    ))
    story.append(sp(8))

    linhas = [
        ["Linha PRONAF", "Destinação", "Fases", "Valor Solicitado"],
        ["PRONAF Investimento",
         "Infraestrutura, automação e climatização",
         "1, 2 e 3",
         "R$ 186.900"],
        ["PRONAF Agroindústria",
         "Fábrica de Ração Extrusada — verticalização da cadeia produtiva",
         "4",
         "R$ 62.600"],
        ["PRONAF Eco\n(Energias Renováveis)",
         "Usina Solar Fotovoltaica 21 kWp — energia própria renovável",
         "5",
         "R$ 91.200"],
        ["Capital de Giro",
         "Cobertura de OPEX durante os primeiros 6 meses sem faturamento",
         "—",
         "R$ 90.000"],
        ["TOTAL SOLICITADO", "", "", "R$ 430.700"],
    ]
    t = Table(linhas, colWidths=[4.5*cm, 6.5*cm, 2*cm, 3.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [
        ("ALIGN", (2,0),(-1,-1),"CENTER"),
        ("ALIGN", (3,0),(-1,-1),"RIGHT"),
        ("VALIGN", (0,0),(-1,-1),"TOP"),
    ])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(10))

    story.append(h2("Justificativas por Linha"))
    justificativas = [
        ("PRONAF Investimento",
         "Implantação de sistema produtivo de aquicultura familiar intensiva com tecnologia "
         "de baixo impacto ambiental. Ciclo escalonado garante fluxo de caixa a partir do 7º mês."),
        ("PRONAF Agroindústria",
         "Verticalização da cadeia produtiva com beneficiamento e industrialização da produção "
         "primária. Inclui aproveitamento de resíduos via silagem ácida (economia circular). "
         "Reduz dependência de mercado externo e aumenta a margem operacional em R$ 6.839/mês."),
        ("PRONAF Eco",
         "Sistema de geração própria de energia renovável para uso produtivo rural, alinhado "
         "às metas de sustentabilidade ambiental. A parcela mensal de financiamento equipara-se "
         "à economia gerada na conta de energia elétrica — investimento de custo líquido zero "
         "para o produtor rural."),
    ]
    for titulo, desc in justificativas:
        story.append(KeepTogether([
            h3(titulo),
            p(desc),
            sp(6),
        ]))
    return story

# ── Seção 9 — Princípios de Engenharia ────────────────────────────────────────
def secao_principios():
    story = []
    story.append(PageBreak())
    story.append(h1("9. PRINCÍPIOS DE ENGENHARIA DO PROJETO"))
    story.append(linha_verde())

    principios = [
        ("1. Verticalização Total",
         "Produzir a própria ração (Fase 4) e energia (Fase 5) dobra a margem de lucro — "
         "de R$ 7.217 para R$ 15.834/mês. A verticalização é o principal diferencial "
         "competitivo do modelo."),
        ("2. Airlifts em vez de Bombas Elétricas",
         "Circulação de água sem motores submersos — menor custo de manutenção, maior "
         "confiabilidade e eliminação do risco de curto-circuito em ambiente úmido. "
         "O ar proveniente dos sopradores já instalados realiza o trabalho hidráulico."),
        ("3. Isolamento em vez de Potência",
         "Retenção térmica (lã de rocha 50 mm + bolas flutuantes pretas) é estruturalmente "
         "mais barata que aquecimento mecânico contínuo. Reduz a demanda da Bomba de Calor "
         "em ~40%, diminuindo o CAPEX e o OPEX energético."),
        ("4. Modularidade",
         "Crescimento em 5 fases independentes, permitindo que a operação inicial financie "
         "as expansões tecnológicas subsequentes. O produtor inicia com Fases 1–3 "
         "(CAPEX R$ 195.900) e escala conforme a geração de caixa."),
        ("5. Autossuficiência de Insumos",
         "Silagem ácida de pescado transforma resíduos da filetagem (custo zero) em "
         "15–20% da composição da ração — fechando o ciclo de nutrientes e reduzindo "
         "a dependência de mercado externo para os principais insumos."),
    ]
    for titulo, desc in principios:
        story.append(KeepTogether([
            h2(titulo),
            p(desc),
            sp(8),
        ]))
    return story

# ── Seção 10 — Cronograma ──────────────────────────────────────────────────────
def secao_cronograma():
    story = []
    story.append(PageBreak())
    story.append(h1("10. CRONOGRAMA DE IMPLANTAÇÃO"))
    story.append(linha_verde())

    crono = [
        ["Mês", "Fase", "Atividade Principal"],
        ["1–2",    "Licenciamento", "Protocolo COPAM, IGAM, IMA, SIE; contratação de responsável técnico (zootecnista/eng. de pesca)"],
        ["2–3",    "Fase 1",        "Terraplenagem (2 patamares), montagem dos tanques, instalação elétrica básica e aeração"],
        ["3–4",    "Fase 1",        "Ativação dos 2 primeiros tanques; primeiro lote de alevinos (GenoMar/Supreme)"],
        ["4–5",    "Fase 2",        "Instalação do CLP, sensores OD multiplexados, inversores WEG, gerador + QTA"],
        ["5–6",    "Fase 3",        "Instalação Bomba de Calor, isolamento lã de rocha, bolas flutuantes, alimentadores"],
        ["6",      "—",             "Ativação de todos os 6 tanques; sistema em regime de ciclo escalonado completo"],
        ["7",      "—",             "Primeira despesca (T1 — 6 meses de ciclo); início do faturamento regular"],
        ["8–12",   "Fase 4",        "Implantação da fábrica de ração extrusada; primeiras corridas de ração própria"],
        ["12–15",  "Fase 5",        "Implantação da usina solar 21 kWp; homologação e conexão junto à CEMIG"],
        ["16+",    "Operação",      "Operação completa — margem operacional de 55,7%; lucro mensal de R$ 15.834"],
    ]
    t = Table(crono, colWidths=[2*cm, 3*cm, 11.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    cmds_c = list(bs._cmds) + [
        ("BACKGROUND", (0,10),(-1,10), VERDE_BG),
        ("FONTNAME",   (0,10),(-1,10), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,10),(-1,10), VERDE_ESCURO),
        ("ALIGN",      (0,0), (1,-1),  "CENTER"),
    ]
    t.setStyle(TableStyle(cmds_c))
    story.append(t)
    return story

# ── Apêndice ───────────────────────────────────────────────────────────────────
def secao_apendice():
    story = []
    story.append(PageBreak())
    story.append(h1("APÊNDICE — CHECKLIST DE CONFORMIDADE LEGAL (PRÉ-OPERAÇÃO)"))
    story.append(linha_verde())
    story.append(p("Verificar o cumprimento de todos os itens antes do início das operações:"))
    story.append(sp(8))

    checks = [
        "Cadastro no portal Eco Sistemas (pessoa física ou jurídica) — SEMAD/MG",
        "Verificar dominialidade da água via IDE Sisema (recurso superficial ou subterrâneo)",
        "Contratar responsável técnico habilitado (engenheiro de pesca ou zootecnista com ART/CREA)",
        "Solicitar Licenciamento Ambiental Simplificado (LAS) via SLA — COPAM/FEAM",
        "Solicitar Outorga de Recursos Hídricos via SOUT — IGAM",
        "Registrar o estabelecimento aquícola no IMA — Instituto Mineiro de Agropecuária",
        "Solicitar SIM (municipal) ou SIE (estadual) para processamento e venda de filé",
        "Providenciar ART do projeto elétrico de toda a instalação",
        "Providenciar ART e projeto de engenharia do sistema fotovoltaico",
        "Homologar sistema solar junto à CEMIG (GD — Geração Distribuída)",
        "Averbação/regularização fundiária do terreno (requisito PRONAF)",
        "Declaração de Aptidão ao PRONAF (DAP) ou CAF ativa no nome do produtor",
    ]
    for i, c in enumerate(checks, 1):
        story.append(Paragraph(f"☐  {i}. {c}", S_BODY))
        story.append(sp(4))
    return story

# ── Última página ──────────────────────────────────────────────────────────────
def pagina_final():
    story = []
    story.append(PageBreak())
    story.append(Spacer(1, 6*cm))
    story.append(HRFlowable(width="50%", thickness=3, color=VERDE_MEDIO,
                             spaceAfter=20, hAlign="CENTER"))
    story.append(Paragraph("Fim do Documento", ParagraphStyle(
        "FimDoc", fontSize=14, textColor=VERDE_ESCURO,
        alignment=TA_CENTER, fontName="Helvetica-Bold"
    )))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph(
        "Projeto Técnico de Piscicultura Intensiva de Tilápia<br/>"
        "RJ Piscicultura — Belo Horizonte, MG<br/>"
        "Solicitação de Financiamento PRONAF — Maio de 2026",
        ParagraphStyle("FimSub", fontSize=10, textColor=colors.HexColor("#546E7A"),
                       alignment=TA_CENTER, fontName="Helvetica", leading=16)
    ))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("mcro36@outlook.com", ParagraphStyle(
        "FimEmail", fontSize=9, textColor=VERDE_MEDIO,
        alignment=TA_CENTER, fontName="Helvetica"
    )))
    story.append(HRFlowable(width="50%", thickness=3, color=VERDE_MEDIO,
                             spaceAfter=0, hAlign="CENTER", spaceBefore=20))
    return story

# ── Main ───────────────────────────────────────────────────────────────────────
def build():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        topMargin=1.2*cm,
        bottomMargin=1.2*cm,
        leftMargin=2.0*cm,
        rightMargin=2.0*cm,
        title="Projeto Técnico de Piscicultura Intensiva de Tilápia",
        author="RJ Piscicultura",
        subject="Solicitação de Financiamento PRONAF",
        creator="RJ Piscicultura — Gerado automaticamente",
    )

    story = []
    story += capa_elements()
    story += secao_resumo()
    story += secao_caracterizacao()
    story += secao_memorial()
    story += secao_qualidade()
    story += secao_licenciamento()
    story += secao_financeiro()
    story += secao_riscos()
    story += secao_pronaf()
    story += secao_principios()
    story += secao_cronograma()
    story += secao_apendice()
    story += pagina_final()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF gerado: {OUTPUT}")

if __name__ == "__main__":
    build()
