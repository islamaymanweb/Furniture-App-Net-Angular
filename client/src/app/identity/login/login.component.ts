import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../core/core.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  emailModel: string = '';
  retrunUrl='/'
  showModal = false;
 constructor(
    private fb: FormBuilder,
    private _service: IdentityService,
    private route: Router,
    private router:ActivatedRoute,
    private coreService:CoreService
  ) {}
  ngOnInit(): void {
    this.FormValidation();
    const myModal = document.getElementById('exampleModal');
    const myInput = document.getElementById('myInput');

    myModal?.addEventListener('shown.bs.modal', () => {
      myInput?.focus();
    });
    this.router.queryParams.subscribe(param=>{
      this.retrunUrl=param["returnUrl"]||'/'
    })
  }
  FormValidation() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
          ),
        ],
      ],
    });
  }

  get _email() {
    return this.formGroup.get('email');
  }
  get _password() {
    return this.formGroup.get('password');
  }

  Submit() {
    if (this.formGroup.valid) {
      this._service.Login(this.formGroup.value).subscribe({
        next: (value) => {
          this.coreService.getUserName().subscribe();
          console.log(value);
          this.route.navigateByUrl(this.retrunUrl);
        },
        error(err) {
          console.log(err);
        },
      });
    }
  }

  SendEmailForgetpassword() {
    this._service.forgetPassword(this.emailModel).subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
    });
  }
  togglePasswordVisibility() {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    const icon = document.querySelector('.toggle-password');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon?.classList.remove('fa-eye');
      icon?.classList.add('fa-eye-slash');
    } else {
      passwordField.type = 'password';
      icon?.classList.remove('fa-eye-slash');
      icon?.classList.add('fa-eye');
    }
  }

  openForgotPasswordModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
