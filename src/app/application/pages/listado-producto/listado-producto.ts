import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../utils/models/producto.model';
import { ProductosService } from '../../utils/services/productos.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  selector: 'app-listado-producto',
  standalone: true,
  templateUrl: './listado-producto.html',
  styleUrls: ['./listado-producto.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, Modal],
})
export class ListadoProducto implements OnInit {
  router = inject(Router);
  productosService = inject(ProductosService);
  cdr = inject(ChangeDetectorRef);

  itemProd: Producto[] = [];
  productos: Producto[] = [];

  dataPaginada: Producto[] = [];

  pageSizeOptions: number[] = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;

  menuAbierto: string | null = null;
  searchQuery: string | null = null;

  productoSelect: Producto = new Producto();

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (response: any) => {
        this.itemProd = [...response.data];
        this.productos = [...response.data];
        this.currentPage = 1;

        this.paginacionProductos();

        this.cdr.detectChanges();
      },
      error: () => {
        console.error('Servicio no disponible');
      },
    });
  }

  filtrarReportes() {
    const q = this.searchQuery?.toLowerCase().trim() ?? '';

    if (!q) {
      this.productos = [...this.itemProd];
      this.currentPage = 1;
      this.paginacionProductos();
      return;
    }

    this.productos = this.itemProd.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.logo.toLowerCase().includes(q) ||
        item.id.toString().includes(q)
    );

    this.currentPage = 1;
    this.paginacionProductos();
  }

  paginacionProductos() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.dataPaginada = [...this.productos.slice(start, end)];
  }

  get totalPages() {
    return Math.ceil(this.productos.length / this.pageSize);
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.paginacionProductos();
  }

  redirigirRuta(ruta: string) {
    this.router.navigate(['/' + ruta]);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginacionProductos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginacionProductos();
    }
  }

  toggleMenu(id: string) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  @HostListener('document:click', ['$event'])
  clickFuera(event: Event) {
    const target = event.target as HTMLElement;
    const dentroDropdown = target.closest('.dropdown');
    // si se hace clic fuera de cualquier dropdown → cerrar
    if (!dentroDropdown) {
      this.menuAbierto = null;
    }
  }

  editar(product: Producto) {
    this.menuAbierto = null;
    this.redirigirRuta('editar_producto/' + product.id);
  }

  eliminar(product: Producto) {
    this.menuAbierto = null;
    this.productoSelect = product;
  }

  confirmacion(event: boolean) {
    if (event) {
      this.productosService.deleteProduct(this.productoSelect.id).subscribe(
        (response: any) => {
          console.log('data ' + response);
          this.cargarProductos();
        },
        (error) => {
          console.error('Servicio no disponible, inténtelo más tarde.');
        }
      );
    }
  }
}
