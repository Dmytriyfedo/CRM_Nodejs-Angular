import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.services';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy{

  form: FormGroup

  aSub: Subscription

  constructor(private auth: AuthService,
              private router: Router) {

  }
  ngOnDestroy(): void {
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])

    })

  }

  onSubmit() {
    this.form.disable(),
      this.aSub = this.auth.register(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/login'],{
            queryParams:{
              registered: true
            }})
        },
        error: (error) => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      }
    )
  }
}
