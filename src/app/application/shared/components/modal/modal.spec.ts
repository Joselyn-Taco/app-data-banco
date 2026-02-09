import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modal } from './modal';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia emitir true y cerrar el modal cuuando click en Onaceptar', () => {
    spyOn(component.aceptar, 'emit');

    component.Onaceptar();

    expect(component.aceptar.emit).toHaveBeenCalledWith(true);
    expect(component.abierto).toBeFalse();
  });

  it('deberia emitir false y cerrar el modal cuuando click en Oncancelar', () => {
    spyOn(component.cancelar, 'emit');

    component.Oncancelar();

    expect(component.cancelar.emit).toHaveBeenCalledWith(false);
    expect(component.abierto).toBeFalse();
  });

  it('deberia tener por default titulo y mensaje', () => {
    const tituloEl = fixture.debugElement.nativeElement.querySelector('h2');
    const mensajeEl = fixture.debugElement.nativeElement.querySelector('p');

    expect(component.titulo).toBe('Confirmación');
    expect(component.mensaje).toBe('¿Estás seguro?');
  });
});
