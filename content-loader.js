// ========== IFSA CONTENT LOADER ==========
// Fetches content from /content/*.json (managed by Sveltia CMS)
// and injects it into the DOM. Falls back to hardcoded HTML if fetch fails.

(function () {
  'use strict';

  // Utility: fetch JSON with graceful fallback
  function fetchJSON(url) {
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('Not OK');
        return r.json();
      });
  }

  // Detect which page we're on
  var path = window.location.pathname;
  var isIndex = path === '/' || path.endsWith('index.html') || (!path.includes('.html') && !path.includes('/admin'));
  var isTeam = path.includes('team');
  var isAchievements = path.includes('achievements');
  var isProjects = path.includes('projects');
  var isAnalytics = path.includes('analytics');

  // Don't run on admin page
  if (path.includes('/admin')) return;

  // ─── INDEX PAGE ───
  if (isIndex) {
    // Site metadata
    fetchJSON('content/site.json').then(function (data) {
      if (data.title) document.title = data.title;
      var meta = document.querySelector('meta[name="description"]');
      if (meta && data.description) meta.setAttribute('content', data.description);
    }).catch(function () { });

    // Hero
    fetchJSON('content/hero.json').then(function (data) {
      var desc = document.querySelector('.hero-desc');
      if (desc && data.subtitle) desc.textContent = data.subtitle;

      var manifesto = document.querySelector('.hero-manifesto');
      if (manifesto && data.manifesto) manifesto.textContent = data.manifesto;

      if (data.stats) {
        var cards = document.querySelectorAll('.stat-card');
        data.stats.forEach(function (stat, i) {
          if (cards[i]) {
            var numEl = cards[i].querySelector('.stat-number');
            var labelEl = cards[i].querySelector('.stat-label');
            if (numEl) {
              numEl.textContent = stat.number;
              numEl.setAttribute('data-target', parseInt(stat.number));
            }
            if (labelEl) labelEl.textContent = stat.label;
          }
        });
      }
    }).catch(function () { });

    // Insights
    fetchJSON('content/insights.json').then(function (data) {
      var secTitle = document.querySelector('#insights .section-title');
      if (secTitle && data.sectionTitle) secTitle.innerHTML = data.sectionTitle;

      if (data.cards) {
        var insightEls = document.querySelectorAll('.insight-card');
        data.cards.forEach(function (card, i) {
          if (insightEls[i]) {
            var tag = insightEls[i].querySelector('.insight-tag');
            var h3 = insightEls[i].querySelector('h3');
            var date = insightEls[i].querySelector('.date');
            var img = insightEls[i].querySelector('.card-img img');
            if (tag) tag.textContent = card.tag;
            if (h3) h3.textContent = card.title;
            if (date) date.textContent = card.date;
            if (img && card.image) img.src = card.image;
          }
        });
      }
    }).catch(function () { });

    // Verticals
    fetchJSON('content/verticals.json').then(function (data) {
      if (data.items) {
        var wwdEls = document.querySelectorAll('.wwd-card');
        data.items.forEach(function (card, i) {
          if (wwdEls[i]) {
            var icon = wwdEls[i].querySelector('.wwd-icon');
            var h3 = wwdEls[i].querySelector('h3');
            var p = wwdEls[i].querySelector('p');
            if (icon) icon.textContent = card.icon;
            if (h3) h3.textContent = card.title;
            if (p) p.textContent = card.description;
          }
        });
      }
    }).catch(function () { });

    // Clients
    fetchJSON('content/clients.json').then(function (data) {
      if (data.items) {
        var clientEls = document.querySelectorAll('.client-card span');
        data.items.forEach(function (name, i) {
          if (clientEls[i]) clientEls[i].textContent = name;
        });
      }
    }).catch(function () { });

    // Fund
    fetchJSON('content/fund.json').then(function (data) {
      var aumEl = document.querySelector('.donut-center .value');
      if (aumEl && data.aum) aumEl.textContent = data.aum;

      if (data.metrics) {
        var rows = document.querySelectorAll('.metric-row');
        data.metrics.forEach(function (m, i) {
          if (rows[i]) {
            var label = rows[i].querySelector('.metric-label');
            var value = rows[i].querySelector('.metric-value');
            if (label) label.textContent = m.label;
            if (value) {
              value.textContent = m.value;
              value.className = 'metric-value ' + (m.color || '');
            }
          }
        });
      }
    }).catch(function () { });

    // Footer
    fetchJSON('content/footer.json').then(function (data) {
      var brandEl = document.querySelector('.footer-brand p');
      if (brandEl && data.brand) brandEl.textContent = data.brand;
      var proofEl = document.querySelector('.footer-proof');
      if (proofEl && data.proof) proofEl.textContent = data.proof;
    }).catch(function () { });
  }

  // ─── TEAM PAGE ───
  if (isTeam) {
    fetchJSON('content/team.json').then(function (data) {
      if (!data.years) return;
      var container = document.getElementById('team-dynamic');
      if (!container) return;
      container.innerHTML = '';

      data.years.forEach(function (yearData, yi) {
        var bg = yearData.bgStyle === 'dark' ? ' style="background: var(--dark-900);"' : '';
        var sectionId = 'core-' + yearData.year.split('-')[0];
        var html = '<section class="section-padding" id="' + sectionId + '"' + bg + '>';
        html += '<div class="container"><div class="team-year-section">';

        yearData.categories.forEach(function (cat, ci) {
          if (ci === 0) {
            html += '<div class="team-year-header fade-up">';
            html += '<div class="team-year-badge">' + yearData.year + '</div>';
            html += '<div class="team-year-line"></div>';
            html += '<div class="team-year-title">' + cat.name + '</div>';
            html += '</div>';
          } else {
            html += '<div class="team-year-header fade-up" style="margin-top:48px;">';
            html += '<div class="team-year-line"></div>';
            html += '<div class="team-year-title">' + cat.name + '</div>';
            html += '<div class="team-year-line"></div>';
            html += '</div>';
          }

          html += '<div class="team-members-grid">';
          cat.members.forEach(function (m, mi) {
            var initials = m.name.split(' ').map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
            var stagger = (mi % 8) + 1;
            html += '<div class="glass-card team-member-card fade-up stagger-' + stagger + '">';
            if (m.photo) {
              html += '<img class="team-member-photo" src="' + m.photo + '" alt="' + m.name + '">';
            } else {
              html += '<div class="team-member-avatar">' + initials + '</div>';
            }
            html += '<h3>' + m.name + '</h3>';
            html += '<div class="team-member-role">' + m.role + '</div>';
            html += '</div>';
          });
          html += '</div>';
        });

        html += '</div></div></section>';
        container.innerHTML += html;
      });
    }).catch(function () { });

    // Convenors
    fetchJSON('content/convenors.json').then(function (data) {
      if (!data.items) return;
      var grid = document.getElementById('convenors-dynamic');
      if (!grid) return;
      grid.innerHTML = '';
      data.items.forEach(function (c, i) {
        var stagger = (i % 8) + 1;
        grid.innerHTML += '<div class="glass-card convenor-card fade-up stagger-' + stagger + '">' +
          '<h3>' + c.name + '</h3>' +
          '<div class="dept">' + c.department + '</div>' +
          '</div>';
      });
    }).catch(function () { });
  }

  // ─── ACHIEVEMENTS PAGE ───
  if (isAchievements) {
    fetchJSON('content/achievements.json').then(function (data) {
      // Stats
      if (data.stats) {
        var statEls = document.querySelectorAll('.page-stat');
        data.stats.forEach(function (s, i) {
          if (statEls[i]) {
            var numEl = statEls[i].querySelector('.num');
            var labelEl = statEls[i].querySelector('.label');
            if (numEl) numEl.textContent = s.num;
            if (labelEl) labelEl.textContent = s.label;
          }
        });
      }

      // Sections
      if (data.sections) {
        var container = document.getElementById('achievements-dynamic');
        if (!container) return;
        container.innerHTML = '';

        data.sections.forEach(function (section) {
          var html = '<div class="achievements-section-title fade-up">' + section.title + '</div>';
          html += '<div class="achievements-grid">';

          section.items.forEach(function (item, i) {
            var stagger = (i % 8) + 1;
            var cardClass = 'glass-card achievement-card fade-up stagger-' + stagger;
            if (section.highlight) cardClass += ' achievement-highlight';

            html += '<div class="' + cardClass + '">';
            if (item.tag) html += '<div class="highlight-tag">' + item.tag + '</div>';
            html += '<h4>' + item.name + '</h4>';
            if (item.host) html += '<div class="host">' + item.host + '</div>';
            html += '<div class="winners">' + item.winners + '</div>';
            html += '</div>';
          });

          html += '</div>';
          container.innerHTML += html;
        });
      }
    }).catch(function () { });
  }

  // ─── PROJECTS PAGE ───
  if (isProjects) {
    fetchJSON('content/projects.json').then(function (data) {
      if (!data.items) return;
      var grid = document.getElementById('projects-dynamic');
      if (!grid) return;
      grid.innerHTML = '';

      data.items.forEach(function (proj, i) {
        var num = String(i + 1).padStart(2, '0');
        var html = '<div class="glass-card project-card fade-up">';
        html += '<div class="project-card-visual">';
        html += '<div class="project-number">' + num + '</div>';
        html += '<span class="project-icon">' + proj.icon + '</span>';
        html += '</div>';
        html += '<div class="project-card-body">';
        html += '<div class="project-category">' + proj.category + '</div>';
        html += '<h3>' + proj.name + '</h3>';
        if (proj.desc1) html += '<p>' + proj.desc1 + '</p>';
        if (proj.desc2) html += '<p>' + proj.desc2 + '</p>';
        if (proj.desc3) html += '<p>' + proj.desc3 + '</p>';
        if (proj.tags && proj.tags.length) {
          html += '<div class="project-highlights">';
          proj.tags.forEach(function (tag) {
            html += '<span class="project-tag">' + tag + '</span>';
          });
          html += '</div>';
        }
        html += '</div></div>';
        grid.innerHTML += html;
      });
    }).catch(function () { });
  }

  // ─── ANALYTICS PAGE ───
  if (isAnalytics) {
    fetchJSON('content/analytics.json').then(function (data) {
      // Update global ANALYTICS_DATA if the page's own script uses it
      if (window.ANALYTICS_DATA !== undefined) {
        window.ANALYTICS_DATA = data;
        if (typeof window.renderAnalytics === 'function') {
          window.renderAnalytics();
        }
      }
    }).catch(function () { });
  }

})();
