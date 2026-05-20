import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type SoundEvent = 'countIn' | 'holdStart' | 'restStart' | 'done';

// Asset map — swap files in assets/sounds/ to change sounds, no logic changes needed
const SOUND_ASSETS: Record<SoundEvent, ReturnType<typeof require>> = {
  countIn: require('../../assets/sounds/count-in.mp3'),
  holdStart: require('../../assets/sounds/hold-start.mp3'),
  restStart: require('../../assets/sounds/rest-start.mp3'),
  done: require('../../assets/sounds/done.mp3'),
};

let audioModeSet = false;

async function ensureAudioMode(): Promise<void> {
  if (audioModeSet) return;
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
  });
  audioModeSet = true;
}

export async function playSound(event: SoundEvent): Promise<void> {
  try {
    await ensureAudioMode();
    const player = createAudioPlayer(SOUND_ASSETS[event]);
    player.play();
    // Unload after playback to free memory
    player.addListener('playbackStatusUpdate', status => {
      if (status.didJustFinish) {
        player.remove();
      }
    });
  } catch {
    // Never crash the timer over a sound failure
  }
}
