# app/utils/file_mover.py
import os
import shutil

def move_files(source_folder, destination_folder, extension, exclude_file=None):
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    
    files_moved = False
    for filename in os.listdir(source_folder):
        if filename.endswith(f'.{extension}') and filename != exclude_file:
            source_path = os.path.join(source_folder, filename)
            destination_path = os.path.join(destination_folder, filename)
            shutil.move(source_path, destination_path)
            files_moved = True
    if files_moved:
        print(f"Files moved to {destination_folder} excluding {exclude_file}")
    else:
        print(f"No files to move excluding {exclude_file}")
