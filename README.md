# ACSC24

ACSC 2024 Challenges

## FastNote

### Description

I heard WebAssembly is super fast, so I made a note-taking app with it. What could go wrong?

### Solution

Use After Free (UAF) to overwrite the `toHTML` function pointer to the `populateNoteHTML` JavaScript function.

![](./1.png)