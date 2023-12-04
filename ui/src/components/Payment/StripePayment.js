import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import useLocalStorageState from '../../util/useLocalStorageState';
import { API_URL, STRIPE_KEY } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { httpReqAsync } from '../../services/httpReqAsync';
import Loader from '../common/Loader';

const StripePayment = () => {
  const { courseId } = useParams();
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (jwt && courseId) {
      httpReqAsync(`/api/v1/courses/${courseId}`, 'GET', jwt).then((result) => {
        console.log('I got the course:', result);
        setCourse(result);
      });
    }
  }, [jwt, courseId]);

  const handleToken = async (token) => {
    setLoading(true);
    await axios
      .post(
        `${API_URL}/api/v1/courses/${courseId}/enroll?userId=${currentUser.id}`,
        '',
        {
          headers: {
            'Content-Type': 'application/json',
            token: token.id,
            amount: course.price,
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then(() => {
        alert('Payment Success');
        navigate(
          `/courses/content/${courseId}/${course?.curriculum[0]?.id}/${course?.curriculum[0].courseTopics[0]?.id}`
        );
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Course Checkout
        </h2>
        {loading ? (
          <Loader />
        ) : (
          <>
            {course && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {course.courseName}
                </h3>
                <p className="text-gray-600">{course.courseShortDescription}</p>
                <div className="flex justify-between items-center my-4">
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="text-gray-700">{course.author.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-gray-700">${course.price || 'Free'}</p>
                  </div>
                </div>
                <StripeCheckout
                  name={course.courseName + ' - ' + course.author.username}
                  stripeKey={STRIPE_KEY}
                  token={handleToken}
                  amount={course.price * 100}
                  label="Pay Now"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StripePayment;
