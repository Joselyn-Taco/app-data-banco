import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../models/producto.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  httpClient = inject(HttpClient);

  public getProductos() {
    let config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return this.httpClient.get(environment.SERVICE_INTERVIEW + '/bp/products', config);
  }

  public createProductos(product: Producto) {
    let config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return this.httpClient.post(environment.SERVICE_INTERVIEW + '/bp/products', product, config);
  }

  public verifyIDProduct(idProduct: string) {
    let config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return this.httpClient.get(
      environment.SERVICE_INTERVIEW + '/bp/products/verification/' + idProduct,
      config
    );
  }

  public updateProduct(idProduct: string, product: Producto) {
    let config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return this.httpClient.put(
      environment.SERVICE_INTERVIEW + '/bp/products/' + idProduct,
      product,
      config
    );
  }

  public deleteProduct(idProduct: string) {
    let config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return this.httpClient.delete(
      environment.SERVICE_INTERVIEW + '/bp/products/' + idProduct,
      config
    );
  }
}
