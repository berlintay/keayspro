// terminal-commands.js

// Handle trending GitHub repositories
function handleTrending(term) {
    $.ajax({
        url: 'https://api.github.com/search/repositories?q=created:>2023-08-01&sort=stars&order=desc',
        dataType: 'json',
        success: function(response) {
            displayGitHubTrending(response, term);
        },
        error: function() {
            handleError('Error fetching GitHub trending repositories.', term);
        }
    });
}

function displayGitHubTrending(response, term) {
    var repos = response.items;
    var output = '';
    repos.forEach(function(repo, index) {
        output += `${index + 1}. [${repo.stargazers_count}] ${repo.full_name} - ${repo.description}
`;
    });
    term.echo(output);
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
            displayRedditFeed(response, feed, term);
        },
        error: function() {
            handleError('Error fetching Reddit RSS feed.', term);
        }
    });
}

function displayRedditFeed(response, feed, term) {
    var items = $(response).find('item').slice(0, 10);
    var output = `Top 10 posts from r/${feed}:

`;
    items.each(function(index, item) {
        var title = $(item).find('title').text();
        var link = $(item).find('link').text();
        output += `${index + 1}. ${title}
${link}

`;
    });
    term.echo(output);
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
            displayGoogleResults(response, term);
        },
        error: function() {
            handleError('Error fetching Google search results.', term);
        }
    });
}

function displayGoogleResults(response, term) {
    if (response.items && response.items.length > 0) {
        var output = `Top 10 Google search results:

`;
        response.items.slice(0, 10).forEach(function(item, index) {
            output += `${index + 1}. ${item.title}
${item.link}

`;
        });
        term.echo(output);
    } else {
        handleError('No results found. Try refining your query.', term);
    }
}

// Handle README display from GitHub
function handleReadme(term) {
    $.ajax({
        url: 'https://raw.githubusercontent.com/berlintay/KeaysXYZ/main/README.md',
        success: function(markdown) {
            term.echo(markdown);
        },
        error: function() {
            handleError('Error fetching README file.', term);
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

            case 'help':
                term.echo('Available commands:
 - trending
 - reddit <feedname>
 - google <query>
 - readme
 - ascii <text>
 - color <color>
 - help
 - clear');
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

