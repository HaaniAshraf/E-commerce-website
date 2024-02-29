function showCashOnDeliveryForm() {
    var modalOverlay = document.getElementById('modalOverlay');
    var cashOnDeliveryModal = document.getElementById('cashOnDeliveryModal');
    modalOverlay.style.display = 'block';
    cashOnDeliveryModal.style.display = 'block';
}
function hideCashOnDeliveryForm() {
    var modalOverlay = document.getElementById('modalOverlay');
    var cashOnDeliveryModal = document.getElementById('cashOnDeliveryModal');
    modalOverlay.style.display = 'none';
    cashOnDeliveryModal.style.display = 'none';
}


function showUpiForm() {
    var upiModalOverlay = document.getElementById('upiModalOverlay');
    var upiPaymentModal = document.getElementById('upiPaymentModal');
    upiModalOverlay.style.display = 'block';
    upiPaymentModal.style.display = 'block';
}
function hideUpiForm() {
    var upiModalOverlay = document.getElementById('upiModalOverlay');
    var upiPaymentModal = document.getElementById('upiPaymentModal');
    upiModalOverlay.style.display = 'none';
    upiPaymentModal.style.display = 'none';
}



// razorpay

document.getElementById('payButton').addEventListener('click', async (event) => {
    const selectedAddressId = document.getElementById('addressDropdown').value;
    event.preventDefault();
    //Adding event.preventDefault(); at the beginning of your click event handler will prevent the default form submission, and only your JavaScript code will handle the form submission.
    try{

    }catch(error){
        console.error('Error initiating Razorpay payment:', error);
        alert('Error initiating payment. Please try again.');
    }
    const response = await fetch('/createRazorpayOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedAddress: selectedAddressId }),
    });
  
    const responseData = await response.json();
    const razorpayOrder = responseData.razorpayOrder;
  
    const options = {
        key: 'rzp_test_SR65KtvtbFdCn3',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Your Company Name',
        description: 'Test Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {

            const orderPlacementResponse = await fetch('/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedAddress: selectedAddressId,
                }),
            });

            const orderPlacementData = await orderPlacementResponse.json();

            if (orderPlacementData.success) {
                window.location.href = `/orderPlaced?orderId=${orderPlacementData.orderId}`;
            } else {
                alert('Order placement failed. Please try again.');
            }

         },
        };

    const paymentObject = new Razorpay(options);
    paymentObject.open();

  });
  