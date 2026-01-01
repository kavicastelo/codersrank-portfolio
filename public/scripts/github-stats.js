const username = "kavicastelo";

async function fetchGitHubStats() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error('GitHub API request failed');
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    return {
      repos: user.public_repos,
      followers: user.followers,
      stars,
      contributions: 3930, // Consider dynamic fetch if API allows (e.g., via GraphQL)
      streak: 850, // Consider dynamic calculation via contributions API
      years: new Date().getFullYear() - 2021
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return { repos: 0, followers: 0, stars: 0, contributions: 0, streak: 0, years: 0 }; // Fallback
  }
}

function animateValue(el, end) {
  let start = 0;
  const duration = 1200;
  const step = Math.max(1, Math.floor(end / 60));
  const interval = setInterval(() => {
    start += step;
    if (start >= end) {
      el.textContent = end.toLocaleString() + '+';
      clearInterval(interval);
    } else {
      el.textContent = start.toLocaleString();
    }
  }, duration / 60);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchGitHubStats().then(stats => {
    document.querySelectorAll(".stat-number").forEach(el => {
      const key = el.dataset.key;
      animateValue(el, stats[key] || 0);
    });
  });
});
