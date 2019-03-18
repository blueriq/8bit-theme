import {
  Component,
  ElementRef,
  Host,
  HostListener,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BlueriqChild, BlueriqComponent } from '@blueriq/angular';
import { Button, Container, Field } from '@blueriq/core';
import { BqPresentationStyles } from '../BqPresentationStyles';

enum Direction {
  None = 0,
  Up = 1,
  Right = 2,
  Down = 3,
  Left = 4,
}

export enum GAMESTATE {
  hub,
  playing,
  gameover,
}

@Component({
  selector: 'bq-play-button',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
@BlueriqComponent({
  type: Container,
  selector: `.${BqPresentationStyles.GAME}`,
})
export class PlayComponent {

  /* Blueriq elements */
  @BlueriqChild(Button)
  saveButton: Button;

  @BlueriqChild(Field, '[dataType=number]', { exclude: true })
  scoreField: Field;

  /* The game */
  @ViewChild('hero')
  hero: ElementRef;

  @ViewChildren('figure')
  figures: QueryList<ElementRef>;

  @ViewChildren('figurex')
  specialFigures: QueryList<ElementRef>;

  // base / conf
  maxFigures = 300;
  baseSpeed = 10;
  maxTime = 6000;
  collidingClasses: string[] = ['nes-input', 'nes-btn', 'figure', 'special'];
  speed = this.baseSpeed;
  scorePerFigure = 2;

  // States
  GAMESTATE: typeof GAMESTATE = GAMESTATE;
  gameState: GAMESTATE = GAMESTATE.hub;
  directions: boolean[] = [false, false, false, false];
  collidables: Element[] = [];
  eventcountdown = 5;
  nonFigures = 0;
  progress = 0;
  countdown = this.maxTime;
  score = 0;

  constructor(@Host() public container: Container, private renderer: Renderer2) {
  }

  play(): void {
    // create figures -> collect them -> play
    this.clearFigures();
    this.createFigures();
    const clone = this.specialFigures.toArray()[0].nativeElement.cloneNode(false);
    this.createFigure(clone);
    this.collidables = this.collectCollidables();
    this.gameState = GAMESTATE.playing;
    this.nonFigures = this.collidables.length - this.maxFigures;
    setTimeout(() => {
      this.gameLoop();
    }, 500);
  }

  private gameLoop(): void {
    if (this.gameState === GAMESTATE.playing) {
      requestAnimationFrame(this.gameLoop.bind(this));
      this.moveHero();
      this.handleCollision();
      this.handleEvents();

      this.progress = (((this.collidables.length - this.nonFigures) / this.maxFigures) * 100);
      if (this.progress <= 10) {
        this.score += this.countdown / 40;
        this.gameover();
      }
      this.countdown -= 2;
    }
    if (this.countdown <= 0) {
      this.countdown = 0;
      this.gameover();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keydownEvent(event: KeyboardEvent) {
    if (this.gameState === GAMESTATE.playing) {
      event.preventDefault();
    }
    if (event.key === 'ArrowUp') {
      this.directions[Direction.Up] = true;
    }
    if (event.key === 'ArrowDown') {
      this.directions[Direction.Down] = true;
    }
    if (event.key === 'ArrowLeft') {
      this.directions[Direction.Left] = true;
    }
    if (event.key === 'ArrowRight') {
      this.directions[Direction.Right] = true;
    }
    if (event.key === ' ' /*space*/) {
      this.speed = this.baseSpeed + 6;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.directions[Direction.Up] = false;
    }
    if (event.key === 'ArrowDown') {
      this.directions[Direction.Down] = false;
    }
    if (event.key === 'ArrowLeft') {
      this.directions[Direction.Left] = false;
    }
    if (event.key === 'ArrowRight') {
      this.directions[Direction.Right] = false;
    }
    if (event.key === ' ' /*space*/) {
      this.speed = this.baseSpeed;
    }
  }

  private moveHero(): void {
    const hero = this.hero.nativeElement as HTMLDivElement;
    let x = 0;
    let y = 0;

    if (this.directions[Direction.Left]) {
      x = this.speed;
    } else if (this.directions[Direction.Right]) {
      x = -this.speed;
    } else if (this.directions[Direction.Up]) {
      y = this.speed;
    } else if (this.directions[Direction.Down]) {
      y = -this.speed;
    }
    // Move the hero freely
    hero.setAttribute('style', `top:${hero.offsetTop - y}px;left:${hero.offsetLeft - x}px`);
  }

  private handleEvents() {
    const timeSplit = this.maxTime / this.eventcountdown;
    const nextTrigger = this.maxTime - timeSplit;
    if (this.countdown < nextTrigger) {
      for (let i = 0; i < this.specialFigures.length; i++) {
        const clone = this.specialFigures.toArray()[i].nativeElement.cloneNode(false);
        this.createFigure(clone);
        this.createFigures(15);
      }
      this.collidables = this.collectCollidables();
      this.eventcountdown -= 1;
    }
  }

  /* ---------------- Collision ---------------- */
  private handleCollision() {
    const hero: HTMLDivElement = this.hero.nativeElement as HTMLDivElement;
    const collidingElement = this.collidables.find(element => this.CollisionCheck(hero.getBoundingClientRect(), element.getBoundingClientRect()));
    if (collidingElement) {
      this.handleCollidingElement(collidingElement);
    }
  }

  private collectCollidables(): Element[] {
    let elements: Element[] = [];
    let elementsDom: HTMLCollectionOf<any>;
    for (const clazz of this.collidingClasses) {
      elementsDom = document.getElementsByClassName(clazz) as HTMLCollectionOf<any>;
      elements = elements.concat(Array.prototype.slice.call(elementsDom));
    }
    return elements;
  }

  private handleCollidingElement(element: Element) {
    if (element.className.includes('figure')) {
      // Points!
      this.score += this.scorePerFigure;
    } else if (element.className.includes('special')) {
      if (element.className.includes('punten')) {
        this.scorePerFigure += 2;
      } else if (element.className.includes('tijd')) {
        this.countdown *= 2;
      } else if (element.className.includes('curse')) {
        this.countdown /= 2;
        this.score += 50;
        this.createFigures(10);
      }
    } else {
      // Death
      this.gameover();
      this.gameState = GAMESTATE.gameover;
    }
    // Always remove and recollect
    this.renderer.removeChild(document.body, element);
    this.collidables = this.collectCollidables();
  }

  private CollisionCheck(hero: DOMRect | any, gameObject: DOMRect | any): boolean {
    return (hero.x + hero.width >= gameObject.x &&
      hero.x <= gameObject.x + gameObject.width &&
      hero.y + hero.height >= gameObject.y &&
      hero.y <= gameObject.y + gameObject.height);
  }

  /* ---------------- Utils ---------------- */
  private random(min, max): number {
    return Math.floor(Math.random() * max) + min;
  }

  private gameover() {
    if (this.scoreField) {
      this.scoreField.setValue(this.score);
    }
    this.clearFigures();
    this.nonFigures = 0;
    this.gameState = GAMESTATE.gameover;
  }

  /* create random figures (hoek, streep, rond)
  * With a random animation (orbitting, crazy, ?), but always rotating
  * as many times as configured in 'maxFigures'
  **/
  private createFigures(amount = this.maxFigures) {
    for (let i = 0; i < amount; i++) {
      const clone = this.figures.toArray()[this.random(0, this.figures.length)].nativeElement.cloneNode(false);
      this.createFigure(clone);
    }
  }

  private createFigure(clone) {
    const animationName = ['crazy', 'orbitting'][this.random(0, 2)];
    clone.setAttribute('style', `
        top:${this.random(50, window.innerHeight - 50)}px;
        left:${this.random(50, window.innerWidth - 50)}px;
        animation: ${animationName} ${this.random(5, 8)}s linear infinite`,
    );
    this.renderer.appendChild(document.body, clone);
  }

  private clearFigures() {
    const figures = Array.from(document.getElementsByClassName('figure'));
    const special = Array.from(document.getElementsByClassName('special'));
    figures.forEach(figure => this.renderer.removeChild(document.body, figure));
    special.forEach(spec => this.renderer.removeChild(document.body, spec));
  }

}
