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
    ts_files = [f for f in os.listdir(download_folder_path) if f.endswith(
        '.ts') and not f.endswith('(1).ts')]
    ts_files.sort(key=get_segment_number)
    file_list_content = "\n".join(
        [f"file '{download_folder_path}{ts_file}'" for ts_file in ts_files])
    file_list_content = file_list_content.replace("\\", "/")
    with open(os.path.join(working_folder_path, 'mylist.txt'), 'w') as f:
        f.write(file_list_content)
    return ts_files


def concatenate_files(working_folder_path, name_file_output='output'):
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
        # delete duplicates
        duplicate_file = ts_file.replace('.ts', ' (1).ts')
        if os.path.exists(os.path.join(download_folder_path, duplicate_file)):
            os.remove(os.path.join(download_folder_path, duplicate_file))


def get_video_resolution(video_path):
    try:
        result = subprocess.run(
            ["ffmpeg", "-i", video_path], stderr=subprocess.PIPE, text=True)
        resolution_match = re.search(r"(\d{3,4}x\d{3,4})", result.stderr)
        if resolution_match:
            print(f"Video Resolution: {resolution_match.group(1)}")
        else:
            print("Could not find video resolution.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    # Path to the folder where the files were downloaded
    # download_folder_path = os.path.expanduser("~/Downloads/")
    download_folder_path = os.path.expanduser(
        "D:/Code/tool-download/server/routes/videos/")

    # Folder where all operations will be performed and where the Python script is located
    working_folder_path = "D:/getCourses/"

    # Generate mylist.txt
    ts_files = generate_file_list(download_folder_path, working_folder_path)

    if len(sys.argv) > 1:
        nameVideo = sys.argv[1]
    else:
        nameVideo = "default"

    # Concat files using ffmpeg
    # name_file_output = '6. name video'
    concatenate_files(working_folder_path, nameVideo)

    # Shouw resolution video
    output_video_path = os.path.join(working_folder_path, f"{nameVideo}.mp4")
    get_video_resolution(output_video_path)

    # Delete files .ts originals
    delete_original_files(download_folder_path, ts_files)

    print(f"Concatenated and removed {len(ts_files)} files .ts")
