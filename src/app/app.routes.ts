import { Routes } from '@angular/router';
import { ListadoProducto } from './application/pages/listado-producto/listado-producto';
import { FormProducto } from './application/pages/producto/form-producto';

export const routes: Routes = [
  { path: '', component: ListadoProducto }, // <- RUTA PRINCIPAL
  { path: 'ingreso_producto', component: FormProducto },
  { path: 'editar_producto/:id', component: FormProducto },
  { path: '**', redirectTo: '' }, // <- REDIRIGE cualquier ruta no válida al home
];
