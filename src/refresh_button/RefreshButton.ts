{

    interface IRefreshButtonBindings {
        [key: string]: any;

        text: any;
        visible: any;
        onRefresh: any
    }

    const RefreshButtonBindings: IRefreshButtonBindings = {
        text: '<pipText',
        visible: '<pipVisible',
        onRefresh: '&?pipRefresh'
    }

    class RefreshButtonChanges implements ng.IOnChangesObject, IRefreshButtonBindings {
        [key: string]: ng.IChangesObject<any>;
        // Not one way bindings
        onRefresh: ng.IChangesObject<({
            $event: any
        }) => ng.IPromise<any>>;
        // One way bindings
        text: ng.IChangesObject<string>;
        visible: ng.IChangesObject<boolean>;
    }

    class RefreshButtonController implements IRefreshButtonBindings {

        private _textElement: any;
        private _buttonElement: any;
        private _width: number;

        public text: string;
        public visible: boolean;
        public onRefresh: (param: {
            $event: ng.IAngularEvent
        }) => ng.IPromise<any>;

        constructor(
            private $scope: ng.IScope,
            private $element: any,
            private $attrs: ng.IAttributes
        ) { "ngInject"; }

        public $postLink() {
            this._buttonElement = this.$element.children('.md-button');
            this._textElement = this._buttonElement.children('.pip-refresh-text');

            if (this.visible) {
                this.show();
            } else {
                this.hide();
            }
        }

        public $onChanges(changes: RefreshButtonChanges) {
            if (changes.visible.currentValue === true) {
                this.text = changes.text.currentValue;
                this.show();
            } else {
                this.hide();
            }
        }

        public onClick($event) {
            if (this.onRefresh) {
                this.onRefresh({
                    $event: $event
                });
            }
        }

        private show() {
            if (this._textElement === undefined || this._buttonElement === undefined) {
                return;
            }
            // Set new text
            this._textElement.text(this.text);
            // Show button
            this._buttonElement.show();
            // Adjust position
            const width = this._buttonElement.width();
            this._buttonElement.css('margin-left', '-' + width / 2 + 'px');
        }

        private hide() {
            if (this._textElement === undefined || this._buttonElement === undefined) {
                return;
            }
            this._buttonElement.hide();
        }
    }


    const RefreshButtonComponent: ng.IComponentOptions = {
        bindings: RefreshButtonBindings,
        controller: RefreshButtonController,
        template: '<md-button class="pip-refresh-button" tabindex="-1" ng-click="$ctrl.onClick($event)" aria-label="REFRESH">' +
            '<md-icon md-svg-icon="icons:refresh"></md-icon>' +
            '<span class="pip-refresh-text"></span>' +
            '</md-button>'
    };

    angular
        .module('pipRefreshButton', ['ngMaterial'])
        .component('pipRefreshButton', RefreshButtonComponent);

}