// ==UserScript==
// @name        Updated Resume From Overleaf
// @namespace   Custom Violentmonkey Scripts
// @match       https://www.overleaf.com/*
// @grant       none
// @version     1.0
// @author      chubbyFreak
// @description 10/16/2022, 2:11:51 AM
// ==/UserScript==

const API_URL = 'https://maheshnat.herokuapp.com/api/update-resume';
const SECRET =
  '+CiMojHIwIGk5jD6yPPAip0uAB1b8TH+18suSWCjWXD0XoyN2BNAFne2ezpPk23e/LOAPPBe2IYn2wpQEDwXQuT9gNQARq7NCq/fNjj/yCWr8SNPl/og4yj24q1Nop01V6qJoD8Io5MVDXXIE6kcyslj9rVKfHvtLbgkoz29rxNhfVoXyeKeqWPzv2Y6U36F4YNsR2rQZH/BxOJ1NInQcu+etzD6G/GuSh48Cw2uf4X6skT6pZE59GBKcA3Hew6g9nJJpk4PZAyrDWNRftBKU+ickJ8gd+YfU6N1pQqCV7sE9IQ5nMvOOaWepnjlLRsBfr0DrVxC3YS+8XkvlxEKIQ==';

const pushToGithub = async () => {
  let res = await fetch(
    document.querySelector('.fa-download').parentElement.href
  );

  const encodedText = btoa(unescape(encodeURIComponent(await res.text())));
  const latex = btoa(
    unescape(encodeURIComponent(await navigator.clipboard.readText()))
  );

  try {
    res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        secret: SECRET,
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
