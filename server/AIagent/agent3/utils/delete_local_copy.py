import os


def delete_local_copy(file_name):
    """
    Deletes a local copy of a file
    :param file_name: name of the file
    :return: None
    """
    try:
        os.remove(f"uploads/{file_name}")
    except OSError:
        pass
    except Exception as e:
        print("Error deleting local copy of file: " + str(e))
