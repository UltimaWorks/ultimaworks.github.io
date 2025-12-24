---
layout: page
title: Python Scripts
permalink: /python/
---

Utility scripts and tools.

<ul>
  {% for item in site.python_scripts %}
    <li>
      <h3><a href="{{ item.url }}">{{ item.title }}</a> (v{{ item.version }})</h3>
      <p>{{ item.content | strip_html | truncatewords: 20 }}</p>
    </li>
  {% endfor %}
</ul>
