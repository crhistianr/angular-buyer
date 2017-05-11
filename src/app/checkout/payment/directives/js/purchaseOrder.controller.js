angular.module('orderCloud')
	.controller('PaymentPurchaseOrderCtrl', PaymentPurchaseOrderController)
;

function PaymentPurchaseOrderController($scope, $rootScope, $exceptionHandler, toastr, OrderCloudSDK, ocCheckoutPaymentService) {
	if (!$scope.payment) {
		OrderCloudSDK.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					$scope.payment.Items[0];
				} else {
					var payment = {
						Type: 'PurchaseOrder',
						DateCreated: new Date().toISOString(),
						CreditCardID: null,
						SpendingAccountID: null,
						Description: null,
						Amount: $scope.order.Total,
						xp: {},
						Editing: true
					};
					$scope.payment = payment;
				}
			});
	} else if (!($scope.payment.Type == 'PurchaseOrder' && $scope.payment.CreditCardID == null && $scope.payment.SpendingAccountID == null)) {
		$scope.payment.Type = 'PurchaseOrder';
		$scope.payment.CreditCardID = null;
		$scope.payment.SpendingAccountID = null;
	} else {
		$scope.payment.CreditCardID = null;
		$scope.payment.SpendingAccountID = null;
	}

	$scope.$watch('payment', function(n, o) {
		if (n.Editing) {
			$scope.OCPaymentPurchaseOrder.$setValidity('PurchaseOrderNotSaved', false);
		} else {
			$scope.OCPaymentPurchaseOrder.$setValidity('PurchaseOrderNotSaved', true);
		}
	}, true);

	$scope.savePayment = function () {
		ocCheckoutPaymentService.Save($scope.payment, $scope.order)
			.then(function(payment) {
				payment.Editing = false;
				$scope.payment = payment;
				$scope.OCPaymentPurchaseOrder.$setValidity('PurchaseOrderNotSaved', true);
			});
	};
}