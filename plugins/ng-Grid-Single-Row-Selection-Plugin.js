function ngGridSingleSelectionPlugin() {
    var self = this;
    self.lastSelectedRow = null;
    self.selectedRowItems = [];
    self.allRowItems = [];
    self.isAllRowSelected = false;
    self.grid = null;
    self.scope=null;
    self.init = function (scope, grid, services) {
        self.services = services;
        self.grid = grid;
        self.scope=scope;
        self.initNeddedProprties();
        // mousedown event on row selection
        grid.$viewport.on('mousedown', self.onRowMouseDown);
        // mousedown event on checkbox header selection
        grid.$headerContainer.on('mousedown', self.onHeaderMouseDown);
    };
    //init properties 
    self.initNeddedProprties = function () {
        self.grid.config.multiSelect = true;
        self.grid.config.showSelectionCheckbox = true;
        self.grid.config.selectWithCheckboxOnly = true;
    }
    self.onRowMouseDown = function (event) { 
        // Get the closest row element from where we clicked.
        var targetRow = $(event.target).closest('.ngRow');
        // Get the scope from the row element
        var rowScope = angular.element(targetRow).scope();
        if (rowScope) {
            var row = rowScope.row;
            if (event.target.type !== 'checkbox') {
                // if  select all rows checkbox was pressed
                if (self.isAllRowSelected) {
                    self.selectedRowItems = self.grid.rowCache;
                }
                //set to false selected rows with checkbox
                angular.forEach(self.selectedRowItems,function (rowItem) {
                    rowItem.selectionProvider.setSelection(rowItem, false);
                });
                self.selectedRowItems = [];
                //set to false last selected row
                if (self.lastSelectedRow) {
                    self.lastSelectedRow.selectionProvider.setSelection(self.lastSelectedRow, false);
                }
                if (!row.selected) {
                    row.selectionProvider.setSelection(row, true);
                    self.lastSelectedRow = row;
                      self.scope.$emit('ngGridEventRowSeleted',row);
                }
            }
            else {
                if (!row.selected) {
                    self.selectedRowItems.push(row);
                     self.scope.$emit('ngGridEventRowSeleted',row);
                     
                }
            }
        }
    };
    // mousedown event for checkbox header selection
    self.onHeaderMouseDown = function(event) {
        if (event.target.type === 'checkbox') {
            if (!event.target.checked) {
                self.isAllRowSelected = true;
            } else {
                self.isAllRowSelected = false;
            }
        }
    }

}
