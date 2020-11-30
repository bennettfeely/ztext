let right_now = new Date();
let times = [
	["second", 1],
	["minute", 60],
	["hour", 3600],
	["day", 86400],
	["week", 604800],
	["month", 2592000],
	["year", 31536000],
];

function formatTime(date) {
	var date = new Date(date);

	var diff = Math.round((right_now - date) / 1000);
	for (var t = 0; t < times.length; t++) {
		if (diff < times[t][1]) {
			if (t == 0) {
				return "Just now";
			} else {
				diff = Math.round(diff / times[t - 1][1]);
				return diff + " " + times[t - 1][0] + (diff == 1 ? " ago" : "s ago");
			}
		}
	}
}

function makeCard(repo) {
	let xhr = new XMLHttpRequest();
	let url = "https://api.github.com/repos/" + repo;

	xhr.open("GET", url, true);
	xhr.onload = function () {
		let respo = JSON.parse(this.response);

		let card = `<div class="repo-box">
	<div class="repo-title">
		<a class="repo-author" href="${respo.owner.html_url}">${
			respo.owner.login
		}</a> / <a class="repo-name" href="${respo.html_url}">${respo.name}</a>
	</div>
	<a href="${respo.html_url}" class="repo-meta">
		<span class="repo-stars">${respo.stargazers_count} stars</span>
		<span class="repo-license">MIT</span>
		<span class="repo-updated">${formatTime(respo.pushed_at)}</span>
	</a>
</div>`;

		document.querySelector(`[data-repo="${repo}"]`).innerHTML = card;
	};

	xhr.send();
}

// Find each repo wrapper and fill it with an updated repo card
document.querySelectorAll("[data-repo]").forEach((elem) => {
	makeCard(elem.dataset.repo);
});
