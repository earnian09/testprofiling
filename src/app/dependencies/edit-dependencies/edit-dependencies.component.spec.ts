import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDependenciesComponent } from './edit-dependencies.component';

describe('EditDependenciesComponent', () => {
  let component: EditDependenciesComponent;
  let fixture: ComponentFixture<EditDependenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDependenciesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDependenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
