$(document).ready(function() {
    const themes = [
        {bg: '#1F1F28', fg: '#DCD7BA'},
        {bg: '#282828', fg: '#EBDBB2'},
        {bg: '#2E3440', fg: '#D8DEE9'},
        {bg: '#0F0F0F', fg: '#CCCCCC'}
    ];

    function setRandomTheme() {
        const theme = themes[Math.floor(Math.random() * themes.length)];
        $('body').css('background-color', theme.bg);
        $('body').css('color', theme.fg);
    }

    $('#term').terminal(function(command, term) {
        if (command === 'trending') {
            $.ajax({
                url: 'https://api.github.com/search/repositories?q=created:>2023-08-01&sort=stars&order=desc',
                dataType: 'json',
                success: function(response) {
                    var repos = response.items;
                    var output = '';
                    repos.forEach(function(repo, index) {
                        output += `${index + 1}. [${repo.stargazers_count}] ${repo.full_name} - ${repo.description}\\n`;
                    });
                    term.echo(output);
                },
                error: function() {
                    term.echo('Error fetching GitHub trending repositories.');
                }
            });
        } else if (command === 'hello') {
            term.echo('Hello, World!');
        } else if (command === 'date') {
            var currentDate = new Date().toLocaleString();
            term.echo(`Current date and time: ${currentDate}`);
        } else if (command === 'help') {
            term.echo('Available commands: trending, hello, date, feed, readme, theme, help');
        } else if (command === 'feed') {
            $.ajax({
                url: 'https://www.reddit.com/r/javascript/.rss',
                dataType: 'xml',
                success: function(data) {
                    $(data).find('entry').slice(0, 10).each(function() {
                        var title = $(this).find('title').text();
                        term.echo(`- ${title}`);
                    });
                },
                error: function() {
                    term.echo('Error fetching RSS feed.');
                }
            });
        } else if (command === 'readme') {
            $.ajax({
                url: 'https://raw.githubusercontent.com/berlintay/berlintay/main/README.md',
                success: function(data) {
                    term.echo(data);
                },
                error: function() {
                    term.echo('Error fetching README.');
                }
            });
        } else if (command === 'theme') {
            setRandomTheme();
            term.echo('Theme changed!');
        } else {
            term.echo('Unknown command. Type "help" for a list of commands.');
        }
    }, {
        greetings: 'Hola amigo, this is my terminal o.O',
        prompt: '$ '
    });
});
