import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  fromGroup!: FormGroup;
  constructor(private fb: FormBuilder,
    private _service:IdentityService,
    private toast:ToastrService,
    private route:Router
  ) {}
  ngOnInit(): void {
    this.formValidation()
  }

  formValidation() {
    this.fromGroup = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      DisplayName: ['', [Validators.required]],
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
  get _username() {
    return this.fromGroup.get('UserName');
  }
  get _email() {
    return this.fromGroup.get('email');
  }
  get _DisplayName() {
    return this.fromGroup.get('DisplayName');
  }
  get _password() {
    return this.fromGroup.get('password');
  }
/*   Submit(){
    if(this.fromGroup.valid){
      this._service.register(this.fromGroup.value).subscribe({
        next:(value) =>{
          console.log(value);
          this.toast.success("Register success , please confierm your email",'success'.toUpperCase())
          this.route.navigateByUrl('/Account/Login')
        },
        error:(err:any)=> {
          console.log(err);
          this.toast.error(err.error.message,'error'.toUpperCase())

        },
      })
    }
  } */Submit() {
  if (this.fromGroup.valid) {
    this._service.register(this.fromGroup.value).subscribe({
      next: (value) => {
        console.log('Success:', value);
        this.toast.success("Register success, please confirm your email", 'SUCCESS');
        this.route.navigateByUrl('/Account/Login');
      },
      error: (err: any) => {
        console.error('Full Error:', err); // 👈 طباعة الخطأ بالكامل
        console.error('Server Response:', err.error); // 👈 طباعة الـ response من الخادم

        // عرض رسالة الخطأ إذا كانت موجودة، أو رسالة افتراضية
        const errorMessage = err.error?.message || err.error?.title || 'Registration failed. Please try again.';
        this.toast.error(errorMessage, 'ERROR');
      },
    });
  }
}
  // أضف هذه الدالة لميزة إظهار/إخفاء كلمة المرور
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
}
