import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionComponent } from './permission/permission.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserComponent } from './user/user.component';
import { SignatureComponent } from './signature/signature.component';
import { GlobalVariableComponent } from './global-variable/global-variable.component';

const routes: Routes = [{
  path: 'user',
  component: UserComponent
}, {
  path: 'user-group',
  component: UserGroupComponent
}, {
  path: 'permission',
  component: PermissionComponent
}, {
  path: 'signature',
  component: SignatureComponent
}, {
  path: 'global-variable',
  component: GlobalVariableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
