// ==UserScript==
// @name        Updated Resume From Overleaf
// @namespace   Custom Violentmonkey Scripts
// @match       https://www.overleaf.com/*
// @grant       none
// @version     1.0
// @author      chubbyFreak
// @description 10/16/2022, 2:11:51 AM
// ==/UserScript==

const pushToGithub = async () => {
  let res = await fetch(
    document.querySelector('.fa-download').parentElement.href
  );

  const encodedText = btoa(unescape(encodeURIComponent(await res.text())));
  const latex = await navigator.clipboard.readText();

  try {
    res = await fetch('https://maheshnat.herokuapp.com/api/update-resume', {
      method: 'PUT',
      headers: {
        secret: 'secret',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blobContent: encodedText,
        latexContent: latex,
      }),
    });
    if (res.ok) alert('Successfully pushed to github.');
    else alert(`Error pushing to github, "${(await res.json()).message}"`);
  } catch (e) {
    alert('Error pushing to github.');
  }
};

let lastPressedKeyCode;

const onKeyDown = (e) => {
  // pressing i and last pressed ctrl
  if (lastPressedKeyCode === 17 && e.keyCode === 73) {
    if (confirm('Are you sure you want to push changes to github?'))
      pushToGithub();
  }
  lastPressedKeyCode = e.keyCode;
};
document.addEventListener('keydown', onKeyDown, false);
