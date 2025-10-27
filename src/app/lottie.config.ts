import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

export const provideLottie = () =>
  provideLottieOptions({
    player: () => player,
  });
