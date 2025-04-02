$collabPath = "D:\SQL 2nd Year\Cloud_Native\M206Project\ProjectManagerJs\backend\Collaboration-Service"
$authPath = "D:\SQL 2nd Year\Cloud_Native\M206Project\ProjectManagerJs\backend\Auth-Service"
$chatPath = "D:\SQL 2nd Year\Cloud_Native\M206Project\ProjectManagerJs\backend\Collaboration-Service\chat-frontend"

$collabProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm start" -WorkingDirectory $collabPath -PassThru
Start-Sleep -Seconds 2

$authProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c node index" -WorkingDirectory $authPath -PassThru
Start-Sleep -Seconds 2

$chatProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $chatPath -PassThru

$windowWidth = 500
$windowHeight = 500

function Set-WindowSizeAndPosition {
    param (
        [Parameter(Mandatory=$true)]
        [System.Diagnostics.Process]$process,
        [int]$xPosition,
        [int]$yPosition,
        [int]$width,
        [int]$height
    )

    Start-Sleep -Seconds 1
    $hwnd = $process.MainWindowHandle

    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class WindowManipulation {
        [DllImport("user32.dll")]
        public static extern bool MoveWindow(IntPtr hWnd, int x, int y, int width, int height, bool repaint);
    }
"@

    if ($hwnd -ne 0) {
        [WindowManipulation]::MoveWindow($hwnd, $xPosition, $yPosition, $width, $height, $true)
    }
}

Set-WindowSizeAndPosition -process $collabProcess -xPosition 0 -yPosition 0 -width $windowWidth -height $windowHeight
Set-WindowSizeAndPosition -process $authProcess -xPosition $windowWidth -yPosition 0 -width $windowWidth -height $windowHeight
Set-WindowSizeAndPosition -process $chatProcess -xPosition ($windowWidth * 2) -yPosition 0 -width $windowWidth -height $windowHeight