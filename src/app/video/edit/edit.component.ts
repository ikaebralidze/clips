import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clips.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  showAlert = false;
  inSubmission = false;
  alerMsg = 'Please wait! updating clip.';
  alertColor = 'blue';

  clipId = new FormControl('');
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(5)],
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId,
  });

  constructor(private modal: ModalService, private clipService: ClipService) {}

  async submit() {
    if (!this.activeClip) {
      return;
    }

    this.showAlert = true;
    this.inSubmission = true;
    this.alertColor = 'blue';
    this.alerMsg = 'Please wait! updating clip.';
    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (e) {
      console.log(e);
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alerMsg = 'Something went wrong';

      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'Green';
    this.alerMsg = 'Success!';
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges() {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }
}
