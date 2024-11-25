import { initFirebase } from './firebase-init.js';
import { parseProperties, loadFile } from './file-handler.js';
import { renderTable } from './table-renderer.js';
import { setTheme } from './theme-manager.js';
import { shareProperties } from './sharing.js';

const firestore = await initFirebase();

const fileInput = document.getElementById('fileInput');
const propertiesTable = document.getElementById('propertiesTable');
const propertiesTableBody = propertiesTable.querySelector('tbody');
const saveButton = document.getElementById('saveButton');
const downloadButton = document.getElementById('downloadButton');
const shareButton = document.getElementById('shareButton');
const themeToggle = document.getElementById('themeToggle');
const state = { properties: {} };

fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => loadFile(reader.result, state, () => renderTable(state.properties, state, propertiesTableBody, saveButton, downloadButton, shareButton));
    reader.readAsText(file);
  }
});

themeToggle.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme, themeToggle);
});

shareButton.addEventListener('click', () => shareProperties(firestore, state));
