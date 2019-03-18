import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresentationStyles } from '@blueriq/core';
import { BqIconDirective } from '@shared/directive/icon/icon.directive';

@Component({
  template: '<i [bqIcon]="styles"></i>',
})
export class MockIconComponent {

  styles: PresentationStyles;

  constructor() {
    this.styles = new PresentationStyles(['some_presentationstyle', 'icon_my_awesome_icon']);
  }
}

describe('Icon Directive', () => {

  let component: MockIconComponent;
  let fixture: ComponentFixture<MockIconComponent>;
  let element: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockIconComponent, BqIconDirective],
    });
    fixture = TestBed.createComponent(MockIconComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should use the given presentationstyles to pick the correct icon and rename if necessary', () => {
    const iconContainer = element.querySelector('i');
    expect(iconContainer.classList).not.toContain('some_presentationstyle', 'only icon_ prefixed presentation styles should have been used');
    expect(iconContainer.classList).toContain('fa', 'for fontawesome to work, "fa" class only should have also been added');
    expect(iconContainer.classList).toContain('fa-my-awesome-icon', 'should have replaced the _ with - and have stripped the icon_ prefix');
  });

});
