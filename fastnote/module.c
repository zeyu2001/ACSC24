// emcc -s WASM=1 -s EXPORTED_RUNTIME_METHODS='["cwrap"]' module.c --no-entry -o module.js
#include <emscripten.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

typedef struct note {
  char *(*toHTML)(struct note *n);
  char *title;
  char *content;
} note;

note *notes[100];

char *toSafeHTML(struct note *n) {
  char safeHTML[1000];
  snprintf(safeHTML, 1000, "<article><h1>%s</h1><p>%s</p></article>", n->title, n->content);
  return safeHTML;
}

EMSCRIPTEN_KEEPALIVE
int addNote(char *title, char *content) {
  if (strlen (title) > 20 || strlen (content) > 100) {
    return -1;
  }

  struct note *n = malloc(sizeof(struct note));
  n->title = title;
  n->content = content;
  n->toHTML = toSafeHTML;
  
  for (int i = 0; i < 100; i++) {
    if (notes[i] == NULL) {
      notes[i] = n;
      return i;
    }
  }

  return -2;
}

EMSCRIPTEN_KEEPALIVE
char *getNoteHTML(int idx) {
  return notes[idx]->toHTML(notes[idx]);
}