import pyautogui
import time

def removeWatchLaterVideos(numberWatchLater):
    """
    Remove all videos from the 'Watch Later' playlist on YouTube.

    To find the number of videos in your 'Watch Later' playlist, go to the watch later section in YouTube, 
    where it will be displayed next to the 'Play All' and 'Shuffle' buttons.

    You can customize the positions for the moveTo() function based on your screen size. 
    Use pyautogui.position() to grab the position of your mouse, for example:
        print(pyautogui.position())

    Parameters:
        videos (integer): Contains the number of your watch later videos

    Returns:
        None
    """

    # Give you time to move mouse in start position
    time.sleep(2)

    for _ in range(numberWatchLater):
        # Move to the hamburger menu for the top video in watch later
        pyautogui.moveTo(2480, 358, duration=0)
        pyautogui.click()

        time.sleep(1)

        # Move to the "Remove From Watch Later" button for the top video
        pyautogui.moveTo(2343, 502, duration=0)
        pyautogui.click()

        time.sleep(1)


if __name__ == "__main__":
    numberWatchLater = 4617
    removeWatchLaterVideos(numberWatchLater)