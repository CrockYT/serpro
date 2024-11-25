import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
    import { getDocs, getFirestore, collection, addDoc, getDoc, doc, query as firestoreQuery, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

    async function getFirebaseConfig() {
      const response = await fetch('https://ser.cromichan-net.workers.dev/', {
        method: 'GET'
      });
      const config = await response.json();
      return config;
    }

    async function initFirebase() {
      const config = await getFirebaseConfig();
      const app = initializeApp(config);
      const firestore = getFirestore(app);
      return firestore;
    }

    const firestore = await initFirebase();

    const fileInput = document.getElementById('fileInput');
    const propertiesTable = document.getElementById('propertiesTable');
    const propertiesTableBody = propertiesTable.querySelector('tbody');
    const saveButton = document.getElementById('saveButton');
    const downloadButton = document.getElementById('downloadButton');
    const shareButton = document.getElementById('shareButton');
    const loadPresetButton = document.getElementById('loadPresetButton');
    const themeToggle = document.getElementById('themeToggle');
    const dropArea = document.getElementById('dropArea');
    const dropText = document.getElementById('dropText');
    const state = { properties: {} };

    fileInput.addEventListener('change', handleFileSelect);

    async function handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file || file.type !== 'text/plain') return;

      const reader = new FileReader();
      reader.onload = async function () {
        const properties = parseProperties(reader.result);
        await renderTable(properties);
      };

      reader.readAsText(file);
    }

    function parseProperties(propertiesText) {
      const properties = {};
      const lines = propertiesText.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*(\S+)\s*=\s*(.*)\s*$/);
        if (match) {
          properties[match[1]] = match[2];
        }
      }
      return properties;
    }

    async function renderTable(properties) {
      state.properties = properties;
      propertiesTableBody.innerHTML = '';

      for (const key in properties) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${key}</strong></td>
          <td><input type="text" value="${properties[key]}" data-key="${key}"></td>
        `;
        propertiesTableBody.appendChild(row);
      }

      propertiesTable.classList.add('visible');
      saveButton.disabled = false;
      downloadButton.disabled = false;
      shareButton.disabled = false;
    }

    loadPresetButton.addEventListener('click', async () => {
      try {
        const docRef = await getDoc(doc(collection(db, 'properties'), 'sampleDocId'));
        if (docRef.exists()) {
          renderTable(docRef.data().properties);
        } else {
          alert('プリセットが見つかりませんでした');
        }
      } catch (error) {
        console.error('Firestore読み込みエラー:', error);
      }
    });

    dropArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropArea.classList.add('dropping');
      dropText.textContent = 'ここにファイルをドロップしてください';
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('dropping');
      dropText.textContent = 'ファイルを読み込む';
    });

    dropArea.addEventListener('drop', (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.name.endsWith('.properties')) {
        const reader = new FileReader();
        reader.onload = () => loadFile(reader.result);
        reader.readAsText(file);
      } else {
        alert('「.properties」ファイルをドロップしてください');
      }

      dropArea.classList.remove('dropping');
      dropText.textContent = 'ファイルを読み込む';
    });

    const addRow = (key, value) => {
      const row = document.createElement('tr');
      const keyCell = document.createElement('td');
      const valueCell = document.createElement('td');

      keyCell.textContent = key;

      if (key.toLowerCase() === 'motd') {
        const inputField = document.createElement('input');
        inputField.value = value;
        inputField.addEventListener('input', () => {
          state.properties[key] = inputField.value;
        });
        valueCell.appendChild(inputField);
      } else if (value === 'true' || value === 'false') {
        const select = document.createElement('select');
        select.innerHTML = ` 
          <option value="true" ${value === 'true' ? 'selected' : ''}>True</option>
          <option value="false" ${value === 'false' ? 'selected' : ''}>False</option>
        `;
        select.addEventListener('change', () => {
          state.properties[key] = select.value;
        });
        valueCell.appendChild(select);
      } else {
        const inputField = document.createElement('input');
        inputField.value = value;
        inputField.addEventListener('input', () => {
          state.properties[key] = inputField.value;
        });
        valueCell.appendChild(inputField);
      }

      row.appendChild(keyCell);
      row.appendChild(valueCell);
      propertiesTableBody.appendChild(row);
    };

    const updateUI = () => {
      propertiesTableBody.innerHTML = '';
      Object.entries(state.properties).forEach(([key, value]) => addRow(key, value));
      propertiesTable.classList.add('visible');
      saveButton.disabled = false;
      downloadButton.disabled = false;
      shareButton.disabled = false;
    };

    const loadFile = content => {
      content.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length) state.properties[key.trim()] = value.join('=').trim();
      });
      updateUI();
    };

    fileInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => loadFile(reader.result);
        reader.readAsText(file);
      }
    });

    saveButton.addEventListener('click', () => {
      const name = prompt('プリセット名を入力してください:');
      if (!name) return;
      const presets = JSON.parse(localStorage.getItem('presets') || '{}');
      presets[name] = state.properties;
      localStorage.setItem('presets', JSON.stringify(presets));
      alert(`プリセット「${name}」を保存しました！`);
    });

    loadPresetButton.addEventListener('click', () => {
      const presets = JSON.parse(localStorage.getItem('presets') || '{}');
      const name = prompt(`プリセット名を選択してください:\n${Object.keys(presets).join('\n')}`);
      if (presets[name]) {
        state.properties = presets[name];
        updateUI();
      } else alert('指定されたプリセットは存在しません。');
    });

    downloadButton.addEventListener('click', () => {
      const blob = new Blob([Object.entries(state.properties).map(([k, v]) => `${k}=${v}`).join('\n')], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'server.properties';
      link.click();
    });

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);

      if (theme === 'dark') {
        document.documentElement.style.backgroundColor = "#2e2e2e";
      } else {
        document.documentElement.style.backgroundColor = "#f9f9f9";
      }

      localStorage.setItem('theme', theme);

      themeToggle.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    }

    let currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      currentTheme = newTheme;

      setTheme(newTheme);

      document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    });

    shareButton.addEventListener('click', async () => {
      const shortKey = generateShortKey();
      const docRef = await addDoc(collection(firestore, 'links'), {
        key: shortKey,
        properties: state.properties
      });
      const shortUrl = `${location.origin}${location.pathname}?share=${shortKey}`;
      navigator.clipboard.writeText(shortUrl).then(() => alert('短縮された共有リンクをコピーしました！'));
    });

    function generateShortKey() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let shortKey = '';
      for (let i = 0; i < 6; i++) {
        shortKey += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return shortKey;
    }

    const query = new URLSearchParams(location.search);
      if (query.has('share')) {
        const shortKey = query.get('share');
        const q = firestoreQuery(collection(firestore, 'links'), where('key', '==', shortKey));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          state.properties = doc.data().properties;
          updateUI();
        } else {
          alert('指定されたリンクは無効です');
        }
      }