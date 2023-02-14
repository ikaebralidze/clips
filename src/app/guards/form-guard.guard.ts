import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UpdateComponent } from '../video/update/update.component';

@Injectable({
  providedIn: 'root',
})
export class FormGuardGuard implements CanDeactivate<UpdateComponent> {
  canDeactivate(
    component: UpdateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.uploadForm.dirty) {
      if (confirm('Video is not updated, are you sure you want to close it?')) {
        return true;
      } else {
        return false;
      }
    }
    return !component.uploadForm.dirty;
  }
}
