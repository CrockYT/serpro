document.addEventListener('DOMContentLoaded', () => {
    const updateInfo = document.getElementById('updateInfo');
    const closeUpdateInfo = document.getElementById('closeUpdateInfo');

    function showUpdateInfo() {
        updateInfo.classList.add('show');

        // 軽く揺れるアニメーションを追加
        setTimeout(() => {
            updateInfo.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                updateInfo.style.animation = '';
            }, 300);
        }, 800);

        setTimeout(() => {
            hideUpdateInfo();
        }, 10000);
    }

    function hideUpdateInfo() {
        updateInfo.classList.remove('show');
    }

    closeUpdateInfo.addEventListener('click', hideUpdateInfo);

    showUpdateInfo();
});
