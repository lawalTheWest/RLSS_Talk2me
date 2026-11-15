# Talk2Me v1.0 — serverless audio calls for up to 4 phones

First public release. Talk2Me is a small native Android app for **audio-only
group calls with no backend to deploy, no accounts, and no sign-up**. One person
starts a call, shares an 8-character code, and everyone else joins.

Calls are a **full WebRTC mesh**: each phone holds one encrypted audio
connection to every other phone. The only third party involved by default is a
public MQTT broker that helps phones find each other — it never carries audio.
An optional TURN relay can forward audio when a direct path is blocked.

## Highlights

- **1–4 person audio calls** over a peer-to-peer mesh, end-to-end encrypted (DTLS-SRTP)
- **No backend** — signaling uses free public MQTT brokers; nothing to host or pay for
- **Private by design** — SDP/ICE payloads are AES-GCM encrypted with a PBKDF2 key derived from the room code; no analytics, accounts, or call records
- **Join/leave mid-call** — the mesh renegotiates per pair; late joiners are supported
- **Survives screen lock** — foreground service plus CPU and Wi-Fi wake locks keep waiting, connecting, and live calls running with the screen off
- **Optional TURN relay** — enter any provider's URL + username + password under **Network settings** for mobile data and strict NATs
- **Ongoing notification** with **Mute** and **End** actions
- Mute, earpiece/speaker toggle, call timer, copy/share room code

## Reliability work in this build

- Deterministic MQTT broker rotation, so both phones always try brokers in the same order
- 500 ms presence announcements and faster peer discovery
- Four STUN servers, including port 443 for restrictive networks
- TCP candidates enabled, plus continual ICE gathering
- Per-peer ICE restarts, `renegotiate` requests, and connect timeouts
- Reconnecting UI instead of silently hanging
- Deterministic initiator per pair (lexicographically lower session ID offers), so group calls negotiate without glare
- Room capped at 4 people; a fifth joiner is told the call is full

## Install

1. Download **`Talk2Me-v1.0.apk`** from the assets below.
2. Allow installs from your browser/file manager when prompted.
3. Open Talk2Me and allow **microphone** (and **notifications**, so the ongoing-call controls appear).
4. Tap **Start a call**, share the code, and join from the other phone(s).

> The APK is signed with a dedicated release key. If you previously installed a
> debug build, uninstall it first — Android will reject an update with a
> different signature. Uninstalling clears saved Network settings.

## APK details

| | |
|---|---|
| Version | 1.0 (versionCode 1) |
| Size | ~41 MB |
| Minimum Android | 8.0 (API 26) |
| Target SDK | 35 |
| Signer | `CN=Talk2Me` |
| SHA-256 | `02a5f42e1fb66465b8e65e35df1cbcf01c5454d5e8a0d5161fcecf5cfa134425` |

## Known limitations

- **Cross-network calls need TURN.** Same Wi-Fi generally connects directly. Mobile data, CGNAT, and corporate Wi-Fi often cannot, and no code change can create a route that does not exist. Add a free TURN account (Metered Open Relay or Xirsys both offer ~500 MB/month) under **Network settings** — use the same URL/username/password on every phone.
- **No incoming-call ringing.** Both people open the app and use the same room code.
- **No video, contacts, or call history.**
- **Swiping the app from Recents ends the call.** Pressing Back or locking the screen does not.
- Some OEM skins (MIUI/HyperOS, etc.) restrict background apps; set Talk2Me to **No restrictions** / allow autostart for best results.

## Under the hood

Kotlin + Jetpack Compose, `org.webrtc` with a shared `AudioEngine` and one
`PeerConnection` per participant, Eclipse Paho MQTT for signaling, and a mesh
policy limited to 4 participants. 31 JVM unit tests cover room codes, crypto,
signal framing, TURN parsing, and mesh policy.

Feedback and bug reports are welcome — please include your Android version,
whether both phones were on the same network, and the message shown under any
error.
