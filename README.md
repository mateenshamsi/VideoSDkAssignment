<h1 align="center"> VideoMeet</h1>

<p align="center">
  A lightweight React app that lets users join video meetings and switch rooms seamlessly — built using <a href="https://www.videosdk.live/">VideoSDK</a>.
</p>

---
### Video of project 


👉 [Click to watch on Loom](https://www.loom.com/share/a163ca53e678470d96b248b758fc8a83)

[![One more demo]](https://www.loom.com/share/2a95b11817454e55b1b3437b882c826e?sid=5a40d843-b617-4382-9bb4-783d23467386)


##  Project Setup

1. **Clone the repository**

```bash
git clone https://github.com/mateenshamsi/videosdk-room-switcher.git
cd videosdk-room-switcher
```

2. **Install dependencies**

```bash
npm install
```

3. **Add environment variables**

Create a `.env` file in the root directory and add your VideoSDK Auth Token:

```
REACT_APP_VIDEOSDK_TOKEN=your_token_here
```

4. **Run the app**

```bash
npm run dev
```

---

## 🔁 Room Switching Logic

Room switching is powered by VideoSDK’s `switchTo()` method. Here's how it works in the app:

- Users can **create a new room** and instantly switch to it.
- Users can **join a room manually** by entering a meeting ID.
- App keeps a **history of recently joined rooms** for quick access.
- Room switch is done **without full reload** — only media sessions transition.

**Main API used:**

```ts
meeting.switchTo({ meetingId, token });
```

---

##  Limitations & Notes

- Only **participants in the same room at the same time** are visible.
- On a new tab, previously joined participants are **not auto-synced** unless they're actively in the new room.
- This is a **basic demo**, not production-optimized — built to demonstrate VideoSDK room switching integration.
- If you're not seeing participants after switching:
  - Make sure both users are joined in the **same room**.
  - Check your `ParticipantView` and `participants` state inside `MeetingView`.

---

## 🙋‍♂️ Author

**Abdulmateen Shamsi**  
🌐 [GitHub](https://github.com/mateenshamsi)  
📫 Feel free to connect or reach out!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
