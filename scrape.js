// ==UserScript==
// @name        Updated Resume From Overleaf
// @namespace   Custom Violentmonkey Scripts
// @match       https://www.overleaf.com/*
// @grant       none
// @version     1.0
// @author      chubbyFreak
// @description 10/16/2022, 2:11:51 AM
// ==/UserScript==

const API_URL = 'https://maheshnat.herokuapp.com/';
const SECRET = '';

const appendBase64Script = async () => {
  let e = document.createElement('script');
  e.innerText = await (
    await fetch('https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js')
  ).text();
  document.head.appendChild(e);
};

const pushToGithub = async () => {
  let res = await fetch(
    document.querySelector('.fa-download').parentElement.href
  );

  let encodedBlobText = Base64.fromUint8Array(
    new Uint8Array(await (await res.blob()).arrayBuffer())
  );
  const latexText = await navigator.clipboard.readText();
  if (!latexText.startsWith('\\documentclass'))
    return alert('Invalid Clipboard.');
  const encodedLatexText = btoa(unescape(encodeURIComponent(latexText)));
  const commitMessage = prompt('Enter a commit message:');

  try {
    res = await fetch(`${API_URL}/api/update-resume`, {
      method: 'PUT',
      headers: {
        secret: SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blobContent: encodedBlobText,
        latexContent: encodedLatexText,
        commitMessage,
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
  // pressing m and last pressed ctrl
  if (lastPressedKeyCode === 17 && e.keyCode === 77) {
    if (confirm('Are you sure you want to push changes to github?'))
      pushToGithub();
  }
  lastPressedKeyCode = e.keyCode;
};

document.addEventListener('keydown', onKeyDown, false);
appendBase64Script();
