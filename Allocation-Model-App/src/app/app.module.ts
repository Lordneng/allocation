import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { httpInterceptorProviders } from './interceptors';
@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    LayoutContainersModule,
    NgxSpinnerModule,
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    httpInterceptorProviders,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
