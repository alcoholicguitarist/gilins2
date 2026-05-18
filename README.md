# Beginner Platformer Prototype

This is a tiny browser-based 2D side-scrolling platformer made with only:

- `index.html`
- `style.css`
- `game.js`

There is no npm setup, no React, no Phaser, no Unity, no Godot, and no external library. The goal is to keep the project easy to open, read, and change.

## How to run

1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html` to open it in your browser.

That is enough for this prototype. If your browser blocks local files for any reason, you can also run a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open this address in your browser:

```text
http://localhost:8000
```

## Controls

### Keyboard

- Move left: `A` or `Left Arrow`
- Move right: `D` or `Right Arrow`
- Jump: `W`, `Up Arrow`, or `Space`
- Attack: `J` or `X`

### Mobile / touch screen

Use the on-screen buttons below the game:

- Left
- Right
- Jump
- Attack

## What is included

- A player that can move left and right.
- Jumping with gravity.
- Platform collision.
- A camera that follows the player horizontally.
- Coins to collect.
- Spikes that hurt the player.
- Simple walking enemies.
- A goal flag at the end of the level.
- Mobile touch buttons.

## Beginner-friendly editing tips

Most things you may want to change are near the top of `game.js`:

- Change `player.speed` to make the player faster or slower.
- Change `player.jumpPower` to make jumps higher or lower.
- Add more platforms to the `platforms` array.
- Add more coins to the `coins` array.
- Add more spikes to the `spikes` array.
- Add more enemies to the `enemies` array.
- Move the goal by changing the `goal` object.

Each platform, coin, spike, enemy, and goal uses simple `x` and `y` positions. Bigger `x` values are farther to the right in the level.

## Project structure

```text
.
├── index.html   # Page structure and game canvas
├── style.css    # Page layout and mobile button styles
├── game.js      # Game logic, drawing, controls, and collision
└── README.md    # How to run and modify the prototype
```

## Android WebView later

Because the game is plain HTML, CSS, and JavaScript, it can later be wrapped in an Android WebView app. For now, keep testing it in the browser first.
