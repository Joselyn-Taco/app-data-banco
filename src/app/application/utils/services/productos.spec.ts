import { TestBed } from '@angular/core/testing';
import { ProductosService } from './productos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Producto } from '../models/producto.model';

describe('ProductosService', () => {
  let service: ProductosService;
  let httpMock: HttpTestingController;

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

  const mockProducto: Producto = {
    id: 'uno',
    name: 'Jabones',
    description: 'Jabón líquido de manos',
    logo: 'https://logo.png',
    date_release: new Date('2025-09-25'),
    date_revision: new Date('2026-09-25'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductosService],
    });

    service = TestBed.inject(ProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  it('deberia llamr a GET /bp/products con headers correctos', () => {
    service.getProductos().subscribe((res) => {
      expect(res).toEqual(productosMock);
    });

    const req = httpMock.expectOne(environment.SERVICE_INTERVIEW + '/bp/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(productosMock); // Simula la respuesta del servidor
  });

  it('deberia llamr a POST /bp/products con headers correctos', () => {
    const mockResponse = { success: true };
    service.createProductos(mockProducto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.SERVICE_INTERVIEW + '/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProducto);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse); // Simula la respuesta del servidor
  });

  it('deberia llamr a GET verifyIDProduct con headers correctos', () => {
    const idProduct = 'uno';
    const mockResponse = { valid: true };
    service.verifyIDProduct(idProduct).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      environment.SERVICE_INTERVIEW + '/bp/products/verification/' + idProduct
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse); // Simula la respuesta del servidor
  });

  it('deberia llamr PUT /bp/products/{id} con headers correctos y body', () => {
    const idProduct = 'uno';
    const mockResponse = { success: true };

    service.updateProduct(idProduct, mockProducto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.SERVICE_INTERVIEW + '/bp/products/' + idProduct);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProducto);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse); // Simula la respuesta del servidor
  });

  it('deberia llamr DELETE /bp/products/{id} con headers correctos', () => {
    const idProduct = 'uno';
    const mockResponse = { success: true };

    service.deleteProduct(idProduct).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.SERVICE_INTERVIEW + '/bp/products/' + idProduct);

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse); // Simula la respuesta del servidor
  });
});
