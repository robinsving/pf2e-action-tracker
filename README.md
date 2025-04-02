# pf2e-action-tracker

A Foundry VTT module for tracking in-combat action counts for Pathfinder 2e. The module listens to chat messages from the currently active combatant and tracks the number of actions taken. It is designed for use with playable characters only.

## Installation

Add the following URL to Foundry VTT's module installation screen:

```
https://raw.githubusercontent.com/robinsving/pf2e-action-tracker/main/module.json
```

## Usage

1. Open your game in Foundry VTT.
2. Start an encounter with character actors in the combat tracker.
3. Send chat messages with action costs (e.g., action cards or abilities), and the tracker will automatically update.
4. Check Action Tracker to view the tracked actions for the current combatant.

## Features

- **Automatic Action Tracking**: Tracks actions based on chat messages sent by the active combatant.
- **Remove Actions**: Allows users to manually remove tracked actions via the UI.
- **Dynamic Parsing**: Supports parsing of a limited set of chat message formats, including Actions, Activities, Spells.

## Planned Features

- Localization support.
- Filtering and grouping actions by traits or types.

## Compatibility

This module is designed for use with the Pathfinder2e system in Foundry VTT. It is not compatible with other game systems.

## License

This module is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

This module was created by Robin Sving. If you have any questions or issues, please reach out to me on GitHub.
