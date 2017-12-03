import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobadosComponent } from './aprobados.component';

describe('AprobadosComponent', () => {
  let component: AprobadosComponent;
  let fixture: ComponentFixture<AprobadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
