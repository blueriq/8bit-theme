import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { PresentationStyles } from '@blueriq/core';
import { BqPresentationStyles } from '../../../modules/BqPresentationStyles';

/**
 * This directive can be added to <i> that will pick the correct icon based on the container's presentation styles.
 */
@Directive({
  selector: '[bqIcon]',
})
export class BqIconDirective {

  private _class: string;

  constructor(private elementRef: ElementRef) {
  }

  @HostBinding('attr.class')
  get class(): string {
    return this._class;
  }

  @Input()
  set bqIcon(presentationStyles: PresentationStyles) {
    const firstFontAwesomeIcon = BqIconDirective.getFirstFontAwesomeIcon(presentationStyles);
    if (firstFontAwesomeIcon) {
      let iconName = firstFontAwesomeIcon.replace(new RegExp('^' + BqPresentationStyles.ICON_FA_PREFIX), '');
      iconName = iconName.replace(new RegExp('_', 'g'), '-');
      iconName = this.getMappedFaIcon(iconName);
      this._class = 'fa fa-' + iconName;
    }
  }

  static hasIcon(presentationStyles: PresentationStyles): boolean {
    return BqIconDirective.getFirstFontAwesomeIcon(presentationStyles) ? true : false;
  }

  static getFirstFontAwesomeIcon(presentationStyles: PresentationStyles): string | undefined {
    return presentationStyles.get(style => style.startsWith(BqPresentationStyles.ICON_FA_PREFIX));
  }

  /**
   * In the knockout/bootstrap theme these font-awesome icons are mapped.
   * These should become deprecated and use the actual name used in the font-awesome library
   *
   * returns the mapped icon and if no icon found the actual name is returned
   * */
  private getMappedFaIcon(name: string): string {
    const mappedIcons = {
      'exclamation_sign': 'exclamation-circle',
      'info_sign': 'info-circle',
      'remove': 'times',
      'remove_circle': 'times circle',
      'time': 'clock-o',
      'warning_sign': 'exclamation-triangle',
      'signout': 'sign-out',
      'file': 'file-o',
      'file_pdf': 'file-pdf-o',
      'file_image': 'file-image-o',
    };
    const mappedName = mappedIcons[name];
    return mappedName ? mappedName : name;
  }

}
