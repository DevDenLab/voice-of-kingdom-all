import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import VokimExperience from './VokimExperience';
import { EMPTY_EVENT } from '../../lib/siteContent';

const render = (event, posterKey = null) =>
  renderToStaticMarkup(<VokimExperience posterKey={posterKey} event={{ ...EMPTY_EVENT, ...event }} />);

test('event switched off hides the event block but keeps the watch link', () => {
  const html = render({ enabled: false, registration_open: true, registration_url: 'https://x.test' });
  expect(html).not.toContain('UPCOMING EVENT');
  expect(html).not.toContain('Looking forward to seeing you');
  expect(html).not.toContain('REGISTER');
  expect(html).toContain('Watch the VOKIM Experience');
});

test('event on with registration closed shows details but no register button', () => {
  const html = render({
    enabled: true,
    date: 'Saturday, June 26th, 2027',
    registration_open: false,
    registration_url: 'https://x.test',
  });
  expect(html).toContain('VOKIM EXPERIENCE 2027');
  expect(html).toContain('Saturday, June 26th, 2027');
  expect(html).not.toContain('REGISTER');
  expect(html).toContain('Watch the VOKIM Experience');
});

test('registration open with a link shows the button in both places, centred in thank-you', () => {
  const html = render({ enabled: true, registration_open: true, registration_url: 'https://x.test/reg' });
  expect(html.match(/REGISTER FOR FREE/g)).toHaveLength(2);
  expect(html).toContain('href="https://x.test/reg"');
  expect(html).toContain('align-self:center');
});

test('registration open but no link shows no button', () => {
  const html = render({ enabled: true, registration_open: true, registration_url: '' });
  expect(html).not.toContain('REGISTER');
});

test('empty detail fields are not rendered', () => {
  const html = render({ enabled: true, date: '', time: '', location: '', admission: '' });
  expect(html).not.toContain('>DATE<');
  expect(html).not.toContain('>TIME<');
  expect(html).not.toContain('>LOCATION<');
  expect(html).not.toContain('>ADMISSION<');
});
