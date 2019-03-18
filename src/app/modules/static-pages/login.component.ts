import { Component, isDevMode } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@blueriq/angular';

@Component({
  selector: 'bq-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  loginForm = new FormGroup({
    username: this.username,
    password: this.password,
  });
  failed = false;

  errorPlay: HTMLAudioElement;

  constructor(private readonly authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
    // this.errorPlay = new Audio();
    // this.errorPlay.src = './theme/blueriq/sounds/error-sound.mp3';
    // this.errorPlay.volume = 1.0;
    // this.errorPlay.muted = false;
    // this.errorPlay.load();
  }

  login() {
    this.authService.login(this.username.value, this.password.value).subscribe({
      next: result => {
        if (result.success) {
          const { returnUrl } = this.route.snapshot.queryParams;
          this.router.navigate([returnUrl || '/']);
        } else {
          // this.errorPlay.play();
          this.failed = true;
        }
      },
      error: (e) => {
        // this.errorPlay.play();
        this.failed = true;
        if (isDevMode()) {
          console.error(e);
        }
      },
    });
  }

}
