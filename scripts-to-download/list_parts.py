import os
import re
import glob
import subprocess
import sys

def get_segment_number(filename):
    """Extract name file."""
    match = re.search(r'seg-(\d+)-', filename)
    if match:
        return int(match.group(1))
    return 0

def generate_file_list(download_folder_path, working_folder_path):
    """Generate file mylist.txt for ffmpeg."""
    ts_files = [f for f in os.listdir(download_folder_path) if f.endswith('.ts') and not f.endswith('(1).ts')]
    ts_files.sort(key=get_segment_number)
    file_list_content = "\n".join([f"file '{download_folder_path}{ts_file}'" for ts_file in ts_files])
    file_list_content = file_list_content.replace("\\", "/")
    with open(os.path.join(working_folder_path, 'mylist.txt'), 'w') as f:
        f.write(file_list_content)
    return ts_files

def concatenate_files(working_folder_path, name_file_output = 'output'):
    """Execute ffmpeg."""
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
    """Delete file .ts originals."""
    for ts_file in ts_files:
        os.remove(os.path.join(download_folder_path, ts_file))
        # Eliminar también los duplicados si existen
        duplicate_file = ts_file.replace('.ts', ' (1).ts')
        if os.path.exists(os.path.join(download_folder_path, duplicate_file)):
            os.remove(os.path.join(download_folder_path, duplicate_file))

if __name__ == "__main__":
    # Path to the folder where the files were downloaded
    # download_folder_path = os.path.expanduser("~/Downloads/")
    download_folder_path = os.path.expanduser("D:/Code/dev-talles-download/server/routes/videos/")

    # Folder where all operations will be performed and where the Python script is located
    working_folder_path = "D:/getCourses/"

    # Generate mylist.txt
    ts_files = generate_file_list(download_folder_path, working_folder_path)

    if len(sys.argv) > 1:
        nameVideo = sys.argv[1]
    else:
        nameVideo = "default"
        
    # Concat files using ffmpeg
    # name_file_output = '6. inicio-de-proyecto-numero-criptografico-aleatorio-atmosferico'
    concatenate_files(working_folder_path, nameVideo)

    # Delete files .ts originals
    delete_original_files(download_folder_path, ts_files)

    print(f"Concatenated and removed {len(ts_files)} files .ts")
