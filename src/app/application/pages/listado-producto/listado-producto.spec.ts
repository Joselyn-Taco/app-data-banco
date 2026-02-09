import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoProducto } from './listado-producto';
import { ProductosService } from '../../utils/services/productos.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ListadoProducto', () => {
  let component: ListadoProducto;
  let fixture: ComponentFixture<ListadoProducto>;

  const productosMock = [
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
    {
      id: 'tres',
      name: 'lapicero',
      description: 'Lapices',
      logo: '',
      date_release: new Date('2025-09-27'),
      date_revision: new Date('2026-09-27'),
    },
  ];

  let productosServiceMock = {
    getProductos: jasmine.createSpy('getProductos').and.returnValue(of({ data: productosMock })),
    deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(of({ data: 'ok' })),
  };

  class ComponentTestRoute {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListadoProducto,
        RouterTestingModule.withRoutes([
          { path: 'ingreso_producto', component: ComponentTestRoute },
          { path: 'editar_producto/', component: ComponentTestRoute },
        ]),
      ], // 👈 standalone
      providers: [{ provide: ProductosService, useValue: productosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoProducto);
    component = fixture.componentInstance;

    component.itemProd = [...productosMock];
    component.productos = [...productosMock];
    component.currentPage = 3;
    component.pageSize = 2;

    fixture.detectChanges(); // dispara ngOnInit
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los productos al iniciar', () => {
    expect(component.productos.length).toBe(3);
    expect(component.itemProd.length).toBe(3);
  });

  it('deberia navegr a la ruta correcta', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.redirigirRuta('editar_producto');
    expect(router.navigate).toHaveBeenCalledWith(['/editar_producto']);
  });

  it('deberia copiar todos los productos if searchQueary es empty', () => {
    component.searchQuery = ''; // vacío
    spyOn(component, 'paginacionProductos');

    component.filtrarReportes();

    expect(component.productos).toEqual(productosMock); // todos los productos
    expect(component.currentPage).toBe(1);
    expect(component.paginacionProductos).toHaveBeenCalled();
  });

  it('deberia omitir mayusculas y minusculas y recortar searchQuery', () => {
    component.searchQuery = '  jabones  '; // vacío
    spyOn(component, 'paginacionProductos');

    component.filtrarReportes();

    expect(component.productos.length).toBe(1);
    expect(component.productos[0].name).toBe('jabones');
  });

  it('deberia paginar correctamente la ultima pagina', () => {
    component.currentPage = 2;
    component.paginacionProductos();
    expect(component.dataPaginada.length).toBe(1);
    expect(component.dataPaginada[0].id).toBe('tres');
  });

  it('debería paginar los productos correctamente', () => {
    component.pageSize = 1;
    component.paginacionProductos();

    expect(component.dataPaginada.length).toBe(1);
    expect(component.dataPaginada[0].name).toBe('jabones');
  });

  it('deberia cambiar el length de productos por pagina', () => {
    component.pageSize = 2;

    spyOn(component, 'paginacionProductos').and.callFake(() => {
      component.dataPaginada.length = 3;
    });

    component.changePageSize(3);
    expect(component.pageSize).toBe(3);
    expect(component.currentPage).toBe(1);
    expect(component.paginacionProductos).toHaveBeenCalled();
  });

  it('deberia ir a la siguiente pagina', () => {
    component.currentPage = 1;

    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('deberia ir a la pagina anterior', () => {
    component.currentPage = 2;

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('deberia abrir el menu if menuAbierto es diferente', () => {
    component.menuAbierto = 'uno';
    component.toggleMenu('dos');

    expect(component.menuAbierto).toBe('dos');
  });

  it('deberia cerrar el menu if menuAbierto es igual', () => {
    component.menuAbierto = 'dos';
    component.toggleMenu('dos');

    expect(component.menuAbierto).toBeNull();
  });

  it('deberia cerrar el menu y llamar a redirigirRuta', () => {
    component.menuAbierto = 'uno';
    const spy = spyOn(component, 'redirigirRuta');

    const product = {
      id: 'uno',
      name: 'jabones',
      description: 'Jabones',
      logo: '',
      date_release: new Date('2025-09-25'),
      date_revision: new Date('2026-09-25'),
    };

    component.editar(product);

    expect(component.menuAbierto).toBeNull();
    expect(spy).toHaveBeenCalledWith('editar_producto/uno');
  });

  it('deberia poner menu en null y asigar el producto a productoSelect', () => {
    component.menuAbierto = 'menu1';

    component.eliminar(productosMock[0]);

    expect(component.menuAbierto).toBeNull();
    expect(component.productoSelect).toBe(productosMock[0]);
  });

  it('deberia llamar a deleteProduct  y volver a cargar los productos restantes', () => {
    spyOn(component, 'cargarProductos');

    component.confirmacion(true);

    expect(productosServiceMock.deleteProduct).toHaveBeenCalledWith('');
    expect(component.cargarProductos).toHaveBeenCalled();
    expect(component.dataPaginada.length).toBe(2);
  });
});
