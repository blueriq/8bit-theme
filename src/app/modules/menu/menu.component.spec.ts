import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSession } from '@blueriq/angular';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { ButtonTemplate, ContainerTemplate } from '@blueriq/core/testing';
import { BqContentStyles } from '../BqContentStyles';
import { MenuComponent } from './menu.component';
import { MenuModule } from './menu.module';

describe('MenuComponent', () => {
  let menu: ContainerTemplate;
  let btnPublicA: ButtonTemplate;
  let btnPublicB: ButtonTemplate;
  let component: ComponentFixture<MenuComponent>;
  let session: BlueriqTestSession;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BlueriqTestingModule,
        MenuModule,
      ],
    });
  }));

  beforeEach(() => {
    menu = ContainerTemplate.create().contentStyle(BqContentStyles.DASHBOARD_MENU);
    btnPublicA = ButtonTemplate.create('Public').caption('Public-A');
    btnPublicB = ButtonTemplate.create('Public').caption('Public-B');
    menu.children(
      ContainerTemplate.create().contentStyle('menubar').children(
        ButtonTemplate.create('Home').caption('Home'),
        ContainerTemplate.create().displayName('Unit').children(
          ButtonTemplate.create('Core').caption('Core'),
          ButtonTemplate.create('Finance').caption('Finance').disabled(true),
          ContainerTemplate.create().displayName('Public').children(
            btnPublicA,
            btnPublicB,
          ),
        ),
      ),
    );
    // reset field to default
    session = BlueriqSessionTemplate.create().build(menu);
    component = session.get(MenuComponent);
  });

  it(' buttons that are not a submenu should trigger the blueriq session pressed', () => {
    // init
    spyOn(BlueriqSession.prototype, 'pressed').and.callThrough();
    const directButtons = component.nativeElement.querySelectorAll('.nes-btn:not(.toggle)');
    expect(directButtons.length).toBe(1);

    // SIT
    directButtons[0].click();

    // Verify
    expect(BlueriqSession.prototype.pressed).toHaveBeenCalledTimes(1);
  });

  it('should display submenus when the menu button is clicked', () => {
    // init
    spyOn(BlueriqSession.prototype, 'pressed').and.callThrough();
    let bqMenus = component.nativeElement.querySelectorAll('bq-menu-item');
    const directButtons = component.nativeElement.querySelectorAll('.nes-btn.toggle');
    expect(directButtons.length).toBe(1);
    expect(bqMenus.length).toBe(2, 'without clicking on a button, 2 bq-menus are visible');

    // SIT
    directButtons[0].click();
    component.detectChanges();

    // Verify
    expect(BlueriqSession.prototype.pressed).not.toHaveBeenCalled();

    bqMenus = component.nativeElement.querySelectorAll('bq-menu-item');
    expect(bqMenus.length).toBe(5, 'after clicking on a button, 3 more bq-menus are visible');
    expect(bqMenus[0].querySelector('button').innerText).toBe('HOME');
    expect(bqMenus[1].querySelector('button').innerText).toBe('UNIT');
    expect(bqMenus[2].querySelector('button').innerText).toBe('CORE');
    expect(bqMenus[3].querySelector('button').innerText).toBe('FINANCE');
    expect(bqMenus[4].querySelector('button').innerText).toBe('PUBLIC');
  });
});
