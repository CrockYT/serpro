export function renderTable(properties, state, propertiesTableBody, saveButton, downloadButton, shareButton) {
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
  
    saveButton.disabled = false;
    downloadButton.disabled = false;
    shareButton.disabled = false;
  }
  