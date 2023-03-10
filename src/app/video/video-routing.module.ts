import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateComponent } from './update/update.component';
import { ManageComponent } from './manage/manage.component';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { FormGuardGuard } from '../guards/form-guard.guard';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('home');

const routes: Routes = [
  {
    path: '',
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    // check if user is authed to access this route
    canActivate: [AngularFireAuthGuard],
    children: [
      {
        path: 'manage',
        component: ManageComponent,

        title: 'Manage',
      },
      {
        path: 'upload',
        component: UpdateComponent,
        canDeactivate: [FormGuardGuard],
        title: 'Update',
      },
    ],
  },

  {
    path: 'manage-clips',
    redirectTo: 'manage',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
