require('dotenv').config();
const axios = require('axios');


const processPayment = async ({ amount, currency, paymentMethod }) => {
 
 

  // Simulated success/failure
  const isSuccess = Math.random() > 0.2;

  if (isSuccess) {
      const fun =async () => {
       
       try {
          
             await axios.post(
               `${process.env.WEBHOOK_URL}`,
               { providerPaymentId: '12345', status: "SUCCESS"  }
             );
           
         } catch (err) {
           console.error("Payment gateway webhook failed:", err.message);
         
         }

        };
         // Simulated gateway delay
        setTimeout(fun, 5000);
  }else{
       
     const fun = async () => {
       try {
            
             await axios.post(
               `${process.env.WEBHOOK_URL}`,
               { providerPaymentId: '12345', status: "FAILED", failureReason: "Insufficient funds" }
             );
           
         } catch (err) {
           console.error("Payment gateway webhook failed:", err.message);
         
         }
        };
         // Simulated gateway delay
        setTimeout(fun, 5000);
  }

  return {
    success: true,
    provider: "MOCK_GATEWAY",
    providerPaymentId: '12345'
  };
};

module.exports = {
  processPayment
};
