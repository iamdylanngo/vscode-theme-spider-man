#!/usr/bin/env bash

repo_dir="$( cd "$(dirname "${BASH_SOURCE[0]}")" && pwd )"

attach() {
    spiderman_path="$( find ~/.vscode/extensions -maxdepth 1 -type d -name 'spiderman*' )"
    if [[ "$spiderman_path" ]]; then
        spiderman_dir="$( basename "$spiderman_path" )"
        mkdir -p ~/.vscode/extensions/disabled
        mv "$spiderman_path" ~/.vscode/extensions/disabled/"$spiderman_dir"
    fi
    ln -s "$repo_dir" ~/.vscode/extensions/spiderman
}

eject() {
    rm -f ~/.vscode/extensions/spiderman
    if [ -d ~/.vscode/extensions/disabled ]; then
        disabled_path="$( find ~/.vscode/extensions/disabled -maxdepth 1 -type d -name 'spiderman*' )"
        spiderman_dir="$( basename "$disabled_path" )"
        mv "$disabled_path" ~/.vscode/extensions/"$spiderman_dir"
        rm -r ~/.vscode/extensions/disabled
    fi
}

case "$1" in
    attach)
        attach
        ;;
    eject)
        eject
        ;;
esac
