// terminal-commands.js

// Define available themes including new ones
const themes = [
    'default-theme',
    'light-theme',
    'dark-theme',
    'neon-theme',
    'kanagawa-theme',
    'atom-dark-theme',
    'gruvbox-dark-theme',
    'solarized-light-theme',
    'dracula-theme',
    'monokai-theme',
    'nord-theme',
    'material-theme',
    'animated-background'
];

// Function to switch theme randomly
function switchThemeRandomly(term) {
    const currentTheme = $('body').attr('class');
    let newTheme;
    do {
        newTheme = themes[Math.floor(Math.random() * themes.length)];
    } while (newTheme === currentTheme);

    $('body').removeClass().addClass(newTheme);
    $('#terminal').removeClass().addClass(newTheme);
    term.echo(`Switched to ${newTheme.replace('-theme', '').replace('-', ' ')} theme!`);
}

// Handle theme switch
function handleThemeSwitch(term) {
    switchThemeRandomly(term);
}

// Initialize terminal with commands
$(document).ready(function() {
    $('#terminal').terminal(function(command, term) {
        var parts = command.split(' ');
        var baseCommand = parts[0].toLowerCase();

        switch (baseCommand) {
            case 'trending':
                handleTrending(term);
                break;

            case 'reddit':
                handleReddit(parts[1], term);
                break;

            case 'google':
                handleGoogleSearch(parts.slice(1).join(' '), term);
                break;

            case 'readme':
                handleReadme(term);
                break;

            case 'ascii':
                figlet(parts.slice(1).join(' '), function(err, data) {
                    if (err) {
                        handleError('Something went wrong with the ASCII art...', term);
                        return;
                    }
                    term.echo(data);
                });
                break;

            case 'color':
                var color = parts[1];
                if (color) {
                    $('body').css('background-color', color);
                    term.echo(`Background color changed to ${color}`);
                } else {
                    term.error('Usage: color <color>');
                }
                break;

            case 'theme':
                handleThemeSwitch(term);
                break;

            case 'help':
                term.echo('Available commands:\n - trending\n - reddit <feedname>\n - google <query>\n - readme\n - ascii <text>\n - color <color>\n - theme\n - help\n - clear');
                break;

            case 'clear':
                term.clear();
                break;

            default:
                handleError(`Unknown command: ${baseCommand}. Type 'help' for a list of available commands.`, term);
                break;
        }
    }, {
        greetings: 'Hola amigo, this is my terminal o.O',
        prompt: '$ '
    });
});
