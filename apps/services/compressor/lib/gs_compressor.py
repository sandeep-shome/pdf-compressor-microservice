import subprocess

quality_settings = {
        0: '/default',
        1: '/screen',
        2: '/ebook',
        3: '/printer'
    }

def compress_pdf_gs(input_path, output_path, power=1):
    """
    power: 0=default, 1=screen, 2=ebook, 3=printer
    """
    quality = quality_settings.get(power, '/ebook');
    
    gs_command = [
        "gs",
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={quality}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_path}",
        input_path
    ]

    try:
        subprocess.run(gs_command, check=True, text=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f"Error compressing PDF: {e}")