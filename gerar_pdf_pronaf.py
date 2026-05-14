"""
Gerador do Projeto Técnico PRONAF — RJ Piscicultura
Versão atualizada: reflete documentação completa com 18L:6D, graxaria,
EPS+sombrite+LED, bomba 48k BTU/h, solar 26 kWp e métricas finais.
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
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate
from reportlab.lib.units import inch
import os

OUTPUT = r"C:\Code\RJ_piscicultura\Documentacao\Projeto_Tecnico_PRONAF_RJ_Piscicultura.pdf"

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

W, H = A4

# ── Estilos ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def estilo(name, parent="Normal", **kwargs):
    return ParagraphStyle(name, parent=styles[parent], **kwargs)

S_TITULO_CAPA = estilo("TituloCapa", fontSize=26, textColor=BRANCO,
                        alignment=TA_CENTER, spaceAfter=8, leading=32,
                        fontName="Helvetica-Bold")
S_SUB_CAPA    = estilo("SubCapa",    fontSize=14, textColor=BRANCO,
                        alignment=TA_CENTER, spaceAfter=6, leading=20,
                        fontName="Helvetica")
S_H1          = estilo("H1", fontSize=14, textColor=VERDE_ESCURO,
                        spaceAfter=6, spaceBefore=14, leading=18,
                        fontName="Helvetica-Bold")
S_H2          = estilo("H2", fontSize=11, textColor=VERDE_MEDIO,
                        spaceAfter=4, spaceBefore=10, leading=15,
                        fontName="Helvetica-Bold")
S_H3          = estilo("H3", fontSize=10, textColor=CINZA_ESCURO,
                        spaceAfter=3, spaceBefore=8, leading=14,
                        fontName="Helvetica-Bold")
S_BODY        = estilo("Body", fontSize=9.5, textColor=CINZA_ESCURO,
                        spaceAfter=4, leading=14, alignment=TA_JUSTIFY,
                        fontName="Helvetica")
S_NOTA        = estilo("Nota", fontSize=8.5, textColor=colors.HexColor("#546E7A"),
                        spaceAfter=4, leading=12, fontName="Helvetica-Oblique")
S_DESTAQUE    = estilo("Destaque", fontSize=9.5, textColor=VERDE_ESCURO,
                        spaceAfter=4, leading=14, fontName="Helvetica-Bold",
                        backColor=VERDE_BG2)
S_RODAPE      = estilo("Rodape", fontSize=7.5, textColor=colors.HexColor("#90A4AE"),
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

def h1(txt): return Paragraph(txt, S_H1)
def h2(txt): return Paragraph(txt, S_H2)
def h3(txt): return Paragraph(txt, S_H3)
def p(txt):  return Paragraph(txt, S_BODY)
def nota(txt): return Paragraph(f"<i>{txt}</i>", S_NOTA)
def bullet(txt): return Paragraph(f"&#x2022; {txt}", S_BODY)
def destaque(txt): return Paragraph(txt, S_DESTAQUE)

# ── Helpers para células de tabela (habilita word-wrap automático) ─────────────
_TC = {}
def tc(text, size=8.5, bold=False, center=False):
    """Paragraph para célula de tabela — permite quebra automática de linha."""
    key = (size, bold, center)
    if key not in _TC:
        _TC[key] = ParagraphStyle(
            f"TC_{size}_{bold}_{center}",
            fontName="Helvetica-Bold" if bold else "Helvetica",
            fontSize=size, leading=round(size * 1.38, 1),
            alignment=TA_CENTER if center else TA_LEFT,
            textColor=CINZA_ESCURO, spaceAfter=0, spaceBefore=0,
        )
    return Paragraph(text, _TC[key])

_TCC = {}
def tc_capa(text, bold=False):
    """Paragraph para células da tabela da capa (texto branco 11pt)."""
    key = bold
    if key not in _TCC:
        _TCC[key] = ParagraphStyle(
            f"TCC_{bold}",
            fontName="Helvetica-Bold" if bold else "Helvetica",
            fontSize=11, leading=15,
            textColor=BRANCO, spaceAfter=0, spaceBefore=0,
        )
    return Paragraph(text, _TCC[key])

# ── Estilo base de tabela ──────────────────────────────────────────────────────
def tabela_base_style(header_bg=VERDE_ESCURO, alt_bg=VERDE_BG2,
                      header_color=BRANCO, fontsize=8.5):
    return TableStyle([
        ("BACKGROUND",   (0,0), (-1,0),  header_bg),
        ("TEXTCOLOR",    (0,0), (-1,0),  header_color),
        ("FONTNAME",     (0,0), (-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",     (0,0), (-1,0),  fontsize),
        ("TOPPADDING",   (0,0), (-1,0),  5),
        ("BOTTOMPADDING",(0,0), (-1,0),  5),
        ("FONTNAME",     (0,1), (-1,-1), "Helvetica"),
        ("FONTSIZE",     (0,1), (-1,-1), fontsize),
        ("TOPPADDING",   (0,1), (-1,-1), 4),
        ("BOTTOMPADDING",(0,1), (-1,-1), 4),
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [BRANCO, alt_bg]),
        ("GRID",         (0,0), (-1,-1), 0.4, CINZA_LINHA),
        ("LINEBELOW",    (0,0), (-1,0),  1.5, VERDE_MEDIO),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN",        (0,0), (-1,-1), "LEFT"),
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
def on_page(canvas, doc):
    canvas.saveState()
    page = doc.page
    if page == 1:
        canvas.setFillColor(VERDE_ESCURO)
        canvas.rect(0, 0, W, H, fill=1, stroke=0)
        canvas.setFillColor(VERDE_MEDIO)
        canvas.rect(0, 0, W, 80, fill=1, stroke=0)
        canvas.setStrokeColor(colors.HexColor("#FFD600"))
        canvas.setLineWidth(3)
        canvas.line(40, 85, W-40, 85)
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(BRANCO)
        canvas.drawCentredString(W/2, 30, "mcro36@outlook.com  |  Belo Horizonte, MG  |  Maio de 2026")
    else:
        canvas.setFillColor(VERDE_ESCURO)
        canvas.rect(0, H-30, W, 30, fill=1, stroke=0)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(BRANCO)
        canvas.drawString(40, H-19, "PROJETO TECNICO - PISCICULTURA INTENSIVA DE TILAPIA")
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(W-40, H-19, "RJ Piscicultura | PRONAF 2026")
        canvas.setFillColor(VERDE_ESCURO)
        canvas.rect(0, 0, W, 22, fill=1, stroke=0)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(BRANCO)
        canvas.drawCentredString(W/2, 7, f"Pagina {page}")
        canvas.drawString(40, 7, "Confidencial - Uso exclusivo PRONAF")
        canvas.drawRightString(W-40, 7, "Belo Horizonte, MG - Maio 2026")
    canvas.restoreState()

# ── Capa ───────────────────────────────────────────────────────────────────────
def capa_elements():
    story = []
    story.append(Spacer(1, 4.5*cm))
    story.append(HRFlowable(width="60%", thickness=3, color=colors.HexColor("#FFD600"),
                             spaceAfter=20, hAlign="CENTER"))
    story.append(Paragraph(
        "PROJETO TECNICO DE<br/>PISCICULTURA INTENSIVA DE TILAPIA",
        S_TITULO_CAPA
    ))
    story.append(sp(10))
    story.append(HRFlowable(width="40%", thickness=1.5, color=VERDE_CLARO,
                             spaceAfter=16, hAlign="CENTER"))
    story.append(Paragraph("Solicitacao de Financiamento PRONAF", S_SUB_CAPA))
    story.append(sp(30))

    # Tabela de identificação — cores sólidas do projeto (sem hex alpha)
    dados_capa = [
        ["Projeto",     tc_capa("RJ Piscicultura")],
        ["Localizacao", tc_capa("Belo Horizonte - Minas Gerais")],
        ["Especie",     tc_capa("Tilapia do Nilo (Oreochromis niloticus)")],
        ["Capacidade",  tc_capa("360 m3 - 6 Tanques de 60 m3 + 1 Tanque de Depuracao/Buffer (60 m3)")],
        ["Data",        tc_capa("Maio de 2026")],
        ["Contato",     tc_capa("mcro36@outlook.com")],
    ]
    t = Table(dados_capa, colWidths=[5*cm, 10*cm])
    t.setStyle(TableStyle([
        ("FONTNAME",        (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTSIZE",        (0,0), (-1,-1), 11),
        ("TEXTCOLOR",       (0,0), (-1,-1), BRANCO),
        ("TOPPADDING",      (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",   (0,0), (-1,-1), 6),
        ("ROWBACKGROUNDS",  (0,0), (-1,-1), [VERDE_MEDIO, VERDE_ESCURO]),
        ("LINEBELOW",       (0,0), (-1,-1), 0.3, VERDE_CLARO),
        ("VALIGN",          (0,0), (-1,-1), "MIDDLE"),
    ]))
    story.append(t)
    story.append(Spacer(1, 2*cm))
    story.append(HRFlowable(width="60%", thickness=3, color=colors.HexColor("#FFD600"),
                             spaceAfter=10, hAlign="CENTER"))

    # KPIs da capa — valores atualizados (operacao completa com 18L:6D + linguica + graxaria)
    kpis = [
        ["Faturamento Mensal", "Lucro Mensal",  "Payback",  "Margem"],
        ["R$ 37.474",          "R$ 22.865",     "2,0 anos", "61,0%"],
    ]
    tk = Table(kpis, colWidths=[3.5*cm]*4)
    tk.setStyle(TableStyle([
        ("FONTNAME",        (0,0), (-1,0), "Helvetica"),
        ("FONTSIZE",        (0,0), (-1,0), 8),
        ("TEXTCOLOR",       (0,0), (-1,0), VERDE_CLARO),
        ("ALIGN",           (0,0), (-1,-1), "CENTER"),
        ("FONTNAME",        (0,1), (-1,1), "Helvetica-Bold"),
        ("FONTSIZE",        (0,1), (-1,1), 13),
        ("TEXTCOLOR",       (0,1), (-1,1), BRANCO),
        ("TOPPADDING",      (0,0), (-1,-1), 3),
        ("BOTTOMPADDING",   (0,0), (-1,-1), 3),
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
        "Sistema de producao intensiva de tilapia em regime de ciclo escalonado de 6 meses com "
        "despesca mensal continua a partir do 7 mes. O sistema de <b>fotoperiodo 18L:6D</b> "
        "(sombrite 50% diurno + paineis EPS 50mm noturnos + faixas LED IP68) eleva a biomassa "
        "de despesca em <b>+15%</b> por ciclo (Vera Cruz &amp; Brown, 2007; Rad et al., 2006). "
        "O modelo de <b>verticalizacao</b> - producao propria de racao extrusada com graxaria "
        "(Fase 4) e energia solar fotovoltaica (Fase 5) - eleva a margem operacional para "
        "<b>61,0%</b> e o payback de 3,5 para <b>2,0 anos</b>. Estrutura modular em 5 fases "
        "permite que a geracao de caixa das fases iniciais financie as expansoes subsequentes."
    ))
    story.append(sp(8))

    dados = [
        ["Indicador", "Valor"],
        ["Capacidade Total",
         tc("360 m3 (6 tanques x 60 m3) + 1 tanque depuracao/buffer 60 m3")],
        ["Especie",
         tc("Tilapia do Nilo (Oreochromis niloticus)")],
        ["Sistema de Fotoperiodo",
         tc("18L:6D via sombrite 50% + EPS 50mm + LED IP68 (+15% biomassa)")],
        ["Despesca Mensal (regime estavel)",
         tc("~2.200 kg vivo / ~726 kg file depurado")],
        ["Faturamento Mensal",
         tc("R$ 37.474 (file + linguica + farinha excedente graxaria)")],
        ["Lucro Mensal (operacao completa)",
         tc("R$ 22.865")],
        ["Faturamento Anual",
         tc("R$ 449.688")],
        ["Lucro Anual",
         tc("R$ 274.380")],
        ["Margem Operacional",
         tc("61,0%")],
        ["CAPEX Total (Fases 1-5 + Licenciamento)",
         tc("R$ 450.360")],
        ["Capital de Giro Necessario",
         tc("R$ 90.000")],
        ["Investimento Total",
         tc("R$ 540.360")],
        ["Payback (operacao completa)",
         tc("2,0 anos")],
        ["Projecao R$ 1.000.000 lucro acumulado",
         tc("~3,6 anos apos inicio das despescas")],
    ]
    t = Table(dados, colWidths=[8.5*cm, 8*cm])
    bs = tabela_base_style()
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(6))
    story.append(nota("Fonte: Plano Financeiro Consolidado - RJ Piscicultura, 2026. "
                      "Lucro economico ajustado (com depreciacao e FUNRURAL): ~R$ 18.325/mes."))
    return story

# ── Seção 2 — Caracterização ───────────────────────────────────────────────────
def secao_caracterizacao():
    story = []
    story.append(PageBreak())
    story.append(h1("2. CARACTERIZACAO DO EMPREENDIMENTO"))
    story.append(linha_verde())

    story.append(h2("2.1 Localizacao e Estrutura Fisica"))
    for k, v in [
        ("<b>Localizacao:</b>", "Belo Horizonte, Minas Gerais"),
        ("<b>Terreno:</b>", "Dois patamares com desnivel de 2,5 m (aproveitado para escoamento gravitacional)"),
        ("<b>Producao:</b>", "6 tanques circulares de geomembrana, 60 m3 cada (O 7,40 m x 1,40 m lamina d'agua)"),
        ("<b>Depuracao/Buffer:</b>", "7 tanque identico (60 m3) - depuracao pre-abate + pre-aquecimento agua de reposicao"),
        ("<b>Area total de agua:</b>", "420 m3"),
    ]:
        story.append(Paragraph(f"{k} {v}", S_BODY))
    story.append(sp(8))

    story.append(h2("2.2 Modelo de Producao - Ciclo Escalonado"))
    story.append(p(
        "Um tanque e ativado por mes, de forma sequencial. Os peixes <b>permanecem no mesmo tanque</b> "
        "durante todo o ciclo de 6 meses, eliminando o estresse de transferencias e reduzindo mortalidade."
    ))
    story.append(sp(6))
    ciclo = [
        ["Mes", "Evento"],
        ["1",   tc("Tanque 1 recebe alevinos")],
        ["2",   tc("Tanque 2 recebe alevinos; T1 continua crescendo")],
        ["3-6", tc("Demais tanques ativados sequencialmente (um por mes)")],
        ["7",   tc("T1 atinge peso de despesca (~850 g, com 18L:6D); transferencia ao 7 tanque por "
                   "3-5 dias de depuracao; T1 limpo e repovoado")],
        ["8+",  tc("Uma despesca por mes, indefinidamente - regime de producao estavel")],
    ]
    t = Table(ciclo, colWidths=[2.5*cm, 14*cm])
    t.setStyle(tabela_base_style())
    story.append(t)
    story.append(sp(10))

    story.append(h2("2.3 Biomassa em Regime Estavel - com Fotoperiodo 18L:6D (+15%)"))
    biomassa = [
        ["Tanque", "Mes do Ciclo", "Peso Medio (g)", "N Peixes", "Biomassa (kg)"],
        ["T1", "1",  "12-58",   "2.900", "100"],
        ["T2", "2",  "58-173",  "2.750", "316"],
        ["T3", "3",  "173-345", "2.650", "685"],
        ["T4", "4",  "345-575", "2.600", "1.196"],
        ["T5", "5",  "575-805", "2.570", "1.773"],
        ["T6", "6",  "805-978", "2.550", "2.200"],
        ["TOTAL", "", "", "", "6.270 kg"],
    ]
    t = Table(biomassa, colWidths=[2.5*cm, 3*cm, 3.5*cm, 3*cm, 3.5*cm])
    bs = tabela_base_style()
    ts = tabela_total_style(bs)
    ts2 = TableStyle(list(ts._cmds) + [
        ("ALIGN", (1,1), (-1,-1), "CENTER"),
        ("ALIGN", (0,0), (-1,0),  "CENTER"),
    ])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(4))
    story.append(nota(
        "Mortalidade acumulada: ~10% alevinagem, ~3% recria, ~1-2% engorda. "
        "Densidade final T6: 36,7 kg/m3 (limite seguro tilapia intensiva: 40-50 kg/m3). "
        "+15% biomassa vs producao sem controle de luz (base cientifica: Vera Cruz & Brown 2007; Rad et al. 2006)."
    ))
    return story

# ── Seção 3 — Memorial Técnico ─────────────────────────────────────────────────
def secao_memorial():
    story = []
    story.append(PageBreak())
    story.append(h1("3. MEMORIAL TECNICO DAS FASES"))
    story.append(linha_verde())

    # ── Fase 1 ──
    story.append(KeepTogether([
        h2("3.1 Fase 1 - Infraestrutura, Aeracao e Processamento  |  R$ 120.000"),
        linha_cinza(),
        p("Sistema de aeracao composto por <b>2 sopradores de canal lateral 2,0 CV</b> operando em "
          "rede mestra de PVC (75-100 mm) com distribuicao em anel (Ring Main) e difusores de "
          "mangueira microperfurada (Aero-Tube). Inclui sala de processamento adequada ao "
          "<b>SIE-MG</b> e equipamentos de linguica/defumacao operacionais desde a primeira despesca (mes 7)."),
        sp(6),
        h3("Hidrodinamica Cornell Dual-Drain"),
        p("Design comprovado pela Cornell University para autolimpeza eficiente em tanques circulares:"),
    ]))
    for b in [
        "<b>Entrada tangencial:</b> bocais ajustaveis na parede criam rotacao constante (vortice).",
        "<b>Dreno central de fundo</b> (5-20% do fluxo): remove agua concentrada em solidos; fundo com inclinacao conica minima de 5%.",
        "<b>Dreno lateral elevado</b> (80-95% do fluxo): remove agua limpa da coluna superior para recirculacao.",
        "<b>Airlifts:</b> ar dos sopradores injetado em tubos verticais arrasta coluna liquida para cima, alimentando bocais tangenciais sem custo eletrico adicional.",
        "<b>Limpeza por gravidade:</b> desnivel de 2,5 m permite escoamento para decantador no nivel inferior.",
    ]:
        story.append(bullet(b))
    story.append(sp(8))

    capex1 = [
        ["Item", "Qtd", "Valor (R$)"],
        [tc("Tanques geomembrana (60 m3) c/ estrutura metalica", size=8), "6", "48.000"],
        [tc("Sopradores Canal Lateral 2,0 CV", size=8), "2", "10.000"],
        [tc("Material hidraulico (tubulacoes, drenos, bocais)", size=8), "1", "8.000"],
        [tc("Material de aeracao (mangueiras microperfuradas, conexoes)", size=8), "1", "4.500"],
        [tc("Terraplenagem e preparacao do terreno (2 patamares)", size=8), "1", "7.000"],
        [tc("Eletrica basica (quadro, cabos, disjuntores)", size=8), "1", "3.500"],
        [tc("Primeiro lote de alevinos (genetica GenoMar/Supreme)", size=8), "1", "2.500"],
        [tc("Ferramentas de manejo (redes, balancas, kits teste)", size=8), "1", "1.500"],
        [tc("7 tanque geomembrana 60 m3 (depuracao + buffer termico)", size=8), "1", "8.000"],
        [tc("Sala processamento SIE-MG (piso, revestimento, inox, exaustao)", size=8), "1", "10.000"],
        [tc("Equipamentos linguica e defumacao (moedor, embutideira, seladora, defumador)", size=8), "1", "17.000"],
        ["TOTAL FASE 1", "", "R$ 120.000"],
    ]
    t = Table(capex1, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(14))

    # ── Fase 2 ──
    story.append(PageBreak())
    story.append(KeepTogether([
        h2("3.2 Fase 2 - Automacao e Seguranca Energetica  |  R$ 47.800"),
        linha_cinza(),
        p("<b>Central de controle:</b> CLP industrial ou ESP32 com protocolo Modbus, interface local "
          "e alertas remotos via WiFi/celular. Inversores de frequencia WEG nos sopradores economizam "
          "ate 30% de energia. O CLP tambem gerencia o fotoperiodo LED e os alimentadores automaticos."),
        sp(6),
        h3("Monitoramento de OD Multiplexado"),
        p("<b>2 sensores opticos industriais</b> + circuito de valvulas solenoides e mini-bombas "
          "amostram sequencialmente cada tanque (~10 min/ciclo). Economia de ~R$ 30.000 vs. "
          "sensores fixos individuais."),
    ]))
    for b in [
        "OD &gt; 6,0 mg/L: frequencia minima (modo economia)",
        "OD &lt; 4,5 mg/L: frequencia aumenta proporcionalmente",
        "OD &lt; 3,5 mg/L: alerta critico no celular do responsavel",
        "22h-06h: frequencia elevada preventivamente (pico de consumo biologico noturno)",
        "<b>Logica de fotoperiodo:</b> CLP aciona LED ao por do sol, desliga as 23h; bloqueia alimentadores das 23h ao nascer do sol; alarmes sonoros para colocacao/retirada do EPS.",
    ]:
        story.append(bullet(b))
    story.append(sp(6))
    story.append(p(
        "<b>Seguranca energetica:</b> Gerador 8-10 kVA com Quadro de Transferencia Automatica (QTA). "
        "Acionamento em &lt;15 seg. Reserva minima: 20 L de combustivel (~8 horas de operacao)."
    ))
    story.append(sp(8))

    capex2 = [
        ["Item", "Qtd", "Valor (R$)"],
        [tc("Painel CLP + IHM + componentes", size=8), "1", "10.000"],
        [tc("Sensores opticos de OD (industriais)", size=8), "2", "12.000"],
        [tc("Sistema multiplexacao (valvulas solenoides, bombas, camara)", size=8), "1", "4.000"],
        [tc("Inversores de Frequencia WEG", size=8), "2", "4.800"],
        [tc("Gerador 8-10 kVA + Quadro de Transferencia Automatica", size=8), "1", "12.000"],
        [tc("Mao de obra tecnica (instalacao + programacao CLP)", size=8), "1", "5.000"],
        ["TOTAL FASE 2", "", "R$ 47.800"],
    ]
    t = Table(capex2, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(14))

    # ── Fase 3 ──
    story.append(PageBreak())
    story.append(h2("3.3 Fase 3 - Climatizacao, Fotoperiodo e Alimentacao  |  R$ 52.760"))
    story.append(linha_cinza())
    story.append(destaque(
        "Justificativa: Sem aquecimento, a producao fica inviavel 3-4 meses/ano (mai-ago) em BH "
        "(minimas de 11 C). A tilapia cessa alimentacao abaixo de 20 C e entra em risco de "
        "mortalidade abaixo de 15 C. O sistema de fotoperiodo 18L:6D eleva a biomassa em +15%."
    ))
    story.append(sp(8))

    story.append(h3("Sistema de Cobertura Superficial e Fotoperiodo 18L:6D"))
    story.append(p(
        "A tilapia e um peixe diurno que regula o hormonio do crescimento (GH) pelo eixo "
        "melatonina-fotoperiodo. O sistema adotado implementa 18L:6D combinando tres elementos:"
    ))
    cobertura = [
        ["Periodo", "Cobertura", "LED Parede", "Finalidade"],
        [tc("Nascer do sol ate por do sol (dia claro)", size=8),
         "Sombrite 50%", "Desligado",
         tc("Luz natural filtrada + anti-predador (gracas)", size=8)],
        [tc("Por do sol (~18h) ate 23:00", size=8),
         "Sombrite 50%", "Ligado",
         tc("Complemento LED para completar 18h de luz", size=8)],
        [tc("23:00 ate nascer do sol (~06:00)", size=8),
         "EPS 50mm", "Desligado",
         tc("Isolamento termico + periodo escuro obrigatorio", size=8)],
        [tc("Dia nublado / frio", size=8),
         "EPS 50mm", "Ligado",
         tc("Isolamento total + luz artificial substituindo solar", size=8)],
    ]
    t = Table(cobertura, colWidths=[4.5*cm, 2.5*cm, 2.5*cm, 7*cm])
    t.setStyle(tabela_base_style(fontsize=8))
    story.append(t)
    story.append(sp(6))

    story.append(h3("Impacto Produtivo do Fotoperiodo 18L:6D"))
    impacto_fp = [
        ["Parametro", "Sem fotoperiodo", "Com 18L:6D (+15%)"],
        ["Biomassa despesca (kg vivo)", "1.913", "2.200"],
        ["Densidade final (kg/m3)", "31,9", "36,7"],
        ["File total (33%)", "631 kg", "726 kg"],
        ["Linguica produzida/mes", "216 kg", "248 kg"],
    ]
    t = Table(impacto_fp, colWidths=[7*cm, 4*cm, 5.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts2 = TableStyle(list(bs._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")])
    t.setStyle(ts2)
    story.append(t)
    story.append(sp(8))

    story.append(h3("Dimensionamento da Bomba de Calor - Dois Modos de Operacao"))
    story.append(p(
        "<b>Modo 1 - Dia ensolarado (sombrite aberto):</b> ganho solar pelo sombrite 50% "
        "compensa perdas superficiais. Carga total ~6,3 kW (bomba em carga parcial ou intermitente)."
    ))
    story.append(p(
        "<b>Modo 2 - Noite/dias nublados (EPS sobre a superficie):</b> EPS reduz perdas "
        "superficiais em 85-90%. Carga de pico calculada abaixo:"
    ))
    carga = [
        ["Componente", "Perda/tanque (W)", "6 tanques (kW)"],
        ["Superficie (EPS 50mm, 87% reducao)", "430", "2,6"],
        ["Lateral (la de rocha 50mm)", "257", "1,5"],
        ["Fundo (contato com solo)", "300", "1,8"],
        ["Subtotal T1-T6", "987", "5,9"],
        ["7 tanque estrutural (delta-T ~5 C)", "-", "1,5"],
        ["Reposicao hidrica (18 m3/dia, gradual via buffer)", "-", "3,5"],
        ["TOTAL PIOR CASO (julho)", "", "10,9 kW"],
    ]
    t = Table(carga, colWidths=[8.5*cm, 3.5*cm, 4.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(4))
    story.append(p(
        "<b>Especificacao:</b> Bomba de Calor Inverter <b>48.000 BTU/h</b> (COP &gt;= 5,0). "
        "Carga maxima 10,9 kW + margem 15% = 12,5 kW. Consumo eletrico maximo: ~2,18 kW. "
        "Custo operacional medio: <b>R$ 388/mes</b> (R$ 4.660/ano) - reducao de 54% vs. "
        "design anterior com shade balls (R$ 10.170/ano)."
    ))
    story.append(sp(8))

    capex3 = [
        ["Item", "Qtd", "Valor (R$)"],
        [tc("Bomba de Calor Inverter 48k BTU/h (COP >= 5,0)", size=8), "1", "15.000"],
        [tc("Isolamento la de rocha 50mm (6 tanques de producao)", size=8), "6", "5.400"],
        [tc("Paineis EPS 50mm removiveis (6 tanques, ~43 m2)", size=8), "6", "8.200"],
        [tc("Sombrite 50% anti-UV + estrutura metalica (6 tanques)", size=8), "1", "7.000"],
        [tc("Alimentadores automaticos (vibratorio/rosca)", size=8), "6", "10.500"],
        [tc("Tubulacoes termicas (CPVC) e instalacao", size=8), "1", "4.000"],
        [tc("Faixas LED IP68 24V + drivers + cabeamento (6 tanques)", size=8), "1", "2.660"],
        ["TOTAL FASE 3", "", "R$ 52.760"],
    ]
    t = Table(capex3, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)

    # ── Fase 4 ──
    story.append(PageBreak())
    story.append(h2("3.4 Fase 4 - Fabrica de Racao + Graxaria  |  R$ 107.600"))
    story.append(linha_cinza())
    story.append(destaque(
        "A graxaria produz farinha de peixe (~60% PB) e oleo de peixe a partir dos residuos da "
        "filetagem, tornando a fazenda autossuficiente nos dois insumos de origem animal da racao. "
        "Silagem acida nao e utilizada - os residuos vao integralmente para a graxaria."
    ))
    story.append(sp(6))

    jus_rac = [
        ["Cenario", "Qtd Racao/mes", "Custo/kg", "Custo Mensal"],
        ["Racao Comercial (sem Fase 4)", "3.347 kg", "R$ 4,45", "R$ 14.900"],
        ["Racao Propria - Fabrica s/ Graxaria", "3.347 kg", "R$ 2,10", "R$ 7.029"],
        ["Racao Propria - Fabrica + Graxaria", "3.347 kg", "~R$ 1,78", "R$ 5.959"],
        [tc("Economia total vs. comercial: R$ 8.941/mes  |  Payback fabrica: ~8 meses", bold=True),
         "", "", ""],
    ]
    t = Table(jus_rac, colWidths=[6.5*cm, 2.5*cm, 2.5*cm, 5*cm])
    bs = tabela_base_style(header_bg=VERDE_MEDIO, fontsize=8.5)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [
        ("ALIGN", (1,0), (-1,-1), "CENTER"),
        ("SPAN",  (0,-1), (-1,-1)),
    ]))
    story.append(t)
    story.append(sp(8))

    story.append(h3("Formulacao Base - Racao de Engorda (28-32% PB, por 100 kg)"))
    form = [
        ["Ingrediente", "Qtd (kg)", "Custo/kg (R$)", "Custo (R$)"],
        ["Farelo de Soja (45% PB)", "50", "2,20", "110,00"],
        ["Milho Moido", "38", "1,00", "38,00"],
        ["Farinha de Peixe propria (~60% PB)*", "5", "1,40", "7,00"],
        ["Premix vitaminico/mineral", "3", "8,00", "24,00"],
        ["Oleo de Peixe proprio*", "2", "0,50", "1,00"],
        ["Vitamina C (ascorbil-fosfato)", "1", "15,00", "15,00"],
        ["Sal", "1", "0,50", "0,50"],
        ["TOTAL (ingredientes)", "100 kg", "", "R$ 195,50"],
        ["Custo/kg (c/ energia e mao de obra)", "", "", "~R$ 2,10"],
    ]
    t = Table(form, colWidths=[7.5*cm, 2.5*cm, 3*cm, 3.5*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(nota(
        "* Farinha e oleo produzidos na graxaria propria. Teor proteico: "
        "50x45% + 38x8% + 5x60% = 22,5 + 3,0 + 3,0 = 28,5% PB."
    ))
    story.append(sp(8))

    story.append(h3("Graxaria - Farinha e Oleo de Peixe"))
    story.append(p(
        "O residuo bruto da filetagem (cabecas, espinha, visceras, pele) representa 58% do peso "
        "vivo - <b>1.309 kg/mes</b> (1.276 kg residuo + 33 kg recortes excedentes). "
        "A graxaria converte esse residuo em dois insumos que antes eram comprados:"
    ))
    grax = [
        ["Saida", "Rendimento", "Producao (kg/mes)", "Necessidade racao", "Excedente"],
        ["Farinha de peixe (~60% PB)", "~22%", "~288 kg", "167 kg", "~121 kg"],
        ["Oleo de peixe", "~6%",  "~78 kg",  "67 kg",  "~11 kg"],
        [tc("Excedente farinha (121 kg x R$ 4,00) = R$ 484/mes  |  Ganho liquido graxaria = R$ 1.154/mes",
            bold=True), "", "", "", ""],
    ]
    t = Table(grax, colWidths=[4.5*cm, 2.2*cm, 3*cm, 3*cm, 2.8*cm])
    bs = tabela_base_style(header_bg=VERDE_MEDIO, fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [
        ("ALIGN", (1,0), (-1,-1), "CENTER"),
        ("SPAN",  (0,-1), (-1,-1)),
    ]))
    story.append(t)
    story.append(sp(8))

    capex4_fab = [
        ["Item - Fabrica de Racao", "Qtd", "Valor (R$)"],
        [tc("Extrusora mono-rosca semi-profissional (15-25 CV)", size=8), "1", "45.000"],
        [tc("Moinho de Martelos", size=8), "1", "5.000"],
        [tc("Misturador Horizontal", size=8), "1", "5.000"],
        [tc("Secador / Estrutura de secagem por conveccao", size=8), "1", "3.000"],
        [tc("Conteineres IBC 1.000L (armazenamento MP e oleo)", size=8), "4", "600"],
        [tc("Insumos iniciais (farelo, premix, vitaminas)", size=8), "1", "4.000"],
        ["Subtotal Fabrica de Racao", "", "R$ 62.600"],
    ]
    t = Table(capex4_fab, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(6))

    capex4_grax = [
        ["Item - Graxaria (processo + controle de odor)", "Qtd", "Valor (R$)"],
        [tc("Digestor/cozinhador a vapor (200-500 kg/lote)", size=8), "1", "12.000"],
        [tc("Prensa de parafuso (expeller)", size=8), "1", "8.000"],
        [tc("Secador rotativo ou de bandeja", size=8), "1", "10.000"],
        [tc("Tanques de armazenamento de oleo", size=8), "2", "2.000"],
        [tc("Instalacoes hidraulicas e eletricas", size=8), "1", "3.000"],
        [tc("Condensador de vapores (tubo e carcaca, 2-4 m2)", size=8), "1", "4.500"],
        [tc("Filtro de carvao ativado (leito 100 kg)", size=8), "1", "3.500"],
        [tc("Tubulacao e conexoes do sistema de exaustao", size=8), "1", "2.000"],
        ["Subtotal Graxaria", "", "R$ 45.000"],
    ]
    t = Table(capex4_grax, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(4))
    story.append(destaque("TOTAL FASE 4 (Fabrica + Graxaria): R$ 107.600"))

    # ── Fase 5 ──
    story.append(PageBreak())
    story.append(h2("3.5 Fase 5 - Usina Solar Fotovoltaica 26 kWp  |  R$ 112.200"))
    story.append(linha_cinza())

    story.append(h3("Demanda Energetica do Projeto (Operacao Completa)"))
    demanda_cont = [
        ["Equipamento (Carga Continua)", "Pot. Media (kW)", "kWh/mes"],
        ["Sopradores (2 x 2CV, com inversor WEG)", "1,80", "1.296"],
        ["Bomba de Calor Inverter 48k BTU (media anual)", "0,63", "456"],
        ["CLP, sensores, alimentadores, LED", "0,28", "200"],
        ["Subtotal Continuo", "2,71 kW", "1.952 kWh/mes"],
    ]
    t = Table(demanda_cont, colWidths=[8*cm, 4*cm, 4.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(4))

    demanda_interm = [
        ["Equipamento (Carga Intermitente - Fase 4)", "Pot. (kW)", "h/mes", "kWh/mes"],
        ["Extrusora (15-25 CV)", "11,0", "20", "220"],
        ["Moinho + misturador", "3,5", "8", "28"],
        ["Digestor + secador graxaria", "8,0", "30", "240"],
        ["Prensa de parafuso", "2,0", "10", "20"],
        ["Subtotal Intermitente", "", "", "508 kWh/mes"],
    ]
    t = Table(demanda_interm, colWidths=[7*cm, 2.5*cm, 2*cm, 5*cm])
    bs = tabela_base_style(header_bg=VERDE_MEDIO, fontsize=8.5)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(sp(4))
    story.append(nota(
        "TOTAL DEMANDA: 2.460 kWh/mes | Conta de luz atual (todos os equipamentos): ~R$ 2.091/mes. "
        "Cargas intermitentes operam de dia - alta taxa de autoconsumo solar."
    ))
    story.append(sp(8))

    story.append(h3("Dimensionamento"))
    story.append(p(
        "BH: <b>5,0 HSP/dia</b> (media anual). Fator de perdas: 20%. "
        "Potencia calculada: 2.460 / (5,0 x 30 x 0,80) = <b>20,5 kWp</b>. "
        "Sistema instalado: <b>26 kWp</b> (~27% acima do minimo) - margem intencional para "
        "degradacao dos paineis, geracao reduzida no inverno e expansao futura. "
        "~40 modulos bifaciais 650W TOPCon; 1 inversor string 25 kW; ~130 m2."
    ))
    story.append(sp(8))

    ben_solar = [
        ["Indicador", "Valor"],
        ["Conta de luz atual (todos os equipamentos)", "~R$ 2.091/mes"],
        ["Conta com solar (taxa minima rural trifasica)", "~R$ 290/mes"],
        ["Economia mensal (conta de luz real)", "~R$ 1.801/mes"],
        ["Economia anual", "~R$ 21.612/ano"],
        ["Payback da usina solar", "~5,2 anos"],
        ["Vida util dos paineis", "25 anos"],
    ]
    t = Table(ben_solar, colWidths=[9*cm, 7.5*cm])
    t.setStyle(tabela_base_style(header_bg=VERDE_MEDIO, fontsize=8.5))
    story.append(t)
    story.append(sp(4))
    story.append(nota(
        "Impacto no lucro operacional (Doc 07): energia OPEX explicita cai de R$ 1.658 para "
        "R$ 290 = economia de R$ 1.368/mes. A energia da fabrica de racao (~R$ 432/mes) esta "
        "embutida no custo de R$ 2,10/kg da racao - solar tambem a cobre, sem dupla contagem."
    ))
    story.append(sp(6))
    story.append(destaque(
        "PRONAF Eco: Sistema solar enquadra-se no PRONAF Eco (Energias Renovaveis). "
        "A parcela mensal de financiamento aproxima-se da economia gerada na conta de luz."
    ))
    story.append(sp(8))

    capex5 = [
        ["Item", "Qtd", "Valor (R$)"],
        [tc("Sistema Fotovoltaico 26 kWp (paineis bifaciais 650W + inversor + estruturas)", size=8),
         "1", "106.000"],
        [tc("Projeto de engenharia, ART e homologacao CEMIG", size=8), "1", "3.500"],
        [tc("Mao de obra de instalacao e eletrica", size=8), "1", "2.700"],
        ["TOTAL FASE 5", "", "R$ 112.200"],
    ]
    t = Table(capex5, colWidths=[10*cm, 2*cm, 4*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)

    return story

# ── Seção 4 — Qualidade ────────────────────────────────────────────────────────
def secao_qualidade():
    story = []
    story.append(PageBreak())
    story.append(h1("4. QUALIDADE DO PRODUTO E CADEIA DE VALOR"))
    story.append(linha_verde())

    story.append(h2("4.1 Depuracao - Controle de Off-Flavor"))
    story.append(p(
        "A <b>geosmina</b> (composto produzido por cianobacterias e actinomicetos) causa o "
        "'gosto de barro' no file. Em sistemas intensivos, a concentracao e inevitavelmente alta. "
        "O processo de depuracao e <b>obrigatorio</b> antes de qualquer comercializacao."
    ))
    story.append(sp(6))
    proc_dep = [
        ["Etapa", "Descricao"],
        ["1", tc("Despesca (~2.200 kg vivo) dividida em 3 lotes/mes (~733 kg cada) "
                 "transferidos ao 7 tanque (60 m3)")],
        ["2", tc("Jejum alimentar forcado em fluxo continuo de agua do poco artesiano "
                 "por 3 a 5 dias a 28 C")],
        ["3", tc("Purga de compostos organoleticos pelas branquias + esvaziamento "
                 "do trato digestorio")],
        ["4", tc("Teste sensorial: cozinhar amostra e avaliar sabor/odor antes da "
                 "liberacao para venda")],
    ]
    t = Table(proc_dep, colWidths=[1.5*cm, 15*cm])
    t.setStyle(tabela_base_style(fontsize=8.5))
    story.append(t)
    story.append(sp(6))
    story.append(destaque(
        "Impacto: peixes sem depuracao sofrerao desconto de 30-50% no preco. "
        "Com depuracao adequada: R$ 45/kg de file (preco conservador B2B de atacado)."
    ))
    story.append(sp(10))

    story.append(h2("4.2 Portfolio de Produtos e Faturamento"))
    fat = [
        ["Produto", "Volume/mes", "Preco Medio", "Faturamento/mes"],
        [tc("File B2B - Restaurantes (80% de 616 kg)"), "493 kg", "R$ 45,00/kg", "R$ 22.185"],
        [tc("File B2C - Feiras (20% de 616 kg)"),       "123 kg", "R$ 55,00/kg", "R$ 6.765"],
        [tc("Linguica B2B (80% de 248 kg)"),            "198 kg", "R$ 30,00/kg", "R$ 5.940"],
        [tc("Linguica B2C (20% de 248 kg)"),            "50 kg",  "R$ 42,00/kg", "R$ 2.100"],
        [tc("Farinha de peixe excedente (graxaria)"),   "121 kg", "R$ 4,00/kg",  "R$ 484"],
        ["TOTAL", "", "", "R$ 37.474"],
    ]
    t = Table(fat, colWidths=[5.5*cm, 2.5*cm, 3*cm, 5.5*cm])
    bs = tabela_base_style()
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [("ALIGN",(1,0),(-1,-1),"CENTER")]))
    story.append(t)
    story.append(nota(
        "616 kg file para venda = 726 kg total - 110 kg destinados a linguica. "
        "Linguica limitada pela barriguinha (5% do peso vivo = 110 kg/mes). "
        "Preco medio ponderado file: (0,80 x R$45) + (0,20 x R$55) = R$ 47,00/kg."
    ))
    story.append(sp(10))

    story.append(h2("4.3 Rastreabilidade e Inspecao Sanitaria"))
    for titulo, desc in [
        ("SIM - Servico de Inspecao Municipal:", "Venda dentro do municipio. Mais simples para iniciar."),
        ("SIE - Servico de Inspecao Estadual (MG):", "Venda em todo o estado. <b>Previsto no projeto - obrigatorio para escalar.</b>"),
        ("SIF - Servico de Inspecao Federal:", "Venda nacional/exportacao. Previsto para expansao futura."),
    ]:
        story.append(bullet(f"<b>{titulo}</b> {desc}"))
    story.append(sp(12))

    # ── 4.4 Ração para Terceiros ──
    story.append(h2("4.4 Venda de Racao para Terceiros (Pos Fase 4)"))
    story.append(p(
        "A extrusora opera apenas <b>~22 horas/mes</b> para cobrir a demanda propria (3.347 kg). "
        "Restam mais de <b>700 horas/mes disponíveis</b> — suficientes para produzir e vender "
        "racao a piscicultores locais a R$ 3,50–4,00/kg, cerca de 20–25% abaixo do mercado "
        "(R$ 4,45/kg). <b>CAPEX adicional: R$ 0.</b>"
    ))
    story.append(sp(6))

    story.append(h3("Estrategia de Dois Niveis — Contornando o Gargalo de Farinha de Peixe"))
    story.append(p(
        "A graxaria produz 288 kg/mes de farinha de peixe, dos quais apenas <b>121 kg ficam "
        "excedentes</b> apos suprir a racao propria. Para volumes maiores usa-se formulacao "
        "Tier 2, substituindo a farinha de peixe propria por farinha de carne/ossos comprada:"
    ))
    story.append(sp(4))

    tier = [
        ["Ingrediente", "Tier 1 — Premium (c/ graxaria)", "Tier 2 — Padrao (vegetal)"],
        ["Farelo de Soja 45% PB", "50%", "50%"],
        ["Milho Moido", "38%", "38%"],
        [tc("Farinha de Peixe propria (~60% PB)", size=8), "5%", "—"],
        [tc("Farinha de Carne/Ossos 50% PB (comprada)", size=8), "—", "5%"],
        ["Premix vitaminico/mineral", "3%", "3%"],
        [tc("Oleo de Peixe proprio", size=8), "2%", "—"],
        [tc("Oleo de Soja (comprado)", size=8), "—", "2%"],
        ["Vitamina C + Sal", "2%", "2%"],
        ["Custo/kg (ingredientes + energia + MO)", "~R$ 2,10", "~R$ 2,25"],
        ["Preco de venda sugerido", "R$ 3,80–4,00/kg", "R$ 3,50/kg"],
        ["Margem bruta/kg", "~R$ 1,70–1,90", "~R$ 1,25"],
        [tc("Volume maximo com farinha propria: 2.420 kg/mes  |  "
            "Tier 2: ilimitado pela extrusora", bold=True), "", ""],
    ]
    t = Table(tier, colWidths=[6*cm, 4.5*cm, 4.5*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [
        ("ALIGN", (1,0), (-1,-1), "CENTER"),
        ("SPAN",  (0,-1), (-1,-1)),
    ]))
    story.append(t)
    story.append(sp(6))

    story.append(h3("Projecao Financeira — 5.000 kg/mes para Terceiros"))
    proj_rac = [
        ["Item", "Valor (R$/mes)"],
        ["Receita (5.000 kg x R$ 3,50 — Tier 2)", "17.500"],
        ["Ingredientes variaveis (5.000 kg x R$ 2,12)", "−10.600"],
        ["Energia incremental (extrusora)", "−400"],
        ["Mao de obra adicional (operador part-time)", "−1.000"],
        ["Embalagem (sacos rafia 25–40 kg)", "−400"],
        ["LUCRO LIQUIDO INCREMENTAL", "~R$ 5.100/mes"],
    ]
    t = Table(proj_rac, colWidths=[11*cm, 5.5*cm])
    bs = tabela_base_style(fontsize=9)
    cmds_r = list(bs._cmds) + [
        ("BACKGROUND", (0,6), (-1,6), VERDE_BG),
        ("FONTNAME",   (0,6), (-1,6), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,6), (-1,6), VERDE_ESCURO),
        ("LINEABOVE",  (0,6), (-1,6), 1.5, VERDE_MEDIO),
        ("ALIGN",      (1,0), (-1,-1), "RIGHT"),
    ]
    t.setStyle(TableStyle(cmds_r))
    story.append(t)
    story.append(nota(
        "CAPEX adicional: R$ 0 (extrusora ja instalada). Capital de giro extra: ~R$ 10.000 "
        "(estoque de ingredientes ampliado). Requisito: registro MAPA de fabricante de racao "
        "(ja previsto na Fase 4). Resultado nao incluso nas projecoes base — tratado como upside."
    ))
    story.append(sp(12))

    # ── 4.5 Couro de Tilápia ──
    story.append(h2("4.5 Couro de Tilapia — Oportunidade Exploratorio Futura"))
    story.append(p(
        "O processo de filetagem gera <b>~2.200–2.550 peles/mes</b>. Apos limpeza e salga, "
        "as peles podem ser vendidas a curtumes especializados ou artesaos de couro de peixe. "
        "O potencial e expressivo, mas a entrada de mercado exige prospecao ativa de parceiros."
    ))
    story.append(sp(6))

    couro = [
        ["Destino", "Preco/pele", "Receita potencial (2.000 peles uteis/mes)"],
        [tc("Curtume — pele salgada bruta", size=8), "R$ 3–5", "R$ 6.000–10.000/mes"],
        [tc("Curtume — pele salgada selecionada", size=8), "R$ 5–8", "R$ 10.000–16.000/mes"],
        [tc("Artesao local — pele semi-curtida", size=8), "R$ 10–15", "R$ 20.000–30.000/mes"],
    ]
    t = Table(couro, colWidths=[5.5*cm, 2.5*cm, 7.5*cm])
    t.setStyle(tabela_base_style(fontsize=8))
    story.append(t)
    story.append(sp(4))
    story.append(destaque(
        "Recomendacao: nao incluir no CAPEX/OPEX atual. Apos estabilizacao da operacao (mes 7+), "
        "prospectar curtumes e atelies em BH/SP. Se houver comprador firme, o investimento e "
        "minimo: tanque de salga (~R$ 800) + sal grosso (~R$ 200/mes). Alta geracao de valor, "
        "entrada de mercado incerta — tratar como Fase 6 opcional."
    ))
    return story

# ── Seção 5 — Licenciamento ────────────────────────────────────────────────────
def secao_licenciamento():
    story = []
    story.append(PageBreak())
    story.append(h1("5. LICENCIAMENTO E CONFORMIDADE LEGAL - MINAS GERAIS"))
    story.append(linha_verde())

    lic = [
        ["Licenca / Cadastro", "Orgao", "Base Legal", "Custo Estimado"],
        [tc("Licenciamento Ambiental (LAS)", size=8),
         "COPAM/FEAM",
         tc("DN COPAM 217/2017<br/>Codigo G-02-12-7", size=8),
         "R$ 5.000"],
        [tc("Outorga Hidrica (formal)", size=8),
         "IGAM",
         tc("Uso ~18 m3/dia supera<br/>limiar de uso insignificante", size=8),
         "R$ 2.500"],
        [tc("Cadastro Aquicola", size=8),
         "IMA",
         tc("Legislacao sanitaria<br/>aquicola MG", size=8),
         "Gratuito"],
        [tc("Inspecao Sanitaria Estadual", size=8),
         "SIE-MG",
         tc("Legislacao de<br/>inspecao animal", size=8),
         "R$ 3.000"],
        [tc("Registro Fabrica de Racao + Graxaria", size=8),
         "MAPA",
         tc("Obrigatorio escala<br/>semi-industrial", size=8),
         "R$ 1.500"],
        [tc("Responsavel tecnico (eng. pesca/zootecnista)", size=8),
         "-",
         tc("Exigido COPAM e SIE", size=8),
         "R$ 3.000"],
        ["TOTAL LICENCIAMENTO", "", "", "~R$ 15.000"],
    ]
    t = Table(lic, colWidths=[4.5*cm, 2.5*cm, 4*cm, 3.5*cm])
    bs = tabela_base_style(fontsize=8)
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(4))
    story.append(nota(
        "Atencao: O uso do poco artesiano (~18 m3/dia) ultrapassa o limiar de uso insignificante "
        "(10 m3/dia - IGAM/MG). Outorga formal obrigatoria via SOUT. Obter laudo de capacidade "
        "do poco antes de iniciar. Homologacao CEMIG para solar >10 kWp: prazo 3-9 meses."
    ))
    story.append(sp(10))

    story.append(h2("Checklist de Conformidade Legal - Pre-Operacao"))
    checks = [
        "Analise fisico-quimica e microbiologica da agua do poco artesiano",
        "Contratar responsavel tecnico (eng. de pesca ou zootecnista) - obrigatorio para COPAM e SIE",
        "Laudo hidrogeologico do poco artesiano (capacidade de vazao para ~18 m3/dia)",
        "Cadastro no portal Eco Sistemas (SEMAD/MG)",
        "Verificar dominialidade da agua via IDE Sisema",
        "Solicitar LAS via SLA (COPAM/FEAM)",
        "Solicitar Outorga Formal via SOUT (IGAM) - uso ~18 m3/dia supera limiar insignificante",
        "Registrar no IMA - Instituto Mineiro de Agropecuaria",
        "Solicitar SIM ou SIE para processamento e venda (antes da 1a despesca - mes 7)",
        "Verificar certificacao sanitaria TiLV dos fornecedores de alevinos antes do 1o lote",
        "Fase 4: Consultar MAPA sobre registro de fabrica de racao e comercio de farinha",
        "Fase 4: Piloto de fotoperiodo - testar em 2 tanques por 1 ciclo antes de escalar",
        "Fase 5: Iniciar homologacao CEMIG com 6 meses de antecedencia",
        "Averbacao/regularizacao fundiaria do terreno (requisito PRONAF)",
        "Declaracao de Aptidao ao PRONAF (DAP) ou CAF ativa no nome do produtor",
    ]
    for i, c in enumerate(checks, 1):
        story.append(Paragraph(f"&#x2610;  {i}. {c}", S_BODY))
        story.append(sp(3))
    return story

# ── Seção 6 — Plano Financeiro ─────────────────────────────────────────────────
def secao_financeiro():
    story = []
    story.append(PageBreak())
    story.append(h1("6. PLANO FINANCEIRO CONSOLIDADO"))
    story.append(linha_verde())

    story.append(h2("6.1 CAPEX - Investimento por Fase"))
    capex_total = [
        ["Fase", "Descricao", "Valor (R$)"],
        ["1", tc("Infraestrutura, Aeracao, 7 Tanque (buffer 60 m3), "
                 "Processamento SIE e Linguica/Defumacao", size=9), "120.000"],
        ["2", tc("Automacao e Seguranca (CLP, sensores OD, inversores, gerador)", size=9), "47.800"],
        ["3", tc("Climatizacao, Fotoperiodo e Alimentacao (Bomba 48k BTU, EPS, Sombrite, LED)", size=9), "52.760"],
        ["4", tc("Fabrica de Racao + Graxaria (c/ controle de odor)", size=9), "107.600"],
        ["5", tc("Energia Solar Fotovoltaica (sistema 26 kWp bifacial completo)", size=9), "112.200"],
        ["-", tc("Licenciamento (COPAM, IGAM, SIE, MAPA, resp. tecnico)", size=9), "10.000"],
        ["TOTAL CAPEX", "", "R$ 450.360"],
    ]
    t = Table(capex_total, colWidths=[1.5*cm, 12*cm, 3*cm])
    bs = tabela_base_style(fontsize=9)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [
        ("ALIGN",(0,0),(0,-1),"CENTER"),
        ("ALIGN",(2,0),(-1,-1),"RIGHT"),
    ]))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.2 OPEX Mensal - Cenario Base (Fases 1-3, com linguica desde mes 7)"))
    story.append(nota("Sem fabrica de racao propria e sem energia solar."))
    story.append(sp(4))
    opex = [
        ["Item", "Valor Mensal (R$)"],
        ["Racao Comercial (3.347 kg x R$ 4,45 - inclui todos os ciclos)", "14.900"],
        ["Energia - Sopradores (2 x 2 CV, inversor WEG)", "1.050"],
        ["Energia - CLP, alimentadores, iluminacao + LED", "220"],
        ["Energia - Bomba de Calor Inverter 48k BTU (media anual)", "388"],
        ["Alevinos (~2.900/mes, reversao sexual GenoMar/Supreme)", "1.160"],
        ["Mao de obra (1 tecnico/proprietario)", "3.000"],
        ["Manutencao e insumos", "800"],
        ["Processamento (abate/filetagem)", "1.350"],
        ["Insumos linguica (temperos, tripa, embalagem, defumacao)", "1.650"],
        ["OPEX TOTAL", "24.518"],
        ["Faturamento - file (616 kg x R$ 47,00 medio ponderado)", "28.952"],
        ["Faturamento - linguica (248 kg)", "8.040"],
        ["FATURAMENTO TOTAL", "36.992"],
        ["LUCRO LIQUIDO MENSAL", "R$ 12.474"],
    ]
    t = Table(opex, colWidths=[11*cm, 5.5*cm])
    bs = tabela_base_style(fontsize=9)
    cmds = list(bs._cmds) + [
        ("BACKGROUND", (0,10), (-1,10), colors.HexColor("#ECEFF1")),
        ("FONTNAME",   (0,10), (-1,10), "Helvetica-Bold"),
        ("BACKGROUND", (0,11), (-1,11), colors.HexColor("#E3F2FD")),
        ("BACKGROUND", (0,12), (-1,12), colors.HexColor("#E3F2FD")),
        ("BACKGROUND", (0,13), (-1,13), colors.HexColor("#BBDEFB")),
        ("FONTNAME",   (0,13), (-1,13), "Helvetica-Bold"),
        ("BACKGROUND", (0,14), (-1,14), VERDE_BG),
        ("FONTNAME",   (0,14), (-1,14), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,14), (-1,14), VERDE_ESCURO),
        ("LINEABOVE",  (0,10), (-1,10), 1.0, CINZA_LINHA),
        ("LINEABOVE",  (0,14), (-1,14), 1.5, VERDE_MEDIO),
        ("ALIGN",      (1,0),  (-1,-1), "RIGHT"),
    ]
    t.setStyle(TableStyle(cmds))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.3 Impacto da Verticalizacao (Fases 4 e 5)"))
    impacto = [
        ["Etapa", "Acao", "Ganho Mensal", "Lucro Mensal"],
        [tc("Fases 1-3<br/>(c/ linguica)"),
         tc("Operacao base com fotoperiodo 18L:6D e linguica"),
         "-", "R$ 12.474"],
        [tc("+ Fase 4<br/>(Fabrica)"),
         tc("Racao cai de R$ 14.900 para R$ 7.029 (3.347 kg x R$ 2,10)"),
         "R$ 7.871", "R$ 20.345"],
        [tc("+ Graxaria"),
         tc("Racao cai para R$ 5.959; farinha exc. R$ 484; OPEX graxaria -R$ 400"),
         "R$ 1.154", "R$ 21.499"],
        [tc("+ Fase 5<br/>(Solar)"),
         tc("Energia OPEX: R$ 1.658 -> R$ 290 (economia R$ 1.368)"),
         "R$ 1.368", "R$ 22.865"],
    ]
    t = Table(impacto, colWidths=[2.5*cm, 7.5*cm, 3*cm, 3.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    cmds2 = list(bs._cmds) + [
        ("BACKGROUND", (0,4), (-1,4), VERDE_BG),
        ("FONTNAME",   (0,4), (-1,4), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,4), (-1,4), VERDE_ESCURO),
        ("ALIGN",      (2,0), (-1,-1), "CENTER"),
        ("VALIGN",     (0,0), (-1,-1), "TOP"),
    ]
    t.setStyle(TableStyle(cmds2))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.4 Capital de Giro"))
    story.append(p(
        "Nos primeiros 6 meses, os tanques estao sendo ativados progressivamente e nenhum lote "
        "atingiu o peso de despesca. <b>Capital de giro necessario: R$ 90.000</b> - deve estar "
        "reservado antes do inicio das operacoes."
    ))
    story.append(sp(12))

    story.append(h2("6.5 Payback e Projecao de Retorno"))
    payback = [
        ["Cenario", "CAPEX Total", "Capital Giro", "Investimento Total", "Lucro Mensal", "Payback"],
        [tc("Fases 1-3<br/>(c/ linguica)", center=True),
         "R$ 220.560", "R$ 90.000", "R$ 310.560", "R$ 12.474",
         tc("25 meses<br/>(2,1 anos)", center=True)],
        [tc("Completo<br/>(Fases 1-5)", center=True),
         "R$ 450.360", "R$ 90.000", "R$ 540.360", "R$ 22.865",
         tc("24 meses<br/>(2,0 anos)", center=True)],
    ]
    t = Table(payback, colWidths=[3*cm, 2.5*cm, 2.5*cm, 3.2*cm, 2.5*cm, 2.8*cm])
    bs = tabela_base_style(fontsize=7.5)
    cmds3 = list(bs._cmds) + [
        ("BACKGROUND", (0,2), (-1,2), VERDE_BG),
        ("FONTNAME",   (0,2), (-1,2), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,2), (-1,2), VERDE_ESCURO),
        ("ALIGN",      (1,0), (-1,-1), "CENTER"),
        ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
    ]
    t.setStyle(TableStyle(cmds3))
    story.append(t)
    story.append(sp(12))

    story.append(h2("6.6 Resumo Executivo - Operacao Completa"))
    resumo = [
        ["Metrica", "Valor"],
        ["Investimento Total (Fases 1-5 + Capital de Giro)", "R$ 540.360"],
        ["Faturamento Mensal (file + linguica + farinha excedente)", "R$ 37.474"],
        ["Faturamento Anual", "R$ 449.688"],
        ["OPEX Mensal (racao propria + solar + graxaria + linguica)", "R$ 14.609"],
        ["OPEX Anual", "R$ 175.308"],
        ["Lucro Operacional Mensal", "R$ 22.865"],
        ["Lucro Operacional Anual", "R$ 274.380"],
        ["Margem Operacional", "61,0%"],
        ["Payback (lucro operacional)", "2,0 anos"],
        ["Lucro economico ajustado (c/ depreciacao e FUNRURAL)", "~R$ 18.325/mes"],
        ["Projecao R$ 1.000.000 em lucros acumulados", "~3,6 anos apos inicio das despescas"],
    ]
    t = Table(resumo, colWidths=[9*cm, 7.5*cm])
    bs = tabela_base_style(header_bg=VERDE_ESCURO, fontsize=9)
    ts = tabela_total_style(bs)
    t.setStyle(ts)
    story.append(t)
    story.append(sp(6))
    story.append(p(
        "Com lucro anual de ~R$ 274.380, a marca de <b>R$ 1.000.000 em lucros acumulados</b> e "
        "atingida em ~3,6 anos apos o inicio das despescas. "
        "Mesmo no cenario pessimista (-20% preco filé, -15% producao), o lucro permanece "
        "em ~R$ 12.400/mes - fluxo de caixa positivo assegurado pela diversificacao "
        "(linguica + graxaria) e pela verticalizacao (racao + energia)."
    ))
    story.append(sp(12))

    story.append(h2("6.7 Potencial Adicional — Racao para Terceiros (Pos Fase 4)"))
    story.append(p(
        "Receita nao inclusa nas projecoes base acima — tratada como <b>upside conservador</b>. "
        "A extrusora opera apenas ~22 h/mes para cobertura propria; a capacidade ociosa pode "
        "ser vendida a piscicultores locais sem investimento adicional (CAPEX = R$ 0)."
    ))
    story.append(sp(6))

    upside = [
        ["Cenario", "Volume Adicional", "Lucro Incremental/mes", "Lucro Anual Extra"],
        ["Conservador", "2.500 kg/mes", "~R$ 2.400", "~R$ 28.800"],
        ["Base",         "5.000 kg/mes", "~R$ 5.100", "~R$ 61.200"],
        ["Otimista",    "10.000 kg/mes", "~R$ 9.500", "~R$ 114.000"],
    ]
    t = Table(upside, colWidths=[3.5*cm, 3.5*cm, 4.5*cm, 4.5*cm])
    bs = tabela_base_style(header_bg=VERDE_MEDIO, fontsize=9)
    cmds_u = list(bs._cmds) + [("ALIGN", (1,0), (-1,-1), "CENTER")]
    t.setStyle(TableStyle(cmds_u))
    story.append(t)
    story.append(nota(
        "Formulacao Tier 2 (farinha de carne/ossos no lugar de farinha de peixe): custo ~R$ 2,25/kg, "
        "venda a R$ 3,50/kg (20% abaixo do mercado). Requisito: registro MAPA ja previsto. "
        "Capital de giro extra: ~R$ 10.000. Ver secao 4.4 para detalhes."
    ))
    return story

# ── Seção 7 — Riscos ───────────────────────────────────────────────────────────
def secao_riscos():
    story = []
    story.append(PageBreak())
    story.append(h1("7. MATRIZ DE RISCOS"))
    story.append(linha_verde())

    riscos = [
        ["Risco", "Prob.", "Impacto", "Mitigacao"],
        [tc("Falha de energia (apagao)", size=7.5),
         "Media",
         tc("Critico<br/>(mortalidade 100%<br/>em 30-60 min)", size=7.5),
         tc("Gerador 8-10 kVA com QTA automatico (Fase 2); reserva 20L gasolina (~8h)", size=7.5)],
        [tc("Falha da Bomba de Calor no inverno", size=7.5),
         "Baixa",
         tc("Alto<br/>(peixes param de comer<br/>em &lt;20 C)", size=7.5),
         tc("Contrato assistencia tecnica 24h; EPS 50mm + la de rocha retardam queda termica "
            "(grande inertia 360 m3)", size=7.5)],
        [tc("TiLV - Tilapia Lake Virus", size=7.5),
         "Baixa-Media",
         tc("Critico<br/>(mortalidade 20-90%,<br/>sem tratamento)", size=7.5),
         tc("Comprar alevinos SOMENTE com certificacao MAPA e laudo negativo TiLV; "
            "quarentena 10-14 dias; notificar IMA-MG", size=7.5)],
        [tc("Saprolegniose (fungo agua fria)", size=7.5),
         "Baixa",
         tc("Alto<br/>(mortalidade em<br/>alevinos)", size=7.5),
         tc("Manter temperatura &gt;24 C (Fase 3); NaCl 1-3 g/L preventivo em falhas termicas; "
            "remover peixes mortos imediatamente", size=7.5)],
        [tc("FCA real &gt; 1,3", size=7.5),
         "Media",
         tc("Moderado<br/>(reducao de margem)", size=7.5),
         tc("Biometrias quinzenais; ajuste da taxa de arracoamento; "
            "antioxidante obrigatorio no oleo da graxaria", size=7.5)],
        [tc("Doenca bacteriana<br/>(Estreptococose, Columnaris)", size=7.5),
         "Media",
         tc("Alto<br/>(perda 30-50% do lote)", size=7.5),
         tc("Banhos NaCl 3-5 g/L; qualidade agua rigida (NH3 &lt;1, NO2 &lt;0,5 mg/L); "
            "premix vitaminico; quarentena alevinos 5-7 dias", size=7.5)],
        [tc("Ganho de fotoperiodo<br/>abaixo do esperado", size=7.5),
         "Baixa-Media",
         tc("Moderado<br/>(~R$ 2.000-4.000/mes<br/>a menos)", size=7.5),
         tc("RECOMENDADO: piloto em 2 tanques por 1 ciclo completo (6 meses) antes de "
            "implantar LED em todos os 6 tanques", size=7.5)],
        [tc("Falta de alevinos de qualidade", size=7.5),
         "Baixa",
         tc("Moderado<br/>(atraso de producao)", size=7.5),
         tc("Manter &gt;=2 fornecedores homologados com cert. TiLV (GenoMar, Aquabel, Supreme)",
            size=7.5)],
        [tc("Falha mecanica da extrusora", size=7.5),
         "Baixa",
         tc("Moderado<br/>(compra emergencial<br/>de racao)", size=7.5),
         tc("Estoque 1 semana racao comercial (~R$ 3.720); 2 fornecedores homologados 32% PB; "
            "pecas criticas em estoque", size=7.5)],
    ]
    t = Table(riscos, colWidths=[3.5*cm, 1.8*cm, 3.5*cm, 7.7*cm])
    bs = tabela_base_style(fontsize=7.5)
    cmds_r = list(bs._cmds) + [
        ("BACKGROUND", (1,1),(1,1), AMARELO_DEST),
        ("BACKGROUND", (1,2),(1,2), colors.HexColor("#E8F5E9")),
        ("BACKGROUND", (1,3),(1,3), colors.HexColor("#FFEBEE")),
        ("BACKGROUND", (1,4),(1,4), colors.HexColor("#E8F5E9")),
        ("BACKGROUND", (1,5),(1,5), AMARELO_DEST),
        ("BACKGROUND", (1,6),(1,6), AMARELO_DEST),
        ("BACKGROUND", (1,7),(1,7), AMARELO_DEST),
        ("BACKGROUND", (1,8),(1,8), colors.HexColor("#E8F5E9")),
        ("BACKGROUND", (1,9),(1,9), colors.HexColor("#E8F5E9")),
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
        "O projeto enquadra-se em tres modalidades complementares do PRONAF, "
        "cobrindo a integralidade das 5 fases de implantacao:"
    ))
    story.append(sp(8))

    linhas = [
        ["Linha PRONAF", "Destinacao", "Fases", "Valor Solicitado"],
        [tc("PRONAF Investimento"),
         tc("Infraestrutura (tanques, aeracao, 7 tanque buffer), automacao, climatizacao, "
            "fotoperiodo e processamento SIE"),
         "1, 2 e 3", "R$ 220.560"],
        [tc("PRONAF Agroindustria"),
         tc("Fabrica de Racao Extrusada + Graxaria (farinha e oleo de peixe) - "
            "verticalizacao total da cadeia produtiva"),
         "4", "R$ 107.600"],
        [tc("PRONAF Eco<br/>(Energias Renovaveis)"),
         tc("Usina Solar Fotovoltaica 26 kWp - energia propria renovavel para operacao 24/7"),
         "5", "R$ 112.200"],
        [tc("Capital de Giro"),
         tc("Cobertura de OPEX durante os 6 primeiros meses sem faturamento"),
         "-", "R$ 90.000"],
        ["TOTAL SOLICITADO", "", "", "R$ 530.360"],
    ]
    t = Table(linhas, colWidths=[4*cm, 8*cm, 2*cm, 2.5*cm])
    bs = tabela_base_style(fontsize=8.5)
    ts = tabela_total_style(bs)
    t.setStyle(TableStyle(list(ts._cmds) + [
        ("ALIGN",  (2,0), (-1,-1), "CENTER"),
        ("ALIGN",  (3,0), (-1,-1), "RIGHT"),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
    ]))
    story.append(t)
    story.append(sp(10))

    story.append(h2("Justificativas por Linha"))
    justificativas = [
        ("PRONAF Investimento",
         "Implantacao de sistema produtivo de aquicultura familiar intensiva com tecnologia de baixo "
         "impacto ambiental. Ciclo escalonado garante fluxo de caixa a partir do 7 mes. Sistema de "
         "fotoperiodo 18L:6D (base cientifica consolidada) eleva a biomassa em +15% sem insumos "
         "adicionais. Sala SIE-MG permite venda em todo o estado desde a primeira despesca."),
        ("PRONAF Agroindustria",
         "Verticalizacao completa da cadeia produtiva: fabricacao de racao extrusada flutuante propria "
         "(R$ 2,10/kg vs R$ 4,45 comercial) e aproveitamento 100% dos residuos da filetagem em graxaria "
         "para producao de farinha de peixe (~60% PB) e oleo de peixe. Elimina silagem acida - produto "
         "de maior valor nutricional, menor volume, com possibilidade de venda do excedente. "
         "Reduce a dependencia de mercado externo para os dois principais insumos de origem animal."),
        ("PRONAF Eco",
         "Sistema de geracao propria de energia renovavel para uso produtivo rural. O projeto consome "
         "energia 24/7 (sopradores, bomba de calor, automacao) - a solar on-grid e a solucao ideal. "
         "26 kWp atendem 100% da demanda (2.460 kWh/mes). A parcela mensal de financiamento aproxima-se "
         "da economia gerada na conta de energia - investimento de custo liquido proximo a zero."),
    ]
    for titulo, desc in justificativas:
        story.append(KeepTogether([h3(titulo), p(desc), sp(6)]))
    return story

# ── Seção 9 — Princípios de Engenharia ────────────────────────────────────────
def secao_principios():
    story = []
    story.append(PageBreak())
    story.append(h1("9. PRINCIPIOS DE ENGENHARIA DO PROJETO"))
    story.append(linha_verde())

    principios = [
        ("1. Verticalizacao Total",
         "Producao propria de racao (Fase 4) e energia (Fase 5) eleva o lucro de R$ 12.474 para "
         "R$ 22.865/mes. A verticalizacao e o principal diferencial competitivo do modelo: "
         "racao propria (-R$ 8.941/mes vs. comercial) + solar (-R$ 1.368/mes de energia explicitada)."),
        ("2. Airlifts em vez de Bombas Eletricas",
         "Circulacao de agua sem motores submersos - menor custo de manutencao, maior confiabilidade "
         "e eliminacao do risco de curto-circuito. O ar dos sopradores realiza o trabalho hidraulico "
         "pelos Airlifts, alimentando os bocais tangenciais do Cornell Dual-Drain."),
        ("3. Isolamento e Fotoperiodo em vez de Forca Bruta",
         "EPS 50mm noturno + sombrite 50% diurno reduzem o pico de carga termica de 21,2 kW para "
         "10,9 kW, possibilitando bomba de 48k BTU/h em vez de 80k BTU/h (-R$ 15.000 CAPEX, "
         "-R$ 5.510/ano OPEX). O mesmo sistema de cobertura, acrescido de faixas LED IP68 nas "
         "paredes, implementa fotoperiodo 18L:6D com ganho comprovado de +15% de biomassa."),
        ("4. Modularidade Financiada pela Propria Operacao",
         "5 fases independentes: a geracao de caixa das Fases 1-3 (lucro R$ 12.474/mes) financia "
         "a implantacao das Fases 4 e 5, que por sua vez mais que dobram o lucro. O produtor inicia "
         "com CAPEX de R$ 220.560 e escala ate R$ 450.360 conforme a propria operacao gera recursos."),
        ("5. Autossuficiencia de Insumos via Graxaria",
         "100% dos residuos da filetagem (1.309 kg/mes) sao convertidos em farinha de peixe "
         "(~60% PB, superior a farinha comercial) e oleo de peixe na propria graxaria. "
         "Isso internaliza os dois insumos de origem animal da racao e ainda gera excedente "
         "de farinha para venda (~121 kg/mes x R$ 4,00 = R$ 484/mes de receita adicional)."),
        ("6. Mitigacao de Riscos em Camadas",
         "Cada risco critico tem mitigacao estrutural: falha de energia -> gerador QTA <15s; "
         "queda termica -> EPS + la de rocha (inertia 360 m3 ganha horas para reparo); "
         "doenca -> quarentena + certificacao TiLV; dependencia de insumo -> racao propria + "
         "2 fornecedores homologados; dependencia de cliente -> carteira de 8-10 restaurantes."),
    ]
    for titulo, desc in principios:
        story.append(KeepTogether([h2(titulo), p(desc), sp(8)]))
    return story

# ── Seção 10 — Cronograma ──────────────────────────────────────────────────────
def secao_cronograma():
    story = []
    story.append(PageBreak())
    story.append(h1("10. CRONOGRAMA DE IMPLANTACAO"))
    story.append(linha_verde())

    crono = [
        ["Mes", "Fase", "Atividade Principal"],
        ["1-2",   "Licenciamento",
         tc("Protocolo COPAM, IGAM (outorga formal), IMA, SIE; contratacao responsavel "
            "tecnico; laudo poco artesiano", size=8.5)],
        ["2-3",   "Fase 1",
         tc("Terraplenagem (2 patamares), montagem dos 7 tanques (60 m3 cada), "
            "instalacao eletrica e aeracao", size=8.5)],
        ["3-4",   "Fase 1",
         tc("Ativacao T1 e T2; primeiro lote de alevinos certificados "
            "(GenoMar/Supreme, laudo negativo TiLV)", size=8.5)],
        ["4-5",   "Fase 2",
         tc("CLP, sensores OD multiplexados, inversores WEG, gerador + QTA; "
            "programacao logica fotoperiodo e alimentadores", size=8.5)],
        ["5-6",   "Fase 3",
         tc("Bomba de Calor 48k BTU/h, la de rocha, paineis EPS 50mm, sombrite 50%, "
            "faixas LED IP68, alimentadores automaticos", size=8.5)],
        ["6",     "-",
         tc("Ativacao de todos os 6 tanques; regime de ciclo escalonado completo; "
            "piloto fotoperiodo 18L:6D nos 2 primeiros tanques", size=8.5)],
        ["7",     "-",
         tc("PRIMEIRA DESPESCA (T1 - 6 meses ciclo); inicio do faturamento; "
            "linguica e file desde o 1 dia", size=8.5)],
        ["8-12",  "Fase 4",
         tc("Fabrica de racao extrusada + graxaria; primeiras corridas de racao propria; "
            "producao de farinha e oleo", size=8.5)],
        ["12-16", "Fase 5",
         tc("Usina solar 26 kWp; protocolo CEMIG iniciado no mes 6 (prazo 3-9 meses); "
            "conexao e homologacao", size=8.5)],
        ["17+",   tc("Operacao<br/>Completa", center=True, size=8.5),
         tc("Margem 61,0%; lucro R$ 22.865/mes; meta R$ 1.000.000 em lucros acumulados "
            "em ~3,6 anos", size=8.5)],
    ]
    t = Table(crono, colWidths=[1.8*cm, 2.8*cm, 11.9*cm])
    bs = tabela_base_style(fontsize=8.5)
    cmds_c = list(bs._cmds) + [
        ("BACKGROUND", (0,7), (-1,7),  colors.HexColor("#FFF9C4")),
        ("FONTNAME",   (0,7), (-1,7),  "Helvetica-Bold"),
        ("BACKGROUND", (0,10),(-1,10), VERDE_BG),
        ("FONTNAME",   (0,10),(-1,10), "Helvetica-Bold"),
        ("TEXTCOLOR",  (0,10),(-1,10), VERDE_ESCURO),
        ("ALIGN",      (0,0), (1,-1),  "CENTER"),
        ("VALIGN",     (0,0), (-1,-1), "TOP"),
    ]
    t.setStyle(TableStyle(cmds_c))
    story.append(t)
    return story

# ── Página Final ───────────────────────────────────────────────────────────────
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
        "Projeto Tecnico de Piscicultura Intensiva de Tilapia<br/>"
        "RJ Piscicultura - Belo Horizonte, MG<br/>"
        "Solicitacao de Financiamento PRONAF - Maio de 2026",
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
        title="Projeto Tecnico de Piscicultura Intensiva de Tilapia",
        author="RJ Piscicultura",
        subject="Solicitacao de Financiamento PRONAF",
        creator="RJ Piscicultura - Gerado automaticamente",
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
    story += pagina_final()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF gerado: {OUTPUT}")

if __name__ == "__main__":
    build()
