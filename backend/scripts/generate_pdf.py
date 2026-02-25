from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=15)

with open("sample_test_agreement.txt", "r") as f:
    for line in f:
        pdf.multi_cell(0, 10, txt=line.encode('latin-1', 'replace').decode('latin-1'))

pdf.output("sample_test_agreement.pdf")
print("Successfully generated sample_test_agreement.pdf")
