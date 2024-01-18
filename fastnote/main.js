const api = {};
const addNoteForm = document.getElementById('add-note');
const myNotesDiv = document.getElementById('notes');
const notes = [];

const renderNotes = () => {
  const html = notes.length > 0 ? notes.join('') : '<p>No notes yet</p>';
  myNotesDiv.innerHTML = html;
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

    switch (noteId) {
      case -1:
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Note was too long!",
        });
        return;
      case -2:
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Maximun number of notes reached!",
        });
        return;
      default:
        break;
    }

    const noteHTML = api.getNoteHTML(noteId);
    notes.push(noteHTML);
    renderNotes();
    addNoteForm.reset();
  })
}

Module.onRuntimeInitialized = async (_) => {
  api.addNote = Module.cwrap('addNote', 'number', ['string', 'string']);
  api.getNoteHTML = Module.cwrap('getNoteHTML', 'string', ['number']);

  main();
};