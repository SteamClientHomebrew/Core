## Introduction
This repository serves as a way to manage updates, plugins, and themes for Millennium. This plugin is automatically integrated into Millennium.

### Overview
- Manage Plugins in Steam Settings
- Manage updates for Plugins & Themes from Steam Settings
- Manage, and load custom user-made Themes

### Contributing
Clone this repository place it in your plugins folder and start Steam. You can now make changes to this library. Added changes to the `backend` should also take platform type into consideration as this library will eventually support Linux, OSX, and Windows >= 10

### Building 

```ps1
git clone https://github.com/SteamClientHomebrew/__builtins__.git --recursive
cd __builtins__
npm i
npm install @millennium/ui

npm run dev-build
```