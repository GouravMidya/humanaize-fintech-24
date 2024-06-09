import os
import shutil

def move_files(source_folder: str, destination_folder: str, file_extension: str):
    """
    Moves all files of a specified type from the source folder to the destination folder.

    Parameters:
    - source_folder (str): The path of the folder containing the files to move.
    - destination_folder (str): The path of the folder to move the files to.
    - file_extension (str): The file extension of the files to move (e.g., '.pdf').
    """
    # Ensure the source folder exists
    if not os.path.exists(source_folder):
        print(f"Source folder '{source_folder}' does not exist.")
        return

    # Ensure the destination folder exists, create it if it does not
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    # Iterate over all files in the source folder
    for filename in os.listdir(source_folder):
        # Check if the file has the specified extension
        if filename.endswith(file_extension):
            source_path = os.path.join(source_folder, filename)
            destination_path = os.path.join(destination_folder, filename)

            # Move the file
            shutil.move(source_path, destination_path)
    print(f"Files of type '{file_extension}' moved successfully from '{source_folder}' to '{destination_folder}'.")