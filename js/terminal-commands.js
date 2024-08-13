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

// Handle fetching random jokes
function handleJoke(term) {
    $.ajax({
        url: 'https://official-joke-api.appspot.com/random_joke',
        dataType: 'json',
        success: function(response) {
            term.echo(`${response.setup}\n${response.punchline}`);
        },
        error: function() {
            term.error('Error fetching a joke.');
        }
    });
}

// Handle fetching random cat facts
function handleCatFact(term) {
    $.ajax({
        url: 'https://catfact.ninja/fact',
        dataType: 'json',
        success: function(response) {
            term.echo(`Cat Fact: ${response.fact}`);
        },
        error: function() {
            term.error('Error fetching cat fact.');
        }
    });
}

// Centralized error handling
function handleError(message, term) {
    term.error(message);
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

            case 'joke':
                handleJoke(term);
                break;

            case 'catfact':
                handleCatFact(term);
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
                term.echo('Available commands:\n - trending\n - joke\n - catfact\n - readme\n - ascii <text>\n - color <color>\n - theme\n - help\n - clear');
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
