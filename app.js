'use strict';

    const $ = (id) => document.getElementById(id);
    let generatedMetaTags = '';

    function getWords(text) {
      const trimmed = text.trim();
      return trimmed ? trimmed.split(/\s+/) : [];
    }

    function normalisePhrase(text) {
      return text.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().replace(/\s+/g, ' ');
    }

    function escapeHtmlAttribute(value) {
      return value
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
    }

    $('countButton').addEventListener('click', () => {
      const text = $('textInput').value;
      const words = getWords(text);
      const characters = text.length;
      const charactersWithoutSpaces = text.replace(/\s/g, '').length;
      $('wordResult').textContent =
        'Words: ' + words.length +
        '\nCharacters (with spaces): ' + characters +
        '\nCharacters (without spaces): ' + charactersWithoutSpaces;
    });

    $('densityButton').addEventListener('click', () => {
      const keyword = normalisePhrase($('keyword').value);
      const words = getWords(normalisePhrase($('content').value));

      if (!keyword) {
        $('densityResult').textContent = 'Enter a keyword or phrase first.';
        return;
      }

      if (!words.length) {
        $('densityResult').textContent = 'Paste some text to check.';
        return;
      }

      const phraseWords = keyword.split(' ');
      let matches = 0;

      for (let index = 0; index <= words.length - phraseWords.length; index++) {
        const candidate = words.slice(index, index + phraseWords.length).join(' ');
        if (candidate === keyword) matches++;
      }

      const density = (matches * phraseWords.length / words.length) * 100;
      $('densityResult').textContent =
        'Phrase matches: ' + matches +
        '\nWords in text: ' + words.length +
        '\nKeyword density: ' + density.toFixed(2) + '%';
    });

    $('metaButton').addEventListener('click', () => {
      const title = $('pageTitle').value.trim();
      const description = $('description').value.trim();

      if (!title || !description) {
        $('metaResult').textContent = 'Add both a page title and a meta description.';
        $('copyMetaButton').hidden = true;
        generatedMetaTags = '';
        return;
      }

      generatedMetaTags =
        '<title>' + title.replaceAll('<', '&lt;').replaceAll('>', '&gt;') + '</title>\n' +
        '<meta name="description" content="' + escapeHtmlAttribute(description) + '">';

      $('metaResult').textContent = generatedMetaTags;
      $('copyMetaButton').hidden = false;
    });

    $('copyMetaButton').addEventListener('click', async () => {
      if (!generatedMetaTags) return;

      try {
        await navigator.clipboard.writeText(generatedMetaTags);
        $('copyMetaButton').textContent = 'Copied';
      } catch {
        $('metaResult').textContent = generatedMetaTags + '\n\nCopy the tags above manually.';
      }
    });

    $('titleButton').addEventListener('click', () => {
      const topic = $('topic').value.trim();

      if (!topic) {
        $('titleResult').textContent = 'Enter a topic or keyword first.';
        return;
      }

      const year = new Date().getFullYear();
      const ideas = [
        'A Beginner’s Guide to ' + topic,
        'How to Choose ' + topic,
        topic + ': Tips and Common Questions',
        'What to Know Before You Try ' + topic,
        topic + ': A Practical Guide for ' + year
      ];

      $('titleResult').textContent = ideas.join('\n');
    });
