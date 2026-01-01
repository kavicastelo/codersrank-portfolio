// Fetch latest Medium posts using RSS → JSON service
async function loadMediumPosts() {
    const mediumUsername = "kavicastelo";
    const rss2json = "https://api.rss2json.com/v1/api.json";
    const mediumRss = `https://medium.com/feed/@${mediumUsername}`;

    try {
        const response = await fetch(`${rss2json}?rss_url=${encodeURIComponent(mediumRss)}`);
        const data = await response.json();

        if (data.status !== "ok") throw new Error("Failed to load feed");

        const container = document.getElementById("medium-posts");
        container.innerHTML = "";

        data.items.slice(0, 6).forEach(item => {
            const card = document.createElement("article");
            card.className = "blog-card";

            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
            const thumbnail = imgMatch ? imgMatch[1] : "i/default-blog-thumbnail.jpg";

            card.innerHTML = `
        ${imgMatch ? `<img src="${thumbnail}" alt="${item.title}" loading="lazy">` : ''}
        <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
        <p>${item.description.replace(/<[^>]*>/g, '').slice(0, 140) || item.content.replace(/<[^>]*>/g, '').slice(0, 140) + '...'}</p>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="read-more">Read more →</a>
      `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading Medium posts:", err);
        const container = document.getElementById("medium-posts");
        if (container) {
            container.innerHTML = `<p style="text-align:center; opacity:0.6;">Could not load articles right now. 
        <a href="https://medium.com/@${mediumUsername}" target="_blank" rel="noopener noreferrer">Visit Medium profile →</a></p>`;
        }
    }
}

// Logic for lazy loading and scroll animations using IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
    const mediumSection = document.getElementById("blog");
    if (mediumSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMediumPosts();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(mediumSection);
    }
});
