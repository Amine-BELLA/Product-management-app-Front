import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import {MessageModule} from "primeng/message";

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, InputTextareaModule, ButtonModule, MessageModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  submitted = false;

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [
      Validators.required,
      Validators.maxLength(300)
    ])
  });

  constructor(private messageService: MessageService) {}

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitted = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Demande de contact envoyée avec succès'
      });
    }
  }

  newMessage() {
    this.contactForm.reset();
    this.submitted = false;
    this.contactForm.markAsUntouched();
  }
}
