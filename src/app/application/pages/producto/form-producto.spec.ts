import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProducto } from './form-producto';
import { Producto } from '../../utils/models/producto.model';
import { of, throwError } from 'rxjs';
import { ProductosService } from '../../utils/services/productos.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

describe('FormProducto', () => {
  let component: FormProducto;
  let fixture: ComponentFixture<FormProducto>;

  const mockProducto: Producto = {
    id: 'uno',
    name: 'Jabones',
    description: 'Jabón líquido de manos',
    logo: 'https://logo.png',
    date_release: new Date('2025-09-25'),
    date_revision: new Date('2026-09-25'),
  };

  const mockProductosService = {
    getProductos: jasmine.createSpy('getProductos').and.returnValue(of([mockProducto])),
    createProductos: jasmine.createSpy('createProductos').and.returnValue(of(mockProducto)),
    updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of(mockProducto)),
    verifyIDProduct: jasmine.createSpy('verifyIDProduct').and.returnValue(of(true)),
  };

  class ComponentTestRoute {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormProducto, // componente standalone
        RouterTestingModule.withRoutes([{ path: 'productos', component: ComponentTestRoute }]),
      ],
      providers: [{ provide: ProductosService, useValue: mockProductosService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProducto);
    component = fixture.componentInstance;

    component.ingresoForm = new FormBuilder().group({
      id: [''],
      nombre: [''],
      descripcion: [''],
      logo: [''],
      fechaLiberacion: [''],
      fechaRevision: [''],
    });

    fixture.detectChanges(); // dispara ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('deberia llamar a cargarProductos si idProducto es no null', () => {
    component.idProducto = 'uno';

    spyOn(component, 'cargarProductos');
    component.ngOnInit();

    expect(component.cargarProductos).toHaveBeenCalled();
  });

  it('deberia inicializar el fomr con valores default', () => {
    component.ingresoForm.patchValue({
      id: mockProducto.id,
      nombre: mockProducto.name,
      descripcion: mockProducto.description,
      logo: mockProducto.logo,
      fechaLiberacion: mockProducto.date_release,
      fechaRevision: mockProducto.date_revision,
    });

    const form = component.ingresoForm;
    expect(form.get('id')?.value).toBe(mockProducto.id);
    expect(form.get('nombre')?.value).toBe(mockProducto.name);
  });

  it(' deberia markar el fomr como invalid is el campo es requerido', () => {
    component.ingresoForm.get('nombre')?.setValue('');
    expect(component.ingresoForm.valid).toBeFalse();
  });

  it('deberia llamar a ingresarProducto cuando es llamado para guarda un nuevo porducto', () => {
    component.idProducto = null; // nuevo producto
    component.ingresoForm.setValue({
      id: 'dos',
      nombre: 'Botella',
      descripcion: 'Botella de plástico',
      logo: 'https://logo2.png',
      fechaLiberacion: new Date('2025-09-26'),
      fechaRevision: new Date('2026-09-26'),
    });

    component.idValido = true;

    component.guardar();

    expect(mockProductosService.createProductos).toHaveBeenCalled();
  });

  it('deberia llamar a limpiarForm cuando es success', () => {
    mockProductosService.createProductos.and.returnValue(of({ data: 'ok' }));
    spyOn(component, 'limpiarForm');

    component.ingresarProducto(mockProducto);

    expect(mockProductosService.createProductos).toHaveBeenCalledWith(mockProducto);
    expect(component.limpiarForm).toHaveBeenCalled();
  });

  it('deberia mostrar log error si el servicio createProductos falla', () => {
    mockProductosService.createProductos.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.ingresarProducto(mockProducto);

    expect(console.error).toHaveBeenCalledWith('Servicio no disponible, inténtelo más tarde.');
  });

  it('deberia poner idValido true cuanso es sucess', () => {
    mockProductosService.verifyIDProduct.and.returnValue(of(true));
    component.ingresoForm.get('id')?.setValue('uno');

    component.consultarIdValido();

    expect(mockProductosService.verifyIDProduct).toHaveBeenCalledWith('uno');
    expect(component.idValido).toBeTrue();
  });

  it('deberia mostrar log error si servicio consultarIdValido falla', () => {
    mockProductosService.verifyIDProduct.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.ingresoForm.get('id')?.setValue('uno');
    component.consultarIdValido();

    expect(mockProductosService.verifyIDProduct).toHaveBeenCalledWith('uno');
    expect(console.error).toHaveBeenCalledWith('Servicio no disponible, inténtelo más tarde.');
  });

  it('deberia llamar a editarProducto cuando el producto exite', () => {
    component.idProducto = 'uno'; // producto existente
    component.ingresoForm.setValue({
      id: mockProducto.id,
      nombre: mockProducto.name,
      descripcion: mockProducto.description,
      logo: mockProducto.logo,
      fechaLiberacion: mockProducto.date_release,
      fechaRevision: mockProducto.date_revision,
    });

    component.guardar();

    expect(mockProductosService.updateProduct).toHaveBeenCalledWith('uno', jasmine.any(Object));
  });

  it('deberia mostrar log error si el servicio updateProduct falla', () => {
    mockProductosService.updateProduct.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.editarProducto(mockProducto);

    expect(console.error).toHaveBeenCalledWith('Servicio no disponible, inténtelo más tarde.');
  });

  it('deberia filtrar el producto y ññenar form cuando el producto es encontrado', () => {
    const productosMock: Producto[] = [
      {
        id: 'uno',
        name: 'jabones',
        description: 'Jabones',
        logo: '',
        date_release: new Date('2025-09-25'),
        date_revision: new Date('2026-09-25'),
      },
      {
        id: 'dos',
        name: 'botellas',
        description: 'Botella',
        logo: '',
        date_release: new Date('2025-09-26'),
        date_revision: new Date('2026-09-26'),
      },
    ];

    component.idProducto = 'dos';

    mockProductosService.getProductos.and.returnValue(of({ data: productosMock }));

    component.cargarProductos();

    expect(component.productos).toEqual(productosMock);
    expect(component.producto.name).toBe('botellas');
    expect(component.ingresoForm.get('id')?.value).toBe('dos');
    expect(component.ingresoForm.get('id')?.disabled).toBeTrue();
    expect(component.ingresoForm.get('nombre')?.value).toBe('botellas');
  });

  it('deberia mostrar log error si el servicio getProductos falla', () => {
    mockProductosService.getProductos.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.cargarProductos();

    expect(console.error).toHaveBeenCalledWith('Servicio no disponible, inténtelo más tarde.');
  });

  it('deberia resetear el form', () => {
    component.limpiarForm();

    const formValues = component.ingresoForm.value;
    expect(formValues.id).toBeNull();
    expect(formValues.nombre).toBeNull();
    expect(formValues.descripcion).toBeNull();
    expect(formValues.logo).toBeNull();
    expect(formValues.fechaLiberacion).toBeNull();
    expect(formValues.fechaRevision).toBeNull();
  });

  it('deberia navegr a la ruta correcta', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.redirigirRuta('productos');
    expect(router.navigate).toHaveBeenCalledWith(['/productos']);
  });
});
