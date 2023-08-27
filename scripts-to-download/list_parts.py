import os
import re
import glob
import subprocess

def get_segment_number(filename):
    """Extraer el número del segmento del nombre del archivo."""
    match = re.search(r'seg-(\d+)-', filename)
    if match:
        return int(match.group(1))
    return 0

def generate_file_list(download_folder_path, working_folder_path):
    """Generar el archivo mylist.txt para FFmpeg."""
    ts_files = [f for f in os.listdir(download_folder_path) if f.endswith('.ts') and not f.endswith('(1).ts')]
    ts_files.sort(key=get_segment_number)
    file_list_content = "\n".join([f"file '{download_folder_path}{ts_file}'" for ts_file in ts_files])
    file_list_content = file_list_content.replace("\\", "/")
    with open(os.path.join(working_folder_path, 'mylist.txt'), 'w') as f:
        f.write(file_list_content)
    return ts_files

def concatenate_files(working_folder_path, name_file_output = 'output'):
    """Utilizar FFmpeg para concatenar los archivos de video."""
    ffmpeg_command = [
        "ffmpeg",
        "-f", "concat",
        "-safe", "0",
        "-i", os.path.join(working_folder_path, "mylist.txt"),
        "-c", "copy",
        "-y",
        os.path.join(working_folder_path, name_file_output + '.mp4')
    ]
    subprocess.run(ffmpeg_command)

def delete_original_files(download_folder_path, ts_files):
    """Eliminar los archivos .ts originales."""
    for ts_file in ts_files:
        os.remove(os.path.join(download_folder_path, ts_file))
        # Eliminar también los duplicados si existen
        duplicate_file = ts_file.replace('.ts', ' (1).ts')
        if os.path.exists(os.path.join(download_folder_path, duplicate_file)):
            os.remove(os.path.join(download_folder_path, duplicate_file))

if __name__ == "__main__":
    # Ruta a la carpeta donde se descargaron los archivos
    download_folder_path = os.path.expanduser("~/Downloads/")

    # Carpeta donde se realizarán todas las operaciones y donde se encuentra el script de Python
    working_folder_path = "D:/getCourses/"

    # Generar mylist.txt
    ts_files = generate_file_list(download_folder_path, working_folder_path)

    # Concatenar archivos usando FFmpeg
    name_file_output = '5. introduccion-a-la-seccion'
    concatenate_files(working_folder_path, name_file_output)

    # Eliminar archivos .ts originales
    delete_original_files(download_folder_path, ts_files)

    print(f"Se han concatenado y eliminado {len(ts_files)} archivos .ts")
