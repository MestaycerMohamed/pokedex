import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { StatNamePipe } from '../pipes/stat-name.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let httpService: HttpService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        StatNamePipe,
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [
        HttpService
      ],
    })
    .compileComponents();
    httpService = TestBed.inject(HttpService);

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate when nameId is provided', () => {
    component.nameId = 'pikachu';
    const routerSpy = spyOn(component.router, 'navigate');
    component.search();
    expect(routerSpy).toHaveBeenCalledWith(['pokemon', 'pikachu']);
  });

  it('should navigate to a random pokemon', () => {
    const routerSpy = spyOn(component.router, 'navigate');
    component.navigate({ count: 100 });
    expect(routerSpy).toHaveBeenCalledOnceWith(['pokemon', jasmine.any(Number)]);
  });

  it('should get All Pokemon Species', fakeAsync(() => {
    const mockData = { count: 100 };
    spyOn(httpService, 'getAllPokemonSpecies').and.returnValue(of(mockData));
    spyOn(component, 'navigate');
    component.random();
    tick();
    expect(component.navigate).toHaveBeenCalledWith(mockData);
  }));
});
