import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private ffmpeg;

  constructor() {
    // console.log = function () {};
    this.ffmpeg = createFFmpeg({ log: false });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpeg.load();

    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 4, 5];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        // Input
        '-i',
        file.name,
        // Output Options
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        //Output
        `output_0${second}.png`
      );
    });

    await this.ffmpeg.run(...commands);

    const screenshots: string[] = [];

    seconds.forEach((second) => {
      const screenshotsFile = this.ffmpeg.FS(
        'readFile',
        `output_0${second}.png`
      );

      const screenshotsBlob = new Blob([screenshotsFile.buffer], {
        type: 'image/png',
      });

      const screenshotsURL = URL.createObjectURL(screenshotsBlob);

      screenshots.push(screenshotsURL);
    });
    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
