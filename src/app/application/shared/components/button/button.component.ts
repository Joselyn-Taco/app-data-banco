import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ButtonComponent {
  @Input() label: string = 'Click';
  @Input() size: string = '14px';
  @Input() customClass: string = 'btn_default';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit(); // emite el evento hacia el padre
  }
}
