export function parseProperties(propertiesText) {
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
  
  export function loadFile(content, state, updateUI) {
    content.split('\n').forEach(line => {
      const [key, ...value] = line.split('=');
      if (key && value.length) state.properties[key.trim()] = value.join('=').trim();
    });
    updateUI();
  }
  