import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment.prod';

describe('HttpService', () => {
  let httpService: HttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    httpService = TestBed.inject(HttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(httpService).toBeTruthy();
  });

  it('should retrieve Pokemon data', () => {
    const nameId = 'pikachu';
    const mockData = { };

    httpService.getPokemon(nameId).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/pokemon/${nameId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should retrieve Pokemon species data', () => {
    const nameId = 'pikachu';
    const mockData = { };

    httpService.getPokemonSpecies(nameId).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/pokemon-species/${nameId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should retrieve All Pokemon species data', () => {
    const mockData = { };

    httpService.getAllPokemonSpecies().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/pokemon-species`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should retrieve All Pokemon species data', () => {
    const mockData = { };
    const url = "url";
    httpService.getEvolutionChain(url).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
