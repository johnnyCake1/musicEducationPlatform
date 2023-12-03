import React from "react";
import Stripe from "react-stripe-checkout";
import axios from "axios";
import useLocalStorageState from "../../util/useLocalStorageState";
import { API_URL, STRIPE_KEY } from "../../constants";

const StripePayment = ({ courseId }) => {
    const [jwt] = useLocalStorageState("", "jwt");
    const [currentUser] = useLocalStorageState(null, "currentUser");
    async function handleToken(token) {
        await axios.post(`${API_URL}/api/v1/courses/${courseId}/enroll?userId=${currentUser.id}`,
            "", {
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
        <div className="stripe-payment-div">
            <Stripe
                stripeKey={STRIPE_KEY}
                token={handleToken}
            />
        </div>
    );
}

export default StripePayment;