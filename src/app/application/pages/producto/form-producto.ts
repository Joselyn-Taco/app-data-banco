import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../utils/services/productos.service';
import { Producto } from '../../utils/models/producto.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './form-producto.html',
  styleUrl: './form-producto.scss',
})
export class FormProducto {
  router = inject(Router);
  fb = inject(FormBuilder);
  productosService = inject(ProductosService);
  route = inject(ActivatedRoute);

  minDate: string = '';
  ingresoForm!: FormGroup;
  producto: Producto = new Producto();
  idValido: boolean = true;
  mensajeError: string = '';

  idProducto: string | null = '';
  productos: Producto[] = [];

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.idProducto = params.get('id');
    });
  }

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // yyyy-MM-dd
    this.inicializarForms();
    if (this.idProducto != null) {
      this.cargarProductos();
    }
  }

  inicializarForms() {
    this.ingresoForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [null, Validators.required],
      fechaLiberacion: ['', Validators.required],
      fechaRevision: [{ disabled: true }, Validators.required],
    });

    this.ingresoForm.get('fechaLiberacion')?.valueChanges.subscribe((valor) => {
      if (valor) {
        const inicio = new Date(valor);
        const fin = new Date(inicio);
        fin.setFullYear(inicio.getFullYear() + 1);
        const finStr = fin.toISOString().split('T')[0];
        this.ingresoForm.get('fechaRevision')?.setValue(finStr);
      } else {
        this.ingresoForm.get('fechaRevision')?.setValue('');
      }
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.ingresoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe(
      (response: any) => {
        console.log('data ' + response.data);
        this.productos = response.data; // array completo
        this.producto = new Producto();

        const productoEncontrado = this.productos.find((p) => p.id === this.idProducto);
        if (productoEncontrado) {
          Object.assign(this.producto, productoEncontrado);
          this.ingresoForm.get('id')?.setValue(this.producto.id);
          this.ingresoForm.get('nombre')?.setValue(this.producto.name);
          this.ingresoForm.get('descripcion')?.setValue(this.producto.description);
          this.ingresoForm.get('logo')?.setValue(this.producto.logo);
          this.ingresoForm.get('fechaLiberacion')?.setValue(this.producto.date_release);
          this.ingresoForm.get('fechaRevision')?.setValue(this.producto.date_revision);

          this.ingresoForm.get('id')?.disable();
        }
        console.log('Entronco produ: ' + this.producto.name);
      },
      (error) => {
        console.error('Servicio no disponible, inténtelo más tarde.');
      }
    );
  }

  ingresarProducto(registroProd: Producto) {
    this.productosService.createProductos(registroProd).subscribe(
      (response: any) => {
        console.log('data ' + response);
        this.limpiarForm();
      },
      (error) => {
        console.error('Servicio no disponible, inténtelo más tarde.');
      }
    );
  }

  editarProducto(registroProd: Producto) {
    let idProd: string = this.idProducto ?? '';
    this.productosService.updateProduct(idProd, registroProd).subscribe(
      (response: any) => {
        console.log('data ' + response);
        this.limpiarForm();
      },
      (error) => {
        console.error('Servicio no disponible, inténtelo más tarde.');
      }
    );
  }

  consultarIdValido() {
    this.productosService.verifyIDProduct(this.ingresoForm.get('id')?.value).subscribe(
      (response: any) => {
        console.log('data ' + response);
        this.idValido = response;
      },
      (error) => {
        console.error('Servicio no disponible, inténtelo más tarde.');
      }
    );
  }

  guardar() {
    if (this.ingresoForm.valid) {
      this.producto = new Producto();
      this.producto.id = this.ingresoForm.get('id')?.value;
      this.producto.name = this.ingresoForm.get('nombre')?.value;
      this.producto.description = this.ingresoForm.get('descripcion')?.value;
      this.producto.logo = this.ingresoForm.get('logo')?.value;
      this.producto.date_release = this.ingresoForm.get('fechaLiberacion')?.value;
      this.producto.date_revision = this.ingresoForm.get('fechaRevision')?.value;

      console.log('producto ' + this.producto);
      if (this.idProducto == null) {
        this.consultarIdValido();
        if (this.idValido) {
          this.ingresarProducto(this.producto);
        } else {
          this.mensajeError = 'ID invalido';
        }
      } else {
        this.editarProducto(this.producto);
      }
    } else {
      console.log('Formulario inválido ❌');
      this.ingresoForm.markAllAsTouched(); // fuerza mostrar errores
    }
  }

  limpiarForm() {
    this.ingresoForm.reset();
  }

  redirigirRuta(ruta: string) {
    this.router.navigate(['/' + ruta]);
  }
}
