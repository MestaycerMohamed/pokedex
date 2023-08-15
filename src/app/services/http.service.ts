import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getPokemon(nameId : string): Observable<any>{
    return this.http.get(environment.baseUrl + '/pokemon/'+nameId);
  }
  getPokemonSpecies(nameId : string): Observable<any>{
    return this.http.get(environment.baseUrl + '/pokemon-species/'+nameId);
  }
  getAllPokemonSpecies(): Observable<any>{
    return this.http.get(environment.baseUrl + '/pokemon-species');
  }
  getEvolutionChain(url : string): Observable<any>{
    return this.http.get(url);
  }
}
