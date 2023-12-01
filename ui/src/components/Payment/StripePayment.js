import React from "react";
import Stripe from "react-stripe-checkout";
import axios from "axios";
import useLocalStorageState from "../../util/useLocalStorageState";

const StripePayment = () => {
  const [jwt] = useLocalStorageState("", "jwt");

    async function handleToken(token) {
        console.log(token);
        await axios.post("http://localhost:8080/api/v1/payment/charge", "", {
            headers: {
                token: token.id,
                amount: 500,
                Authorization: `Bearer ${jwt}`
            },
        }).then(() => {
            alert("Payment Success");
        }).catch((error) => {
            alert(error);
        });
    }
    return (
        <div className="App">
            <Stripe
                stripeKey="pk_test_51OIDEwIuz35fCUd4lNc7DtYv1B116WgS8716JFDM17FWJQyk2yFi1753yJBDvCJCP7KrWxiYzfEfpKByo2dhJh2S00Qyvzdb0X"
                token={handleToken}
            />
        </div>
    );
}

export default StripePayment;