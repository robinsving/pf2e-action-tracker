# TODOs for PF2E Action Tracker

## Fault tolerance
- Handle unexpected DOM structures in chat messages and ensure meaningful error messages are logged when parsing fails.
- Write unit tests for helper functions like `range` and `add`, and thoroughly test parsing methods (`parseActionMessage`, `parseActionCardMessage`, etc.) with various input cases.
- Handle certain actions (Saving Throws) differently
- Add tests for various message types from actual game

## Improvements
- Add support for languages by integrating Foundry's localization system, allowing users to experience the tracker in their preferred language.
- Handle updateChatMessage (by overriding existing message id)

## Optimizations
- Optimize the rendering process to avoid unnecessary re-renders and improve performance by caching parsed actions.