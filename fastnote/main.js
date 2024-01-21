const api = {};
const addNoteForm = document.getElementById('add-note');
const myNotesDiv = document.getElementById('notes');
const shareUrl = document.getElementById('share-url');

const saved = [];
const notes = [];

const notesToHTML = (notes) => {
  return notes.map((note, idx) => `
    <div data-note-id="${idx}">
      ${note}
      <button class="contrast outline" onclick="api.deleteNote(${idx}, api.deleteNoteCallback)">Delete</button>
    </div>
  `).join('');
}

const addNote = (title, content) => {

  saved.push({
    'action': 'add',
    'title': title,
    'content': content
  })
  shareUrl.href = `${window.location.origin}?s=${btoa(JSON.stringify(saved))}`;

  const noteId = api.addNote(
    title,
    content
  );

  if (noteId < 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Note was too long!",
    });
    return;
  }

  api.populateNoteHTML(api.populateNoteHTMLCallback);
  renderNotes();
}

const renderNotes = () => {
  const html = notes.length > 0 ? notesToHTML(notes) : '<p>No notes yet</p>';
  myNotesDiv.innerHTML = html;
}

const populateNoteHTML = (noteHTML, idx) => {
  notes[idx] = UTF8ToString(noteHTML);
}

const deleteNote = (noteId) => {
  saved.push({
    'action': 'delete',
    'noteId': noteId
  })
  shareUrl.href = `${window.location.origin}?s=${btoa(JSON.stringify(saved))}`;

  notes.splice(noteId, 1);
  renderNotes();
}

const main = () => {
  addNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    addNote(title, content)
    addNoteForm.reset();
  })

  serialized = new URLSearchParams(window.location.search).get('s');
  if (serialized) {
    todo = JSON.parse(atob(serialized));

    todo.forEach((action) => {
      if (action.action == 'add') {
        addNote(
          action.title,
          action.content
        );
      } else if (action.action == 'delete') {
        api.deleteNote(
          action.noteId,
          api.deleteNoteCallback
        );
      }
    });
  }
}

Module.onRuntimeInitialized = async (_) => {

  api.populateNoteHTMLCallback = Module.addFunction(populateNoteHTML,'iii');
  api.deleteNoteCallback = Module.addFunction(deleteNote,'vi');

  api.addNote = Module.cwrap('addNote', 'number', ['string', 'string']);
  api.deleteNote = Module.cwrap('deleteNote', 'number', ['number', 'number']);
  api.populateNoteHTML = Module.cwrap('populateNoteHTML', null, ['number']);

  main();
};