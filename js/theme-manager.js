export function setTheme(theme, themeToggle) {
    document.documentElement.setAttribute('data-theme', theme);
  
    if (theme === 'dark') {
      document.documentElement.style.backgroundColor = "#2e2e2e";
    } else {
      document.documentElement.style.backgroundColor = "#f9f9f9";
    }
  
    localStorage.setItem('theme', theme);
  
    themeToggle.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
  }
  