angular.module('toggle-switch', ['ng']).directive('toggleSwitch', ['$compile, $translate', function($compile, $translate) {
	return {
		restrict: 'EA',
		replace: true,
		require:'ngModel',
		scope: {
			isDisabled: '=',
			onLabel: '@',
			offLabel: '@',
			knobLabel: '@',
			html: '=',
			onChange: '&'
		},
		template:
					'<div class="ats-switch" ng-click="toggle()" ng-keypress="onKeyPress($event)" ng-class="{ \'disabled\': isDisabled }" role="switch" aria-checked="{{!!model}}">' +
						'<div class="switch-animate" ng-class="{\'switch-off\': !model, \'switch-on\': model}">' +
							'<span class="switch-left"></span>' +
							'<span class="knob"></span>' +
							'<span class="switch-right"></span>' +
						'</div>' +
					'</div>',
		compile: function(element, attrs) {
			//added support for $translate
			if (angular.isUndefined(attrs.onLabel)) {
				attrs.onLabel = 'On';
			}else{
				attrs.onLabel = $translate.instant(attrs.onLabel);
			}
			if (angular.isUndefined(attrs.offLabel)) {
				attrs.offLabel = 'Off';
			}else{
				attrs.offLabel = $translate.instant(attrs.offLabel);
			}
			if (angular.isUndefined(attrs.knobLabel)) {
				attrs.knobLabel = '\u00a0';
			}else{
				attrs.knobLabel = $translate.instant(attrs.knobLabel);
			}
			if (angular.isUndefined(attrs.isDisabled)) {
				attrs.isDisabled = false;
			}
			if (angular.isUndefined(attrs.html)) {
				attrs.html = false;
			}

			return function postLink(scope, iElement, iAttrs, ngModel) {
				iElement.attr('tabindex', attrs.tabindex);

				scope.toggle = function toggle() {
					if (!scope.isDisabled) {
						scope.model = !scope.model;
						ngModel.$setViewValue(scope.model);
					}
					scope.onChange();
				};

				var spaceCharCode = 32;
				scope.onKeyPress = function onKeyPress($event) {
					if ($event.charCode === spaceCharCode && !$event.altKey && !$event.ctrlKey && !$event.metaKey) {
						scope.toggle();
					}
				};

				ngModel.$formatters.push(function(modelValue) {
					return modelValue;
				});

				ngModel.$parsers.push(function(viewValue) {
					return viewValue;
				});

				ngModel.$viewChangeListeners.push(function() {
					scope.$eval(attrs.ngChange);
				});

				ngModel.$render = function() {
					scope.model = ngModel.$viewValue;
				};

				var bindSpan = function(span, html) {
					span = angular.element(span);
					var bindAttributeName = (html === true) ? 'ng-bind-html' : 'ng-bind';

					// remove old ng-bind attributes
					span.removeAttr('ng-bind-html');
					span.removeAttr('ng-bind');

					if (angular.element(span).hasClass("switch-left"))
						span.attr(bindAttributeName, 'onLabel');
					if (span.hasClass("knob"))
						span.attr(bindAttributeName, 'knobLabel');
					if (span.hasClass("switch-right"))
						span.attr(bindAttributeName, 'offLabel');

					$compile(span)(scope, function(cloned, scope) {
						span.replaceWith(cloned);
					});
				};

				// add ng-bind attribute to each span element.
				// NOTE: you need angular-sanitize to use ng-bind-html
				var bindSwitch = function(iElement, html) {
					angular.forEach(iElement[0].children[0].children, function(span, index) {
						bindSpan(span, html);
					});
				};

				scope.$watch('html', function(newValue) {
					bindSwitch(iElement, newValue);
				});
			};
		}
	};
}]);
