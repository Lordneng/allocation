import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  errorMessage: string = '';

  constructor(private renderer: Renderer2,
    private authService: AuthService,
    private loaderService: NgxSpinnerService,
    private router: Router) {

    this.authService.checkAuthorizedUser().subscribe(result => {
      // console.log('checkAuthorizedUser', result);
      if (result && result.isAuthorizedUser === true) {
        this.router.navigate(['/']);
      }
    });

    this.authService.errorMessage$.subscribe(nextResult => {
      this.errorMessage = nextResult;
    })
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'background');
    this.renderer.addClass(document.body, 'no-footer');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'background');
    this.renderer.removeClass(document.body, 'no-footer');
  }

  formSubmit(form: NgForm) {
    this.loaderService.show();
    let formData: any = form.value;
    // console.log('formSubmit', formData);
    this.authService.login(formData, () => { this.loaderService.hide(); });
  }
}
