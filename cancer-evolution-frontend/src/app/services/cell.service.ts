import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CellService {
  api: string = 'http://localhost:3000/cell';

  constructor(private httpClient: HttpClient) {}

  prepareForNewSimulation() {
    return this.httpClient.delete(`${this.api}/prepare-for-new-simulation`);
  }
}
