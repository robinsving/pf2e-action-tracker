# TODOs for PF2E Action Tracker

## Fault tolerance
- Handle unexpected DOM structures in chat messages and ensure meaningful error messages are logged when parsing fails.

## Improvements
- Add support for languages by integrating Foundry's localization system, allowing users to experience the tracker in their preferred language.
- Handle updateChatMessage (by overriding existing message id)
- Handle Variant messages (spells like Heal)

## Optimizations
- Optimize the rendering process to avoid unnecessary re-renders and improve performance by caching parsed actions.