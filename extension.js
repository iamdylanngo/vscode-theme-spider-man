const { workspace, commands, window } = require('vscode');

/**
 * Call this function when activated
 *
 * @param context
 * @returns
 */
function activate(context) {
    const packageName = 'spiderman';

    if (process.platform == 'linux') {

        const cp = require('child_process');

        // Checking the weather xprop has installed
        try {
            cp.spawnSync('which xprop').toString();
        } catch (error) {
            console.error(`Spiderman Error: Please install xprop package to use Spiderman.`);
            return;
        }

        // Retrieve the process name for the current VS Code instance (Solution for using forks of VS Code)
        const process_name = process.title.substring(process.title.lastIndexOf('/') + 1);

        // Retrieving the process ids of VS code
        const processIds = cp.execSync(`pgrep ${process_name}`).toString().split('\n');
        processIds.pop();

        // Retrieving all window ids
        const allWindowIdsOutput = cp.execSync(
            `xprop -root | grep '_NET_CLIENT_LIST(WINDOW)'`
        ).toString();

        const allWindowIds = allWindowIdsOutput.match(/0x[\da-f]+/ig);

        const codeWindowIds = [];

        for (const windowId of allWindowIds) {

            // Checking the weather the window has a associated process
            const hasProcessId = cp.execSync(`xprop -id ${windowId} _NET_WM_PID`).toString();

            if (!(hasProcessId.search('not found') + 1)) {
                // Extract process id from the result
                const winProcessId = hasProcessId.replace(/([a-zA-Z_\(\)\s\=])/g, '');
                if (processIds.includes(winProcessId)) {
                    codeWindowIds.push(windowId);
                }
            }
        }

        function setAlpha(alpha) {
            if (alpha < 1) {
                alpha = 1;
            } else if (alpha > 255) {
                alpha = 255;
            }

            for (const codeWindowId of codeWindowIds) {
                cp.exec(`xprop  -id ${codeWindowId} -f _NET_WM_WINDOW_OPACITY 32c -set _NET_WM_WINDOW_OPACITY $(printf 0x%x $((0xffffffff * ${alpha} / 255)))`, function (error, stdout, stderr) {
                    if (error) {
                        console.error(`Spiderman error: ${error}`);
                        return;
                    }

                    console.log(stdout.toString());
                    console.log(`Spiderman: set alpha ${alpha}`);
                    config().update('alpha', alpha, true);
                });
            }
        }
    }

    console.log('Congratulations, your extension "Spiderman" is now active!');

    const config = () => workspace.getConfiguration(packageName);


    context.subscriptions.push(commands.registerCommand('spiderman.increase', () => {
        const alpha = config().get('alpha') - config().get('step');
        setAlpha(alpha);
    }));

    context.subscriptions.push(commands.registerCommand('spiderman.decrease', () => {
        const alpha = config().get('alpha') + config().get('step');
        setAlpha(alpha);
    }));

    context.subscriptions.push(commands.registerCommand('spiderman.maximize', () => {
        setAlpha(1);
    }));

    context.subscriptions.push(commands.registerCommand('spiderman.minimize', () => {
        setAlpha(255);
    }));

    const alpha = config().get('alpha');
    setAlpha(alpha);
}

/**
 * Call this function when deactivated
 *
 */
function deactivate() {
}

module.exports = {
	activate,
	deactivate
}
