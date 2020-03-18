/**
 *  Jent.ly Summarizer -- Chrome Extension that highlights inline summaries
 *                        of web content
 *  Copyright (C) 2020  Jent.ly
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/*global chrome*/
chrome.storage.sync.get({
  'color': {r: 255, g: 255, b: 0},
  'isSummarizerEnabled': false,
  'summaryDomainWhitelist': []
}, function(items) {
  // do nothing if not enabled
  if (!items.isSummarizerEnabled) {
    return;
  }

  // do nothing if current website is not whitelisted
  let whitelist = new Set(items.summaryDomainWhitelist);
  // eslint-disable-next-line TODO: find alternative for this? maybe chrome tabs query, no-restricted-globals
  let url = new URL(location.href);
  if (!whitelist.has(url.hostname)) {
    return;
  }

  // kickoff highlighting routine on background script
  let color = 'rgb(' + items.color.r + ',' + items.color.g + ',' + items.color.b + ')';
  let highlightColor = `mark{background: ${color};}`
  chrome.runtime.sendMessage({request_type: "highlight", highlight_color: highlightColor});
});
