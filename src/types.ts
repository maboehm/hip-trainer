export type SimpleTimer = {
  mode: 'simple';
  durationSeconds: number;
};

export type IntervalTimer = {
  mode: 'interval';
  holdSeconds: number;
  restSeconds: number;
  sets: number;
};

export type TimerConfig = SimpleTimer | IntervalTimer;

export type Exercise = {
  id: string;
  name: string;
  targetMuscles: string[];
  instructions: string[];
  cues: string[];
  timer: TimerConfig;
  youtubeId?: string;
};
