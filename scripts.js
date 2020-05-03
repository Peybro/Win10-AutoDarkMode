const command = 'Set-ItemProperty';
const regPath = 'HKCU:/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize';
exports.scripts = {
    apps: {
        light: `${command} -Path ${regPath} -Name AppsUseLightTheme -Value 1`,
        dark: `${command} -Path ${regPath} -Name AppsUseLightTheme -Value 0`
    },
    system: {
        light: `${command} -Path ${regPath} -Name SystemUsesLightTheme -Value 1`,
        dark: `${command} -Path ${regPath} -Name SystemUsesLightTheme -Value 0`
    }
};
