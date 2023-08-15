import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show No Pokemon Found!', () => {
     const compiled = fixture.nativeElement as HTMLElement;
     expect(compiled.querySelector('label.noPokemonLabel')?.textContent).toContain('No Pokemon Found!');
     expect(compiled.querySelector('img')?.src).toContain('assets/img/404.png');
   });

});
