import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;

  constructor(private _snackBar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef) { 
    this.firebasetsAuth = new FirebaseTSAuth();
  }

  ngOnInit(): void { 
  }

  onResetClick (resetEmail: HTMLInputElement) {
    let email = resetEmail.value;

    if(this.isNotEmpty(email)) {
      this.firebasetsAuth.sendPasswordResetEmail({
        email: email,
        onComplete: (err) => {
          this.bottomSheetRef.dismiss();

          // this.openSnackBar(`Reset email sent to ${email}`);
        }
      });
    }
  }

  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
    ) {
    let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email) && this.isNotEmpty(password)) {
      this.firebasetsAuth.signInWith({
        email: email,
        password: password,
        onComplete: (uc) => {
          this.bottomSheetRef.dismiss();

          // this.openSnackBar('Logged in');
        },
        onFail: (err) => {
          this.openSnackBar(err);
        }
      });
    }
  }

  onRegisterClick(
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ) {
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;
    
    if(
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isMatch(password, confirmPassword)
      ) {
      this.firebasetsAuth.createAccountWith({
        email: email,
        password: password,
        onComplete: (uc) => {
          this.bottomSheetRef.dismiss();

          // this.openSnackBar('Account successfully created');
          // registerEmail.value = '';
          // registerPassword.value = '';
          // registerConfirmPassword.value = '';
        },
        onFail: (err) => {
          this.openSnackBar('Failed to create account')
        }
      });
    }
  }

  isNotEmpty(text: string) {    
    return text != null && text.length > 0;
  }

  isMatch(text: string, comparedWith: string) {
    return text == comparedWith;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close');
  }

  onForgotPasswordClick() {
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick() {
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick() {
    this.state = AuthenticatorCompState.LOGIN;
  }

  isLoginState() {
    return this.state === AuthenticatorCompState.LOGIN;
  }

  isRegisterState() {
    return this.state === AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState() {
    return this.state === AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStateText() {
    switch (this.state) {
      case AuthenticatorCompState.LOGIN:
        return "Login";
      case AuthenticatorCompState.REGISTER:
        return "Register";
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Forgot Password";
    }
  }
}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
