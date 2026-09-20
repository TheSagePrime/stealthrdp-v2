#!/usr/bin/env python3
from __future__ import annotations
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = json.loads((ROOT / 'checksum-manifest.json').read_text(encoding='utf-8'))
LINEAGE = json.loads((ROOT / 'lineage-manifest.json').read_text(encoding='utf-8'))
EXPECTED_CANONICAL = 'a1c922f9cf09cdbedafcc59ce4d9b9055959e672254293a490a0159104d85b3e'
EXPECTED_PREDECESSOR = 'eeac81b12190999e30cd9f1be9082654a76905a26872c6a0dc8ad45d3fb50881'
EXPECTED_CANONICAL_BLOB = '5ccd22359254c8a237037a54e44b418d66f0a97a'
EXPECTED_PREDECESSOR_BLOB = '4068fc3a1d32b8226a9667443ddcb37173baf832'

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def git_blob_oid(data: bytes) -> str:
    header = f'blob {len(data)}\0'.encode('ascii')
    return hashlib.sha1(header + data).hexdigest()

def identity(rows: list[dict]) -> str:
    payload = ''.join(f"{row['id']}\x1f{row['prompt']}\x1e" for row in rows).encode('utf-8')
    return sha256(payload)

assert MANIFEST['freeze_id'] == 'AISEO-V1-CORE'
assert MANIFEST['canonical_artifact_revision'] == '1.1'
assert MANIFEST['canonical_sha256'] == EXPECTED_CANONICAL
assert MANIFEST['canonical_git_blob_object_id'] == EXPECTED_CANONICAL_BLOB
assert MANIFEST['prompt_count'] == 40
assert MANIFEST['discovery_pool_count'] == 62
assert MANIFEST['artifacts'][0]['sha256'] == EXPECTED_PREDECESSOR
assert MANIFEST['artifacts'][1]['sha256'] == EXPECTED_CANONICAL
assert MANIFEST['artifacts'][0]['git_blob_object_id'] == EXPECTED_PREDECESSOR_BLOB
assert MANIFEST['artifacts'][1]['git_blob_object_id'] == EXPECTED_CANONICAL_BLOB
assert MANIFEST['artifacts'][0]['prompt_text_hash'] == MANIFEST['artifacts'][1]['prompt_text_hash']
assert LINEAGE['rules']['versioned_snapshot_write'].startswith('Never overwrite')

identities = []
for artifact in MANIFEST['artifacts']:
    path = ROOT / artifact['artifact_path']
    data = path.read_bytes()
    actual = sha256(data)
    assert actual == artifact['sha256'], (path, actual, artifact['sha256'])
    assert artifact['sha256_type'] == 'FILE_CONTENT_SHA256'
    assert git_blob_oid(data) == artifact['git_blob_object_id']
    parsed = json.loads(data)
    assert parsed['prompt_count'] == 40
    assert len(parsed['prompts']) == 40
    current_identity = identity(parsed['prompts'])
    assert current_identity == artifact['prompt_text_hash']
    identities.append(current_identity)

assert identities[0] == identities[1] == MANIFEST['prompt_identity_hash']
discovery = json.loads((ROOT / 'discovery/AISEO-V1-DISCOVERY-1.1/discovery-pool.json').read_text(encoding='utf-8'))
assert discovery['prompt_count'] == 62
assert not any(row['id'] == 'DP-MC09' for row in discovery['prompts'])
assert any(row['id'] == 'DP-MC10' for row in discovery['prompts'])
print('baseline_validation=PASS')
print('canonical_sha256=', MANIFEST['canonical_sha256'])
print('predecessor_sha256=', MANIFEST['artifacts'][0]['sha256'])
print('prompt_identity_hash=', MANIFEST['prompt_identity_hash'])
print('prompt_count=', MANIFEST['prompt_count'])
print('discovery_pool_count=', discovery['prompt_count'])
