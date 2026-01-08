(function(){
    'use strict';

    // Determine current page key (e.g. 'art' from 'art.html' or 'scripts' from 'scripts.html')
    function pageKeyFromLocation() {
        var p = window.location.pathname.split('/').pop() || 'index.html';
        return p.replace(/\.html?$/i, '') || 'index';
    }

    function findReleasesForGroup(data, key) {
        if (!data) return [];
        // Case: object with groups map
        if (typeof data === 'object' && !Array.isArray(data)) {
            if (data.groups && data.groups[key]) return data.groups[key];
            if (data[key]) {
                // either an array or object with releases
                if (Array.isArray(data[key])) return data[key];
                if (Array.isArray(data[key].releases)) return data[key].releases;
            }
            // fallback: top-level releases array
            if (Array.isArray(data.releases)) return data.releases.filter(function(r){
                return (r.group && r.group === key) || (r.tags && r.tags.indexOf(key) !== -1);
            });
        }

        // Case: it's already an array of releases
        if (Array.isArray(data)) {
            return data.filter(function(r){
                return (r.group && r.group === key) || (r.tags && r.tags.indexOf(key) !== -1) || (r.dir && r.dir.indexOf(key) !== -1) || (!r.group && !r.tags);
            });
        }

        return [];
    }

    function createReleaseNode(release) {
        var wrap = document.createElement('div');
        wrap.className = 'release-item';

        if (release.tags && release.tags.length) {
            var tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = release.tags[0];
            wrap.appendChild(tag);
        }

        var title = document.createElement('h3');
        title.textContent = release.title || release.name || (release.dir ? release.dir.split('/').pop() : 'Untitled');
        wrap.appendChild(title);

        if (release.date) {
            var date = document.createElement('div');
            date.className = 'release-date';
            date.textContent = new Date(release.date).toLocaleDateString();
            wrap.appendChild(date);
        }

        var descText = release.description || release.summary || release.excerpt || release.markdown && ('See details') || '';
        if (descText) {
            var p = document.createElement('p');
            p.textContent = descText;
            wrap.appendChild(p);
        }

        // Optional: details button to open modal (if modal functionality exists)
        if (release.markdown || release.dir) {
            var btn = document.createElement('button');
            btn.className = 'gump-btn details-btn';
            btn.type = 'button';
            btn.textContent = 'Details';
            btn.addEventListener('click', function(){
                // Trigger custom event so existing modal handlers can pick it up
                var ev = new CustomEvent('release:open', { detail: release });
                window.dispatchEvent(ev);
            });
            wrap.appendChild(btn);
        }

        return wrap;
    }

    function populateList(listEl, releases) {
        if (!listEl) return;
        // Clear placeholder content only if we have releases to show
        if (!releases || !releases.length) return;

        listEl.innerHTML = '';
        releases.forEach(function(r){
            listEl.appendChild(createReleaseNode(r));
        });
    }

    function init() {
        var pathKey = pageKeyFromLocation();

        // Find all release-list elements on the page
        var lists = document.querySelectorAll('.release-list');
        if (!lists || !lists.length) return;

        // Try to fetch assets/releases.json; if missing, do nothing
        fetch('assets/releases.json').then(function(res){
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        }).then(function(data){
            lists.forEach(function(listEl){
                // Allow per-list override via data-group attribute
                var group = listEl.dataset && listEl.dataset.group ? listEl.dataset.group : pathKey;
                var releases = findReleasesForGroup(data, group);
                populateList(listEl, releases);
            });
        }).catch(function(err){
            // Quietly fail; keep any static HTML already in place
            console.warn('Could not load assets/releases.json — release lists unchanged.', err);
        });

        // Expose a helper to refresh lists programmatically
        window.reloadReleaseLists = function(){
            init();
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();