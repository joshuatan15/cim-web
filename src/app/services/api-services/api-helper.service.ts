import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  constructor(
    private http: HttpClient,
  ) { }

  private async get(url: string, params?: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(url, params).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.error('GET: Error: ', err);
          reject(err);
        });
    });
  }

  private async post(url: string, body?: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(url, body, headers).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.error('POST: Error: ', err);
          reject(err);
        });
    });
  }

  private async put(url: string, body?: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(url, body, headers).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.error('PUT: Error: ', err);
          reject(err);
        });
    });
  }

  private async delete(url: string, body?: any) {
    return new Promise((resolve, reject) => {
      this.http.delete(url, body).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.error('DELETE: Error: ', err);
          reject(err);
        });
    });
  }

  toQuery(obj: any): string {
    return Object.keys(obj)
      .map(k => `${k}=${encodeURIComponent(obj[k])}`)
      .join('&');
  }

  async createCustomer(userJSON) {
    return await this.post(API_URL.customer, userJSON);
  }

  async updateCustomer(userJSON, userId) {
    return await this.put(`${API_URL.customer}/${userId}`, userJSON);
  }

  async approveCustomer(userJSON) {
    return await this.post(`${API_URL.customer}/approve`, userJSON);
  }

  async searchCustomer(filter: any): Promise<any> {
    const req = this.toQuery(filter);
    return await this.get(`${API_URL.customer}/search?${req}`);
  }

  async rejectCustomer(userJSON) {
    return await this.post(`${API_URL.customer}/reject`, userJSON);
  }

  async deleteCustomer(id: number) {
    return await this.delete(`${API_URL.customer}/${id}`);
  }
}
