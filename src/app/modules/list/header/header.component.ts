import { Component, Input } from '@angular/core';
import { TableColumn } from '@blueriq/angular/lists';

@Component({
  selector: 'bq-header-column',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class TableHeaderColumnComponent {

  @Input()
  column: TableColumn;

  getIconByDirection(): string {
    switch (this.column.ordering) {
      case 'unavailable':
        return '';
      case 'descending':
        return 'DESC';
      case 'ascending':
        return 'ASC';
      case 'none':
        return 'SORT';
    }
  }
}
