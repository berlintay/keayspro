// terminal-commands.js

// Handle trending GitHub repositories
function handleTrending(term) {
    $.ajax({
        url: 'https://api.github.com/search/repositories?q=created:>2023-08-01&sort=stars&order=desc',
        dataType: 'json',
        success: function(response) {
            var repos = response.items;
            var output = '';
            repos.forEach(function(repo, index) {
                output += `${index + 1}. [${repo.stargazers_count}] ${repo.full_name} - ${repo.description}\n`;
            });
            term.echo(output);
        },
        error: function() {
            term.echo('Error fetching GitHub trending repositories.');
        }
    });
}

// Handle Reddit RSS feed
function handleReddit(feed, term) {
    if (!feed) {
        term.error('Usage: reddit <feedname>');
        return;
    }

    var feedUrl = `https://reddit.com/r/${feed}.rss`;
    $.ajax({
        url: feedUrl,
        dataType: 'xml',
        success: function(response) {
            var items = $(response).find('item').slice(0, 10);
            var output = `Top 10 posts from r/${feed}:\n\n`;
            items.each(function(index, item) {
                var title = $(item).find('title').text();
                var link = $(item).find('link').text();
                output += `${index + 1}. ${title}\n${link}\n\n`;
            });
            term.echo(output);
        },
        error: function() {
            term.error('Error fetching Reddit RSS feed.');
        }
    });
}

// Handle Google search
function handleGoogleSearch(query, term) {
    if (!query) {
        term.error('Usage: google <query>');
        return;
    }

    term.echo('Searching... Please wait.');

    $.ajax({
        url: `https://www.googleapis.com/customsearch/v1?key=API_KEY&cx=SEARCH_ENGINE_ID&q=${encodeURIComponent(query)}`,
        dataType: 'json',
        success: function(response) {
            if (response.items && response.items.length > 0) {
                var output = `Top 10 Google search results:\n\n`;
                response.items.slice(0, 10).forEach(function(item, index) {
                    output += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                });
                term.echo(output);
            } else {
                term.error('No results found. Try refining your query.');
            }
        },
        error: function() {
            term.error('Error fetching Google search results.');
        }
    });
}

// Handle README display from GitHub
function handleReadme(term) {
    $.ajax({
        url: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/README.md',
        success: function(markdown) {
            term.echo(markdown);
        },
        error: function() {
            term.error('Error fetching README file.');
        }
    });
}

// Handle theme switch
function handleThemeSwitch(term) {
    switchThemeRandomly(term);
}

// Centralized error handling
function handleError(message, term) {
    term.error(message);
}

// Function to switch theme randomly
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
