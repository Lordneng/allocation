import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  displayName = '';
  constructor(
    private authService: AuthService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      const userProfile = this.authService.getUserProfile();
      this.displayName = userProfile?.fullName;
    }, 100);
  }

  onSignOut(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }


}
