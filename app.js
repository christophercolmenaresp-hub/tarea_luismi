// DevPulse App Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('DevPulse initialized 🚀');

    const postsContainer = document.getElementById('posts-container');
    const navItems = document.querySelectorAll('.nav-item');

    // Sample Data
    const posts = [
        {
            id: 1,
            author: 'Juan Reis',
            handle: '@jreis',
            time: '2h',
            content: 'Acabo de terminar la lógica de los hilos de respuesta para DevPulse. ¡La interacción va a ser súper fluida! 🚀 #DevPulse #WebDev',
            type: 'social',
            stats: { comments: 12, shares: 5, likes: 42 }
        },
        {
            id: 2,
            author: 'Christopher',
            handle: '@chris_master',
            time: '4h',
            content: '¿Cómo optimizar el renderizado de listas en Vanilla JS? He encontrado que usando un fragmento de documento (DocumentFragment) antes de añadir al DOM mejora el rendimiento un 40%.',
            type: 'qa',
            title: '¿Cómo optimizar el renderizado de listas en Vanilla JS?',
            status: 'Pregunta Resuelta',
            stats: { comments: 28, likes: 156, saves: 4 }
        }
    ];

    // Render Posts
    function renderPosts(filter = 'all') {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'post';

            let postBody = '';
            if (post.type === 'qa') {
                postBody = `
                    <div class="solve-badge">✓ ${post.status}</div>
                    <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${post.title}</h3>
                    <p>${post.content}</p>
                `;
            } else {
                postBody = `<div class="post-content">${post.content}</div>`;
            }

            article.innerHTML = `
                <div class="post-header">
                    <div class="avatar"></div>
                    <div>
                        <span class="post-author">${post.author}</span>
                        <span class="post-handle">${post.handle} · ${post.time}</span>
                    </div>
                </div>
                ${postBody}
                <div class="post-actions">
                    <span>💬 ${post.stats.comments}</span>
                    <span>${post.type === 'qa' ? '❤️' : '🔁'} ${post.type === 'qa' ? post.stats.likes : post.stats.shares}</span>
                    <span>${post.type === 'qa' ? '📚' : '❤️'} ${post.type === 'qa' ? post.stats.saves : post.stats.likes}</span>
                </div>
            `;
            postsContainer.appendChild(article);
        });
    }

    // Navigation logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.getAttribute('href') !== '#') return;
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active active-glow');

            // Simulation of filtering
            const community = item.innerText.toLowerCase().trim();
            console.log(`Filtrando por: ${community}`);
        });
    });

    // Initial render
    renderPosts();

    // Pulse effect on active items
    const style = document.createElement('style');
    style.innerHTML = `
        .active-glow {
            box-shadow: 0 0 15px var(--color-primary-glow);
            transition: box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
