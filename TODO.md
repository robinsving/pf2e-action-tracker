# TODOs for PF2E Action Tracker

## Fault tolerance
- Handle unexpected DOM structures in chat messages and ensure meaningful error messages are logged when parsing fails.
- Write unit tests for helper functions like `range` and `add`, and thoroughly test parsing methods (`parseActionMessage`, `parseActionCardMessage`, etc.) with various input cases.
- Handle certain actions (Saving Throws) differently
- Add tests for various message types from actual game

## Appearence
- Improve the appearance of the action tracker UI by enhancing alignment, spacing, and adding hover effects or tooltips for better usability.

## Improvements
- Handle Draw/Sheath Interact actions
- Add support for languages by integrating Foundry's localization system, allowing users to experience the tracker in their preferred language.
- Write detailed documentation for developers to extend or modify the tracker, as well as user-facing documentation to guide configuration and usage.
- Add a feature to filter or group actions by traits or types, making it easier for users to manage and view specific actions.
- Replace static "1" glyphs with dynamic icons or images that better represent the action type, improving the visual representation of actions.
- Visual representation of changed action count for character (slowed, hasted)

## Optimizations
- Optimize the rendering process to avoid unnecessary re-renders and improve performance by caching parsed actions.