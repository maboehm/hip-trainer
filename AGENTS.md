# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Dev Commands

```sh
npm start          # Expo dev server (Metro)
npm run ios        # expo start --ios
npm run android    # expo start --android
npm run web        # expo start --web
npx tsc --noEmit   # typecheck (no script alias exists)
```

No lint, test, or format scripts are configured. Do not assume they exist.

## Key Versions

- Expo ~54.0.33, React 19.1.0, React Native 0.81.5
- TypeScript ~5.9.2 with `strict: true`

## Architecture

- Single app, NOT a monorepo.
- Entry: `index.ts` -> `App.tsx` (registers with Expo).
- Navigation: `@react-navigation/stack` (not Expo Router, not native-stack).
- `RootStackParamList` typed in `App.tsx`: `ExerciseList` (no params) | `ExerciseDetail` ({ exerciseId: string; index: number }).
- Static exercise data only: `data/exercises.json`, no backend/API.
- `src/` contains `types.ts`, `components/`, `hooks/`, `screens/`.

## Gotchas

- **New Architecture enabled** (`newArchEnabled: true`). All libraries must support RN New Arch.
- **`react-native-gesture-handler` must be the first import in `App.tsx`** — do not reorder.
- **`edgeToEdgeEnabled: true`** on Android — always use safe-area insets.
- `expo-keep-awake` is intentional — screen stays on during exercise sessions.
- Portrait-only, light mode only (`userInterfaceStyle: "light"`).
- No CI, no `.env` files, no test infrastructure.
