$hours = [int](Get-Date).ToString('HH')

function setDarkMode() {
    Set-ItemProperty HKCU:/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize -Name AppsUseLightTheme -Value 0
    Set-ItemProperty HKCU:/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize -Name SystemUsesLightTheme -Value 0
}

function setLightMode() {
    Set-ItemProperty HKCU:/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize -Name AppsUseLightTheme -Value 1
    Set-ItemProperty HKCU:/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize -Name SystemUsesLightTheme -Value 1
}

Write-Output "It's $((Get-Date).ToShortTimeString())..."

if ($hours -lt 7 -Or $hours -ge 20) { 
    Write-Output "- Time for Dark Mode" 
    setDarkMode
}
else {
    Write-Output "- Let it shine!"
    setLightMode
}