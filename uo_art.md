---
layout: page
title: UO Art Releases
permalink: /uo-art/
---

Welcome to the Art archives.

<ul>
  {% for item in site.uo_art %}
    <li>
      <h3><a href="{{ item.url }}">{{ item.title }}</a></h3>
      <p>{{ item.date | date: "%B %d, %Y" }}</p>
      {% if item.image %}<img src="{{ item.image }}" style="max-height: 100px;">{% endif %}
    </li>
  {% endfor %}
</ul>
