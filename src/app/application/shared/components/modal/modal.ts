import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  imports: [ButtonComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  @Input() titulo = 'Confirmación';
  @Input() mensaje = '¿Estás seguro?';

  @Output() aceptar = new EventEmitter<boolean>();
  @Output() cancelar = new EventEmitter<boolean>();

  abierto = true;

  Onaceptar() {
    this.aceptar.emit(true);
    this.abierto = false;
  }

  Oncancelar() {
    this.cancelar.emit(false);
    this.abierto = false;
  }
}
