The web version of *SquidGame in CovidLife*.

[Demo](https://iamwyh.cn/squidgame)


### Run the game

#### Run on a server

First, deployment: Upload the entire folder to your site. If you are using GitHub Pages, add the entire folder to the corresponding repository and commit. You only need to deploy it once.

Then, access the game with `<your-url>/<folder-name>`. For example, if your site's URL is `https://example.cc` and the game folder's name is "squidgame", then the link for the game is `https://example.cc/squidgame`.

#### Run locally

Due to Chrome's file protocol restriction, we cannot directly open `index.html`. Follow this guide to run the game on your machine.

First, make sure you have two things installed:

1. **node.js**: download from https://nodejs.org/en/

2. **anywhere**: after node.js is installed, open a terminal, type

   ```shell
   npm install -g anywhere
   ```

You only need to install these two things once.

Then, open a terminal at this folder, and type `anywhere`. A browser tab should pop up with the game.
