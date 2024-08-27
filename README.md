# Azgaar's Fantasy Map Generator to Obsidian Markdown

Convert a .map file from [Azgaar's Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/) to an [Obsidian.md](https://obsidian.md) Vault based on [Josh Plunkett's Obsidian for TTRPGs](https://obsidianttrpgtutorials.com).

## Getting Started

1. [Install Node.js via NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
2. Clone this project: `git clone https://github.com/znewton/azgaarmfg-to-obsidianmd.git`
3. Install dependencies: `npm install`
4. Build the script: `npm run build`

## Usage

1. Generate a fantasy map using [Azgaar's Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/)
2. Export to `machine` (saves a .map file to your Downloads folder)
3. Run `npm run convert -- --map ~/path/to/fmg.map --out ~/path/to/obsidian-vault`
