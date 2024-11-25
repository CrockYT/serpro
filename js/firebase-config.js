export async function getFirebaseConfig() {
    const response = await fetch('https://ser.cromichan-net.workers.dev/', { method: 'GET' });
    const config = await response.json();
    return config;
  }
  