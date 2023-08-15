import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ResultComponent } from './result.component';
import { StatNamePipe } from '../pipes/stat-name.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { HttpService } from '../services/http.service';
import { colors } from '../data/colors';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let httpService: HttpService;
  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('someNameOrId'),
        },
      },
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    
    

    await TestBed.configureTestingModule({
      declarations: [
        ResultComponent,
        StatNamePipe,
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        HttpService
      ],
    })
    .compileComponents();
    httpService = TestBed.inject(HttpService);
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to notFoundPage if name or id is not provided', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
  });

  it('should get lowercase nameid and call getPokemonData if name or id is provided', () => {
    const spy = spyOn(component, 'getPokemonData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.nameid).toBe('somenameorid');
  });

  it('should call putPokemonData on successful data retrieval', fakeAsync(() => {
    const mockData = { id : 10, name : "Pikachu" };
    spyOn(httpService, 'getPokemon').and.returnValue(of(mockData));
    spyOn(component, 'setPokemonData');
    component.getPokemonData();
    tick();
    expect(component.setPokemonData).toHaveBeenCalledWith(mockData);

    component.nameid = null;
    component.getPokemonData();
    tick();
    expect(httpService.getPokemon).toHaveBeenCalledWith("");
  }));

  it('should correctly set Pokemon data', () => {
    const color = "#F7CF43";
    spyOn(component, 'getPokemonSpeciesData');
    spyOn(component, 'setImgUrl');
    spyOn(component, 'setPokemonStats');
    spyOn(component, 'getcolorfromcolorslist').and.returnValue(color);
    
    const mockData = {
      name: 'Pikachu',
      id: 25,
      types: [{ type: { name: 'electric' } }],
    };

    component.setPokemonData(mockData);

    expect(component.pokemon.name).toBe('Pikachu');
    expect(component.pokemon.id).toBe(25);
    expect(component.pokemon.types).toEqual([{ type: { name: 'electric' } }]);
    expect(component.pokemon.color).toEqual(color);
  });

  it('should call getPokemonSpeciesData and setImgUrl and setPokemonStats', () => {
    spyOn(component, 'getPokemonSpeciesData');
    spyOn(component, 'setImgUrl');
    spyOn(component, 'setPokemonStats');

    const mockData = { name: 'Pikachu', id: 25, };
    component.setPokemonData(mockData);

    expect(component.getPokemonSpeciesData).toHaveBeenCalled();
    expect(component.setImgUrl).toHaveBeenCalledWith(mockData);
    expect(component.setPokemonStats).toHaveBeenCalledWith(mockData);
  });

  it('should correctly set Pokemon stats', () => {
    const mockData = {
      stats: [
        { stat: { name: 'hp' }, base_stat: 80 },
        { stat: { name: 'attack' }, base_stat: 100 },
      ],
    };
    component.setPokemonStats(mockData);
    expect(component.pokemon.stats).toEqual([
      { name: 'hp', value: 80 },
      { name: 'attack', value: 100 },
    ]);
  });

  it('should not modify pokemon.stats if stats data is not provided', () => {
    component.pokemon.stats = [{ name: 'hp', value: 80 }];
    const mockData = {stats: []};

    component.setPokemonStats(mockData);

    expect(component.pokemon.stats).toEqual([]);
  });


  it('should navigate to notFoundPage when pokemon id is not available', () => {
    component.pokemon.id = null;
    component.getPokemonSpeciesData();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
  });

  it('should call setPokemonSpeciesData on successful data retrieval', fakeAsync(() => {
    component.pokemon.id = 25;
    const mockData = { };
    spyOn(httpService, 'getPokemonSpecies').and.returnValue(of(mockData));
    spyOn(component, 'setPokemonSpeciesData');
    component.getPokemonSpeciesData();
    tick();
    expect(component.setPokemonSpeciesData).toHaveBeenCalled();
  }));

  it('should set Pokemon description', () => {
    const mockData = {
      flavor_text_entries: [
        { flavor_text: 'Description 1', language: { name: 'en' }, version: { name: 'alpha-sapphire' } },
      ],
    };

    component.setPokemonDescription(mockData);

    expect(component.pokemon.description).toBe('Description 1');
  });

  it('should set default description if no flavor text entries are available', () => {
    const mockData = {
      flavor_text_entries: [],
    };

    component.setPokemonDescription(mockData);

    expect(component.pokemon.description).toBe('no description available');
  });

  it('should call setPokemonEvols on successful evolution chain retrieval', fakeAsync(() => {
    const mockEvolutionData = {
      evolution_chain: { url: 'evolution-chain-url' },
    };
    spyOn(httpService, 'getEvolutionChain').and.returnValue(of(mockEvolutionData));
    spyOn(component, 'setPokemonDescription');
    spyOn(component, 'setPokemonEvols');

    component.setPokemonSpeciesData(mockEvolutionData);
    tick();
    expect(component.setPokemonDescription).toHaveBeenCalled();
    expect(component.setPokemonEvols).toHaveBeenCalled();
  }));

  it('should correctly set chain names recursively', () => {
    const mockEvolutionChain = {
      species: { name: 'pokemon1' },
      evolves_to: [
        {
          species: { name: 'pokemon2' },
          evolves_to: [
            { species: { name: 'pokemon3' }, evolves_to: [] },
          ],
        },
      ],
    };

    const chainNames = component.setChain(mockEvolutionChain.evolves_to, [mockEvolutionChain.species.name]);

    expect(chainNames).toEqual(['pokemon1', 'pokemon2', 'pokemon3']);
  });

  it('should set img URL and type from dream_world', () => {
    const mockData = {
      sprites: {
        other: {
          dream_world: {
            front_default: 'dream_world_url',
          },
        },
      },
    };

    component.setImgUrl(mockData);

    expect(component.imgUrl).toBe('dream_world_url');
    expect(component.imgType).toBe('svg');
  });

  it('should set img URL and type from home', () => {
    const mockData = {
      sprites: {
        other: {
          home: {
            front_default: 'home_url',
          },
        },
      },
    };

    component.setImgUrl(mockData);

    expect(component.imgUrl).toBe('home_url');
    expect(component.imgType).toBe('png');
  });

  it('should set img URL and type from official-artwork', () => {
    const mockData = {
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'official_url',
          },
        },
      },
    };

    component.setImgUrl(mockData);

    expect(component.imgUrl).toBe('official_url');
    expect(component.imgType).toBe('png');
  });

  it('should set img URL and type from default', () => {
    const mockData = {
      sprites: {
        front_default: 'default_url',
      },
    };

    component.setImgUrl(mockData);

    expect(component.imgUrl).toBe('default_url');
    expect(component.imgType).toBe('png');
  });

  it('should return style for active tab', () => {
    component.activeTab = 'STATS';
    component.pokemon.color = 'red';
    const result = component.getButtonTabStyle('STATS');

    expect(result).toEqual({
      'background-color': 'red',
      'color': 'white',
      'box-shadow': '0px 0px 10px 0px rgba(93, 190, 98, 0.70)',
    });
  });

  it('should return style for inactive tab', () => {
    component.activeTab = 'MOVES';
    component.pokemon.color = 'red';
    const result = component.getButtonTabStyle('STATS');

    expect(result).toEqual({
      'color': 'red',
      'background-color': 'white',
    });
  });

  it('should set activeTab correctly', () => {
    component.setActiveTab('MOVES');

    expect(component.activeTab).toBe('MOVES');

    component.setActiveTab('STATS');

    expect(component.activeTab).toBe('STATS');
  });

  it('should retrieve color from colors list', () => {
    let result = component.getcolorfromcolorslist('normal');
    expect(result).toBe('#A8A87B');
    result = component.getcolorfromcolorslist('water');
    expect(result).toBe('#559EDF');
    result = component.getcolorfromcolorslist('fire');
    expect(result).toBe('#EE803B');
  });

});
