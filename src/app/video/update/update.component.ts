import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, combineLatest, forkJoin } from 'rxjs';
import { ClipService } from 'src/app/services/clip.service';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alerMsg = 'Please wait! your clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: any;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  title = new UntypedFormControl('', {
    validators: [Validators.required, Validators.minLength(5)],
  });

  uploadForm: any = new UntypedFormGroup({
    title: this.title,
  });
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  async storeFile(event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }

    this.isDragover = false;

    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  async uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alerMsg = 'Please wait! your clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFilename = uuid();
    const clipsPath = `clip/${clipFilename}.mp4`;

    const screeshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );

    const screenshotPath = `screenshots/${clipFilename}.png`;

    this.task = this.storage.upload(clipsPath, this.file);
    const clipRef = this.storage.ref(clipsPath);

    this.screenshotTask = this.storage.upload(screenshotPath, screeshotBlob);

    const screenshotRef = this.storage.ref(screenshotPath);
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;

      if (!clipProgress || !screenshotProgress) {
        return;
      }

      const total = clipProgress + screenshotProgress;
      this.percentage = (total as number) / 200;
    });

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls;
          const clips = {
            uid: this.user?.uid,
            displayName: this.user.displayName,
            title: this.title.value,
            fileName: `${clipFilename}.mp4`,
            url: clipURL,
            screenshotURL,
            screenshotFileName: `${clipFilename}.png`,
            //get update time
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipsService.createClip(clips);

          this.alertColor = 'green';
          this.alerMsg = 'Success! your clip is uploaded!';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alerMsg =
            'Upload failed! check that your fail is less then 20mb and try again';
          this.inSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }
}
