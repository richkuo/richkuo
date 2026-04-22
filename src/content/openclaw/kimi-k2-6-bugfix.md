---
title: OpenClaw Kimi K2.6 Bugfix
description: How to fix Kimi configuration drift in OpenClaw where sessions silently fall back to a different model instead of staying on kimi-k2.6.
pubDate: 2026-04-22
icon: tabler:bug
---

# OpenClaw Kimi K2.6 Bugfix

## The Problem

A common OpenClaw issue is **Kimi configuration drift**.

The same installation can end up with conflicting Kimi settings across the global config, agent-local config files, auth profiles, and saved session state.

When that happens, OpenClaw often fails over to a fallback model without making the root problem obvious — and that fallback can then persist across future turns.

## The Fix

Normalize the entire Kimi path end-to-end:

- Keep only the intended `moonshot/kimi-k2.6` configuration
- Point it to `https://api.kimi.com/coding`
- Remove legacy `kimi` / `kimi-coding` entries and older Kimi variants
- Clear any stale fallback state so sessions actually stay on K2.6

## Prompt

<div style="display: inline-flex; align-items: center; gap: 0.5rem;">
  <span>Copy and Paste this into OpenClaw to fix Kimi drift</span>
  <button
    onclick="(function(btn) { var text = document.getElementById('kimi-fix-prompt').innerText; navigator.clipboard.writeText(text).then(function() { var icon = btn.querySelector('svg'); var check = btn.querySelector('span'); icon.style.display='none'; check.style.display='inline'; setTimeout(function() { icon.style.display='inline'; check.style.display='none'; }, 2000); }); })(this)"
    style="display: inline-flex; align-items: center; cursor: pointer; opacity: 0.6; transition: opacity 0.15s; background: none; border: none; padding: 0;"
    onmouseover="this.style.opacity='1'"
    onmouseout="this.style.opacity='0.6'"
    aria-label="Copy prompt"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
    <span style="display:none; font-size: 0.75rem;">Copied!</span>
  </button>
</div>

<pre id="kimi-fix-prompt" style="white-space: pre-wrap; word-break: break-word;">please fix my OpenClaw Kimi config. i have the bug where sessions keep falling back to another model instead of staying on moonshot/kimi-k2.6. this issue often happens because Kimi settings drift across both global and agent-local config files, and stale fallback state can keep the wrong model active even after partial fixes.

please do this carefully and verify exhaustively:

1. inspect global /root/.openclaw/openclaw.json
2. inspect every agent-local file under ~/.openclaw/agents/*/agent/, especially:
   - models.json
   - auth-profiles.json
   - auth-state.json
3. remove all legacy kimi and kimi-coding provider/auth entries everywhere, not just the first block you find
4. keep only moonshot/kimi-k2.6
5. make sure its base URL is exactly https://api.kimi.com/coding
6. verify there are no leftover Kimi variants anywhere, including:
   - k2p5
   - kimi-code
   - kimi-k2.5
   - kimi-k2-thinking
   - kimi-k2-thinking-turbo
   - kimi-k2-turbo
7. clear stale session/provider fallback state that pins sessions to the fallback model
8. reload/restart if needed
9. verify the active session actually runs on Kimi after the cleanup

important: don't do a shallow check. after editing, explicitly confirm every relevant file only contains the intended moonshot provider and kimi-k2.6 model.</pre>
