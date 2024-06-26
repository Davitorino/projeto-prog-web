import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CONSTANTS } from 'src/shared/constants';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  @Input() userData: FormGroup;
  @Input() isEdition: boolean = false;
  @Output() userDataChange = new EventEmitter<FormGroup>();

  readonly fieldName = CONSTANTS.FIELD_USER_NAME;
  readonly fieldUsername = CONSTANTS.FIELD_USER_USERNAME;
  readonly fieldPassword = CONSTANTS.FIELD_USER_PASSWORD;
  readonly fieldConfirmPassword = CONSTANTS.FIELD_USER_CONFIRM_PASSWORD;

  showPassword = false;
  _disableFields = false;

  constructor(private formBuilder: FormBuilder) {
  }

  @Input() set disableFields(disable: boolean) {
    this._disableFields = disable;
    disable ? this.userData?.disable() : this.userData?.enable();
  }

  public ngOnInit(): void {
    this.initUserData();
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private initUserData(): void {
    if (this.userData) return;
    this.userData = this.formBuilder.group({
      [this.fieldName]: [{value: '', disabled: this._disableFields}, Validators.required],
      [this.fieldUsername]: [{value: '', disabled: this._disableFields}, Validators.required],
      [this.fieldPassword]: [{value: '', disabled: this._disableFields}, [this.passwordRequiredValidator.bind(this), this.passwordValidator.bind(this)]],
      [this.fieldConfirmPassword]: [{value: '', disabled: this._disableFields}, [this.passwordRequiredValidator.bind(this), this.confirmPasswordValidator.bind(this)]],
    });
    this.userDataChange.emit(this.userData);
  }

  private passwordValidator(): void {
    const validation = this.confirmPasswordValidator(this.userData?.get(this.fieldConfirmPassword));
    this.userData?.get(this.fieldConfirmPassword).setErrors(validation);
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors {
    if (this.userData?.get(this.fieldPassword).value === control?.value) {
      return null;
    }
    return {differentPassword: true};
  }

  private passwordRequiredValidator(control: AbstractControl): ValidationErrors {
    if (this.isEdition) {
      return null;
    }
    return Validators.required(control);
  }
}
