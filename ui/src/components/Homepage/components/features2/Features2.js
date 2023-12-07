import React, { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Features2 = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <>
      <section className="bg-dark py-16 " style={{ background: '#1c1b22' }}>
        <div data-aos="fade-right" className="max-w-screen-xl mx-auto px-4">
          <h1 className="font-semibold text-white text-xl md:text-4xl text-center leading-normal mb-10">
            Payment process
            <br />
            <p className="font-semibold text-white text-s">(only for paid courses)</p>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 py-6 flex justify-center bg-white bg-opacity-30 text-white rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-globe"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <line x1={2} y1={12} x2={22} y2={12} />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
              </div>
              <h4 className="font-semibold text-lg md:text-2xl text-white text-900 mb-6">
                Transparent
              </h4>
              <p className="font-light text-white text-md md:text-xl mb-6">
                All course purchases can be seen transparently for both course sellers and buyers
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 py-6 flex justify-center bg-white bg-opacity-30 text-white rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-arrow-up-right"
                  >
                    <line x1={7} y1={17} x2={17} y2={7} />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>
              <h4 className="font-semibold text-lg md:text-2xl text-white text-900 mb-6">
                Simple
              </h4>
              <p className="font-light text-white text-md md:text-xl mb-6">
                Payment process is as simple as possible
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 py-6 flex justify-center bg-white bg-opacity-30 text-white rounded-xl">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-lock"
                  >
                    <rect x="3" y="11" width="18" height="12" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>

                </div>
              </div>
              <h4 className="font-semibold text-lg md:text-2xl text-white text-900 mb-6">
                Secure
              </h4>
              <p className="font-light text-white text-md md:text-xl mb-6">
                Payment details are encrypted during transactions and can be accessed only via special authorised tokens
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features2;
