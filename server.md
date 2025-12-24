---
layout: page
title: Server Scripts
permalink: /server/
---

Scripts for Ultima Online server emulators.

<ul>
  {% for item in site.server_scripts %}
    <li>
      <h3><a href="{{ item.url }}">{{ item.title }}</a></h3>
      <span style="background: #333; color: #fff; padding: 2px 6px; font-size: 0.8em; border-radius: 3px;">{{ item.platform }}</span>
      <p>{{ item.content | strip_html | truncatewords: 20 }}</p>
    </li>
  {% endfor %}
</ul>
