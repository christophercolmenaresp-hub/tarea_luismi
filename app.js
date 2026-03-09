    const postTextArea = document.querySelector('textarea');
    const publishBtn = document.querySelector('button[style*="var(--color-primary)"]');

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
        },
        {
            id: 3,
            author: 'Iván Rodriguez',
            handle: '@ivan_ui',
            time: '6h',
            content: 'Integrando el sistema de diseño glassmorphism en el feed principal. El desenfoque de fondo dinámico le da un toque premium brutal. ✨',
            type: 'social',
            stats: { comments: 8, shares: 2, likes: 31 }
        }
    ];

    // Render Posts
    function renderPosts() {
        postsContainer.innerHTML = '';
        posts.sort((a,b) => b.id - a.id).forEach(post => {
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
                    <span class="action-btn" onclick="this.style.color='var(--color-primary)'">💬 ${post.stats.comments}</span>
                    <span class="action-btn" onclick="this.style.color='var(--color-secondary)'">🔁 ${post.stats.shares || 0}</span>
                    <span class="action-btn" onclick="this.classList.toggle('liked')">❤️ ${post.stats.likes}</span>
                </div>
            `;
            postsContainer.appendChild(article);
        });
    }

    // Publish logic
    if (publishBtn) {
        publishBtn.onclick = () => {
            const content = postTextArea.value.trim();
            if (!content) return;

            const newPost = {
                id: Date.now(),
                author: 'Invitado',
                handle: '@invitado',
                time: 'ahora',
                content: content,
                type: 'social',
                stats: { comments: 0, shares: 0, likes: 0 }
            };

            posts.push(newPost);
            postTextArea.value = '';
            renderPosts();
            
            // Subtle animation feedback
            publishBtn.style.transform = 'scale(0.9)';
            setTimeout(() => publishBtn.style.transform = 'scale(1)', 100);
        };
    }

    // Navigation logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href !== '#') return;
            
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active', 'active-glow'));
            item.classList.add('active', 'active-glow');
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
        .action-btn { cursor: pointer; transition: 0.2s; padding: 4px 8px; border-radius: 4px; }
        .action-btn:hover { background: rgba(255,255,255,0.05); }
        .liked { color: #f91880 !important; font-weight: bold; text-shadow: 0 0 10px rgba(249, 24, 128, 0.3); }
    `;
    document.head.appendChild(style);
});
