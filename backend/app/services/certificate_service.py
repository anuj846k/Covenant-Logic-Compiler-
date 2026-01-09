from datetime import datetime
from io import BytesIO

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def generate_certificate(data: dict) -> bytes:
    """
    Generate a classic LMA-style Compliance Certificate PDF.

    Args:
        data: Dictionary containing:
            - company_name: str
            - agent_name: str
            - agreement_date: str (e.g. "24 December 2021")
            - test_date: str (e.g. "31 December 2025")
            - leverage_ratio: float
            - leverage_limit: float
            - compliant: bool
            - ebitda: float
            - net_debt: float
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72,
    )

    # Styles
    styles = getSampleStyleSheet()

    # Custom styles to match the legal look
    style_title = ParagraphStyle(
        "LMA_Title",
        parent=styles["Heading1"],
        alignment=TA_CENTER,
        fontSize=12,
        fontName="Times-Bold",
        spaceAfter=20,
        spaceBefore=20,
    )

    style_normal = ParagraphStyle(
        "LMA_Normal",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=11,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=12,
    )

    style_bold = ParagraphStyle("LMA_Bold", parent=style_normal, fontName="Times-Bold")

    # Build content
    story = []

    # 1. Header (Schedule 8)
    story.append(Paragraph("SCHEDULE 8", style_title))
    story.append(Paragraph("Form of Compliance Certificate", style_title))
    story.append(Spacer(1, 20))

    # 2. To / From / Dated
    # We use a table for alignment
    header_data = [
        [
            Paragraph("To:", style_bold),
            Paragraph(
                f"{data.get('agent_name', '[Agent Name]')} as Facility Agent",
                style_normal,
            ),
        ],
        [
            Paragraph("From:", style_bold),
            Paragraph(
                f"<b>{data.get('company_name', '[Company Name]')}</b>", style_normal
            ),
        ],
        [
            Paragraph("Dated:", style_bold),
            Paragraph(datetime.now().strftime("%d %B %Y"), style_normal),
        ],
    ]

    t = Table(header_data, colWidths=[60, 400])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 10))

    # 3. Salutation
    story.append(Paragraph("To whom it may concern", style_normal))
    story.append(Spacer(1, 10))

    # 4. Agreement Reference
    agreement_ref = f'{data.get("company_name", "Project Amalfi")} – Facilities agreement dated {data.get("agreement_date", "[Date]")} (the "Facilities Agreement")'
    story.append(
        Paragraph(
            agreement_ref,
            ParagraphStyle("CenteredBold", parent=style_bold, alignment=TA_CENTER),
        )
    )
    story.append(Spacer(1, 15))

    # 5. Clause 1: Reference
    para_1 = """1. We refer to the Facilities Agreement. This is a Compliance Certificate. Terms defined in the Facilities Agreement have the same meaning when used in this Compliance Certificate unless given a different meaning in this Compliance Certificate."""
    story.append(Paragraph(para_1, style_normal))

    # 6. Clause 2: Financial Covenants (Dynamic)
    # Extract values
    test_date = data.get("test_date", "[Date]")
    leverage = data.get("leverage_ratio", 0.0)
    limit = data.get("leverage_limit", 0.0)
    compliant = data.get("compliant", False)

    compliance_text = "<b>has</b>" if compliant else "<b>has not</b>"
    compliance_color = (
        "green" if compliant else "red"
    )  # Just for logical emphasis, usually black ink in legal docs, but bold helps.

    para_2 = f"""2. We confirm that in respect of the Testing Period ended on {test_date} (the "Test Date") the Senior Secured Net Leverage Ratio on the Test Date was <b>{leverage:.2f}x</b> (Limit: {limit}x) and the Financial Covenant [{compliance_text}] been complied with."""
    story.append(Paragraph(para_2, style_normal))

    # 7. Clause 3: Margin Adjustments (Mocked for now as they typically depend on the ratio)
    para_3 = f"""3. We confirm that the Senior Secured Net Leverage Ratio was <b>{leverage:.2f}:1</b> on the Test Date, therefore:"""
    story.append(Paragraph(para_3, style_normal))

    # Sub-bullets for margins
    margins = [
        "(a) the Margin for each Loan under Senior Term Facility A should be [•] per cent per annum;",
        "(b) the Margin for each Loan under Senior Term Facility B should be [•] per cent per annum;",
        "(c) the Margin for each Loan under the Revolving Facility should be [•] per cent per annum.",
    ]
    for margin in margins:
        # Indent using table/padding or non-breaking spaces. ReportLab Paragraph supports 'bullet' indent.
        story.append(
            Paragraph(
                margin, ParagraphStyle("Bullet", parent=style_normal, leftIndent=20)
            )
        )

    story.append(Spacer(1, 12))

    # 8. Clause 4: Material Subsidiaries
    para_4 = """4. We confirm that the Material Subsidiaries [have not changed since the Closing Date] [date of the previous Compliance Certificate delivered with the Annual Financial Statements] [are:"""
    story.append(Paragraph(para_4, style_normal))
    story.append(
        Paragraph(
            "(a) [•]; and", ParagraphStyle("Bullet", parent=style_normal, leftIndent=20)
        )
    )
    story.append(
        Paragraph(
            "(b) [•]].", ParagraphStyle("Bullet", parent=style_normal, leftIndent=20)
        )
    )

    # 9. Clause 5: No Default
    para_5 = """5. We confirm that no Default is continuing."""
    story.append(Paragraph(para_5, style_normal))

    story.append(Spacer(1, 40))

    # 10. Signature
    story.append(Paragraph("Yours faithfully,", style_normal))
    story.append(Spacer(1, 10))

    # Signature Image Handling
    if data.get("signature_image"):
        try:
            import base64

            from reportlab.platypus import Image

            # Remove header if present (e.g., "data:image/png;base64,")
            img_data = data["signature_image"]
            if "," in img_data:
                img_data = img_data.split(",")[1]

            img_bytes = BytesIO(base64.b64decode(img_data))

            # Create Image flowable
            # Width=150 is roughly 2 inches, good size for signature
            sig_img = Image(img_bytes, width=150, height=50)
            sig_img.hAlign = "LEFT"
            story.append(sig_img)
            story.append(Spacer(1, 5))
        except Exception as e:
            print(f"Error processing signature: {e}")
            story.append(Spacer(1, 40))  # Fallback space if image fails
    else:
        story.append(Spacer(1, 40))  # Space for manual signature

    story.append(Paragraph("__________________________", style_normal))
    story.append(Paragraph("For and on behalf of", style_normal))
    story.append(
        Paragraph(f"<b>{data.get('company_name', '[Company Name]')}</b>", style_bold)
    )
    story.append(Spacer(1, 10))
    story.append(Paragraph("Chief Financial Officer / Director", style_normal))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
