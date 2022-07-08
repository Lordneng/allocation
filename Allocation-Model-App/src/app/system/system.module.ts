import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { UserComponent } from './user/user.component';
import { PermissionComponent } from './permission/permission.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { SignatureComponent } from './signature/signature.component';
import { GlobalVariableComponent } from './global-variable/global-variable.component';
import { SharedDxModule } from '../share/shared-dx.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [UserComponent, PermissionComponent, UserGroupComponent, SignatureComponent, GlobalVariableComponent],
  imports: [
    CommonModule,
    FormsModule,
    SystemRoutingModule,
    SharedDxModule,
    ModalModule.forRoot(),
  ]
})
export class SystemModule { }
