const api = {};
const addNoteForm = document.getElementById('add-note');
const myNotesDiv = document.getElementById('notes');

let notes = [];

const renderNotes = () => {
  const html = notes.length > 0 ? notes.join('') : '<p>No notes yet</p>';
  myNotesDiv.innerHTML = html;
}

const populateNoteHTML = (noteHTML, idx) => {
  notes[idx] = UTF8ToString(noteHTML);
}

const deleteNote = (noteId) => {
  notes.splice(noteId, 1);
}

const main = () => {
  addNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
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
    }

    notes = [];
    api.populateNoteHTML(api.populateNoteHTMLCallback);
    renderNotes();

    addNoteForm.reset();
  })
}

Module.onRuntimeInitialized = async (_) => {

  api.populateNoteHTMLCallback = Module.addFunction(populateNoteHTML,'iii');
  api.deleteNoteCallback = Module.addFunction(deleteNote,'vi');

  api.addNote = Module.cwrap('addNote', 'number', ['string', 'string']);
  api.deleteNote = Module.cwrap('deleteNote', 'number', ['number', 'number']);
  api.populateNoteHTML = Module.cwrap('populateNoteHTML', null, ['number']);

  main();
};