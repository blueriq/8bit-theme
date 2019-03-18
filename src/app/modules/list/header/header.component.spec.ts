import { TableColumn } from '@blueriq/angular/lists';
import { TableHeaderColumnComponent } from './header.component';

describe('TableHeaderColumnComponent', () => {

  let headerComponent: TableHeaderColumnComponent;

  describe('sorting', () => {

    beforeEach(() => {
      headerComponent = new TableHeaderColumnComponent();
    });

    it('should display no icon if ordering is unavailable', () => {
      headerComponent.column = { ordering: 'unavailable' } as TableColumn;
      const currentIcon = headerComponent.getIconByDirection();
      expect(currentIcon).toBe('');
    });

    it('should choose a downward array even when not ordering, as that will be shown on hover', () => {
      headerComponent.column = { ordering: 'none' } as TableColumn;
      const currentIcon = headerComponent.getIconByDirection();
      expect(currentIcon).toBe('SORT');
    });

    it('should display a icon if direction is descending', () => {
      headerComponent.column = { ordering: 'descending' } as TableColumn;
      const currentIcon = headerComponent.getIconByDirection();
      expect(currentIcon).toBe('DESC');
    });

    it('should display a icon if direction is ascending', () => {
      headerComponent.column = { ordering: 'ascending' } as TableColumn;
      const currentIcon = headerComponent.getIconByDirection();
      expect(currentIcon).toBe('ASC');
    });

  });

});
