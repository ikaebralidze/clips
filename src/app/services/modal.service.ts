import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  isModalVisible(id: string): boolean {
    // !! converting return to boolen
    return !!this.modals.find((el) => el.id === id)?.visible;
  }

  toggleModal(id: string) {
    const modal = this.modals.find((el) => el.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
  unregister(id: string) {
    this.modals = this.modals.filter((element) => element.id !== id);
  }
}
