import React, { useEffect, useState } from 'react';
import TabbedPage from '../common/TabbedPage';
import { Link, useNavigate } from 'react-router-dom';
import { httpReqAsync } from '../../services/httpReqAsync';
import useLocalStorageState from '../../util/useLocalStorageState';
import CourseCard from '../Course/components/MyCourseCard';
import Loader from '../common/Loader';

const Transactions = () => {
  //TODO: implement finished courses filter
  const finishedCourses = [];
  const navigate = useNavigate();
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [buyerTransactions, setbuyerTransactions] = useState(null);
  const [sellerTransactions, setsellerTransactions] = useState(null);
  useEffect(() => {
    //get taken courses
    httpReqAsync(
      `/api/v1/purchase-records/buyer/${currentUser.id}`,
      'GET',
      jwt
    ).then((result) => {
      setbuyerTransactions(result);
    });
    //get saved courses
    httpReqAsync(
      `/api/v1/purchase-records/seller/${currentUser.id}`,
      'GET',
      jwt
    ).then((result) => {
      setsellerTransactions(result);
    });
  }, [jwt, currentUser]);

  const tabs = [
    {
      name: 'buyerTransactions',
      label: 'My Purchases',
      content: buyerTransactions ? (
        buyerTransactions.length > 0 ? (
          <div className=" py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              My Purchases
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Transcation ID
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {buyerTransactions.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        #{purchase.id}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {purchase.course.courseName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        ${purchase.amount}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <Link
                          to={`/courses/${purchase.course.id}/description`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Course
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>{"You don't have earned yet :("}</div>
        )
      ) : (
        <div>
          <Loader />
        </div>
      ),
    },

    {
      name: 'sellerTransactions',
      label: 'You earned',
      content: sellerTransactions ? (
        sellerTransactions.length > 0 ? (
          <div className=" py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your earnings from your courses
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellerTransactions.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        #{purchase.id}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {purchase.user.username}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {purchase.course.courseName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        ${purchase.amount}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <Link
                          to={`/courses/${purchase.course.id}/description`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Course
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>{"You don't have earned yet :("}</div>
        )
      ) : (
        <div>
          <Loader />
        </div>
      ),
    },
  ];
  return (
    <div className="container">
      <div className="text-2xl font-semibold">Transactions </div>
      <TabbedPage tabs={tabs} />
    </div>
  );
};

export default Transactions;
